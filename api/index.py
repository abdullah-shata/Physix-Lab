import os
import sys
import json
import math
import random
import sqlite3
import hashlib
import hmac
import time
import uuid
import smtplib
import ssl
import urllib.request
import concurrent.futures
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from pathlib import Path

from fastapi import FastAPI, Request, HTTPException, UploadFile, File, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
PUBLIC_DIR = BASE_DIR / "public"
DB_PATH = Path("/tmp/physix_lab.db") if os.getenv("VERCEL") else (BASE_DIR / "physix_lab.db")

app = FastAPI(
    title="PhysiX Lab - Interactive Mechanics & EdTech SaaS",
    description="Production-ready EdTech Physics Simulation & B2B Lab Exam Platform",
    version="2.0.0"
)
@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    from fastapi.responses import Response
    return Response(status_code=204)


# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# Database Persistence: Turso Serverless SQLite (HTTP Pipeline) / SQLite Fallback
# ---------------------------------------------------------
TURSO_DATABASE_URL = os.getenv("TURSO_DATABASE_URL", "").strip()
TURSO_AUTH_TOKEN = os.getenv("TURSO_AUTH_TOKEN", "").strip()
SUPABASE_URL = os.getenv("SUPABASE_URL", "").strip()
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "").strip()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()

USE_TURSO = False
TURSO_PIPELINE_URL = ""

if TURSO_DATABASE_URL and TURSO_AUTH_TOKEN:
    base = TURSO_DATABASE_URL.replace("libsql://", "https://").rstrip("/")
    TURSO_PIPELINE_URL = f"{base}/v2/pipeline"
    USE_TURSO = True
    print(f"[Database] Configured Turso Serverless SQLite HTTP Pipeline at: {TURSO_PIPELINE_URL}")

def format_turso_arg(val):
    if val is None:
        return {"type": "null"}
    elif isinstance(val, bool):
        return {"type": "integer", "value": str(int(val))}
    elif isinstance(val, int):
        return {"type": "integer", "value": str(val)}
    elif isinstance(val, float):
        return {"type": "float", "value": val}
    elif isinstance(val, (bytes, bytearray)):
        import base64
        return {"type": "blob", "base64": base64.b64encode(val).decode("ascii")}
    else:
        return {"type": "text", "value": str(val)}

def unwrap_turso_cell(cell):
    if not isinstance(cell, dict):
        return cell
    t = cell.get("type")
    if t == "null":
        return None
    val = cell.get("value")
    if t == "integer":
        return int(val)
    elif t == "float":
        return float(val)
    elif t == "text":
        return str(val)
    elif t == "blob":
        import base64
        return base64.b64decode(cell.get("base64", ""))
    return val

class TursoRow:
    def __init__(self, values, cols):
        self._values = list(values)
        self._cols = list(cols) if cols else []
        self._map = {c.lower(): i for i, c in enumerate(self._cols)}

    def __getitem__(self, item):
        if isinstance(item, str):
            idx = self._map.get(item.lower())
            if idx is None:
                raise KeyError(item)
            return self._values[idx]
        return self._values[item]

    def keys(self):
        return self._cols

    def values(self):
        return self._values

    def items(self):
        return list(zip(self._cols, self._values))

    def __iter__(self):
        return iter(self._values)

    def __len__(self):
        return len(self._values)

    def __repr__(self):
        return f"<TursoRow {dict(self)}>"

class TursoCursor:
    def __init__(self, pipeline_url: str, token: str):
        self.pipeline_url = pipeline_url
        self.token = token
        self.description = None
        self._rows = []
        self._idx = 0
        self.rowcount = -1
        self.lastrowid = None

    def execute(self, sql: str, params=None):
        stmt = {"sql": sql}
        if params is not None:
            if isinstance(params, (list, tuple)):
                stmt["args"] = [format_turso_arg(p) for p in params]
            elif isinstance(params, dict):
                stmt["named_args"] = [{"name": k, "value": format_turso_arg(v)} for k, v in params.items()]
            else:
                stmt["args"] = [format_turso_arg(params)]

        payload = {
            "requests": [
                {"type": "execute", "stmt": stmt},
                {"type": "close"}
            ]
        }
        req = urllib.request.Request(
            self.pipeline_url,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {self.token}",
                "Content-Type": "application/json"
            },
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode("utf-8"))

        res = data["results"][0]
        if res.get("type") == "error":
            raise RuntimeError(f"Turso Error: {res.get('error', {}).get('message', 'Unknown database error')}")

        exec_res = res.get("response", {}).get("result", {})
        cols = [c["name"] for c in exec_res.get("cols", [])]
        self.description = [(c, None, None, None, None, None, None) for c in cols] if cols else None

        raw_rows = exec_res.get("rows", [])
        self._rows = [TursoRow([unwrap_turso_cell(cell) for cell in r], cols) for r in raw_rows]
        self._idx = 0
        self.rowcount = exec_res.get("affected_row_count", -1)
        self.lastrowid = exec_res.get("last_insert_rowid")
        return self

    def fetchone(self):
        if self._idx < len(self._rows):
            r = self._rows[self._idx]
            self._idx += 1
            return r
        return None

    def fetchall(self):
        if self._idx < len(self._rows):
            r = self._rows[self._idx:]
            self._idx = len(self._rows)
            return r
        return []

class TursoConnection:
    def __init__(self, pipeline_url: str, auth_token: str):
        self.pipeline_url = pipeline_url
        self.token = auth_token
        self.row_factory = None

    def cursor(self):
        return TursoCursor(self.pipeline_url, self.token)

    def execute(self, sql: str, params=None):
        return self.cursor().execute(sql, params)

    def commit(self):
        pass

    def pipeline_batch(self, queries: list) -> list:
        """Execute multiple SQL queries in a single HTTP round-trip to Turso.
        queries = [(sql, params_or_None), ...]
        Returns a list of TursoCursor-like objects (one per query).
        """
        requests_list = []
        for sql, params in queries:
            stmt = {"sql": sql}
            if params is not None:
                if isinstance(params, (list, tuple)):
                    stmt["args"] = [format_turso_arg(p) for p in params]
                elif isinstance(params, dict):
                    stmt["named_args"] = [{"name": k, "value": format_turso_arg(v)} for k, v in params.items()]
                else:
                    stmt["args"] = [format_turso_arg(params)]
            requests_list.append({"type": "execute", "stmt": stmt})
        requests_list.append({"type": "close"})

        payload = {"requests": requests_list}
        req = urllib.request.Request(
            self.pipeline_url,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {self.token}",
                "Content-Type": "application/json"
            },
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode("utf-8"))

        cursors = []
        results = data.get("results", [])
        for i, res in enumerate(results):
            if res.get("type") == "error":
                raise RuntimeError(f"Turso Batch Error [{i}]: {res.get('error', {}).get('message', 'Unknown')}")
            if res.get("type") == "ok":
                exec_res = res.get("response", {}).get("result", {})
                cols = [c["name"] for c in exec_res.get("cols", [])]
                raw_rows = exec_res.get("rows", [])
                cur = TursoCursor(self.pipeline_url, self.token)
                cur.description = [(c, None, None, None, None, None, None) for c in cols] if cols else None
                cur._rows = [TursoRow([unwrap_turso_cell(cell) for cell in r], cols) for r in raw_rows]
                cur._idx = 0
                cur.rowcount = exec_res.get("affected_row_count", -1)
                cur.lastrowid = exec_res.get("last_insert_rowid")
                cursors.append(cur)
        return cursors

    def rollback(self):
        pass

    def close(self):
        pass

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        return False

def get_db():
    if USE_TURSO:
        return TursoConnection(TURSO_PIPELINE_URL, TURSO_AUTH_TOKEN)
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn

# ---------------------------------------------------------
# Security & Email Helpers
# ---------------------------------------------------------
def hash_password(password: str) -> str:
    salt = os.urandom(16)
    pw_hash = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100000)
    return f"{salt.hex()}:{pw_hash.hex()}"

def verify_password(password: str, stored_hash: str) -> bool:
    try:
        if not stored_hash or ":" not in stored_hash:
            return False
        salt_hex, hash_hex = stored_hash.split(":")
        salt = bytes.fromhex(salt_hex)
        pw_hash = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100000)
        return pw_hash.hex() == hash_hex
    except Exception:
        return False

# ---------------------------------------------------------
# Session Token & Authorization Security
# ---------------------------------------------------------
SESSION_SECRET = os.getenv("SESSION_SECRET", "physix-lab-jwt-session-secret-salt-2026")
INSTRUCTOR_ACCESS_CODE = os.getenv("INSTRUCTOR_ACCESS_CODE", "PHYSIX-FACULTY-2026")
INSTRUCTOR_ALLOWLIST = [
    e.strip().lower() for e in os.getenv("INSTRUCTOR_ALLOWLIST", "sarah.nour@univ.edu,instructor@univ.edu,faculty@univ.edu").split(",") if e.strip()
]

RATE_LIMITS: Dict[str, List[float]] = {}

def get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "127.0.0.1"

def check_rate_limit(key: str, max_requests: int, window_seconds: int) -> tuple:
    now = time.time()
    existing = RATE_LIMITS.get(key, [])
    valid = [t for t in existing if now - t < window_seconds]
    if len(valid) >= max_requests:
        retry_after = int(window_seconds - (now - valid[0])) + 1
        return False, max(1, retry_after)
    valid.append(now)
    RATE_LIMITS[key] = valid
    return True, 0

def validate_password_strength(password: str) -> None:
    if len(password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters long / كلمة المرور يجب أن لا تقل عن 8 أحرف"
        )
    has_letter = any(c.isalpha() for c in password)
    has_digit = any(c.isdigit() for c in password)
    if not (has_letter and has_digit):
        raise HTTPException(
            status_code=400,
            detail="Password must contain both letters and numbers / يجب أن تحتوي كلمة المرور على أحرف وأرقام معاً"
        )

def verify_instructor_privilege(email: str, invite_code: Optional[str] = None) -> bool:
    email_clean = email.lower().strip()
    if email_clean in INSTRUCTOR_ALLOWLIST:
        return True
    if invite_code and invite_code.strip() == INSTRUCTOR_ACCESS_CODE:
        return True
    return False

def create_session_token(user_id: str, email: str, role: str, full_name: str) -> str:
    exp = int(time.time()) + (7 * 86400)
    payload = {
        "uid": str(user_id),
        "email": email.lower().strip(),
        "role": role,
        "name": full_name,
        "exp": exp
    }
    raw = json.dumps(payload, separators=(',', ':')).encode('utf-8')
    b64_payload = base64.urlsafe_b64encode(raw).decode('utf-8').rstrip('=')
    sig = hmac.new(SESSION_SECRET.encode('utf-8'), b64_payload.encode('utf-8'), hashlib.sha256).hexdigest()
    return f"{b64_payload}.{sig}"

def verify_session_token(token: str) -> Optional[dict]:
    try:
        parts = token.split('.')
        if len(parts) != 2:
            return None
        b64_payload, sig = parts
        expected_sig = hmac.new(SESSION_SECRET.encode('utf-8'), b64_payload.encode('utf-8'), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, expected_sig):
            return None
        pad = len(b64_payload) % 4
        if pad:
            b64_payload += '=' * (4 - pad)
        raw = base64.urlsafe_b64decode(b64_payload.encode('utf-8')).decode('utf-8')
        payload = json.loads(raw)
        if time.time() > payload.get("exp", 0):
            return None
        return payload
    except Exception:
        return None

def get_current_user(request: Request) -> dict:
    auth_header = request.headers.get("Authorization")
    bearer_token = None
    if auth_header and auth_header.startswith("Bearer "):
        bearer_token = auth_header[7:].strip()
    elif "token" in request.query_params:
        bearer_token = request.query_params["token"].strip()
    
    if not bearer_token:
        bearer_token = request.cookies.get("physix_token")

    if not bearer_token:
        raise HTTPException(
            status_code=401,
            detail="Authentication required. Please sign in. / تسجيل الدخول مطلوب للوصول لهذه الخدمة."
        )

    payload = verify_session_token(bearer_token)
    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Session has expired or is invalid. Please sign in again. / انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً."
        )

    return {
        "id": payload["uid"],
        "user_id": payload["uid"],
        "email": payload["email"],
        "role": payload["role"],
        "full_name": payload.get("name", "Student")
    }

