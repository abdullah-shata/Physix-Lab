
function typesetMath(el) {
  const run = () => {
    if (window.MathJax && typeof window.MathJax.typesetPromise === "function") {
      window.MathJax.typesetPromise(el ? [el] : undefined).catch(() => {});
    }
  };
  requestAnimationFrame(() => setTimeout(run, 30));
}

/**
 * PhysiX Lab - Interactive Mechanics & EdTech SaaS
 * Production-ready simulation engine, smart equation solver, AI tutor,
 * and B2B Anti-Cheat Instructor Assessment System.
 */

// ============================================================================
// 1. Translations & Internationalization (AR / EN)
// ============================================================================
const I18N = {
  en: {
    brand_name: "PhysiX Lab",
    brand_sub: "Mechanics & Engineering Lab",
    nav_lab: "Interactive Labs",
    nav_solver: "Smart Solver",
    nav_exam: "Practical Exam",
    nav_instructor: "Instructor Portal",
    nav_vision: "Vision OCR",
    btn_login: "Sign In",
    auth_login: "Sign In",
    mod_newton: "Newton's Laws",
    mod_vectors: "Vectors & Resultant",
    mod_equilibrium: "Force Equilibrium",
    mod_projectiles: "Projectile Motion",
    mod_inclined: "Inclined Plane & Friction",
    mod_momentum: "Collisions & Momentum",
    hud_time: "Time (t)",
    hud_vel: "Velocity (v)",
    hud_acc: "Accel (a)",
    hud_pos: "Position (s)",
    hud_energy: "Kinetic Energy",
    btn_run: "Run Simulation",
    btn_pause: "Pause",
    btn_reset: "Reset",
    sim_speed: "Speed:",
    telemetry_title: "Real-Time Telemetry: Velocity (v-t) & Displacement (s-t)",
    params_title: "Experimental Controls",
    governing_eq: "Governing Formulation:",
    level_select: "Level Progression:",
    btn_ai_tutor: "Explain Solution with AI",
    solver_header: "Smart Inverse & Forward Equation Solver",
    solver_sub: "Enter your known mechanics parameters and leave any target variable empty to solve algebraically and simulate instantly.",
    solver_load_sample: "Load Textbook Example",
    solver_config: "Select Physics Discipline",
    solver_topic_label: "Mechanics Topic:",
    btn_solve_unknown: "Solve Algebraic Derivation",
    derivation_steps: "Step-by-Step Algebraic Solution",
    solver_empty_prompt: "Select your mechanics topic, input known parameters, leave the target unknown empty, and click Solve.",
    btn_simulate_solution: "Load Solved Parameters Into Simulation & Run",
    exam_entry_title: "Enter Lab Sheet Code",
    exam_entry_sub: "Instructors provide a designated sheet code. Each student receives deterministic anti-cheat randomized numerical parameters.",
    exam_code_label: "Sheet Code (e.g. MECH-2026):",
    exam_student_email: "Student Email:",
    exam_student_name: "Full Name:",
    btn_start_exam: "Start Practical Assessment",
    btn_submit_exam: "Submit Lab Sheet & Lock Grade",
    btn_return_lab: "Return to Interactive Labs",
    instructor_title: "Instructor & TA Practical Command Center",
    instructor_sub: "Generate randomized anti-cheat lab exam sheets, track cohort analytics, detect curriculum weak spots, and export grade rosters.",
    btn_new_sheet: "Generate New Lab Sheet",
    stat_active_sheets: "Active Lab Sheets",
    stat_total_submissions: "Total Submissions",
    stat_class_avg: "Cohort Class Average",
    stat_pass_rate: "Overall Pass Rate",
    analytics_weak_spots: "Curriculum Weak-Spot Detection",
    analytics_active_sheet: "Select Lab Sheet to Inspect",
    btn_export_csv: "Download Grade Roster (CSV / Excel)",
    submissions_roster: "Student Submissions & Institutional Records",
    th_name: "Student Name",
    th_email: "Email",
    th_score: "Score",
    th_status: "Status",
    th_date: "Submission Date",
    vision_title: "Snap & Simulate: Physics Problem Vision Scanner",
    vision_sub: "Upload an image of a handwritten or textbook mechanics problem. AI automatically extracts physical parameters and loads them into the Smart Solver.",
    vision_drop_prompt: "Drag & Drop Textbook Image Here",
    vision_drop_or: "or click to browse from device",
    btn_browse_files: "Browse Files",
    vision_quick_samples: "Or test with pre-analyzed textbook scans:",
    vision_extracted_header: "Extracted Mechanics Parameters",
    vision_no_image: "No image analyzed yet. Upload a photo or select a sample above.",
    btn_load_vision_solver: "Load Parameters Into Smart Solver",
    modal_auth_title: "Academic Authentication Gate",
    auth_modal_sub: "Institutional sign-in is required. All level stars, simulation derivations, and exam submissions persist in SQLite.",
    auth_gate_title: "Academic Authentication Gate",
    auth_gate_sub: "Sign in to sync your level stars and practical lab assessments.",
    tab_signin: "Sign In",
    tab_register: "Create Account",
    label_role: "Your Academic Role:",
    role_student: "Student",
    role_instructor: "Instructor / TA",
    label_full_name: "Full Name:",
    label_email: "Institutional Email:",
    label_password: "Password:",
    btn_login_submit: "Sign In",
    btn_signin_submit: "Sign In",
    btn_register_submit: "Create Account & Send OTP",
    auth_no_account: "Don't have an account?",
    auth_have_account: "Already have an account?",
    forgot_password_link: "Forgot Password?",
    forgot_password_title: "Reset Password",
    forgot_password_sub: "Enter your registered email to receive a 6-digit reset code.",
    btn_send_reset_code: "Send Reset Code",
    reset_password_title: "Set New Password",
    reset_password_sub: "Enter the 6-digit code sent to your email and your new password.",
    btn_reset_password_submit: "Reset Password & Sign In",
    label_new_password: "New Password (min 6 characters):",
    otp_title: "Enter 6-Digit Email OTP",
    otp_desc: "A 6-digit verification code was dispatched to:",
    otp_expires_in: "Code expires in:",
    btn_verify_otp: "Verify OTP & Launch Platform",
    btn_resend_otp: "Resend Code",
    btn_back_auth: "← Back to Sign In",
    btn_logout: "Sign Out",
    btn_signout: "Sign Out",
    modal_ai_title: "AI Physics Professor & Pedagogical Guide",
    ai_calculating: "Synthesizing step-by-step mathematical explanation...",
    btn_close: "Close",
    modal_create_sheet_title: "Generate Anti-Cheat Lab Sheet",
    quick_create_sheet: "Generate New Anti-Cheat Lab Sheet",
    label_sheet_code: "Unique Sheet Code (e.g. MECH-FALL26):",
    label_sheet_title: "Sheet Title:",
    label_passing_score: "Passing Threshold (%):",
    label_select_topics: "Included Physics Topics:",
    btn_create_sheet_submit: "Deploy Lab Sheet"
  },
  ar: {
    brand_name: "PhysiX Lab",
    brand_sub: "مختبر الميكانيكا والهندسة",
    nav_lab: "المختبر التفاعلي",
    nav_solver: "المعمل العكسي الذكي",
    nav_exam: "اختبار المعمل العملي",
    nav_instructor: "لوحة تحكم المعيد",
    nav_vision: "ماسح المسائل (OCR)",
    btn_login: "تسجيل الدخول",
    auth_login: "تسجيل الدخول",
    mod_newton: "قوانين نيوتن",
    mod_vectors: "المتجهات والمحصلة",
    mod_equilibrium: "اتزان القوى",
    mod_projectiles: "المقذوفات والتسارع",
    mod_inclined: "السطح المائل والاحتكاك",
    mod_momentum: "التصادم وكمية الحركة",
    hud_time: "الزمن (t)",
    hud_vel: "السرعة (v)",
    hud_acc: "التسارع (a)",
    hud_pos: "الإزاحة (s)",
    hud_energy: "طاقة الحركة",
    btn_run: "تشغيل المحاكاة",
    btn_pause: "إيقاف مؤقت",
    btn_reset: "إعادة ضبط",
    sim_speed: "السرعة:",
    telemetry_title: "الرسم البياني اللحظي: السرعة (v-t) والإزاحة (s-t)",
    params_title: "لوحة التحكم التجريبية",
    governing_eq: "المعادلة الفيزيائية الحاكمة:",
    level_select: "مستويات التحدي:",
    btn_ai_tutor: "شرح المسألة بالذكاء الاصطناعي",
    solver_header: "المعمل العكسي وحلال المعادلات الذكي",
    solver_sub: "أدخل المتغيرات المعلومة واترك أي متغير مجهول فارغاً ليقوم النظام بحله جبرياً وتوليد خطوات الاشتقاق ثم محاكاته فوراً.",
    solver_load_sample: "تحميل مسألة نموذجية",
    solver_config: "اختر الفرع الفيزيائي",
    solver_topic_label: "موضوع الميكانيكا:",
    btn_solve_unknown: "حل واستخراج الاشتقاق الجبري",
    derivation_steps: "خطوات الحل الجبري التفصيلي",
    solver_empty_prompt: "اختر الموضوع، أدخل المعطيات، اترك المجهول فارغاً، واضغط حل.",
    btn_simulate_solution: "تحميل المعطيات إلى المحاكاة وتشغيلها",
    exam_entry_title: "دخول الاختبار العملي",
    exam_entry_sub: "أدخل كود ورقة المعمل الممنوح من أستاذ المادة. يحصل كل طالب على معطيات رقمية عشوائية مضادة للغش.",
    exam_code_label: "كود ورقة المعمل (مثل: MECH-2026):",
    exam_student_email: "البريد الإلكتروني للطالب:",
    exam_student_name: "الاسم بالكامل:",
    btn_start_exam: "بدء التقييم العملي",
    btn_submit_exam: "تسليم ورقة المعمل وقفل الدرجة",
    btn_return_lab: "العودة للمختبر التفاعلي",
    instructor_title: "لوحة تحكم الأستاذ والمعيد (B2B)",
    instructor_sub: "توليد أوراق عمل مضادة للغش، متابعة تحليلات الدفعة، كشف نقاط الضعف في المنهج، وتصدير كشوف الدرجات بنقرة واحدة.",
    btn_new_sheet: "إنشاء ورقة معمل جديدة",
    quick_create_sheet: "إنشاء ورقة معمل جديدة مضادة للغش",
    stat_active_sheets: "أوراق المعمل النشطة",
    stat_total_submissions: "إجمالي التسليمات",
    stat_class_avg: "متوسط درجات الدفعة",
    stat_pass_rate: "نسبة النجاح العامة",
    analytics_weak_spots: "كاشف نقاط الضعف في المفاهيم",
    analytics_active_sheet: "ورقة المعمل المراد فحصها",
    btn_export_csv: "تصدير كشف الدرجات (CSV / Excel)",
    submissions_roster: "سجل تسليمات الطلاب المعتمدة",
    th_name: "اسم الطالب",
    th_email: "البريد الإلكتروني",
    th_score: "الدرجة",
    th_status: "الحالة",
    th_date: "تاريخ التسليم",
    vision_title: "التقط وحاكي: ماسح مسائل الفيزياء الذكي",
    vision_sub: "ارفع صورة مسألة من كتاب أو كشكول. يستخرج الذكاء الاصطناعي المتغيرات ويغذيها مباشرة في المعمل العكسي.",
    vision_drop_prompt: "اسحب وأفلت صورة المسألة هنا",
    vision_drop_or: "أو اضغط لاختيار صورة من جهازك",
    btn_browse_files: "استعراض الملفات",
    vision_quick_samples: "أو جرب إحدى المسائل النموذجية الجاهزة:",
    vision_extracted_header: "المعطيات الفيزيائية المستخرجة",
    vision_no_image: "لم يتم فحص أي صورة بعد. ارفع صورة أو اختر عينة أعلاه.",
    btn_load_vision_solver: "تحميل المعطيات في المعمل العكسي",
    modal_auth_title: "بوابة التحقق الأكاديمي الإلزامي",
    auth_modal_sub: "تسجيل الدخول إلزامي لحفظ وتوثيق نجوم المستويات ونتائج المعمل العملي.",
    auth_gate_title: "بوابة التحقق الأكاديمي الإلزامي",
    auth_gate_sub: "سجّل دخولك لمزامنة وحفظ نجوم المستويات والاختبارات العملية.",
    tab_signin: "تسجيل الدخول",
    tab_register: "إنشاء حساب جديد",
    label_role: "صفتك الأكاديمية:",
    role_student: "طالب",
    role_instructor: "أستاذ / معيد",
    label_full_name: "الاسم بالكامل:",
    label_email: "البريد الجامعي:",
    label_password: "كلمة المرور:",
    btn_login_submit: "تسجيل الدخول",
    btn_signin_submit: "تسجيل الدخول",
    btn_register_submit: "إنشاء الحساب وإرسال رمز التحقق",
    auth_no_account: "ليس لديك حساب؟",
    auth_have_account: "لديك حساب بالفعل؟",
    forgot_password_link: "نسيت كلمة المرور؟",
    forgot_password_title: "إعادة تعيين كلمة المرور",
    forgot_password_sub: "أدخل بريدك الإلكتروني لتلقي رمز تعيين كلمة المرور المكون من 6 أرقام.",
    btn_send_reset_code: "إرسال رمز التعيين",
    reset_password_title: "تعيين كلمة المرور الجديدة",
    reset_password_sub: "أدخل الرمز المكون من 6 أرقام وكلمة المرور الجديدة.",
    btn_reset_password_submit: "تحديث كلمة المرور والدخول",
    label_new_password: "كلمة المرور الجديدة (6 أحرف على الأقل):",
    otp_title: "إدخال رمز التحقق (OTP)",
    otp_desc: "تم إرسال رمز تحقق مكوّن من 6 أرقام إلى:",
    otp_expires_in: "ينتهي الرمز خلال:",
    btn_verify_otp: "تأكيد الرمز ودخول المنصة",
    btn_resend_otp: "إعادة إرسال الرمز",
    btn_back_auth: "← العودة لتسجيل الدخول",
    btn_logout: "تسجيل الخروج",
    btn_signout: "تسجيل الخروج",
    modal_ai_title: "أستاذ الفيزياء الذكي والمرشد البيداغوجي",
    ai_calculating: "جاري اشتقاق الحل الفيزيائي والخطوات الرياضية...",
    btn_close: "إغلاق",
    modal_create_sheet_title: "إنشاء ورقة معمل مضادة للغش",
    label_sheet_code: "كود الورقة الفريد (مثل: MECH-FALL26):",
    label_sheet_title: "عنوان ورقة المعمل:",
    label_passing_score: "درجة النجاح الدنيا (%):",
    label_select_topics: "المواضيع الفيزيائية المضمنة:",
    btn_create_sheet_submit: "نشر ورقة المعمل"
  }
};

// ============================================================================
// 2. Audio Effects (Web Audio API Synthesizer)
// ============================================================================
class SoundEffects {
  constructor() {
    this.ctx = null;
  }
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }
  playClick() {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }
  playSuccess() {
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.12, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.25);
      });
    } catch (e) {}
  }
  playThud() {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {}
  }
}
const sfx = new SoundEffects();

// ============================================================================
// 3. Application State & Storage
// ============================================================================
const AppState = {
  lang: localStorage.getItem("physix_lang") || "en",
  theme: localStorage.getItem("physix_theme") || "light",
  user: JSON.parse(localStorage.getItem("physix_user") || "null"),
  activeTab: "lab",
  activeModule: "newton",
  activeLevel: 1,
  simSpeed: 1.0,
  isRunning: false,
  isPaused: false,
  
  // Progress tracker: module_id -> { stars: 0, best_score: 0 }
  progress: {},

  // Simulation physics state
  sim: {
    time: 0.0,
    dt: 0.016,
    x: 0.0,
    y: 0.0,
    vx: 0.0,
    vy: 0.0,
    ax: 0.0,
    ay: 0.0,
    history: [], // For telemetry plotting: [{t, v, s}]
    targetZone: { x: 400, width: 80, y: 0, height: 40 },
    achievedTarget: false
  },

  // Module parameter configs
  params: {
    newton: { m: 5.0, F: 25.0, D: 60.0, targetTime: 4.9 },
    vectors: { F1: 15.0, theta1: 0.0, F2: 20.0, theta2: 60.0, targetRadius: 30.0 },
    equilibrium: { F1: 25.0, theta1: 30.0, F2: 25.0, theta2: 150.0, F3: 25.0, theta3: 270.0 },
    projectiles: { v0: 25.0, theta: 45.0, targetDistance: 63.7 },
    inclined_plane: { m: 5.0, theta: 30.0, mu_s: 0.40, mu_k: 0.25 },
    momentum: { m1: 2.0, v1: 5.0, m2: 3.0, v2: 0.0, e: 1.0, targetZoneX: 550 }
  }
};

