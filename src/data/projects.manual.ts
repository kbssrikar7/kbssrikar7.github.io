/**
 * Hand-written project copy. This is the source of truth for anything a human
 * should author: blurbs, metrics, and the live-URL map.
 *
 * The live URLs here are curated, NOT taken from the GitHub `homepage` field -
 * several repos advertise a homepage that is dead (BillFlow's Railway deploy
 * 404s, shopify-analytics' Render deploy is down).
 *
 * `scripts/curate.py` never writes to this file. Merging happens in
 * src/lib/projects.ts, where these fields always win.
 */

export type ManualProject = {
  slug: string;
  title: string;
  blurb: string;
  detail: string;
  tech: string[];
  liveUrl?: string;
  /** Set when the repo has a live URL that is dead or unreliable. */
  liveNote?: string;
  metrics?: { value: string; label: string }[];
  /** Pulled from the repo's own README screenshots. */
  readmeImage?: string;
};

export const manualProjects: ManualProject[] = [
  {
    slug: 'healthcare-qa-chatbot',
    title: 'MediQuery',
    blurb: 'Medical Q&A that shows its work — hybrid retrieval over 505K documents with per-answer confidence and source attribution.',
    detail:
      'My capstone. Most medical chatbots answer confidently and cite nothing, which is the exact failure mode that makes them unusable in practice. MediQuery retrieves with dense embeddings and BM25 in parallel, fuses the rankings with Reciprocal Rank Fusion, and attaches an explainability score built from retrieval confidence, generation confidence, and source attribution — so a wrong answer is visibly a low-confidence answer. It is backed by a 16-module pytest suite and a 6-stage CI/CD pipeline covering linting, testing, and security scanning.',
    tech: ['FastAPI', 'LangChain', 'Qdrant', 'ChromaDB', 'Next.js', 'Docker'],
    liveUrl: 'https://mediquery-healthcare.vercel.app',
    metrics: [
      { value: '505K+', label: 'documents indexed' },
      { value: '3-way', label: 'hybrid retrieval' },
      { value: '16', label: 'test modules' },
    ],
  },
  {
    slug: 'cardiac-risk-stratification',
    title: 'Cardiac Risk Stratification',
    blurb: 'Multi-modal cardiac MRI pipeline — U-Net segmentation, radiomics, and a calibrated classifier that explains every prediction.',
    detail:
      'Segments cardiac MRI with a U-Net, extracts radiomics and infarct-burden features from the masks, and feeds them to a calibrated XGBoost classifier. Calibration matters here: an uncalibrated risk score is not a risk score. Explainability runs at both levels — SHAP for the tabular features, Grad-CAM back onto the imaging — so a clinician can see which part of the heart drove the number.',
    tech: ['PyTorch', 'U-Net', 'XGBoost', 'SHAP', 'Grad-CAM', 'FastAPI', 'Next.js'],
    liveUrl: 'https://cardiac-risk-frontend.vercel.app/',
    metrics: [
      { value: 'multi-modal', label: 'imaging + tabular' },
      { value: 'calibrated', label: 'probability output' },
    ],
  },
  {
    slug: 'headphonesafety',
    title: 'Headphone Safety',
    blurb: "Brings iOS's 'Reduce Loud Sounds' to macOS, Linux, Windows, and Android — a real-time peak limiter, not just a volume cap.",
    detail:
      'A volume cap alone does not protect hearing, because transients blow straight past it. This runs an actual peak-limiting signal processor in the audio path on four platforms, each through its native audio stack — CoreAudio on macOS, PipeWire on Linux, WASAPI on Windows, and DynamicsProcessing on Android. The macOS build ships a virtual loopback driver for routing, plus watchdog and rollback logic that restores safe output within one second of a device disconnect, and a startup recovery check that guards against unclean crashes.',
    tech: ['Swift', 'Rust', 'C++', 'Kotlin', 'CoreAudio', 'PipeWire', 'WASAPI'],
    metrics: [
      { value: '4', label: 'platforms' },
      { value: '<1s', label: 'failsafe recovery' },
      { value: '5', label: 'headroom presets' },
    ],
  },
  {
    slug: 'led_control_deploy',
    title: 'ESP32 Fleet OTA',
    blurb: 'Admin dashboard and over-the-air firmware pipeline for a fleet of ESP32 devices, with browser-based flashing.',
    detail:
      'Managing firmware on deployed IoT hardware is the part nobody demos. This handles LED and relay control, RS485 solar-meter readings, and MQTT-driven OTA updates across a device fleet — with flashing that runs in the browser via WebSerial, so a field technician needs no toolchain. Firmware artifacts live in Cloudflare R2.',
    tech: ['ESP32', 'MQTT', 'Cloudflare R2', 'GitHub Actions', 'Next.js', 'WebSerial'],
    liveUrl: 'https://ledcontroldeploy.vercel.app',
  },
  {
    slug: 'studyFlow--AI_Powered_Productivity_Suite',
    title: 'StudyFlow',
    blurb: 'Full-stack study suite — Pomodoro, Kanban, snippet manager, and activity heatmap, with five Groq-backed AI features.',
    detail:
      'A productivity suite built around focused study sessions: Pomodoro timer, Kanban task board, code snippet manager, and an activity heatmap, served by six FastAPI routers. Five AI features run on the Groq API — study plan generation, code explanation, and focus-pattern analysis among them. It uses Google OAuth and JWT auth, PostgreSQL on Neon, and automated Vercel deploys. The UI is deliberately cinematic, styled after The Dark Knight and The Batman.',
    tech: ['React', 'FastAPI', 'PostgreSQL', 'Neon', 'Groq', 'JWT'],
    liveUrl: 'https://studyflow-app-pearl.vercel.app',
    metrics: [
      { value: '6', label: 'API routers' },
      { value: '5', label: 'AI features' },
    ],
  },
  {
    slug: 'handwritten-equation-solver',
    title: 'Handwritten Equation Solver',
    blurb: 'A custom CNN that reads handwritten math and solves it — 14 symbols at 95% test accuracy.',
    detail:
      'An OpenCV pipeline normalizes input to 32×32 grayscale and segments individual symbols, then a custom CNN classifies 14 mathematical symbols at 95% test accuracy before the expression is parsed and evaluated. Next.js frontend on Vercel, FastAPI inference API on Hugging Face Spaces.',
    tech: ['TensorFlow', 'OpenCV', 'FastAPI', 'Next.js', 'Hugging Face'],
    liveUrl: 'https://simple-math-solver.vercel.app/',
    metrics: [
      { value: '95%', label: 'test accuracy' },
      { value: '14', label: 'symbol classes' },
    ],
  },
  {
    slug: 'n8n-upi-payment-gateway-django',
    title: 'Self-Hosted UPI Gateway',
    blurb: 'Direct-to-bank UPI payments confirmed by parsing bank credit-alert emails — no aggregator, no merchant account.',
    detail:
      'Payment aggregators take a cut and require a merchant account. This skips both: payments go straight to the bank account, and an n8n workflow watches the bank\'s credit-alert emails, matches them against pending orders, and fires a webhook back into Django to confirm. It is a pragmatic answer to a real constraint faced by small Indian merchants.',
    tech: ['Django', 'n8n', 'UPI', 'Webhooks', 'Python'],
  },
  {
    slug: 'ota-flasher',
    title: 'OTA Flasher',
    blurb: 'Cross-platform desktop app for ESP32 firmware deployment, written in Rust with egui.',
    detail:
      'The desktop counterpart to the ESP32 fleet dashboard: a native Rust/egui application that pushes firmware to devices over MQTT with TLS, pulling artifacts from Cloudflare R2.',
    tech: ['Rust', 'egui', 'MQTT', 'TLS', 'Cloudflare R2'],
  },
  {
    slug: 'esp32-energy-meter-pcb',
    title: 'ESP32 Energy Meter PCB',
    blurb: 'Fab-ready KiCad board for a single-phase energy meter around the ATM90E26 metering AFE.',
    detail:
      'A complete hardware design, not a breadboard sketch: single-phase energy metering built on the ATM90E26 AFE with an ESP32, DRC and ERC clean, SPICE-validated, and ready to send to a fab.',
    tech: ['KiCad', 'ESP32', 'ATM90E26', 'SPICE'],
  },
  {
    slug: 'ytdlp-gui',
    title: 'yt-dlp GUI',
    blurb: 'Native macOS GUI for yt-dlp, written in Rust and tuned for Apple Silicon.',
    detail:
      'A native wrapper around yt-dlp and FFmpeg with configurable quality, format, and output settings, plus packaging scripts that automate dependency installation and macOS app bundling.',
    tech: ['Rust', 'yt-dlp', 'FFmpeg', 'macOS'],
  },
  {
    slug: 'shopify-analytics',
    title: 'Shopify Analytics',
    blurb: 'Rails 7 analytics for Shopify stores — background jobs, webhooks, and LLM-powered natural-language queries.',
    detail:
      'A Ruby on Rails 7 analytics application for Shopify: webhook ingestion, background job processing, interactive charts, and an LLM layer that turns plain-English questions into queries over store data.',
    tech: ['Ruby on Rails', 'Shopify API', 'Groq', 'Sidekiq', 'Webhooks'],
    liveNote: 'Hosted demo retired — source and screenshots on GitHub.',
    readmeImage:
      'https://raw.githubusercontent.com/kbssrikar7/shopify-analytics/main/screenshots/dashboard.png',
  },
  {
    slug: 'BillFlow',
    title: 'BillFlow',
    blurb: 'Retail billing and POS system — Spring Boot and MySQL behind a responsive React storefront.',
    detail:
      'A full-stack point-of-sale application covering sales, inventory, and payments, with a Spring Boot backend over MySQL and a React interface.',
    tech: ['Java', 'Spring Boot', 'MySQL', 'React'],
    liveNote: 'Hosted demo retired — source on GitHub.',
  },
  {
    slug: 'heart-attack-risk-ensemble',
    title: 'Heart Attack Risk Ensemble',
    blurb: 'Recall-weighted ensemble for heart attack risk — tuned so false negatives cost more than false positives.',
    detail:
      'A screening model where the asymmetry matters: missing a true positive is far worse than flagging a false one, so the ensemble is tuned for recall rather than headline accuracy. Deployed as a Hugging Face Space.',
    tech: ['scikit-learn', 'Ensemble methods', 'Hugging Face'],
    // The HF Space is down ("Launch timed out, workload was not healthy").
    // Note that HF serves its error page with HTTP 200, so a status probe alone
    // reports this as live - it is not. Verified by screenshot.
    liveNote: 'Hugging Face Space is currently down — source on GitHub.',
  },
  {
    slug: 'house-price-prediction-app',
    title: 'House Price Prediction',
    blurb: 'End-to-end ML pipeline on the Kaggle House Prices dataset — supervised regression, clustering, and SHAP interpretability.',
    detail:
      'Ridge, RandomForest, XGBoost, LightGBM, and SVM for regression; KMeans, DBSCAN, and PCA for unsupervised structure; SHAP for interpretability. Packaged with a Streamlit app and Docker for reproducibility.',
    tech: ['XGBoost', 'LightGBM', 'scikit-learn', 'SHAP', 'Streamlit', 'Docker'],
  },
  {
    slug: 'azure-cost-planner',
    title: 'Azure Cost Planner',
    blurb: 'Streamlit tool for estimating Azure VM costs before you provision them.',
    detail: 'A cost estimation tool for Azure virtual machines, built as a Streamlit app.',
    tech: ['Python', 'Streamlit', 'Azure'],
    liveUrl: 'https://azure-cost-planner.streamlit.app',
    liveNote: 'Hosted on Streamlit Cloud; it may take about 30 seconds to wake up.',
  },
  {
    slug: 'ensemble-heart-disease-prediction',
    title: 'Heart Disease Ensemble',
    blurb: 'An earlier ensemble approach to heart disease prediction, deployed on Streamlit.',
    detail: 'An ensemble classifier for heart disease risk, packaged as a Streamlit application.',
    tech: ['scikit-learn', 'Ensemble methods', 'Streamlit'],
    liveUrl: 'https://ensemble-heart-disease-prediction.streamlit.app',
    liveNote: 'Hosted on Streamlit Cloud; it may take about 30 seconds to wake up.',
  },
  {
    slug: 'TCS_IPA',
    title: 'TCS Xplore Prep',
    blurb: 'Java solutions, practice programs, and an interactive practice app for the TCS Xplore assessment.',
    detail:
      'Curated Java coding solutions and MCQ notes for the TCS Xplore IPA/NQT assessment, alongside an interactive practice web app I built.',
    tech: ['Java', 'JavaScript'],
  },
];