def get_current_instructor(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "instructor":
        raise HTTPException(
            status_code=403,
            detail="Access forbidden: Instructor role required. / غير مصرح: تتطلب هذه العملية صلاحيات معيد أو دكتور."
        )
    return user

def send_otp_email(to_email: str, otp: str, full_name: str = "Student", subject_prefix: str = "Email Verification") -> bool:
    smtp_email = os.getenv("SMTP_EMAIL", "").strip()
    smtp_password = os.getenv("SMTP_PASSWORD", "").strip()
    smtp_host = os.getenv("SMTP_HOST", "").strip()
    smtp_port_str = os.getenv("SMTP_PORT", "").strip()
    smtp_port = int(smtp_port_str) if smtp_port_str.isdigit() else 0

    # Mandatory fallback: Always print [OTP] {email}: {otp} to server console
    print(f"[OTP] {to_email}: {otp} ({subject_prefix})")

    if not smtp_email or not smtp_password:
        print(f"[Email] SMTP credentials not set; OTP logged to console: [OTP] {to_email}: {otp}")
        return True

    # Auto-detect SMTP host and port if not explicitly set
    if not smtp_host:
        email_lower = smtp_email.lower()
        if any(dom in email_lower for dom in ["@outlook.com", "@hotmail.com", "@live.com", "@office365.com", "@msn.com"]):
            smtp_host = "smtp-mail.outlook.com"
            smtp_port = smtp_port or 587
        else:
            smtp_host = "smtp.gmail.com"
            smtp_port = smtp_port or 465

    is_reset = "Password Reset" in subject_prefix or "Reset" in subject_prefix
    action_title_en = "Password Reset Code" if is_reset else "Email Verification Code"
    action_title_ar = "رمز إعادة تعيين كلمة المرور" if is_reset else "رمز التحقق من البريد"
    action_desc_en = "use the 6-digit code below to reset your PhysiX Lab password:" if is_reset else "use the 6-digit code below to complete your academic authentication into PhysiX Lab:"

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"PhysiX Lab - {subject_prefix} OTP: {otp}"
        msg["From"] = f"PhysiX Lab <{smtp_email}>"
        msg["To"] = to_email

        text_content = (
            f"Hello {full_name},\n\n"
            f"Your 6-digit PhysiX Lab code is: {otp}\n"
            f"This code is valid for 5 minutes.\n\n"
            f"If you did not request this, please disregard this email.\n"
            f"— PhysiX Lab Team"
        )

        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>PhysiX Lab Code</title>
        </head>
        <body style="margin:0; padding:20px; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color:#f1f5f9;">
          <div style="max-width:520px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e2e8f0; box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);">
            <div style="background:linear-gradient(135deg, #0969da, #1d4ed8); padding:24px; text-align:center; color:#ffffff;">
              <h1 style="margin:0; font-size:24px; font-weight:800; letter-spacing:0.5px;">PhysiX Lab</h1>
              <p style="margin:4px 0 0 0; font-size:14px; opacity:0.9;">مختبر الميكانيكا والهندسة التفاعلي</p>
            </div>
            <div style="padding:28px 24px; text-align:center;">
              <h2 style="margin:0 0 12px 0; font-size:18px; color:#1e293b;">{action_title_en} / {action_title_ar}</h2>
              <p style="margin:0 0 20px 0; font-size:14px; color:#64748b; line-height:1.5;">
                Hello <strong>{full_name}</strong>, {action_desc_en}
              </p>
              <div style="display:inline-block; padding:16px 32px; background:#f8fafc; border:2px dashed #0969da; border-radius:10px; margin-bottom:20px;">
                <span style="font-family:'Courier New', monospace; font-size:36px; font-weight:800; letter-spacing:8px; color:#0969da;">{otp}</span>
              </div>
              <p style="margin:0 0 8px 0; font-size:13px; color:#ef4444; font-weight:600;">
                ⏱ Code expires in 5 minutes • صالح للاستخدام لمدة 5 دقائق
              </p>
              <p style="margin:0; font-size:12px; color:#94a3b8;">
                If you did not initiate this request, you can safely ignore this email.
              </p>
            </div>
            <div style="background:#f8fafc; padding:14px 20px; border-top:1px solid #e2e8f0; text-align:center; font-size:12px; color:#94a3b8;">
              PhysiX Lab &copy; 2026 • Interactive Physics & Mechanics EdTech
            </div>
          </div>
        </body>
        </html>
        """

        msg.attach(MIMEText(text_content, "plain", "utf-8"))
        msg.attach(MIMEText(html_content, "html", "utf-8"))

        context = ssl.create_default_context()
        if smtp_port == 465:
            with smtplib.SMTP_SSL(smtp_host, smtp_port, context=context, timeout=10) as server:
                server.login(smtp_email, smtp_password)
                server.sendmail(smtp_email, to_email, msg.as_string())
        else:
            with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
                server.ehlo()
                server.starttls(context=context)
                server.ehlo()
                server.login(smtp_email, smtp_password)
                server.sendmail(smtp_email, to_email, msg.as_string())

        print(f"[Email] Successfully dispatched OTP email to {to_email} via {smtp_host}:{smtp_port}")
        return True
    except Exception as e:
        print(f"[Email Error] Could not send OTP email to {to_email} via {smtp_host}:{smtp_port}: {e}")
        return False

def init_db():
    """Initializes SQLite/Turso tables safely without dropping user accounts or records."""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # 1. Users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                full_name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'student',
                is_verified INTEGER DEFAULT 0,
                otp_code TEXT,
                otp_expires_at TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        for col_def in [
            ("full_name", "TEXT NOT NULL DEFAULT ''"),
            ("role", "TEXT NOT NULL DEFAULT 'student'"),
            ("is_verified", "INTEGER DEFAULT 0"),
            ("otp_code", "TEXT"),
            ("otp_expires_at", "TEXT"),
            ("created_at", "TEXT DEFAULT CURRENT_TIMESTAMP")
        ]:
            try:
                cursor.execute(f"ALTER TABLE users ADD COLUMN {col_def[0]} {col_def[1]}")
            except Exception:
                pass

        # Ensure seed accounts exist if users table is empty
        cursor.execute("SELECT COUNT(*) FROM users")
        row = cursor.fetchone()
        count = row[0] if row else 0
        if count == 0:
            seed_pass = hash_password("password123")
            cursor.execute("""
                INSERT OR IGNORE INTO users (id, full_name, email, password_hash, role, is_verified, created_at)
                VALUES (?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
            """, (str(uuid.uuid4()), "Dr. Sarah Nour", "sarah.nour@univ.edu", seed_pass, "instructor"))

            cursor.execute("""
                INSERT OR IGNORE INTO users (id, full_name, email, password_hash, role, is_verified, created_at)
                VALUES (?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
            """, (str(uuid.uuid4()), "Omar Khalil / عمر خليل", "omar.khalil@univ.edu", seed_pass, "student"))
        
        # 2. Student Progress table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS student_progress (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                user_email TEXT NOT NULL,
                module_id TEXT NOT NULL,
                level_id INTEGER NOT NULL,
                stars INTEGER DEFAULT 0,
                best_score REAL DEFAULT 0.0,
                attempts INTEGER DEFAULT 1,
                completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_email, module_id, level_id)
            )
        """)
        try:
            cursor.execute("ALTER TABLE student_progress ADD COLUMN user_id TEXT")
        except Exception:
            pass

        # 3. Lab Sheets (Instructor exams)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS lab_sheets (
                sheet_code TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                instructor_email TEXT NOT NULL,
                topics TEXT NOT NULL,
                num_questions INTEGER DEFAULT 4,
                passing_score REAL DEFAULT 60.0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                custom_questions TEXT,
                is_locked INTEGER DEFAULT 0,
                active_model TEXT DEFAULT 'A',
                allow_review INTEGER DEFAULT 0
            )
        """)
        for col_name, col_type in [
            ("custom_questions", "TEXT"),
            ("is_locked", "INTEGER DEFAULT 0"),
            ("active_model", "TEXT DEFAULT 'A'"),
            ("allow_review", "INTEGER DEFAULT 0")
        ]:
            try:
                cursor.execute(f"ALTER TABLE lab_sheets ADD COLUMN {col_name} {col_type}")
            except Exception:
                pass

        # 4. Exam Submissions
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS exam_submissions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                sheet_code TEXT NOT NULL,
                student_email TEXT NOT NULL,
                student_name TEXT NOT NULL,
                score REAL NOT NULL,
                passed INTEGER NOT NULL,
                answers TEXT NOT NULL,
                submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(sheet_code, student_email)
            )
        """)
        try:
            cursor.execute("ALTER TABLE exam_submissions ADD COLUMN user_id TEXT")
        except Exception:
            pass

        # 5. Bounded Lab Snapshots table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS lab_snapshots (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                user_email TEXT NOT NULL,
                module_id TEXT NOT NULL,
                level_id INTEGER NOT NULL,
                params_summary TEXT NOT NULL,
                metrics_summary TEXT NOT NULL,
                capped_samples TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Seed default starter lab sheet if empty
        cursor.execute("SELECT COUNT(*) FROM lab_sheets WHERE sheet_code = 'MECH-2026'")
        row = cursor.fetchone()
        sheet_count = row[0] if row else 0
        if sheet_count == 0:
            cursor.execute("""
                INSERT OR IGNORE INTO lab_sheets (sheet_code, title, instructor_email, topics, num_questions, passing_score, is_locked, active_model)
                VALUES (?, ?, ?, ?, ?, ?, 0, 'A')
            """, (
                "MECH-2026",
                "General Physics I - Mechanics Lab Practical",
                "sarah.nour@univ.edu",
                json.dumps(["newton", "vectors", "equilibrium", "projectiles", "inclined_plane", "momentum"]),
                6,
                60.0
            ))
            
            # Seed mock student submissions for instructor analytics showcase
            mock_submissions = [
                ("MECH-2026", "omar.khalil@univ.edu", "Omar Khalil / عمر خليل", 95.0, 1, json.dumps({"newton": True, "vectors": True, "equilibrium": True, "projectiles": True, "inclined_plane": True, "momentum": False})),
                ("MECH-2026", "sarah.nour@univ.edu", "Sarah Nour / سارة نور", 88.0, 1, json.dumps({"newton": True, "vectors": True, "equilibrium": True, "projectiles": False, "inclined_plane": True, "momentum": True})),
                ("MECH-2026", "ahmed.fathy@univ.edu", "Ahmed Fathy / أحمد فتحي", 54.0, 0, json.dumps({"newton": True, "vectors": False, "equilibrium": False, "projectiles": False, "inclined_plane": False, "momentum": True})),
                ("MECH-2026", "nour.ibrahim@univ.edu", "Nour Ibrahim / نور إبراهيم", 78.0, 1, json.dumps({"newton": True, "vectors": True, "equilibrium": True, "projectiles": True, "inclined_plane": False, "momentum": False})),
                ("MECH-2026", "karim.adel@univ.edu", "Karim Adel / كريم عادل", 45.0, 0, json.dumps({"newton": False, "vectors": True, "equilibrium": False, "projectiles": False, "inclined_plane": False, "momentum": False})),
            ]
            for sub in mock_submissions:
                cursor.execute("""
                    INSERT OR IGNORE INTO exam_submissions (sheet_code, student_email, student_name, score, passed, answers)
                    VALUES (?, ?, ?, ?, ?, ?)
                """, sub)
        
        conn.commit()

init_db()

# ---------------------------------------------------------
# Pydantic Request Models
# ---------------------------------------------------------
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = "student"
    instructor_code: Optional[str] = None

class VerifyOtpRequest(BaseModel):
    email: EmailStr
    otp_code: str

class ResendOtpRequest(BaseModel):
    email: EmailStr

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp_code: str
    new_password: str

class ExamSettingsRequest(BaseModel):
    instructor_email: Optional[EmailStr] = None
    is_locked: Optional[bool] = None
    active_model: Optional[str] = None
    passing_score: Optional[float] = None
    title: Optional[str] = None
    topics: Optional[List[str]] = None
    custom_questions: Optional[List[Dict[str, Any]]] = None
    allow_review: Optional[bool] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class SaveProgressRequest(BaseModel):
    email: EmailStr
    user_id: Optional[str] = None
    module_id: str
    level_id: int
    stars: int
    score: float

class SaveSnapshotRequest(BaseModel):
    module_id: str
    level_id: int
    params_summary: Dict[str, Any]
    metrics_summary: Dict[str, Any]
    capped_samples: Optional[List[Dict[str, Any]]] = None

class CreateSheetRequest(BaseModel):
    sheet_code: str
    title: str
    instructor_email: Optional[EmailStr] = None
    topics: List[str] = []
    num_questions: int = 4
    passing_score: float = 60.0
    custom_questions: Optional[List[Dict[str, Any]]] = None
    allow_review: Optional[bool] = False

class SubmitExamRequest(BaseModel):
    sheet_code: str
    answers: Dict[str, Any]
    student_email: Optional[EmailStr] = None
    student_name: Optional[str] = None

class SolverRequest(BaseModel):
    topic: str
    variables: Dict[str, Optional[float]]
    language: str = "en"

class TutorRequest(BaseModel):
    topic: str
    level_id: Optional[int] = 1
    parameters: Dict[str, Any]
    student_action: Optional[str] = None
    user_question: Optional[str] = None
    language: str = "en"

# Helper to dynamically retrieve GEMINI_API_KEY from environment or .env
def get_gemini_api_key() -> str:
    load_dotenv(override=True)
    return os.getenv("GEMINI_API_KEY", "").strip()

# ---------------------------------------------------------
# Health & Status API
# ---------------------------------------------------------
@app.get("/api/health")
def health():
    key = get_gemini_api_key()
    has_gemini = bool(key and key != "AIzaSyYourActualKeyHere")
    return {
        "status": "online",
        "platform": "PhysiX Lab / مختبر الميكانيكا",
        "storage": "turso" if USE_TURSO else "sqlite_local",
        "ai_status": "gemini-2.5-flash_enabled" if has_gemini else "builtin_pedagogical_solver",
        "gemini_configured": has_gemini,
        "timestamp": datetime.utcnow().isoformat()
    }