// ============================================================================
// 4. Module Definitions & Formulations
// ============================================================================
const MODULE_CONFIGS = {
  newton: {
    title_en: "Newton's 2nd Law Experiment",
    title_ar: "تجربة قانون نيوتن الثاني",
    desc_en: "Apply acceleration a = F/m to slide the mass m across distance D into the green target sensor.",
    desc_ar: "طبق التسارع a = F/m لدفع الكتلة m عبر المسافة D لتتوقف داخل حساس الهدف الأخضر.",
    formula: "a = F / m  |  s = v₀t + ½at²",
    levels: [
      { lvl: 1, title: "L1: Zero Friction Slide", m: 5.0, F: 20.0, D: 50.0, targetTime: 5.0 },
      { lvl: 2, title: "L2: Heavy Mass Precision", m: 12.0, F: 38.4, D: 60.0, targetTime: 6.1 },
      { lvl: 3, title: "L3: High-Speed Narrow Window", m: 3.0, F: 45.0, D: 90.0, targetTime: 3.4 }
    ],
    controls: [
      { id: "m", label: "Mass (m)", label_ar: "كتلة الصندوق (m)", min: 1, max: 20, step: 0.5, unit: "kg" },
      { id: "F", label: "Applied Force (F)", label_ar: "القوة المطبقة (F)", min: 0, max: 100, step: 1, unit: "N" },
      { id: "D", label: "Track Distance (D)", label_ar: "مسافة المسار (D)", min: 20, max: 100, step: 5, unit: "m" }
    ]
  },
  vectors: {
    title_en: "Vector Addition & Resultant",
    title_ar: "جمع المتجهات وتحديد المحصلة",
    desc_en: "Adjust forces F₁ and F₂ to guide the resultant vector R into the dashed target circle.",
    desc_ar: "اضبط القوتين F₁ و F₂ لتوجيه رأس سهم المحصلة R داخل دائرة الهدف المنقطة.",
    formula: "R = √(R_x² + R_y²)  |  θ_R = atan2(R_y, R_x)",
    levels: [
      { lvl: 1, title: "L1: Perpendicular Forces", F1: 20, theta1: 0, F2: 20, theta2: 90, targetRadius: 28.3 },
      { lvl: 2, title: "L2: Oblique Angle Alignment", F1: 15, theta1: 15, F2: 25, theta2: 75, targetRadius: 36.0 },
      { lvl: 3, title: "L3: Target Vector Matching", F1: 30, theta1: 45, F2: 18, theta2: 120, targetRadius: 42.5 }
    ],
    controls: [
      { id: "F1", label: "Force 1 Magnitude (F₁)", label_ar: "مقدار القوة الأولى (F₁)", min: 5, max: 40, step: 1, unit: "N" },
      { id: "theta1", label: "Force 1 Angle (θ₁)", label_ar: "زاوية القوة الأولى (θ₁)", min: 0, max: 360, step: 5, unit: "°" },
      { id: "F2", label: "Force 2 Magnitude (F₂)", label_ar: "مقدار القوة الثانية (F₂)", min: 5, max: 40, step: 1, unit: "N" },
      { id: "theta2", label: "Force 2 Angle (θ₂)", label_ar: "زاوية القوة الثانية (θ₂)", min: 0, max: 360, step: 5, unit: "°" }
    ]
  },
  equilibrium: {
    title_en: "Particle Force Equilibrium",
    title_ar: "اتزان القوى على جسيم نقتي",
    desc_en: "Balance all multi-force vectors so the net resultant force is zero (ΣF_x = 0, ΣF_y = 0).",
    desc_ar: "وازن جميع القوى المؤثرة بحيث تصبح المحصلة صفراً تماماً (ΣF = 0).",
    formula: "ΣF_x = 0  &  ΣF_y = 0  =>  Static Equilibrium",
    levels: [
      { lvl: 1, title: "L1: Symmetric 3-Force Balance", F1: 25, theta1: 30, F2: 25, theta2: 150, F3: 25, theta3: 270 },
      { lvl: 2, title: "L2: Asymmetric Opposition", F1: 35, theta1: 40, F2: 20, theta2: 135, F3: 30, theta3: 260 },
      { lvl: 3, title: "L3: Precision Zero-Net Balance", F1: 40, theta1: 20, F2: 30, theta2: 110, F3: 45, theta3: 240 }
    ],
    controls: [
      { id: "F1", label: "Force 1 (F₁)", label_ar: "القوة الأولى (F₁)", min: 5, max: 50, step: 1, unit: "N" },
      { id: "theta1", label: "Angle 1 (θ₁)", label_ar: "زاوية الأولى (θ₁)", min: 0, max: 360, step: 5, unit: "°" },
      { id: "F2", label: "Force 2 (F₂)", label_ar: "القوة الثانية (F₂)", min: 5, max: 50, step: 1, unit: "N" },
      { id: "theta2", label: "Angle 2 (θ₂)", label_ar: "زاوية الثانية (θ₂)", min: 0, max: 360, step: 5, unit: "°" },
      { id: "F3", label: "Counter Force (F₃)", label_ar: "قوة الموازنة (F₃)", min: 5, max: 60, step: 1, unit: "N" },
      { id: "theta3", label: "Counter Angle (θ₃)", label_ar: "زاوية الموازنة (θ₃)", min: 0, max: 360, step: 5, unit: "°" }
    ]
  },
  projectiles: {
    title_en: "2D Projectile Trajectory",
    title_ar: "مسار حركة المقذوفات",
    desc_en: "Adjust initial velocity v₀ and angle θ to launch the projectile into the designated target pad.",
    desc_ar: "اضبط السرعة الابتدائية v₀ وزاوية الإطلاق θ لإسقاط القذيفة بدقة داخل لوحة الهدف.",
    formula: "R = (v₀² sin(2θ)) / g  |  y(t) = v₀sin(θ)t - ½gt²",
    levels: [
      { lvl: 1, title: "L1: 45° Ideal Range", v0: 25.0, theta: 45.0, targetDistance: 63.7 },
      { lvl: 2, title: "L2: Low-Trajectory High-Speed", v0: 32.0, theta: 25.0, targetDistance: 79.9 },
      { lvl: 3, title: "L3: High-Mortar Lob Target", v0: 28.0, theta: 68.0, targetDistance: 55.4 }
    ],
    controls: [
      { id: "v0", label: "Initial Velocity (v₀)", label_ar: "السرعة الابتدائية (v₀)", min: 5, max: 45, step: 1, unit: "m/s" },
      { id: "theta", label: "Launch Angle (θ)", label_ar: "زاوية الإطلاق (θ)", min: 10, max: 85, step: 1, unit: "°" }
    ]
  },
  inclined_plane: {
    title_en: "Inclined Plane & Friction Dynamics",
    title_ar: "السطح المائل وقوى الاحتكاك",
    desc_en: "Examine static friction threshold and kinetic sliding acceleration. Live vector decomposition rendered.",
    desc_ar: "افحص عتبة الاحتكاك السكوني وانزلاق الصندوق مع تفكيك مباشر لمتجهات الوزن ورد الفعل والاحتكاك.",
    formula: "W_|| = mg sin θ  |  N = mg cos θ  |  f_k = μ_k N",
    levels: [
      { lvl: 1, title: "L1: Smooth Ramp Slide", m: 5.0, theta: 35.0, mu_s: 0.40, mu_k: 0.20 },
      { lvl: 2, title: "L2: Impending Slip Threshold", m: 8.0, theta: 22.0, mu_s: 0.45, mu_k: 0.30 },
      { lvl: 3, title: "L3: Steep High-Friction Balance", m: 6.0, theta: 45.0, mu_s: 0.70, mu_k: 0.50 }
    ],
    controls: [
      { id: "m", label: "Block Mass (m)", label_ar: "كتلة الصندوق (m)", min: 1, max: 20, step: 0.5, unit: "kg" },
      { id: "theta", label: "Incline Angle (θ)", label_ar: "زاوية المنحدر (θ)", min: 5, max: 75, step: 1, unit: "°" },
      { id: "mu_s", label: "Static Friction Coeff (μ_s)", label_ar: "معامل الاحتكاك السكوني (μ_s)", min: 0.05, max: 0.9, step: 0.05, unit: "" },
      { id: "mu_k", label: "Kinetic Friction Coeff (μ_k)", label_ar: "معامل الاحتكاك الحركي (μ_k)", min: 0.02, max: 0.7, step: 0.05, unit: "" }
    ]
  },
  momentum: {
    title_en: "Collisions & Momentum Conservation",
    title_ar: "التصادم وحفظ كمية الحركة",
    desc_en: "Collide mass 1 into mass 2 with restitution coefficient e to push mass 2 into the target sensor.",
    desc_ar: "صدم الكتلة الأولى بالثانية بمعامل ارتداد e لدفع الكتلة الثانية إلى منطقة الحساس.",
    formula: "m₁v₁ + m₂v₂ = m₁v₁' + m₂v₂'  |  e = (v₂' - v₁') / (v₁ - v₂)",
    levels: [
      { lvl: 1, title: "L1: Elastic Equal Masses (e=1.0)", m1: 2.0, v1: 5.0, m2: 2.0, v2: 0.0, e: 1.0, targetZoneX: 600 },
      { lvl: 2, title: "L2: Inelastic Collision (e=0.4)", m1: 4.0, v1: 6.0, m2: 2.0, v2: 0.0, e: 0.4, targetZoneX: 620 },
      { lvl: 3, title: "L3: Massive Target Cart", m1: 2.0, v1: 8.0, m2: 6.0, v2: 0.0, e: 0.8, targetZoneX: 580 }
    ],
    controls: [
      { id: "m1", label: "Cart 1 Mass (m₁)", label_ar: "كتلة العربة 1 (m₁)", min: 1, max: 10, step: 0.5, unit: "kg" },
      { id: "v1", label: "Cart 1 Speed (v₁)", label_ar: "سرعة العربة 1 (v₁)", min: 1, max: 12, step: 0.5, unit: "m/s" },
      { id: "m2", label: "Cart 2 Mass (m₂)", label_ar: "كتلة العربة 2 (m₂)", min: 1, max: 10, step: 0.5, unit: "kg" },
      { id: "e", label: "Restitution Coeff (e)", label_ar: "معامل الارتداد (e)", min: 0.0, max: 1.0, step: 0.1, unit: "" }
    ]
  }
};

// ============================================================================
// 5. Canvas Drawing & Vector Mechanics Simulation Engine
// ============================================================================
class PhysicsSimulationEngine {
  constructor(canvasId, telemetryCanvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.telCanvas = document.getElementById(telemetryCanvasId);
    this.telCtx = this.telCanvas.getContext("2d");
    this.animId = null;
    this.lastTime = 0;
  }

  init() {
    this.resizeCanvas();
    window.addEventListener("resize", () => {
      this.resizeCanvas();
      this.render();
      this.renderTelemetry();
    });
    this.reset();
  }

  resizeCanvas() {
    // Keep internal coordinate resolution stable
    const rect = this.canvas.parentElement.getBoundingClientRect();
    if (rect.width > 200) {
      this.canvas.width = rect.width;
      this.canvas.height = 420;
    }
    const telRect = this.telCanvas.parentElement.getBoundingClientRect();
    if (telRect.width > 200) {
      this.telCanvas.width = telRect.width;
      this.telCanvas.height = 120;
    }
  }

  reset() {
    AppState.isRunning = false;
    AppState.isPaused = false;
    AppState.sim.time = 0.0;
    AppState.sim.x = 0.0;
    AppState.sim.y = 0.0;
    AppState.sim.vx = 0.0;
    AppState.sim.vy = 0.0;
    AppState.sim.ax = 0.0;
    AppState.sim.ay = 0.0;
    AppState.sim.history = [];
    AppState.sim.achievedTarget = false;

    // Reset module specific positioning
    const mod = AppState.activeModule;
    if (mod === "newton") {
      AppState.sim.x = 80;
      AppState.sim.y = 280;
      const D = AppState.params.newton.D;
      AppState.sim.targetZone = { x: 80 + D * 6.5, width: 70, y: 260, height: 40 };
    } else if (mod === "projectiles") {
      AppState.sim.x = 80;
      AppState.sim.y = 340;
      const R = AppState.params.projectiles.targetDistance;
      AppState.sim.targetZone = { x: 80 + R * 12, width: 60, y: 330, height: 20 };
    } else if (mod === "inclined_plane") {
      AppState.sim.x = 0;
      AppState.sim.y = 0;
    } else if (mod === "momentum") {
      AppState.sim.cart1 = { x: 100, vx: AppState.params.momentum.v1, m: AppState.params.momentum.m1 };
      AppState.sim.cart2 = { x: 340, vx: AppState.params.momentum.v2, m: AppState.params.momentum.m2 };
      AppState.sim.targetZone = { x: 550, width: 80, y: 270, height: 40 };
    } else if (mod === "vectors") {
      AppState.sim.sweepProgress = 0.0;
    } else if (mod === "equilibrium") {
      AppState.sim.px = 0.0;
      AppState.sim.py = 0.0;
      AppState.sim.pvx = 0.0;
      AppState.sim.pvy = 0.0;
    }

    this.updateHUD(0, 0, 0, 0, 0);
    this.render();
    this.renderTelemetry();
  }

  start() {
    if (AppState.isRunning && !AppState.isPaused) return;
    sfx.playClick();
    AppState.isRunning = true;
    AppState.isPaused = false;
    this.lastTime = performance.now();
    this.loop();
  }

  pause() {
    AppState.isPaused = true;
  }

  loop(currentTime = performance.now()) {
    if (!AppState.isRunning || AppState.isPaused) return;

    const delta = Math.min((currentTime - this.lastTime) / 1000, 0.05) * AppState.simSpeed;
    this.lastTime = currentTime;

    this.tick(delta);
    this.render();
    this.renderTelemetry();

    this.animId = requestAnimationFrame((t) => this.loop(t));
  }

  tick(dt) {
    AppState.sim.time += dt;
    const mod = AppState.activeModule;
    const p = AppState.params[mod];
    const g = 9.81;

    if (mod === "newton") {
      const a = p.F / p.m;
      AppState.sim.ax = a;
      AppState.sim.vx += a * dt;
      AppState.sim.x += AppState.sim.vx * dt * 25; // Scale for visual canvas
      const distTraveled = (AppState.sim.x - 80) / 6.5;

      // Update telemetry history
      AppState.sim.history.push({ t: AppState.sim.time, v: AppState.sim.vx, s: distTraveled });

      const targetX = AppState.sim.targetZone.x;
      const targetW = AppState.sim.targetZone.width;
      if (AppState.sim.x >= targetX && AppState.sim.x <= targetX + targetW) {
        if (!AppState.sim.achievedTarget) {
          AppState.sim.achievedTarget = true;
          sfx.playSuccess();
          this.awardStars(mod, AppState.activeLevel, 3, 100);
        }
      } else if (AppState.sim.x > targetX + targetW + 60 || AppState.sim.time > 12) {
        AppState.isRunning = false;
      }
      this.updateHUD(AppState.sim.time, AppState.sim.vx, a, distTraveled, 0.5 * p.m * (AppState.sim.vx ** 2));

    } else if (mod === "projectiles") {
      const rad = (p.theta * Math.PI) / 180;
      // Initialize velocity components on first tick
      if (AppState.sim.time <= dt + 0.001) {
        AppState.sim.vx = p.v0 * Math.cos(rad);
        AppState.sim.vy = p.v0 * Math.sin(rad); // positive = upward in physics coords
        AppState.sim.x = 80;
        AppState.sim.y = 340;
      }
      // Physics update (canvas Y-axis is inverted: positive vy = upward)
      AppState.sim.vy -= g * dt;           // gravity reduces upward velocity
      AppState.sim.x += AppState.sim.vx * dt * 12;
      AppState.sim.y -= AppState.sim.vy * dt * 12; // subtract because canvas Y increases downward

      const groundDist = (AppState.sim.x - 80) / 12;
      const currentSpeed = Math.sqrt(AppState.sim.vx ** 2 + AppState.sim.vy ** 2);
      AppState.sim.history.push({ t: AppState.sim.time, v: currentSpeed, s: groundDist });

      // Ground collision detection (canvas groundY = 340)
      if (AppState.sim.y >= 340) {
        AppState.sim.y = 340;
        AppState.isRunning = false;
        // Update targetZone with current params
        const R = p.targetDistance;
        AppState.sim.targetZone = { x: 80 + R * 12, width: 60, y: 330, height: 20 };
        const tz = AppState.sim.targetZone;
        if (AppState.sim.x >= tz.x - 20 && AppState.sim.x <= tz.x + tz.width + 20) {
          sfx.playSuccess();
          const dist_err = Math.abs(AppState.sim.x - (tz.x + tz.width / 2));
          const stars = dist_err < 15 ? 3 : dist_err < 35 ? 2 : 1;
          this.awardStars(mod, AppState.activeLevel, stars, Math.round((1 - dist_err / 60) * 100));
        } else {
          sfx.playThud();
        }
      }
      this.updateHUD(AppState.sim.time, currentSpeed, g, groundDist, 0.5 * p.v0 * (currentSpeed ** 2));

    } else if (mod === "inclined_plane") {
      const rad = (p.theta * Math.PI) / 180;
      const w_par = p.m * g * Math.sin(rad);
      const normal = p.m * g * Math.cos(rad);
      const fs_max = p.mu_s * normal;
      const fk = p.mu_k * normal;

      let a = 0;
      if (w_par > fs_max) {
        a = (w_par - fk) / p.m;
      }
      AppState.sim.ax = a;
      AppState.sim.vx += a * dt;
      AppState.sim.x += AppState.sim.vx * dt * 25;

      AppState.sim.history.push({ t: AppState.sim.time, v: AppState.sim.vx, s: AppState.sim.x / 25 });

      if (AppState.sim.x > 320) {
        AppState.isRunning = false;
        sfx.playSuccess();
        this.awardStars(mod, AppState.activeLevel, 3, 100);
      }
      this.updateHUD(AppState.sim.time, AppState.sim.vx, a, AppState.sim.x / 25, 0.5 * p.m * (AppState.sim.vx ** 2));

    } else if (mod === "momentum") {
      const c1 = AppState.sim.cart1;
      const c2 = AppState.sim.cart2;

      c1.x += c1.vx * dt * 30;
      c2.x += c2.vx * dt * 30;

      // Check collision
      if (c1.x + 50 >= c2.x && c1.vx > c2.vx) {
        sfx.playThud();
        const m1 = c1.m, m2 = c2.m, e = p.e;
        const u1 = c1.vx, u2 = c2.vx;
        const total_m = m1 + m2;
        c1.vx = (m1 * u1 + m2 * u2 - m2 * e * (u1 - u2)) / total_m;
        c2.vx = (m1 * u1 + m2 * u2 + m1 * e * (u1 - u2)) / total_m;
      }

      AppState.sim.history.push({ t: AppState.sim.time, v: c2.vx, s: (c2.x - 340) / 20 });

      if (c2.x >= AppState.sim.targetZone.x && c2.x <= AppState.sim.targetZone.x + AppState.sim.targetZone.width) {
        if (!AppState.sim.achievedTarget) {
          AppState.sim.achievedTarget = true;
          sfx.playSuccess();
          this.awardStars(mod, AppState.activeLevel, 3, 100);
        }
      }

      if (c2.x > AppState.sim.targetZone.x + 120 || AppState.sim.time > 20) {
        AppState.isRunning = false;
      }
      this.updateHUD(AppState.sim.time, c2.vx, 0, (c2.x - 340) / 20, 0.5 * c2.m * (c2.vx ** 2));

    } else if (mod === "vectors") {
      // Animate resultant vector sweep from 0 to full over 1 second
      if (AppState.sim.sweepProgress === undefined) AppState.sim.sweepProgress = 0.0;
      AppState.sim.sweepProgress = Math.min(1.0, AppState.sim.sweepProgress + dt);

      if (AppState.sim.sweepProgress >= 1.0 && !AppState.sim.achievedTarget) {
        // Check if resultant tip lands inside target circle
        const r1 = (p.theta1 * Math.PI) / 180;
        const r2 = (p.theta2 * Math.PI) / 180;
        const Rx = p.F1 * Math.cos(r1) + p.F2 * Math.cos(r2);
        const Ry = p.F1 * Math.sin(r1) + p.F2 * Math.sin(r2);
        const Rmag = Math.sqrt(Rx ** 2 + Ry ** 2);
        const diff = Math.abs(Rmag - p.targetRadius);
        if (diff <= p.targetRadius * 0.08) {
          AppState.sim.achievedTarget = true;
          AppState.isRunning = false;
          sfx.playSuccess();
          const stars = diff <= p.targetRadius * 0.02 ? 3 : diff <= p.targetRadius * 0.05 ? 2 : 1;
          this.awardStars(mod, AppState.activeLevel, stars, Math.round((1 - diff / p.targetRadius) * 100));
        } else {
          AppState.isRunning = false;
          sfx.playThud();
        }
      }
      const r1v = (p.theta1 * Math.PI) / 180;
      const r2v = (p.theta2 * Math.PI) / 180;
      const Rxv = p.F1 * Math.cos(r1v) + p.F2 * Math.cos(r2v);
      const Ryv = p.F1 * Math.sin(r1v) + p.F2 * Math.sin(r2v);
      const Rmagv = Math.sqrt(Rxv ** 2 + Ryv ** 2);
      this.updateHUD(AppState.sim.time, Rmagv * AppState.sim.sweepProgress, 0, Rmagv, 0);

    } else if (mod === "equilibrium") {
      // Compute net force
      const eqP = AppState.params.equilibrium;
      let Fx_net = 0, Fy_net = 0;
      [
        { F: eqP.F1, th: eqP.theta1 },
        { F: eqP.F2, th: eqP.theta2 },
        { F: eqP.F3, th: eqP.theta3 }
      ].forEach(({ F, th }) => {
        const rad = (th * Math.PI) / 180;
        Fx_net += F * Math.cos(rad);
        Fy_net += F * Math.sin(rad);
      });
      const netF = Math.sqrt(Fx_net ** 2 + Fy_net ** 2);
      const mass = 1.0; // unit mass for equilibrium particle

      if (netF > 0.5) {
        // Accelerate particle
        if (AppState.sim.px === undefined) { AppState.sim.px = 0; AppState.sim.py = 0; AppState.sim.pvx = 0; AppState.sim.pvy = 0; }
        AppState.sim.ax = Fx_net / mass;
        AppState.sim.ay = Fy_net / mass;
        AppState.sim.pvx += AppState.sim.ax * dt;
        AppState.sim.pvy += AppState.sim.ay * dt;
        AppState.sim.px += AppState.sim.pvx * dt * 5;
        AppState.sim.py += AppState.sim.pvy * dt * 5;
        const KE = 0.5 * mass * (AppState.sim.pvx ** 2 + AppState.sim.pvy ** 2);
        this.updateHUD(AppState.sim.time, Math.sqrt(AppState.sim.pvx ** 2 + AppState.sim.pvy ** 2), netF / mass, Math.sqrt(AppState.sim.px ** 2 + AppState.sim.py ** 2) / 5, KE);

        // If particle has drifted far off-screen, stop
        const canvas = this.canvas;
        if (canvas && (Math.abs(AppState.sim.px) > canvas.width / 2 + 50 || Math.abs(AppState.sim.py) > canvas.height / 2 + 50)) {
          AppState.isRunning = false;
        }
      } else {
        // Balanced — hold still and award stars
        AppState.sim.pvx = 0; AppState.sim.pvy = 0;
        if (!AppState.sim.achievedTarget) {
          AppState.sim.achievedTarget = true;
          AppState.isRunning = false;
          sfx.playSuccess();
          const stars = netF < 0.1 ? 3 : netF < 0.3 ? 2 : 1;
          this.awardStars(mod, AppState.activeLevel, stars, Math.round((1 - netF / 0.5) * 100));
        }
        this.updateHUD(AppState.sim.time, 0, 0, 0, 0);
      }
    }
  }