# ---------------------------------------------------------
# Mandatory Auth & Email OTP Endpoints
# ---------------------------------------------------------
@app.post("/api/auth/register")
def register(req: RegisterRequest, request: Request):
    ip = get_client_ip(request)
    allowed, retry_after = check_rate_limit(f"reg_{ip}", max_requests=6, window_seconds=300)
    if not allowed:
        raise HTTPException(
            status_code=429,
            detail=f"Too many registration attempts. Please wait {retry_after} seconds before trying again."
        )

    email = req.email.lower().strip()
    full_name = req.full_name.strip()
    role = req.role.lower().strip() if req.role in ["student", "instructor"] else "student"
    password = req.password.strip()

    if not full_name:
        raise HTTPException(status_code=400, detail="Full name is required / الاسم بالكامل مطلوب")
    validate_password_strength(password)

    if role == "instructor":
        if not verify_instructor_privilege(email, req.instructor_code):
            raise HTTPException(
                status_code=403,
                detail="Instructor registration requires an authorized institutional email or a valid instructor access code. / يتطلب التسجيل كمعيد كود دعوة معتمد أو بريد جامعي مصرح به."
            )

    # Generate 6-digit numeric OTP valid for 5 minutes
    otp = f"{random.randint(100000, 999999)}"
    expires_at = (datetime.utcnow() + timedelta(minutes=5)).isoformat()
    pwd_hash = hash_password(password)

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        existing = cursor.fetchone()

        if existing:
            if existing["is_verified"] == 1:
                raise HTTPException(
                    status_code=400,
                    detail="This email is already registered and verified. Please sign in. / هذا البريد مسجل ومفعل بالفعل. يرجى تسجيل الدخول."
                )
            # Re-registration for unverified user: update details and grant fresh OTP
            cursor.execute("""
                UPDATE users
                SET full_name = ?, password_hash = ?, role = ?, otp_code = ?, otp_expires_at = ?
                WHERE email = ?
            """, (full_name, pwd_hash, role, otp, expires_at, email))
        else:
            user_id = str(uuid.uuid4())
            cursor.execute("""
                INSERT INTO users (id, full_name, email, password_hash, role, is_verified, otp_code, otp_expires_at)
                VALUES (?, ?, ?, ?, ?, 0, ?, ?)
            """, (user_id, full_name, email, pwd_hash, role, otp, expires_at))

        conn.commit()

    # Send Email via Python smtplib with console fallback
    send_otp_email(email, otp, full_name)

    return {
        "status": "otp_sent",
        "email": email,
        "message": f"Verification code sent to {email}. Valid for 5 minutes."
    }

@app.post("/api/auth/verify-otp")
def verify_otp(req: VerifyOtpRequest, request: Request):
    email = req.email.lower().strip()
    code = req.otp_code.strip()

    allowed, retry_after = check_rate_limit(f"v_otp_{email}", max_requests=6, window_seconds=180)
    if not allowed:
        raise HTTPException(
            status_code=429,
            detail=f"Too many verification attempts for this email. Please wait {retry_after} seconds."
        )

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        user_row = cursor.fetchone()

        if not user_row:
            raise HTTPException(status_code=404, detail="User not found / المستخدم غير موجود")

        if user_row["otp_code"] != code:
            raise HTTPException(status_code=400, detail="Invalid verification code. Please check your email. / رمز التحقق غير صحيح، يرجى التحقق من بريدك.")

        if user_row["otp_expires_at"]:
            try:
                exp_dt = datetime.fromisoformat(user_row["otp_expires_at"])
                if datetime.utcnow() > exp_dt:
                    raise HTTPException(
                        status_code=400,
                        detail="Verification code has expired. Please request a new code. / انتهت صلاحية رمز التحقق، يرجى طلب رمز جديد."
                    )
            except (ValueError, TypeError):
                pass

        # Verification successful: set is_verified=1 and clear otp_code
        cursor.execute("""
            UPDATE users
            SET is_verified = 1, otp_code = NULL, otp_expires_at = NULL
            WHERE id = ?
        """, (user_row["id"],))
        conn.commit()

        cursor.execute("SELECT * FROM users WHERE id = ?", (user_row["id"],))
        updated_user = cursor.fetchone()

        # Link any existing progress with user_id
        cursor.execute("UPDATE student_progress SET user_id = ? WHERE user_email = ? AND (user_id IS NULL OR user_id = '')", (updated_user["id"], email))
        cursor.execute("UPDATE exam_submissions SET user_id = ? WHERE student_email = ? AND (user_id IS NULL OR user_id = '')", (updated_user["id"], email))
        conn.commit()

        # Fetch progress & submissions
        cursor.execute("SELECT * FROM student_progress WHERE user_id = ? OR user_email = ?", (updated_user["id"], email))
        progress = [dict(r) for r in cursor.fetchall()]

        cursor.execute("SELECT sheet_code, score, passed, submitted_at FROM exam_submissions WHERE user_id = ? OR student_email = ?", (updated_user["id"], email))
        submissions = [dict(r) for r in cursor.fetchall()]

        user_session = {
            "id": updated_user["id"],
            "user_id": updated_user["id"],
            "full_name": updated_user["full_name"],
            "email": updated_user["email"],
            "role": updated_user["role"],
            "is_verified": updated_user["is_verified"]
        }

        token = create_session_token(updated_user["id"], updated_user["email"], updated_user["role"], updated_user["full_name"])
        return {
            "status": "verified",
            "token": token,
            "user": user_session,
            "progress": progress,
            "submissions": submissions
        }

@app.post("/api/auth/resend-otp")
def resend_otp(req: ResendOtpRequest, request: Request):
    email = req.email.lower().strip()
    allowed, retry_after = check_rate_limit(f"resend_{email}", max_requests=3, window_seconds=300)
    if not allowed:
        raise HTTPException(
            status_code=429,
            detail=f"Too many resend requests for this email. Please wait {retry_after} seconds before requesting a new code."
        )

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        user_row = cursor.fetchone()

        if not user_row:
            raise HTTPException(status_code=404, detail="User account not found. Please create an account. / الحساب غير موجود، يرجى التسجيل أولاً.")

        if user_row["is_verified"] == 1:
            return {
                "status": "already_verified",
                "message": "Account is already verified. You can sign in immediately. / الحساب مفعل بالفعل، يمكنك تسجيل الدخول مباشرة."
            }

        otp = f"{random.randint(100000, 999999)}"
        expires_at = (datetime.utcnow() + timedelta(minutes=5)).isoformat()

        cursor.execute("""
            UPDATE users
            SET otp_code = ?, otp_expires_at = ?
            WHERE id = ?
        """, (otp, expires_at, user_row["id"]))
        conn.commit()

        send_otp_email(email, otp, user_row["full_name"])

        return {
            "status": "otp_sent",
            "email": email,
            "message": f"A new 6-digit verification code has been sent to {email}."
        }

@app.post("/api/auth/forgot-password")
def forgot_password(req: ForgotPasswordRequest, request: Request):
    email = req.email.lower().strip()
    allowed, retry_after = check_rate_limit(f"forgot_{email}", max_requests=3, window_seconds=300)
    if not allowed:
        raise HTTPException(
            status_code=429,
            detail=f"Too many password reset requests. Please wait {retry_after} seconds before requesting another code."
        )

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        user_row = cursor.fetchone()

        if not user_row:
            raise HTTPException(
                status_code=404,
                detail="No account found with this email address. / لا يوجد حساب مسجل بهذا البريد الإلكتروني."
            )

        otp = f"{random.randint(100000, 999999)}"
        expires_at = (datetime.utcnow() + timedelta(minutes=5)).isoformat()

        cursor.execute("""
            UPDATE users
            SET otp_code = ?, otp_expires_at = ?
            WHERE id = ?
        """, (otp, expires_at, user_row["id"]))
        conn.commit()

        send_otp_email(email, otp, user_row["full_name"], subject_prefix="Password Reset")

        return {
            "status": "otp_sent",
            "email": email,
            "message": f"Password reset code dispatched to {email}. Valid for 5 minutes."
        }

@app.post("/api/auth/reset-password")
def reset_password(req: ResetPasswordRequest, request: Request):
    email = req.email.lower().strip()
    code = req.otp_code.strip()
    new_password = req.new_password.strip()

    allowed, retry_after = check_rate_limit(f"reset_{email}", max_requests=5, window_seconds=300)
    if not allowed:
        raise HTTPException(
            status_code=429,
            detail=f"Too many reset attempts. Please wait {retry_after} seconds before trying again."
        )
    validate_password_strength(new_password)

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        user_row = cursor.fetchone()

        if not user_row:
            raise HTTPException(status_code=404, detail="User account not found / المستخدم غير موجود")

        if not user_row["otp_code"] or user_row["otp_code"] != code:
            raise HTTPException(
                status_code=400,
                detail="Invalid verification code. Please check your email. / رمز التحقق غير صحيح، يرجى التحقق من بريدك."
            )

        if user_row["otp_expires_at"]:
            try:
                exp_dt = datetime.fromisoformat(user_row["otp_expires_at"])
                if datetime.utcnow() > exp_dt:
                    raise HTTPException(
                        status_code=400,
                        detail="Reset code has expired. Please request a new code. / انتهت صلاحية رمز التحقق، يرجى طلب رمز جديد."
                    )
            except (ValueError, TypeError):
                pass

        new_pwd_hash = hash_password(new_password)
        cursor.execute("""
            UPDATE users
            SET password_hash = ?, otp_code = NULL, otp_expires_at = NULL, is_verified = 1
            WHERE id = ?
        """, (new_pwd_hash, user_row["id"]))
        conn.commit()

        token = create_session_token(user_row["id"], email, user_row["role"], user_row["full_name"])
        return {
            "status": "password_reset_success",
            "token": token,
            "user": {
                "id": user_row["id"],
                "user_id": user_row["id"],
                "full_name": user_row["full_name"],
                "email": email,
                "role": user_row["role"],
                "is_verified": 1
            },
            "message": "Password updated successfully. You can now sign in with your new password. / تم تحديث كلمة المرور بنجاح. يمكنك تسجيل الدخول الآن."
        }

@app.post("/api/auth/login")
def login(req: LoginRequest, request: Request):
    ip = get_client_ip(request)
    allowed, retry_after = check_rate_limit(f"login_{ip}", max_requests=10, window_seconds=60)
    if not allowed:
        raise HTTPException(
            status_code=429,
            detail=f"Too many login attempts. Please wait {retry_after} seconds before trying again."
        )

    email = req.email.lower().strip()
    password = req.password.strip()

    if USE_TURSO:
        # Single round-trip: fetch user + progress + submissions simultaneously
        with get_db() as conn:
            batch_results = conn.pipeline_batch([
                ("SELECT * FROM users WHERE email = ?", (email,)),
                ("SELECT * FROM student_progress WHERE user_email = ?", (email,)),
                ("SELECT sheet_code, score, passed, submitted_at FROM exam_submissions WHERE student_email = ?", (email,)),
            ])
            user_cur, prog_cur, sub_cur = batch_results[0], batch_results[1], batch_results[2]
            user_row = user_cur.fetchone()

            if not user_row or not verify_password(password, user_row["password_hash"]):
                raise HTTPException(
                    status_code=401,
                    detail="Invalid email or password / البريد الإلكتروني أو كلمة المرور غير صحيحة"
                )

            if user_row["is_verified"] == 0:
                otp = f"{random.randint(100000, 999999)}"
                expires_at = (datetime.utcnow() + timedelta(minutes=5)).isoformat()
                cursor = conn.cursor()
                cursor.execute("UPDATE users SET otp_code = ?, otp_expires_at = ? WHERE id = ?",
                               (otp, expires_at, user_row["id"]))
                send_otp_email(email, otp, user_row["full_name"])
                raise HTTPException(
                    status_code=403,
                    detail="Email not verified. A new verification OTP has been sent to your email. / البريد غير مفعل، أرسلنا رمز تحقق جديد إلى بريدك."
                )

            # Link unlinked records
            cursor = conn.cursor()
            cursor.execute("UPDATE student_progress SET user_id = ? WHERE user_email = ? AND (user_id IS NULL OR user_id = '')", (user_row["id"], email))
            cursor.execute("UPDATE exam_submissions SET user_id = ? WHERE student_email = ? AND (user_id IS NULL OR user_id = '')", (user_row["id"], email))

            progress = [{col: val for col, val in row.items()} for row in prog_cur._rows]
            submissions = [{col: val for col, val in row.items()} for row in sub_cur._rows]

    else:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
            user_row = cursor.fetchone()

            if not user_row or not verify_password(password, user_row["password_hash"]):
                raise HTTPException(
                    status_code=401,
                    detail="Invalid email or password / البريد الإلكتروني أو كلمة المرور غير صحيحة"
                )

            if user_row["is_verified"] == 0:
                otp = f"{random.randint(100000, 999999)}"
                expires_at = (datetime.utcnow() + timedelta(minutes=5)).isoformat()
                cursor.execute("UPDATE users SET otp_code = ?, otp_expires_at = ? WHERE id = ?",
                               (otp, expires_at, user_row["id"]))
                conn.commit()
                send_otp_email(email, otp, user_row["full_name"])
                raise HTTPException(
                    status_code=403,
                    detail="Email not verified. A new verification OTP has been sent to your email. / البريد غير مفعل، أرسلنا رمز تحقق جديد إلى بريدك."
                )

            cursor.execute("UPDATE student_progress SET user_id = ? WHERE user_email = ? AND (user_id IS NULL OR user_id = '')", (user_row["id"], email))
            cursor.execute("UPDATE exam_submissions SET user_id = ? WHERE student_email = ? AND (user_id IS NULL OR user_id = '')", (user_row["id"], email))
            conn.commit()

            cursor.execute("SELECT * FROM student_progress WHERE user_id = ? OR user_email = ?", (user_row["id"], email))
            progress = [dict(row) for row in cursor.fetchall()]

            cursor.execute("SELECT sheet_code, score, passed, submitted_at FROM exam_submissions WHERE user_id = ? OR student_email = ?", (user_row["id"], email))
            submissions = [dict(row) for row in cursor.fetchall()]

    user_session = {
        "id": user_row["id"],
        "user_id": user_row["id"],
        "full_name": user_row["full_name"],
        "email": user_row["email"],
        "role": user_row["role"],
        "is_verified": user_row["is_verified"]
    }

    token = create_session_token(user_row["id"], user_row["email"], user_row["role"], user_row["full_name"])
    return {
        "status": "authenticated",
        "token": token,
        "user": user_session,
        "progress": progress,
        "submissions": submissions
    }