  awardStars(module_id, level_id, stars, score) {
    if (!AppState.progress[module_id]) {
      AppState.progress[module_id] = { stars: 0, best_score: 0 };
    }
    const cur = AppState.progress[module_id];
    if (stars > cur.stars) cur.stars = stars;
    if (score > cur.best_score) cur.best_score = score;

    updateUIStars();

    // Sync to backend SQLite database
    if (AppState.user && AppState.user.email) {
      fetch("/api/progress/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: AppState.user.email,
          user_id: AppState.user.id || AppState.user.user_id,
          module_id,
          level_id,
          stars,
          score
        })
      }).catch((e) => console.log("Progress sync:", e));
    }
  }

  updateHUD(t, v, a, s, ke) {
    document.getElementById("hudTime").textContent = `${t.toFixed(2)} s`;
    document.getElementById("hudVelocity").textContent = `${v.toFixed(2)} m/s`;
    document.getElementById("hudAccel").textContent = `${a.toFixed(2)} m/s²`;
    document.getElementById("hudPos").textContent = `${s.toFixed(2)} m`;
    document.getElementById("hudEnergy").textContent = `${ke.toFixed(1)} J`;
  }

  // --------------------------------------------------------------------------
  // Canvas Rendering (Grid paper & vector aesthetics)
  // --------------------------------------------------------------------------
  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const isDark = (AppState.theme === "dark");

    // Clear background
    ctx.fillStyle = isDark ? "#0f1627" : "#f8faf6";
    ctx.fillRect(0, 0, w, h);

    // Draw Vector Paper Grid (50px major, 10px minor)
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = isDark ? "rgba(56, 189, 248, 0.05)" : "rgba(75, 107, 75, 0.07)";
    for (let x = 0; x < w; x += 10) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 10) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Major grid lines
    ctx.lineWidth = 1;
    ctx.strokeStyle = isDark ? "rgba(56, 189, 248, 0.14)" : "rgba(75, 107, 75, 0.15)";
    for (let x = 0; x < w; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
      // Tick marks label
      ctx.fillStyle = isDark ? "rgba(148, 163, 184, 0.4)" : "rgba(100, 116, 139, 0.5)";
      ctx.font = "9px 'JetBrains Mono'";
      ctx.fillText(`${x}m`, x + 3, h - 6);
    }
    for (let y = 0; y < h; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Render active module scene
    const mod = AppState.activeModule;
    if (mod === "newton") {
      this.drawNewtonScene(ctx, w, h, isDark);
    } else if (mod === "vectors") {
      this.drawVectorsScene(ctx, w, h, isDark);
    } else if (mod === "equilibrium") {
      this.drawEquilibriumScene(ctx, w, h, isDark);
    } else if (mod === "projectiles") {
      this.drawProjectileScene(ctx, w, h, isDark);
    } else if (mod === "inclined_plane") {
      this.drawInclinedPlaneScene(ctx, w, h, isDark);
    } else if (mod === "momentum") {
      this.drawMomentumScene(ctx, w, h, isDark);
    }
  }

  drawNewtonScene(ctx, w, h, isDark) {
    const p = AppState.params.newton;
    const groundY = 295;
    const startX = 80;
    const scalePx = 6.2; // px per meter
    const targetX = startX + p.D * scalePx;

    // Ensure targetZone in AppState stays updated with slider D
    AppState.sim.targetZone = { x: targetX - 35, y: groundY - 45, width: 70, height: 45 };

    // 1. Ground Surface Line
    ctx.strokeStyle = isDark ? "#38bdf8" : "#2f4f2f";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(30, groundY);
    ctx.lineTo(w - 30, groundY);
    ctx.stroke();

    // 2. Foundation Diagonal Ground Hatches
    ctx.strokeStyle = isDark ? "rgba(56, 189, 248, 0.15)" : "rgba(75, 107, 75, 0.22)";
    ctx.lineWidth = 1;
    for (let hx = 30; hx <= w - 30; hx += 16) {
      ctx.beginPath();
      ctx.moveTo(hx, groundY);
      ctx.lineTo(hx - 8, groundY + 10);
      ctx.stroke();
    }

    // 3. Distance Tick Marks & Ticks Ruler
    ctx.textAlign = "center";
    for (let dm = 0; dm <= Math.max(100, p.D + 20); dm += 10) {
      const tx = startX + dm * scalePx;
      if (tx < w - 30) {
        const isMajor = (dm % 20 === 0) || (dm === p.D);
        ctx.strokeStyle = isMajor
          ? (isDark ? "rgba(148, 163, 184, 0.6)" : "rgba(100, 116, 139, 0.7)")
          : (isDark ? "rgba(148, 163, 184, 0.25)" : "rgba(100, 116, 139, 0.3)");
        ctx.lineWidth = isMajor ? 2 : 1;
        const tickH = isMajor ? 10 : 5;

        ctx.beginPath();
        ctx.moveTo(tx, groundY);
        ctx.lineTo(tx, groundY + tickH);
        ctx.stroke();

        if (isMajor) {
          ctx.fillStyle = isDark ? "#94a3b8" : "#475569";
          ctx.font = "bold 10px 'JetBrains Mono'";
          ctx.fillText(`${dm}m`, tx, groundY + 22);
        }
      }
    }
    ctx.textAlign = "left";

    // 4. Dimension Line with Distance D
    const dimY = groundY + 36;
    ctx.strokeStyle = isDark ? "#38bdf8" : "#0969da";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(startX, dimY);
    ctx.lineTo(targetX, dimY);
    ctx.stroke();

    // End Ticks for Dimension line
    ctx.beginPath();
    ctx.moveTo(startX, dimY - 4); ctx.lineTo(startX, dimY + 4);
    ctx.moveTo(targetX, dimY - 4); ctx.lineTo(targetX, dimY + 4);
    ctx.stroke();

    // Arrowheads for Dimension line
    this.drawArrowhead(ctx, startX + 8, dimY, startX, dimY, isDark ? "#38bdf8" : "#0969da", 6);
    this.drawArrowhead(ctx, targetX - 8, dimY, targetX, dimY, isDark ? "#38bdf8" : "#0969da", 6);

    // Dimension Text Badge
    const dimText = `D = ${p.D} m`;
    ctx.font = "bold 11px 'JetBrains Mono', Inter, Cairo";
    const dimTextW = ctx.measureText(dimText).width;
    const midX = (startX + targetX) / 2;
    ctx.fillStyle = isDark ? "#121a2e" : "#f8faf6";
    ctx.fillRect(midX - dimTextW / 2 - 6, dimY - 7, dimTextW + 12, 14);
    ctx.fillStyle = isDark ? "#38bdf8" : "#0969da";
    ctx.textAlign = "center";
    ctx.fillText(dimText, midX, dimY + 4);
    ctx.textAlign = "left";

    // 5. Checkered Target Flag at Distance D
    const flagPoleX = targetX;
    const flagPoleBottom = groundY;
    const flagPoleTop = groundY - 68;

    ctx.strokeStyle = isDark ? "#94a3b8" : "#475569";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(flagPoleX, flagPoleBottom);
    ctx.lineTo(flagPoleX, flagPoleTop);
    ctx.stroke();

    // Checkered Flag Banner (Green & White pattern)
    const flagW = 27, flagH = 18;
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 3; c++) {
        ctx.fillStyle = ((r + c) % 2 === 0) ? "#107c41" : "#ffffff";
        ctx.fillRect(flagPoleX + c * (flagW / 3), flagPoleTop + r * (flagH / 2), flagW / 3, flagH / 2);
      }
    }
    ctx.strokeStyle = "#107c41";
    ctx.lineWidth = 1;
    ctx.strokeRect(flagPoleX, flagPoleTop, flagW, flagH);

    // 6. Target Sensor Zone (Glowing box on ground)
    const tz = AppState.sim.targetZone;
    ctx.fillStyle = AppState.sim.achievedTarget ? "rgba(52, 211, 153, 0.4)" : "rgba(16, 124, 65, 0.16)";
    ctx.fillRect(tz.x, tz.y, tz.width, tz.height);
    ctx.strokeStyle = "#107c41";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.strokeRect(tz.x, tz.y, tz.width, tz.height);
    ctx.setLineDash([]);

    ctx.fillStyle = "#107c41";
    ctx.font = "bold 10px Inter, Cairo";
    ctx.fillText("TARGET ZONE", tz.x + 2, tz.y - 8);

    // 7. Mass Block (rendered at initial position or dynamic sim position)
    const bx = (AppState.sim.time > 0 && AppState.sim.x > 0) ? AppState.sim.x : startX;
    const bw = 55, bh = 38;
    const by = groundY - bh - 6;

    // Rollers (two wheels underneath)
    ctx.fillStyle = isDark ? "#64748b" : "#475569";
    ctx.beginPath();
    ctx.arc(bx + 12, groundY - 3.5, 3.5, 0, Math.PI * 2);
    ctx.arc(bx + bw - 12, groundY - 3.5, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Box body
    ctx.fillStyle = isDark ? "#1e293b" : "#ffffff";
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = isDark ? "#38bdf8" : "#0969da";
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bw, bh);

    // Mass Label
    ctx.fillStyle = isDark ? "#f1f5f9" : "#19211d";
    ctx.font = "bold 12px 'JetBrains Mono'";
    ctx.textAlign = "center";
    ctx.fillText(`${p.m} kg`, bx + bw / 2, by + 23);
    ctx.textAlign = "left";

    // 8. Applied Force Vector Arrow (F) with Live Acceleration
    if (p.F > 0) {
      const arrowLen = Math.min(p.F * 1.8, 140);
      const aVal = (p.F / p.m).toFixed(2);
      this.drawVectorArrow(
        ctx,
        bx + bw, by + bh / 2,
        bx + bw + arrowLen, by + bh / 2,
        "#0969da",
        `F = ${p.F} N  (a = ${aVal} m/s²)`,
        2.5,
        "top"
      );
    }
  }

  drawVectorsScene(ctx, w, h, isDark) {
    const p = AppState.params.vectors;
    const cx = w / 2;
    const cy = h / 2;

    // Origin crosshair
    ctx.strokeStyle = isDark ? "rgba(148, 163, 184, 0.3)" : "rgba(100, 116, 139, 0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 180, cy);
    ctx.lineTo(cx + 180, cy);
    ctx.moveTo(cx, cy - 180);
    ctx.lineTo(cx, cy + 180);
    ctx.stroke();

    // Vector 1 (Blue) - label positioned above vector to prevent collision
    const r1 = (p.theta1 * Math.PI) / 180;
    const f1x = cx + p.F1 * 4 * Math.cos(r1);
    const f1y = cy - p.F1 * 4 * Math.sin(r1);
    this.drawVectorArrow(ctx, cx, cy, f1x, f1y, "#0969da", `F₁ = ${p.F1}N (${p.theta1}°)`, 2.5, "top");

    // Vector 2 (Orange) - label positioned below vector to prevent collision
    const r2 = (p.theta2 * Math.PI) / 180;
    const f2x = cx + p.F2 * 4 * Math.cos(r2);
    const f2y = cy - p.F2 * 4 * Math.sin(r2);
    this.drawVectorArrow(ctx, cx, cy, f2x, f2y, "#d97706", `F₂ = ${p.F2}N (${p.theta2}°)`, 2.5, "bottom");

    // Resultant R = F1 + F2 (Green) - label in high-contrast pill badge at tip
    const Rx = p.F1 * Math.cos(r1) + p.F2 * Math.cos(r2);
    const Ry = p.F1 * Math.sin(r1) + p.F2 * Math.sin(r2);
    const Rmag = Math.sqrt(Rx ** 2 + Ry ** 2);
    const R_theta = (Math.atan2(Ry, Rx) * 180) / Math.PI;
    const R_x_pos = cx + Rx * 4;
    const R_y_pos = cy - Ry * 4;

    this.drawVectorArrow(ctx, cx, cy, R_x_pos, R_y_pos, "#107c41", `R = ${Rmag.toFixed(1)}N (${R_theta.toFixed(1)}°)`, 3.5, "pill");

    // Target circle for mastery — dashed green ring
    const targetRad = p.targetRadius * 4;
    ctx.beginPath();
    ctx.arc(cx, cy, targetRad, 0, Math.PI * 2);
    ctx.strokeStyle = AppState.sim.achievedTarget ? "rgba(16, 124, 65, 0.9)" : "rgba(16, 124, 65, 0.5)";
    ctx.lineWidth = AppState.sim.achievedTarget ? 3 : 2;
    ctx.setLineDash([6, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
    // Label the target circle
    ctx.fillStyle = "rgba(16, 124, 65, 0.7)";
    ctx.font = "bold 10px 'JetBrains Mono'";
    ctx.textAlign = "center";
    ctx.fillText(`TARGET |R| ≈ ${p.targetRadius.toFixed(1)} N`, cx, cy - targetRad - 8);
    ctx.textAlign = "left";

    // Animated resultant sweep (during simulation)
    if (AppState.isRunning || (AppState.sim.time > 0 && AppState.sim.sweepProgress !== undefined)) {
      const sweep = AppState.sim.sweepProgress !== undefined ? AppState.sim.sweepProgress : 1.0;
      const r1s = (p.theta1 * Math.PI) / 180;
      const r2s = (p.theta2 * Math.PI) / 180;
      const Rxs = p.F1 * Math.cos(r1s) + p.F2 * Math.cos(r2s);
      const Rys = p.F1 * Math.sin(r1s) + p.F2 * Math.sin(r2s);
      const Rx_anim = cx + Rxs * 4 * sweep;
      const Ry_anim = cy - Rys * 4 * sweep;
      // Draw animated resultant with glow
      ctx.save();
      ctx.shadowColor = "#34d399";
      ctx.shadowBlur = 10;
      this.drawVectorArrow(ctx, cx, cy, Rx_anim, Ry_anim, AppState.sim.achievedTarget ? "#34d399" : "#107c41",
        sweep >= 1.0 ? `R = ${Math.sqrt(Rxs**2+Rys**2).toFixed(1)}N` : "", 3.5, "pill");
      ctx.restore();
    }
  }

  drawEquilibriumScene(ctx, w, h, isDark) {
    const p = AppState.params.equilibrium;
    const cx = (w / 2) + (AppState.sim.px || 0);
    const cy = (h / 2) - (AppState.sim.py || 0);

    // Forces
    const forces = [
      { F: p.F1, th: p.theta1, color: "#0969da", label: "F₁" },
      { F: p.F2, th: p.theta2, color: "#d97706", label: "F₂" },
      { F: p.F3, th: p.theta3, color: "#9333ea", label: "F₃" }
    ];

    let sumX = 0, sumY = 0;
    forces.forEach((f) => {
      const rad = (f.th * Math.PI) / 180;
      sumX += f.F * Math.cos(rad);
      sumY += f.F * Math.sin(rad);
      const ex = cx + f.F * 3 * Math.cos(rad);
      const ey = cy - f.F * 3 * Math.sin(rad);
      this.drawVectorArrow(ctx, cx, cy, ex, ey, f.color, `${f.label}: ${f.F}N`);
    });

    const netR = Math.sqrt(sumX ** 2 + sumY ** 2);
    const isBalanced = netR <= 0.5;

    // Center particle
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fillStyle = isBalanced ? "#107c41" : "#cf222e";
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // HUD badge on canvas
    ctx.font = "bold 13px Inter, Cairo";
    ctx.fillStyle = isBalanced ? "#107c41" : "#cf222e";
    ctx.fillText(
      isBalanced ? "✓ ΣF = 0 (EQUILIBRIUM ACHIEVED!)" : `ΣF_x = ${sumX.toFixed(1)} N, ΣF_y = ${sumY.toFixed(1)} N`,
      cx - 110,
      cy + 130
    );
  }

  drawProjectileScene(ctx, w, h, isDark) {
    const p = AppState.params.projectiles;
    const startX = 80;
    const groundY = 340;

    // Ground line
    ctx.strokeStyle = isDark ? "#38bdf8" : "#2f4f2f";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(40, groundY);
    ctx.lineTo(w - 40, groundY);
    ctx.stroke();

    // Target pad
    const tz = AppState.sim.targetZone;
    ctx.fillStyle = "rgba(16, 124, 65, 0.25)";
    ctx.fillRect(tz.x, tz.y, tz.width, tz.height);
    ctx.strokeStyle = "#107c41";
    ctx.lineWidth = 2;
    ctx.strokeRect(tz.x, tz.y, tz.width, tz.height);
    ctx.fillStyle = "#107c41";
    ctx.font = "bold 11px Inter, Cairo";
    ctx.fillText("TARGET PAD", tz.x + 4, tz.y - 6);

    // Theoretical Parabolic trajectory trail (dotted)
    const rad = (p.theta * Math.PI) / 180;
    const vx0 = p.v0 * Math.cos(rad);
    const vy0 = p.v0 * Math.sin(rad);
    const t_flight = (2 * vy0) / 9.81;

    ctx.beginPath();
    ctx.strokeStyle = isDark ? "rgba(56, 189, 248, 0.4)" : "rgba(9, 105, 218, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);

    for (let t = 0; t <= t_flight; t += 0.05) {
      const px = startX + vx0 * t * 12;
      const py = groundY - (vy0 * t - 0.5 * 9.81 * (t ** 2)) * 12;
      if (t === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Cannon
    ctx.save();
    ctx.translate(startX, groundY);
    ctx.rotate(-rad);
    ctx.fillStyle = isDark ? "#475569" : "#334155";
    ctx.fillRect(0, -10, 45, 20);
    ctx.restore();

    // Wheel
    ctx.beginPath();
    ctx.arc(startX, groundY, 12, 0, Math.PI * 2);
    ctx.fillStyle = "#64748b";
    ctx.fill();

    // Projectile ball
    if (AppState.isRunning || AppState.sim.time > 0) {
      ctx.beginPath();
      ctx.arc(AppState.sim.x, AppState.sim.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = "#cf222e";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  drawInclinedPlaneScene(ctx, w, h, isDark) {
    const p = AppState.params.inclined_plane;
    const rampStartX = 120;
    const rampStartY = 330;
    const rampLength = 480;
    const rad = (p.theta * Math.PI) / 180;

    const rampEndX = rampStartX + rampLength * Math.cos(rad);
    const rampEndY = rampStartY - rampLength * Math.sin(rad);

    // Draw Ramp Triangle
    ctx.beginPath();
    ctx.moveTo(rampStartX, rampStartY);
    ctx.lineTo(rampEndX, rampEndY);
    ctx.lineTo(rampEndX, rampStartY);
    ctx.closePath();

    ctx.fillStyle = isDark ? "rgba(30, 41, 59, 0.7)" : "rgba(226, 232, 240, 0.6)";
    ctx.fill();
    ctx.strokeStyle = isDark ? "#38bdf8" : "#0969da";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Angle Arc
    ctx.beginPath();
    ctx.arc(rampStartX, rampStartY, 50, -rad, 0);
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#d97706";
    ctx.font = "bold 12px 'JetBrains Mono'";
    ctx.fillText(`θ = ${p.theta}°`, rampStartX + 58, rampStartY - 10);

    // Block on Ramp
    const blockDist = 280 - AppState.sim.x; // Slides downwards
    const bx = rampStartX + blockDist * Math.cos(rad);
    const by = rampStartY - blockDist * Math.sin(rad);

    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(-rad);

    // Block
    ctx.fillStyle = isDark ? "#1e293b" : "#ffffff";
    ctx.fillRect(-25, -35, 50, 35);
    ctx.strokeStyle = isDark ? "#34d399" : "#107c41";
    ctx.lineWidth = 2;
    ctx.strokeRect(-25, -35, 50, 35);

    // Mass label
    ctx.fillStyle = isDark ? "#f1f5f9" : "#19211d";
    ctx.font = "bold 11px 'JetBrains Mono'";
    ctx.textAlign = "center";
    ctx.fillText(`${p.m}kg`, 0, -14);

    // Vectors decomposed
    // Normal Force N (upwards perp)
    this.drawVectorArrow(ctx, 0, -17, 0, -85, "#0969da", "N");
    // Friction force f_k (opposing slide, up ramp)
    this.drawVectorArrow(ctx, 0, 0, 60, 0, "#d97706", "f_k");
    // Driving force mg sin theta (down ramp)
    this.drawVectorArrow(ctx, 0, 0, -70, 0, "#cf222e", "mg sinθ");

    ctx.restore();
  }

  drawMomentumScene(ctx, w, h, isDark) {
    const p = AppState.params.momentum;
    const trackY = 300;

    // Linear air track
    ctx.strokeStyle = isDark ? "#38bdf8" : "#2f4f2f";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(50, trackY);
    ctx.lineTo(w - 50, trackY);
    ctx.stroke();

    // Target sensor zone
    const tz = AppState.sim.targetZone;
    ctx.fillStyle = "rgba(16, 124, 65, 0.2)";
    ctx.fillRect(tz.x, trackY - 40, tz.width, 40);
    ctx.strokeStyle = "#107c41";
    ctx.lineWidth = 2;
    ctx.strokeRect(tz.x, trackY - 40, tz.width, 40);
    ctx.fillStyle = "#107c41";
    ctx.font = "bold 10px Inter, Cairo";
    ctx.fillText("SENSOR PAD", tz.x + 8, trackY - 45);

    const c1 = AppState.sim.cart1 || { x: 100, m: p.m1, vx: p.v1 };
    const c2 = AppState.sim.cart2 || { x: 340, m: p.m2, vx: p.v2 };

    // Cart 1
    ctx.fillStyle = isDark ? "#0284c7" : "#0969da";
    ctx.fillRect(c1.x, trackY - 35, 50, 35);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 11px 'JetBrains Mono'";
    ctx.fillText(`${c1.m}kg`, c1.x + 12, trackY - 14);

    // Cart 2
    ctx.fillStyle = isDark ? "#d97706" : "#b45309";
    ctx.fillRect(c2.x, trackY - 35, 50, 35);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 11px 'JetBrains Mono'";
    ctx.fillText(`${c2.m}kg`, c2.x + 12, trackY - 14);
  }

  drawArrowhead(ctx, fromX, fromY, toX, toY, color, headLen = 8) {
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawVectorArrow(ctx, fromX, fromY, toX, toY, color, label = "", lineWidth = 2, labelPos = "auto") {
    const headLen = 10;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const isDark = (AppState.theme === "dark");

    // Perpendicular unit vector (normal)
    const nx = -dy / len;
    const ny = dx / len;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;

    // Line
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    // Label with intelligent offset to avoid collisions
    if (label) {
      ctx.font = "bold 11px 'JetBrains Mono', Inter, Cairo";

      if (labelPos === "pill") {
        // High-contrast badge pill for Resultant vector R
        const m = ctx.measureText(label);
        const pw = m.width + 12;
        const ph = 20;
        // Positioned along vector outward beyond arrowhead
        const px = toX + (dx / len) * 16 - (dx < 0 ? pw : 0);
        const py = toY + (dy / len) * 16 - ph / 2;

        ctx.fillStyle = isDark ? "rgba(6, 78, 59, 0.95)" : "rgba(209, 250, 229, 0.95)";
        ctx.strokeStyle = "#107c41";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(px, py, pw, ph, 4);
        } else {
          ctx.rect(px, py, pw, ph);
        }
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isDark ? "#34d399" : "#107c41";
        ctx.fillText(label, px + 6, py + 14);

      } else if (labelPos === "top") {
        // Offset perpendicular above vector (e.g. for F1)
        const lx = toX + nx * 16;
        const ly = toY + ny * 16;
        ctx.fillText(label, lx, ly);

      } else if (labelPos === "bottom") {
        // Offset perpendicular below vector (e.g. for F2)
        const lx = toX - nx * 16;
        const ly = toY - ny * 16;
        ctx.fillText(label, lx, ly);

      } else {
        // Default standard offset
        ctx.fillText(label, toX + 6, toY - 4);
      }
    }
    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // Telemetry Graph Plotter (v-t & s-t curves)
  // --------------------------------------------------------------------------
  renderTelemetry() {
    const ctx = this.telCtx;
    const w = this.telCanvas.width;
    const h = this.telCanvas.height;
    const history = AppState.sim.history;
    const isDark = (AppState.theme === "dark");

    ctx.fillStyle = isDark ? "#0f1627" : "#f8faf6";
    ctx.fillRect(0, 0, w, h);

    // Axes lines
    ctx.strokeStyle = isDark ? "rgba(148, 163, 184, 0.2)" : "rgba(100, 116, 139, 0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(35, 10);
    ctx.lineTo(35, h - 20);
    ctx.lineTo(w - 10, h - 20);
    ctx.stroke();

    if (history.length < 2) return;

    const maxT = Math.max(5.0, history[history.length - 1].t);
    const maxV = Math.max(10.0, ...history.map((pt) => pt.v));
    const maxS = Math.max(20.0, ...history.map((pt) => pt.s));

    // Plot Velocity (v-t) in Blue
    ctx.beginPath();
    ctx.strokeStyle = "#0969da";
    ctx.lineWidth = 2;
    history.forEach((pt, i) => {
      const px = 35 + (pt.t / maxT) * (w - 55);
      const py = (h - 20) - (pt.v / maxV) * (h - 35);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();

    // Plot Displacement (s-t) in Emerald
    ctx.beginPath();
    ctx.strokeStyle = "#107c41";
    ctx.lineWidth = 2;
    history.forEach((pt, i) => {
      const px = 35 + (pt.t / maxT) * (w - 55);
      const py = (h - 20) - (pt.s / maxS) * (h - 35);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();
  }
}

// ============================================================================
// 6. UI Controller & Dynamic Handlers
// ============================================================================
let simEngine = null;

document.addEventListener("DOMContentLoaded", () => {
  try {
    setupAuthGate();
  } catch (e) {
    const v = document.getElementById("authPageView");
    const w = document.getElementById("mainWorkspace");
    if (v && !AppState.user) {
      v.style.display = "flex";
      if (w) w.style.display = "none";
    }
  }

  // Initialize Engine
  simEngine = new PhysicsSimulationEngine("simCanvas", "telemetryCanvas");
  simEngine.init();

  // Setup Theme & Language
  applyTheme(AppState.theme);
  applyLanguage(AppState.lang);

  // Setup Navigation Tabs
  setupNavTabs();

  // Setup Module Selector
  setupModuleChips();

  // Setup Parameter Controls
  renderModuleControls(AppState.activeModule);
  simEngine.reset();

  // Setup Simulation Execution Buttons
  setupSimControls();

  // Setup Smart Solver Tab
  setupSmartSolver();

  // Setup AI Tutor
  setupAiTutor();
  setInterval(() => typesetMath(), 600);

  // Setup Practical Exam Mode
  setupExamMode();

  // Setup Instructor Portal
  setupInstructorPortal();

  // Setup Vision OCR Scanner
  setupVisionScanner();
});

// ----------------------------------------------------------------------------
// Navigation & Tab Switching
// ----------------------------------------------------------------------------
function setupNavTabs() {
  const tabs = document.querySelectorAll(".nav-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      if (!AppState.user) {
        const v = document.getElementById("authPageView");
        const w = document.getElementById("mainWorkspace");
        if (v) v.style.display = "flex";
        if (w) w.style.display = "none";
        return;
      }
      const target = tab.dataset.tab;
      AppState.activeTab = target;
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      document.querySelectorAll(".tab-pane").forEach((pane) => {
        pane.classList.remove("active");
      });
      const activePane = document.getElementById(`pane-${target}`);
      if (activePane) activePane.classList.add("active");

      // Seamless Exam Preservation: if active exam session is ongoing, keep examActiveSheet displayed
      if (target === "exam") {
        if (AppState.activeExam && !AppState.activeExam.submitted) {
          const entryBox = document.getElementById("examEntryBox");
          const activeSheet = document.getElementById("examActiveSheet");
          if (entryBox && activeSheet && document.getElementById("examQuestionsList")?.children.length > 0) {
            entryBox.style.display = "none";
            activeSheet.style.display = "block";
          }
        }
      }

      // Redraw simulation if returning to lab tab
      if (target === "lab") {
        setTimeout(() => {
          simEngine?.resizeCanvas?.();
          simEngine?.render?.();
          simEngine?.renderTelemetry?.();
          simEngine?.draw?.();
        }, 50);
      } else if (target === "instructor") {
        refreshInstructorSheets();
      }
    });
  });
}

function setupModuleChips() {
  const chips = document.querySelectorAll(".module-chip");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const mod = chip.dataset.module;
      AppState.activeModule = mod;
      AppState.activeLevel = 1;
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");

      renderModuleControls(mod);
      updateMissionBanner(mod, 1);
      simEngine.reset();
    });
  });
}

function updateMissionBanner(mod, level) {
  const cfg = MODULE_CONFIGS[mod];
  const isAr = (AppState.lang === "ar");
  document.getElementById("missionTitle").textContent = isAr ? cfg.title_ar : cfg.title_en;
  document.getElementById("missionDesc").textContent = isAr ? cfg.desc_ar : cfg.desc_en;
  document.getElementById("missionLevelBadge").textContent = `Level ${level}`;
  document.getElementById("formulaMathDisplay").textContent = cfg.formula;
  document.getElementById("activeModuleBadge").textContent = mod.toUpperCase();

  // Update dots
  document.querySelectorAll(".level-dot").forEach((dot) => {
    dot.classList.toggle("active", parseInt(dot.dataset.lvl) === level);
  });
}

function renderModuleControls(mod) {
  const container = document.getElementById("dynamicControlsForm");
  container.innerHTML = "";
  const cfg = MODULE_CONFIGS[mod];
  const params = AppState.params[mod];
  const isAr = (AppState.lang === "ar");

  cfg.controls.forEach((ctrl) => {
    const val = params[ctrl.id];
    const group = document.createElement("div");
    group.className = "slider-group";
    const ctrlLabel = (isAr && ctrl.label_ar) ? ctrl.label_ar : ctrl.label;
    group.innerHTML = `
      <div class="slider-label-row">
        <span>${ctrlLabel}</span>
        <span class="slider-val" id="val-${ctrl.id}">${val} ${ctrl.unit}</span>
      </div>
      <input type="range" class="range-slider" id="slider-${ctrl.id}"
             min="${ctrl.min}" max="${ctrl.max}" step="${ctrl.step}" value="${val}">
    `;
    container.appendChild(group);

    const slider = group.querySelector(`#slider-${ctrl.id}`);
    slider.addEventListener("input", (e) => {
      const n = parseFloat(e.target.value);
      params[ctrl.id] = n;
      document.getElementById(`val-${ctrl.id}`).textContent = `${n} ${ctrl.unit}`;
      simEngine.reset();
    });
  });

  // Level selector dots
  document.querySelectorAll(".level-dot").forEach((dot) => {
    dot.onclick = () => {
      const lvl = parseInt(dot.dataset.lvl);
      AppState.activeLevel = lvl;
      const lvlConfig = cfg.levels.find((l) => l.lvl === lvl);
      if (lvlConfig) {
        Object.keys(lvlConfig).forEach((k) => {
          if (params[k] !== undefined) params[k] = lvlConfig[k];
        });
        renderModuleControls(mod);
      }
      updateMissionBanner(mod, lvl);
      simEngine.reset();
    };
  });
}

function setupSimControls() {
  document.getElementById("runSimBtn").addEventListener("click", () => simEngine.start());
  document.getElementById("pauseSimBtn").addEventListener("click", () => simEngine.pause());
  document.getElementById("resetSimBtn").addEventListener("click", () => simEngine.reset());

  // Speed chips
  document.querySelectorAll(".speed-control .btn-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".speed-control .btn-chip").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      AppState.simSpeed = parseFloat(btn.dataset.speed);
    });
  });
}