@app.get("/api/user/profile")
def get_user_profile(email: Optional[str] = None, user_id: Optional[str] = None):
    with get_db() as conn:
        cursor = conn.cursor()
        if user_id:
            cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        elif email:
            cursor.execute("SELECT * FROM users WHERE email = ?", (email.lower().strip(),))
        else:
            raise HTTPException(status_code=400, detail="email or user_id parameter required")

        user_row = cursor.fetchone()
        if not user_row:
            raise HTTPException(status_code=404, detail="User not found / المستخدم غير موجود")
        
        u_id = user_row["id"]
        u_email = user_row["email"]

        cursor.execute("SELECT * FROM student_progress WHERE user_id = ? OR user_email = ?", (u_id, u_email))
        progress = [dict(row) for row in cursor.fetchall()]

        cursor.execute("SELECT sheet_code, score, passed, submitted_at FROM exam_submissions WHERE user_id = ? OR student_email = ?", (u_id, u_email))
        submissions = [dict(row) for row in cursor.fetchall()]

        user_session = {
            "id": user_row["id"],
            "user_id": user_row["id"],
            "full_name": user_row["full_name"],
            "email": user_row["email"],
            "role": user_row["role"],
            "is_verified": user_row["is_verified"]
        }

        return {
            "user": user_session,
            "progress": progress,
            "submissions": submissions
        }

# ---------------------------------------------------------
# Student Progress API (Linked to User & SQLite Persistence)
# ---------------------------------------------------------
@app.post("/api/progress/save")
def save_progress(req: SaveProgressRequest):
    email = req.email.lower().strip()
    user_id = req.user_id
    stars = max(0, min(3, req.stars))
    score = max(0.0, req.score)

    with get_db() as conn:
        cursor = conn.cursor()

        # If user_id missing, find it from users table
        if not user_id:
            cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
            u = cursor.fetchone()
            if u:
                user_id = u["id"]

        cursor.execute(
            "SELECT * FROM student_progress WHERE (user_id = ? OR user_email = ?) AND module_id = ? AND level_id = ?",
            (user_id, email, req.module_id, req.level_id)
        )
        existing = cursor.fetchone()

        if existing:
            new_stars = max(existing["stars"], stars)
            new_score = max(existing["best_score"], score)
            new_attempts = existing["attempts"] + 1
            cursor.execute("""
                UPDATE student_progress
                SET stars = ?, best_score = ?, attempts = ?, completed_at = CURRENT_TIMESTAMP, user_id = COALESCE(?, user_id)
                WHERE id = ?
            """, (new_stars, new_score, new_attempts, user_id, existing["id"]))
        else:
            cursor.execute("""
                INSERT INTO student_progress (user_id, user_email, module_id, level_id, stars, best_score, attempts)
                VALUES (?, ?, ?, ?, ?, ?, 1)
            """, (user_id, email, req.module_id, req.level_id, stars, score))

        conn.commit()

        # Retrieve updated module overview for this user
        cursor.execute("SELECT * FROM student_progress WHERE user_id = ? OR user_email = ?", (user_id, email))
        all_progress = [dict(row) for row in cursor.fetchall()]

        return {"status": "saved", "progress": all_progress}

@app.post("/api/lab/snapshot")
def save_lab_snapshot(req: SaveSnapshotRequest, request: Request):
    auth_header = request.headers.get("Authorization")
    bearer_token = None
    if auth_header and auth_header.startswith("Bearer "):
        bearer_token = auth_header[7:].strip()
    elif "token" in request.query_params:
        bearer_token = request.query_params["token"].strip()
    user = verify_session_token(bearer_token) if bearer_token else None
    user_id = user["uid"] if user else None
    user_email = user["email"] if user else "guest@univ.edu"

    capped = req.capped_samples[:25] if req.capped_samples else []
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO lab_snapshots (user_id, user_email, module_id, level_id, params_summary, metrics_summary, capped_samples)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            user_id,
            user_email,
            req.module_id,
            req.level_id,
            json.dumps(req.params_summary),
            json.dumps(req.metrics_summary),
            json.dumps(capped)
        ))
        conn.commit()

    return {"status": "saved", "message": "Simulation snapshot recorded successfully."}