// ----------------------------------------------------------------------------
// Theme & Internationalization (Language)
// ----------------------------------------------------------------------------
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  AppState.theme = theme;
  localStorage.setItem("physix_theme", theme);

  const sun = document.getElementById("themeIconSun");
  const moon = document.getElementById("themeIconMoon");
  if (theme === "dark") {
    sun.style.display = "none";
    moon.style.display = "block";
  } else {
    sun.style.display = "block";
    moon.style.display = "none";
  }
  if (simEngine) simEngine.render();
}

document.getElementById("themeToggle").addEventListener("click", () => {
  applyTheme(AppState.theme === "dark" ? "light" : "dark");
});

function applyLanguage(lang) {
  AppState.lang = lang;
  localStorage.setItem("physix_lang", lang);
  document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  document.documentElement.setAttribute("lang", lang);

  document.getElementById("langLabel").textContent = lang === "ar" ? "English" : "العربية";

  const dict = I18N[lang];
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });

  // Re-translate topic dropdown
  const topicSelect = document.getElementById("solverTopicSelect");
  if (topicSelect && topicSelect.options.length >= 5) {
    if (lang === "ar") {
      topicSelect.options[0].text = "الحركة الخطية وقانون نيوتن الثاني";
      topicSelect.options[1].text = "المقذوفات في بعدين والمسار المنحني";
      topicSelect.options[2].text = "السطح المائل والاحتكاك السكوني والحركي";
      topicSelect.options[3].text = "جمع المتجهات ومحصلة القوى";
      topicSelect.options[4].text = "حفظ كمية الحركة والتصادمات";
    } else {
      topicSelect.options[0].text = "Linear Kinematics & Newton's 2nd Law";
      topicSelect.options[1].text = "2D Projectile Motion & Parabolic Trajectory";
      topicSelect.options[2].text = "Inclined Plane with Static/Kinetic Friction";
      topicSelect.options[3].text = "Vector Addition & Force Resultants";
      topicSelect.options[4].text = "Conservation of Linear Momentum & Restitution";
    }
  }

  updateMissionBanner(AppState.activeModule, AppState.activeLevel);
  renderModuleControls(AppState.activeModule);
  if (topicSelect) renderSolverInputs(topicSelect.value);
  if (simEngine) simEngine.render();
}

document.getElementById("langToggle").addEventListener("click", () => {
  applyLanguage(AppState.lang === "ar" ? "en" : "ar");
});

function updateUIStars() {
  let total = 0;
  Object.keys(AppState.progress).forEach((m) => {
    const s = AppState.progress[m].stars || 0;
    total += s;
    const chipStars = document.getElementById(`chipStars-${m}`);
    if (chipStars) chipStars.textContent = `★ ${s}/3`;
  });
  document.getElementById("totalStarsCount").textContent = total;

  const currentModStars = AppState.progress[AppState.activeModule]?.stars || 0;
  const starsContainer = document.getElementById("currentLevelStars");
  if (starsContainer) {
    const starEls = starsContainer.querySelectorAll(".star");
    starEls.forEach((el, idx) => {
      el.classList.toggle("earned", idx < currentModStars);
    });
  }
}

// ----------------------------------------------------------------------------
// Smart Inverse & Forward Equation Solver Tab
// ----------------------------------------------------------------------------
function setupSmartSolver() {
  const topicSelect = document.getElementById("solverTopicSelect");
  renderSolverInputs(topicSelect.value);

  topicSelect.addEventListener("change", (e) => {
    renderSolverInputs(e.target.value);
  });

  document.getElementById("executeSolveBtn").addEventListener("click", executeSolve);

  document.getElementById("solverQuickSampleBtn").addEventListener("click", () => {
    topicSelect.value = "kinematics";
    renderSolverInputs("kinematics");
    document.getElementById("sol_var_F").value = "30";
    document.getElementById("sol_var_m").value = ""; // target unknown
    document.getElementById("sol_var_a").value = "6";
    executeSolve();
  });

  document.getElementById("loadIntoSimBtn").addEventListener("click", () => {
    const topicMap = {
      kinematics: "newton",
      projectile: "projectiles",
      inclined_plane: "inclined_plane",
      forces: "vectors",
      momentum: "momentum"
    };
    const targetMod = topicMap[topicSelect.value] || "newton";
    document.querySelector('.nav-tab[data-tab="lab"]').click();
    const chip = document.querySelector(`.module-chip[data-module="${targetMod}"]`);
    if (chip) chip.click();
    renderModuleControls(targetMod);
    simEngine.reset();
    simEngine.start();
  });
}

function renderSolverInputs(topic) {
  const container = document.getElementById("solverInputsContainer");
  container.innerHTML = "";
  const isAr = (AppState.lang === "ar");

  const fieldConfigs = {
    kinematics: [
      { id: "F", label: "Applied Force (F) [N]", label_ar: "القوة المطبقة (F) [N]", placeholder: "Enter value" },
      { id: "m", label: "Mass (m) [kg]", label_ar: "الكتلة (m) [kg]", placeholder: "Enter value" },
      { id: "a", label: "Acceleration (a) [m/s²]", label_ar: "التسارع (a) [m/s²]", placeholder: "Enter value" },
      { id: "v0", label: "Initial Velocity (v₀) [m/s]", label_ar: "السرعة الابتدائية (v₀) [m/s]", placeholder: "Enter value" },
      { id: "s", label: "Displacement (s) [m]", label_ar: "الإزاحة (s) [m]", placeholder: "Enter value" },
      { id: "t", label: "Travel Time (t) [s]", label_ar: "زمن الحركة (t) [s]", placeholder: "Enter value" }
    ],
    projectile: [
      { id: "v0", label: "Launch Speed (v₀) [m/s]", label_ar: "السرعة الابتدائية (v₀) [m/s]", placeholder: "Enter value" },
      { id: "theta", label: "Launch Angle (θ) [°]", label_ar: "زاوية الإطلاق (θ) [°]", placeholder: "Enter value" },
      { id: "range", label: "Ground Range (R) [m]", label_ar: "المدى الأفقي (R) [m]", placeholder: "Enter value" }
    ],
    inclined_plane: [
      { id: "m", label: "Mass (m) [kg]", label_ar: "الكتلة (m) [kg]", placeholder: "Enter value" },
      { id: "theta", label: "Incline Angle (θ) [°]", label_ar: "زاوية المنحدر (θ) [°]", placeholder: "Enter value" },
      { id: "mu_s", label: "Static Friction (μ_s)", label_ar: "معامل الاحتكاك السكوني (μ_s)", placeholder: "Enter value" },
      { id: "mu_k", label: "Kinetic Friction (μ_k)", label_ar: "معامل الاحتكاك الحركي (μ_k)", placeholder: "Enter value" }
    ],
    forces: [
      { id: "F1", label: "Force 1 (F₁) [N]", label_ar: "القوة الأولى (F₁) [N]", placeholder: "Enter value" },
      { id: "theta1", label: "Angle 1 (θ₁) [°]", label_ar: "زاوية 1 (θ₁) [°]", placeholder: "Enter value" },
      { id: "F2", label: "Force 2 (F₂) [N]", label_ar: "القوة الثانية (F₂) [N]", placeholder: "Enter value" },
      { id: "theta2", label: "Angle 2 (θ₂) [°]", label_ar: "زاوية 2 (θ₂) [°]", placeholder: "Enter value" }
    ],
    momentum: [
      { id: "m1", label: "Cart 1 Mass (m₁) [kg]", label_ar: "كتلة العربة 1 (m₁) [kg]", placeholder: "Enter value" },
      { id: "v1", label: "Cart 1 Speed (v₁) [m/s]", label_ar: "سرعة العربة 1 (v₁) [m/s]", placeholder: "Enter value" },
      { id: "m2", label: "Cart 2 Mass (m₂) [kg]", label_ar: "كتلة العربة 2 (m₂) [kg]", placeholder: "Enter value" },
      { id: "v2", label: "Cart 2 Speed (v₂) [m/s]", label_ar: "سرعة العربة 2 (v₂) [m/s]", placeholder: "Enter value" },
      { id: "e", label: "Restitution (e) [0-1]", label_ar: "معامل الارتداد (e) [0-1]", placeholder: "Enter value" }
    ]
  };

  const fields = fieldConfigs[topic] || [];
  fields.forEach((f) => {
    const d = document.createElement("div");
    d.className = "solver-var-input";
    const lbl = (isAr && f.label_ar) ? f.label_ar : f.label;
    const ph = isAr ? "أدخل القيمة" : f.placeholder;
    d.innerHTML = `
      <label class="solver-var-label">${lbl}</label>
      <input type="number" step="any" id="sol_var_${f.id}" placeholder="${ph}" value="">
    `;
    container.appendChild(d);
  });
}

async function executeSolve() {
  const topic = document.getElementById("solverTopicSelect").value;
  const variables = {};

  document.querySelectorAll(".solver-var-input input").forEach((inp) => {
    const key = inp.id.replace("sol_var_", "");
    const val = inp.value.trim();
    variables[key] = val !== "" ? parseFloat(val) : null;
  });

  const bodyEl = document.getElementById("derivationBody");
  bodyEl.innerHTML = `<div class="loading-spinner-box"><div class="spinner"></div><p>Calculating algebraic derivation...</p></div>`;
  typesetMath(document.getElementById(bodyEl) || (typeof bodyEl === 'object' ? bodyEl : null));

  try {
    const res = await fetch("/api/solver/solve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic,
        variables,
        language: AppState.lang
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Solver error");

    document.getElementById("solveStatusBadge").style.display = "inline-flex";
    bodyEl.innerHTML = "";
    typesetMath(document.getElementById(bodyEl) || (typeof bodyEl === 'object' ? bodyEl : null));

    // Render Derivation Steps
    data.derivation_steps.forEach((step, idx) => {
      const stepDiv = document.createElement("div");
      stepDiv.className = "derivation-step";
      stepDiv.innerHTML = `<strong>Step ${idx + 1}:</strong> ${step}`;
      bodyEl.appendChild(stepDiv);
    });

    // Populate into AppState params
    if (data.simulation_parameters) {
      if (topic === "kinematics") {
        AppState.params.newton.m = data.simulation_parameters.m;
        AppState.params.newton.F = data.simulation_parameters.F;
        AppState.params.newton.D = data.simulation_parameters.s;
      } else if (topic === "projectile") {
        AppState.params.projectiles.v0 = data.simulation_parameters.v0;
        AppState.params.projectiles.theta = data.simulation_parameters.angle;
      } else if (topic === "inclined_plane") {
        AppState.params.inclined_plane.m = data.simulation_parameters.m;
        AppState.params.inclined_plane.theta = data.simulation_parameters.theta;
        AppState.params.inclined_plane.mu_s = data.simulation_parameters.mu_s;
        AppState.params.inclined_plane.mu_k = data.simulation_parameters.mu_k;
      } else if (topic === "forces") {
        AppState.params.vectors.F1 = data.simulation_parameters.F1;
        AppState.params.vectors.theta1 = data.simulation_parameters.theta1;
        AppState.params.vectors.F2 = data.simulation_parameters.F2;
        AppState.params.vectors.theta2 = data.simulation_parameters.theta2;
      } else if (topic === "momentum") {
        AppState.params.momentum.m1 = data.simulation_parameters.m1;
        AppState.params.momentum.v1 = data.simulation_parameters.v1;
        AppState.params.momentum.m2 = data.simulation_parameters.m2;
        AppState.params.momentum.e = data.simulation_parameters.e;
      }
      document.getElementById("solverSimulateCta").style.display = "block";
    }
  } catch (err) {
    bodyEl.innerHTML = `<div class="empty-state" style="color:var(--color-danger)"><strong>Error:</strong> ${err.message}</div>`;
    typesetMath(document.getElementById(bodyEl) || (typeof bodyEl === 'object' ? bodyEl : null));
  }
}

// ----------------------------------------------------------------------------
// AI Physics Step-by-Step Tutor
// ----------------------------------------------------------------------------
function setupAiTutor() {
  const modal = document.getElementById("aiTutorModal");
  const openBtn = document.getElementById("aiTutorBtn");
  const closeBtn = document.getElementById("closeAiModalBtn");
  const footerCloseBtn = document.getElementById("closeAiModalFooterBtn");

  openBtn.addEventListener("click", async () => {
    modal.style.display = "flex";
    const content = document.getElementById("aiTutorContent");
    content.innerHTML = `<div class="loading-spinner-box"><div class="spinner"></div><p data-i18n="ai_calculating">Synthesizing step-by-step mathematical explanation...</p></div>`;
    typesetMath(document.getElementById(content) || (typeof content === 'object' ? content : null));

    const mod = AppState.activeModule;
    const params = AppState.params[mod];

    try {
      const res = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: mod,
          level_id: AppState.activeLevel,
          parameters: params,
          language: AppState.lang
        })
      });
      const data = await res.json();
      document.getElementById("aiTutorEngineBadge").textContent = data.source === "gemini-2.5-flash" ? "Gemini 2.5 Flash" : "Pedagogical Solver";

      // Render Markdown-ish text to HTML
      let html = data.explanation
        .replace(/### (.*)/g, "<h3 style='margin:12px 0 6px 0; color:var(--color-accent)'>$1</h3>")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n\n/g, "<br><br>");

      content.innerHTML = `<div style="line-height:1.7; font-size:0.95rem;">${html}</div>`;
      typesetMath(document.getElementById(content) || (typeof content === 'object' ? content : null));
    } catch (e) {
      content.innerHTML = `<p style="color:var(--color-danger)">Could not connect to AI service: ${e.message}</p>`;
      typesetMath(document.getElementById(content) || (typeof content === 'object' ? content : null));
    }
  });

  const closeModal = () => (modal.style.display = "none");
  closeBtn.addEventListener("click", closeModal);
  footerCloseBtn.addEventListener("click", closeModal);
}

// ----------------------------------------------------------------------------
// Practical Exam Mode (Anti-Cheat Randomized Sheets & Optional Simulation Flow)
// ----------------------------------------------------------------------------
function setupExamMode() {
  const examEntryBox = document.getElementById("examEntryBox");
  if (examEntryBox) {
    examEntryBox.style.margin = "30px auto";
  }

  let activeSheetCode = "";
  let activeStudentEmail = "";
  let activeStudentName = "";

  document.getElementById("startExamBtn").addEventListener("click", async () => {
    const code = document.getElementById("examCodeInput").value.trim().toUpperCase();
    const email = document.getElementById("examStudentEmailInput").value.trim();
    const name = document.getElementById("examStudentNameInput").value.trim();

    if (!code) {
      alert("Please type the Lab Sheet Code (e.g. MECH-2026 or your instructor's code) into the first box first.");
      document.getElementById("examCodeInput").focus();
      return;
    }
    if (!email || !name) {
      alert("Please enter your email and full name.");
      return;
    }

    try {
      const res = await fetch(`/api/exam/sheet/${code}?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Sheet not found");

      if (data.is_locked) {
        alert(data.message || "This exam is currently locked by the instructor. / هذا الاختبار مغلق حالياً بواسطة المدرس.");
        return;
      }

      if (data.already_submitted) {
        showExamResult(data.submission.score, data.submission.passed, "Exam already submitted.");
        return;
      }

      activeSheetCode = data.sheet_code;
      activeStudentEmail = email;
      activeStudentName = name;
      AppState.activeExam = {
        sheetCode: data.sheet_code,
        studentEmail: email,
        studentName: name,
        questions: data.questions,
        activeModel: data.active_model || "A",
        submitted: false
      };

      document.getElementById("examEntryBox").style.display = "none";
      const activeSheetEl = document.getElementById("examActiveSheet");
      activeSheetEl.style.display = "block";
      activeSheetEl.style.maxWidth = "800px";
      activeSheetEl.style.margin = "20px auto";
      document.getElementById("examCodeBadge").textContent = `${data.sheet_code} [Set ${data.active_model || 'A'}]`;
      document.getElementById("examActiveTitle").textContent = data.title;
      document.getElementById("examStudentGreeting").innerHTML = `
        Candidate: <strong>${name}</strong> (${email})
        <button type="button" class="btn btn-outline btn-sm" id="exitExamBtn" style="margin-left:14px; padding:2px 8px; font-size:0.75rem;">Exit / خروج</button>
      `;

      document.getElementById("exitExamBtn")?.addEventListener("click", () => {
        if (confirm("Exit active exam? You can resume anytime before final submission.")) {
          AppState.activeExam = null;
          document.getElementById("examActiveSheet").style.display = "none";
          document.getElementById("examEntryBox").style.display = "block";
        }
      });

      const list = document.getElementById("examQuestionsList");
      list.innerHTML = "";

      const isAr = (AppState.lang === "ar");
      data.questions.forEach((q, idx) => {
        const item = document.createElement("div");
        item.className = "exam-question-item";
        item.style.cssText = "background:var(--bg-surface); border:1px solid var(--border-subtle); border-top:4px solid var(--color-cyan); border-radius:12px; padding:22px; margin-bottom:18px; box-shadow:0 4px 16px rgba(0,0,0,0.18);";

        const rightBadge = q.points
          ? `<span style="background:rgba(16,185,129,0.15); color:var(--color-emerald); padding:3px 10px; border-radius:999px; font-size:0.8rem; font-weight:600;">${q.points} Points</span>`
          : `<span class="badge badge-secondary">±${q.tolerance || 0.5} Tolerance</span>`;

        const imgHtml = q.image_data
          ? `<div style="margin:14px 0; text-align:center;"><img src="${q.image_data}" style="max-width:100%; max-height:280px; border-radius:8px; border:1px solid var(--border-subtle);"></div>`
          : "";

        let answerControlHtml = "";
        if (q.q_type === "mcq" && Array.isArray(q.options)) {
          answerControlHtml = `
            <div style="display:flex; flex-direction:column; gap:10px; margin-top:14px;">
              ${q.options.map((opt, oIdx) => `
                <label style="display:flex; align-items:center; gap:12px; padding:12px 14px; background:var(--bg-elevated); border:1px solid var(--border-subtle); border-radius:8px; cursor:pointer;">
                  <input type="radio" name="exam_mcq_${q.id}" value="${oIdx}" class="exam-mcq-radio" data-qid="${q.id}" style="width:18px; height:18px; accent-color:var(--color-cyan);">
                  <span style="font-size:0.95rem; color:var(--text-primary);">${opt}</span>
                </label>
              `).join("")}
            </div>
          `;
        } else {
          const simBtnHtml = q.topic && q.topic !== "custom"
            ? `<button type="button" class="btn btn-secondary btn-sm test-in-lab-btn" data-topic="${q.topic}" data-inputs='${JSON.stringify(q.inputs || {})}'>${isAr ? 'محاكاة في المعمل' : 'Simulate in Lab'}</button>`
            : "";
          answerControlHtml = `
            <div class="input-row" style="margin-top:14px; display:flex; gap:10px; align-items:center;">
              <input type="number" step="any" class="form-control exam-answer-input" data-qid="${q.id}" placeholder="${isAr ? 'أدخل الإجابة الرقمية هنا...' : 'Enter numerical value...'}">
              ${simBtnHtml}
            </div>
          `;
        }

        item.innerHTML = `
          <div class="q-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <span class="q-title" style="font-weight:700; color:var(--color-cyan);">Question ${idx + 1}${q.title && q.topic !== "custom" ? ": " + q.title : ""}</span>
            ${rightBadge}
          </div>
          <p class="q-prompt" style="font-size:1.02rem; line-height:1.6; color:var(--text-primary); white-space:pre-line;">${isAr ? q.prompt_ar : q.prompt}</p>
          ${imgHtml}
          ${answerControlHtml}
        `;
        list.appendChild(item);
      });

      // Simulation Button Behavior: navigate directly to simulation and do NOT lose exam state!
      document.querySelectorAll(".test-in-lab-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const topic = btn.dataset.topic;
          const inputs = JSON.parse(btn.dataset.inputs || "{}");
          document.querySelector('.nav-tab[data-tab="lab"]').click();
          document.querySelector(`.module-chip[data-module="${topic}"]`)?.click();
          Object.assign(AppState.params[topic] || {}, inputs);
          renderModuleControls(topic);
          simEngine.reset();
        });
      });
    } catch (err) {
      alert(err.message || "Failed to load exam sheet.");
    }
  });

  // Fix Exam Submit Button (Handles both submitExamFinalBtn and submitExamBtn reliably)
  const submitBtn = document.getElementById("submitExamFinalBtn") || document.getElementById("submitExamBtn");
  if (submitBtn) {
    submitBtn.addEventListener("click", async () => {
      const answers = {};
      let answeredCount = 0;
      document.querySelectorAll(".exam-answer-input").forEach((inp) => {
        if (inp.value.trim() !== "") answeredCount++;
        answers[inp.dataset.qid] = inp.value.trim();
      });
      document.querySelectorAll(".exam-mcq-radio:checked").forEach((rad) => {
        answeredCount++;
        answers[rad.dataset.qid] = rad.value;
      });

      if (answeredCount === 0) {
        if (!confirm("You have not entered answers to the questions. Submit anyway? / لم تقم بإدخال إجابات، هل تريد التسليم على أية حال؟")) {
          return;
        }
      }

      submitBtn.disabled = true;
      const origHtml = submitBtn.innerHTML;
      submitBtn.innerHTML = `<span class="spinner-sm" style="display:inline-block; margin-right:8px;"></span> Submitting answers...`;

      try {
        const res = await fetch("/api/exam/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sheet_code: activeSheetCode,
            student_email: activeStudentEmail,
            student_name: activeStudentName,
            answers
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Submission failed");

        if (AppState.activeExam) {
          AppState.activeExam.submitted = true;
        }
        showExamResult(data.score, data.passed, data.message);
      } catch (err) {
        alert("Exam Submission Error / خطأ في تسليم الامتحان: " + (err.message || "Failed to submit answers."));
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origHtml;
      }
    });
  }

  const returnBtn = document.getElementById("returnToLabBtn");
  if (returnBtn) {
    returnBtn.addEventListener("click", () => {
      document.querySelector('.nav-tab[data-tab="lab"]')?.click();
    });
  }
}

function showExamResult(score, passed, message) {
  document.getElementById("examEntryBox").style.display = "none";
  document.getElementById("examActiveSheet").style.display = "none";
  const resBox = document.getElementById("examResultBox");
  resBox.style.display = "block";
  resBox.style.margin = "40px auto";
  resBox.style.maxWidth = "540px";
  resBox.style.textAlign = "center";

  const scoreEl = document.getElementById("resultScoreVal");
  scoreEl.textContent = `${score}%`;
  scoreEl.style.color = passed ? "var(--color-emerald)" : "var(--color-danger)";

  document.getElementById("resultTitle").textContent = passed ? "Passed Practical Assessment" : "Assessment Complete (Needs Review)";
  document.getElementById("resultMsg").textContent = message;

  if (!document.getElementById("takeAnotherExamBtn")) {
    const btnRow = document.getElementById("returnToLabBtn")?.parentElement;
    if (btnRow) {
      btnRow.style.display = "flex";
      btnRow.style.gap = "12px";
      btnRow.style.justifyContent = "center";
      btnRow.style.marginTop = "18px";
      const anotherBtn = document.createElement("button");
      anotherBtn.id = "takeAnotherExamBtn";
      anotherBtn.className = "btn btn-secondary";
      anotherBtn.textContent = "Enter Another Exam Code";
      anotherBtn.onclick = () => {
        resBox.style.display = "none";
        document.getElementById("examEntryBox").style.display = "block";
        document.getElementById("examCodeInput").value = "";
      };
      btnRow.appendChild(anotherBtn);
    }
  }
}

// ----------------------------------------------------------------------------
// B2B Instructor Portal
// ----------------------------------------------------------------------------
let customFormQuestions = [];

function compressImageToBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxW = 720;
        const scale = img.width > maxW ? maxW / img.width : 1;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.78));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function renderCustomFormBuilderList() {
  const container = document.getElementById("customQuestionsList");
  const totalPtsEl = document.getElementById("formTotalPointsBadge");
  if (!container) return;

  const totalPts = customFormQuestions.reduce((acc, q) => acc + (parseFloat(q.points) || 0), 0);
  if (totalPtsEl) totalPtsEl.textContent = `Total Score: ${totalPts} Points (${customFormQuestions.length} Questions)`;

  container.innerHTML = "";
  customFormQuestions.forEach((q, idx) => {
    const card = document.createElement("div");
    card.style.cssText = "background:var(--bg-elevated); border:1px solid var(--border-subtle); border-left:4px solid var(--color-cyan); border-radius:10px; padding:16px; margin-bottom:14px;";

    const optionsHtml = q.q_type === "mcq" ? `
      <div style="margin-top:12px;">
        <label style="font-size:0.82rem; color:var(--text-secondary); display:block; margin-bottom:6px;">Multiple Choice Options (Select the radio button next to the correct answer):</label>
        ${q.options.map((opt, oIdx) => `
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
            <input type="radio" name="correct_opt_${q.id}" ${q.correct_option === String(oIdx) ? "checked" : ""} data-qidx="${idx}" data-oidx="${oIdx}" class="cq-correct-radio" title="Mark as correct answer">
            <input type="text" class="form-control cq-opt-input" data-qidx="${idx}" data-oidx="${oIdx}" value="${opt.replace(/"/g, '"')}" placeholder="Option ${String.fromCharCode(65 + oIdx)}" style="flex:1;">
          </div>
        `).join("")}
      </div>
    ` : `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:12px;">
        <div>
          <label style="font-size:0.82rem; color:var(--text-secondary);">Correct Numeric Value:</label>
          <input type="number" step="any" class="form-control cq-num-ans" data-qidx="${idx}" value="${q.correct_numeric}" placeholder="e.g. 9.81">
        </div>
        <div>
          <label style="font-size:0.82rem; color:var(--text-secondary);">Tolerance (± Margin):</label>
          <input type="number" step="any" class="form-control cq-num-tol" data-qidx="${idx}" value="${q.tolerance}" placeholder="e.g. 0.5">
        </div>
      </div>
    `;

    const imgPreviewHtml = q.image_data ? `
      <div style="margin-top:10px; position:relative; display:inline-block;">
        <img src="${q.image_data}" style="max-height:160px; border-radius:8px; border:1px solid var(--border-subtle);">
        <button type="button" class="btn btn-danger btn-sm cq-remove-img" data-qidx="${idx}" style="position:absolute; top:6px; right:6px; padding:2px 8px;">✕</button>
      </div>
    ` : "";

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:10px;">
        <strong style="color:var(--color-cyan);">Question #${idx + 1}</strong>
        <div style="display:flex; align-items:center; gap:8px;">
          <select class="form-control cq-type-select" data-qidx="${idx}" style="width:auto; padding:6px 10px;">
            <option value="mcq" ${q.q_type === "mcq" ? "selected" : ""}>Multiple Choice (MCQ)</option>
            <option value="numeric" ${q.q_type === "numeric" ? "selected" : ""}>Numeric Value</option>
          </select>
          <div style="display:flex; align-items:center; gap:4px;">
            <input type="number" min="0.5" step="0.5" class="form-control cq-points-input" data-qidx="${idx}" value="${q.points}" style="width:75px; padding:6px 8px;" title="Question Points">
            <span style="font-size:0.82rem; color:var(--text-secondary);">pts</span>
          </div>
          <button type="button" class="btn btn-danger btn-sm cq-delete-btn" data-qidx="${idx}">Delete</button>
        </div>
      </div>
      <textarea class="form-control cq-prompt-input" data-qidx="${idx}" rows="2" placeholder="Write your physics question here (supports Arabic & English)..." style="width:100%; resize:vertical;">${q.prompt}</textarea>
      <div style="margin-top:8px; display:flex; align-items:center; gap:10px;">
        <label class="btn btn-secondary btn-sm" style="cursor:pointer; margin:0;">
          Attach Image / Diagram
          <input type="file" accept="image/*" class="cq-img-input" data-qidx="${idx}" style="display:none;">
        </label>
        <span style="font-size:0.78rem; color:var(--text-muted);">Optional circuit, vector diagram, or textbook figure</span>
      </div>
      ${imgPreviewHtml}
      ${optionsHtml}
    `;
    container.appendChild(card);
  });

  container.querySelectorAll(".cq-prompt-input").forEach(el => {
    el.addEventListener("input", e => { customFormQuestions[e.target.dataset.qidx].prompt = e.target.value; });
  });
  container.querySelectorAll(".cq-points-input").forEach(el => {
    el.addEventListener("input", e => {
      customFormQuestions[e.target.dataset.qidx].points = parseFloat(e.target.value) || 1;
      const totalPts = customFormQuestions.reduce((acc, q) => acc + (parseFloat(q.points) || 0), 0);
      if (totalPtsEl) totalPtsEl.textContent = `Total Score: ${totalPts} Points (${customFormQuestions.length} Questions)`;
    });
  });
  container.querySelectorAll(".cq-type-select").forEach(el => {
    el.addEventListener("change", e => {
      customFormQuestions[e.target.dataset.qidx].q_type = e.target.value;
      renderCustomFormBuilderList();
    });
  });
  container.querySelectorAll(".cq-opt-input").forEach(el => {
    el.addEventListener("input", e => {
      customFormQuestions[e.target.dataset.qidx].options[e.target.dataset.oidx] = e.target.value;
    });
  });
  container.querySelectorAll(".cq-correct-radio").forEach(el => {
    el.addEventListener("change", e => {
      customFormQuestions[e.target.dataset.qidx].correct_option = String(e.target.dataset.oidx);
    });
  });
  container.querySelectorAll(".cq-num-ans").forEach(el => {
    el.addEventListener("input", e => { customFormQuestions[e.target.dataset.qidx].correct_numeric = e.target.value; });
  });
  container.querySelectorAll(".cq-num-tol").forEach(el => {
    el.addEventListener("input", e => { customFormQuestions[e.target.dataset.qidx].tolerance = e.target.value; });
  });
  container.querySelectorAll(".cq-img-input").forEach(el => {
    el.addEventListener("change", async e => {
      const file = e.target.files[0];
      if (!file) return;
      const b64 = await compressImageToBase64(file);
      customFormQuestions[e.target.dataset.qidx].image_data = b64;
      renderCustomFormBuilderList();
    });
  });
  container.querySelectorAll(".cq-remove-img").forEach(el => {
    el.addEventListener("click", e => {
      customFormQuestions[e.target.dataset.qidx].image_data = "";
      renderCustomFormBuilderList();
    });
  });
  container.querySelectorAll(".cq-delete-btn").forEach(el => {
    el.addEventListener("click", e => {
      customFormQuestions.splice(parseInt(e.target.dataset.qidx), 1);
      renderCustomFormBuilderList();
    });
  });
}

function setupInstructorPortal() {
  const select = document.getElementById("instructorSheetSelect");
  if (select) {
    select.addEventListener("change", () => {
      loadInstructorAnalytics(select.value);
    });
  }

  // Instructor Exam Availability Toggle (Lock / Unlock)
  const toggleLockBtn = document.getElementById("toggleExamLockBtn");
  if (toggleLockBtn) {
    toggleLockBtn.addEventListener("click", async () => {
      const sheetCode = select?.value;
      if (!sheetCode) return;
      const isLocking = toggleLockBtn.textContent.includes("Lock");
      try {
        toggleLockBtn.disabled = true;
        const res = await fetch(`/api/instructor/sheet/${sheetCode}/settings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            instructor_email: AppState.user?.email,
            is_locked: isLocking
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Failed to update exam status");
        loadInstructorAnalytics(sheetCode);
      } catch (err) {
        alert("Error updating exam status: " + err.message);
      } finally {
        toggleLockBtn.disabled = false;
      }
    });
  }

  // Instructor Exam Model Settings (Switch Sets A, B, C)
  const saveSettingsBtn = document.getElementById("saveSheetSettingsBtn");
  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener("click", async () => {
      const sheetCode = select?.value;
      const modelSelect = document.getElementById("instructorModelSelect");
      if (!sheetCode || !modelSelect) return;
      const feedback = document.getElementById("sheetSettingsFeedback");

      try {
        saveSettingsBtn.disabled = true;
        const res = await fetch(`/api/instructor/sheet/${sheetCode}/settings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            instructor_email: AppState.user?.email,
            active_model: modelSelect.value
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Failed to save settings");

        if (feedback) {
          feedback.textContent = `✓ Exam model switched to Model ${modelSelect.value} for '${sheetCode}'.`;
          feedback.style.display = "block";
          setTimeout(() => { feedback.style.display = "none"; }, 3500);
        }
      } catch (err) {
        alert("Error saving exam settings: " + err.message);
      } finally {
        saveSettingsBtn.disabled = false;
      }
    });
  }

  // Lab Sheet Creation Modal & Inputs Wiring
  const createSheetModal = document.getElementById("createSheetModal");
  const openModalBtn = document.getElementById("openCreateSheetModalBtn");
  const closeModalBtn = document.getElementById("closeCreateSheetModalBtn");

  if (openModalBtn && createSheetModal) {
    openModalBtn.addEventListener("click", () => {
      createSheetModal.style.display = "flex";
      const codeInput = document.getElementById("newSheetCodeInput") || document.getElementById("newSheetCode");
      if (codeInput && !codeInput.value) {
        codeInput.value = `LAB-${Math.floor(1000 + Math.random() * 9000)}`;
      }
    });
  }

  if (closeModalBtn && createSheetModal) {
    closeModalBtn.addEventListener("click", () => {
      createSheetModal.style.display = "none";
    });
  }

  const codeInput = document.getElementById("newSheetCodeInput") || document.getElementById("newSheetCode");
  if (codeInput) {
    codeInput.value = `LAB-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  const topicsGroup = document.querySelector(".topic-checkboxes")?.parentElement;
  if (topicsGroup && !document.getElementById("examBuilderModeSwitcher")) {
    const modeBox = document.createElement("div");
    modeBox.id = "examBuilderModeSwitcher";
    modeBox.style.cssText = "margin-bottom:16px; padding:12px; background:var(--bg-elevated); border-radius:10px; border:1px solid var(--border-subtle);";
    modeBox.innerHTML = `
      <label style="font-weight:600; display:block; margin-bottom:8px; color:var(--text-primary);">Assessment Creation Mode:</label>
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <button type="button" id="modeCustomFormBtn" class="btn btn-primary btn-sm">Custom Forms Builder (Manual Questions, Images, MCQ & Points)</button>
        <button type="button" id="modeRandomSimBtn" class="btn btn-secondary btn-sm">Auto-Randomized Lab Topics (Anti-Cheat)</button>
      </div>
    `;
    topicsGroup.parentElement.insertBefore(modeBox, topicsGroup);

    const customBuilderWrap = document.createElement("div");
    customBuilderWrap.id = "customFormBuilderWrap";
    customBuilderWrap.style.cssText = "margin-bottom:18px;";
    customBuilderWrap.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
        <span id="formTotalPointsBadge" style="font-weight:600; color:var(--color-emerald);">Total Score: 5 Points (1 Question)</span>
        <button type="button" id="addCustomQuestionBtn" class="btn btn-primary btn-sm">+ Add Question</button>
      </div>
      <div id="customQuestionsList"></div>
    `;
    topicsGroup.parentElement.insertBefore(customBuilderWrap, topicsGroup);

    topicsGroup.style.display = "none";
    AppState.examBuilderMode = "custom";
    customFormQuestions = [{
      id: "cq_1",
      q_type: "mcq",
      prompt: "",
      options: ["", "", "", ""],
      correct_option: "0",
      correct_numeric: "",
      tolerance: "0.5",
      points: 5,
      image_data: ""
    }];
    renderCustomFormBuilderList();

    document.getElementById("addCustomQuestionBtn").addEventListener("click", () => {
      customFormQuestions.push({
        id: `cq_${Date.now()}`,
        q_type: "mcq",
        prompt: "",
        options: ["", "", "", ""],
        correct_option: "0",
        correct_numeric: "",
        tolerance: "0.5",
        points: 5,
        image_data: ""
      });
      renderCustomFormBuilderList();
    });

    document.getElementById("modeCustomFormBtn").addEventListener("click", () => {
      AppState.examBuilderMode = "custom";
      customBuilderWrap.style.display = "block";
      topicsGroup.style.display = "none";
      document.getElementById("modeCustomFormBtn").className = "btn btn-primary btn-sm";
      document.getElementById("modeRandomSimBtn").className = "btn btn-secondary btn-sm";
    });

    document.getElementById("modeRandomSimBtn").addEventListener("click", () => {
      AppState.examBuilderMode = "random";
      customBuilderWrap.style.display = "none";
      topicsGroup.style.display = "block";
      document.getElementById("modeRandomSimBtn").className = "btn btn-primary btn-sm";
      document.getElementById("modeCustomFormBtn").className = "btn btn-secondary btn-sm";
    });
  }

  const createBtn = document.getElementById("submitCreateSheetBtn") || document.getElementById("createSheetBtn");
  createBtn?.addEventListener("click", async () => {
    const codeInp = document.getElementById("newSheetCodeInput") || document.getElementById("newSheetCode");
    const titleInp = document.getElementById("newSheetTitleInput") || document.getElementById("newSheetTitle");
    const passInp = document.getElementById("newSheetPassInput") || document.getElementById("newSheetPass");

    const code = codeInp ? codeInp.value.trim().toUpperCase() : "";
    const title = titleInp ? titleInp.value.trim() : "";
    const pass = passInp ? (parseFloat(passInp.value) || 60) : 60;

    if (!code || !title) {
      alert("Please fill sheet code and title.");
      return;
    }

    const payload = {
      sheet_code: code,
      title,
      instructor_email: AppState.user?.email || "instructor@univ.edu",
      topics: ["custom"],
      passing_score: pass,
      custom_questions: null
    };

    if (AppState.examBuilderMode === "custom") {
      if (customFormQuestions.length === 0) {
        alert("Please add at least one question to your form.");
        return;
      }
      for (let i = 0; i < customFormQuestions.length; i++) {
        const q = customFormQuestions[i];
        if (!q.prompt.trim()) {
          alert(`Please write the question text for Question #${i + 1}.`);
          return;
        }
        if (q.q_type === "mcq" && q.options.some(o => !o.trim())) {
          alert(`Please fill all 4 options for Question #${i + 1}.`);
          return;
        }
        if (q.q_type === "numeric" && String(q.correct_numeric).trim() === "") {
          alert(`Please enter the correct numeric answer for Question #${i + 1}.`);
          return;
        }
      }
      payload.custom_questions = customFormQuestions;
    } else {
      const topics = [];
      document.querySelectorAll(".topic-checkboxes input:checked").forEach((cb) => {
        topics.push(cb.value);
      });
      if (topics.length === 0) {
        alert("Please select at least one physics topic.");
        return;
      }
      payload.topics = topics;
    }

    try {
      const res = await fetch("/api/instructor/sheets/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.detail || "Failed to create sheet.");
        return;
      }

      alert(`Exam Form '${data.sheet_code}' deployed successfully! Share this code with your students.`);
      if (createSheetModal) createSheetModal.style.display = "none";
      await refreshInstructorSheets();
      if (select) select.value = data.sheet_code;
      loadInstructorAnalytics(data.sheet_code);
      if (codeInp) codeInp.value = `LAB-${Math.floor(1000 + Math.random() * 9000)}`;
    } catch (err) {
      alert("Error creating sheet.");
    }
  });
}

async function refreshInstructorSheets() {
  const email = AppState.user?.email || "";
  const select = document.getElementById("instructorSheetSelect");
  if (!select || !email) return;

  try {
    const res = await fetch(`/api/instructor/sheets?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    const sheets = data.sheets || [];
    select.innerHTML = "";

    const activeCountEl = document.getElementById("statActiveSheets");
    if (activeCountEl) activeCountEl.textContent = sheets.length;

    if (sheets.length === 0) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "No lab sheets created yet — deploy one above";
      select.appendChild(opt);
      document.getElementById("statSubmissions").textContent = "0";
      document.getElementById("statClassAvg").textContent = "0%";
      document.getElementById("statPassRate").textContent = "0%";
      document.getElementById("submissionsCountBadge").textContent = "0 Students";
      document.getElementById("weakSpotsList").innerHTML = `<p style="color:var(--text-muted); font-size:0.9rem;">Create a lab sheet and share its code with your students to see cohort analytics here.</p>`;
      document.getElementById("submissionsTableBody").innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">No student submissions yet for your sheets.</td></tr>`;
      typesetMath(document.getElementById(null) || (typeof null === 'object' ? null : null));
      return;
    }

    sheets.forEach((s) => {
      const opt = document.createElement("option");
      opt.value = s.sheet_code;
      opt.textContent = `${s.sheet_code}: ${s.title}`;
      select.appendChild(opt);
    });
    loadInstructorAnalytics(sheets[0].sheet_code);
  } catch (e) {
    console.error("Failed to fetch instructor sheets:", e);
  }
}

async function loadInstructorAnalytics(sheetCode) {
  if (!sheetCode) return;
  const email = AppState.user?.email || "";
  try {
    const res = await fetch(`/api/instructor/sheet/${sheetCode}/analytics?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    if (!res.ok) return;

    document.getElementById("statSubmissions").textContent = data.total_students;
    document.getElementById("statClassAvg").textContent = `${data.average_score}%`;
    document.getElementById("statPassRate").textContent = `${data.pass_rate}%`;
    document.getElementById("submissionsCountBadge").textContent = `${data.total_students} Students`;

    // Sync sheet settings controls
    if (data.sheet) {
      const isLocked = Boolean(data.sheet.is_locked);
      const lockBadge = document.getElementById("sheetLockStatusBadge");
      if (lockBadge) {
        lockBadge.textContent = isLocked ? "LOCKED" : "ACTIVE / OPEN";
        lockBadge.className = `badge ${isLocked ? 'badge-danger' : 'badge-success'}`;
      }
      const toggleLockBtn = document.getElementById("toggleExamLockBtn");
      if (toggleLockBtn) {
        toggleLockBtn.textContent = isLocked ? "Unlock Exam" : "Lock Exam";
      }
      const modelSelect = document.getElementById("instructorModelSelect");
      if (modelSelect && data.sheet.active_model) {
        modelSelect.value = data.sheet.active_model;
      }
    }

    // Export link scoped to instructor
    document.getElementById("exportCsvBtn").href = `/api/instructor/sheet/${sheetCode}/export-csv?email=${encodeURIComponent(email)}`;

    // Weak spots list
    const weakList = document.getElementById("weakSpotsList");
    weakList.innerHTML = "";
    data.weak_spots.forEach((ws) => {
      const isSafe = ws.error_rate < 40;
      const d = document.createElement("div");
      d.className = "weak-spot-item";
      d.innerHTML = `
        <div class="weak-spot-header">
          <span>${ws.topic.toUpperCase().replace("_", " ")}</span>
          <span style="color:${isSafe ? 'var(--color-emerald)' : 'var(--color-danger)'}">${ws.error_rate}% Error Rate</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill ${isSafe ? 'safe' : ''}" style="width:${ws.error_rate}%"></div>
        </div>
      `;
      weakList.appendChild(d);
    });

    // Submissions table
    const tbody = document.getElementById("submissionsTableBody");
    tbody.innerHTML = "";
    typesetMath(document.getElementById(tbody) || (typeof tbody === 'object' ? tbody : null));
    data.submissions.forEach((sub) => {
      const tr = document.createElement("tr");
      const isPassed = sub.passed === 1;
      tr.innerHTML = `
        <td><strong>${sub.student_name}</strong></td>
        <td><code>${sub.student_email}</code></td>
        <td><strong style="color:${isPassed ? 'var(--color-emerald)' : 'var(--color-danger)'}">${sub.score}%</strong></td>
        <td><span class="badge ${isPassed ? 'badge-success' : 'badge-warning'}">${isPassed ? 'PASSED' : 'RETAKE'}</span></td>
        <td>${new Date(sub.submitted_at).toLocaleDateString()}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (e) {
    console.error("Analytics fetch error:", e);
  }
}

// ----------------------------------------------------------------------------
// Snap & Simulate (Vision OCR)
// ----------------------------------------------------------------------------
function triggerVisionFilePicker() {
  const existing = document.getElementById("visionFileInput");
  if (existing) {
    try {
      existing.value = "";
      const prevDisplay = existing.style.display;
      existing.style.display = "block";
      existing.style.opacity = "0.01";
      existing.click();
      setTimeout(() => { existing.style.display = prevDisplay || "none"; }, 300);
      return;
    } catch (_) {}
  }
  const tmp = document.createElement("input");
  tmp.type = "file";
  tmp.accept = "image/*";
  tmp.style.position = "fixed";
  tmp.style.opacity = "0.01";
  document.body.appendChild(tmp);
  tmp.onchange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      if (typeof uploadVisionFile === "function") uploadVisionFile(e.target.files[0]);
    }
    tmp.remove();
  };
  tmp.click();
}
document.addEventListener("click", (e) => {
  if (e.target.closest && (e.target.closest("#browseVisionBtn") || e.target.closest("#visionDropzone"))) {
    triggerVisionFilePicker();
  }
});
function setupVisionScanner() {
  const dropzone = document.getElementById("visionDropzone");
  const fileInput = document.getElementById("visionFileInput");
  const browseBtn = document.getElementById("browseVisionBtn");

  browseBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (fileInput) fileInput.click();
  });
  if (dropzone) {
    dropzone.addEventListener("click", () => {
      if (fileInput) fileInput.click();
    });
  }
  fileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const f = e.target.files[0];
      e.target.value = "";
      uploadVisionFile(f);
    }
  });

  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.style.borderColor = "var(--color-accent)";
  });
  dropzone.addEventListener("dragleave", () => {
    dropzone.style.borderColor = "var(--border-color)";
  });
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) uploadVisionFile(e.dataTransfer.files[0]);
  });

  // Demo sample chips
  document.querySelectorAll(".sample-chips .btn-chip").forEach((btn) => {
    btn.addEventListener("click", async () => {
      uploadVisionFile(null, btn.textContent.trim());
    });
  });

  document.getElementById("sendVisionToSolverBtn").addEventListener("click", () => {
    if (window._lastVisionExtracted) {
      const ex = window._lastVisionExtracted;
      document.querySelector('.nav-tab[data-tab="solver"]').click();
      document.getElementById("solverTopicSelect").value = ex.topic;
      renderSolverInputs(ex.topic);

      Object.keys(ex.variables).forEach((k) => {
        const inp = document.getElementById(`sol_var_${k}`);
        if (inp && ex.variables[k] !== null && ex.variables[k] !== undefined) {
          inp.value = ex.variables[k];
        }
      });
      executeSolve();
    }
  });
}