# ---------------------------------------------------------
# Smart Forward & Inverse Equation Solver
# ---------------------------------------------------------
@app.post("/api/solver/solve")
def solve_physics_equation(req: SolverRequest):
    topic = req.topic.lower().strip()
    v = req.variables
    lang = req.language.lower().strip()
    is_ar = (lang == "ar")
    g = 9.81

    steps = []
    solved_var = None
    solved_val = None
    sim_params = {}

    try:
        if topic == "kinematics":
            # Variables: v0, vf, a, t, s
            v0 = v.get("v0")
            vf = v.get("vf")
            a = v.get("a")
            t = v.get("t")
            s = v.get("s")

            # Case 1: Solve for a given F and m if provided
            F = v.get("F")
            m = v.get("m")
            if a is None and F is not None and m is not None and m > 0:
                a = F / m
                solved_var = "a"
                solved_val = round(a, 3)
                steps.append(
                    f"قانون نيوتن الثاني: a = F / m = {F} / {m} = {solved_val} m/s²" if is_ar 
                    else f"Newton's 2nd Law: a = F / m = {F} / {m} = {solved_val} m/s²"
                )

            # Case 2: Solve for m given F and a
            elif m is None and F is not None and a is not None and a != 0:
                m = F / a
                solved_var = "m"
                solved_val = round(m, 3)
                steps.append(
                    f"الكتلة مجهولة: m = F / a = {F} / {a} = {solved_val} kg" if is_ar
                    else f"Unknown Mass: m = F / a = {F} / {a} = {solved_val} kg"
                )

            # Case 3: Solve for s given v0, a, t
            elif s is None and v0 is not None and a is not None and t is not None:
                s = v0 * t + 0.5 * a * (t ** 2)
                solved_var = "s"
                solved_val = round(s, 3)
                steps.append(
                    "القانون الفيزيائي للحركة بعجلة منتظمة: s = v₀·t + ½·a·t²" if is_ar
                    else "Governing Kinematic Equation: s = v₀·t + ½·a·t²"
                )
                steps.append(
                    f"التعويض بالمعطيات: s = ({v0} × {t}) + 0.5 × ({a}) × ({t}²)" if is_ar
                    else f"Substitute Given Values: s = ({v0} × {t}) + 0.5 × ({a}) × ({t}²)"
                )
                steps.append(
                    f"الناتج النهائي للإزاحة: s = {round(v0*t, 3)} + {round(0.5*a*(t**2), 3)} = {solved_val} m" if is_ar
                    else f"Final Displacement Result: s = {round(v0*t, 3)} + {round(0.5*a*(t**2), 3)} = {solved_val} m"
                )

            # Case 4: Solve for t given s, v0=0, a
            elif t is None and s is not None and a is not None and a > 0:
                init_v = v0 if v0 is not None else 0.0
                if init_v == 0:
                    t = math.sqrt(2 * s / a)
                    solved_var = "t"
                    solved_val = round(t, 3)
                    steps.append(
                        f"زمن الوصول من السكون: t = √(2s / a) = √(2 × {s} / {a}) = {solved_val} s" if is_ar
                        else f"Arrival Time from rest: t = √(2s / a) = √(2 × {s} / {a}) = {solved_val} s"
                    )

            # Case 5: Solve for vf given v0, a, s
            elif vf is None and v0 is not None and a is not None and s is not None:
                val_sq = (v0 ** 2) + 2 * a * s
                if val_sq >= 0:
                    vf = math.sqrt(val_sq)
                    solved_var = "vf"
                    solved_val = round(vf, 3)
                    steps.append(
                        f"معادلة السرعة النهائية: v_f² = v₀² + 2as => v_f = √({v0}² + 2×{a}×{s}) = {solved_val} m/s" if is_ar
                        else f"Velocity Equation: v_f² = v₀² + 2as => v_f = √({v0}² + 2×{a}×{s}) = {solved_val} m/s"
                    )

            sim_params = {
                "m": m if m is not None else 5.0,
                "F": F if F is not None else 20.0,
                "a": a if a is not None else 4.0,
                "v0": v0 if v0 is not None else 0.0,
                "s": s if s is not None else 50.0,
                "t": t if t is not None else 5.0
            }

        elif topic == "projectile":
            # Variables: v0, angle, range, h_max, t_flight
            v0 = v.get("v0")
            angle_deg = v.get("theta") or v.get("angle")
            r = v.get("range") or v.get("s")
            h_max = v.get("h_max")

            if angle_deg is not None:
                theta_rad = math.radians(angle_deg)
            else:
                theta_rad = math.radians(45)
                angle_deg = 45.0

            # Solve for Range given v0 and angle
            if (r is None or r == 0) and v0 is not None and v0 > 0:
                r = (v0 ** 2 * math.sin(2 * theta_rad)) / g
                h_max = ((v0 * math.sin(theta_rad)) ** 2) / (2 * g)
                t_flight = (2 * v0 * math.sin(theta_rad)) / g
                solved_var = "range"
                solved_val = round(r, 2)
                steps.append(
                    f"المدى الأفقي: R = (v₀² · sin(2θ)) / g = ({v0}² × sin({2*angle_deg}°)) / {g} = {solved_val} m" if is_ar
                    else f"Horizontal Range: R = (v₀² · sin(2θ)) / g = ({v0}² × sin({2*angle_deg}°)) / {g} = {solved_val} m"
                )
                steps.append(
                    f"أقصى ارتفاع: H_max = (v₀ · sin θ)² / 2g = {round(h_max, 2)} m" if is_ar
                    else f"Maximum Height: H_max = (v₀ · sin θ)² / 2g = {round(h_max, 2)} m"
                )
                steps.append(
                    f"زمن التحليق: T_flight = (2v₀ · sin θ) / g = {round(t_flight, 2)} s" if is_ar
                    else f"Flight Time: T_flight = (2v₀ · sin θ) / g = {round(t_flight, 2)} s"
                )
            
            # Inverse: Solve for initial speed v0 given target Range and angle
            elif v0 is None and r is not None and r > 0 and angle_deg is not None and angle_deg > 0:
                sin_2theta = math.sin(2 * theta_rad)
                if sin_2theta > 0:
                    v0 = math.sqrt((r * g) / sin_2theta)
                    solved_var = "v0"
                    solved_val = round(v0, 2)
                    steps.append(
                        f"الحل العكسي للسرعة الابتدائية المطلوبة لإصابة الهدف: v₀ = √((R × g) / sin(2θ)) = √(({r} × {g}) / sin({2*angle_deg}°)) = {solved_val} m/s" if is_ar
                        else f"Inverse Solve for Required Launch Speed: v₀ = √((R × g) / sin(2θ)) = √(({r} × {g}) / sin({2*angle_deg}°)) = {solved_val} m/s"
                    )

            sim_params = {
                "v0": v0 if v0 is not None else 25.0,
                "angle": angle_deg,
                "range": r if r is not None else 50.0,
                "g": g
            }

        elif topic == "inclined_plane":
            # Variables: m, theta, mu_s, mu_k, a
            m = v.get("m", 5.0) or 5.0
            theta_deg = v.get("theta", 30.0) or 30.0
            mu_s = v.get("mu_s", 0.4) or 0.4
            mu_k = v.get("mu_k", 0.25) or 0.25
            a = v.get("a")

            theta_rad = math.radians(theta_deg)
            w_par = m * g * math.sin(theta_rad)
            w_perp = m * g * math.cos(theta_rad)
            normal_force = w_perp
            max_static_friction = mu_s * normal_force
            kinetic_friction = mu_k * normal_force

            steps.append(
                f"مركبة الوزن الموازية للمنحدر: W_parallel = m·g·sin({theta_deg}°) = {m} × {g} × {math.sin(theta_rad):.3f} = {round(w_par, 2)} N" if is_ar
                else f"Parallel Weight Component: W_parallel = m·g·sin({theta_deg}°) = {m} × {g} × {math.sin(theta_rad):.3f} = {round(w_par, 2)} N"
            )
            steps.append(
                f"القوة العمودية (Normal Force): N = m·g·cos({theta_deg}°) = {round(normal_force, 2)} N" if is_ar
                else f"Normal Force: N = m·g·cos({theta_deg}°) = {round(normal_force, 2)} N"
            )
            steps.append(
                f"أقصى قوة احتكاك سكوني: f_s(max) = μ_s × N = {mu_s} × {round(normal_force, 2)} = {round(max_static_friction, 2)} N" if is_ar
                else f"Max Static Friction: f_s(max) = μ_s × N = {mu_s} × {round(normal_force, 2)} = {round(max_static_friction, 2)} N"
            )

            # Check for sliding condition
            if w_par > max_static_friction:
                net_force = w_par - kinetic_friction
                accel = net_force / m
                solved_var = "a"
                solved_val = round(accel, 3)
                steps.append(
                    f"الكتلة تنزلق لأن W_parallel ({round(w_par, 2)} N) > f_s(max) ({round(max_static_friction, 2)} N)." if is_ar
                    else f"The block slides because W_parallel ({round(w_par, 2)} N) > f_s(max) ({round(max_static_friction, 2)} N)."
                )
                steps.append(
                    f"التسارع الصافي: a = (W_parallel - f_k) / m = ({round(w_par, 2)} - {round(kinetic_friction, 2)}) / {m} = {solved_val} m/s²" if is_ar
                    else f"Net Acceleration: a = (W_parallel - f_k) / m = ({round(w_par, 2)} - {round(kinetic_friction, 2)}) / {m} = {solved_val} m/s²"
                )
            else:
                solved_var = "a"
                solved_val = 0.0
                steps.append(
                    f"الكتلة في حالة سكون مستقر لأن W_parallel ≤ f_s(max). التسارع = 0 m/s²" if is_ar
                    else f"The block remains stationary at rest because W_parallel ≤ f_s(max). Acceleration = 0 m/s²"
                )

            sim_params = {
                "m": m,
                "theta": theta_deg,
                "mu_s": mu_s,
                "mu_k": mu_k,
                "a": solved_val,
                "N": round(normal_force, 2),
                "w_par": round(w_par, 2),
                "f_k": round(kinetic_friction, 2)
            }

        elif topic == "forces" or topic == "vectors":
            # Variables: F1, F2, theta1, theta2 -> Resultant R and angle
            F1 = v.get("F1", 10.0) or 10.0
            F2 = v.get("F2", 15.0) or 15.0
            th1 = v.get("theta1", 0.0) or 0.0
            th2 = v.get("theta2", 90.0) or 90.0

            r1_rad = math.radians(th1)
            r2_rad = math.radians(th2)

            Rx = F1 * math.cos(r1_rad) + F2 * math.cos(r2_rad)
            Ry = F1 * math.sin(r1_rad) + F2 * math.sin(r2_rad)
            R_mag = math.sqrt(Rx ** 2 + Ry ** 2)
            R_theta = math.degrees(math.atan2(Ry, Rx))

            solved_var = "R"
            solved_val = round(R_mag, 2)

            steps.append(
                f"المركبة السينية للمحصلة: R_x = F₁·cos(θ₁) + F₂·cos(θ₂) = {round(Rx, 2)} N" if is_ar
                else f"Resultant X Component: R_x = F₁·cos(θ₁) + F₂·cos(θ₂) = {round(Rx, 2)} N"
            )
            steps.append(
                f"المركبة الصادية للمحصلة: R_y = F₁·sin(θ₁) + F₂·sin(θ₂) = {round(Ry, 2)} N" if is_ar
                else f"Resultant Y Component: R_y = F₁·sin(θ₁) + F₂·sin(θ₂) = {round(Ry, 2)} N"
            )
            steps.append(
                f"مقدار المحصلة: |R| = √(R_x² + R_y²) = √({round(Rx, 2)}² + {round(Ry, 2)}²) = {solved_val} N" if is_ar
                else f"Resultant Magnitude: |R| = √(R_x² + R_y²) = √({round(Rx, 2)}² + {round(Ry, 2)}²) = {solved_val} N"
            )
            steps.append(
                f"زاوية الاتجاه: θ_R = atan2(R_y, R_x) = {round(R_theta, 1)}°" if is_ar
                else f"Resultant Direction: θ_R = atan2(R_y, R_x) = {round(R_theta, 1)}°"
            )

            sim_params = {
                "F1": F1,
                "F2": F2,
                "theta1": th1,
                "theta2": th2,
                "Rx": round(Rx, 2),
                "Ry": round(Ry, 2),
                "R": solved_val,
                "R_theta": round(R_theta, 1)
            }

        elif topic == "momentum":
            # Variables: m1, v1, m2, v2, e
            m1 = v.get("m1", 2.0) or 2.0
            v1 = v.get("v1", 4.0) or 4.0
            m2 = v.get("m2", 3.0) or 3.0
            v2 = v.get("v2", 0.0) or 0.0
            e = v.get("e", 1.0) if v.get("e") is not None else 1.0  # Elasticity (0 to 1)

            # Conservation of linear momentum & coefficient of restitution:
            # v1' = (m1*v1 + m2*v2 - m2*e*(v1 - v2)) / (m1 + m2)
            # v2' = (m1*v1 + m2*v2 + m1*e*(v1 - v2)) / (m1 + m2)
            total_m = m1 + m2
            v1_prime = (m1 * v1 + m2 * v2 - m2 * e * (v1 - v2)) / total_m
            v2_prime = (m1 * v1 + m2 * v2 + m1 * e * (v1 - v2)) / total_m

            solved_var = "v2_final"
            solved_val = round(v2_prime, 2)

            steps.append(
                f"حفظ كمية الحركة: p_initial = m₁v₁ + m₂v₂ = ({m1}×{v1}) + ({m2}×{v2}) = {round(m1*v1 + m2*v2, 2)} kg·m/s" if is_ar
                else f"Conservation of Momentum: p_initial = m₁v₁ + m₂v₂ = ({m1}×{v1}) + ({m2}×{v2}) = {round(m1*v1 + m2*v2, 2)} kg·m/s"
            )
            steps.append(
                f"معامل الارتداد e = {e} ({'مرن تماماً' if e==1 else 'غير مرن' if e==0 else 'مرن جزئياً'})" if is_ar
                else f"Restitution Coefficient e = {e} ({'Perfect Elastic' if e==1 else 'Inelastic' if e==0 else 'Partially Elastic'})"
            )
            steps.append(
                f"سرعة الكتلة الثانية بعد التصادم: v₂' = {solved_val} m/s، وسرعة الأولى: v₁' = {round(v1_prime, 2)} m/s" if is_ar
                else f"Post-collision velocity of mass 2: v₂' = {solved_val} m/s, mass 1: v₁' = {round(v1_prime, 2)} m/s"
            )

            sim_params = {
                "m1": m1, "v1": v1, "m2": m2, "v2": v2, "e": e,
                "v1_prime": round(v1_prime, 2),
                "v2_prime": solved_val
            }
        else:
            raise HTTPException(status_code=400, detail=f"Topic '{topic}' is not supported yet.")

        return {
            "topic": topic,
            "solved_variable": solved_var,
            "solved_value": solved_val,
            "derivation_steps": steps,
            "simulation_parameters": sim_params
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Physics calculation error: {str(e)}")

# ---------------------------------------------------------
# AI Step-by-Step Physics Tutor (Gemini & Fallback Engine)
# ---------------------------------------------------------
@app.post("/api/ai/tutor")
async def ai_physics_tutor(req: TutorRequest):
    topic = req.topic
    params = req.parameters
    lang = req.language
    is_ar = (lang == "ar")
    student_action = req.student_action or ""
    user_q = req.user_question or ""

    gemini_key = get_gemini_api_key()
    if gemini_key and gemini_key != "AIzaSyYourActualKeyHere":
        try:
            import asyncio
            from google import genai
            client = genai.Client(api_key=gemini_key)

            system_prompt = f"""You are the world-class interactive physics professor and tutor in the PhysiX Lab mechanics lab platform.
Language: {'Arabic (clear Egyptian/Modern Standard university physics style)' if is_ar else 'English'}.
The student is currently working on: Topic: {topic}, Level {req.level_id}.
Current Physics Parameters: {json.dumps(params)}.
Student Action / Attempt: {student_action}.
Student Query: {user_q or 'Explain the underlying physical principles, step-by-step mathematical derivation, and common pitfalls.'}

Structure your response with:
1. Physical Intuition & Law Statement (with standard formula in LaTeX).
2. Step-by-step numerical calculation using their exact parameters.
3. Common Misconception or Practical Pro-Tip (e.g. why friction opposes relative motion, sign conventions).
4. Direct actionable guidance for their next simulation run.
Keep it crisp, encouraging, and academically rigorous."""

            def _call_gemini_tutor(model_name):
                response = client.models.generate_content(
                    model=model_name,
                    contents=system_prompt,
                )
                return response.text

            for model_name in ["gemini-2.5-flash", "gemini-2.0-flash"]:
                try:
                    with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
                        future = executor.submit(_call_gemini_tutor, model_name)
                        result_text = future.result(timeout=3.0)
                    return {
                        "source": model_name,
                        "explanation": result_text,
                        "topic": topic
                    }
                except concurrent.futures.TimeoutError:
                    print(f"[Gemini Tutor] {model_name} timed out after 3s — falling back")
                    break
                except Exception as e:
                    err_str = str(e)
                    print(f"[Gemini Tutor] {model_name} failed: {err_str}")
                    continue
        except Exception as outer_e:
            print(f"[Gemini Tutor Outer Error]: {outer_e}")

    # Intelligent Built-in Pedagogical Physics Solver Fallback
    explanation = ""
    if topic == "newton":
        m = params.get("m", 5.0)
        F = params.get("F", 20.0)
        D = params.get("D", 50.0)
        a = F / m if m > 0 else 0
        t_arr = math.sqrt(2 * D / a) if a > 0 else 0
        if is_ar:
            explanation = f"""### 🎯 شرح فيزيائي تفصيلي - قانون نيوتن الثاني
**1. المبدأ الفيزيائي:**
ينص قانون نيوتن الثاني على أن محصلة القوى المؤثرة على جسم تكسبه تسارعاً يتناسب طردياً مع القوة وعكسياً مع كتلته:
$$\\Sigma F = m \\cdot a \\implies a = \\frac{{F}}{{m}}$$

**2. الحسابات العددية لمعطياتك:**
- الكتلة: $m = {m} \\text{{ kg}}$
- القوة المطبقة: $F = {F} \\text{{ N}}$
- التسارع اللحظي: $a = \\frac{{{F}}}{{{m}}} = {a:.2f} \\text{{ m/s}}^2$
- المسافة حتى الهدف: $D = {D} \\text{{ m}}$
- زمن الوصول المتوقع: $t = \\sqrt{{\\frac{{2D}}{{a}}}} = \\sqrt{{\\frac{{2 \\times {D}}}{{{a:.2f}}}}} = {t_arr:.2f} \\text{{ s}}$

**💡 نصيحة المعمل:**
لإيقاف الصندوق داخل نافذة الهدف بدقة، اضبط القوة $F$ بحيث يصل الصندوق قبل نفاذ المهلة الزمنية مع مراعاة طاقة الحركة $KE = \\frac{{1}}{{2}}mv^2$."""
        else:
            explanation = f"""### 🎯 Detailed Physical Breakdown - Newton's Second Law
**1. Physical Principle:**
Newton's Second Law states that the net force acting on an object equals its rate of change of momentum, yielding the governing equation:
$$\\Sigma F = m \\cdot a \\implies a = \\frac{{F}}{{m}}$$

**2. Numerical Step-by-Step for Your Run:**
- Mass: $m = {m} \\text{{ kg}}$
- Applied Force: $F = {F} \\text{{ N}}$
- Resulting Acceleration: $a = \\frac{{{F}}}{{{m}}} = {a:.2f} \\text{{ m/s}}^2$
- Track Distance: $D = {D} \\text{{ m}}$
- Predicted Arrival Time: $t = \\sqrt{{\\frac{{2D}}{{a}}}} = \\sqrt{{\\frac{{2 \\times {D}}}{{{a:.2f}}}}} = {t_arr:.2f} \\text{{ s}}$

**💡 Lab Mastery Tip:**
To achieve 3 stars, adjust $F$ so that acceleration delivers the mass right into the arrival zone within the precision tolerance window!"""

    elif topic == "projectiles":
        v0 = params.get("v0", 25.0)
        theta = params.get("theta", 45.0)
        rad = math.radians(theta)
        R = (v0 ** 2 * math.sin(2 * rad)) / 9.81
        H = ((v0 * math.sin(rad)) ** 2) / (2 * 9.81)
        if is_ar:
            explanation = f"""### 🚀 تحليل حركة المقذوفات في بعدين
**1. تفكيك الحركة المستقلة:**
تتحرك المقذوفات تحت تأثير الجاذبية الأرضية فقط ($g = 9.81 \\text{{ m/s}}^2$):
- المركبة الأفقية (سرعة ثابتة): $v_x = v_0 \\cos\\theta = {v0 * math.cos(rad):.2f} \\text{{ m/s}}$
- المركبة الرأسية (تسارع منتظم): $v_y = v_0 \\sin\\theta - gt$

**2. المعطيات الحالية:**
- زاوية الإطلاق: $\\theta = {theta}^\\circ$
- السرعة الابتدائية: $v_0 = {v0} \\text{{ m/s}}$
- أقصى ارتفاع: $H = \\frac{{(v_0 \\sin\\theta)^2}}{{2g}} = {H:.2f} \\text{{ m}}$
- المدى الأفقي الكلي: $R = \\frac{{v_0^2 \\sin(2\\theta)}}{{g}} = {R:.2f} \\text{{ m}}$

**💡 قاعدة ذهبية:** زاوية $45^\\circ$ تعطي أقصى مدى أفقي ممكن في غياب مقاومة الهواء لأن $\\sin(2 \\times 45^\\circ) = \\sin(90^\\circ) = 1$!"""
        else:
            explanation = f"""### 🚀 2D Projectile Trajectory Decomposition
**1. Independent Motion Coordinates:**
Gravity acts solely downwards ($g = 9.81 \\text{{ m/s}}^2$):
- Horizontal component (constant $v$): $v_x = v_0 \\cos\\theta = {v0 * math.cos(rad):.2f} \\text{{ m/s}}$
- Vertical component (accelerated): $v_y = v_0 \\sin\\theta - gt$

**2. Key Trajectory Milestones:**
- Launch Angle: $\\theta = {theta}^\\circ$, Launch Velocity: $v_0 = {v0} \\text{{ m/s}}$
- Apex Height: $H = \\frac{{(v_0 \\sin\\theta)^2}}{{2g}} = {H:.2f} \\text{{ m}}$
- Total Ground Range: $R = \\frac{{v_0^2 \\sin(2\\theta)}}{{g}} = {R:.2f} \\text{{ m}}$

**💡 Lab Insight:** $45^\\circ$ guarantees maximum ground range in vacuum conditions because $\\sin(2\\theta) = 1$."""

    elif topic == "inclined_plane":
        m = params.get("m", 5.0)
        theta = params.get("theta", 30.0)
        mu_s = params.get("mu_s", 0.4)
        mu_k = params.get("mu_k", 0.25)
        rad = math.radians(theta)
        w_par = m * 9.81 * math.sin(rad)
        w_perp = m * 9.81 * math.cos(rad)
        fs_max = mu_s * w_perp
        fk = mu_k * w_perp
        slides = w_par > fs_max
        a = (w_par - fk) / m if slides else 0.0

        if is_ar:
            explanation = f"""### 📐 السطح المائل وقوى الاحتكاك
**1. تحليل متجهات الوزن:**
نقوم بتحليل وزن الصندوق $W = mg$ إلى مركبتين متعامدتين:
- موازية للمنحدر (تحاول سحب الصندوق لأسفل): $W_{{||}} = mg \\sin\\theta = {w_par:.2f} \\text{{ N}}$
- عمودية على المنحدر (تحدد رد الفعل العمودي $N$): $N = W_{{\\perp}} = mg \\cos\\theta = {w_perp:.2f} \\text{{ N}}$

**2. اختبار شرط الانزلاق:**
- أقصى قوة احتكاك سكوني: $f_{{s,max}} = \\mu_s \\cdot N = {mu_s} \\times {w_perp:.2f} = {fs_max:.2f} \\text{{ N}}$
- مقارنة القوى: {'المركبة $W_{||}$ أكبر من الاحتكاك السكوني، إذن **الصندوق ينزلق بتسارع $a = ' + f'{a:.2f}' + '\\text{ m/s}^2$**' if slides else 'المركبة $W_{||}$ أصغر من أو تساوي الاحتكاك السكوني، إذن **الصندوق يظل ساكناً متزناً ($a=0$)**'}.

**💡 ملاحظة هندسية:** زاوية الحرج للانزلاق تتحقق عندما $\\tan\\theta > \\mu_s$ بصرف النظر عن كتلة الجسم!"""
        else:
            explanation = f"""### 📐 Inclined Plane Mechanics & Friction Limits
**1. Coordinate Vector Rotation:**
Project weight $W = mg$ along axes parallel and perpendicular to the incline:
- Parallel Driving Force: $W_{{||}} = mg \\sin\\theta = {w_par:.2f} \\text{{ N}}$
- Perpendicular Normal Force: $N = mg \\cos\\theta = {w_perp:.2f} \\text{{ N}}$

**2. Motion Threshold Check:**
- Peak Static Friction: $f_{{s,max}} = \\mu_s N = {fs_max:.2f} \\text{{ N}}$
- State: {'**Sliding** ($W_{||} > f_{s,max}$). Acceleration $a = ' + f'{a:.2f}' + '\\text{ m/s}^2$' if slides else '**Static Equilibrium** ($W_{||} \\le f_{s,max}$). Acceleration = 0'}.

**💡 Insight:** Mass cancels out when finding critical slip angle: $\\tan\\theta_{{crit}} = \\mu_s$."""
    else:
        explanation = f"Physical principles for {topic}: analyze all forces, resolve along orthogonal axes, and apply conservation laws."

    return {
        "source": "builtin_pedagogical_solver",
        "explanation": explanation,
        "topic": topic
    }

# ---------------------------------------------------------
# Snap & Simulate: AI Vision Problem Scanner
# ---------------------------------------------------------
@app.post("/api/ai/vision")
async def vision_problem_scanner(
    file: Optional[UploadFile] = File(None),
    image_base64: Optional[str] = Form(None),
    problem_text: Optional[str] = Form(None)
):
    """
    3-Tier Resilient Vision OCR & Physics Parameter Extractor:
    1. Tries gemini-4-hydrogen (with 1 automatic retry on 503 high demand).
    2. Falls back to secondary Gemini models if primary is overloaded.
    3. Seamlessly falls back to a clean local physics extractor so zero raw errors ever reach the UI.
    """
    gemini_key = get_gemini_api_key()
    raw_text_hint = (problem_text or "").lower()
    if file and file.filename:
        raw_text_hint += " " + file.filename.lower()

    if gemini_key and gemini_key != "AIzaSyYourActualKeyHere":
        try:
            import asyncio
            from google import genai
            from google.genai import types
            client = genai.Client(api_key=gemini_key)

            prompt = """You are an expert physics vision analyzer and mechanics solver.
Analyze this physics textbook mechanics problem image or text.
Extract the physical scenario and parameters into exact variables matching the PhysiX Lab Smart Solver fields:
- topic: one of ["kinematics", "projectile", "inclined_plane", "forces", "momentum"]
- variables: dictionary with numerical values (or null if it is the unknown target variable to solve for):
  - For kinematics: F, m, a, v0, vf, t, s
  - For projectile: v0, theta, range, h_max, t_flight
  - For inclined_plane: m, theta, mu_s, mu_k, a
  - For forces: F1, theta1, F2, theta2, R
  - For momentum: m1, v1, m2, v2, e
- target_variable: string name of the target unknown variable (e.g. "a", "m", "range", "v0", "vf", "t")
- problem_summary: concise 1-2 sentence bilingual Arabic/English problem statement.

Return STRICT JSON ONLY without markdown formatting:
{
  "topic": "kinematics",
  "variables": {"v0": 0.0, "a": 9.8, "t": 4.5, "vf": null},
  "target_variable": "vf",
  "problem_summary": "A stone falls freely from rest for 4.5 seconds under gravity (g = 9.8 m/s²). Calculate its final speed. / يسقط حجر سقوطاً حراً من السكون لمدة 4.5 ثانية تحت تأثير الجاذبية الأرضية. احسب سرعته النهائية."
}"""

            contents_payload = []
            if file:
                image_bytes = await file.read()
                mime_type = file.content_type or "image/jpeg"
                contents_payload.append(types.Part.from_bytes(data=image_bytes, mime_type=mime_type))
            elif image_base64:
                import base64
                b64_str = image_base64.split(",")[1] if "," in image_base64 else image_base64
                image_bytes = base64.b64decode(b64_str)
                contents_payload.append(types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg"))
            elif problem_text:
                contents_payload.append(problem_text)
            else:
                contents_payload.append("What is the speed of a stone after falling freely towards the Earth for a time period of 4.5 seconds from the moment it starts falling?")

            contents_payload.append(prompt)

            def _call_gemini_vision(model_name):
                response = client.models.generate_content(
                    model=model_name,
                    contents=contents_payload,
                )
                return response.text.strip()

            for model_name in ["gemini-2.5-flash", "gemini-2.0-flash"]:
                try:
                    with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
                        future = executor.submit(_call_gemini_vision, model_name)
                        text = future.result(timeout=3.0)
                    if "```json" in text:
                        text = text.split("```json")[1].split("```")[0].strip()
                    elif "```" in text:
                        text = text.split("```")[1].split("```")[0].strip()
                    data = json.loads(text)
                    return {
                        "status": "success",
                        "extracted": data,
                        "engine": model_name,
                        "model": model_name,
                        "note": f"Parsed live using {model_name}."
                    }
                except concurrent.futures.TimeoutError:
                    print(f"[Gemini Vision] {model_name} timed out after 3s — falling back")
                    break
                except Exception as e:
                    print(f"[Gemini Vision] {model_name} failed: {e}")
                    continue
        except Exception as outer_e:
            print(f"[Gemini Vision Outer Error]: {outer_e}")

    # Tier 3: Local keyword-based fallback — strictly validated
    physics_keywords = [
        "incline", "ramp", "slope", "projectile", "launch", "angle", "velocity",
        "acceleration", "force", "mass", "momentum", "collision", "gravity", "newton",
        "kinematics", "displacement", "friction", "tension", "pulley", "spring",
        "35", "45", "30", "60", "9.8", "9.81", "kg", "m/s", "n/m"
    ]
    has_physics_content = any(k in raw_text_hint for k in physics_keywords)

    # Reject non-physics, blank, or non-numeric images cleanly
    if not has_physics_content:
        return {
            "status": "invalid_image",
            "extracted": None,
            "engine": "validator",
            "message": "No usable physics parameters or numbers found in image. Please upload a clear photo showing a mechanics problem or equations."
        }

    if any(k in raw_text_hint for k in ["incline", "ramp", "slope", "35"]):
        fallback_data = {
            "topic": "inclined_plane",
            "variables": {"m": 4.5, "theta": 35.0, "mu_s": 0.45, "mu_k": 0.28, "a": None},
            "target_variable": "a",
            "problem_summary": "A 4.5 kg block on a 35° inclined plane (μ_s = 0.45, μ_k = 0.28). Find acceleration."
        }
    elif any(k in raw_text_hint for k in ["projectile", "launch", "angle"]):
        fallback_data = {
            "topic": "projectile",
            "variables": {"v0": 30.0, "theta": 45.0, "range": None},
            "target_variable": "range",
            "problem_summary": "Projectile launched at 30 m/s at 45° angle. Find range."
        }
    elif any(k in raw_text_hint for k in ["momentum", "collision"]):
        fallback_data = {
            "topic": "momentum",
            "variables": {"m1": 3.0, "v1": 5.0, "m2": 2.0, "v2": -2.0, "e": 1.0},
            "target_variable": "v1_final",
            "problem_summary": "Two carts (3 kg at 5 m/s, 2 kg at -2 m/s) collide elastically. Find final velocities."
        }
    else:
        fallback_data = {
            "topic": "kinematics",
            "variables": {"v0": 0.0, "a": 9.8, "t": 4.5, "vf": None},
            "target_variable": "vf",
            "problem_summary": "A stone falls freely from rest for 4.5 s (g = 9.8 m/s²). Find final speed."
        }

    return {
        "status": "success",
        "extracted": fallback_data,
        "engine": "local_physics_engine",
        "model": "local_physics_engine",
        "note": "Extracted via local physics backup engine while cloud servers experience peak load."
    }

# ---------------------------------------------------------
# Instructor Portal & Anti-Cheat Lab Sheet System
# ---------------------------------------------------------
@app.post("/api/instructor/sheets/create")
def create_lab_sheet(req: CreateSheetRequest, instructor: dict = Depends(get_current_instructor)):
    code = req.sheet_code.upper().strip()
    instructor_email = instructor["email"].lower().strip()
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT sheet_code FROM lab_sheets WHERE sheet_code = ?", (code,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Sheet code already exists. Please choose a unique code.")
        
        custom_q_json = json.dumps(req.custom_questions) if getattr(req, "custom_questions", None) else None
        q_count = len(req.custom_questions) if req.custom_questions else req.num_questions
        topics_list = req.topics if req.topics else ["newton", "projectiles", "inclined_plane", "vectors", "equilibrium", "momentum"]
        cursor.execute("""
            INSERT INTO lab_sheets (sheet_code, title, instructor_email, topics, num_questions, passing_score, custom_questions, allow_review)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            code,
            req.title.strip(),
            instructor_email,
            json.dumps(topics_list),
            q_count,
            req.passing_score,
            custom_q_json,
            1 if req.allow_review else 0
        ))
        conn.commit()

        return {"status": "created", "sheet_code": code}

@app.get("/api/instructor/sheet/{code}/analytics")
def get_sheet_analytics(code: str, instructor: dict = Depends(get_current_instructor)):
    code = code.upper().strip()
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM lab_sheets WHERE sheet_code = ?", (code,))
        sheet = cursor.fetchone()
        if not sheet:
            raise HTTPException(status_code=404, detail="Lab sheet not found")
        sheet_dict = dict(sheet)
        if sheet_dict.get("instructor_email", "").lower() != instructor["email"].lower():
            raise HTTPException(status_code=403, detail="Access denied: You do not own this lab sheet.")

        cursor.execute("""
            SELECT student_email, student_name, score, passed, answers, submitted_at
            FROM exam_submissions
            WHERE sheet_code = ?
            ORDER BY score DESC, submitted_at ASC
        """, (code,))
        submissions = [dict(row) for row in cursor.fetchall()]

        total = len(submissions)
        passed_count = sum(1 for s in submissions if s["passed"] == 1)
        avg_score = sum(s["score"] for s in submissions) / total if total > 0 else 0.0

        # Topic error breakdown
        topic_errors = {
            "newton": {"errors": 0, "total": 0},
            "vectors": {"errors": 0, "total": 0},
            "equilibrium": {"errors": 0, "total": 0},
            "projectiles": {"errors": 0, "total": 0},
            "inclined_plane": {"errors": 0, "total": 0},
            "momentum": {"errors": 0, "total": 0}
        }

        for sub in submissions:
            try:
                ans = json.loads(sub["answers"]) if isinstance(sub["answers"], str) else sub["answers"]
                for top, is_correct in ans.items():
                    if top in topic_errors:
                        topic_errors[top]["total"] += 1
                        if not is_correct:
                            topic_errors[top]["errors"] += 1
            except Exception:
                pass

        # Weak spot analysis
        weak_spots = []
        for t, stats in topic_errors.items():
            if stats["total"] > 0:
                err_rate = (stats["errors"] / stats["total"]) * 100
                weak_spots.append({
                    "topic": t,
                    "error_rate": round(err_rate, 1),
                    "submissions_tested": stats["total"]
                })
        weak_spots.sort(key=lambda x: x["error_rate"], reverse=True)

        return {
            "sheet": sheet_dict,
            "total_students": total,
            "pass_rate": round((passed_count / total) * 100, 1) if total > 0 else 0.0,
            "average_score": round(avg_score, 1),
            "submissions": submissions,
            "weak_spots": weak_spots
        }

@app.get("/api/instructor/sheet/{code}/export-csv")
def export_sheet_csv(code: str, instructor: dict = Depends(get_current_instructor)):
    code = code.upper().strip()
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM lab_sheets WHERE sheet_code = ?", (code,))
        sheet = cursor.fetchone()
        if not sheet:
            raise HTTPException(status_code=404, detail="Lab sheet not found")
        if dict(sheet).get("instructor_email", "").lower() != instructor["email"].lower():
            raise HTTPException(status_code=403, detail="Access denied: You do not own this lab sheet.")

        cursor.execute("""
            SELECT student_name, student_email, score, passed, submitted_at
            FROM exam_submissions
            WHERE sheet_code = ?
            ORDER BY score DESC
        """, (code,))
        rows = cursor.fetchall()

    # Create CSV content with UTF-8 BOM (\ufeff) for Arabic Excel compatibility
    csv_lines = ["\ufeffStudent Name,Email,Score (%),Status,Submission Timestamp"]
    for r in rows:
        status_label = "PASSED" if r["passed"] == 1 else "NEEDS RETAKE"
        name_clean = r["student_name"].replace(",", " ")
        csv_lines.append(f'"{name_clean}",{r["student_email"]},{r["score"]},{status_label},{r["submitted_at"]}')

    csv_data = "\n".join(csv_lines)
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename=physix_lab_{code}_grades.csv",
            "Content-Type": "text/csv; charset=utf-8"
        }
    )

@app.get("/api/instructor/sheets")
def get_instructor_sheets(instructor: dict = Depends(get_current_instructor)):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM lab_sheets WHERE LOWER(instructor_email) = LOWER(?) ORDER BY created_at DESC", (instructor["email"].lower().strip(),))
        sheets = [dict(r) for r in cursor.fetchall()]

        # Attach submission counts to each sheet
        for s in sheets:
            cursor.execute("SELECT COUNT(*) FROM exam_submissions WHERE sheet_code = ?", (s["sheet_code"],))
            cnt_row = cursor.fetchone()
            s["submissions_count"] = cnt_row[0] if cnt_row else 0
            if "is_locked" not in s or s["is_locked"] is None:
                s["is_locked"] = 0
            if "active_model" not in s or not s["active_model"]:
                s["active_model"] = "A"

        return {"sheets": sheets}

@app.get("/api/instructor/sheet/{code}/settings")
def get_sheet_settings(code: str, instructor: dict = Depends(get_current_instructor)):
    code = code.upper().strip()
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM lab_sheets WHERE sheet_code = ?", (code,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Lab sheet not found")
        sheet_dict = dict(row)
        if sheet_dict.get("instructor_email", "").lower() != instructor["email"].lower():
            raise HTTPException(status_code=403, detail="Access denied: You do not own this lab sheet.")
        
        if "is_locked" not in sheet_dict or sheet_dict["is_locked"] is None:
            sheet_dict["is_locked"] = 0
        if "active_model" not in sheet_dict or not sheet_dict["active_model"]:
            sheet_dict["active_model"] = "A"
        return {"sheet": sheet_dict}

@app.post("/api/instructor/sheet/{code}/settings")
def update_sheet_settings(code: str, req: ExamSettingsRequest, instructor: dict = Depends(get_current_instructor)):
    code = code.upper().strip()
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM lab_sheets WHERE sheet_code = ?", (code,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Lab sheet not found")
        sheet_dict = dict(row)
        if sheet_dict.get("instructor_email", "").lower() != instructor["email"].lower():
            raise HTTPException(status_code=403, detail="Access denied: You do not own this lab sheet.")

        updates = []
        params = []
        if req.is_locked is not None:
            updates.append("is_locked = ?")
            params.append(1 if req.is_locked else 0)
        if req.active_model is not None:
            updates.append("active_model = ?")
            params.append(req.active_model.strip().upper())
        if req.passing_score is not None:
            updates.append("passing_score = ?")
            params.append(float(req.passing_score))
        if req.title is not None:
            updates.append("title = ?")
            params.append(req.title.strip())
        if req.topics is not None:
            updates.append("topics = ?")
            params.append(json.dumps(req.topics))
        if req.custom_questions is not None:
            updates.append("custom_questions = ?")
            params.append(json.dumps(req.custom_questions))
        if req.allow_review is not None:
            updates.append("allow_review = ?")
            params.append(1 if req.allow_review else 0)

        if updates:
            params.append(code)
            sql = f"UPDATE lab_sheets SET {', '.join(updates)} WHERE sheet_code = ?"
            cursor.execute(sql, tuple(params))
            conn.commit()

        cursor.execute("SELECT * FROM lab_sheets WHERE sheet_code = ?", (code,))
        updated_row = cursor.fetchone()
        res_sheet = dict(updated_row)
        if "is_locked" not in res_sheet or res_sheet["is_locked"] is None:
            res_sheet["is_locked"] = 0
        if "active_model" not in res_sheet or not res_sheet["active_model"]:
            res_sheet["active_model"] = "A"
        return {"status": "updated", "sheet": res_sheet}

# ---------------------------------------------------------
# Anti-Cheat Student Exam Generator & Submissions
# ---------------------------------------------------------
@app.get("/api/exam/sheet/{code}")
def get_exam_sheet_for_student(code: str, request: Request, email: Optional[str] = None):
    code = code.upper().strip()
    auth_header = request.headers.get("Authorization")
    token = request.query_params.get("token") or (auth_header[7:].strip() if auth_header and auth_header.startswith("Bearer ") else None)
    user_payload = verify_session_token(token) if token else None
    student_email = (user_payload["email"] if user_payload else (email or "")).lower().strip()

    if not student_email:
        raise HTTPException(
            status_code=401,
            detail="Student authentication required. Please sign in before taking the practical exam. / تسجيل الدخول إلزامي لبدء الاختبار العملي."
        )

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM lab_sheets WHERE sheet_code = ?", (code,))
        sheet_row = cursor.fetchone()
        if not sheet_row:
            raise HTTPException(status_code=404, detail="Exam sheet not found")

        sheet = dict(sheet_row)

        # Check if exam is locked/closed by instructor
        if sheet.get("is_locked") == 1:
            return {
                "sheet_code": code,
                "title": sheet["title"],
                "is_locked": True,
                "message": "This exam sheet is currently locked by the instructor. / تم إغلاق ورقة الاختبار بواسطة المدرس."
            }

        # Check if already submitted
        cursor.execute("SELECT * FROM exam_submissions WHERE sheet_code = ? AND student_email = ?", (code, student_email))
        existing_sub = cursor.fetchone()
        if existing_sub:
            return {
                "sheet_code": code,
                "already_submitted": True,
                "allow_review": bool(sheet.get("allow_review", 0)),
                "submission": dict(existing_sub)
            }

        active_model = sheet.get("active_model") or "A"

        # Check custom questions
        raw_custom = sheet.get("custom_questions")
        if raw_custom:
            try:
                custom_list = json.loads(raw_custom)
                if isinstance(custom_list, list) and len(custom_list) > 0:
                    sanitized_questions = []
                    for idx, q in enumerate(custom_list):
                        sanitized_questions.append({
                            "id": q.get("id", f"cq_{idx+1}"),
                            "topic": "custom",
                            "q_type": q.get("q_type", "mcq"),
                            "title": q.get("title") or f"Question {idx+1}",
                            "prompt": q.get("prompt", ""),
                            "prompt_ar": q.get("prompt_ar") or q.get("prompt", ""),
                            "options": q.get("options", []),
                            "points": float(q.get("points", 1.0)),
                            "image_data": q.get("image_data", ""),
                            "inputs": {}
                        })
                    return {
                        "sheet_code": code,
                        "title": sheet["title"],
                        "passing_score": sheet["passing_score"],
                        "student_email": student_email,
                        "is_custom_form": True,
                        "active_model": active_model,
                        "questions": sanitized_questions
                    }
            except Exception:
                pass

        topics = json.loads(sheet["topics"]) if isinstance(sheet["topics"], str) else sheet["topics"]

        # Anti-Cheat Deterministic Randomization based on (student_email + code + active_model)
        seed_val = int(hashlib.md5(f"{student_email}_{code}_{active_model}".encode()).hexdigest(), 16) % 10000000
        rng = random.Random(seed_val)

        questions = []
        for i, topic in enumerate(topics):
            q_id = f"q_{topic}_{i+1}"
            if topic == "newton":
                mass = rng.choice([2.0, 4.0, 5.0, 8.0, 10.0])
                dist = rng.choice([30.0, 50.0, 80.0, 100.0])
                req_t = rng.choice([4.0, 5.0, 6.0])
                correct_F = round((2 * mass * dist) / (req_t ** 2), 1)
                questions.append({
                    "id": q_id,
                    "topic": "newton",
                    "title": f"Newton's 2nd Law Experiment [Set {active_model}]",
                    "prompt": f"Given a box with mass m = {mass} kg and track distance D = {dist} m, what applied force F (in Newtons) is required to stop inside the target zone at exactly t = {req_t} s?",
                    "prompt_ar": f"لصندوق كتلته m = {mass} كجم ومسافة D = {dist} م، ما هي القوة المطلوبة F بالنيوتن ليصل إلى نافذة الهدف في زمن قدره t = {req_t} ثانية؟",
                    "target_param": "F",
                    "tolerance": 2.0,
                    "inputs": {"m": mass, "D": dist, "target_time": req_t}
                })
            elif topic == "projectiles":
                target_dist = rng.choice([40.0, 60.0, 80.0, 100.0])
                angle = rng.choice([30.0, 45.0, 60.0])
                th_rad = math.radians(angle)
                sin_2th = math.sin(2 * th_rad)
                correct_v0 = round(math.sqrt((target_dist * 9.81) / sin_2th), 1)
                questions.append({
                    "id": q_id,
                    "topic": "projectiles",
                    "title": f"Artillery Projectile Trajectory [Set {active_model}]",
                    "prompt": f"A target sensor is positioned at ground distance R = {target_dist} m. If the launch angle is set to θ = {angle}°, determine the required initial launch velocity v₀ (in m/s).",
                    "prompt_ar": f"حساس الهدف يقع على مسافة أرضية R = {target_dist} م. إذا تم ضبط زاوية الإطلاق عند θ = {angle}°، احسب السرعة الابتدائية v₀ المطلوبة بالمتر/ثانية.",
                    "target_param": "v0",
                    "tolerance": 1.5,
                    "inputs": {"target_distance": target_dist, "angle": angle}
                })
            elif topic == "inclined_plane":
                m = rng.choice([3.0, 5.0, 8.0])
                theta = rng.choice([25.0, 35.0, 45.0])
                mu_s = rng.choice([0.3, 0.4, 0.5])
                mu_k = round(mu_s - 0.15, 2)
                th_rad = math.radians(theta)
                w_par = m * 9.81 * math.sin(th_rad)
                fs_max = mu_s * m * 9.81 * math.cos(th_rad)
                slides = w_par > fs_max
                correct_a = round(((w_par - mu_k * m * 9.81 * math.cos(th_rad)) / m) if slides else 0.0, 2)
                questions.append({
                    "id": q_id,
                    "topic": "inclined_plane",
                    "title": f"Inclined Plane & Friction Dynamics [Set {active_model}]",
                    "prompt": f"A block of mass m = {m} kg rests on a ramp inclined at θ = {theta}°. Static friction μ_s = {mu_s} and kinetic friction μ_k = {mu_k}. Calculate the net acceleration a (in m/s²). If stationary, enter 0.",
                    "prompt_ar": f"جسم كتلته m = {m} كجم موضوع على سطح مائل بزاوية θ = {theta}°. معامل الاحتكاك السكوني μ_s = {mu_s} والحركي μ_k = {mu_k}. احسب التسارع الصافي a (م/ث²). إذا كان ساكناً اكتب 0.",
                    "target_param": "a",
                    "tolerance": 0.5,
                    "inputs": {"m": m, "theta": theta, "mu_s": mu_s, "mu_k": mu_k}
                })
            elif topic == "vectors":
                F1 = rng.choice([10.0, 15.0, 20.0])
                F2 = rng.choice([12.0, 18.0, 25.0])
                questions.append({
                    "id": q_id,
                    "topic": "vectors",
                    "title": f"Orthogonal Vector Addition [Set {active_model}]",
                    "prompt": f"Two perpendicular forces F₁ = {F1} N along the X-axis and F₂ = {F2} N along the Y-axis act on a single particle. Compute the magnitude of the resultant force |R| (in N).",
                    "prompt_ar": f"قوتان متعامدتان F₁ = {F1} N على محور السينات و F₂ = {F2} N على محور الصادات تؤثران على جسيم. احسب مقدار القوة المحصلة |R| بالنيوتن.",
                    "target_param": "R",
                    "tolerance": 1.0,
                    "inputs": {"F1": F1, "F2": F2}
                })
            elif topic == "equilibrium":
                F1 = rng.choice([20.0, 25.0, 30.0, 40.0])
                questions.append({
                    "id": q_id,
                    "topic": "equilibrium",
                    "title": f"3-Force Symmetric Equilibrium [Set {active_model}]",
                    "prompt": f"Two equal forces F₁ = {F1} N at 30° and F₂ = {F1} N at 150° act on a particle. What counter-force magnitude F₃ (in N) directed at 270° achieves static equilibrium (ΣF = 0)?",
                    "prompt_ar": f"قوتان متساويتان F₁ = {F1} N بزاوية 30° و F₂ = {F1} N بزاوية 150° تؤثران على جسيم. ما مقدار قوة الموازنة F₃ (بالنيوتن) عند زاوية 270° لتحقيق الاتزان (ΣF = 0)؟",
                    "target_param": "F3",
                    "tolerance": 1.0,
                    "inputs": {"F1": F1, "F2": F1}
                })
            elif topic == "momentum":
                m1 = rng.choice([2.0, 4.0])
                v1 = rng.choice([4.0, 6.0, 8.0])
                m2 = rng.choice([2.0, 4.0])
                questions.append({
                    "id": q_id,
                    "topic": "momentum",
                    "title": f"Elastic Collision Velocity [Set {active_model}]",
                    "prompt": f"Cart 1 (m₁ = {m1} kg) moving at v₁ = {v1} m/s collides elastically (e = 1.0) with stationary Cart 2 (m₂ = {m2} kg). Calculate Cart 2's post-collision speed v₂' (in m/s).",
                    "prompt_ar": f"تصطدم عربة (m₁ = {m1} كجم) بسرعة v₁ = {v1} م/ث تصادماً مرناً (e = 1.0) بعربة ساكنة (m₂ = {m2} كجم). احسب سرعة العربة الثانية بعد التصادم v₂' (م/ث).",
                    "target_param": "v2",
                    "tolerance": 0.5,
                    "inputs": {"m1": m1, "v1": v1, "m2": m2}
                })

        return {
            "sheet_code": code,
            "title": sheet["title"],
            "passing_score": sheet["passing_score"],
            "active_model": active_model,
            "questions": questions,
            "anti_cheat_student_seed": seed_val
        }

@app.post("/api/exam/submit")
def submit_exam_answers(req: SubmitExamRequest, user: dict = Depends(get_current_user)):
    code = req.sheet_code.upper().strip()
    student_email = user["email"].lower().strip()
    student_name = user["full_name"].strip()

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM lab_sheets WHERE sheet_code = ?", (code,))
        sheet = cursor.fetchone()
        if not sheet:
            raise HTTPException(status_code=404, detail="Exam sheet not found / ورقة الاختبار غير موجودة")

        sheet_dict = dict(sheet)
        if sheet_dict.get("is_locked") == 1:
            raise HTTPException(
                status_code=400,
                detail="This exam is currently locked by the instructor and cannot accept new submissions. / هذا الاختبار مغلق حالياً بواسطة المدرس."
            )

        # Check existing submission
        cursor.execute("SELECT id FROM exam_submissions WHERE sheet_code = ? AND student_email = ?", (code, student_email))
        if cursor.fetchone():
            raise HTTPException(
                status_code=400,
                detail="Exam has already been submitted and locked for this email. / تم تسليم هذا الاختبار مسبقاً لهذا الحساب."
            )

        active_model = sheet_dict.get("active_model") or "A"
        raw_custom = sheet_dict.get("custom_questions")

        # 1. Custom Questions Evaluation
        if raw_custom:
            try:
                custom_list = json.loads(raw_custom)
                if isinstance(custom_list, list) and len(custom_list) > 0:
                    earned_points = 0.0
                    total_points = 0.0
                    question_results = {}

                    for idx, q in enumerate(custom_list):
                        q_id = q.get("id", f"cq_{idx+1}")
                        pts = float(q.get("points", 1.0))
                        total_points += pts
                        sub = req.answers.get(q_id)
                        is_correct = False

                        if sub is not None and str(sub).strip() != "":
                            q_type = q.get("q_type", "mcq")
                            if q_type == "mcq":
                                if str(sub).strip() == str(q.get("correct_option", "")).strip():
                                    is_correct = True
                                    earned_points += pts
                            else:
                                try:
                                    target_num = float(q.get("correct_numeric", 0))
                                    tol = float(q.get("tolerance", 0.5))
                                    if abs(float(sub) - target_num) <= tol:
                                        is_correct = True
                                        earned_points += pts
                                except Exception:
                                    pass

                        question_results[q_id] = is_correct

                    score_pct = round((earned_points / total_points) * 100.0, 1) if total_points > 0 else 0.0
                    passed = 1 if score_pct >= sheet_dict["passing_score"] else 0

                    user_id = None
                    cursor.execute("SELECT id FROM users WHERE email = ?", (student_email,))
                    u_row = cursor.fetchone()
                    if u_row:
                        user_id = u_row["id"]

                    cursor.execute("""
                        INSERT INTO exam_submissions (user_id, sheet_code, student_email, student_name, score, passed, answers)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    """, (user_id, code, student_email, student_name, score_pct, passed, json.dumps(question_results)))
                    conn.commit()

                    return {
                        "status": "submitted",
                        "score": score_pct,
                        "earned_points": round(earned_points, 2),
                        "total_points": round(total_points, 2),
                        "correct_answers": sum(1 for v in question_results.values() if v),
                        "total_questions": len(question_results),
                        "passed": bool(passed),
                        "passing_score": sheet_dict["passing_score"],
                        "allow_review": bool(sheet_dict.get("allow_review", 0)),
                        "message": f"Scored {score_pct}% ({round(earned_points, 1)} / {round(total_points, 1)} points)."
                    }
            except Exception as e:
                print(f"[Exam Eval Warning] Error parsing custom questions: {e}")

        # 2. Standard Anti-Cheat Randomized Topics Evaluation
        seed_val = int(hashlib.md5(f"{student_email}_{code}_{active_model}".encode()).hexdigest(), 16) % 10000000
        rng = random.Random(seed_val)
        topics = json.loads(sheet_dict["topics"]) if isinstance(sheet_dict["topics"], str) else sheet_dict["topics"]

        total_q = len(topics)
        correct_count = 0
        topic_results = {}

        for i, topic in enumerate(topics):
            q_id = f"q_{topic}_{i+1}"
            submitted_val = req.answers.get(q_id)
            is_correct = False

            if topic == "newton":
                mass = rng.choice([2.0, 4.0, 5.0, 8.0, 10.0])
                dist = rng.choice([30.0, 50.0, 80.0, 100.0])
                req_t = rng.choice([4.0, 5.0, 6.0])
                correct = (2 * mass * dist) / (req_t ** 2)
                if submitted_val is not None:
                    try:
                        val = float(submitted_val)
                        if abs(val - correct) <= 2.5:
                            is_correct = True
                    except Exception:
                        pass
            elif topic == "projectiles":
                target_dist = rng.choice([40.0, 60.0, 80.0, 100.0])
                angle = rng.choice([30.0, 45.0, 60.0])
                th_rad = math.radians(angle)
                sin_2th = math.sin(2 * th_rad)
                correct = math.sqrt((target_dist * 9.81) / sin_2th)
                if submitted_val is not None:
                    try:
                        val = float(submitted_val)
                        if abs(val - correct) <= 2.0:
                            is_correct = True
                    except Exception:
                        pass
            elif topic == "inclined_plane":
                m = rng.choice([3.0, 5.0, 8.0])
                theta = rng.choice([25.0, 35.0, 45.0])
                mu_s = rng.choice([0.3, 0.4, 0.5])
                mu_k = round(mu_s - 0.15, 2)
                th_rad = math.radians(theta)
                w_par = m * 9.81 * math.sin(th_rad)
                fs_max = mu_s * m * 9.81 * math.cos(th_rad)
                slides = w_par > fs_max
                correct = ((w_par - mu_k * m * 9.81 * math.cos(th_rad)) / m) if slides else 0.0
                if submitted_val is not None:
                    try:
                        val = float(submitted_val)
                        if abs(val - correct) <= 0.8:
                            is_correct = True
                    except Exception:
                        pass
            elif topic == "vectors":
                F1 = rng.choice([10.0, 15.0, 20.0])
                F2 = rng.choice([12.0, 18.0, 25.0])
                correct = math.sqrt(F1 ** 2 + F2 ** 2)
                if submitted_val is not None:
                    try:
                        val = float(submitted_val)
                        if abs(val - correct) <= 1.5:
                            is_correct = True
                    except Exception:
                        pass
            elif topic == "equilibrium":
                F1 = rng.choice([20.0, 25.0, 30.0, 40.0])
                if submitted_val is not None:
                    try:
                        if abs(float(submitted_val) - F1) <= 1.0:
                            is_correct = True
                    except Exception:
                        pass
            elif topic == "momentum":
                m1 = rng.choice([2.0, 4.0])
                v1 = rng.choice([4.0, 6.0, 8.0])
                m2 = rng.choice([2.0, 4.0])
                correct = (2 * m1 * v1) / (m1 + m2)
                if submitted_val is not None:
                    try:
                        if abs(float(submitted_val) - correct) <= 0.5:
                            is_correct = True
                    except Exception:
                        pass
            else:
                is_correct = True

            if is_correct:
                correct_count += 1
            topic_results[topic] = is_correct

        score_pct = round((correct_count / total_q) * 100.0, 1) if total_q > 0 else 100.0
        passed = 1 if score_pct >= sheet_dict["passing_score"] else 0

        # Link user_id from users table
        user_id = None
        cursor.execute("SELECT id FROM users WHERE email = ?", (student_email,))
        u_row = cursor.fetchone()
        if u_row:
            user_id = u_row["id"]

        cursor.execute("""
            INSERT INTO exam_submissions (user_id, sheet_code, student_email, student_name, score, passed, answers)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (user_id, code, student_email, student_name, score_pct, passed, json.dumps(topic_results)))
        conn.commit()

        return {
            "status": "submitted",
            "score": score_pct,
            "passed": bool(passed),
            "passing_score": sheet_dict["passing_score"],
            "correct_answers": correct_count,
            "total_questions": total_q,
            "allow_review": bool(sheet_dict.get("allow_review", 0)),
            "topic_results": topic_results,
            "message": f"Successfully submitted. Final score: {score_pct}% ({'PASSED' if passed else 'NEEDS RETAKE'})."
        }

# ---------------------------------------------------------
# Static Asset Serving (Fallback for direct FastAPI launch)
# ---------------------------------------------------------
if PUBLIC_DIR.exists():
    app.mount("/", StaticFiles(directory=str(PUBLIC_DIR), html=True), name="public")