async function uploadVisionFile(file, sampleText = "") {
  const body = document.getElementById("visionResultsBody");
  body.innerHTML = `<div class="loading-spinner-box"><div class="spinner"></div><p>Scanning textbook image & parsing mechanical formulas...</p></div>`;
  typesetMath(document.getElementById(body) || (typeof body === 'object' ? body : null));

  try {
    const formData = new FormData();
    if (file) formData.append("file", file);
    if (sampleText) formData.append("problem_text", sampleText);

    const res = await fetch("/api/ai/vision", {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    window._lastVisionExtracted = data.extracted;

    document.getElementById("visionEngineBadge").textContent = data.engine;
    document.getElementById("visionActions").style.display = "block";

    body.innerHTML = `
    typesetMath(document.getElementById(body) || (typeof body === 'object' ? body : null));
      <div style="display:flex; flex-direction:column; gap:8px;">
        <p><strong>Topic Identified:</strong> <span class="badge badge-primary">${data.extracted.topic.toUpperCase()}</span></p>
        <p><strong>Summary:</strong> ${data.extracted.problem_summary}</p>
        <div style="background:var(--bg-surface); padding:10px; border-radius:6px; border:1px solid var(--border-color);">
          <strong>Extracted Physical Parameters:</strong>
          <pre style="font-family:'JetBrains Mono'; margin-top:6px; font-size:0.85rem;">${JSON.stringify(data.extracted.variables, null, 2)}</pre>
        </div>
      </div>
    `;
  } catch (e) {
    body.innerHTML = `<p style="color:var(--color-danger)">Extraction failed: ${e.message}</p>`;
    typesetMath(document.getElementById(body) || (typeof body === 'object' ? body : null));
  }
}

// ----------------------------------------------------------------------------
// Mandatory User Authentication Gate & Email OTP Verification
// ----------------------------------------------------------------------------
let otpCountdownTimer = null;
let currentOtpEmail = "";

function setupAuthGate() {
  const authPageView = document.getElementById("authPageView");
  const mainWorkspace = document.getElementById("mainWorkspace");
  const alertBox = document.getElementById("authAlertBox");

  const tabLogin = document.getElementById("authTabLogin");
  const tabRegister = document.getElementById("authTabRegister");
  const stateLogin = document.getElementById("authStateLogin");
  const stateRegister = document.getElementById("authStateRegister");
  const stateOtp = document.getElementById("authStateOtp");
  const stateForgotPassword = document.getElementById("authStateForgotPassword");
  const stateResetPassword = document.getElementById("authStateResetPassword");
  const navTabs = document.getElementById("authNavTabs");

  const switchToRegisterLink = document.getElementById("switchToRegisterLink");
  const switchToLoginLink = document.getElementById("switchToLoginLink");
  const otpBackToLoginBtn = document.getElementById("otpBackToLoginBtn");
  const forgotPasswordLink = document.getElementById("forgotPasswordLink");
  const forgotBackToLoginBtn = document.getElementById("forgotBackToLoginBtn");
  const resetBackToLoginBtn = document.getElementById("resetBackToLoginBtn");

  const submitLoginBtn = document.getElementById("submitLoginBtn");
  const submitRegisterBtn = document.getElementById("submitRegisterBtn");
  const submitOtpBtn = document.getElementById("submitOtpBtn");
  const resendOtpBtn = document.getElementById("resendOtpBtn");
  const submitForgotEmailBtn = document.getElementById("submitForgotEmailBtn");
  const submitResetPasswordBtn = document.getElementById("submitResetPasswordBtn");

  const logoutBtn = document.getElementById("logoutBtn");
  const loginBtn = document.getElementById("loginBtn");

  function showAlert(msg, isSuccess = false) {
    if (!alertBox) return;
    alertBox.textContent = msg;
    alertBox.className = `auth-alert ${isSuccess ? 'success' : 'error'}`;
    alertBox.style.display = "flex";
  }

  function clearAlert() {
    if (!alertBox) return;
    alertBox.textContent = "";
    alertBox.style.display = "none";
  }

  function setButtonLoading(btn, isLoading) {
    if (!btn) return;
    const txt = btn.querySelector(".btn-text");
    const sp = btn.querySelector(".spinner-sm");
    if (txt) txt.style.display = isLoading ? "none" : "inline";
    if (sp) sp.style.display = isLoading ? "inline-block" : "none";
    btn.disabled = isLoading;
  }

  function switchState(state, email = "") {
    clearAlert();
    if (state === "login") {
      if (navTabs) navTabs.style.display = "grid";
      if (tabLogin) tabLogin.classList.add("active");
      if (tabRegister) tabRegister.classList.remove("active");
      if (stateLogin) stateLogin.style.display = "block";
      if (stateRegister) stateRegister.style.display = "none";
      if (stateOtp) stateOtp.style.display = "none";
      if (stateForgotPassword) stateForgotPassword.style.display = "none";
      if (stateResetPassword) stateResetPassword.style.display = "none";
    } else if (state === "register") {
      if (navTabs) navTabs.style.display = "grid";
      if (tabRegister) tabRegister.classList.add("active");
      if (tabLogin) tabLogin.classList.remove("active");
      if (stateRegister) stateRegister.style.display = "block";
      if (stateLogin) stateLogin.style.display = "none";
      if (stateOtp) stateOtp.style.display = "none";
      if (stateForgotPassword) stateForgotPassword.style.display = "none";
      if (stateResetPassword) stateResetPassword.style.display = "none";
    } else if (state === "otp") {
      if (navTabs) navTabs.style.display = "none";
      if (stateLogin) stateLogin.style.display = "none";
      if (stateRegister) stateRegister.style.display = "none";
      if (stateOtp) stateOtp.style.display = "block";
      if (stateForgotPassword) stateForgotPassword.style.display = "none";
      if (stateResetPassword) stateResetPassword.style.display = "none";

      currentOtpEmail = (email || "").toLowerCase().trim();
      const targetEl = document.getElementById("otpTargetEmailText");
      if (targetEl) targetEl.textContent = currentOtpEmail;
      const otpInput = document.getElementById("otpCodeInput");
      if (otpInput) {
        otpInput.value = "";
        setTimeout(() => otpInput.focus(), 150);
      }
      startOtpCountdown(300); // 5 minutes
    } else if (state === "forgot") {
      if (navTabs) navTabs.style.display = "none";
      if (stateLogin) stateLogin.style.display = "none";
      if (stateRegister) stateRegister.style.display = "none";
      if (stateOtp) stateOtp.style.display = "none";
      if (stateForgotPassword) stateForgotPassword.style.display = "block";
      if (stateResetPassword) stateResetPassword.style.display = "none";

      const forgotEmailInput = document.getElementById("forgotEmail");
      if (forgotEmailInput) {
        if (email) forgotEmailInput.value = email;
        setTimeout(() => forgotEmailInput.focus(), 150);
      }
    } else if (state === "reset") {
      if (navTabs) navTabs.style.display = "none";
      if (stateLogin) stateLogin.style.display = "none";
      if (stateRegister) stateRegister.style.display = "none";
      if (stateOtp) stateOtp.style.display = "none";
      if (stateForgotPassword) stateForgotPassword.style.display = "none";
      if (stateResetPassword) stateResetPassword.style.display = "block";

      currentOtpEmail = (email || "").toLowerCase().trim();
      const resetTargetEl = document.getElementById("resetTargetEmailText");
      if (resetTargetEl) resetTargetEl.textContent = currentOtpEmail;
      const resetOtpInput = document.getElementById("resetOtpCodeInput");
      if (resetOtpInput) {
        resetOtpInput.value = "";
        setTimeout(() => resetOtpInput.focus(), 150);
      }
    }
  }

  function startOtpCountdown(totalSeconds) {
    if (otpCountdownTimer) clearInterval(otpCountdownTimer);
    let remaining = totalSeconds;
    if (resendOtpBtn) resendOtpBtn.disabled = true;

    function renderTimer() {
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      const formatted = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
      const countEl = document.getElementById("otpCountdownText");
      if (countEl) countEl.textContent = formatted;

      if (remaining <= 0) {
        clearInterval(otpCountdownTimer);
        if (countEl) countEl.textContent = "00:00 (Expired)";
        if (resendOtpBtn) resendOtpBtn.disabled = false;
        showAlert("Verification code expired. Please click Resend Code to receive a fresh code.");
      } else {
        remaining--;
      }
    }

    renderTimer();
    otpCountdownTimer = setInterval(renderTimer, 1000);
  }

  // Navigation between states
  if (tabLogin) tabLogin.addEventListener("click", () => switchState("login"));
  if (tabRegister) tabRegister.addEventListener("click", () => switchState("register"));
  if (switchToRegisterLink) switchToRegisterLink.addEventListener("click", () => switchState("register"));
  if (switchToLoginLink) switchToLoginLink.addEventListener("click", () => switchState("login"));
  if (otpBackToLoginBtn) {
    otpBackToLoginBtn.addEventListener("click", () => {
      if (otpCountdownTimer) clearInterval(otpCountdownTimer);
      switchState("login");
    });
  }
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", () => {
      const loginEmailVal = document.getElementById("loginEmail")?.value.trim() || "";
      switchState("forgot", loginEmailVal);
    });
  }
  if (forgotBackToLoginBtn) {
    forgotBackToLoginBtn.addEventListener("click", () => switchState("login"));
  }
  if (resetBackToLoginBtn) {
    resetBackToLoginBtn.addEventListener("click", () => switchState("login"));
  }

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      if (mainWorkspace) mainWorkspace.style.display = "none";
      if (authPageView) authPageView.style.display = "flex";
      switchState("login");
    });
  }
  // 1. Submit Login Form
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearAlert();
      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value.trim();

      if (!email || !password) {
        showAlert("Please enter both email and password / يرجى إدخال البريد الإلكتروني وكلمة المرور.");
        return;
      }

      setButtonLoading(submitLoginBtn, true);
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (!res.ok) {
          // If unverified, switch to OTP state
          if (res.status === 403 && data.detail && (data.detail.includes("not verified") || data.detail.includes("غير مفعل"))) {
            switchState("otp", email);
            showAlert(data.detail, false);
            return;
          }
          throw new Error(data.detail || "Authentication failed");
        }

        // Login Successful
        AppState.user = data.user;
        localStorage.setItem("physix_user", JSON.stringify(data.user));

        // Restore saved stars/progress
        if (data.progress) {
          data.progress.forEach((p) => {
            AppState.progress[p.module_id] = { stars: p.stars, best_score: p.best_score };
          });
          updateUIStars();
        }

        applyUserSession(data.user);
        if (authPageView) authPageView.style.display = "none";
        if (mainWorkspace) mainWorkspace.style.display = "block";
        sfx.playSuccess();
      } catch (err) {
        showAlert(err.message);
      } finally {
        setButtonLoading(submitLoginBtn, false);
      }
    });
  }

  // 2. Submit Register Form
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearAlert();
      const role = document.querySelector("input[name='registerRole']:checked")?.value || "student";
      const fullName = document.getElementById("registerFullName").value.trim();
      const email = document.getElementById("registerEmail").value.trim();
      const password = document.getElementById("registerPassword").value.trim();

      if (!fullName || !email || !password) {
        showAlert("Please fill out all registration fields / يرجى تعبئة كافة الحقول.");
        return;
      }

      if (password.length < 6) {
        showAlert("Password must be at least 6 characters / كلمة المرور يجب أن لا تقل عن 6 أحرف.");
        return;
      }

      setButtonLoading(submitRegisterBtn, true);
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            full_name: fullName,
            role
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Registration failed");

        // Switch to OTP Verification State
        switchState("otp", email);
        showAlert(`✓ Verification code sent to ${email}. Valid for 5 minutes.`, true);
        sfx.playClick();
      } catch (err) {
        showAlert(err.message);
      } finally {
        setButtonLoading(submitRegisterBtn, false);
      }
    });
  }

  // 3. Submit OTP Form
  const otpForm = document.getElementById("otpForm");
  if (otpForm) {
    otpForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearAlert();
      const code = document.getElementById("otpCodeInput").value.trim();

      if (!code || code.length !== 6) {
        showAlert("Please enter the complete 6-digit numeric OTP code / يرجى إدخال رمز التحقق المكون من 6 أرقام.");
        return;
      }

      setButtonLoading(submitOtpBtn, true);
      try {
        const res = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: currentOtpEmail,
            otp_code: code
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "OTP verification failed");

        if (otpCountdownTimer) clearInterval(otpCountdownTimer);

        AppState.user = data.user;
        localStorage.setItem("physix_user", JSON.stringify(data.user));

        if (data.progress) {
          data.progress.forEach((p) => {
            AppState.progress[p.module_id] = { stars: p.stars, best_score: p.best_score };
          });
          updateUIStars();
        }

        applyUserSession(data.user);
        if (authPageView) authPageView.style.display = "none";
        if (mainWorkspace) mainWorkspace.style.display = "block";
        sfx.playSuccess();
      } catch (err) {
        showAlert(err.message);
      } finally {
        setButtonLoading(submitOtpBtn, false);
      }
    });
  }

  // 4. Resend OTP Button
  if (resendOtpBtn) {
    resendOtpBtn.addEventListener("click", async () => {
      clearAlert();
      setButtonLoading(resendOtpBtn, true);
      try {
        const res = await fetch("/api/auth/resend-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: currentOtpEmail })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Could not resend OTP");

        startOtpCountdown(300);
        showAlert("✓ A fresh 6-digit OTP code has been dispatched to your email.", true);
      } catch (err) {
        showAlert(err.message);
      } finally {
        setButtonLoading(resendOtpBtn, false);
      }
    });
  }

  // 5. Submit Forgot Password Form
  const forgotPasswordForm = document.getElementById("forgotPasswordForm");
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearAlert();
      const email = document.getElementById("forgotEmail").value.trim();

      if (!email) {
        showAlert("Please enter your registered email address.");
        return;
      }

      setButtonLoading(submitForgotEmailBtn, true);
      try {
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Could not process password reset request.");

        switchState("reset", email);
        showAlert(`✓ ${data.message || 'Reset code sent to your email.'}`, true);
        sfx.playClick();
      } catch (err) {
        showAlert(err.message);
      } finally {
        setButtonLoading(submitForgotEmailBtn, false);
      }
    });
  }

  // 6. Submit Reset Password Form
  const resetPasswordForm = document.getElementById("resetPasswordForm");
  if (resetPasswordForm) {
    resetPasswordForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearAlert();
      const code = document.getElementById("resetOtpCodeInput").value.trim();
      const newPassword = document.getElementById("resetNewPassword").value.trim();

      if (!code || code.length !== 6) {
        showAlert("Please enter the 6-digit reset code received by email.");
        return;
      }
      if (!newPassword || newPassword.length < 6) {
        showAlert("New password must be at least 6 characters.");
        return;
      }

      setButtonLoading(submitResetPasswordBtn, true);
      try {
        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: currentOtpEmail,
            otp_code: code,
            new_password: newPassword
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Failed to reset password.");

        switchState("login");
        showAlert("✓ Password successfully reset! You can now sign in with your new password.", true);
        const loginEmailInput = document.getElementById("loginEmail");
        if (loginEmailInput) loginEmailInput.value = currentOtpEmail;
        const loginPasswordInput = document.getElementById("loginPassword");
        if (loginPasswordInput) {
          loginPasswordInput.value = "";
          loginPasswordInput.focus();
        }
        sfx.playSuccess();
      } catch (err) {
        showAlert(err.message);
      } finally {
        setButtonLoading(submitResetPasswordBtn, false);
      }
    });
  }

  // 7. Sign Out
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to sign out? / هل تريد بالتأكيد تسجيل الخروج؟")) {
        AppState.user = null;
        localStorage.removeItem("physix_user");
        AppState.progress = {};
        updateUIStars();

        document.getElementById("loggedInBox").style.display = "none";
        if (loginBtn) loginBtn.style.display = "none";

        // Show dedicated auth page view and hide workspace
        if (mainWorkspace) mainWorkspace.style.display = "none";
        if (authPageView) authPageView.style.display = "flex";
        switchState("login");
      }
    });
  }

  // Mandatory Auth Check: if user session exists, resume workspace; otherwise enforce dedicated auth page
  if (!AppState.user) {
    if (authPageView) authPageView.style.display = "flex";
    if (mainWorkspace) mainWorkspace.style.display = "none";
    switchState("login");
  } else {
    if (authPageView) authPageView.style.display = "none";
    if (mainWorkspace) mainWorkspace.style.display = "block";
    applyUserSession(AppState.user);
    fetchUserProfile(AppState.user.email);
  }
}

function applyUserSession(user) {
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) loginBtn.style.display = "none";
  const box = document.getElementById("loggedInBox");
  box.style.display = "flex";
  document.getElementById("userAvatar").textContent = user.full_name ? user.full_name.charAt(0).toUpperCase() : "U";
  document.getElementById("userNameLabel").textContent = user.full_name || user.email;
  document.getElementById("userRoleBadge").textContent = (user.role || "student").toUpperCase();

  // Auto-fill student fields in Exam mode
  const emailInp = document.getElementById("examStudentEmailInput");
  const nameInp = document.getElementById("examStudentNameInput");
  if (emailInp) emailInp.value = user.email;
  if (nameInp) nameInp.value = user.full_name || user.email;

  const instTab = document.querySelector('.nav-tab[data-tab="instructor"]');
  if (instTab) {
    if (user.role === "instructor") {
      instTab.style.display = "inline-flex";
      instTab.click();
    } else {
      instTab.style.display = "none";
      if (AppState.activeTab === "instructor") {
        document.querySelector('.nav-tab[data-tab="lab"]')?.click();
      }
    }
  }
}

async function fetchUserProfile(email) {
  try {
    const res = await fetch(`/api/user/profile?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    if (res.ok && data.progress) {
      data.progress.forEach((p) => {
        AppState.progress[p.module_id] = { stars: p.stars, best_score: p.best_score };
      });
      updateUIStars();
    }
  } catch (e) {}
}
