import { React, run } from "uebersicht";

// One-time cleanup of legacy dummy data in storage
try {
  if (typeof window !== "undefined" && window.localStorage) {
    window.localStorage.removeItem("cmd_career_inspector_v1");
    window.localStorage.removeItem("cmd_career_inspector_v2");
    window.localStorage.removeItem("cyberpunk-dashboard-projects-v1");
    window.localStorage.removeItem("cyberpunk-dashboard-projects-v2");
    window.localStorage.removeItem("cyberpunk-dashboard-projects-v3");
    window.localStorage.removeItem("cyberpunk_learning_courses_v1");
    window.localStorage.removeItem("cyberpunk_learning_courses_v2");
    window.localStorage.removeItem("cyberpunk_learning_courses_v3");
  }
} catch (e) {}

const QUICK_APPS_KEY = "cyberpunk-dashboard-quick-apps-v4";
const PREVIOUS_QUICK_APPS_KEY = "cyberpunk-dashboard-quick-apps-v3";
const QUICK_EDIT_KEY = "cyberpunk-dashboard-quick-apps-editing";
const CAREER_DEFAULTS_KEY = "cyberpunk-dashboard-career-defaults-v2";
const TASKS_KEY = "cyberpunk-dashboard-tasks-v1";
const TASK_EDIT_KEY = "cyberpunk-dashboard-tasks-editing";
const PROJECTS_KEY = "cyberpunk-dashboard-projects-v4";
const MAIL_FILTER_KEY = "cyberpunk-dashboard-mail-filter";
const loadMailFilter = () => {
  try {
    const v = localStorage.getItem(MAIL_FILTER_KEY);
    if (v === "all" || v === "jobs" || v === "unread") return v;
  } catch (e) {}
  return "all";
};
const saveMailFilter = (f) => {
  try {
    localStorage.setItem(MAIL_FILTER_KEY, f);
  } catch (e) {}
};
const isJobMail = (msg) => {
  if (!msg) return false;
  if (typeof msg.is_job === "boolean") return msg.is_job;
  const text = `${msg.sender || ""} ${msg.email || ""} ${msg.subject || ""}`.toLowerCase();
  const negatives = [
    "credit card", "debit card", "statement", "emi", "bank", "otp", "invoice", "bill",
    "flight", "itinerary", "booking", "boarding pass", "swiggy", "zomato", "uber", "ola",
    "amazon order", "flipkart", "cashback", "recharge", "security alert", "password reset",
    "verification code", "netflix", "prime video", "spotify", "subscription renewed",
    "order confirmed", "delivered", "shipping update", "dispatched"
  ];
  if (negatives.some((neg) => text.includes(neg))) return false;
  const jobKeywords = [
    "recruiter", "recruitment", "recruiting", "talent acquisition", "staffing",
    "hiring", "headhunter", "sourcer", "careers", "career opportunity",
    "interview", "interview invitation", "shortlisted", "job opportunity",
    "job opening", "job application", "application received", "application status",
    "role of", "opening for", "position of", "candidate", "resume", "curriculum vitae",
    "offer letter", "assessment", "coding test", "coderpad", "hackerrank",
    "software engineer", "frontend", "backend", "full stack", "fullstack", "sde",
    "java developer", "python developer", "react developer", "web developer",
    "referred you", "invitation to apply", "job alert", "recommended job"
  ];
  if (jobKeywords.some((kw) => text.includes(kw))) return true;
  const jobPlatforms = [
    "linkedin", "naukri", "indeed", "instahyre", "hirist", "cutshort", "glassdoor",
    "wellfound", "angellist", "greenhouse", "lever.co", "workday", "smartrecruiters",
    "ashbyhq", "ashby", "jobvite", "bamboohr", "workable", "hirect", "foundit", "monster"
  ];
  const senderLower = `${msg.sender || ""} ${msg.email || ""}`.toLowerCase();
  return jobPlatforms.some((p) => senderLower.includes(p));
};
const DEFAULT_SDLC_GATES = [
  "1. PRD & Scope Doc",
  "2. HLD & Arch Diagram",
  "3. DB Schema & Indexing",
  "4. Core REST APIs & Auth",
  "5. Caching & Kafka Queue",
  "6. Unit & Postman Tests",
  "7. Docker & CI/CD Pipeline",
  "8. Prod Deploy & Docs",
];

const DEFAULT_GATE_TASKS = [
  // Gate 0: 1. PRD & Scope Doc
  [
    {
      id: "g0-t1",
      name: "Functional Scope & Requirements Spec",
      done: true,
      subtasks: [
        { id: "g0-t1-s1", name: "Core Domain Entities & Boundary Contracts", done: true },
        { id: "g0-t1-s2", name: "Edge Cases, Rate Limits & SLAs Definition", done: true },
      ],
    },
    {
      id: "g0-t2",
      name: "Architecture Blueprint & User Stories",
      done: true,
      subtasks: [
        { id: "g0-t2-s1", name: "System Context & Component Interaction Diagram", done: true },
        { id: "g0-t2-s2", name: "Non-Functional Requirements (Latency & Throughput Goals)", done: true },
      ],
    },
  ],
  // Gate 1: 2. HLD & Arch Diagram
  [
    {
      id: "g1-t1",
      name: "Distributed Component Architecture",
      done: true,
      subtasks: [
        { id: "g1-t1-s1", name: "Microservices Boundary & REST / gRPC Contracts", done: true },
        { id: "g1-t1-s2", name: "Fault Tolerance & Fallback Strategy (Resilience4j)", done: true },
      ],
    },
    {
      id: "g1-t2",
      name: "Event Topology & Message Flow",
      done: true,
      subtasks: [
        { id: "g1-t2-s1", name: "Kafka Topic Schema, Partitions & Key Strategy", done: true },
        { id: "g1-t2-s2", name: "Consumer Group Scalability & Backpressure Plan", done: true },
      ],
    },
  ],
  // Gate 2: 3. DB Schema & Indexing
  [
    {
      id: "g2-t1",
      name: "Relational Schema & Migrations",
      done: true,
      subtasks: [
        { id: "g2-t1-s1", name: "PostgreSQL DDL Migration Scripts (Flyway/Liquibase)", done: true },
        { id: "g2-t1-s2", name: "Foreign Key Constraints & Audit Trails", done: true },
      ],
    },
    {
      id: "g2-t2",
      name: "Indexing & Query Optimization",
      done: true,
      subtasks: [
        { id: "g2-t2-s1", name: "Composite B-Tree & Partial Indexes on Hot Queries", done: true },
        { id: "g2-t2-s2", name: "EXPLAIN ANALYZE Verification (< 5ms Execution)", done: true },
      ],
    },
  ],
  // Gate 3: 4. Core REST APIs & Auth
  [
    {
      id: "g3-t1",
      name: "RESTful Controllers & Domain Services",
      done: true,
      subtasks: [
        { id: "g3-t1-s1", name: "Idempotent Transaction Endpoints with DTO Validation", done: true },
        { id: "g3-t1-s2", name: "Global Exception Handler & Standardized RFC7807 Errors", done: true },
      ],
    },
    {
      id: "g3-t2",
      name: "Authentication & Security Layer",
      done: true,
      subtasks: [
        { id: "g3-t2-s1", name: "Stateless JWT Validation & SecurityFilterChain", done: true },
        { id: "g3-t2-s2", name: "Role-Based Access Control (RBAC) & Method Security", done: true },
      ],
    },
  ],
  // Gate 4: 5. Caching & Kafka Queue
  [
    {
      id: "g4-t1",
      name: "Redis Distributed Caching",
      done: true,
      subtasks: [
        { id: "g4-t1-s1", name: "Cache-Aside Pattern & Dynamic TTL with Entropy Jitter", done: true },
        { id: "g4-t1-s2", name: "Distributed Lock (Redisson / Lua Script) for Concurrency", done: true },
      ],
    },
    {
      id: "g4-t2",
      name: "Kafka Producer & Consumer Pipeline",
      done: true,
      subtasks: [
        { id: "g4-t2-s1", name: "Idempotent Producer with acks=all & Transactional Outbox", done: true },
        { id: "g4-t2-s2", name: "Consumer Group with Retry Topics & Dead Letter Queue (DLQ)", done: true },
      ],
    },
  ],
  // Gate 5: 6. Unit & Postman Tests
  [
    {
      id: "g5-t1",
      name: "Unit & Mock Testing (JUnit 5 & Mockito)",
      done: false,
      subtasks: [
        { id: "g5-t1-s1", name: "Business Logic Unit Tests (> 85% Code Coverage)", done: false },
        { id: "g5-t1-s2", name: "Controller Slice Tests via @WebMvcTest", done: false },
      ],
    },
    {
      id: "g5-t2",
      name: "Integration & API Verification",
      done: false,
      subtasks: [
        { id: "g5-t2-s1", name: "Testcontainers for Real PostgreSQL & Kafka", done: false },
        { id: "g5-t2-s2", name: "Automated Postman / Newman Regression Suite", done: false },
      ],
    },
  ],
  // Gate 6: 7. Docker & CI/CD Pipeline
  [
    {
      id: "g6-t1",
      name: "Containerization & Optimization",
      done: false,
      subtasks: [
        { id: "g6-t1-s1", name: "Multi-Stage Dockerfile with Distroless JRE (< 150MB)", done: false },
        { id: "g6-t1-s2", name: "Docker Compose Environment with Healthchecks", done: false },
      ],
    },
    {
      id: "g6-t2",
      name: "Continuous Integration Workflow",
      done: false,
      subtasks: [
        { id: "g6-t2-s1", name: "GitHub Actions Automated Test & Static Analysis (SonarQube)", done: false },
        { id: "g6-t2-s2", name: "Automated Container Image Vulnerability Scan & Registry Push", done: false },
      ],
    },
  ],
  // Gate 7: 8. Prod Deploy & Docs
  [
    {
      id: "g7-t1",
      name: "Cloud Deployment & Production Hardening",
      done: false,
      subtasks: [
        { id: "g7-t1-s1", name: "Kubernetes Deployments, Services & Ingress Configuration", done: false },
        { id: "g7-t1-s2", name: "Zero-Downtime Rolling Update & Liveness/Readiness Probes", done: false },
      ],
    },
    {
      id: "g7-t2",
      name: "Telemetry, Dashboards & Documentation",
      done: false,
      subtasks: [
        { id: "g7-t2-s1", name: "Prometheus Metrics & Grafana Operational Dashboard", done: false },
        { id: "g7-t2-s2", name: "Interactive OpenAPI / Swagger UI & Architecture Walkthrough Video", done: false },
      ],
    },
  ],
];

const defaultGateTasksForProj = (pGates) => {
  return DEFAULT_GATE_TASKS.map((gateTaskList, gIdx) => {
    const isGateDone = Boolean(pGates && pGates[gIdx]);
    return gateTaskList.map((t) => ({
      ...t,
      done: isGateDone ? true : Boolean(t.done),
      subtasks: (t.subtasks || []).map((st) => ({
        ...st,
        done: isGateDone ? true : Boolean(st.done),
      })),
    }));
  });
};
const DEFAULT_TASKS = [
  { id: "learn-spring-kafka", text: "Learn: Spring Boot + Kafka", minutes: 45, done: true },
  { id: "build-microservice", text: "Build: Microservice project", minutes: 60, done: true },
  { id: "practice-sql-postgres", text: "Practice: SQL + PostgreSQL", minutes: 30, done: true },
  { id: "read-system-design", text: "Read: System design", minutes: 30, done: false },
  { id: "apply-product-companies", text: "Apply: Product companies", minutes: 20, done: false },
  { id: "update-obsidian-notes", text: "Notes: Update Obsidian", minutes: 15, done: false },
];
const QUICK_APP_ICONS_DIR = "/Users/sayyad/Library/Application Support/Übersicht/widgets/cyberpunk-dashboard.widget/icons/optimized";
const DEFAULT_QUICK_APPS = [
  { name: "Postman", path: "/Applications/Postman.app", group: "dev", icon: "postman.png" },
  { name: "Photos", path: "/System/Applications/Photos.app", group: "edit", icon: "photos.png" },
  { name: "iMovie", path: "/Applications/iMovie.app", group: "edit", icon: "imovie.png" },
  { name: "LinkedIn", path: "https://www.linkedin.com/", group: "career", iconLabel: "in" },
  { name: "Naukri", path: "https://www.naukri.com/", group: "career", iconLabel: "N" },
  { name: "Gmail", path: "https://mail.google.com/", group: "career", iconLabel: "M" },
  { name: "VLC", path: "/Applications/VLC.app", group: "entertainment", icon: "vlc.png" },
  { name: "Music", path: "/System/Applications/Music.app", group: "entertainment", icon: "music.png" },
];

const normalizeQuickApp = (app) => {
  if (!app || typeof app !== "object") return app;
  const name = (app.name || "").toLowerCase();
  if (name === "postman") return { ...app, path: "/Applications/Postman.app", icon: "postman.png" };
  if (name === "photos") return { ...app, path: "/System/Applications/Photos.app", icon: "photos.png" };
  if (name === "imovie") return { ...app, path: "/Applications/iMovie.app", icon: "imovie.png" };
  if (name === "inshot") return { ...app, path: "/Applications/InShot.app/Wrapper/InstaShot.app", icon: "inshot.png" };
  if (name === "vn") return { ...app, path: "/Applications/VN.app", icon: "vn.png" };
  if (name === "vlc") return { ...app, path: "/Applications/VLC.app", icon: "vlc.png", group: "entertainment" };
  if (name === "music") return { ...app, path: "/System/Applications/Music.app", icon: "music.png", group: "entertainment" };
  return app;
};

const loadQuickApps = () => {
  try {
    const saved = window.localStorage.getItem(QUICK_APPS_KEY);
    if (saved === null) {
      const previous = window.localStorage.getItem(PREVIOUS_QUICK_APPS_KEY);
      if (previous) {
        const oldApps = JSON.parse(previous);
        if (Array.isArray(oldApps) && oldApps.length) {
          const migrated = oldApps.filter((app) => app && typeof app.path === "string" && typeof app.name === "string").map(normalizeQuickApp);
          if (!migrated.some((app) => app.group === "entertainment")) migrated.push(...DEFAULT_QUICK_APPS.filter((app) => app.group === "entertainment"));
          migrated.push(...DEFAULT_QUICK_APPS.filter((app) => app.group === "career" && !migrated.some((savedApp) => savedApp.path === app.path)));
          window.localStorage.setItem(CAREER_DEFAULTS_KEY, "true");
          saveQuickApps(migrated);
          return migrated;
        }
      }
      window.localStorage.setItem(CAREER_DEFAULTS_KEY, "true");
      return DEFAULT_QUICK_APPS;
    }
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return DEFAULT_QUICK_APPS;
    const apps = parsed.filter((app) => app && typeof app.path === "string" && typeof app.name === "string").map(normalizeQuickApp);
    const defaultsSeeded = window.localStorage.getItem(CAREER_DEFAULTS_KEY) === "true";
    if (!defaultsSeeded) {
      for (const app of DEFAULT_QUICK_APPS.filter((item) => item.group === "career")) {
        if (!apps.some((item) => item.path === app.path)) apps.push(app);
      }
      saveQuickApps(apps);
      window.localStorage.setItem(CAREER_DEFAULTS_KEY, "true");
    }
    return apps;
  } catch (e) { return DEFAULT_QUICK_APPS; }
};

const saveQuickApps = (apps) => {
  try {
    window.localStorage.setItem(QUICK_APPS_KEY, JSON.stringify(apps));
  } catch (e) { }
};

const loadTasks = () => {
  try {
    const saved = window.localStorage.getItem(TASKS_KEY);
    if (saved === null) {
      window.localStorage.setItem(TASKS_KEY, JSON.stringify(DEFAULT_TASKS));
      return DEFAULT_TASKS;
    }
    const tasks = JSON.parse(saved);
    return Array.isArray(tasks) ? tasks.filter((task) => task && typeof task.text === "string").map((task, index) => ({
      id: task.id || `task-${index}`,
      text: task.text,
      minutes: Number.isFinite(Number(task.minutes)) ? Math.max(0, Number(task.minutes)) : 0,
      done: Boolean(task.done),
    })) : DEFAULT_TASKS;
  } catch (e) { return DEFAULT_TASKS; }
};

const saveTasks = (tasks) => {
  try {
    window.localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (e) { }
};

const loadTaskEdit = () => {
  try {
    return window.localStorage.getItem(TASK_EDIT_KEY) === "true";
  } catch (e) { return false; }
};

const saveTaskEdit = (editing) => {
  try {
    window.localStorage.setItem(TASK_EDIT_KEY, String(editing));
  } catch (e) { }
};

const loadQuickEdit = () => {
  try { return JSON.parse(window.localStorage.getItem(QUICK_EDIT_KEY) || "{}"); }
  catch (e) { return {}; }
};

const saveQuickEdit = (state) => {
  try {
    window.localStorage.setItem(QUICK_EDIT_KEY, JSON.stringify(state));
  } catch (e) { }
};

const SEED_PROJECTS = [
  {
    id: "proj-payment-gateway",
    name: "High-Throughput Payment Engine",
    stack: "Spring Boot · PostgreSQL · Kafka · Redis",
    expanded: false,
    gates: [true, true, true, true, false, false, false, false],
  },
  {
    id: "proj-observability-agent",
    name: "Real-Time Telemetry & Log Miner",
    stack: "Java 21 · OpenTelemetry · Debezium · Prometheus",
    expanded: false,
    gates: [true, true, true, false, false, false, false, false],
  },
];

const PROJECTS_ADDED_KEY = "cyberpunk_projects_added_v2";

const loadProjects = () => {
  try {
    const saved = window.localStorage.getItem(PROJECTS_KEY);
    let parsed = [];
    if (saved !== null) {
      try {
        parsed = JSON.parse(saved);
      } catch (e) {
        parsed = [];
      }
    }
    if (!Array.isArray(parsed)) parsed = [];

    const alreadyAdded = window.localStorage.getItem(PROJECTS_ADDED_KEY);
    let modified = false;

    if (!alreadyAdded || parsed.length < 3) {
      for (const sp of SEED_PROJECTS) {
        const exists = parsed.some((p) => p && (p.id === sp.id || (p.name && p.name.trim().toLowerCase() === sp.name.trim().toLowerCase())));
        if (!exists) {
          parsed.push(JSON.parse(JSON.stringify(sp)));
          modified = true;
        }
      }
      if (parsed.length >= 3) {
        window.localStorage.setItem(PROJECTS_ADDED_KEY, "true");
      }
    }

    if (modified || saved === null) {
      window.localStorage.setItem(PROJECTS_KEY, JSON.stringify(parsed));
    }

    return parsed.map((p, idx) => {
      const validGates = Array.isArray(p.gates) && p.gates.length === 8 ? p.gates.map(Boolean) : [false, false, false, false, false, false, false, false];
      const validGateTasks = Array.isArray(p.gateTasks) && p.gateTasks.length === 8 ? p.gateTasks : defaultGateTasksForProj(validGates);
      const validExpandedGates = Array.isArray(p.expandedGates) && p.expandedGates.length === 8 ? p.expandedGates : [true, true, true, false, false, false, false, false];
      return {
        id: p.id || `proj-${idx}`,
        name: p.name || "Untitled Project",
        stack: p.stack || "",
        expanded: Boolean(p.expanded),
        gates: validGates,
        gateTasks: validGateTasks,
        expandedGates: validExpandedGates,
      };
    });
  } catch (e) {
    return SEED_PROJECTS;
  }
};

const saveProjects = (projects) => {
  try {
    window.localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  } catch (e) { }
};

const getStageBadge = (passedCount, totalGates = 8) => {
  if (passedCount >= totalGates) {
    return { text: "COMPLETED", color: "#00e6a0", bg: "rgba(0, 230, 160, 0.15)", border: "rgba(0, 230, 160, 0.35)" };
  }
  if (passedCount >= 6) {
    return { text: "TESTING & DOCKER", color: "#ff5365", bg: "rgba(255, 38, 59, 0.15)", border: "rgba(255, 38, 59, 0.35)" };
  }
  if (passedCount >= 3) {
    return { text: "BUILDING", color: "#08baff", bg: "rgba(8, 186, 255, 0.15)", border: "rgba(8, 186, 255, 0.35)" };
  }
  if (passedCount >= 1) {
    return { text: "ARCH & DESIGN", color: "#ffaa00", bg: "rgba(255, 170, 0, 0.15)", border: "rgba(255, 170, 0, 0.35)" };
  }
  return { text: "PLANNING", color: "#aeb4c5", bg: "rgba(174, 180, 197, 0.15)", border: "rgba(174, 180, 197, 0.3)" };
};

const getNextBlocker = (gates) => {
  const nextIdx = gates.findIndex((g) => !g);
  if (nextIdx === -1) return "✓ All 8 Gates Completed · Production Shipped";
  return `Next: Gate ${nextIdx + 1} (${DEFAULT_SDLC_GATES[nextIdx].replace(/^\d+\.\s*/, "")})`;
};

const focusTaskInput = () => {
  const input = document.querySelector(".tasks .task-input");
  if (input) input.focus();
};

const shellQuote = (value) => `'${value.replace(/'/g, "'\\''")}'`;

const addQuickApp = async (path, group, state, dispatch) => {
  path = path.trim().replace(/\/$/, "");
  if (!path.startsWith("/") || !path.toLowerCase().endsWith(".app")) {
    window.alert("Choose or drop a .app application bundle.");
    return;
  }
  const apps = (state && Array.isArray(state.quickApps)) ? state.quickApps : loadQuickApps();
  const name = path.split("/").pop().replace(/\.app$/i, "");
  const resolveScript = `app=${shellQuote(path)}; if [ -f "$app/Contents/Info.plist" ]; then printf '%s\\n' "$app"; else find "$app" -type f -path '*/Contents/Info.plist' -print -quit | sed 's#/Contents/Info.plist$##'; fi`;
  try { path = String(await run(resolveScript) || "").trim(); } catch (e) { path = ""; }
  if (!path || !path.toLowerCase().endsWith(".app")) {
    window.alert("This app bundle could not be located. Try Choose… and select the app from Applications.");
    return;
  }
  if (apps.some((app) => app.path === path)) return;
  const icon = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.png`;
  const iconPath = `${QUICK_APP_ICONS_DIR}/${icon}`;
  const extractIcon = [
    `app=${shellQuote(path)}`,
    `out=${shellQuote(iconPath)}`,
    `res="$app/Contents/Resources"`,
    `name=$(/usr/libexec/PlistBuddy -c 'Print :CFBundleIconFile' "$app/Contents/Info.plist" 2>/dev/null || true)`,
    `icon="$res/$name"`,
    `case "$icon" in *.icns) ;; *) icon="$icon.icns" ;; esac`,
    `if [ ! -f "$icon" ]; then icon=$(find "$app" -type f \( -iname 'AppIcon*.icns' -o -iname 'AppIcon*.png' -o -iname 'app.icns' \) -print -quit); fi`,
    `if [ -f "$icon" ] && /usr/bin/sips -Z 64 -s format png "$icon" --out "$out" >/dev/null 2>&1; then echo ICON_READY; fi`,
  ].join("; ");
  let iconName = "";
  try {
    if (String(await run(extractIcon) || "").includes("ICON_READY")) iconName = icon;
  } catch (e) { }
  const nextApps = [...apps, { name, path, group, icon: iconName }];
  saveQuickApps(nextApps);
  if (dispatch) {
    dispatch({ type: "SET_QUICK_APPS", quickApps: nextApps });
  }
};

const chooseQuickApp = async (group, state, dispatch) => {
  try {
    const script = 'POSIX path of (choose file with prompt "Choose an application to add")';
    const path = String(await run(`osascript -e ${shellQuote(script)}`) || "").trim();
    if (path) {
      await addQuickApp(path, group, state, dispatch);
    }
  } catch (error) {
    if (!String(error).toLowerCase().includes("user canceled")) {
      window.alert(`Could not choose the app: ${String(error)}`);
    }
  }
};

const handleUpdateTaskText = (taskId, newText, state, dispatch) => {
  const trimmed = newText.trim();
  if (!trimmed) return;
  const currentTasks = (state && Array.isArray(state.tasks)) ? state.tasks : loadTasks();
  const existing = currentTasks.find((t) => t.id === taskId);
  if (existing && existing.text === trimmed) return;
  const nextTasks = currentTasks.map((t) => (t.id === taskId ? { ...t, text: trimmed } : t));
  saveTasks(nextTasks);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_TASKS", tasks: nextTasks });
    }, 0);
  }
};

const handleUpdateTaskMinutes = (taskId, newMinutes, state, dispatch) => {
  const val = parseInt(newMinutes, 10);
  if (isNaN(val) || val < 1) return;
  const currentTasks = (state && Array.isArray(state.tasks)) ? state.tasks : loadTasks();
  const existing = currentTasks.find((t) => t.id === taskId);
  if (existing && existing.minutes === val) return;
  const nextTasks = currentTasks.map((t) => (t.id === taskId ? { ...t, minutes: val } : t));
  saveTasks(nextTasks);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_TASKS", tasks: nextTasks });
    }, 0);
  }
};

const handlePromptEditTask = (taskId, state, dispatch) => {
  const currentTasks = (state && Array.isArray(state.tasks)) ? state.tasks : loadTasks();
  const task = currentTasks.find((t) => t.id === taskId);
  if (!task) return;
  const newText = window.prompt("Edit task description:", task.text);
  if (!newText || !newText.trim() || newText.trim() === task.text) return;
  handleUpdateTaskText(taskId, newText.trim(), state, dispatch);
};

const handleAddTask = (event, state, dispatch) => {
  event.preventDefault();
  const form = event.currentTarget;
  const input = form.querySelector(".task-input");
  const text = input ? input.value.trim() : "";
  if (!text) {
    if (input) input.focus();
    return;
  }
  const minInput = form.querySelector(".task-minutes");
  const minutesValue = minInput ? Number.parseInt(minInput.value, 10) : 0;
  if (!Number.isFinite(minutesValue) || minutesValue < 1) {
    alert("Estimated time is mandatory and must be at least 1 minute!");
    if (minInput) minInput.focus();
    return;
  }
  const newTask = {
    id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    text,
    minutes: minutesValue,
    done: false,
  };
  const tasks = (state && Array.isArray(state.tasks)) ? state.tasks : loadTasks();
  const nextTasks = [...tasks, newTask];
  saveTasks(nextTasks);
  if (dispatch) {
    dispatch({ type: "SET_TASKS", tasks: nextTasks });
  }
  form.reset();
  if (minInput) minInput.value = "0";
  if (input) input.focus();
};

const handleToggleTask = (id, state, dispatch) => {
  const tasks = (state && Array.isArray(state.tasks)) ? state.tasks : loadTasks();
  const nextTasks = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  saveTasks(nextTasks);
  if (dispatch) {
    dispatch({ type: "SET_TASKS", tasks: nextTasks });
  }
};

const handleRemoveTask = (id, state, dispatch) => {
  const tasks = (state && Array.isArray(state.tasks)) ? state.tasks : loadTasks();
  const nextTasks = tasks.filter((t) => t.id !== id);
  saveTasks(nextTasks);
  if (dispatch) {
    dispatch({ type: "SET_TASKS", tasks: nextTasks });
  }
};

const handleToggleTaskEdit = (state, dispatch) => {
  const nextEdit = !(state && state.editTasks);
  saveTaskEdit(nextEdit);
  if (dispatch) {
    dispatch({ type: "SET_TASK_EDIT", editTasks: nextEdit });
  }
};

const handleToggleQuickEdit = (group, state, dispatch) => {
  const current = (state && state.editQuickApps) || loadQuickEdit();
  const nextQuickEdit = { ...current, [group]: !current[group] };
  saveQuickEdit(nextQuickEdit);
  if (dispatch) {
    dispatch({ type: "SET_QUICK_EDIT", editQuickApps: nextQuickEdit });
  }
};

const handleRemoveQuickApp = (path, state, dispatch) => {
  const apps = (state && Array.isArray(state.quickApps)) ? state.quickApps : loadQuickApps();
  const nextApps = apps.filter((app) => app.path !== path);
  saveQuickApps(nextApps);
  if (dispatch) {
    dispatch({ type: "SET_QUICK_APPS", quickApps: nextApps });
  }
};

const handleToggleGate = (projectId, gateIndex, state, dispatch) => {
  const projects = (state && Array.isArray(state.projects)) ? state.projects : loadProjects();
  const nextProjects = projects.map((p) => {
    if (p.id !== projectId) return p;
    const newGates = [...p.gates];
    const nextVal = !newGates[gateIndex];
    newGates[gateIndex] = nextVal;
    let nextGateTasks = Array.isArray(p.gateTasks) ? [...p.gateTasks] : defaultGateTasksForProj(p.gates);
    if (nextGateTasks[gateIndex]) {
      nextGateTasks[gateIndex] = nextGateTasks[gateIndex].map((t) => ({
        ...t,
        done: nextVal,
        subtasks: (t.subtasks || []).map((st) => ({ ...st, done: nextVal })),
      }));
    }
    return { ...p, gates: newGates, gateTasks: nextGateTasks };
  });
  saveProjects(nextProjects);
  if (dispatch) {
    dispatch({ type: "SET_PROJECTS", projects: nextProjects });
  }
};

const handleToggleGateTask = (projectId, gateIndex, taskId, state, dispatch) => {
  const projects = (state && Array.isArray(state.projects)) ? state.projects : loadProjects();
  const nextProjects = projects.map((p) => {
    if (p.id !== projectId) return p;
    let nextGateTasks = Array.isArray(p.gateTasks) ? [...p.gateTasks] : defaultGateTasksForProj(p.gates);
    if (nextGateTasks[gateIndex]) {
      nextGateTasks[gateIndex] = nextGateTasks[gateIndex].map((t) => {
        if (t.id !== taskId) return t;
        const nextDone = !t.done;
        return {
          ...t,
          done: nextDone,
          subtasks: (t.subtasks || []).map((st) => ({ ...st, done: nextDone })),
        };
      });
    }
    const allDone = nextGateTasks[gateIndex] && nextGateTasks[gateIndex].length > 0 && nextGateTasks[gateIndex].every((t) => t.done);
    const newGates = [...p.gates];
    newGates[gateIndex] = allDone;
    return { ...p, gates: newGates, gateTasks: nextGateTasks };
  });
  saveProjects(nextProjects);
  if (dispatch) {
    dispatch({ type: "SET_PROJECTS", projects: nextProjects });
  }
};

const handleToggleGateSubtask = (projectId, gateIndex, taskId, subtaskId, state, dispatch) => {
  const projects = (state && Array.isArray(state.projects)) ? state.projects : loadProjects();
  const nextProjects = projects.map((p) => {
    if (p.id !== projectId) return p;
    let nextGateTasks = Array.isArray(p.gateTasks) ? [...p.gateTasks] : defaultGateTasksForProj(p.gates);
    if (nextGateTasks[gateIndex]) {
      nextGateTasks[gateIndex] = nextGateTasks[gateIndex].map((t) => {
        if (t.id !== taskId) return t;
        const nextSubs = (t.subtasks || []).map((st) => (st.id === subtaskId ? { ...st, done: !st.done } : st));
        const taskDone = nextSubs.length > 0 && nextSubs.every((st) => st.done);
        return { ...t, done: taskDone, subtasks: nextSubs };
      });
    }
    const allDone = nextGateTasks[gateIndex] && nextGateTasks[gateIndex].length > 0 && nextGateTasks[gateIndex].every((t) => t.done);
    const newGates = [...p.gates];
    newGates[gateIndex] = allDone;
    return { ...p, gates: newGates, gateTasks: nextGateTasks };
  });
  saveProjects(nextProjects);
  if (dispatch) {
    dispatch({ type: "SET_PROJECTS", projects: nextProjects });
  }
};

const handleToggleGateExpand = (projectId, gateIndex, state, dispatch) => {
  const projects = (state && Array.isArray(state.projects)) ? state.projects : loadProjects();
  const nextProjects = projects.map((p) => {
    if (p.id !== projectId) return p;
    let exp = Array.isArray(p.expandedGates) ? [...p.expandedGates] : [true, true, true, false, false, false, false, false];
    exp[gateIndex] = !exp[gateIndex];
    return { ...p, expandedGates: exp };
  });
  saveProjects(nextProjects);
  if (dispatch) {
    dispatch({ type: "SET_PROJECTS", projects: nextProjects });
  }
};

// --- Full Gate Tasks & Subtasks CRUD Handlers ---

const handleToggleAddGateTaskForm = (gateIndex, state, dispatch) => {
  if (dispatch) {
    const cur = state ? state.addingGateTaskGateIdx : null;
    const next = cur === gateIndex ? null : gateIndex;
    setTimeout(() => {
      dispatch({ type: "SET_ADDING_GATE_TASK_GATE_IDX", addingGateTaskGateIdx: next });
    }, 0);
  }
};

const handleCreateGateTask = (projectId, gateIndex, taskName, state, dispatch) => {
  const trimmed = (taskName || "").trim();
  if (!trimmed) {
    if (dispatch) {
      setTimeout(() => {
        dispatch({ type: "SET_ADDING_GATE_TASK_GATE_IDX", addingGateTaskGateIdx: null });
      }, 0);
    }
    return;
  }
  const projects = (state && Array.isArray(state.projects)) ? state.projects : loadProjects();
  const nextProjects = projects.map((p) => {
    if (p.id !== projectId) return p;
    let nextGateTasks = Array.isArray(p.gateTasks) ? [...p.gateTasks] : defaultGateTasksForProj(p.gates);
    if (!nextGateTasks[gateIndex]) nextGateTasks[gateIndex] = [];
    const newTask = {
      id: `gt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: trimmed,
      done: false,
      subtasks: [],
    };
    nextGateTasks[gateIndex] = [...nextGateTasks[gateIndex], newTask];

    const allDone = nextGateTasks[gateIndex].length > 0 && nextGateTasks[gateIndex].every((t) => t.done);
    const newGates = [...p.gates];
    newGates[gateIndex] = allDone;

    let exp = Array.isArray(p.expandedGates) ? [...p.expandedGates] : [true, true, true, false, false, false, false, false];
    exp[gateIndex] = true;

    return { ...p, gates: newGates, gateTasks: nextGateTasks, expandedGates: exp };
  });
  saveProjects(nextProjects);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_PROJECTS", projects: nextProjects });
      dispatch({ type: "SET_ADDING_GATE_TASK_GATE_IDX", addingGateTaskGateIdx: null });
    }, 0);
  }
};

const handleToggleEditGateTask = (taskId, state, dispatch) => {
  if (dispatch) {
    const cur = state ? state.editingGateTaskId : null;
    const next = cur === taskId ? null : taskId;
    setTimeout(() => {
      dispatch({ type: "SET_EDITING_GATE_TASK_ID", editingGateTaskId: next });
    }, 0);
  }
};

const handleSaveGateTaskName = (projectId, gateIndex, taskId, newName, state, dispatch) => {
  const trimmed = (newName || "").trim();
  if (!trimmed) {
    if (dispatch) {
      setTimeout(() => {
        dispatch({ type: "SET_EDITING_GATE_TASK_ID", editingGateTaskId: null });
      }, 0);
    }
    return;
  }
  const projects = (state && Array.isArray(state.projects)) ? state.projects : loadProjects();
  const nextProjects = projects.map((p) => {
    if (p.id !== projectId) return p;
    let nextGateTasks = Array.isArray(p.gateTasks) ? [...p.gateTasks] : defaultGateTasksForProj(p.gates);
    if (nextGateTasks[gateIndex]) {
      nextGateTasks[gateIndex] = nextGateTasks[gateIndex].map((t) => (t.id === taskId ? { ...t, name: trimmed } : t));
    }
    return { ...p, gateTasks: nextGateTasks };
  });
  saveProjects(nextProjects);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_PROJECTS", projects: nextProjects });
      dispatch({ type: "SET_EDITING_GATE_TASK_ID", editingGateTaskId: null });
    }, 0);
  }
};

const handleDeleteGateTask = (projectId, gateIndex, taskId, state, dispatch) => {
  const projects = (state && Array.isArray(state.projects)) ? state.projects : loadProjects();
  const nextProjects = projects.map((p) => {
    if (p.id !== projectId) return p;
    let nextGateTasks = Array.isArray(p.gateTasks) ? [...p.gateTasks] : defaultGateTasksForProj(p.gates);
    if (nextGateTasks[gateIndex]) {
      nextGateTasks[gateIndex] = nextGateTasks[gateIndex].filter((t) => t.id !== taskId);
    }
    const allDone = nextGateTasks[gateIndex] && nextGateTasks[gateIndex].length > 0 && nextGateTasks[gateIndex].every((t) => t.done);
    const newGates = [...p.gates];
    newGates[gateIndex] = allDone;
    return { ...p, gates: newGates, gateTasks: nextGateTasks };
  });
  saveProjects(nextProjects);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_PROJECTS", projects: nextProjects });
      dispatch({ type: "SET_EDITING_GATE_TASK_ID", editingGateTaskId: null });
      dispatch({ type: "SET_ADDING_GATE_SUBTASK_ID", addingGateSubtaskId: null });
    }, 0);
  }
};

const handleToggleAddGateSubtaskForm = (taskId, state, dispatch) => {
  if (dispatch) {
    const cur = state ? state.addingGateSubtaskId : null;
    const next = cur === taskId ? null : taskId;
    setTimeout(() => {
      dispatch({ type: "SET_ADDING_GATE_SUBTASK_ID", addingGateSubtaskId: next });
    }, 0);
  }
};

const handleCreateGateSubtask = (projectId, gateIndex, taskId, subtaskName, state, dispatch) => {
  const trimmed = (subtaskName || "").trim();
  if (!trimmed) {
    if (dispatch) {
      setTimeout(() => {
        dispatch({ type: "SET_ADDING_GATE_SUBTASK_ID", addingGateSubtaskId: null });
      }, 0);
    }
    return;
  }
  const projects = (state && Array.isArray(state.projects)) ? state.projects : loadProjects();
  const nextProjects = projects.map((p) => {
    if (p.id !== projectId) return p;
    let nextGateTasks = Array.isArray(p.gateTasks) ? [...p.gateTasks] : defaultGateTasksForProj(p.gates);
    if (nextGateTasks[gateIndex]) {
      nextGateTasks[gateIndex] = nextGateTasks[gateIndex].map((t) => {
        if (t.id !== taskId) return t;
        const subs = Array.isArray(t.subtasks) ? t.subtasks : [];
        const newSub = {
          id: `gst-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          name: trimmed,
          done: false,
        };
        return { ...t, subtasks: [...subs, newSub], done: false };
      });
    }
    const allDone = nextGateTasks[gateIndex] && nextGateTasks[gateIndex].length > 0 && nextGateTasks[gateIndex].every((t) => t.done);
    const newGates = [...p.gates];
    newGates[gateIndex] = allDone;
    return { ...p, gates: newGates, gateTasks: nextGateTasks };
  });
  saveProjects(nextProjects);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_PROJECTS", projects: nextProjects });
      dispatch({ type: "SET_ADDING_GATE_SUBTASK_ID", addingGateSubtaskId: null });
    }, 0);
  }
};

const handleToggleEditGateSubtask = (subtaskId, state, dispatch) => {
  if (dispatch) {
    const cur = state ? state.editingGateSubtaskId : null;
    const next = cur === subtaskId ? null : subtaskId;
    setTimeout(() => {
      dispatch({ type: "SET_EDITING_GATE_SUBTASK_ID", editingGateSubtaskId: next });
    }, 0);
  }
};

const handleSaveGateSubtaskName = (projectId, gateIndex, taskId, subtaskId, newName, state, dispatch) => {
  const trimmed = (newName || "").trim();
  if (!trimmed) {
    if (dispatch) {
      setTimeout(() => {
        dispatch({ type: "SET_EDITING_GATE_SUBTASK_ID", editingGateSubtaskId: null });
      }, 0);
    }
    return;
  }
  const projects = (state && Array.isArray(state.projects)) ? state.projects : loadProjects();
  const nextProjects = projects.map((p) => {
    if (p.id !== projectId) return p;
    let nextGateTasks = Array.isArray(p.gateTasks) ? [...p.gateTasks] : defaultGateTasksForProj(p.gates);
    if (nextGateTasks[gateIndex]) {
      nextGateTasks[gateIndex] = nextGateTasks[gateIndex].map((t) => {
        if (t.id !== taskId) return t;
        const subs = (t.subtasks || []).map((st) => (st.id === subtaskId ? { ...st, name: trimmed } : st));
        return { ...t, subtasks: subs };
      });
    }
    return { ...p, gateTasks: nextGateTasks };
  });
  saveProjects(nextProjects);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_PROJECTS", projects: nextProjects });
      dispatch({ type: "SET_EDITING_GATE_SUBTASK_ID", editingGateSubtaskId: null });
    }, 0);
  }
};

const handleDeleteGateSubtask = (projectId, gateIndex, taskId, subtaskId, state, dispatch) => {
  const projects = (state && Array.isArray(state.projects)) ? state.projects : loadProjects();
  const nextProjects = projects.map((p) => {
    if (p.id !== projectId) return p;
    let nextGateTasks = Array.isArray(p.gateTasks) ? [...p.gateTasks] : defaultGateTasksForProj(p.gates);
    if (nextGateTasks[gateIndex]) {
      nextGateTasks[gateIndex] = nextGateTasks[gateIndex].map((t) => {
        if (t.id !== taskId) return t;
        const subs = (t.subtasks || []).filter((st) => st.id !== subtaskId);
        const taskDone = subs.length > 0 && subs.every((st) => st.done);
        return { ...t, subtasks: subs, done: taskDone };
      });
    }
    const allDone = nextGateTasks[gateIndex] && nextGateTasks[gateIndex].length > 0 && nextGateTasks[gateIndex].every((t) => t.done);
    const newGates = [...p.gates];
    newGates[gateIndex] = allDone;
    return { ...p, gates: newGates, gateTasks: nextGateTasks };
  });
  saveProjects(nextProjects);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_PROJECTS", projects: nextProjects });
      dispatch({ type: "SET_EDITING_GATE_SUBTASK_ID", editingGateSubtaskId: null });
    }, 0);
  }
};

const handleToggleGlobalProjectsMatrix = (state, dispatch) => {
  const next = !(state && state.showGlobalProjectsMatrix);
  if (dispatch) {
    dispatch({ type: "SET_SHOW_GLOBAL_PROJECTS_MATRIX", showGlobalProjectsMatrix: next });
  }
};

const handleToggleExpand = (projectId, state, dispatch) => {
  const projects = (state && Array.isArray(state.projects)) ? state.projects : loadProjects();
  const nextProjects = projects.map((p) => {
    if (p.id !== projectId) return p;
    return { ...p, expanded: !p.expanded };
  });
  saveProjects(nextProjects);
  if (dispatch) {
    dispatch({ type: "SET_PROJECTS", projects: nextProjects });
  }
};

const handleIncrementGate = (projectId, state, dispatch) => {
  const projects = (state && Array.isArray(state.projects)) ? state.projects : loadProjects();
  const nextProjects = projects.map((p) => {
    if (p.id !== projectId) return p;
    const nextIdx = p.gates.findIndex((g) => !g);
    if (nextIdx === -1) return p;
    const newGates = [...p.gates];
    newGates[nextIdx] = true;
    return { ...p, gates: newGates };
  });
  saveProjects(nextProjects);
  if (dispatch) {
    dispatch({ type: "SET_PROJECTS", projects: nextProjects });
  }
};

const handleDecrementGate = (projectId, state, dispatch) => {
  const projects = (state && Array.isArray(state.projects)) ? state.projects : loadProjects();
  const nextProjects = projects.map((p) => {
    if (p.id !== projectId) return p;
    let lastTrueIdx = -1;
    for (let i = p.gates.length - 1; i >= 0; i--) {
      if (p.gates[i]) {
        lastTrueIdx = i;
        break;
      }
    }
    if (lastTrueIdx === -1) return p;
    const newGates = [...p.gates];
    newGates[lastTrueIdx] = false;
    return { ...p, gates: newGates };
  });
  saveProjects(nextProjects);
  if (dispatch) {
    dispatch({ type: "SET_PROJECTS", projects: nextProjects });
  }
};

const handleRemoveProject = (projectId, state, dispatch) => {
  const projects = (state && Array.isArray(state.projects)) ? state.projects : loadProjects();
  const nextProjects = projects.filter((p) => p.id !== projectId && String(p.id) !== String(projectId));
  saveProjects(nextProjects);
  if (dispatch) {
    const curPage = (state && state.projectPage) ? state.projectPage : 1;
    const nextPage = Math.min(curPage, Math.max(1, Math.ceil(nextProjects.length / 2)));
    const nextSelected = (state && (state.selectedProjectId === projectId || String(state.selectedProjectId) === String(projectId)))
      ? (nextProjects[0] ? nextProjects[0].id : null)
      : (state ? state.selectedProjectId : null);
    setTimeout(() => {
      dispatch({ type: "SET_PROJECTS", projects: nextProjects });
      dispatch({ type: "SET_PROJECT_PAGE", projectPage: nextPage });
      dispatch({ type: "SET_SELECTED_PROJECT_ID", selectedProjectId: nextSelected });
      dispatch({ type: "SET_EDITING_PROJECT_ID", editingProjectId: null });
    }, 0);
  }
};

const handleAddProject = (event, state, dispatch) => {
  event.preventDefault();
  const form = event.currentTarget;
  const nameInput = form.querySelector(".proj-name-input");
  const stackInput = form.querySelector(".proj-stack-input");
  const name = nameInput ? nameInput.value.trim() : "";
  if (!name) {
    if (nameInput) nameInput.focus();
    return;
  }
  const stack = stackInput ? stackInput.value.trim() : "";
  const newProject = {
    id: `proj-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    stack,
    expanded: true,
    gates: [false, false, false, false, false, false, false, false],
  };
  const projects = (state && Array.isArray(state.projects)) ? state.projects : loadProjects();
  const nextProjects = [newProject, ...projects];
  saveProjects(nextProjects);
  if (dispatch) {
    dispatch({ type: "SET_PROJECTS", projects: nextProjects });
    dispatch({ type: "SET_SELECTED_PROJECT_ID", selectedProjectId: newProject.id });
    dispatch({ type: "SET_SHOW_ADD_PROJECT", showAddProject: false });
    dispatch({ type: "SET_PROJECT_PAGE", projectPage: 1 });
  }
  form.reset();
};

const handleSetProjectPage = (page, state, dispatch) => {
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_PROJECT_PAGE", projectPage: page });
    }, 0);
  }
};

const handleToggleAddProjectForm = (state, dispatch) => {
  const nextShow = !(state && state.showAddProject);
  if (dispatch) {
    dispatch({ type: "SET_SHOW_ADD_PROJECT", showAddProject: nextShow });
  }
};

const handleToggleProjectFullscreen = (state, dispatch) => {
  const next = !(state && state.projectFullscreen);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_PROJECT_FULLSCREEN", projectFullscreen: next });
      dispatch({ type: "SET_EDITING_PROJECT_ID", editingProjectId: null });
    }, 0);
  }
};

const handleSelectProject = (projectId, state, dispatch) => {
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_SELECTED_PROJECT_ID", selectedProjectId: projectId });
      dispatch({ type: "SET_EDITING_PROJECT_ID", editingProjectId: null });
    }, 0);
  }
};

const handleToggleEditProject = (projectId, state, dispatch) => {
  if (dispatch) {
    const nextId = (state && state.editingProjectId === projectId) ? null : projectId;
    setTimeout(() => {
      dispatch({ type: "SET_EDITING_PROJECT_ID", editingProjectId: nextId });
    }, 0);
  }
};

const handleSaveProjectDetails = (projectId, newName, newStack, state, dispatch) => {
  const trimmedName = (newName || "").trim();
  if (!trimmedName) {
    if (dispatch) {
      setTimeout(() => {
        dispatch({ type: "SET_EDITING_PROJECT_ID", editingProjectId: null });
      }, 0);
    }
    return;
  }
  const projects = (state && Array.isArray(state.projects)) ? state.projects : loadProjects();
  const nextProjects = projects.map((p) => {
    if (p.id !== projectId && String(p.id) !== String(projectId)) return p;
    return { ...p, name: trimmedName, stack: (newStack !== undefined ? newStack : p.stack || "").trim() };
  });
  saveProjects(nextProjects);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_PROJECTS", projects: nextProjects });
      dispatch({ type: "SET_EDITING_PROJECT_ID", editingProjectId: null });
    }, 0);
  }
};

const handleToggleCareerFullscreen = (state, dispatch) => {
  const next = !(state && state.careerFullscreen);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_CAREER_FULLSCREEN", careerFullscreen: next });
      dispatch({ type: "SET_EDITING_CAREER_COMPANY_ID", editingCareerCompanyId: null });
      dispatch({ type: "SET_EDITING_CAREER_ROUND_ID", editingCareerRoundId: null });
    }, 0);
  }
};


const CAREER_INSPECTOR_KEY = "cmd_career_inspector_v3";

const SEED_CAREER_DATA = [
  {
    id: "car-google",
    company: "Google",
    ctc: "₹45 LPA",
    role: "Software Engineer III (Backend)",
    stack: "Java · Distributed Systems · GCP",
    source: "Referral",
    mtechSponsored: true,
    jobUrl: "https://careers.google.com/jobs/results/",
    resume: "Sayyad_Backend_Resume.pdf",
    rounds: [
      { id: "r1", name: "1. Applied", status: "done", subtext: "✓ Application submitted via Employee Referral" },
      { id: "r2", name: "2. Resume Shortlist", status: "done", subtext: "✓ Referral vetted by Senior Staff Engineer" },
      { id: "r3", name: "3. Online Assessment (OA)", status: "active", subtext: "Coding & DSA Challenge scheduled" },
      { id: "r4", name: "4. Technical Round 1 (LLD)", status: "pending", subtext: "Concurrency & Low-Level Architecture" },
      { id: "r5", name: "5. Technical Round 2 (HLD)", status: "pending", subtext: "Distributed Caching & High-Level Scalability" },
      { id: "r6", name: "6. Hiring Manager & Culture", status: "pending", subtext: "Leadership Principles & Team Match" },
      { id: "r7", name: "7. Offer & HR Negotiation", status: "pending", subtext: "CTC Discussion & Band Assignment" },
    ],
  },
  {
    id: "car-razorpay",
    company: "Razorpay",
    ctc: "₹38 LPA",
    role: "Senior Backend Engineer (Payments)",
    stack: "Spring Boot · Kafka · Redis · PostgreSQL",
    source: "LinkedIn",
    mtechSponsored: false,
    jobUrl: "https://jobs.lever.co/razorpay",
    resume: "Sayyad_Payment_Systems.pdf",
    rounds: [
      { id: "r1", name: "1. Applied", status: "done", subtext: "✓ Application submitted on LinkedIn" },
      { id: "r2", name: "2. Resume Shortlist", status: "done", subtext: "✓ Shortlisted by Talent Acquisition" },
      { id: "r3", name: "3. Online Assessment (OA)", status: "done", subtext: "✓ 100% Score on OA" },
      { id: "r4", name: "4. Technical Round 1 (LLD)", status: "active", subtext: "Idempotent Payment Processor Design" },
      { id: "r5", name: "5. Technical Round 2 (HLD)", status: "pending", subtext: "High-throughput Transaction Architecture" },
      { id: "r6", name: "6. Hiring Manager & Culture", status: "pending", subtext: "Engineering Director Deep Dive" },
      { id: "r7", name: "7. Offer & HR Negotiation", status: "pending", subtext: "Final Compensation & ESOP Structure" },
    ],
  },
];

const CAREER_ADDED_KEY = "cyberpunk_career_added_v2";

const loadCareer = () => {
  try {
    const saved = window.localStorage.getItem(CAREER_INSPECTOR_KEY);
    let parsed = [];
    if (saved !== null) {
      try {
        parsed = JSON.parse(saved);
      } catch (e) {
        parsed = [];
      }
    }
    if (!Array.isArray(parsed)) parsed = [];

    let modified = false;

    // Standardized Pipeline Migration: ensure 1. Applied is always first step and marked done
    parsed = parsed.map((comp) => {
      if (!comp || !Array.isArray(comp.rounds) || comp.rounds.length === 0) return comp;
      const firstRound = comp.rounds[0];
      const hasApplied = firstRound && firstRound.name && firstRound.name.toLowerCase().includes("applied");
      if (!hasApplied) {
        const appliedRound = {
          id: `r-app-${comp.id || Date.now()}`,
          name: "1. Applied",
          status: "done",
          subtext: "✓ Application submitted via " + (comp.source || "Portal"),
        };
        const updatedRemaining = comp.rounds.map((r, idx) => {
          const stripped = r.name.replace(/^\d+\.\s*/, "");
          return { ...r, name: `${idx + 2}. ${stripped}` };
        });
        modified = true;
        return { ...comp, rounds: [appliedRound, ...updatedRemaining] };
      }
      return comp;
    });

    const alreadyAdded = window.localStorage.getItem(CAREER_ADDED_KEY);
    if (!alreadyAdded || parsed.length < 2) {
      for (const sc of SEED_CAREER_DATA) {
        const exists = parsed.some((c) => c && (c.id === sc.id || (c.company && c.company.trim().toLowerCase() === sc.company.trim().toLowerCase())));
        if (!exists) {
          parsed.push(JSON.parse(JSON.stringify(sc)));
          modified = true;
        }
      }
      if (parsed.length >= 2) {
        window.localStorage.setItem(CAREER_ADDED_KEY, "true");
      }
    }

    if (modified || saved === null) {
      window.localStorage.setItem(CAREER_INSPECTOR_KEY, JSON.stringify(parsed));
    }

    return parsed;
  } catch (e) {
    return SEED_CAREER_DATA;
  }
};

const saveCareer = (items) => {
  try {
    window.localStorage.setItem(CAREER_INSPECTOR_KEY, JSON.stringify(items));
  } catch (e) { }
};

const getCareerStageBadge = (company) => {
  if (!company || !Array.isArray(company.rounds) || !company.rounds.length) return "APPLIED";
  const rounds = company.rounds;
  for (let i = rounds.length - 1; i >= 0; i--) {
    const r = rounds[i];
    if (r && (r.status === "done" || r.status === "active")) {
      const clean = r.name.replace(/^\d+\.\s*/, "").toUpperCase();
      if (clean.includes("OFFER")) return "OFFER / NEGOTIATION";
      if (clean.includes("MANAGER")) return "HIRING MANAGER";
      if (clean.includes("HLD")) return "TECH ROUND 2 (HLD)";
      if (clean.includes("LLD")) return "TECH ROUND 1 (LLD)";
      if (clean.includes("ASSESSMENT") || clean.includes("OA")) return "ONLINE OA";
      if (clean.includes("SHORTLIST")) return "RESUME SHORTLIST";
      if (clean.includes("APPLIED")) return "APPLIED";
      return clean;
    }
  }
  return "APPLIED";
};

const calculateCareerFunnel = (list) => {
  if (!Array.isArray(list) || !list.length) {
    return { applied: 0, oa: 0, interview: 0, offer: 0 };
  }
  const applied = list.length;
  const oa = list.filter((c) => {
    if (!Array.isArray(c.rounds)) return false;
    return c.rounds.some((r) => {
      const n = (r.name || "").toLowerCase();
      return (n.includes("oa") || n.includes("assessment")) && (r.status === "active" || r.status === "done");
    });
  }).length;
  const interview = list.filter((c) => {
    if (!Array.isArray(c.rounds)) return false;
    return c.rounds.some((r) => {
      const n = (r.name || "").toLowerCase();
      return (n.includes("lld") || n.includes("hld") || n.includes("technical") || n.includes("manager")) && (r.status === "active" || r.status === "done");
    });
  }).length;
  const offer = list.filter((c) => {
    if (!Array.isArray(c.rounds)) return false;
    return c.rounds.some((r) => {
      const n = (r.name || "").toLowerCase();
      return n.includes("offer") && (r.status === "active" || r.status === "done");
    });
  }).length;
  return { applied, oa, interview, offer };
};

const handleSelectCareer = (companyId, state, dispatch) => {
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_SELECTED_CAREER_ID", selectedCareerId: companyId });
    }, 0);
  }
};

const handleToggleAddCareerDrawer = (state, dispatch) => {
  const nextShow = !(state && state.showAddCareerDrawer);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_SHOW_ADD_CAREER_DRAWER", showAddCareerDrawer: nextShow });
    }, 0);
  }
};

const handleAddCareerSubmit = (event, state, dispatch) => {
  event.preventDefault();
  const form = event.currentTarget;
  const companyInput = form.querySelector(".car-input-company");
  const ctcInput = form.querySelector(".car-input-ctc");
  const roleInput = form.querySelector(".car-input-role");
  const stackInput = form.querySelector(".car-input-stack");
  const sourceInput = form.querySelector(".car-input-source");
  const mtechInput = form.querySelector(".car-input-mtech");
  const jobUrlInput = form.querySelector(".car-input-joburl");

  const company = companyInput ? companyInput.value.trim() : "";
  if (!company) {
    if (companyInput) companyInput.focus();
    return;
  }
  const ctc = ctcInput ? ctcInput.value.trim() : "16 LPA";
  let role = roleInput ? roleInput.value.trim() : "Software Engineer";
  let stack = stackInput ? stackInput.value.trim() : "";

  if (!stack) {
    if (role.includes("·")) {
      const parts = role.split("·");
      role = parts[0].trim();
      stack = parts.slice(1).join("·").trim();
    } else if (role.includes("(") && role.includes(")")) {
      const match = role.match(/^(.*?)\((.*?)\)$/);
      if (match) {
        role = match[1].trim();
        stack = match[2].trim();
      }
    }
  }

  const source = sourceInput ? sourceInput.value : "LinkedIn";
  const mtechSponsored = mtechInput ? mtechInput.checked : true;
  const jobUrl = jobUrlInput ? jobUrlInput.value.trim() : "";

  const newId = `car-${Date.now()}`;
  const newCompany = {
    id: newId,
    company,
    ctc,
    role,
    stack,
    source,
    mtechSponsored,
    jobUrl,
    resume: "Resume.pdf",
    rounds: [
      { id: "r1", name: "1. Applied", status: "done", subtext: "✓ Application submitted via " + source },
      { id: "r2", name: "2. Resume Shortlist", status: "active", subtext: "Pending Recruiter Screening" },
      { id: "r3", name: "3. Online Assessment (OA)", status: "pending", subtext: "Coding & System Architecture Test" },
      { id: "r4", name: "4. Technical Round 1 (LLD)", status: "pending", subtext: "Low-Level Design & Concurrency" },
      { id: "r5", name: "5. Technical Round 2 (HLD)", status: "pending", subtext: "High-Level System Design & Scalability" },
      { id: "r6", name: "6. Hiring Manager & Culture", status: "pending", subtext: "Behavioral & Engineering Leadership" },
      { id: "r7", name: "7. Offer & HR Negotiation", status: "pending", subtext: "CTC, Equity & Team Match" },
    ],
  };

  const list = (state && Array.isArray(state.careerList)) ? state.careerList : loadCareer();
  const nextList = [newCompany, ...list];
  saveCareer(nextList);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_CAREER_LIST", careerList: nextList });
      dispatch({ type: "SET_SELECTED_CAREER_ID", selectedCareerId: newId });
      dispatch({ type: "SET_SHOW_ADD_CAREER_DRAWER", showAddCareerDrawer: false });
    }, 0);
  }
  form.reset();
};

const handleToggleSponsorship = (companyId, state, dispatch) => {
  const list = (state && Array.isArray(state.careerList)) ? state.careerList : loadCareer();
  const nextList = list.map((c) => (c.id === companyId ? { ...c, mtechSponsored: !c.mtechSponsored } : c));
  saveCareer(nextList);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_CAREER_LIST", careerList: nextList });
    }, 0);
  }
};

const handleCycleSource = (companyId, state, dispatch) => {
  const list = (state && Array.isArray(state.careerList)) ? state.careerList : loadCareer();
  const sources = ["LinkedIn", "Naukri", "Referral", "Direct"];
  const nextList = list.map((c) => {
    if (c.id !== companyId) return c;
    const curIdx = sources.indexOf(c.source);
    const nextSource = sources[(curIdx + 1) % sources.length];
    return { ...c, source: nextSource };
  });
  saveCareer(nextList);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_CAREER_LIST", careerList: nextList });
    }, 0);
  }
};

const handleCycleRoundStatus = (companyId, roundId, state, dispatch) => {
  const list = (state && Array.isArray(state.careerList)) ? state.careerList : loadCareer();
  const statusCycle = ["pending", "active", "done"];
  const nextList = list.map((c) => {
    if (c.id !== companyId) return c;
    const nextRounds = c.rounds.map((r) => {
      if (r.id !== roundId) return r;
      const curIdx = statusCycle.indexOf(r.status);
      const nextStatus = statusCycle[(curIdx + 1) % statusCycle.length];
      return { ...r, status: nextStatus };
    });
    return { ...c, rounds: nextRounds };
  });
  saveCareer(nextList);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_CAREER_LIST", careerList: nextList });
    }, 0);
  }
};

const handleStartEditCompany = (companyId, state, dispatch) => {
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_EDITING_CAREER_COMPANY_ID", editingCareerCompanyId: companyId });
    }, 0);
  }
};

const handleSaveCompanyFromText = (companyId, text, state, dispatch) => {
  const trimmed = (text || "").trim();
  if (!trimmed) {
    if (dispatch) {
      setTimeout(() => {
        dispatch({ type: "SET_EDITING_CAREER_COMPANY_ID", editingCareerCompanyId: null });
      }, 0);
    }
    return;
  }
  let company = trimmed;
  let ctc = "16 LPA";
  let role = "SDE-2";
  let stack = "";

  if (trimmed.includes("|")) {
    const parts = trimmed.split("|");
    company = parts[0].trim();
    ctc = parts[1].trim();
  }
  if (company.includes("·")) {
    const parts = company.split("·");
    company = parts[0].trim();
    const roleStack = parts.slice(1).join("·").trim();
    if (roleStack.includes("(") && roleStack.includes(")")) {
      const match = roleStack.match(/^(.*?)\((.*?)\)$/);
      if (match) {
        role = match[1].trim();
        stack = match[2].trim();
      } else {
        role = roleStack;
      }
    } else {
      role = roleStack;
    }
  }

  const list = (state && Array.isArray(state.careerList)) ? state.careerList : loadCareer();
  const nextList = list.map((c) => {
    if (c.id !== companyId) return c;
    return {
      ...c,
      company: company || c.company,
      ctc: ctc || c.ctc,
      role: role || c.role,
      stack: stack !== undefined ? stack : c.stack,
    };
  });
  saveCareer(nextList);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_CAREER_LIST", careerList: nextList });
      dispatch({ type: "SET_EDITING_CAREER_COMPANY_ID", editingCareerCompanyId: null });
    }, 0);
  }
};

const handleStartEditRound = (roundId, state, dispatch) => {
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_EDITING_CAREER_ROUND_ID", editingCareerRoundId: roundId });
    }, 0);
  }
};

const handleSaveRoundSubtext = (companyId, roundId, newSubtext, state, dispatch) => {
  const list = (state && Array.isArray(state.careerList)) ? state.careerList : loadCareer();
  const nextList = list.map((c) => {
    if (c.id !== companyId) return c;
    const nextRounds = c.rounds.map((r) => {
      if (r.id !== roundId) return r;
      return { ...r, subtext: (newSubtext || "").trim() };
    });
    return { ...c, rounds: nextRounds };
  });
  saveCareer(nextList);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_CAREER_LIST", careerList: nextList });
      dispatch({ type: "SET_EDITING_CAREER_ROUND_ID", editingCareerRoundId: null });
    }, 0);
  }
};

const handleWithdrawCompany = (companyId, state, dispatch) => {
  const list = (state && Array.isArray(state.careerList)) ? state.careerList : loadCareer();
  const nextList = list.filter((c) => c.id !== companyId);
  saveCareer(nextList);
  const nextSelected = nextList.length ? nextList[0].id : null;
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_CAREER_LIST", careerList: nextList });
      dispatch({ type: "SET_SELECTED_CAREER_ID", selectedCareerId: nextSelected });
    }, 0);
  }
};

const handleToggleEditResume = (show, state, dispatch) => {
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_EDITING_CAREER_RESUME", editingCareerResume: show });
    }, 0);
  }
};

const handleSaveResume = (companyId, newResume, state, dispatch) => {
  const trimmed = (newResume || "").trim();
  const list = (state && Array.isArray(state.careerList)) ? state.careerList : loadCareer();
  const nextList = list.map((c) => (c.id === companyId ? { ...c, resume: trimmed || "Resume.pdf" } : c));
  saveCareer(nextList);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_CAREER_LIST", careerList: nextList });
      dispatch({ type: "SET_EDITING_CAREER_RESUME", editingCareerResume: false });
    }, 0);
  }
};

const handleToggleEditJobUrl = (show, state, dispatch) => {
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_EDITING_CAREER_JOB_URL", editingCareerJobUrl: show });
    }, 0);
  }
};

const handleSaveJobUrl = (companyId, newUrl, state, dispatch) => {
  const trimmed = (newUrl || "").trim();
  const list = (state && Array.isArray(state.careerList)) ? state.careerList : loadCareer();
  const nextList = list.map((c) => (c.id === companyId ? { ...c, jobUrl: trimmed } : c));
  saveCareer(nextList);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_CAREER_LIST", careerList: nextList });
      dispatch({ type: "SET_EDITING_CAREER_JOB_URL", editingCareerJobUrl: false });
    }, 0);
  }
};

const LEARNING_COURSES_KEY = "cyberpunk_learning_courses_v4";
const LEARNING_STREAK_KEY = "cyberpunk_learning_streak_v1";

const REMAINING_COURSES = [
  {
    "id": "course-distributed-caching-redis",
    "title": "Distributed Caching & Redis",
    "unit": "Topics",
    "completed": 0,
    "total": 3,
    "color": "",
    "topics": [
      {
        "id": "top-redis-1",
        "name": "1. Architecture & Internals",
        "done": false,
        "expanded": false,
        "subtopics": [
          {
            "id": "sub-redis-1-1",
            "name": "Single-Threaded Event Loop Engine:",
            "done": false,
            "expanded": false,
            "subtopics": [
              {
                "id": "sst-redis-1-1-1",
                "name": "Non-blocking I/O multiplexing (epoll/kqueue), in-memory execution speed vs. multi-threaded background workers (lazy freeing, AOF rewrites).",
                "done": false
              },
              {
                "id": "sst-redis-1-1-2",
                "name": "Threading changes in Redis 6+ (threaded I/O for network read/write).",
                "done": false
              }
            ]
          },
          {
            "id": "sub-redis-1-2",
            "name": "Data Structures & Memory Encodings:",
            "done": false,
            "expanded": false,
            "subtopics": [
              {
                "id": "sst-redis-1-2-1",
                "name": "String (Raw, Int, Embstr).",
                "done": false
              },
              {
                "id": "sst-redis-1-2-2",
                "name": "Hash (ZipList/ListPack, HashTable).",
                "done": false
              },
              {
                "id": "sst-redis-1-2-3",
                "name": "List (QuickList).",
                "done": false
              },
              {
                "id": "sst-redis-1-2-4",
                "name": "Set (IntSet, HashTable) and Sorted Set / ZSet (SkipList + HashTable).",
                "done": false
              },
              {
                "id": "sst-redis-1-2-5",
                "name": "Bitmaps and HyperLogLog (cardinality estimation at scale with minimal memory).",
                "done": false
              }
            ]
          },
          {
            "id": "sub-redis-1-3",
            "name": "Persistence Models:",
            "done": false,
            "expanded": false,
            "subtopics": [
              {
                "id": "sst-redis-1-3-1",
                "name": "RDB (Redis Database snapshots): Point-in-time binary dumping, fork operation memory footprint (Copy-On-Write overhead).",
                "done": false
              },
              {
                "id": "sst-redis-1-3-2",
                "name": "AOF (Append Only File): fsync policies (always, everysec, no), background AOF rewrite (BGREWRITEAOF).",
                "done": false
              },
              {
                "id": "sst-redis-1-3-3",
                "name": "Hybrid persistence (RDB preamble + AOF incremental log).",
                "done": false
              }
            ]
          }
        ]
      },
      {
        "id": "top-redis-2",
        "name": "2. Caching Design Patterns & Production Failures",
        "done": false,
        "expanded": false,
        "subtopics": [
          {
            "id": "sub-redis-2-1",
            "name": "Caching Patterns:",
            "done": false,
            "expanded": false,
            "subtopics": [
              {
                "id": "sst-redis-2-1-1",
                "name": "Cache-Aside (Lazy Loading): Read from cache -> cache miss -> read from DB -> write to cache.",
                "done": false
              },
              {
                "id": "sst-redis-2-1-2",
                "name": "Read-Through / Write-Through: Cache acts as main data store interface.",
                "done": false
              },
              {
                "id": "sst-redis-2-1-3",
                "name": "Write-Behind (Write-Back): Asynchronous delayed batch writing to database.",
                "done": false
              }
            ]
          },
          {
            "id": "sub-redis-2-2",
            "name": "Production Failure Scenarios & Mitigations:",
            "done": false,
            "expanded": false,
            "subtopics": [
              {
                "id": "sst-redis-2-2-1",
                "name": "Cache Penetration: Requests for non-existent keys bypass cache and hit DB continuously. Solutions: Storing null values with short TTL, applying Bloom Filters at the edge.",
                "done": false
              },
              {
                "id": "sst-redis-2-2-2",
                "name": "Cache Avalanche: Many cached items expire at the same time, causing a traffic spike on the DB. Solutions: Introducing random jitter/entropy to TTL expirations (TTL + random(0, 300)), resilient multi-tier caches.",
                "done": false
              },
              {
                "id": "sst-redis-2-2-3",
                "name": "Cache Stampede (Dogpiling / Hotkey Expiration): A critical hotkey expires, causing thousands of concurrent requests to query the DB to rebuild it. Solutions: Distributed Mutex/Locking via Redis while key is being recalculated, probabilistic early recomputation (XFetch algorithm).",
                "done": false
              },
              {
                "id": "sst-redis-2-2-4",
                "name": "Hot Key Problem: Single key receives disproportionate traffic, saturating a single Redis node/CPU. Solutions: Local caching (Caffeine/In-memory) ahead of Redis, key sharding (hotkey_suffix_[1..N]).",
                "done": false
              }
            ]
          },
          {
            "id": "sub-redis-2-3",
            "name": "Memory Management & Eviction Policies:",
            "done": false,
            "expanded": false,
            "subtopics": [
              {
                "id": "sst-redis-2-3-1",
                "name": "Eviction algorithms: noeviction, allkeys-lru, volatile-lru, allkeys-lfu, volatile-lfu, allkeys-random.",
                "done": false
              },
              {
                "id": "sst-redis-2-3-2",
                "name": "Approximated LRU/LFU pool mechanics in Redis.",
                "done": false
              }
            ]
          }
        ]
      },
      {
        "id": "top-redis-3",
        "name": "3. Distributed Concurrency & High Availability",
        "done": false,
        "expanded": false,
        "subtopics": [
          {
            "id": "sub-redis-3-1",
            "name": "Distributed Locking with Redis:",
            "done": false,
            "expanded": false,
            "subtopics": [
              {
                "id": "sst-redis-3-1-1",
                "name": "Implementing locks safely: SET resource_name my_random_token NX PX 30000.",
                "done": false
              },
              {
                "id": "sst-redis-3-1-2",
                "name": "Non-atomic lock release hazards; releasing locks via Lua scripts to verify ownership token before deletion.",
                "done": false
              },
              {
                "id": "sst-redis-3-1-3",
                "name": "Redlock Algorithm: Multi-master distributed lock validation, clock drift issues, Martin Kleppmann's critique vs. Salvatore Sanfilippo's response.",
                "done": false
              }
            ]
          },
          {
            "id": "sub-redis-3-2",
            "name": "Scaling & Clustering:",
            "done": false,
            "expanded": false,
            "subtopics": [
              {
                "id": "sst-redis-3-2-1",
                "name": "Redis Sentinel: Master-replica monitoring, automatic failover, split-brain avoidance.",
                "done": false
              },
              {
                "id": "sst-redis-3-2-2",
                "name": "Redis Cluster: Hash slots partitioning (16384 slots), CRC16 calculation, MOVED vs. ASK redirections, multi-key operations restrictions.",
                "done": false
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "course-distributed-messaging-kafka",
    "title": "Distributed Messaging & Event Streaming (Apache Kafka)",
    "unit": "Topics",
    "completed": 0,
    "total": 4,
    "color": "",
    "topics": [
      {
        "id": "top-kafka-1",
        "name": "1. Core Architecture & Storage Topology",
        "done": false,
        "expanded": false,
        "subtopics": [
          {
            "id": "sub-kafka-1-1",
            "name": "Log Anatomy:",
            "done": false,
            "expanded": false,
            "subtopics": [
              {
                "id": "sst-kafka-1-1-1",
                "name": "Topics, Partitions, Segments (.log, .index, .timeindex).",
                "done": false
              },
              {
                "id": "sst-kafka-1-1-2",
                "name": "Commit log mechanics: Append-only disk writes, Sequential I/O efficiency vs. Random I/O.",
                "done": false
              },
              {
                "id": "sst-kafka-1-1-3",
                "name": "Zero-Copy Data Transfer: OS Page Cache -> Network Socket via Linux kernel sendfile system call bypassing user-space memory copies.",
                "done": false
              }
            ]
          },
          {
            "id": "sub-kafka-1-2",
            "name": "Controllers & Metadata Management:",
            "done": false,
            "expanded": false,
            "subtopics": [
              {
                "id": "sst-kafka-1-2-1",
                "name": "ZooKeeper-based metadata management vs. KRaft (Kafka Raft Metadata Mode) architecture.",
                "done": false
              },
              {
                "id": "sst-kafka-1-2-2",
                "name": "Partition Leader election, Controller responsibilities.",
                "done": false
              }
            ]
          }
        ]
      },
      {
        "id": "top-kafka-2",
        "name": "2. Producer Mechanics & Delivery Guarantees",
        "done": false,
        "expanded": false,
        "subtopics": [
          {
            "id": "sub-kafka-2-1",
            "name": "Producer Pipeline:",
            "done": false,
            "expanded": false,
            "subtopics": [
              {
                "id": "sst-kafka-2-1-1",
                "name": "Serializer -> Partitioner (Murmur2 hash of key, round-robin, sticky partitioner) -> RecordAccumulator (memory buffer pool).",
                "done": false
              },
              {
                "id": "sst-kafka-2-1-2",
                "name": "Batching parameters: batch.size and linger.ms trade-offs between throughput and latency.",
                "done": false
              }
            ]
          },
          {
            "id": "sub-kafka-2-2",
            "name": "Durability & ACKs:",
            "done": false,
            "expanded": false,
            "subtopics": [
              {
                "id": "sst-kafka-2-2-1",
                "name": "acks=0: Fire and forget (high performance, potential data loss).",
                "done": false
              },
              {
                "id": "sst-kafka-2-2-2",
                "name": "acks=1: Leader acknowledgment (moderate protection; fails if leader dies before replica fetch).",
                "done": false
              },
              {
                "id": "sst-kafka-2-2-3",
                "name": "acks=all (acks=-1): In-Sync Replicas (ISR) acknowledgment.",
                "done": false
              },
              {
                "id": "sst-kafka-2-2-4",
                "name": "Minimum ISR: Interaction between acks=all and min.insync.replicas configuration.",
                "done": false
              }
            ]
          },
          {
            "id": "sub-kafka-2-3",
            "name": "Delivery Semantics:",
            "done": false,
            "expanded": false,
            "subtopics": [
              {
                "id": "sst-kafka-2-3-1",
                "name": "At-least-once: Retries enabled without idempotence (duplicates possible).",
                "done": false
              },
              {
                "id": "sst-kafka-2-3-2",
                "name": "At-most-once: No retries; offset committed before processing.",
                "done": false
              },
              {
                "id": "sst-kafka-2-3-3",
                "name": "Exactly-Once Semantics (EOS): Idempotent Producer (enable.idempotence=true), tracking ProducerId (PID) and SequenceNumber per partition to eliminate duplicate writes.",
                "done": false
              },
              {
                "id": "sst-kafka-2-3-4",
                "name": "Transactional API: Multi-partition atomic writes, sendOffsetsToTransaction(), consuming only committed records (read_committed).",
                "done": false
              }
            ]
          }
        ]
      },
      {
        "id": "top-kafka-3",
        "name": "3. Consumer Mechanics & Group Coordination",
        "done": false,
        "expanded": false,
        "subtopics": [
          {
            "id": "sub-kafka-3-1",
            "name": "Consumer Groups & Offset Management:",
            "done": false,
            "expanded": false,
            "subtopics": [
              {
                "id": "sst-kafka-3-1-1",
                "name": "Partition allocation: One partition can only be read by one consumer within the same consumer group; consumer scaling limits based on partition count.",
                "done": false
              },
              {
                "id": "sst-kafka-3-1-2",
                "name": "Offset Commit Strategies: Auto-commit (enable.auto.commit=true) hazards vs. Manual synchronous (commitSync) and asynchronous (commitAsync) commits.",
                "done": false
              }
            ]
          },
          {
            "id": "sub-kafka-3-2",
            "name": "Consumer Lag & Throughput Tuning:",
            "done": false,
            "expanded": false,
            "subtopics": [
              {
                "id": "sst-kafka-3-2-1",
                "name": "Root-cause analysis of consumer lag (processing bottlenecks, external API delays, slow database updates).",
                "done": false
              },
              {
                "id": "sst-kafka-3-2-2",
                "name": "Partition increase considerations and repartitioning impacts.",
                "done": false
              }
            ]
          },
          {
            "id": "sub-kafka-3-3",
            "name": "Consumer Rebalancing:",
            "done": false,
            "expanded": false,
            "subtopics": [
              {
                "id": "sst-kafka-3-3-1",
                "name": "Triggers: Consumer join/leave, consumer crash, partition count changes.",
                "done": false
              },
              {
                "id": "sst-kafka-3-3-2",
                "name": "Coordination: Group Coordinator broker, consumer leader, heartbeat thread (heartbeat.interval.ms), session timeouts (session.timeout.ms), max processing timeouts (max.poll.interval.ms).",
                "done": false
              },
              {
                "id": "sst-kafka-3-3-3",
                "name": "Partition Assignment Strategies: RangeAssignor, RoundRobinAssignor, StickyAssignor, CooperativeStickyAssignor (incremental cooperative rebalancing minimizing stop-the-world rebalance pauses).",
                "done": false
              }
            ]
          }
        ]
      },
      {
        "id": "top-kafka-4",
        "name": "4. Resilient Stream Architectures",
        "done": false,
        "expanded": false,
        "subtopics": [
          {
            "id": "sub-kafka-4-1",
            "name": "Error Handling & Failure Pipelines:",
            "done": false,
            "expanded": false,
            "subtopics": [
              {
                "id": "sst-kafka-4-1-1",
                "name": "Retry Topics with backoff delays.",
                "done": false
              },
              {
                "id": "sst-kafka-4-1-2",
                "name": "Dead Letter Queues (DLQ) for poison-pill messages and deserialization failures.",
                "done": false
              }
            ]
          },
          {
            "id": "sub-kafka-4-2",
            "name": "Message Ordering Guarantees:",
            "done": false,
            "expanded": false,
            "subtopics": [
              {
                "id": "sst-kafka-4-2-1",
                "name": "Partition-level ordering guarantees vs. lack of total order across topics.",
                "done": false
              },
              {
                "id": "sst-kafka-4-2-2",
                "name": "In-flight connection limits: Setting max.in.flight.requests.per.connection=1 (or <= 5 with idempotent producer enabled) to prevent out-of-order retries.",
                "done": false
              }
            ]
          },
          {
            "id": "sub-kafka-4-3",
            "name": "Log Compaction:",
            "done": false,
            "expanded": false,
            "subtopics": [
              {
                "id": "sst-kafka-4-3-1",
                "name": "Log cleaner thread, key-based tombstone records (null payload), state store recovery acceleration.",
                "done": false
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "course-microservices-observability",
    "title": "Microservices Architecture, Observability & Distributed Systems Design",
    "unit": "Topics",
    "completed": 0,
    "total": 4,
    "color": "",
    "topics": [
      {
        "id": "top-ms-1",
        "name": "1. Distributed Transaction Patterns",
        "done": false,
        "expanded": false,
        "subtopics": [
          {
            "id": "sub-ms-1-1",
            "name": "Dual-Write Problem:",
            "done": false,
            "expanded": false,
            "subtopics": [
              {
                "id": "sst-ms-1-1-1",
                "name": "Writing to a local database and publishing to Kafka/message queue in an uncoordinated manner leading to inconsistencies.",
                "done": false
              }
            ]
          },
          {
            "id": "sub-ms-1-2",
            "name": "Transactional Outbox Pattern:",
            "done": false,
            "expanded": false,
            "subtopics": [
              {
                "id": "sst-ms-1-2-1",
                "name": "Database transaction updates domain entity and inserts event into an outbox table atomically.",
                "done": false
              },
              {
                "id": "sst-ms-1-2-2",
                "name": "Polling Publisher vs. Transaction Log Miner (Change Data Capture / CDC via Debezium) streaming outbox events to Kafka.",
                "done": false
              }
            ]
          },
          {
            "id": "sub-ms-1-3",
            "name": "Saga Pattern:",
            "done": false,
            "expanded": false,
            "subtopics": [
              {
                "id": "sst-ms-1-3-1",
                "name": "Compensating transactions to undo state changes upon downstream failure.",
                "done": false
              },
              {
                "id": "sst-ms-1-3-2",
                "name": "Choreography-based Saga: Decentralized event emissions between services; pros/cons (decoupled, risk of cyclic dependencies and complex debugging).",
                "done": false
              },
              {
                "id": "sst-ms-1-3-3",
                "name": "Orchestration-based Saga: Centralized orchestrator service directing participants; state machine management.",
                "done": false
              }
            ]
          },
          {
            "id": "sub-ms-1-4",
            "name": "Two-Phase Commit (2PC):",
            "done": false,
            "expanded": false,
            "subtopics": [
              {
                "id": "sst-ms-1-4-1",
                "name": "Coordinator and participant roles (Prepare and Commit phases), blocking coordinator vulnerabilities, reasons 2PC is avoided in cloud microservices.",
                "done": false
              }
            ]
          }
        ]
      },
      {
        "id": "top-ms-2",
        "name": "2. Service Resilience & Fault Tolerance",
        "done": false,
        "expanded": false,
        "subtopics": [
          {
            "id": "sub-ms-2-1",
            "name": "Resilience4j Implementations:",
            "done": false,
            "expanded": false,
            "subtopics": [
              {
                "id": "sst-ms-2-1-1",
                "name": "Circuit Breaker: State transitions (CLOSED, OPEN, HALF_OPEN), sliding window evaluation (count-based vs. time-based), failure rate threshold, slow call rate threshold.",
                "done": false
              },
              {
                "id": "sst-ms-2-1-2",
                "name": "Rate Limiter: Token Bucket and Leaky Bucket algorithms, distributed rate limiting with Redis and Lua scripts.",
                "done": false
              },
              {
                "id": "sst-ms-2-1-3",
                "name": "Bulkhead: Isolating resources (thread pool isolation vs. semaphore isolation) to prevent cascading resource starvation.",
                "done": false
              },
              {
                "id": "sst-ms-2-1-4",
                "name": "Retry & Fallback: Exponential backoff with jitter to prevent server thundering herd.",
                "done": false
              }
            ]
          }
        ]
      },
      {
        "id": "top-ms-3",
        "name": "3. Observability & Telemetry (Tracing, Metrics, Logs)",
        "done": false,
        "expanded": false,
        "subtopics": [
          {
            "id": "sub-ms-3-1",
            "name": "Distributed Tracing:",
            "done": false,
            "expanded": false,
            "subtopics": [
              {
                "id": "sst-ms-3-1-1",
                "name": "W3C Trace Context specification (traceparent, tracestate).",
                "done": false
              },
              {
                "id": "sst-ms-3-1-2",
                "name": "Concepts: TraceId, SpanId, ParentSpanId, Baggage.",
                "done": false
              },
              {
                "id": "sst-ms-3-1-3",
                "name": "Propagation across thread boundaries, asynchronous tasks (TaskDecorator), and network boundaries (HTTP headers, Kafka record headers).",
                "done": false
              },
              {
                "id": "sst-ms-3-1-4",
                "name": "OpenTelemetry (OTel) instrumentation and Jaeger/Zipkin collectors.",
                "done": false
              }
            ]
          },
          {
            "id": "sub-ms-3-2",
            "name": "Metrics & Monitoring:",
            "done": false,
            "expanded": false,
            "subtopics": [
              {
                "id": "sst-ms-3-2-1",
                "name": "Spring Boot Actuator endpoints (/actuator/health, /actuator/metrics, /actuator/prometheus).",
                "done": false
              },
              {
                "id": "sst-ms-3-2-2",
                "name": "Metric types: Counters, Gauges, Timers, Distribution Summaries.",
                "done": false
              },
              {
                "id": "sst-ms-3-2-3",
                "name": "Prometheus scraping architecture and Grafana visualization.",
                "done": false
              }
            ]
          },
          {
            "id": "sub-ms-3-3",
            "name": "Logging Architecture:",
            "done": false,
            "expanded": false,
            "subtopics": [
              {
                "id": "sst-ms-3-3-1",
                "name": "Structured logging (JSON format), Mapped Diagnostic Context (MDC) for contextual tagging (userId, orderId, traceId), log aggregation via Elasticsearch/Logstash/Fluentbit.",
                "done": false
              }
            ]
          }
        ]
      },
      {
        "id": "top-ms-4",
        "name": "4. Edge Layer, Networking & Security",
        "done": false,
        "expanded": false,
        "subtopics": [
          {
            "id": "sub-ms-4-1",
            "name": "Reverse Proxies & API Gateways (NGINX / Spring Cloud Gateway):",
            "done": false,
            "expanded": false,
            "subtopics": [
              {
                "id": "sst-ms-4-1-1",
                "name": "Layer 4 (TCP/UDP) vs. Layer 7 (HTTP) routing.",
                "done": false
              },
              {
                "id": "sst-ms-4-1-2",
                "name": "NGINX worker process architecture, non-blocking event-driven loop.",
                "done": false
              },
              {
                "id": "sst-ms-4-1-3",
                "name": "Upstream load balancing algorithms: Round-robin, least connections, IP hash.",
                "done": false
              },
              {
                "id": "sst-ms-4-1-4",
                "name": "SSL/TLS termination, HTTP/2 multiplexing, connection pooling (keepalive).",
                "done": false
              }
            ]
          },
          {
            "id": "sub-ms-4-2",
            "name": "Authentication & Authorization:",
            "done": false,
            "expanded": false,
            "subtopics": [
              {
                "id": "sst-ms-4-2-1",
                "name": "Stateless token authentication: JWT structure (Header, Payload, Signature).",
                "done": false
              },
              {
                "id": "sst-ms-4-2-2",
                "name": "Cryptographic validation: HMAC-SHA256 (symmetric) vs. RSA/ECDSA public-private keypairs (asymmetric via JWKS).",
                "done": false
              },
              {
                "id": "sst-ms-4-2-3",
                "name": "Spring Security Filter Chain mechanics: SecurityContextHolder, UsernamePasswordAuthenticationFilter, BearerTokenAuthenticationFilter.",
                "done": false
              },
              {
                "id": "sst-ms-4-2-4",
                "name": "Token revocation and refresh token rotation strategies.",
                "done": false
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "course-systems-infrastructure",
    "title": "Systems & Infrastructure Essentials",
    "unit": "Topics",
    "completed": 0,
    "total": 2,
    "color": "",
    "topics": [
      {
        "id": "top-sys-1",
        "name": "1. Linux Performance & Troubleshooting Toolkit",
        "done": false,
        "expanded": false,
        "subtopics": [
          {
            "id": "sub-sys-1-1",
            "name": "System Metrics Inspection:",
            "done": false,
            "expanded": false,
            "subtopics": [
              {
                "id": "sst-sys-1-1-1",
                "name": "CPU: top, htop, uptime (load averages over 1, 5, 15 minutes vs. CPU cores), mpstat.",
                "done": false
              },
              {
                "id": "sst-sys-1-1-2",
                "name": "Memory: free -m, vmstat (swap usage, context switching, run queue).",
                "done": false
              },
              {
                "id": "sst-sys-1-1-3",
                "name": "Disk I/O: iostat -xz 1, checking %util and await time.",
                "done": false
              },
              {
                "id": "sst-sys-1-1-4",
                "name": "Network: netstat, ss -tulpn (socket states, TIME_WAIT, CLOSE_WAIT pileups), lsof -i :<port>, tcpdump.",
                "done": false
              }
            ]
          },
          {
            "id": "sub-sys-1-2",
            "name": "Process Tracing:",
            "done": false,
            "expanded": false,
            "subtopics": [
              {
                "id": "sst-sys-1-2-1",
                "name": "Profiling running processes, finding thread IDs (ps -T -p <pid>), mapping to JVM threads.",
                "done": false
              }
            ]
          }
        ]
      },
      {
        "id": "top-sys-2",
        "name": "2. Containerization & Isolation (Docker & Compose)",
        "done": false,
        "expanded": false,
        "subtopics": [
          {
            "id": "sub-sys-2-1",
            "name": "Linux Container Primitives:",
            "done": false,
            "expanded": false,
            "subtopics": [
              {
                "id": "sst-sys-2-1-1",
                "name": "Namespaces: Isolation of processes (pid), network (net), mounts (mnt), user IDs (user).",
                "done": false
              },
              {
                "id": "sst-sys-2-1-2",
                "name": "Control Groups (cgroups): Limiting and metering resource usage (CPU shares, memory quotas, OOM-killer triggers when limits are hit).",
                "done": false
              },
              {
                "id": "sst-sys-2-1-3",
                "name": "Union File Systems (OverlayFS): Layer caching, read-only image layers, copy-on-write container layer.",
                "done": false
              }
            ]
          },
          {
            "id": "sub-sys-2-2",
            "name": "Dockerfile Optimization:",
            "done": false,
            "expanded": false,
            "subtopics": [
              {
                "id": "sst-sys-2-2-1",
                "name": "Multi-stage builds to produce minimal runtime containers (builder stage with JDK -> runner stage with stripped JRE or distroless images).",
                "done": false
              },
              {
                "id": "sst-sys-2-2-2",
                "name": "Layer ordering optimization to maximize Docker build cache hits.",
                "done": false
              },
              {
                "id": "sst-sys-2-2-3",
                "name": "Running as non-root users (USER appuser) for runtime security.",
                "done": false
              }
            ]
          },
          {
            "id": "sub-sys-2-3",
            "name": "Docker Compose for Local Distributed Topology:",
            "done": false,
            "expanded": false,
            "subtopics": [
              {
                "id": "sst-sys-2-3-1",
                "name": "Defining networks, bridge drivers, volumes (named vs. bind mounts), container dependency ordering (depends_on with condition healthchecks).",
                "done": false
              }
            ]
          }
        ]
      }
    ]
  }
];

const getDefaultStreak = () => {
  const todayIdx = (new Date().getDay() + 6) % 7; // Mon=0, Tue=1, Wed=2...
  const week = [false, false, false, false, false, false, false];
  for (let i = 0; i <= todayIdx; i++) {
    week[i] = true;
  }
  return {
    streak: todayIdx + 1,
    week,
  };
};

const MODULES_ADDED_KEY = "cyberpunk_learning_modules_4_7_added_v4";

const loadCourses = () => {
  try {
    const saved = window.localStorage.getItem(LEARNING_COURSES_KEY);
    let parsed = [];
    if (saved !== null) {
      try {
        parsed = JSON.parse(saved);
      } catch (e) {
        parsed = [];
      }
    }
    if (!Array.isArray(parsed)) parsed = [];

    const alreadyAdded = window.localStorage.getItem(MODULES_ADDED_KEY);
    let modified = false;

    if (!alreadyAdded || parsed.length < 7) {
      for (const rc of REMAINING_COURSES) {
        const exists = parsed.some((c) => {
          if (!c) return false;
          if (c.id === rc.id) return true;
          const ct = (c.title || "").trim().toLowerCase();
          const rt = (rc.title || "").trim().toLowerCase();
          return ct === rt;
        });
        if (!exists) {
          parsed.push(JSON.parse(JSON.stringify(rc)));
          modified = true;
        }
      }
      if (parsed.length >= 7) {
        window.localStorage.setItem(MODULES_ADDED_KEY, "true");
      }
    }

    if (modified || saved === null) {
      window.localStorage.setItem(LEARNING_COURSES_KEY, JSON.stringify(parsed));
    }

    return parsed.map((c, idx) => ({
      id: c.id || `course-${idx}`,
      title: c.title || "Untitled Course",
      unit: c.unit || "Topics",
      completed: typeof c.completed === "number" ? c.completed : 0,
      total: typeof c.total === "number" && c.total > 0 ? c.total : (Array.isArray(c.topics) && c.topics.length > 0 ? c.topics.length : 10),
      color: c.color || "",
      topics: Array.isArray(c.topics)
        ? c.topics.map((t, tIdx) => {
          const topId = t.id || `top-${idx}-${tIdx}`;
          return {
            id: topId,
            name: t.name || `Topic ${tIdx + 1}`,
            done: Boolean(t.done),
            expanded: Boolean(t.expanded),
            subtopics: Array.isArray(t.subtopics)
              ? t.subtopics.map((st, sIdx) => {
                let subsubs = Array.isArray(st.subtopics) ? st.subtopics : [];
                if (!subsubs.length) {
                  if (st.id === "s1-1" || (st.name && st.name.includes("Two Pointers"))) {
                    subsubs = [
                      { id: "s1-1-1", name: "Opposite Direction (Two Sum II, Palindrome)", done: true },
                      { id: "s1-1-2", name: "Same Direction (Remove Duplicates, Move Zeroes)", done: true },
                      { id: "s1-1-3", name: "Fast & Slow Pointers (Cycle Detection)", done: true },
                    ];
                  } else if (st.id === "s1-2" || (st.name && st.name.includes("Sliding Window"))) {
                    subsubs = [
                      { id: "s1-2-1", name: "Fixed Size (Max Sum Subarray Size K)", done: true },
                      { id: "s1-2-2", name: "Dynamic Size (Longest Substring Without Repeating)", done: true },
                    ];
                  } else if (st.id === "sp6-1" || (st.name && st.name.includes("SecurityFilterChain"))) {
                    subsubs = [
                      { id: "sp6-1-1", name: "CORS & CSRF Disabling", done: true },
                      { id: "sp6-1-2", name: "SessionCreationPolicy.STATELESS", done: true },
                      { id: "sp6-1-3", name: "AuthorizeHttpRequests Route Matchers", done: false },
                    ];
                  }
                }
                const subId = st.id || `sub-${topId}-${sIdx}`;
                return {
                  id: subId,
                  name: st.name || `Subtopic ${sIdx + 1}`,
                  done: Boolean(st.done),
                  expanded: Boolean(st.expanded || (subsubs.length > 0 && sIdx === 0)),
                  subtopics: subsubs.map((sst, ssIdx) => ({
                    id: sst.id || `sst-${subId}-${ssIdx}`,
                    name: sst.name || `Sub-item ${ssIdx + 1}`,
                    done: Boolean(sst.done),
                  })),
                };
              })
              : [],
          };
        })
        : [],
    }));
  } catch (e) {
    return REMAINING_COURSES;
  }
};

const saveCourses = (courses) => {
  try {
    window.localStorage.setItem(LEARNING_COURSES_KEY, JSON.stringify(courses));
  } catch (e) { }
};

const loadLearningStreak = () => {
  try {
    const todayIdx = (new Date().getDay() + 6) % 7;
    const saved = window.localStorage.getItem(LEARNING_STREAK_KEY);
    if (saved === null) {
      const def = getDefaultStreak();
      window.localStorage.setItem(LEARNING_STREAK_KEY, JSON.stringify(def));
      return def;
    }
    const parsed = JSON.parse(saved);
    if (!parsed || typeof parsed !== "object") return getDefaultStreak();
    let week = Array.isArray(parsed.week) && parsed.week.length === 7 ? parsed.week.map(Boolean) : getDefaultStreak().week;
    week[todayIdx] = true;
    const activeCount = week.filter(Boolean).length;
    return {
      streak: typeof parsed.streak === "number" ? Math.max(parsed.streak, activeCount) : activeCount,
      week,
    };
  } catch (e) {
    return getDefaultStreak();
  }
};

const saveLearningStreak = (streakObj) => {
  try {
    window.localStorage.setItem(LEARNING_STREAK_KEY, JSON.stringify(streakObj));
  } catch (e) { }
};

const getMasteryColor = (pct, explicitColor) => {
  if (explicitColor) return explicitColor;
  if (pct >= 80) return "#00e6a0";
  if (pct >= 50) return "#ff263b";
  return "#ffaa00";
};

const getCurrentCourses = (state) => {
  if (state && Array.isArray(state.courses) && state.courses.length >= 7) {
    return state.courses;
  }
  return loadCourses();
};

const handleToggleCourseTopic = (courseId, topicId, state, dispatch) => {
  const currentCourses = getCurrentCourses(state);
  const nextCourses = currentCourses.map((c) => {
    if (c.id !== courseId) return c;
    const nextTopics = c.topics.map((t) => {
      if (t.id !== topicId) return t;
      const subs = Array.isArray(t.subtopics) ? t.subtopics : [];
      if (subs.length > 0) {
        const nextDone = !t.done;
        const nextSubs = subs.map((st) => ({ ...st, done: nextDone }));
        return { ...t, done: nextDone, subtopics: nextSubs };
      }
      return { ...t, done: !t.done };
    });
    const completedCount = nextTopics.filter((t) => t.done).length;
    return { ...c, topics: nextTopics, completed: completedCount };
  });
  saveCourses(nextCourses);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_COURSES", courses: nextCourses });
    }, 0);
  }
};

const handleToggleTopicExpand = (courseId, topicId, state, dispatch) => {
  const currentCourses = getCurrentCourses(state);
  const nextCourses = currentCourses.map((c) => {
    if (c.id !== courseId) return c;
    const nextTopics = c.topics.map((t) => (t.id === topicId ? { ...t, expanded: !t.expanded } : t));
    return { ...c, topics: nextTopics };
  });
  saveCourses(nextCourses);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_COURSES", courses: nextCourses });
    }, 0);
  }
};

const handleToggleSubtopic = (courseId, topicId, subtopicId, state, dispatch) => {
  const currentCourses = getCurrentCourses(state);
  const nextCourses = currentCourses.map((c) => {
    if (c.id !== courseId) return c;
    const nextTopics = c.topics.map((t) => {
      if (t.id !== topicId) return t;
      const subs = Array.isArray(t.subtopics) ? t.subtopics : [];
      const nextSubs = subs.map((st) => {
        if (st.id !== subtopicId) return st;
        const newDone = !st.done;
        const subsubs = Array.isArray(st.subtopics) ? st.subtopics : [];
        const nextSubsubs = subsubs.map((sst) => ({ ...sst, done: newDone }));
        return { ...st, done: newDone, subtopics: nextSubsubs };
      });
      const allDone = nextSubs.length > 0 && nextSubs.every((st) => st.done);
      return { ...t, subtopics: nextSubs, done: allDone };
    });
    const completedCount = nextTopics.filter((t) => t.done).length;
    return { ...c, topics: nextTopics, completed: completedCount };
  });
  saveCourses(nextCourses);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_COURSES", courses: nextCourses });
    }, 0);
  }
};

const handleAddSubtopic = (a1, a2, a3, a4, a5) => {
  let courseId, topicId, subtopicName, state, dispatch;

  if (a1 && typeof a1.preventDefault === "function") {
    a1.preventDefault();
    const form = a1.target;
    const input = form ? (form.querySelector("input") || form.querySelector("textarea")) : null;
    subtopicName = input ? input.value.trim() : "";
    courseId = a2;
    topicId = a3;
    state = a4;
    dispatch = a5;
    if (input) input.value = "";
  } else {
    courseId = a1;
    topicId = a2;
    subtopicName = typeof a3 === "string" ? a3.trim() : (a3 && a3.target ? a3.target.value.trim() : "");
    state = a4;
    dispatch = a5;
  }

  if (!subtopicName) return;

  const currentCourses = getCurrentCourses(state);
  const nextCourses = currentCourses.map((c) => {
    if (c.id !== courseId) return c;
    const nextTopics = (c.topics || []).map((t) => {
      if (t.id !== topicId) return t;
      const subs = Array.isArray(t.subtopics) ? t.subtopics : [];
      const newSub = {
        id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: subtopicName,
        done: false,
        expanded: true,
        subtopics: [],
      };
      return { ...t, subtopics: [...subs, newSub], done: false, expanded: true };
    });
    return { ...c, topics: nextTopics };
  });
  saveCourses(nextCourses);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_COURSES", courses: nextCourses });
    }, 0);
  }
};

const handleAddSubtopicPrompt = (courseId, topicId, state, dispatch) => {
  const currentCourses = getCurrentCourses(state);
  const nextCourses = currentCourses.map((c) => {
    if (c.id !== courseId) return c;
    const nextTopics = (c.topics || []).map((t) => {
      if (t.id !== topicId) return t;
      return { ...t, expanded: true };
    });
    return { ...c, topics: nextTopics };
  });
  saveCourses(nextCourses);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_COURSES", courses: nextCourses });
      setTimeout(() => {
        const inp = document.querySelector(`form[data-topic-form="${topicId}"] input`) ||
                    document.querySelector(`.topic-subtopics-list .subtopic-add-input`);
        if (inp) inp.focus();
      }, 50);
    }, 0);
  }
};

const handleToggleEditSubtopic = (subtopicId, state, dispatch) => {
  if (dispatch) {
    const curId = state ? state.editingSubtopicId : null;
    const nextId = (curId === subtopicId) ? null : subtopicId;
    setTimeout(() => {
      dispatch({ type: "SET_EDITING_SUBTOPIC_ID", editingSubtopicId: nextId });
    }, 0);
  }
};

const handleSaveSubtopicName = (courseId, topicId, subtopicId, newName, state, dispatch) => {
  const trimmed = (newName || "").trim();
  if (!trimmed) {
    if (dispatch) {
      setTimeout(() => {
        dispatch({ type: "SET_EDITING_SUBTOPIC_ID", editingSubtopicId: null });
      }, 0);
    }
    return;
  }
  const currentCourses = getCurrentCourses(state);
  const nextCourses = currentCourses.map((c) => {
    const topics = Array.isArray(c.topics) ? c.topics : [];
    const hasSubInCourse = topics.some((t) => (t.subtopics || []).some((st) => st.id === subtopicId));
    if (!hasSubInCourse) return c;
    const nextTopics = topics.map((t) => {
      const subs = Array.isArray(t.subtopics) ? t.subtopics : [];
      const hasSub = subs.some((st) => st.id === subtopicId);
      if (!hasSub) return t;
      const nextSubs = subs.map((st) => (st.id === subtopicId ? { ...st, name: trimmed } : st));
      return { ...t, subtopics: nextSubs };
    });
    return { ...c, topics: nextTopics };
  });
  saveCourses(nextCourses);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_COURSES", courses: nextCourses });
      dispatch({ type: "SET_EDITING_SUBTOPIC_ID", editingSubtopicId: null });
    }, 0);
  }
};

const handleRemoveSubtopic = (courseId, topicId, subtopicId, state, dispatch) => {
  const currentCourses = getCurrentCourses(state);
  const nextCourses = currentCourses.map((c) => {
    if (c.id !== courseId) return c;
    const nextTopics = c.topics.map((t) => {
      if (t.id !== topicId) return t;
      const nextSubs = (t.subtopics || []).filter((st) => st.id !== subtopicId);
      const allDone = nextSubs.length > 0 && nextSubs.every((st) => st.done);
      return { ...t, subtopics: nextSubs, done: allDone };
    });
    const completedCount = nextTopics.filter((t) => t.done).length;
    return { ...c, topics: nextTopics, completed: completedCount };
  });
  saveCourses(nextCourses);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_COURSES", courses: nextCourses });
    }, 0);
  }
};

const handleToggleSubtopicExpand = (courseId, topicId, subtopicId, state, dispatch) => {
  const currentCourses = getCurrentCourses(state);
  const nextCourses = currentCourses.map((c) => {
    if (c.id !== courseId) return c;
    const nextTopics = c.topics.map((t) => {
      if (t.id !== topicId) return t;
      const nextSubs = (t.subtopics || []).map((st) => {
        if (st.id !== subtopicId) return st;
        return { ...st, expanded: !st.expanded };
      });
      return { ...t, subtopics: nextSubs };
    });
    return { ...c, topics: nextTopics };
  });
  saveCourses(nextCourses);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_COURSES", courses: nextCourses });
    }, 0);
  }
};

const handleToggleSubSubtopic = (courseId, topicId, subtopicId, subsubId, state, dispatch) => {
  const currentCourses = getCurrentCourses(state);
  const nextCourses = currentCourses.map((c) => {
    if (c.id !== courseId) return c;
    const nextTopics = c.topics.map((t) => {
      if (t.id !== topicId) return t;
      const nextSubs = (t.subtopics || []).map((st) => {
        if (st.id !== subtopicId) return st;
        const subsubs = Array.isArray(st.subtopics) ? st.subtopics : [];
        const nextSubsubs = subsubs.map((sst) => (sst.id === subsubId ? { ...sst, done: !sst.done } : sst));
        const allSubsubsDone = nextSubsubs.length > 0 && nextSubsubs.every((sst) => sst.done);
        return { ...st, subtopics: nextSubsubs, done: nextSubsubs.length ? allSubsubsDone : st.done };
      });
      const allSubsDone = nextSubs.length > 0 && nextSubs.every((st) => st.done);
      return { ...t, subtopics: nextSubs, done: allSubsDone };
    });
    const completedCount = nextTopics.filter((t) => t.done).length;
    return { ...c, topics: nextTopics, completed: completedCount };
  });
  saveCourses(nextCourses);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_COURSES", courses: nextCourses });
    }, 0);
  }
};

const handleAddSubSubtopic = (a1, a2, a3, a4, a5, a6) => {
  let courseId, topicId, subtopicId, name, state, dispatch;

  if (a1 && typeof a1.preventDefault === "function") {
    // Form submit event: (e, courseId, topicId, subtopicId, state, dispatch)
    a1.preventDefault();
    const form = a1.target;
    const input = form ? (form.querySelector("input") || form.querySelector("textarea")) : null;
    name = input ? input.value.trim() : "";
    courseId = a2;
    topicId = a3;
    subtopicId = a4;
    state = a5;
    dispatch = a6;
    if (input) input.value = "";
  } else {
    // Direct arguments: (courseId, topicId, subtopicId, name, state, dispatch)
    courseId = a1;
    topicId = a2;
    subtopicId = a3;
    name = typeof a4 === "string" ? a4.trim() : (a4 && a4.value ? a4.value.trim() : "");
    state = a5;
    dispatch = a6;
  }

  if (!name) return;

  const currentCourses = getCurrentCourses(state);
  const nextCourses = currentCourses.map((c) => {
    if (c.id !== courseId) return c;
    const nextTopics = (c.topics || []).map((t) => {
      if (t.id !== topicId) return t;
      const nextSubs = (t.subtopics || []).map((st) => {
        if (st.id !== subtopicId) return st;
        const subsubs = Array.isArray(st.subtopics) ? st.subtopics : [];
        const newSubsub = {
          id: `sst-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          name,
          done: false,
        };
        return {
          ...st,
          subtopics: [...subsubs, newSubsub],
          done: false,
          expanded: true,
        };
      });
      return { ...t, subtopics: nextSubs, done: false, expanded: true };
    });
    return { ...c, topics: nextTopics };
  });
  saveCourses(nextCourses);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_COURSES", courses: nextCourses });
    }, 0);
  }
};

const handleAddSubSubtopicPrompt = (courseId, topicId, subtopicId, state, dispatch) => {
  const currentCourses = getCurrentCourses(state);
  const nextCourses = currentCourses.map((c) => {
    if (c.id !== courseId) return c;
    const nextTopics = (c.topics || []).map((t) => {
      if (t.id !== topicId) return t;
      const nextSubs = (t.subtopics || []).map((st) => {
        if (st.id !== subtopicId) return st;
        return { ...st, expanded: true };
      });
      return { ...t, subtopics: nextSubs, expanded: true };
    });
    return { ...c, topics: nextTopics };
  });
  saveCourses(nextCourses);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_COURSES", courses: nextCourses });
      setTimeout(() => {
        const inp = document.querySelector(`input[data-subtopic-input="${subtopicId}"]`) ||
                    document.querySelector(`form[data-subtopic-form="${subtopicId}"] input`);
        if (inp) {
          inp.focus();
          inp.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
      }, 50);
    }, 0);
  }
};

const handleToggleEditSubSubtopic = (subsubId, state, dispatch) => {
  if (dispatch) {
    const nextId = (state && state.editingSubSubtopicId === subsubId) ? null : subsubId;
    setTimeout(() => {
      dispatch({ type: "SET_EDITING_SUBSUBTOPIC_ID", editingSubSubtopicId: nextId });
    }, 0);
  }
};

const handleSaveSubSubtopicName = (courseId, topicId, subtopicId, subsubId, newName, state, dispatch) => {
  const trimmed = (newName || "").trim();
  if (!trimmed) {
    if (dispatch) {
      setTimeout(() => {
        dispatch({ type: "SET_EDITING_SUBSUBTOPIC_ID", editingSubSubtopicId: null });
      }, 0);
    }
    return;
  }
  const currentCourses = getCurrentCourses(state);
  const nextCourses = currentCourses.map((c) => {
    const topics = Array.isArray(c.topics) ? c.topics : [];
    const hasSstInCourse = topics.some((t) =>
      (t.subtopics || []).some((st) => (st.subtopics || []).some((sst) => sst.id === subsubId))
    );
    if (!hasSstInCourse) return c;
    const nextTopics = topics.map((t) => {
      const subs = Array.isArray(t.subtopics) ? t.subtopics : [];
      const hasSub = subs.some((st) => (st.subtopics || []).some((sst) => sst.id === subsubId));
      if (!hasSub) return t;
      const nextSubs = subs.map((st) => {
        const subsubs = Array.isArray(st.subtopics) ? st.subtopics : [];
        const hasSst = subsubs.some((sst) => sst.id === subsubId);
        if (!hasSst) return st;
        const nextSubsubs = subsubs.map((sst) => (sst.id === subsubId ? { ...sst, name: trimmed } : sst));
        return { ...st, subtopics: nextSubsubs };
      });
      return { ...t, subtopics: nextSubs };
    });
    return { ...c, topics: nextTopics };
  });
  saveCourses(nextCourses);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_COURSES", courses: nextCourses });
      dispatch({ type: "SET_EDITING_SUBSUBTOPIC_ID", editingSubSubtopicId: null });
    }, 0);
  }
};

const handleRemoveSubSubtopic = (courseId, topicId, subtopicId, subsubId, state, dispatch) => {
  const currentCourses = getCurrentCourses(state);
  const nextCourses = currentCourses.map((c) => {
    if (c.id !== courseId) return c;
    const nextTopics = c.topics.map((t) => {
      if (t.id !== topicId) return t;
      const nextSubs = (t.subtopics || []).map((st) => {
        if (st.id !== subtopicId) return st;
        const nextSubsubs = (st.subtopics || []).filter((sst) => sst.id !== subsubId);
        const allDone = nextSubsubs.length > 0 && nextSubsubs.every((sst) => sst.done);
        return { ...st, subtopics: nextSubsubs, done: nextSubsubs.length ? allDone : st.done };
      });
      const allDone = nextSubs.length > 0 && nextSubs.every((st) => st.done);
      return { ...t, subtopics: nextSubs, done: allDone };
    });
    const completedCount = nextTopics.filter((t) => t.done).length;
    return { ...c, topics: nextTopics, completed: completedCount };
  });
  saveCourses(nextCourses);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_COURSES", courses: nextCourses });
    }, 0);
  }
};

const handleIncrementCourse = (courseId, state, dispatch) => {
  const currentCourses = getCurrentCourses(state);
  const nextCourses = currentCourses.map((c) => {
    if (c.id !== courseId) return c;
    const nextCompleted = Math.min(c.total, c.completed + 1);
    let topicTicked = false;
    const nextTopics = c.topics.map((t) => {
      if (!topicTicked && !t.done) {
        topicTicked = true;
        const subs = Array.isArray(t.subtopics) ? t.subtopics.map(st => ({ ...st, done: true })) : [];
        return { ...t, done: true, subtopics: subs };
      }
      return t;
    });
    return { ...c, completed: nextCompleted, topics: nextTopics };
  });
  saveCourses(nextCourses);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_COURSES", courses: nextCourses });
    }, 0);
  }
};

const handleDecrementCourse = (courseId, state, dispatch) => {
  const currentCourses = getCurrentCourses(state);
  const nextCourses = currentCourses.map((c) => {
    if (c.id !== courseId) return c;
    const nextCompleted = Math.max(0, c.completed - 1);
    let topicUnticked = false;
    const rev = [...c.topics].reverse();
    const nextTopics = rev.map((t) => {
      if (!topicUnticked && t.done) {
        topicUnticked = true;
        const subs = Array.isArray(t.subtopics) ? t.subtopics.map(st => ({ ...st, done: false })) : [];
        return { ...t, done: false, subtopics: subs };
      }
      return t;
    }).reverse();
    return { ...c, completed: nextCompleted, topics: nextTopics };
  });
  saveCourses(nextCourses);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_COURSES", courses: nextCourses });
    }, 0);
  }
};

const handleRemoveCourse = (courseId, state, dispatch) => {
  const currentCourses = getCurrentCourses(state);
  const nextCourses = currentCourses.filter((c) => c.id !== courseId && String(c.id) !== String(courseId));
  saveCourses(nextCourses);
  if (dispatch) {
    const nextFocused = (state && (state.focusedCourseId === courseId || String(state.focusedCourseId) === String(courseId)))
      ? (nextCourses[0] ? nextCourses[0].id : null)
      : (state ? state.focusedCourseId : null);
    setTimeout(() => {
      dispatch({ type: "SET_COURSES", courses: nextCourses });
      dispatch({ type: "SET_FOCUSED_COURSE_ID", focusedCourseId: nextFocused });
      dispatch({ type: "SET_EDITING_COURSE_ID", editingCourseId: null });
    }, 0);
  }
};

const handleToggleAddCourse = (state, dispatch) => {
  const nextShow = !(state && state.showAddCourse);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_SHOW_ADD_COURSE", showAddCourse: nextShow });
    }, 0);
  }
};

const handleAddCourse = (e, state, dispatch) => {
  e.preventDefault();
  const form = e.target;
  const title = form.elements[0].value.trim();
  const unit = form.elements[1].value.trim() || "Topics";
  const total = parseInt(form.elements[2].value.trim(), 10) || 10;
  const completed = parseInt(form.elements[3].value.trim(), 10) || 0;
  const topicRaw = form.elements[4] ? form.elements[4].value.trim() : "";

  if (!title) return;

  const topicNames = topicRaw ? topicRaw.split(",").map(t => t.trim()).filter(Boolean) : ["Intro & Setup", "Core Concepts", "Advanced"];
  const topics = topicNames.map((tName, i) => ({
    id: `top-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
    name: tName,
    done: i < completed,
    expanded: false,
    subtopics: [],
  }));

  const newCourse = {
    id: `course-${Date.now()}`,
    title,
    unit,
    completed: Math.min(completed, total),
    total,
    color: "",
    topics,
  };

  const currentCourses = getCurrentCourses(state);
  const nextCourses = [...currentCourses, newCourse];
  saveCourses(nextCourses);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_COURSES", courses: nextCourses });
      dispatch({ type: "SET_FOCUSED_COURSE_ID", focusedCourseId: newCourse.id });
      dispatch({ type: "SET_SHOW_ADD_COURSE", showAddCourse: false });
    }, 0);
  }
};

const handleRemoveSubTopic = (courseId, topicId, state, dispatch) => {
  const currentCourses = getCurrentCourses(state);
  const nextCourses = currentCourses.map((c) => {
    if (c.id !== courseId) return c;
    const removedTopic = c.topics.find((t) => t.id === topicId);
    const nextTopics = c.topics.filter((t) => t.id !== topicId);
    const delta = removedTopic && removedTopic.done ? -1 : 0;
    const nextCompleted = Math.max(0, c.completed + delta);
    const nextTotal = Math.max(nextCompleted, c.total - 1);
    return { ...c, topics: nextTopics, completed: nextCompleted, total: nextTotal };
  });
  saveCourses(nextCourses);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_COURSES", courses: nextCourses });
    }, 0);
  }
};

const handleQuickAddTopic = (e, courseId, state, dispatch) => {
  e.preventDefault();
  const form = e.target;
  const input = form.querySelector("input");
  const topicName = input ? input.value.trim() : "";
  if (!topicName) return;

  const currentCourses = getCurrentCourses(state);
  const nextCourses = currentCourses.map((c) => {
    if (c.id !== courseId) return c;
    const nextTopics = [...c.topics, { id: `top-${Date.now()}`, name: topicName, done: false, expanded: false, subtopics: [] }];
    const nextTotal = Math.max(c.total, nextTopics.length);
    return { ...c, topics: nextTopics, total: nextTotal };
  });
  saveCourses(nextCourses);
  input.value = "";
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_COURSES", courses: nextCourses });
    }, 0);
  }
};

const handleAddTopic = (courseId, topicName, state, dispatch) => {
  const trimmed = (topicName || "").trim();
  if (!trimmed) return;
  const currentCourses = getCurrentCourses(state);
  const nextCourses = currentCourses.map((c) => {
    if (c.id !== courseId) return c;
    const topics = Array.isArray(c.topics) ? c.topics : [];
    const newTopic = { id: `top-${Date.now()}`, name: trimmed, done: false, expanded: true, subtopics: [] };
    const nextTotal = Math.max(c.total, topics.length + 1);
    return { ...c, topics: [...topics, newTopic], total: nextTotal };
  });
  saveCourses(nextCourses);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_COURSES", courses: nextCourses });
    }, 0);
  }
};

const handleToggleEditCourse = (courseId, state, dispatch) => {
  if (dispatch) {
    const nextId = (state && state.editingCourseId === courseId) ? null : courseId;
    setTimeout(() => {
      dispatch({ type: "SET_EDITING_COURSE_ID", editingCourseId: nextId });
    }, 0);
  }
};

const handleSaveCourseTitle = (courseId, newTitle, state, dispatch) => {
  const trimmed = (newTitle || "").trim();
  if (!trimmed) {
    if (dispatch) {
      setTimeout(() => {
        dispatch({ type: "SET_EDITING_COURSE_ID", editingCourseId: null });
      }, 0);
    }
    return;
  }
  const currentCourses = getCurrentCourses(state);
  const nextCourses = currentCourses.map((c) => (c.id === courseId || String(c.id) === String(courseId) ? { ...c, title: trimmed } : c));
  saveCourses(nextCourses);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_COURSES", courses: nextCourses });
      dispatch({ type: "SET_EDITING_COURSE_ID", editingCourseId: null });
    }, 0);
  }
};

const handleToggleEditTopic = (topicId, state, dispatch) => {
  if (dispatch) {
    const curId = state ? state.editingTopicId : null;
    const nextId = (curId === topicId) ? null : topicId;
    setTimeout(() => {
      dispatch({ type: "SET_EDITING_TOPIC_ID", editingTopicId: nextId });
    }, 0);
  }
};

const handleSaveTopicName = (courseId, topicId, newName, state, dispatch) => {
  const trimmed = (newName || "").trim();
  if (!trimmed) {
    if (dispatch) {
      setTimeout(() => {
        dispatch({ type: "SET_EDITING_TOPIC_ID", editingTopicId: null });
      }, 0);
    }
    return;
  }
  const currentCourses = getCurrentCourses(state);
  const nextCourses = currentCourses.map((c) => {
    const topics = Array.isArray(c.topics) ? c.topics : [];
    const hasTopic = topics.some((t) => t.id === topicId);
    if (!hasTopic) return c;
    const nextTopics = topics.map((t) => (t.id === topicId ? { ...t, name: trimmed } : t));
    return { ...c, topics: nextTopics };
  });
  saveCourses(nextCourses);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_COURSES", courses: nextCourses });
      dispatch({ type: "SET_EDITING_TOPIC_ID", editingTopicId: null });
    }, 0);
  }
};

const handleOpenFocusedCourse = (courseId, state, dispatch) => {
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_FOCUSED_COURSE_ID", focusedCourseId: courseId });
    }, 0);
  }
};

const handleFocusCourse = (courseId, state, dispatch) => {
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_FOCUSED_COURSE_ID", focusedCourseId: courseId });
      dispatch({ type: "SET_SHOW_GLOBAL_SYLLABUS", showGlobalSyllabus: false });
      dispatch({ type: "SET_EDITING_COURSE_ID", editingCourseId: null });
      dispatch({ type: "SET_EDITING_TOPIC_ID", editingTopicId: null });
      dispatch({ type: "SET_EDITING_SUBTOPIC_ID", editingSubtopicId: null });
      dispatch({ type: "SET_EDITING_SUBSUBTOPIC_ID", editingSubSubtopicId: null });
    }, 0);
  }
};

const handleCloseFocusedCourse = (state, dispatch) => {
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_FOCUSED_COURSE_ID", focusedCourseId: null });
    }, 0);
  }
};

const handleToggleWeekDay = (dayIdx, state, dispatch) => {
  const cur = (state && state.learningStreak && typeof state.learningStreak === "object") ? state.learningStreak : loadLearningStreak();
  const nextWeek = [...cur.week];
  nextWeek[dayIdx] = !nextWeek[dayIdx];
  const activeCount = nextWeek.filter(Boolean).length;
  const updated = { ...cur, week: nextWeek, streak: activeCount };
  saveLearningStreak(updated);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_LEARNING_STREAK", learningStreak: updated });
    }, 0);
  }
};

const handleSetLearningPage = (page, state, dispatch) => {
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_LEARNING_PAGE", learningPage: page });
    }, 0);
  }
};

const handleToggleGlobalSyllabus = (state, dispatch) => {
  const cur = Boolean(state && state.showGlobalSyllabus);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_SHOW_GLOBAL_SYLLABUS", showGlobalSyllabus: !cur });
    }, 0);
  }
};

const handleSetMailFilter = (mailFilter, state, dispatch) => {
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_MAIL_FILTER", mailFilter });
    }, 0);
  }
};

const handleToggleLearningFullscreen = (state, dispatch) => {
  const next = !(state && state.learningFullscreen);
  if (dispatch) {
    setTimeout(() => {
      dispatch({ type: "SET_LEARNING_FULLSCREEN", learningFullscreen: next });
      dispatch({ type: "SET_EDITING_COURSE_ID", editingCourseId: null });
      dispatch({ type: "SET_EDITING_TOPIC_ID", editingTopicId: null });
      dispatch({ type: "SET_EDITING_SUBTOPIC_ID", editingSubtopicId: null });
      dispatch({ type: "SET_EDITING_SUBSUBTOPIC_ID", editingSubSubtopicId: null });
    }, 0);
  }
};

export const refreshFrequency = 10000;
export const command = `python3 "$HOME/Library/Application Support/Übersicht/widgets/cyberpunk-dashboard.widget/status.py" && true`;

export const initialState = {
  output: "",
  error: null,
  tasks: loadTasks(),
  editTasks: loadTaskEdit(),
  quickApps: loadQuickApps(),
  editQuickApps: loadQuickEdit(),
  projects: loadProjects(),
  projectPage: 1,
  showAddProject: false,
  showGlobalProjectsMatrix: false,
  courses: loadCourses(),
  showAddCourse: false,
  learningStreak: loadLearningStreak(),
  learningPage: 1,
  expandedCourseTopicId: null,
  focusedCourseId: null,
  showGlobalSyllabus: false,
  editingCourseId: null,
  editingTopicId: null,
  editingSubtopicId: null,
  editingSubSubtopicId: null,
  careerList: loadCareer(),
  selectedCareerId: (loadCareer()[0] || {}).id || null,
  showAddCareerDrawer: false,
  editingCareerCompanyId: null,
  editingCareerRoundId: null,
  editingCareerResume: false,
  editingCareerJobUrl: false,
  mailFilter: loadMailFilter(),
  learningFullscreen: false,
  projectFullscreen: false,
  selectedProjectId: null,
  editingProjectId: null,
  careerFullscreen: false,
  addingGateTaskGateIdx: null,
  addingGateSubtaskId: null,
  editingGateTaskId: null,
  editingGateSubtaskId: null,
  gateFilter: "all",
};

export const updateState = (event, previousState) => {
  const current = previousState || initialState;
  if (!event) return current;

  if (event.output !== undefined || event.error !== undefined) {
    const nextCourses = (Array.isArray(current.courses) && current.courses.length >= 7) ? current.courses : loadCourses();
    const nextProjects = (Array.isArray(current.projects) && current.projects.length >= 3) ? current.projects : loadProjects();
    const nextCareer = (Array.isArray(current.careerList) && current.careerList.length >= 2) ? current.careerList : loadCareer();
    const nextSelectedCareer = current.selectedCareerId || (nextCareer[0] || {}).id || null;
    return {
      ...current,
      output: event.output !== undefined ? event.output : current.output,
      error: event.error !== undefined ? event.error : current.error,
      courses: nextCourses,
      projects: nextProjects,
      careerList: nextCareer,
      selectedCareerId: nextSelectedCareer,
    };
  }
  switch (event.type) {
    case "SET_TASKS":
      return { ...current, tasks: event.tasks };
    case "SET_TASK_EDIT":
      return { ...current, editTasks: event.editTasks };
    case "SET_QUICK_APPS":
      return { ...current, quickApps: event.quickApps };
    case "SET_QUICK_EDIT":
      return { ...current, editQuickApps: event.editQuickApps };
    case "SET_PROJECTS":
      return { ...current, projects: event.projects };
    case "SET_PROJECT_PAGE":
      return { ...current, projectPage: event.projectPage };
    case "SET_SHOW_ADD_PROJECT":
      return { ...current, showAddProject: event.showAddProject };
    case "SET_SHOW_GLOBAL_PROJECTS_MATRIX":
      return { ...current, showGlobalProjectsMatrix: event.showGlobalProjectsMatrix };
    case "SET_COURSES":
      return { ...current, courses: (Array.isArray(event.courses) && event.courses.length >= 7) ? event.courses : loadCourses() };
    case "SET_SHOW_ADD_COURSE":
      return { ...current, showAddCourse: event.showAddCourse };
    case "SET_LEARNING_STREAK":
      return { ...current, learningStreak: event.learningStreak };
    case "SET_LEARNING_PAGE":
      return { ...current, learningPage: event.learningPage };
    case "SET_EXPANDED_COURSE_TOPIC_ID":
      return { ...current, expandedCourseTopicId: event.expandedCourseTopicId };
    case "SET_FOCUSED_COURSE_ID":
      return { ...current, focusedCourseId: event.focusedCourseId };
    case "SET_SHOW_GLOBAL_SYLLABUS":
      return { ...current, showGlobalSyllabus: event.showGlobalSyllabus };
    case "SET_EDITING_COURSE_ID":
      return { ...current, editingCourseId: event.editingCourseId };
    case "SET_EDITING_TOPIC_ID":
      return { ...current, editingTopicId: event.editingTopicId };
    case "SET_EDITING_SUBTOPIC_ID":
      return { ...current, editingSubtopicId: event.editingSubtopicId };
    case "SET_EDITING_SUBSUBTOPIC_ID":
      return { ...current, editingSubSubtopicId: event.editingSubSubtopicId };
    case "SET_CAREER_LIST":
      return { ...current, careerList: event.careerList };
    case "SET_SELECTED_CAREER_ID":
      return { ...current, selectedCareerId: event.selectedCareerId };
    case "SET_SHOW_ADD_CAREER_DRAWER":
      return { ...current, showAddCareerDrawer: event.showAddCareerDrawer };
    case "SET_EDITING_CAREER_COMPANY_ID":
      return { ...current, editingCareerCompanyId: event.editingCareerCompanyId };
    case "SET_EDITING_CAREER_ROUND_ID":
      return { ...current, editingCareerRoundId: event.editingCareerRoundId };
    case "SET_EDITING_CAREER_RESUME":
      return { ...current, editingCareerResume: event.editingCareerResume };
    case "SET_EDITING_CAREER_JOB_URL":
      return { ...current, editingCareerJobUrl: event.editingCareerJobUrl };
    case "SET_MAIL_FILTER":
      saveMailFilter(event.mailFilter);
      return { ...current, mailFilter: event.mailFilter };
    case "SET_LEARNING_FULLSCREEN":
      return { ...current, learningFullscreen: event.learningFullscreen };
    case "SET_PROJECT_FULLSCREEN":
      return { ...current, projectFullscreen: event.projectFullscreen };
    case "SET_SELECTED_PROJECT_ID":
      return { ...current, selectedProjectId: event.selectedProjectId };
    case "SET_EDITING_PROJECT_ID":
      return { ...current, editingProjectId: event.editingProjectId };
    case "SET_CAREER_FULLSCREEN":
      return { ...current, careerFullscreen: event.careerFullscreen };
    case "SET_ADDING_GATE_TASK_GATE_IDX":
      return { ...current, addingGateTaskGateIdx: event.addingGateTaskGateIdx };
    case "SET_ADDING_GATE_SUBTASK_ID":
      return { ...current, addingGateSubtaskId: event.addingGateSubtaskId };
    case "SET_EDITING_GATE_TASK_ID":
      return { ...current, editingGateTaskId: event.editingGateTaskId };
    case "SET_EDITING_GATE_SUBTASK_ID":
      return { ...current, editingGateSubtaskId: event.editingGateSubtaskId };
    case "SET_GATE_FILTER":
      return { ...current, gateFilter: event.gateFilter };
    default:
      return current;
  }
};

export const render = (state, dispatch) => {
  const s = state || initialState;
  let d = {};
  try { d = JSON.parse(s.output || "{}"); } catch (e) { }

  const weather = Array.isArray(d.weather) ? d.weather : [];
  const mail = (d && typeof d.mail === "object" && d.mail) ? d.mail : { connected: false, unread_count: 0, total_count: 0, messages: [] };
  const mailMessages = Array.isArray(mail.messages) ? mail.messages : [];
  const mailFilter = (s && s.mailFilter) || "all";
  const unreadInMessages = mailMessages.filter((m) => !m.is_read).length;
  const unreadMailCount = Math.max(mail.unread_count || 0, unreadInMessages);
  const jobMessages = mailMessages.filter(isJobMail);
  const unreadMessages = mailMessages.filter((m) => !m.is_read);
  let displayedMailMessages = mailMessages;
  if (mailFilter === "jobs") {
    displayedMailMessages = jobMessages;
  } else if (mailFilter === "unread") {
    displayedMailMessages = unreadMessages;
  }
  const quickApps = Array.isArray(s.quickApps) ? s.quickApps : loadQuickApps();
  const tasks = Array.isArray(s.tasks) ? s.tasks : loadTasks();
  const completedTasks = tasks.filter((task) => task.done).length;
  const editTasks = Boolean(s.editTasks);
  const editQuickApps = s.editQuickApps || {};
  const aiApps = quickApps.filter((app) => app.group === "ai");
  const appIcons = d.app_icons || {};
  const projects = (Array.isArray(s.projects) && s.projects.length >= 3) ? s.projects : loadProjects();
  const showAddProject = Boolean(s.showAddProject);
  const courses = (Array.isArray(s.courses) && s.courses.length >= 7) ? s.courses : loadCourses();
  const showAddCourse = Boolean(s.showAddCourse);
  const learningStreak = (s.learningStreak && typeof s.learningStreak === "object") ? s.learningStreak : loadLearningStreak();
  const avgPct = courses.length
    ? Math.round(courses.reduce((acc, c) => acc + (c.completed / (c.total || 1)), 0) / courses.length * 100)
    : 0;
  const CARDS_PER_PAGE = 4;
  const totalLearningPages = Math.max(1, Math.ceil(courses.length / CARDS_PER_PAGE));
  const currentLearningPage = Math.min(Math.max(1, s.learningPage || 1), totalLearningPages);
  const pagedCourses = courses.slice((currentLearningPage - 1) * CARDS_PER_PAGE, currentLearningPage * CARDS_PER_PAGE);
  const expandedCourseTopicId = s.expandedCourseTopicId || null;
  const focusedCourseId = s.focusedCourseId || null;
  const focusedCourse = focusedCourseId ? courses.find(c => c.id === focusedCourseId) : null;
  const fsCourse = focusedCourse || courses[0] || null;
  const showGlobalSyllabus = Boolean(s.showGlobalSyllabus);
  const activeProjectsCount = projects.filter((p) => p.gates.some((g) => !g)).length;
  const shippedProjectsCount = projects.filter((p) => p.gates.every((g) => Boolean(g))).length;
  const showGlobalProjectsMatrix = s.showGlobalProjectsMatrix !== undefined ? Boolean(s.showGlobalProjectsMatrix) : true;
  const PROJECTS_PER_PAGE = 2;
  const totalProjectPages = Math.max(1, Math.ceil(projects.length / PROJECTS_PER_PAGE));
  const currentProjectPage = Math.min(Math.max(1, s.projectPage || 1), totalProjectPages);
  const pagedProjects = projects.slice((currentProjectPage - 1) * PROJECTS_PER_PAGE, currentProjectPage * PROJECTS_PER_PAGE);
  const careerList = (Array.isArray(s.careerList) && s.careerList.length >= 2) ? s.careerList : loadCareer();
  const selectedCompany = careerList.find((c) => c.id === s.selectedCareerId) || careerList[0] || null;
  const careerFunnel = calculateCareerFunnel(careerList);
  const projectFullscreen = Boolean(s.projectFullscreen);
  const careerFullscreen = Boolean(s.careerFullscreen);
  const selectedProjectId = s.selectedProjectId || (projects[0] ? projects[0].id : null);
  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0] || null;
  const gateFilter = s.gateFilter || "all";
  const passedGatesCount = selectedProject ? selectedProject.gates.filter(Boolean).length : 0;

  const now = new Date();
  const currentHour = now.getHours();
  let timeGreeting = "Good morning";
  if (currentHour >= 12 && currentHour < 17) {
    timeGreeting = "Good afternoon";
  } else if (currentHour >= 17 && currentHour < 22) {
    timeGreeting = "Good evening";
  } else if (currentHour >= 22 || currentHour < 5) {
    timeGreeting = "Good night";
  }
  const todayIdx = (now.getDay() + 6) % 7; // Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6

  const appButton = (app) => (
    <div className="app" key={app.path || app.name}>
      <button
        className="app-launch"
        title={`Open ${app.name}`}
        aria-label={`Open ${app.name}`}
        onClick={() => run(/^https?:\/\//i.test(app.path) ? `/usr/bin/open ${shellQuote(app.path)}` : `/usr/bin/open -a ${shellQuote(app.path)}`)}
      >
        {appIcons[app.icon] ? (
          <img className="app-icon" src={`data:image/png;base64,${appIcons[app.icon]}`} alt="" />
        ) : (
          <span className={`app-icon app-icon-fallback${app.group === "career" ? ` app-icon-${app.name.toLowerCase()}` : ""}`}>
            {app.iconLabel || app.name.slice(0, 1)}
          </span>
        )}
        <small>{app.name}</small>
      </button>
      {editQuickApps[app.group] && (
        <button
          className="app-remove"
          title={`Remove ${app.name}`}
          aria-label={`Remove ${app.name}`}
          onClick={(event) => {
            event.stopPropagation();
            handleRemoveQuickApp(app.path, s, dispatch);
          }}
        >
          ×
        </button>
      )}
    </div>
  );

  const metric = (name, value, detail, color) => (
    <div className="metric" key={name}>
      <div className="ring" style={{ "--p": `${value ?? 0}%`, "--c": color }}>
        <b>{value == null ? "--" : `${value}%`}</b>
      </div>
      <strong>{name}</strong>
      <small>{detail || ""}</small>
    </div>
  );

  return (
    <div className="dashboard">
      <section className="center">
        <div className="topline">
          <div className="clock panel">
            <small>{d.date || "Your daily dashboard"}</small>
            <div className="time">{d.time || "--:--"} <em>{d.ampm || ""}</em></div>
            <strong>{timeGreeting}, Sayyad!</strong>
            <p>Discipline today,<br />freedom tomorrow.</p>
          </div>
          <div className="weatherrow">
            {weather.map((w, idx) => (
              <div
                className={`weather panel${w.name === "Navi Mumbai" ? " weather-navi-mumbai" : ""}`}
                key={w.name ? `${w.name}-${idx}` : idx}
                data-city={w.name}
              >
                <strong>{w.name}</strong>
                <div className="weather-temp">
                  <span>{w.icon}</span>
                  <b>{w.temp}°C</b>
                  <small className="weather-condition">{w.condition}</small>
                </div>
                <small>H:{w.high}° L:{w.low}° · Rain {w.rain}%</small>
              </div>
            ))}
          </div>
        </div>

        <div className={`tasks panel${editTasks ? " editing-tasks" : ""}`}>
          <div className="tasks-heading">
            <h3>✣ &nbsp; Todo</h3>
            <span className="task-count">{completedTasks}/{tasks.length}</span>
            <div className="task-actions">
              <button className="quick-tool" title="Focus the new task field" aria-label="Focus the new task field" onClick={focusTaskInput}>+</button>
              <button
                className="quick-tool task-edit-tool"
                title={editTasks ? "Finish editing tasks" : "Edit tasks (rename & time)"}
                aria-label={editTasks ? "Finish editing tasks" : "Edit tasks (rename & time)"}
                onClick={() => handleToggleTaskEdit(s, dispatch)}
              >
                {editTasks ? "✓" : "✎"}
              </button>
            </div>
          </div>
          <form className="task-add-form" onSubmit={(e) => handleAddTask(e, s, dispatch)}>
            <input className="task-input" type="text" maxLength="100" placeholder="Add a todo…" aria-label="New todo" />
            <input className="task-minutes" type="number" min="1" max="1440" defaultValue="0" aria-label="Estimated minutes" />
            <span>min</span>
            <button className="task-add-submit" type="submit">Add</button>
          </form>
          {tasks.length ? (
            <div className="task-list">
              {tasks.map((task) => (
                <div className={`task${task.done ? " is-done" : ""}`} key={task.id} data-task-id={task.id}>
                  <button
                    className={`task-toggle${task.done ? " done" : ""}`}
                    title={task.done ? "Mark as not done" : "Mark as done"}
                    aria-label={task.done ? `Mark ${task.text} as not done` : `Mark ${task.text} as done`}
                    onClick={() => handleToggleTask(task.id, s, dispatch)}
                  >
                    {task.done ? "✓" : ""}
                  </button>
                  {editTasks ? (
                    <div className="task-edit-row">
                      <input
                        className="task-inline-input"
                        defaultValue={task.text}
                        onBlur={(e) => handleUpdateTaskText(task.id, e.target.value, s, dispatch)}
                        onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
                        placeholder="Task description..."
                      />
                      <input
                        className="task-inline-min"
                        type="number"
                        min="1"
                        defaultValue={task.minutes || 0}
                        onBlur={(e) => handleUpdateTaskMinutes(task.id, e.target.value, s, dispatch)}
                        onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
                      />
                      <span className="task-min-label">m</span>
                    </div>
                  ) : (
                    <span
                      className="task-text"
                      title="Double-click to rename task"
                      onDoubleClick={() => handlePromptEditTask(task.id, s, dispatch)}
                    >
                      {task.text}
                    </span>
                  )}
                  {!editTasks && <small>{task.minutes ? `${task.minutes} min` : ""}</small>}
                  <button
                    className="task-remove"
                    title={`Remove ${task.text}`}
                    aria-label={`Remove ${task.text}`}
                    onClick={() => handleRemoveTask(task.id, s, dispatch)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No todos yet. Use + to add one.</p>
          )}
        </div>

        <div className={`learning panel${focusedCourse ? " is-focused" : ""}`}>
          <div className="learning-header">
            <div className="learning-title-wrap">
              <svg className="learning-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
              <h3>Learning Progress</h3>
            </div>
            <div className="learning-meta">
              <div className="weekly-tracker" title="7-day consistency pulse (Mon-Sun)">
                <span className="weekly-bracket">[</span>
                {["M", "T", "W", "T", "F", "S", "S"].map((dayLetter, dIdx) => {
                  const isToday = dIdx === todayIdx;
                  const isActive = Boolean(learningStreak.week && learningStreak.week[dIdx]);
                  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                  return (
                    <button
                      key={dIdx}
                      type="button"
                      className={`week-day-btn${isActive ? " active" : ""}${isToday ? " is-today" : ""}`}
                      title={`${dayNames[dIdx]}${isToday ? " (Today)" : ""}: ${isActive ? "Completed" : "Pending (Click to log)"}`}
                      onClick={() => handleToggleWeekDay(dIdx, s, dispatch)}
                    >
                      <span className="week-day-letter">{dayLetter}</span>
                      <span className="week-day-dot" />
                    </button>
                  );
                })}
                <span className="weekly-bracket">]</span>
              </div>
              <span className="learning-avg-badge">{avgPct}% Avg</span>
              <span className="learning-streak-badge">🔥 {learningStreak.streak || 2}d</span>
              {focusedCourse ? (
                <button
                  type="button"
                  className="learn-unhide-btn"
                  title="Unhide all cards (Return to 4 courses overview)"
                  onClick={() => handleCloseFocusedCourse(s, dispatch)}
                >
                  ‹ Back to 4 Courses
                </button>
              ) : (
                <div style={{ display: "contents" }}>
                  <button
                    type="button"
                    className={`learn-eye-btn${showGlobalSyllabus ? " active" : ""}`}
                    title={showGlobalSyllabus ? "Hide syllabus overview" : "View all courses syllabus overview"}
                    aria-label="View all courses syllabus overview"
                    onClick={() => handleToggleGlobalSyllabus(s, dispatch)}
                  >
                    👁
                  </button>
                  <button
                    type="button"
                    className="learn-add-toggle"
                    title={showAddCourse ? "Close course form" : "Add new course"}
                    aria-label="Add new course"
                    onClick={() => handleToggleAddCourse(s, dispatch)}
                  >
                    {showAddCourse ? "×" : "+"}
                  </button>
                </div>
              )}
              <button
                type="button"
                className="learn-expand-btn"
                title="Expand Learning Progress to Complete Screen Fullscreen Mode"
                aria-label="Expand Learning Progress to Fullscreen"
                onClick={() => handleToggleLearningFullscreen(s, dispatch)}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </button>
            </div>
          </div>

          {showGlobalSyllabus && !focusedCourse && (
            <div className="global-syllabus-drawer">
              <div className="global-syllabus-header">
                <h4>✦ All Courses Syllabus Matrix ({courses.reduce((acc, c) => acc + c.completed, 0)} / {courses.reduce((acc, c) => acc + c.total, 0)} Total Completed)</h4>
                <button type="button" className="full-header-close" onClick={() => handleToggleGlobalSyllabus(s, dispatch)}>×</button>
              </div>
              <div className="global-syllabus-grid">
                {courses.map((course) => (
                  <div key={course.id} className="global-course-col">
                    <div className="global-col-title">
                      <strong>{course.title}</strong>
                      <small>{course.completed} / {course.total} {course.unit}</small>
                    </div>
                    <div className="global-topics-list">
                      {course.topics.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          className={`global-topic-chip${t.done ? " done" : ""}`}
                          title={`Toggle ${t.name}`}
                          onClick={() => handleToggleCourseTopic(course.id, t.id, s, dispatch)}
                        >
                          <span>{t.done ? "✓" : "⟳"}</span>
                          <span>{t.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showAddCourse && !focusedCourse && (
            <form className="learn-add-form" onSubmit={(e) => handleAddCourse(e, s, dispatch)}>
              <div className="learn-add-row">
                <input className="learn-input" type="text" placeholder="Course Name (e.g. Kafka & Event Streaming)" maxLength="60" />
                <input className="learn-input" type="text" placeholder="Unit (e.g. Modules)" maxLength="20" style={{ maxWidth: "80px" }} />
                <input className="learn-input" type="number" placeholder="Total" min="1" max="999" defaultValue="10" style={{ maxWidth: "60px" }} />
                <input className="learn-input" type="number" placeholder="Done" min="0" max="999" defaultValue="0" style={{ maxWidth: "60px" }} />
              </div>
              <div className="learn-add-row">
                <input className="learn-input" type="text" placeholder="Initial topics / descriptions separated by commas..." maxLength="100000" style={{ flex: 1 }} />
              </div>
              <div className="learn-add-row" style={{ justifyContent: "flex-end" }}>
                <button type="button" className="learn-form-btn learn-cancel" onClick={() => handleToggleAddCourse(s, dispatch)}>Cancel</button>
                <button type="submit" className="learn-form-btn learn-submit">+ Add Course</button>
              </div>
            </form>
          )}

          {focusedCourse ? (
            /* FOCUSED COMPLETE SECTION VIEW (Single Course Expanded, All Others Hidden, Full Topics & Subtopics) */
            <div className="focused-course-view">
              <div className="focused-course-hero">
                {(() => {
                  const pct = Math.round((focusedCourse.completed / (focusedCourse.total || 1)) * 100);
                  const ringColor = getMasteryColor(pct, focusedCourse.color);
                  return (
                    <div className="course-ring large" style={{ "--p": `${pct}%`, "--c": ringColor }}>
                      <b>{pct}%</b>
                    </div>
                  );
                })()}
                <div className="focused-course-details">
                  {s.editingCourseId === focusedCourse.id ? (
                    <div className="focused-course-title-row is-editing">
                      <input
                        key={`normal-edit-course-${focusedCourse.id}`}
                        className="course-inline-edit-input"
                        defaultValue={focusedCourse.title}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        onFocus={(e) => {
                          const val = e.target.value;
                          e.target.setSelectionRange(val.length, val.length);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSaveCourseTitle(focusedCourse.id, e.target.value, s, dispatch);
                          } else if (e.key === "Escape") {
                            e.stopPropagation();
                            handleToggleEditCourse(focusedCourse.id, s, dispatch);
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="course-edit-title-btn save"
                        title="Save course title (Enter)"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={(e) => {
                          e.stopPropagation();
                          const inp = e.currentTarget.closest(".focused-course-title-row").querySelector(".course-inline-edit-input");
                          handleSaveCourseTitle(focusedCourse.id, inp ? inp.value : focusedCourse.title, s, dispatch);
                        }}
                      >
                        ✓
                      </button>
                      <button
                        type="button"
                        className="course-edit-title-btn cancel"
                        title="Cancel (Esc)"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleEditCourse(focusedCourse.id, s, dispatch);
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="focused-course-title-row">
                      <h4
                        className="focused-course-title"
                        style={{ cursor: "pointer" }}
                        title="Double-click to rename"
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          handleToggleEditCourse(focusedCourse.id, s, dispatch);
                        }}
                      >
                        {focusedCourse.title}
                      </h4>
                      <button
                        type="button"
                        className="course-edit-title-btn"
                        title="Rename course"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleEditCourse(focusedCourse.id, s, dispatch);
                        }}
                      >
                        ✎
                      </button>
                    </div>
                  )}
                  <span className="focused-course-stats">
                    {focusedCourse.completed} / {focusedCourse.total} {focusedCourse.unit} Completed ({Math.round((focusedCourse.completed / (focusedCourse.total || 1)) * 100)}%)
                  </span>
                </div>
                <div className="course-actions">
                  <button
                    type="button"
                    className="course-tool-btn"
                    title="Decrement completed"
                    onClick={() => handleDecrementCourse(focusedCourse.id, s, dispatch)}
                  >
                    -
                  </button>
                  <button
                    type="button"
                    className="course-tool-btn"
                    title="Increment completed"
                    onClick={() => handleIncrementCourse(focusedCourse.id, s, dispatch)}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="course-tool-btn"
                    title={`Remove ${focusedCourse.title}`}
                    onClick={() => {
                      handleRemoveCourse(focusedCourse.id, s, dispatch);
                      handleCloseFocusedCourse(s, dispatch);
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="focused-syllabus-section">
                <div className="focused-syllabus-header">
                  <h5>
                    Complete Syllabus ({focusedCourse.topics.filter((t) => t.done).length} / {focusedCourse.topics.length} Topics Done)
                  </h5>
                  <span className="focused-syllabus-hint">Click topic to toggle · Double-click or ✎ to edit · ▾ to expand</span>
                </div>

                <div className="focused-topics-grid">
                  {focusedCourse.topics.map((top, tIdx) => {
                    const subs = Array.isArray(top.subtopics) ? top.subtopics : [];
                    const hasSubs = subs.length > 0;
                    const subsDoneCount = subs.filter((st) => st.done).length;

                    return (
                      <div key={top.id} className={`focused-topic-card${top.done ? " is-done" : ""}`}>
                        {s.editingTopicId === top.id ? (
                          <div className="focused-topic-main-row is-editing">
                            <span className="topic-num">{tIdx + 1}.</span>
                            <textarea
                              key={`normal-edit-top-${top.id}`}
                              className="topic-inline-edit-input"
                              defaultValue={top.name}
                              maxLength="100000"
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                              onFocus={(e) => { const val = e.target.value; e.target.setSelectionRange(val.length, val.length); }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSaveTopicName(focusedCourse ? focusedCourse.id : null, top.id, e.target.value, s, dispatch);
                                } else if (e.key === "Escape") {
                                  handleToggleEditTopic(top.id, s, dispatch);
                                }
                              }}
                            />
                            <div className="focused-topic-actions">
                              <button
                                type="button"
                                className="topic-action-btn save"
                                title="Save topic name (Enter)"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={(e) => {
                                  const inp = e.currentTarget.closest(".focused-topic-main-row").querySelector(".topic-inline-edit-input");
                                  handleSaveTopicName(focusedCourse ? focusedCourse.id : null, top.id, inp ? inp.value : top.name, s, dispatch);
                                }}
                              >
                                ✓
                              </button>
                              <button
                                type="button"
                                className="topic-action-btn cancel"
                                title="Cancel (Esc)"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleToggleEditTopic(top.id, s, dispatch)}
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="focused-topic-main-row">
                            {hasSubs ? (
                              <button
                                type="button"
                                className="topic-expand-btn"
                                title={top.expanded ? "Collapse / Hide subtopics" : "Expand subtopics"}
                                onClick={() => handleToggleTopicExpand(focusedCourse.id, top.id, s, dispatch)}
                              >
                                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" style={{ transform: top.expanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s ease", display: "block" }}>
                                  <polyline points="9 18 15 12 9 6" />
                                </svg>
                              </button>
                            ) : (
                              <span className="topic-bullet">•</span>
                            )}

                            <button
                              type="button"
                              className="focused-topic-toggle"
                              title={`Toggle ${top.name}`}
                              onClick={() => handleToggleCourseTopic(focusedCourse.id, top.id, s, dispatch)}
                            >
                              <span className="topic-icon">{top.done ? "✓" : "⟳"}</span>
                              <span className="topic-num">{tIdx + 1}.</span>
                              <span
                                className="topic-text"
                                onDoubleClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleEditTopic(top.id, s, dispatch);
                                }}
                              >
                                {top.name}
                              </span>
                              {hasSubs && <span className="topic-sub-counter">({subsDoneCount}/{subs.length})</span>}
                            </button>

                            <div className="focused-topic-actions">
                              <button
                                type="button"
                                className="topic-action-btn add"
                                title={`Add subtopic to ${top.name}`}
                                onClick={() => handleAddSubtopicPrompt(focusedCourse.id, top.id, s, dispatch)}
                              >
                                +
                              </button>
                              <button
                                type="button"
                                className="topic-action-btn edit"
                                title={`Rename ${top.name}`}
                                onClick={() => handleToggleEditTopic(top.id, s, dispatch)}
                              >
                                ✎
                              </button>
                              <button
                                type="button"
                                className="topic-action-btn del"
                                title={`Delete ${top.name}`}
                                onClick={() => handleRemoveSubTopic(focusedCourse.id, top.id, s, dispatch)}
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Indented Subtopics Section (Level 2 & Level 3 Depth) */}
                        {top.expanded && (
                          <div className="topic-subtopics-list">
                            {subs.map((sub) => {
                              const subChildren = Array.isArray(sub.subtopics) ? sub.subtopics : [];
                              const hasSubChildren = subChildren.length > 0;
                              const subChildrenDoneCount = subChildren.filter((sst) => sst.done).length;

                              return (
                                <div key={sub.id} className="subtopic-card-wrap">
                                  {s.editingSubtopicId === sub.id ? (
                                    <div className="subtopic-item is-editing">
                                      <span className="subtopic-icon">{sub.done ? "✓" : "⟳"}</span>
                                      <textarea
                                        key={`normal-edit-sub-${sub.id}`}
                                        className="subtopic-inline-edit-input"
                                        defaultValue={sub.name}
                                        maxLength="100000"
                                        autoFocus
                                        onClick={(e) => e.stopPropagation()}
                                        onFocus={(e) => { const val = e.target.value; e.target.setSelectionRange(val.length, val.length); }}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSaveSubtopicName(focusedCourse ? focusedCourse.id : null, top.id, sub.id, e.target.value, s, dispatch);
                                          } else if (e.key === "Escape") {
                                            handleToggleEditSubtopic(sub.id, s, dispatch);
                                          }
                                        }}
                                      />
                                      <div className="subtopic-actions">
                                        <button
                                          type="button"
                                          className="subtopic-btn save"
                                          title="Save subtopic (Enter)"
                                          onMouseDown={(e) => e.preventDefault()}
                                          onClick={(e) => {
                                            const inp = e.currentTarget.closest(".subtopic-item").querySelector(".subtopic-inline-edit-input");
                                            handleSaveSubtopicName(focusedCourse ? focusedCourse.id : null, top.id, sub.id, inp ? inp.value : sub.name, s, dispatch);
                                          }}
                                        >
                                          ✓
                                        </button>
                                        <button
                                          type="button"
                                          className="subtopic-btn cancel"
                                          title="Cancel (Esc)"
                                          onMouseDown={(e) => e.preventDefault()}
                                          onClick={() => handleToggleEditSubtopic(sub.id, s, dispatch)}
                                        >
                                          ×
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className={`subtopic-item${sub.done ? " is-done" : ""}`}>
                                      {hasSubChildren ? (
                                        <button
                                          type="button"
                                          className="subtopic-expand-btn"
                                          title={sub.expanded ? "Collapse / Hide nested subtopics" : "Expand nested subtopics"}
                                          onClick={() => handleToggleSubtopicExpand(focusedCourse.id, top.id, sub.id, s, dispatch)}
                                        >
                                          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" style={{ transform: sub.expanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s ease", display: "block" }}>
                                            <polyline points="9 18 15 12 9 6" />
                                          </svg>
                                        </button>
                                      ) : (
                                        <span className="subtopic-bullet">•</span>
                                      )}

                                      <button
                                        type="button"
                                        className="subtopic-toggle"
                                        title={`Toggle ${sub.name}`}
                                        onClick={() => handleToggleSubtopic(focusedCourse.id, top.id, sub.id, s, dispatch)}
                                      >
                                        <span className="subtopic-icon">{sub.done ? "✓" : "⟳"}</span>
                                        <span
                                          className="subtopic-name"
                                          onDoubleClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleEditSubtopic(sub.id, s, dispatch);
                                          }}
                                        >
                                          {sub.name}
                                        </span>
                                        {hasSubChildren && (
                                          <span className="subtopic-counter">({subChildrenDoneCount}/{subChildren.length})</span>
                                        )}
                                      </button>

                                      <div className="subtopic-actions">
                                        <button
                                          type="button"
                                          className="subtopic-btn add"
                                          title={`Add nested sub-topic / note to ${sub.name}`}
                                          onClick={() => handleAddSubSubtopicPrompt(focusedCourse.id, top.id, sub.id, s, dispatch)}
                                        >
                                          +
                                        </button>
                                        <button
                                          type="button"
                                          className="subtopic-btn edit"
                                          title={`Rename ${sub.name}`}
                                          onClick={() => handleToggleEditSubtopic(sub.id, s, dispatch)}
                                        >
                                          ✎
                                        </button>
                                        <button
                                          type="button"
                                          className="subtopic-btn del"
                                          title={`Delete ${sub.name}`}
                                          onClick={() => handleRemoveSubtopic(focusedCourse.id, top.id, sub.id, s, dispatch)}
                                        >
                                          ×
                                        </button>
                                      </div>
                                    </div>
                                  )}

                                  {/* LEVEL 3: Nested Sub-Subtopics / Leaf Items */}
                                  {sub.expanded && (
                                    <div className="subsubtopics-list">
                                      {subChildren.map((sst) => (
                                        s.editingSubSubtopicId === sst.id ? (
                                          <div key={sst.id} className="subsubtopic-item is-editing">
                                            <span className="subsubtopic-icon">{sst.done ? "✓" : "⟳"}</span>
                                            <textarea
                                              key={`normal-edit-sst-${sst.id}`}
                                              className="subsubtopic-inline-edit-input"
                                              defaultValue={sst.name}
                                              maxLength="100000"
                                              autoFocus
                                              onClick={(e) => e.stopPropagation()}
                                              onFocus={(e) => { const val = e.target.value; e.target.setSelectionRange(val.length, val.length); }}
                                              onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                  e.preventDefault();
                                                  handleSaveSubSubtopicName(focusedCourse ? focusedCourse.id : null, top.id, sub.id, sst.id, e.target.value, s, dispatch);
                                                } else if (e.key === "Escape") {
                                                  handleToggleEditSubSubtopic(sst.id, s, dispatch);
                                                }
                                              }}
                                            />
                                            <div className="subsubtopic-actions">
                                              <button
                                                type="button"
                                                className="subsubtopic-btn save"
                                                title="Save"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={(e) => {
                                                  const inp = e.currentTarget.closest(".subsubtopic-item").querySelector(".subsubtopic-inline-edit-input");
                                                  handleSaveSubSubtopicName(focusedCourse ? focusedCourse.id : null, top.id, sub.id, sst.id, inp ? inp.value : sst.name, s, dispatch);
                                                }}
                                              >
                                                ✓
                                              </button>
                                              <button
                                                type="button"
                                                className="subsubtopic-btn cancel"
                                                title="Cancel"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => handleToggleEditSubSubtopic(sst.id, s, dispatch)}
                                              >
                                                ×
                                              </button>
                                            </div>
                                          </div>
                                        ) : (
                                          <div key={sst.id} className={`subsubtopic-item${sst.done ? " is-done" : ""}`}>
                                            <button
                                              type="button"
                                              className="subsubtopic-toggle"
                                              title={`Toggle ${sst.name}`}
                                              onClick={() => handleToggleSubSubtopic(focusedCourse.id, top.id, sub.id, sst.id, s, dispatch)}
                                            >
                                              <span className={`subsubtopic-icon${sst.done ? " is-done" : ""}`}>
                                                {sst.done ? (
                                                  <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="#00e6a0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                    <polyline points="20 6 9 17 4 12" />
                                                  </svg>
                                                ) : (
                                                  <svg viewBox="0 0 24 24" width="10" height="10" fill="#ffaa00" stroke="#ffaa00" strokeWidth="1.5" aria-hidden="true">
                                                    <circle cx="12" cy="12" r="4.5" />
                                                  </svg>
                                                )}
                                              </span>
                                              <span
                                                className="subsubtopic-name"
                                                onDoubleClick={(e) => {
                                                  e.stopPropagation();
                                                  handleToggleEditSubSubtopic(sst.id, s, dispatch);
                                                }}
                                              >
                                                {sst.name}
                                              </span>
                                            </button>
                                            <div className="subsubtopic-actions">
                                              <button
                                                type="button"
                                                className="subsubtopic-btn edit"
                                                title={`Rename ${sst.name}`}
                                                onClick={() => handleToggleEditSubSubtopic(sst.id, s, dispatch)}
                                              >
                                                ✎
                                              </button>
                                              <button
                                                type="button"
                                                className="subsubtopic-btn del"
                                                title={`Delete ${sst.name}`}
                                                onClick={() => handleRemoveSubSubtopic(focusedCourse.id, top.id, sub.id, sst.id, s, dispatch)}
                                              >
                                                ×
                                              </button>
                                            </div>
                                          </div>
                                        )
                                      ))}

                                      <form
                                        className="subsubtopic-quick-add"
                                        data-subtopic-form={sub.id}
                                        onSubmit={(e) => handleAddSubSubtopic(e, focusedCourse.id, top.id, sub.id, s, dispatch)}
                                      >
                                        <input
                                          className="subsubtopic-add-input"
                                          data-subtopic-input={sub.id}
                                          type="text"
                                          placeholder="+ Add nested sub-topic / note (30k+ chars)..."
                                          maxLength="100000"
                                        />
                                        <button type="submit" className="subsubtopic-add-btn">+ Add</button>
                                      </form>
                                    </div>
                                  )}
                                </div>
                              );
                            })}

                            <form className="subtopic-quick-add" onSubmit={(e) => handleAddSubtopic(e, focusedCourse.id, top.id, s, dispatch)}>
                              <input className="subtopic-add-input" type="text" placeholder="+ Add subtopic / description (30k+ chars)..." maxLength="100000" />
                              <button type="submit" className="subtopic-add-btn">Add</button>
                            </form>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <form className="focused-add-topic-form" onSubmit={(e) => handleQuickAddTopic(e, focusedCourse.id, s, dispatch)}>
                  <input className="focused-topic-input" type="text" placeholder="+ Add new main topic / description content (30k+ chars)..." maxLength="100000" />
                  <button type="submit" className="focused-topic-submit">+ Add Topic</button>
                </form>
              </div>
            </div>
          ) : (
            /* 2x2 BENTO MASTERY GRID: CLEAN, MINIMAL CARDS (Progress, Title, Count, Eye Button - NO Topic Pills!) */
            <div style={{ display: "contents" }}>
              <div className="learning-grid">
                {courses.length === 0 ? (
                  <div
                    className="learning-empty-box"
                    style={{
                      gridColumn: "1 / -1",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "24px 12px",
                      background: "rgba(10, 10, 14, 0.45)",
                      border: "1px dashed rgba(255, 38, 59, 0.3)",
                      borderRadius: "8px",
                      gap: "8px",
                      color: "#888",
                      fontSize: "10px",
                      textAlign: "center",
                    }}
                  >
                    <span>No learning courses added yet.</span>
                    <button
                      type="button"
                      style={{
                        background: "rgba(255, 38, 59, 0.15)",
                        border: "1px solid #ff263b",
                        color: "#ff263b",
                        borderRadius: "4px",
                        padding: "3px 10px",
                        cursor: "pointer",
                        fontSize: "9px",
                        fontWeight: "600",
                      }}
                      onClick={() => handleToggleAddCourse(s, dispatch)}
                    >
                      + Add Course
                    </button>
                  </div>
                ) : pagedCourses.length ? (
                  pagedCourses.map((course) => {
                    const pct = Math.round((course.completed / (course.total || 1)) * 100);
                    const ringColor = getMasteryColor(pct, course.color);

                    return (
                      <div className="course-card" key={course.id}>
                        <div className="course-card-left">
                          <div className="course-ring" style={{ "--p": `${pct}%`, "--c": ringColor }}>
                            <b>{pct}%</b>
                          </div>
                          <div className="course-info">
                            {s.editingCourseId === course.id ? (
                              <div className="course-title-wrap is-editing">
                                <input
                                  key={`course-card-edit-${course.id}`}
                                  className="course-inline-edit-input compact"
                                  defaultValue={course.title}
                                  autoFocus
                                  onClick={(e) => e.stopPropagation()}
                                  onFocus={(e) => {
                                    const val = e.target.value;
                                    e.target.setSelectionRange(val.length, val.length);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleSaveCourseTitle(course.id, e.target.value, s, dispatch);
                                    } else if (e.key === "Escape") {
                                      e.stopPropagation();
                                      handleToggleEditCourse(course.id, s, dispatch);
                                    }
                                  }}
                                />
                                <button
                                  type="button"
                                  className="course-inline-rename-btn save"
                                  title="Save (Enter)"
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const inp = e.currentTarget.closest(".course-title-wrap").querySelector(".course-inline-edit-input");
                                    handleSaveCourseTitle(course.id, inp ? inp.value : course.title, s, dispatch);
                                  }}
                                >✓</button>
                                <button
                                  type="button"
                                  className="course-inline-rename-btn cancel"
                                  title="Cancel (Esc)"
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleEditCourse(course.id, s, dispatch);
                                  }}
                                >×</button>
                              </div>
                            ) : (
                              <div className="course-title-wrap">
                                <strong
                                  className="course-title"
                                  style={{ cursor: "pointer" }}
                                  title="Double-click to rename"
                                  onDoubleClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleEditCourse(course.id, s, dispatch);
                                  }}
                                >
                                  {course.title}
                                </strong>
                                <button
                                  type="button"
                                  className="course-inline-rename-btn"
                                  title="Rename course"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleEditCourse(course.id, s, dispatch);
                                  }}
                                >
                                  ✎
                                </button>
                              </div>
                            )}
                            <span className="course-count">{course.completed} / {course.total} {course.unit}</span>
                          </div>
                        </div>

                        <div className="course-card-right">
                          <div className="course-actions">
                            <button
                              type="button"
                              className="course-tool-btn"
                              title="Decrement completed"
                              aria-label="Decrement completed"
                              onClick={() => handleDecrementCourse(course.id, s, dispatch)}
                            >
                              -
                            </button>
                            <button
                              type="button"
                              className="course-tool-btn"
                              title="Increment completed"
                              aria-label="Increment completed"
                              onClick={() => handleIncrementCourse(course.id, s, dispatch)}
                            >
                              +
                            </button>
                            <button
                              type="button"
                              className="course-tool-btn"
                              title={`Remove ${course.title}`}
                              aria-label={`Remove ${course.title}`}
                              onClick={() => handleRemoveCourse(course.id, s, dispatch)}
                            >
                              ×
                            </button>
                          </div>
                          <button
                            type="button"
                            className="course-eye-btn"
                            title="View complete syllabus & subtopics"
                            aria-label="View complete syllabus & subtopics"
                            onClick={() => handleOpenFocusedCourse(course.id, s, dispatch)}
                          >
                            👁 View
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="empty-state">No courses on this page.</p>
                )}
              </div>

              <div className="learning-pagination">
                <button
                  type="button"
                  className="learn-page-nav-btn"
                  disabled={currentLearningPage <= 1}
                  onClick={() => handleSetLearningPage(currentLearningPage - 1, s, dispatch)}
                  title="Previous 4 courses"
                >
                  ‹
                </button>
                <div className="learn-page-indicator">
                  <div className="learn-page-dots">
                    {Array.from({ length: totalLearningPages }).map((_, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        className={`learn-page-dot${currentLearningPage === pIdx + 1 ? " active" : ""}`}
                        onClick={() => handleSetLearningPage(pIdx + 1, s, dispatch)}
                        title={`Page ${pIdx + 1}`}
                      />
                    ))}
                  </div>
                  <span className="learn-page-label">
                    Page {currentLearningPage} of {totalLearningPages} ({courses.length} Course{courses.length === 1 ? "" : "s"})
                  </span>
                </div>
                <button
                  type="button"
                  className="learn-page-nav-btn"
                  disabled={currentLearningPage >= totalLearningPages}
                  onClick={() => handleSetLearningPage(currentLearningPage + 1, s, dispatch)}
                  title="Next 4 courses"
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="quick panel">
          <h3>⚡ &nbsp; Quick Access</h3>
          <div className="quick-groups">
            <div className="quick-group" data-quick-group="dev">
              <div className="quick-group-header">
                <h4>Development</h4>
                <div className="quick-actions">
                  <button className="quick-tool" title="Add a development app" aria-label="Add a development app" onClick={() => chooseQuickApp("dev", s, dispatch)}>+</button>
                  <button className="quick-tool quick-edit-tool" title="Edit development apps" aria-label="Edit development apps" onClick={() => handleToggleQuickEdit("dev", s, dispatch)}>{editQuickApps.dev ? "✓" : "✎"}</button>
                </div>
              </div>
              <div className="apps dev-apps">{quickApps.filter((app) => app.group === "dev").map(appButton)}</div>
            </div>
            <div className="quick-group" data-quick-group="career">
              <div className="quick-group-header">
                <h4>Career &amp; Jobs</h4>
                <div className="quick-actions">
                  <button className="quick-tool" title="Add a career app" aria-label="Add a career app" onClick={() => chooseQuickApp("career", s, dispatch)}>+</button>
                  <button className="quick-tool quick-edit-tool" title="Edit career apps" aria-label="Edit career apps" onClick={() => handleToggleQuickEdit("career", s, dispatch)}>{editQuickApps.career ? "✓" : "✎"}</button>
                </div>
              </div>
              <div className="apps stacked-apps">{quickApps.filter((app) => app.group === "career").map(appButton)}</div>
            </div>
            <div className="quick-group entertainment-group" data-quick-group="entertainment">
              <div className="quick-group-header">
                <h4>Entertainment</h4>
                <div className="quick-actions">
                  <button className="quick-tool" title="Add an entertainment app" aria-label="Add an entertainment app" onClick={() => chooseQuickApp("entertainment", s, dispatch)}>+</button>
                  <button className="quick-tool quick-edit-tool" title="Edit entertainment apps" aria-label="Edit entertainment apps" onClick={() => handleToggleQuickEdit("entertainment", s, dispatch)}>{editQuickApps.entertainment ? "✓" : "✎"}</button>
                </div>
              </div>
              <div className="apps stacked-apps">{quickApps.filter((app) => app.group === "entertainment").map(appButton)}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="right">
        <div className="status panel">
          <h3>♧ &nbsp; System Status <span className="live">● Live</span></h3>
          <div className="metrics">
            {metric("Battery", d.battery, d.power, "#00e6a0")}
            {metric("CPU", d.cpu, d.cpu_cores_used == null ? "Core count unavailable" : `${d.cpu_cores_used} / ${d.cpu_cores_total} cores`, "#ff263b")}
            {metric("GPU", d.gpu, d.gpu_cores_used == null ? "Usage unavailable" : `${d.gpu_cores_used} / ${d.gpu_cores_total} cores`, "#08baff")}
            {metric("RAM", d.memory, `${d.used_gb || "--"} / ${d.total_gb || "--"} GB`, "#ff263b")}
            {metric("Disk", d.disk, `${d.disk_used || "--"} / ${d.disk_size || "--"} GB`, "#08baff")}
          </div>
          <div className="network">
            <div className="network-item">
              <span className="bubble" aria-label="Wi-Fi"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 8.5a14 14 0 0 1 19 0M5.8 12a9 9 0 0 1 12.4 0M9.2 15.5a4 4 0 0 1 5.6 0" /><circle cx="12" cy="19" r="1.3" fill="currentColor" stroke="none" /></svg></span>
              <div className="network-copy"><strong>{d.wifi || (d.wifi_connected ? "Connected" : "Wi-Fi unavailable")}</strong><small>{d.wifi_connected ? "Connected" : "Not connected"}</small></div>
            </div>
            <div className="network-item">
              <span className="bubble" aria-label="Bluetooth"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v20l7-6-14-12M5 18l14-12-7-4" /></svg></span>
              <div className="network-copy"><strong>{d.bluetooth || "Unavailable"}</strong><small>Bluetooth {d.bluetooth_power || "Unavailable"}</small></div>
            </div>
            <div className="network-item">
              <span className="bubble">IP</span>
              <div className="network-copy"><strong>{d.ip || "Unavailable"}</strong><small>Local IP</small></div>
            </div>
            <div className="network-item traffic-item">
              <span className="bubble">↕</span>
              <div className="network-copy"><strong className="download">↓ {d.down || "—"}</strong><small className="upload">↑ {d.up || "—"}</small></div>
            </div>
          </div>
        </div>

        <div className="ai panel">
          <h3>♧ &nbsp; AI Assistant <span className="live">Ollama</span></h3>
          <p className="empty-state">Chat UI is not connected in this widget file. No model is claimed to be running.</p>
          <div className="quick-group ai-apps-section" data-quick-group="ai">
            <div className="quick-group-header"><h4>AI Apps</h4><div className="quick-actions">
              <button className="quick-tool" title="Add an AI app" aria-label="Add an AI app" onClick={() => chooseQuickApp("ai", s, dispatch)}>+</button>
              <button className="quick-tool quick-edit-tool" title="Edit AI apps" aria-label="Edit AI apps" onClick={() => handleToggleQuickEdit("ai", s, dispatch)}>{editQuickApps.ai ? "✓" : "✎"}</button>
            </div></div>
            <div className="apps ai-apps">{aiApps.map(appButton)}</div>
            {!aiApps.length && <small className="ai-apps-empty">No apps added yet. Use + to add one.</small>}
          </div>
        </div>

        <div className="emails panel">
          <div className="mail-header">
            <div className="mail-title-wrap">
              <svg className="mail-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <h3>Apple Mail</h3>
              {unreadMailCount > 0 && (
                <span className="mail-unread-badge">● {unreadMailCount} Unread</span>
              )}
            </div>
            <div className="mail-header-actions">
              <span className="mail-stats">{mail.total_count ? `${mail.total_count} in Inbox` : "Inbox"}</span>
              <button
                type="button"
                className="mail-open-app-btn"
                title="Launch Apple Mail"
                onClick={() => run("/usr/bin/open -a Mail")}
              >
                Open Mail ↗
              </button>
            </div>
          </div>

          <div className="mail-filter-tabs">
            <button
              type="button"
              className={`mail-filter-tab${mailFilter === "all" ? " active" : ""}`}
              onClick={() => handleSetMailFilter("all", s, dispatch)}
              title="Show all recent inbox messages"
            >
              All <span className="mail-tab-count">({mailMessages.length})</span>
            </button>
            <button
              type="button"
              className={`mail-filter-tab jobs-tab${mailFilter === "jobs" ? " active" : ""}`}
              onClick={() => handleSetMailFilter("jobs", s, dispatch)}
              title="Show only recruiter and job-related emails"
            >
              🎯 Jobs & Recruiters <span className="mail-tab-count">({jobMessages.length})</span>
            </button>
            <button
              type="button"
              className={`mail-filter-tab unread-tab${mailFilter === "unread" ? " active" : ""}`}
              onClick={() => handleSetMailFilter("unread", s, dispatch)}
              title="Show only unread emails"
            >
              ✉ Unread <span className={`mail-tab-count${unreadMailCount > 0 ? " has-unread" : ""}`}>({unreadMailCount})</span>
            </button>
          </div>

          {displayedMailMessages.length > 0 ? (
            <div className="mail-list">
              {displayedMailMessages.map((msg, mIdx) => {
                const initial = (msg.sender || "M").charAt(0).toUpperCase();
                const isJob = isJobMail(msg);
                return (
                  <div
                    key={msg.id || mIdx}
                    className={`mail-item${!msg.is_read ? " unread" : ""}${isJob ? " is-job-mail" : ""}`}
                    onClick={() => {
                      if (msg.id) {
                        run(`/usr/bin/open "message://%3C${encodeURIComponent(msg.id)}%3E" || /usr/bin/open -a Mail`);
                      } else {
                        run("/usr/bin/open -a Mail");
                      }
                    }}
                    title={`From: ${msg.sender}${msg.email ? ` <${msg.email}>` : ""}\nSubject: ${msg.subject}\nDate: ${msg.raw_date || msg.date}\nClick to open in Apple Mail`}
                  >
                    <div className="mail-avatar">
                      {initial}
                    </div>
                    <div className="mail-content">
                      <div className="mail-row-top">
                        <span className="mail-sender">
                          {!msg.is_read && <span className="mail-unread-dot">●</span>}
                          {msg.sender}
                          {isJob && <span className="mail-job-tag">JOB</span>}
                        </span>
                        <span className="mail-date">{msg.date}</span>
                      </div>
                      <div className="mail-subject">
                        {msg.subject}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mail-empty-box">
              <svg className="mail-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span>
                {mailFilter === "jobs"
                  ? "No recruiter or job-related emails in recent messages."
                  : mailFilter === "unread"
                  ? "All caught up! No unread messages."
                  : mail.connected
                  ? "Inbox is clean. No recent messages."
                  : "Apple Mail is syncing or not connected."}
              </span>
              <button
                type="button"
                className="mail-open-btn"
                onClick={() => run("/usr/bin/open -a Mail")}
              >
                Launch Apple Mail
              </button>
            </div>
          )}
        </div>

        <div className="bottomcards">
          <div className="projects panel">
            <div className="projects-heading">
              <div className="projects-title-wrap">
                <svg className="projects-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M8 7v7" />
                  <path d="M12 7v4" />
                  <path d="M16 7v9" />
                </svg>
                <h3>Project Tracker</h3>
              </div>
              <div className="projects-stats">
                <span>{activeProjectsCount} Active · {shippedProjectsCount} Shipped</span>
                <button
                  className="proj-add-toggle"
                  title={showAddProject ? "Close project form" : "Add new project"}
                  aria-label="Add new project"
                  onClick={() => handleToggleAddProjectForm(s, dispatch)}
                >
                  {showAddProject ? "×" : "+"}
                </button>
                <button
                  type="button"
                  className="proj-fs-toggle-btn"
                  title="Open Fullscreen Project Studio"
                  aria-label="Fullscreen Project Studio"
                  onClick={() => handleToggleProjectFullscreen(s, dispatch)}
                >
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 3 21 3 21 9" />
                    <polyline points="9 21 3 21 3 15" />
                    <line x1="21" y1="3" x2="14" y2="10" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                </button>
              </div>
            </div>

            {showAddProject && (
              <form className="proj-add-form" onSubmit={(e) => handleAddProject(e, s, dispatch)}>
                <div className="proj-add-row">
                  <input className="proj-name-input" type="text" placeholder="Project name (e.g. Distributed Job Scheduler)" maxLength="80" autoFocus />
                  <input className="proj-stack-input" type="text" placeholder="Tech stack (e.g. Java · Redis)" maxLength="60" />
                </div>
                <div className="proj-add-row" style={{ justifyContent: "flex-end" }}>
                  <button type="button" className="proj-form-btn proj-cancel" onClick={() => handleToggleAddProjectForm(s, dispatch)}>Cancel</button>
                  <button type="submit" className="proj-form-btn proj-submit">+ Add Project</button>
                </div>
              </form>
            )}

            <div className="proj-list">
              {projects.length === 0 ? (
                <div
                  className="projects-empty-box"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "22px 12px",
                    background: "rgba(10, 10, 14, 0.45)",
                    border: "1px dashed rgba(255, 170, 0, 0.3)",
                    borderRadius: "8px",
                    gap: "8px",
                    color: "#888",
                    fontSize: "9.5px",
                    textAlign: "center",
                  }}
                >
                  <span>No projects tracked yet.</span>
                  <button
                    type="button"
                    style={{
                      background: "rgba(255, 170, 0, 0.15)",
                      border: "1px solid #ffaa00",
                      color: "#ffaa00",
                      borderRadius: "4px",
                      padding: "3px 10px",
                      cursor: "pointer",
                      fontSize: "9px",
                      fontWeight: "600",
                    }}
                    onClick={() => handleToggleAddProjectForm(s, dispatch)}
                  >
                    + Add Project
                  </button>
                </div>
              ) : pagedProjects.length ? (
                pagedProjects.map((proj) => {
                  const passedCount = proj.gates.filter(Boolean).length;
                  const pct = Math.round((passedCount / 8) * 100);
                  const isCompleted = passedCount === 8;
                  const badge = getStageBadge(passedCount, 8);
                  const activeSegments = passedCount * 3; // 24 segments total (3 per gate)

                  return (
                    <div className={`proj-card${isCompleted ? " is-shipped" : ""}`} key={proj.id}>
                      <div className="proj-header">
                        <div className="proj-top-row">
                          <button
                            type="button"
                            className="proj-title-btn"
                            title={proj.expanded ? "Collapse project" : "Expand project"}
                            onClick={() => handleToggleExpand(proj.id, s, dispatch)}
                          >
                            <svg className={`proj-chevron-svg${proj.expanded ? " is-expanded" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                            <span className="proj-name">{proj.name}</span>
                            {proj.stack && <span className="proj-stack">({proj.stack})</span>}
                          </button>
                          <div className="proj-tools-group">
                            <button
                              type="button"
                              className="proj-tool-btn"
                              title="Decrement passed gate"
                              aria-label="Decrement passed gate"
                              onClick={() => handleDecrementGate(proj.id, s, dispatch)}
                            >
                              -
                            </button>
                            <button
                              type="button"
                              className="proj-tool-btn"
                              title="Increment passed gate"
                              aria-label="Increment passed gate"
                              onClick={() => handleIncrementGate(proj.id, s, dispatch)}
                            >
                              +
                            </button>
                            <button
                              type="button"
                              className="proj-tool-btn"
                              title={`Delete ${proj.name}`}
                              aria-label={`Delete ${proj.name}`}
                              onClick={() => handleRemoveProject(proj.id, s, dispatch)}
                            >
                              ×
                            </button>
                          </div>
                        </div>
                        <div className="proj-meta-row">
                          <span className="proj-passed-text">
                            {proj.expanded ? `${passedCount} / 8 Gates Passed (${pct}%)` : `${passedCount} / 8 Gates (${pct}%)`}
                          </span>
                          <span
                            className="proj-stage-badge"
                            style={{ color: badge.color, background: badge.bg, borderColor: badge.border }}
                          >
                            {badge.text}
                          </span>
                        </div>
                      </div>

                      <div className="proj-segments" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
                        {Array.from({ length: 24 }).map((_, segIdx) => (
                          <div
                            key={segIdx}
                            className={`proj-seg ${segIdx < activeSegments ? (isCompleted ? "active-complete" : "active") : ""}`}
                          />
                        ))}
                      </div>

                      {proj.expanded ? (
                        <div className="proj-gates-list">
                          {DEFAULT_SDLC_GATES.map((gateLabel, gIdx) => {
                            const checked = Boolean(proj.gates[gIdx]);
                            return (
                              <button
                                key={gateLabel}
                                type="button"
                                className={`proj-gate-item${checked ? " checked" : ""}`}
                                onClick={() => handleToggleGate(proj.id, gIdx, s, dispatch)}
                                title={`Toggle ${gateLabel}`}
                              >
                                <span className="proj-check-box">{checked ? "✓" : ""}</span>
                                <span className="proj-gate-label">{gateLabel}</span>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className={`proj-blocker${isCompleted ? " is-complete" : ""}`}>
                          <svg className="proj-blocker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            {isCompleted ? (
                              <g>
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                              </g>
                            ) : (
                              <g>
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </g>
                            )}
                          </svg>
                          <span>{getNextBlocker(proj.gates)}</span>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="empty-state">No projects tracked yet. Click + to add one.</p>
              )}
            </div>

            {totalProjectPages > 1 && (
              <div className="proj-pagination">
                <button
                  type="button"
                  className="proj-page-nav-btn"
                  disabled={currentProjectPage <= 1}
                  onClick={() => handleSetProjectPage(currentProjectPage - 1, s, dispatch)}
                  title="Previous page"
                >
                  ‹
                </button>
                <div className="proj-page-indicator">
                  <div className="proj-page-dots">
                    {Array.from({ length: totalProjectPages }).map((_, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        className={`proj-page-dot${currentProjectPage === pIdx + 1 ? " active" : ""}`}
                        onClick={() => handleSetProjectPage(pIdx + 1, s, dispatch)}
                        title={`Page ${pIdx + 1}`}
                      />
                    ))}
                  </div>
                  <span className="proj-page-counter">{currentProjectPage} / {totalProjectPages}</span>
                </div>
                <button
                  type="button"
                  className="proj-page-nav-btn"
                  disabled={currentProjectPage >= totalProjectPages}
                  onClick={() => handleSetProjectPage(currentProjectPage + 1, s, dispatch)}
                  title="Next page"
                >
                  ›
                </button>
              </div>
            )}
          </div>
          <div className="career panel">
            {/* Header */}
            <div className="career-header">
              <div className="career-title-wrap">
                <svg className="career-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect width="20" height="14" x="2" y="7" rx="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                <h3>Job Tracker</h3>
              </div>
              <div className="career-funnel-pills">
                <span className="funnel-pill applied">{careerFunnel.applied} Applied</span>
                <span className="funnel-pill oa">{careerFunnel.oa} OA</span>
                <span className="funnel-pill interview">{careerFunnel.interview} Interview</span>
                <span className="funnel-pill offer">{careerFunnel.offer} Offer</span>
                <button
                  type="button"
                  className="career-add-btn"
                  title="Toggle Add Application Drawer"
                  aria-label="Add new application"
                  onClick={() => handleToggleAddCareerDrawer(s, dispatch)}
                >
                  {s.showAddCareerDrawer ? "×" : "+"}
                </button>
                <button
                  type="button"
                  className="career-fs-toggle-btn"
                  title="Open Fullscreen Job Tracker Studio"
                  aria-label="Fullscreen Job Tracker Studio"
                  onClick={() => handleToggleCareerFullscreen(s, dispatch)}
                >
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 3 21 3 21 9" />
                    <polyline points="9 21 3 21 3 15" />
                    <line x1="21" y1="3" x2="14" y2="10" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Conditional Display: Add Application Form View vs Two-Column Master-Detail View */}
            {s.showAddCareerDrawer ? (
              <div className="career-add-view">
                <div className="career-add-view-header">
                  <div className="career-add-title-wrap">
                    <svg className="career-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect width="20" height="14" x="2" y="7" rx="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      <line x1="12" x2="12" y1="11" y2="17" />
                      <line x1="9" x2="15" y1="14" y2="14" />
                    </svg>
                    <h4>Add New Job Application</h4>
                  </div>
                  <button
                    type="button"
                    className="career-add-close-btn"
                    title="Close and return to list"
                    onClick={() => handleToggleAddCareerDrawer(s, dispatch)}
                  >
                    ×
                  </button>
                </div>

                <form className="career-add-form-fullscreen" onSubmit={(e) => handleAddCareerSubmit(e, s, dispatch)}>
                  <div className="career-add-form-grid">
                    <div className="form-field-group">
                      <label className="car-form-label">Company Name *</label>
                      <input className="car-inp car-input-company" type="text" placeholder="e.g. Razorpay, Datadog" required autoFocus />
                    </div>

                    <div className="form-field-group">
                      <label className="car-form-label">CTC / Package</label>
                      <input className="car-inp car-input-ctc" type="text" placeholder="e.g. 18 LPA" defaultValue="16 LPA" />
                    </div>

                    <div className="form-field-group full-width">
                      <label className="car-form-label">Role &amp; Tech Stack *</label>
                      <input className="car-inp car-input-role" type="text" placeholder="e.g. SDE-2 (Java / Kafka / Spring Boot)" required />
                    </div>

                    <div className="form-field-group">
                      <label className="car-form-label">Source</label>
                      <select className="car-inp car-input-source" defaultValue="LinkedIn">
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Naukri">Naukri</option>
                        <option value="Referral">Referral</option>
                        <option value="Direct">Direct</option>
                      </select>
                    </div>

                    <div className="form-field-group">
                      <label className="car-form-label">Sponsorship</label>
                      <label className="car-mtech-toggle-box">
                        <input type="checkbox" className="car-input-mtech" defaultChecked />
                        <span>M.Tech Sponsored</span>
                      </label>
                    </div>

                    <div className="form-field-group full-width">
                      <label className="car-form-label">Job Posting / Application URL (Optional)</label>
                      <input className="car-inp car-input-joburl" type="text" placeholder="https://..." />
                    </div>
                  </div>

                  <div className="career-add-view-footer">
                    <button
                      type="button"
                      className="car-drawer-btn cancel"
                      onClick={() => handleToggleAddCareerDrawer(s, dispatch)}
                    >
                      ✕ Cancel
                    </button>
                    <button type="submit" className="car-drawer-btn submit">
                      ✓ Save &amp; Track Application
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Two-Column Master-Detail Layout */
              <div className="career-body">
                {/* Left Column (38% width): Target Selector */}
                <div className="career-target-col">
                  <div className="career-col-head">
                    <span className="col-title">Target Selector</span>
                    <span className="col-sub" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <svg className="career-sub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="6" />
                        <circle cx="12" cy="12" r="2" />
                      </svg>
                      Active Pipelines
                    </span>
                  </div>
                  <div className="career-pipeline-list">
                    {careerList.length === 0 ? (
                      <div
                        className="career-empty-list"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "24px 8px",
                          textAlign: "center",
                          color: "#777",
                          fontSize: "10.5px",
                          gap: "6px",
                        }}
                      >
                        <span>No active pipelines</span>
                        <button
                          type="button"
                          style={{
                            background: "rgba(239, 68, 68, 0.15)",
                            border: "1px solid #ef4444",
                            color: "#ef4444",
                            borderRadius: "3px",
                            padding: "3px 8px",
                            cursor: "pointer",
                            fontSize: "10px",
                          }}
                          onClick={() => handleToggleAddCareerDrawer(s, dispatch)}
                        >
                          + Add Target
                        </button>
                      </div>
                    ) : (
                      careerList.map((comp) => {
                      const isSel = comp.id === selectedCompany?.id;
                      return (
                        <div
                          key={comp.id}
                          className={`career-card${isSel ? " is-active" : ""}`}
                          onClick={() => handleSelectCareer(comp.id, s, dispatch)}
                        >
                          <span className={`career-status-dot${isSel ? " glowing" : ""}`}>●</span>
                          <div className="career-card-info">
                            <div className="career-card-line1">
                              <strong>{comp.company}</strong>
                              <span className="career-ctc">({comp.ctc})</span>
                            </div>
                            <div className="career-card-line2">
                              {comp.role}{comp.stack ? ` (${comp.stack})` : ""}
                            </div>
                          </div>
                          {isSel && <span className="career-chevron">›</span>}
                        </div>
                      );
                    }))}
                  </div>
                </div>

                {/* Right Column (62% width): Detail Inspector */}
                <div className="career-detail-col">
                  <div className="career-col-head">
                    <span className="col-title" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <svg className="career-sub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      Detail Inspector
                    </span>
                  </div>

                  {selectedCompany ? (
                    <div className="career-detail-content">
                      {/* Editable Title Row */}
                      {s.editingCareerCompanyId === selectedCompany.id ? (
                        <div className="career-inline-edit-row" style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          <input
                            key={`normal-edit-comp-${selectedCompany.id}`}
                            className="career-inline-inp"
                            defaultValue={`${selectedCompany.company} · ${selectedCompany.role}${selectedCompany.stack ? ` (${selectedCompany.stack})` : ""} | ${selectedCompany.ctc}`}
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                            onFocus={(e) => {
                              const val = e.target.value;
                              e.target.setSelectionRange(val.length, val.length);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                e.stopPropagation();
                                handleSaveCompanyFromText(selectedCompany.id, e.target.value, s, dispatch);
                              } else if (e.key === "Escape") {
                                e.stopPropagation();
                                handleStartEditCompany(null, s, dispatch);
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="career-edit-btn save"
                            title="Save (Enter)"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={(e) => {
                              e.stopPropagation();
                              const inp = e.currentTarget.parentElement.querySelector(".career-inline-inp");
                              handleSaveCompanyFromText(selectedCompany.id, inp ? inp.value : selectedCompany.company, s, dispatch);
                            }}
                          >✓</button>
                          <button
                            type="button"
                            className="career-edit-btn cancel"
                            title="Cancel (Esc)"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEditCompany(null, s, dispatch);
                            }}
                          >×</button>
                        </div>
                      ) : (
                        <div className="career-title-row" onClick={() => handleStartEditCompany(selectedCompany.id, s, dispatch)} title="Click to edit details">
                          <h4 className="career-title">
                            {selectedCompany.company} · {selectedCompany.role}{selectedCompany.stack ? ` (${selectedCompany.stack})` : ""}
                          </h4>
                          <span className="career-title-ctc">{selectedCompany.ctc}</span>
                          <svg className="career-pencil-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          </svg>
                        </div>
                      )}

                      {/* Interactive Metadata Pill Row */}
                      <div className="career-pills-row">
                        <button
                          type="button"
                          className={`career-meta-pill sponsorship${selectedCompany.mtechSponsored ? " is-sponsored" : ""}`}
                          onClick={() => handleToggleSponsorship(selectedCompany.id, s, dispatch)}
                          title="Click to toggle M.Tech sponsorship"
                        >
                          [ {selectedCompany.mtechSponsored ? "M.Tech Sponsored" : "Standard Role"} ]
                        </button>

                        <button
                          type="button"
                          className="career-meta-pill source"
                          onClick={() => handleCycleSource(selectedCompany.id, s, dispatch)}
                          title="Click to cycle source (LinkedIn → Naukri → Referral → Direct)"
                        >
                          [ {selectedCompany.source || "LinkedIn"} ]
                        </button>

                        <span className="career-meta-pill stage">
                          [ {getCareerStageBadge(selectedCompany)} ]
                        </span>
                      </div>

                      {/* Interactive 5-Round Progress Checklist */}
                      <div className="career-checklist-section">
                        <div className="career-checklist-head" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                          <svg className="career-sub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <rect width="8" height="4" x="8" y="2" rx="1" />
                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                            <path d="m9 14 2 2 4-4" />
                          </svg>
                          <span>Interactive Progress Checklist</span>
                        </div>

                        <div className="career-rounds-list">
                          {selectedCompany.rounds.map((rnd) => {
                            const isEditingRound = s.editingCareerRoundId === rnd.id;
                            return (
                              <div key={rnd.id} className={`career-round-card is-${rnd.status}`}>
                                <button
                                  type="button"
                                  className="career-round-status-btn"
                                  onClick={() => handleCycleRoundStatus(selectedCompany.id, rnd.id, s, dispatch)}
                                  title="Click to cycle status (Pending → Active → Done)"
                                >
                                  {rnd.status === "done" && (<svg className="rnd-icon done" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>)}
                                  {rnd.status === "active" && (<svg className="rnd-icon active" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.83 6.72 2.24L21 8" /><path d="M21 3v5h-5" /></svg>)}
                                  {rnd.status === "pending" && (<svg className="rnd-icon pending" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="16" height="16" x="4" y="4" rx="2.5" /></svg>)}
                                </button>

                                <div className="career-round-info">
                                  <span className="career-round-name">{rnd.name}</span>

                                  {isEditingRound ? (
                                    <div style={{ display: "flex", gap: "4px", alignItems: "center", width: "100%" }}>
                                      <input
                                        key={`normal-edit-rnd-${rnd.id}`}
                                        className="career-round-subtext-inp"
                                        defaultValue={rnd.subtext}
                                        autoFocus
                                        onClick={(e) => e.stopPropagation()}
                                        onFocus={(e) => {
                                          const val = e.target.value;
                                          e.target.setSelectionRange(val.length, val.length);
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleSaveRoundSubtext(selectedCompany.id, rnd.id, e.target.value, s, dispatch);
                                          } else if (e.key === "Escape") {
                                            e.stopPropagation();
                                            handleStartEditRound(null, s, dispatch);
                                          }
                                        }}
                                      />
                                      <button
                                        type="button"
                                        className="career-edit-btn save"
                                        title="Save (Enter)"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const inp = e.currentTarget.parentElement.querySelector(".career-round-subtext-inp");
                                          handleSaveRoundSubtext(selectedCompany.id, rnd.id, inp ? inp.value : rnd.subtext, s, dispatch);
                                        }}
                                      >✓</button>
                                      <button
                                        type="button"
                                        className="career-edit-btn cancel"
                                        title="Cancel (Esc)"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleStartEditRound(null, s, dispatch);
                                        }}
                                      >×</button>
                                    </div>
                                  ) : (
                                    <div
                                      className="career-round-subtext"
                                      onClick={() => handleStartEditRound(rnd.id, s, dispatch)}
                                      title="Click to edit date/notes"
                                    >
                                      {rnd.subtext || "Click to add notes/date..."}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Bottom Quick Actions Bar */}
                      <div className="career-quick-actions">
                        <span className="quick-actions-label">Quick Actions:</span>

                        {s.editingCareerResume ? (
                          <div style={{ display: "inline-flex", gap: "4px", alignItems: "center" }}>
                            <input
                              className="quick-action-inline-inp"
                              defaultValue={selectedCompany.resume || "Resume.pdf"}
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleSaveResume(selectedCompany.id, e.target.value, s, dispatch);
                                } else if (e.key === "Escape") {
                                  e.stopPropagation();
                                  handleToggleEditResume(false, s, dispatch);
                                }
                              }}
                            />
                            <button
                              type="button"
                              className="career-edit-btn save"
                              title="Save (Enter)"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={(e) => {
                                e.stopPropagation();
                                const inp = e.currentTarget.parentElement.querySelector("input");
                                handleSaveResume(selectedCompany.id, inp ? inp.value : selectedCompany.resume, s, dispatch);
                              }}
                            >✓</button>
                            <button
                              type="button"
                              className="career-edit-btn cancel"
                              title="Cancel (Esc)"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleEditResume(false, s, dispatch);
                              }}
                            >×</button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="career-action-link"
                            onClick={() => handleToggleEditResume(true, s, dispatch)}
                            title="Click to change resume name"
                          >
                            <svg className="career-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>{selectedCompany.resume || "Resume.pdf"}
                          </button>
                        )}

                        <button
                          type="button"
                          className="career-action-link"
                          onClick={() => {
                            const activeRnd = selectedCompany.rounds.find(r => r.status === "active") || selectedCompany.rounds[0];
                            if (activeRnd) handleStartEditRound(activeRnd.id, s, dispatch);
                          }}
                          title="Focus notes for active round"
                        >
                          <svg className="career-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>Notes
                        </button>

                        {s.editingCareerJobUrl ? (
                          <div style={{ display: "inline-flex", gap: "4px", alignItems: "center" }}>
                            <input
                              className="quick-action-inline-inp"
                              defaultValue={selectedCompany.jobUrl || ""}
                              placeholder="Paste Job URL..."
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleSaveJobUrl(selectedCompany.id, e.target.value, s, dispatch);
                                } else if (e.key === "Escape") {
                                  e.stopPropagation();
                                  handleToggleEditJobUrl(false, s, dispatch);
                                }
                              }}
                            />
                            <button
                              type="button"
                              className="career-edit-btn save"
                              title="Save (Enter)"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={(e) => {
                                e.stopPropagation();
                                const inp = e.currentTarget.parentElement.querySelector("input");
                                handleSaveJobUrl(selectedCompany.id, inp ? inp.value : selectedCompany.jobUrl, s, dispatch);
                              }}
                            >✓</button>
                            <button
                              type="button"
                              className="career-edit-btn cancel"
                              title="Cancel (Esc)"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleEditJobUrl(false, s, dispatch);
                              }}
                            >×</button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="career-action-link"
                            onClick={() => {
                              if (selectedCompany.jobUrl) {
                                window.open(selectedCompany.jobUrl, "_blank");
                              } else {
                                handleToggleEditJobUrl(true, s, dispatch);
                              }
                            }}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              handleToggleEditJobUrl(true, s, dispatch);
                            }}
                            title={selectedCompany.jobUrl ? "Click to open URL (Right-click to edit)" : "Click to set Job URL"}
                          >
                            <svg className="career-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>Job URL
                          </button>
                        )}

                        <button
                          type="button"
                          className="career-action-link withdraw"
                          onClick={() => handleWithdrawCompany(selectedCompany.id, s, dispatch)}
                          title="Withdraw application & delete from list"
                        >
                          <svg className="career-action-icon withdraw" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>Withdraw
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="career-detail-empty"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        minHeight: "140px",
                        color: "#777",
                        fontSize: "11px",
                        gap: "8px",
                        textAlign: "center",
                        padding: "20px 10px",
                      }}
                    >
                      <span style={{ color: "#bbb", fontSize: "12px", fontWeight: "600" }}>No Application Selected</span>
                      <span style={{ color: "#666", fontSize: "9.5px" }}>Add your first target company to inspect rounds &amp; checklist.</span>
                      <button
                        type="button"
                        style={{
                          background: "#ef4444",
                          border: "none",
                          color: "#fff",
                          borderRadius: "4px",
                          padding: "4px 12px",
                          cursor: "pointer",
                          fontSize: "10.5px",
                          fontWeight: "600",
                          marginTop: "4px",
                        }}
                        onClick={() => handleToggleAddCareerDrawer(s, dispatch)}
                      >
                        + Add Job Application
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Fullscreen Complete Screen Mode for Learning Progress */}
      {s.learningFullscreen && (
        <div
          className="learning-fullscreen-overlay"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Escape") handleToggleLearningFullscreen(s, dispatch);
          }}
        >
          {/* Top Bar */}
          <div className="learning-fs-topbar">
            <div className="learning-fs-title-wrap">
              <svg className="learning-fs-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
              <h2>
                Learning Progress
                <span className="learning-fs-mode-tag">FULLSCREEN WORKSTATION</span>
              </h2>

              <div className="weekly-tracker" title="7-day consistency pulse (Mon-Sun)" style={{ marginLeft: "14px" }}>
                <span className="weekly-bracket">[</span>
                {["M", "T", "W", "T", "F", "S", "S"].map((dayLetter, dIdx) => {
                  const isToday = dIdx === todayIdx;
                  const isActive = Boolean(learningStreak.week && learningStreak.week[dIdx]);
                  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                  return (
                    <button
                      key={dIdx}
                      type="button"
                      className={`week-day-btn${isActive ? " active" : ""}${isToday ? " is-today" : ""}`}
                      title={`${dayNames[dIdx]}${isToday ? " (Today)" : ""}: ${isActive ? "Completed" : "Pending (Click to log)"}`}
                      onClick={() => handleToggleWeekDay(dIdx, s, dispatch)}
                    >
                      <span className="week-day-letter">{dayLetter}</span>
                      <span className="week-day-dot" />
                    </button>
                  );
                })}
                <span className="weekly-bracket">]</span>
              </div>
              <span className="learning-avg-badge">{avgPct}% Avg</span>
              <span className="learning-streak-badge">🔥 {learningStreak.streak || 2}d Streak</span>
            </div>

            <div className="learning-fs-topbar-actions">
              <button
                type="button"
                className={`learning-fs-btn${showGlobalSyllabus ? " active" : ""}`}
                title="Toggle Global Syllabus Matrix"
                onClick={() => handleToggleGlobalSyllabus(s, dispatch)}
              >
                👁 {showGlobalSyllabus ? "Hide Global Matrix" : "All Courses Matrix"}
              </button>
              <button
                type="button"
                className={`learning-fs-btn${showAddCourse ? " active" : ""}`}
                title="Add New Course"
                onClick={() => handleToggleAddCourse(s, dispatch)}
              >
                + Add Course
              </button>
              <button
                type="button"
                className="learning-fs-close-btn"
                title="Exit Fullscreen Mode (or press Esc)"
                onClick={() => handleToggleLearningFullscreen(s, dispatch)}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7" />
                </svg>
                Exit Fullscreen (Esc)
              </button>
            </div>
          </div>

          {/* Fullscreen Body */}
          {showGlobalSyllabus ? (
            <div className="learning-fs-global-matrix">
              {/* Matrix Control & Stats Hero Banner */}
              <div className="matrix-hero-banner">
                <div className="matrix-hero-info">
                  <div className="matrix-hero-tag">
                    <span className="matrix-hero-tag-icon">✦</span>
                    <span>GLOBAL CURRICULUM ARCHITECTURE MATRIX</span>
                  </div>
                  <h3 className="matrix-hero-title">
                    Master Syllabus & Engineering Pipeline Overview
                  </h3>
                  <p className="matrix-hero-desc">
                    High-level architectural visualization across all {courses.length} engineering modules. Click any module card to enter its interactive deep-dive studio, or toggle individual milestones directly.
                  </p>
                </div>

                <div className="matrix-hero-stats">
                  <div className="matrix-stat-box">
                    <span className="matrix-stat-num">{courses.reduce((acc, c) => acc + (c.completed || 0), 0)}</span>
                    <span className="matrix-stat-lbl">Topics Done</span>
                  </div>
                  <div className="matrix-stat-divider" />
                  <div className="matrix-stat-box">
                    <span className="matrix-stat-num">{courses.reduce((acc, c) => acc + (c.total || c.topics.length || 0), 0)}</span>
                    <span className="matrix-stat-lbl">Total Topics</span>
                  </div>
                  <div className="matrix-stat-divider" />
                  <div className="matrix-stat-box">
                    <span className="matrix-stat-num" style={{ color: "#00f0ff" }}>
                      {courses.length ? Math.round(courses.reduce((acc, c) => acc + (c.completed / (c.total || 1)), 0) / courses.length * 100) : 0}%
                    </span>
                    <span className="matrix-stat-lbl">Avg Mastery</span>
                  </div>
                  <button
                    type="button"
                    className="matrix-return-btn"
                    title="Return to Single Course Studio"
                    onClick={() => handleToggleGlobalSyllabus(s, dispatch)}
                  >
                    <span>←</span> Return to Course Studio
                  </button>
                </div>
              </div>

              {/* Matrix Cards Grid */}
              <div className="matrix-cards-grid">
                {courses.map((course, cIdx) => {
                  const pct = Math.round((course.completed / (course.total || 1)) * 100);
                  const ringColor = getMasteryColor(pct, course.color);
                  const totalSubtopics = course.topics.reduce((acc, t) => acc + (Array.isArray(t.subtopics) ? t.subtopics.length : 0), 0);

                  return (
                    <div key={course.id} className="matrix-course-card">
                      {/* Course Card Header */}
                      <div className="matrix-card-header">
                        <div className="matrix-card-header-top">
                          <div
                            className="course-ring matrix-card-ring"
                            style={{ "--p": `${pct}%`, "--c": ringColor }}
                          >
                            <b>{pct}%</b>
                          </div>
                          <div className="matrix-card-title-wrap">
                            <span className="matrix-card-module-pill">MODULE {cIdx + 1}</span>
                            <h4
                              className="matrix-card-title"
                              title={`Open ${course.title} in Studio`}
                              onClick={() => handleFocusCourse(course.id, s, dispatch)}
                            >
                              {course.title}
                              <span className="matrix-card-arrow">↗</span>
                            </h4>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="matrix-card-progress-wrap">
                          <div className="matrix-card-progress-track">
                            <div
                              className="matrix-card-progress-bar"
                              style={{ width: `${Math.min(100, pct)}%`, background: ringColor }}
                            />
                          </div>
                          <div className="matrix-card-progress-sub">
                            <span>{course.completed} / {course.total} {course.unit} Done</span>
                            <span>{totalSubtopics} Subtopics</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Topics Body */}
                      <div className="matrix-card-topics-list">
                        {course.topics.map((t) => {
                          const subs = Array.isArray(t.subtopics) ? t.subtopics : [];
                          const doneSubs = subs.filter(st => st.done).length;

                          return (
                            <div
                              key={t.id}
                              className={`matrix-topic-item${t.done ? " is-done" : ""}`}
                            >
                              <div
                                className="matrix-topic-header"
                                onClick={() => handleToggleCourseTopic(course.id, t.id, s, dispatch)}
                                title={`Click to toggle completion: ${t.name}`}
                              >
                                <span className={`matrix-topic-check${t.done ? " checked" : ""}`}>
                                  {t.done ? "✓" : "○"}
                                </span>
                                <span className="matrix-topic-name">
                                  {t.name}
                                </span>
                                {subs.length > 0 && (
                                  <span className={`matrix-topic-subs-badge${t.done ? " done" : ""}`}>
                                    {doneSubs}/{subs.length}
                                  </span>
                                )}
                              </div>

                              {/* Subtopics Preview Chips */}
                              {subs.length > 0 && (
                                <div className="matrix-subtopics-cloud">
                                  {subs.slice(0, 4).map((st) => (
                                    <span
                                      key={st.id}
                                      className={`matrix-subtopic-chip${st.done ? " done" : ""}`}
                                      title={st.name}
                                      onClick={() => handleToggleSubtopic(course.id, t.id, st.id, s, dispatch)}
                                    >
                                      {st.done ? "✓ " : "• "}{st.name.replace(/:$/, "")}
                                    </span>
                                  ))}
                                  {subs.length > 4 && (
                                    <span
                                      className="matrix-subtopic-more-chip"
                                      onClick={() => handleFocusCourse(course.id, s, dispatch)}
                                    >
                                      +{subs.length - 4} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Card Footer */}
                      <div className="matrix-card-footer">
                        <button
                          type="button"
                          className="matrix-open-studio-btn"
                          onClick={() => handleFocusCourse(course.id, s, dispatch)}
                        >
                          Launch Course Studio <span>→</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="learning-fs-body">
              {/* Left Sidebar: Course Switcher & Management */}
              <div className="learning-fs-sidebar">
                <div className="learning-fs-sidebar-title">
                  <span>COURSES ({courses.length})</span>
                  <button
                    type="button"
                    className="learning-fs-mini-add-btn"
                    title="Add Course"
                    onClick={() => handleToggleAddCourse(s, dispatch)}
                  >
                    +
                  </button>
                </div>

                {showAddCourse && (
                  <form className="learn-add-form" style={{ marginBottom: "10px" }} onSubmit={(e) => handleAddCourse(e, s, dispatch)}>
                    <div className="learn-add-row">
                      <input className="learn-input" type="text" placeholder="Course Name" maxLength="60" />
                      <input className="learn-input" type="text" placeholder="Unit" maxLength="20" style={{ maxWidth: "70px" }} />
                    </div>
                    <div className="learn-add-row">
                      <input className="learn-input" type="number" placeholder="Total" min="1" max="999" defaultValue="10" style={{ maxWidth: "60px" }} />
                      <input className="learn-input" type="number" placeholder="Done" min="0" max="999" defaultValue="0" style={{ maxWidth: "60px" }} />
                    </div>
                    <div className="learn-add-row">
                      <input className="learn-input" type="text" placeholder="Initial topics / descriptions..." maxLength="100000" style={{ flex: 1 }} />
                    </div>
                    <div className="learn-add-row" style={{ justifyContent: "flex-end" }}>
                      <button type="button" className="learn-form-btn learn-cancel" onClick={() => handleToggleAddCourse(s, dispatch)}>Cancel</button>
                      <button type="submit" className="learn-form-btn learn-submit">+ Add</button>
                    </div>
                  </form>
                )}

                <div className="learning-fs-courses-list">
                  {courses.map((c) => {
                    const pct = Math.round((c.completed / (c.total || 1)) * 100);
                    const ringColor = getMasteryColor(pct, c.color);
                    const isSelected = fsCourse && fsCourse.id === c.id;

                    return (
                      <div
                        key={c.id}
                        className={`learning-fs-course-card${isSelected ? " active" : ""}`}
                        onClick={() => handleFocusCourse(c.id, s, dispatch)}
                      >
                        <div className="course-ring" style={{ "--p": `${pct}%`, "--c": ringColor, width: "44px", height: "44px", fontSize: "12px" }}>
                          <b>{pct}%</b>
                        </div>
                        <div className="learning-fs-course-info">
                          <span
                            className="learning-fs-course-name"
                            style={{ cursor: "pointer" }}
                            title="Double-click to rename"
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              handleFocusCourse(c.id, s, dispatch);
                              handleToggleEditCourse(c.id, s, dispatch);
                            }}
                          >
                            {c.title}
                          </span>
                          <span className="learning-fs-course-sub">
                            {c.completed} / {c.total} {c.unit} · {c.topics.length} Topics
                          </span>
                        </div>
                        <div className="learning-fs-course-actions" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            className="course-tool-btn"
                            title={`Rename ${c.title}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFocusCourse(c.id, s, dispatch);
                              handleToggleEditCourse(c.id, s, dispatch);
                            }}
                          >
                            ✎
                          </button>
                          <button
                            type="button"
                            className="course-tool-btn"
                            title="Decrement"
                            onClick={() => handleDecrementCourse(c.id, s, dispatch)}
                          >
                            -
                          </button>
                          <button
                            type="button"
                            className="course-tool-btn"
                            title="Increment"
                            onClick={() => handleIncrementCourse(c.id, s, dispatch)}
                          >
                            +
                          </button>
                          <button
                            type="button"
                            className="course-tool-btn"
                            title={`Remove ${c.title}`}
                            onClick={() => handleRemoveCourse(c.id, s, dispatch)}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Main Pane: Deep Syllabus & 30k+ Description Studio */}
              {fsCourse ? (
                <div className="learning-fs-main">
                  {/* Hero Header for Selected Course */}
                  <div className="learning-fs-course-hero">
                    {(() => {
                      const pct = Math.round((fsCourse.completed / (fsCourse.total || 1)) * 100);
                      const ringColor = getMasteryColor(pct, fsCourse.color);
                      return (
                        <div className="course-ring large" style={{ "--p": `${pct}%`, "--c": ringColor, width: "66px", height: "66px", fontSize: "16px" }}>
                          <b>{pct}%</b>
                        </div>
                      );
                    })()}

                    <div className="focused-course-details" style={{ flex: 1 }}>
                      {s.editingCourseId === fsCourse.id ? (
                        <div className="focused-course-title-row is-editing">
                          <input
                            key={`fs-edit-course-${fsCourse.id}`}
                            className="course-inline-edit-input"
                            defaultValue={fsCourse.title}
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                            onFocus={(e) => {
                              const val = e.target.value;
                              e.target.setSelectionRange(val.length, val.length);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                e.stopPropagation();
                                handleSaveCourseTitle(fsCourse.id, e.target.value, s, dispatch);
                              } else if (e.key === "Escape") {
                                e.stopPropagation();
                                handleToggleEditCourse(fsCourse.id, s, dispatch);
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="course-edit-title-btn save"
                            title="Save (Enter)"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={(e) => {
                              e.stopPropagation();
                              const inp = e.currentTarget.closest(".focused-course-title-row").querySelector(".course-inline-edit-input");
                              handleSaveCourseTitle(fsCourse.id, inp ? inp.value : fsCourse.title, s, dispatch);
                            }}
                          >
                            ✓
                          </button>
                          <button
                            type="button"
                            className="course-edit-title-btn cancel"
                            title="Cancel (Esc)"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleEditCourse(fsCourse.id, s, dispatch);
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="focused-course-title-row">
                          <h3
                            style={{ margin: 0, fontSize: "22px", fontWeight: "750", color: "#f6f6fa", cursor: "pointer" }}
                            title="Double-click to rename"
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              handleToggleEditCourse(fsCourse.id, s, dispatch);
                            }}
                          >
                            {fsCourse.title}
                          </h3>
                          <button
                            type="button"
                            className="course-edit-title-btn"
                            title="Rename course"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleEditCourse(fsCourse.id, s, dispatch);
                            }}
                          >
                            ✎
                          </button>
                        </div>
                      )}
                      <span className="focused-course-stats" style={{ fontSize: "13.5px", marginTop: "4px" }}>
                        {fsCourse.completed} / {fsCourse.total} {fsCourse.unit} Completed ({Math.round((fsCourse.completed / (fsCourse.total || 1)) * 100)}%) · {fsCourse.topics.filter((t) => t.done).length} / {fsCourse.topics.length} Topics Done
                      </span>
                    </div>

                    <div className="course-actions">
                      <button
                        type="button"
                        className="course-tool-btn"
                        title="Decrement completed"
                        onClick={() => handleDecrementCourse(fsCourse.id, s, dispatch)}
                      >
                        -
                      </button>
                      <button
                        type="button"
                        className="course-tool-btn"
                        title="Increment completed"
                        onClick={() => handleIncrementCourse(fsCourse.id, s, dispatch)}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="course-tool-btn"
                        title={`Remove ${fsCourse.title}`}
                        onClick={() => handleRemoveCourse(fsCourse.id, s, dispatch)}
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {/* Add Main Topic Form */}
                  <form
                    className="focused-add-topic-form"
                    style={{ margin: "14px 0", padding: "10px 14px", background: "rgba(8,186,255,0.04)", borderRadius: "7px", border: "1px solid rgba(8,186,255,0.2)" }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      const inp = e.target.elements[0];
                      if (inp && inp.value.trim()) {
                        handleAddTopic(fsCourse.id, inp.value.trim(), s, dispatch);
                        inp.value = "";
                      }
                    }}
                  >
                    <input
                      className="focused-topic-input"
                      type="text"
                      placeholder="+ Add new main topic / description content (30k+ chars)..."
                      maxLength="100000"
                      style={{ height: "38px", fontSize: "13.5px", padding: "6px 12px" }}
                    />
                    <button type="submit" className="focused-topic-submit" style={{ height: "38px", padding: "0 18px", fontSize: "13px" }}>+ Add Topic</button>
                  </form>

                  {/* Complete Syllabus Topics List with Full Depth */}
                  <div className="focused-syllabus-header" style={{ marginBottom: "10px" }}>
                    <h5 style={{ fontSize: "15px" }}>
                      Complete Syllabus ({fsCourse.topics.filter((t) => t.done).length} / {fsCourse.topics.length} Topics Done)
                    </h5>
                    <span className="focused-syllabus-hint" style={{ fontSize: "12.5px" }}>
                      Click topic to toggle · Double-click or ✎ to edit · ▾ to expand subtopics (30k+ chars supported)
                    </span>
                  </div>

                  <div className="focused-topics-grid learning-fs-topics-grid">
                    {fsCourse.topics.map((top, tIdx) => {
                      const subs = Array.isArray(top.subtopics) ? top.subtopics : [];
                      const hasSubs = subs.length > 0;
                      const subsDoneCount = subs.filter((st) => st.done).length;

                      return (
                        <div key={top.id} className={`focused-topic-card${top.done ? " is-done" : ""} learning-fs-card`}>
                          {s.editingTopicId === top.id ? (
                            <div className="focused-topic-main-row is-editing">
                              <span className="topic-num">{tIdx + 1}.</span>
                              <textarea
                                key={`fs-edit-top-${top.id}`}
                                className="topic-inline-edit-input"
                                defaultValue={top.name}
                                maxLength="100000"
                                autoFocus
                                style={{ minHeight: "65px", maxHeight: "250px", fontSize: "14px" }}
                                onClick={(e) => e.stopPropagation()}
                                onFocus={(e) => { const val = e.target.value; e.target.setSelectionRange(val.length, val.length); }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleSaveTopicName(fsCourse ? fsCourse.id : null, top.id, e.target.value, s, dispatch);
                                  } else if (e.key === "Escape") {
                                    e.stopPropagation();
                                    handleToggleEditTopic(top.id, s, dispatch);
                                  }
                                }}
                              />
                              <div className="focused-topic-actions">
                                <button
                                  type="button"
                                  className="topic-action-btn save"
                                  title="Save topic name (Enter)"
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={(e) => {
                                    const inp = e.currentTarget.closest(".focused-topic-main-row").querySelector(".topic-inline-edit-input");
                                    handleSaveTopicName(fsCourse ? fsCourse.id : null, top.id, inp ? inp.value : top.name, s, dispatch);
                                  }}
                                >
                                  ✓
                                </button>
                                <button
                                  type="button"
                                  className="topic-action-btn cancel"
                                  title="Cancel (Esc)"
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={() => handleToggleEditTopic(top.id, s, dispatch)}
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="focused-topic-main-row">
                              {hasSubs ? (
                                <button
                                  type="button"
                                  className="topic-expand-btn"
                                  title={top.expanded ? "Collapse / Hide subtopics" : "Expand subtopics"}
                                  onClick={() => handleToggleTopicExpand(fsCourse.id, top.id, s, dispatch)}
                                >
                                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" style={{ transform: top.expanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s ease", display: "block" }}>
                                    <polyline points="9 18 15 12 9 6" />
                                  </svg>
                                </button>
                              ) : (
                                <span className="topic-bullet">•</span>
                              )}

                              <button
                                type="button"
                                className="focused-topic-toggle"
                                title={`Toggle ${top.name}`}
                                onClick={() => handleToggleCourseTopic(fsCourse.id, top.id, s, dispatch)}
                              >
                                <span className={`topic-icon${top.done ? " is-done" : ""}`}>
                                  {top.done ? (
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#00e6a0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                  ) : (
                                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#ffaa00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                      <circle cx="12" cy="12" r="6" />
                                    </svg>
                                  )}
                                </span>
                                <span className="topic-num">{tIdx + 1}.</span>
                                <span
                                  className="topic-text"
                                  style={{ fontSize: "15px", maxHeight: "none" }}
                                  onDoubleClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleEditTopic(top.id, s, dispatch);
                                  }}
                                >
                                  {top.name}
                                </span>
                                {hasSubs && <span className="topic-sub-counter">({subsDoneCount}/{subs.length})</span>}
                              </button>

                              <div className="focused-topic-actions">
                                <button
                                  type="button"
                                  className="topic-action-btn add"
                                  title={`Add subtopic to ${top.name}`}
                                  onClick={() => handleAddSubtopicPrompt(fsCourse.id, top.id, s, dispatch)}
                                >
                                  +
                                </button>
                                <button
                                  type="button"
                                  className="topic-action-btn edit"
                                  title={`Rename ${top.name}`}
                                  onClick={() => handleToggleEditTopic(top.id, s, dispatch)}
                                >
                                  ✎
                                </button>
                                <button
                                  type="button"
                                  className="topic-action-btn del"
                                  title={`Delete ${top.name}`}
                                  onClick={() => handleRemoveSubTopic(fsCourse.id, top.id, s, dispatch)}
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Nested Subtopics */}
                          {top.expanded && (
                            <div className="topic-subtopics-list" style={{ marginLeft: "14px", paddingLeft: "14px" }}>
                              {subs.map((sub) => {
                                const subChildren = Array.isArray(sub.subtopics) ? sub.subtopics : [];
                                const hasSubChildren = subChildren.length > 0;
                                const subChildrenDoneCount = subChildren.filter((sst) => sst.done).length;

                                return (
                                  <div key={sub.id} className="subtopic-card-wrap">
                                    {s.editingSubtopicId === sub.id ? (
                                      <div className="subtopic-item is-editing">
                                        <span className={`subtopic-icon${sub.done ? " is-done" : ""}`}>
                                            {sub.done ? (
                                              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#00e6a0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                <polyline points="20 6 9 17 4 12" />
                                              </svg>
                                            ) : (
                                              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#ffaa00" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                <circle cx="12" cy="12" r="5" />
                                              </svg>
                                            )}
                                          </span>
                                        <textarea
                                          key={`fs-edit-sub-${sub.id}`}
                                          className="subtopic-inline-edit-input"
                                          defaultValue={sub.name}
                                          maxLength="100000"
                                          autoFocus
                                          style={{ minHeight: "55px", maxHeight: "200px", fontSize: "13.5px" }}
                                          onClick={(e) => e.stopPropagation()}
                                          onFocus={(e) => { const val = e.target.value; e.target.setSelectionRange(val.length, val.length); }}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              handleSaveSubtopicName(fsCourse ? fsCourse.id : null, top.id, sub.id, e.target.value, s, dispatch);
                                            } else if (e.key === "Escape") {
                                              e.stopPropagation();
                                              handleToggleEditSubtopic(sub.id, s, dispatch);
                                            }
                                          }}
                                        />
                                        <div className="subtopic-actions">
                                          <button
                                            type="button"
                                            className="subtopic-btn save"
                                            title="Save subtopic (Enter)"
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              const inp = e.currentTarget.closest(".subtopic-item").querySelector(".subtopic-inline-edit-input");
                                              handleSaveSubtopicName(fsCourse ? fsCourse.id : null, top.id, sub.id, inp ? inp.value : sub.name, s, dispatch);
                                            }}
                                          >
                                            ✓
                                          </button>
                                          <button
                                            type="button"
                                            className="subtopic-btn cancel"
                                            title="Cancel (Esc)"
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleToggleEditSubtopic(sub.id, s, dispatch);
                                            }}
                                          >
                                            ×
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className={`subtopic-item${sub.done ? " is-done" : ""}`}>
                                        {hasSubChildren ? (
                                          <button
                                            type="button"
                                            className="subtopic-expand-btn"
                                            title={sub.expanded ? "Collapse / Hide nested subtopics" : "Expand nested subtopics"}
                                            onClick={() => handleToggleSubtopicExpand(fsCourse.id, top.id, sub.id, s, dispatch)}
                                          >
                                            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" style={{ transform: sub.expanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s ease", display: "block" }}>
                                              <polyline points="9 18 15 12 9 6" />
                                            </svg>
                                          </button>
                                        ) : (
                                          <span className="subtopic-bullet">•</span>
                                        )}

                                        <button
                                          type="button"
                                          className="subtopic-toggle"
                                          title={`Toggle ${sub.name}`}
                                          onClick={() => handleToggleSubtopic(fsCourse.id, top.id, sub.id, s, dispatch)}
                                        >
                                          <span className="subtopic-icon">{sub.done ? "✓" : "⟳"}</span>
                                          <span
                                            className="subtopic-name"
                                            style={{ fontSize: "13.5px", maxHeight: "none" }}
                                            onDoubleClick={(e) => {
                                              e.stopPropagation();
                                              handleToggleEditSubtopic(sub.id, s, dispatch);
                                            }}
                                          >
                                            {sub.name}
                                          </span>
                                          {hasSubChildren && (
                                            <span className="subtopic-counter">({subChildrenDoneCount}/{subChildren.length})</span>
                                          )}
                                        </button>

                                        <div className="subtopic-actions">
                                          <button
                                            type="button"
                                            className="subtopic-btn add"
                                            title={`Add nested sub-topic / note to ${sub.name}`}
                                            onClick={() => handleAddSubSubtopicPrompt(fsCourse.id, top.id, sub.id, s, dispatch)}
                                          >
                                            +
                                          </button>
                                          <button
                                            type="button"
                                            className="subtopic-btn edit"
                                            title={`Rename ${sub.name}`}
                                            onClick={() => handleToggleEditSubtopic(sub.id, s, dispatch)}
                                          >
                                            ✎
                                          </button>
                                          <button
                                            type="button"
                                            className="subtopic-btn del"
                                            title={`Delete ${sub.name}`}
                                            onClick={() => handleRemoveSubtopic(fsCourse.id, top.id, sub.id, s, dispatch)}
                                          >
                                            ×
                                          </button>
                                        </div>
                                      </div>
                                    )}

                                    {/* Level 3: Nested Sub-Subtopics */}
                                    {sub.expanded && (
                                      <div className="subsubtopics-list" style={{ marginLeft: "12px", paddingLeft: "12px" }}>
                                        {subChildren.map((sst) => (
                                          s.editingSubSubtopicId === sst.id ? (
                                            <div key={sst.id} className="subsubtopic-item is-editing">
                                              <span className="subsubtopic-icon">{sst.done ? "✓" : "⟳"}</span>
                                              <textarea
                                                key={`fs-edit-sst-${sst.id}`}
                                                className="subsubtopic-inline-edit-input"
                                                defaultValue={sst.name}
                                                maxLength="100000"
                                                autoFocus
                                                style={{ minHeight: "45px", maxHeight: "180px", fontSize: "10.5px" }}
                                                onClick={(e) => e.stopPropagation()}
                                                onFocus={(e) => { const val = e.target.value; e.target.setSelectionRange(val.length, val.length); }}
                                                onKeyDown={(e) => {
                                                  if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleSaveSubSubtopicName(fsCourse ? fsCourse.id : null, top.id, sub.id, sst.id, e.target.value, s, dispatch);
                                                  } else if (e.key === "Escape") {
                                                    e.stopPropagation();
                                                    handleToggleEditSubSubtopic(sst.id, s, dispatch);
                                                  }
                                                }}
                                              />
                                              <div className="subsubtopic-actions">
                                                <button
                                                  type="button"
                                                  className="subsubtopic-btn save"
                                                  title="Save"
                                                  onMouseDown={(e) => e.preventDefault()}
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    const inp = e.currentTarget.closest(".subsubtopic-item").querySelector(".subsubtopic-inline-edit-input");
                                                    handleSaveSubSubtopicName(fsCourse ? fsCourse.id : null, top.id, sub.id, sst.id, inp ? inp.value : sst.name, s, dispatch);
                                                  }}
                                                >
                                                  ✓
                                                </button>
                                                <button
                                                  type="button"
                                                  className="subsubtopic-btn cancel"
                                                  title="Cancel"
                                                  onMouseDown={(e) => e.preventDefault()}
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleEditSubSubtopic(sst.id, s, dispatch);
                                                  }}
                                                >
                                                  ×
                                                </button>
                                              </div>
                                            </div>
                                          ) : (
                                            <div key={sst.id} className={`subsubtopic-item${sst.done ? " is-done" : ""}`}>
                                              <button
                                                type="button"
                                                className="subsubtopic-toggle"
                                                title={`Toggle ${sst.name}`}
                                                onClick={() => handleToggleSubSubtopic(fsCourse.id, top.id, sub.id, sst.id, s, dispatch)}
                                              >
                                                <span className={`subsubtopic-icon${sst.done ? " is-done" : ""}`}>
                                                  {sst.done ? (
                                                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#00e6a0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                      <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                  ) : (
                                                    <svg viewBox="0 0 24 24" width="13" height="13" fill="#ffaa00" stroke="#ffaa00" strokeWidth="2" aria-hidden="true">
                                                      <circle cx="12" cy="12" r="5" />
                                                    </svg>
                                                  )}
                                                </span>
                                                <span
                                                  className="subsubtopic-name"
                                                  style={{ fontSize: "13px", maxHeight: "none" }}
                                                  onDoubleClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleEditSubSubtopic(sst.id, s, dispatch);
                                                  }}
                                                >
                                                  {sst.name}
                                                </span>
                                              </button>
                                              <div className="subsubtopic-actions">
                                                <button
                                                  type="button"
                                                  className="subsubtopic-btn edit"
                                                  title={`Rename ${sst.name}`}
                                                  onClick={() => handleToggleEditSubSubtopic(sst.id, s, dispatch)}
                                                >
                                                  ✎
                                                </button>
                                                <button
                                                  type="button"
                                                  className="subsubtopic-btn del"
                                                  title={`Delete ${sst.name}`}
                                                  onClick={() => handleRemoveSubSubtopic(fsCourse.id, top.id, sub.id, sst.id, s, dispatch)}
                                                >
                                                  ×
                                                </button>
                                              </div>
                                            </div>
                                          )
                                        ))}

                                        {/* Quick Add Sub-subtopic in Fullscreen */}
                                        <form
                                          className="subsubtopic-quick-add"
                                          data-subtopic-form={sub.id}
                                          style={{ marginTop: "4px" }}
                                          onSubmit={(e) => handleAddSubSubtopic(e, fsCourse.id, top.id, sub.id, s, dispatch)}
                                        >
                                          <input
                                            className="subsubtopic-add-input"
                                            data-subtopic-input={sub.id}
                                            type="text"
                                            placeholder="+ Add nested sub-topic / note (30k+ chars)..."
                                            maxLength="100000"
                                            style={{ height: "30px", fontSize: "12px" }}
                                          />
                                          <button
                                            type="submit"
                                            className="subsubtopic-add-btn"
                                            style={{ height: "30px", padding: "0 12px", fontSize: "12px" }}
                                          >
                                            + Add
                                          </button>
                                        </form>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}

                              {/* Quick Add Subtopic in Fullscreen */}
                              <form
                                className="subtopic-quick-add"
                                data-topic-form={top.id}
                                style={{ marginTop: "6px" }}
                                onSubmit={(e) => handleAddSubtopic(e, fsCourse.id, top.id, s, dispatch)}
                              >
                                <input
                                  className="subtopic-add-input"
                                  type="text"
                                  placeholder="+ Add subtopic / description (30k+ chars)..."
                                  maxLength="100000"
                                  style={{ height: "32px", fontSize: "12.5px" }}
                                />
                                <button
                                  type="submit"
                                  className="subtopic-add-btn"
                                  style={{ height: "32px", padding: "0 14px", fontSize: "12.5px" }}
                                >
                                  + Add
                                </button>
                              </form>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="learning-fs-main" style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#8e99ad" }}>
                  <span>No course selected. Select a course from the left sidebar to inspect and edit its deep syllabus.</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Fullscreen Complete Screen Mode for Project Tracker */}
      {projectFullscreen && (
        <div
          className="projects-fullscreen-overlay"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Escape") handleToggleProjectFullscreen(s, dispatch);
          }}
        >
          {/* Top Bar */}
          <div className="projects-fs-topbar">
            <div className="projects-fs-title-wrap">
              <svg className="projects-fs-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M8 7v7" />
                <path d="M12 7v4" />
                <path d="M16 7v9" />
              </svg>
              <h2>
                Project Tracker
                <span className="projects-fs-mode-tag">FULLSCREEN WORKSTATION</span>
              </h2>
              <span className="projects-fs-stats-badge">{activeProjectsCount} Active · {shippedProjectsCount} Shipped</span>
            </div>

            <div className="projects-fs-topbar-actions">
              <button
                type="button"
                className={`projects-fs-btn${showGlobalProjectsMatrix ? " active" : ""}`}
                title="Toggle All Projects Architecture Matrix"
                onClick={() => handleToggleGlobalProjectsMatrix(s, dispatch)}
              >
                👁 {showGlobalProjectsMatrix ? "Hide Matrix" : "All Projects Matrix"}
              </button>
              <button
                type="button"
                className={`projects-fs-btn${showAddProject ? " active" : ""}`}
                title="Add New Project"
                onClick={() => handleToggleAddProjectForm(s, dispatch)}
              >
                + Add Project
              </button>
              <button
                type="button"
                className="projects-fs-close-btn"
                title="Exit Fullscreen Mode (or press Esc)"
                onClick={() => handleToggleProjectFullscreen(s, dispatch)}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7" />
                </svg>
                Exit Fullscreen (Esc)
              </button>
            </div>
          </div>

          {showGlobalProjectsMatrix ? (
            <div className="projects-fs-global-matrix">
              {/* Matrix Control & Stats Hero Banner */}
              <div className="matrix-hero-banner">
                <div className="matrix-hero-info">
                  <div className="matrix-hero-tag" style={{ borderColor: "rgba(255, 170, 0, 0.4)", color: "#ffaa00", background: "rgba(255, 170, 0, 0.12)" }}>
                    <span className="matrix-hero-tag-icon" style={{ color: "#ffaa00", textShadow: "0 0 8px rgba(255, 170, 0, 0.8)" }}>✦</span>
                    <span>GLOBAL PROJECTS ARCHITECTURE MATRIX</span>
                  </div>
                  <h3 className="matrix-hero-title">
                    All Projects &amp; SDLC Verification Pipelines Overview
                  </h3>
                  <p className="matrix-hero-desc">
                    Comprehensive cross-project architectural dashboard across all {projects.length} engineering applications. Monitor SDLC gate verification velocity, stack alignment, and multi-project deliverables.
                  </p>
                </div>

                <div className="matrix-hero-stats">
                  <div className="matrix-stat-box">
                    <span className="matrix-stat-num" style={{ color: "#ffaa00" }}>{activeProjectsCount}</span>
                    <span className="matrix-stat-lbl">Active Projects</span>
                  </div>
                  <div className="matrix-stat-divider" />
                  <div className="matrix-stat-box">
                    <span className="matrix-stat-num" style={{ color: "#00e6a0" }}>{shippedProjectsCount}</span>
                    <span className="matrix-stat-lbl">Shipped</span>
                  </div>
                  <div className="matrix-stat-divider" />
                  <div className="matrix-stat-box">
                    <span className="matrix-stat-num" style={{ color: "#08baff" }}>
                      {projects.reduce((acc, p) => acc + (p.gates || []).filter(Boolean).length, 0)} / {projects.length * 8}
                    </span>
                    <span className="matrix-stat-lbl">Gates Passed</span>
                  </div>
                  <div className="matrix-stat-divider" />
                  <div className="matrix-stat-box">
                    <span className="matrix-stat-num" style={{ color: "#00f0ff" }}>
                      {projects.length ? Math.round(projects.reduce((acc, p) => acc + (p.gates || []).filter(Boolean).length / 8, 0) / projects.length * 100) : 0}%
                    </span>
                    <span className="matrix-stat-lbl">SDLC Velocity</span>
                  </div>
                  <button
                    type="button"
                    className="matrix-return-btn"
                    style={{ borderColor: "rgba(255, 170, 0, 0.5)", color: "#ffaa00", background: "rgba(255, 170, 0, 0.14)" }}
                    title="Return to Single Project Studio"
                    onClick={() => handleToggleGlobalProjectsMatrix(s, dispatch)}
                  >
                    <span>←</span> Return to Project Studio
                  </button>
                </div>
              </div>

              {/* Projects Matrix Cards Grid */}
              <div className="matrix-cards-grid">
                {projects.map((proj, pIdx) => {
                  const passedCount = (proj.gates || []).filter(Boolean).length;
                  const pct = Math.round((passedCount / 8) * 100);
                  const badge = getStageBadge(passedCount, 8);
                  const activeSegments = passedCount * 3;
                  const isShipped = passedCount === 8;

                  return (
                    <div key={proj.id} className="matrix-course-card" style={{ borderColor: isShipped ? "rgba(0, 230, 160, 0.4)" : "rgba(255, 255, 255, 0.08)" }}>
                      <div className="matrix-card-header">
                        <div className="matrix-card-header-top">
                          <div className="projects-fs-progress-pill" style={{ color: badge.color, borderColor: badge.border, fontSize: "12px", width: "46px", height: "46px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", background: badge.bg }}>
                            {pct}%
                          </div>
                          <div className="matrix-card-title-wrap">
                            <span className="matrix-card-module-pill" style={{ color: badge.color, background: badge.bg }}>
                              PROJECT {pIdx + 1} · {badge.text}
                            </span>
                            <h4
                              className="matrix-card-title"
                              title={`Open ${proj.name} in Studio`}
                              onClick={() => {
                                handleSelectProject(proj.id, s, dispatch);
                                handleToggleGlobalProjectsMatrix(s, dispatch);
                              }}
                            >
                              {proj.name}
                              <span className="matrix-card-arrow">↗</span>
                            </h4>
                            {proj.stack && (
                              <span style={{ fontSize: "11px", color: "#8e99ad", display: "block", marginTop: "2px" }}>
                                {proj.stack}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* 24-Segment Mini Bar */}
                        <div className="projects-fs-segments-bar" style={{ marginTop: "4px" }}>
                          {Array.from({ length: 24 }).map((_, segIdx) => (
                            <div
                              key={segIdx}
                              className={`projects-fs-seg ${segIdx < activeSegments ? (isShipped ? "active-complete" : "active") : ""}`}
                              style={{ height: "4px" }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* 8 SDLC Mini Gates Grid */}
                      <div style={{ padding: "12px 14px", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px", flex: 1 }}>
                        {DEFAULT_SDLC_GATES.map((gLabel, gIdx) => {
                          const isGatePassed = Boolean(proj.gates && proj.gates[gIdx]);
                          const gTasks = (proj.gateTasks && proj.gateTasks[gIdx]) || [];
                          const doneTasksCount = gTasks.filter((t) => t.done).length;

                          return (
                            <div
                              key={gIdx}
                              style={{
                                background: isGatePassed ? "rgba(0, 230, 160, 0.05)" : "rgba(255, 255, 255, 0.02)",
                                border: `1px solid ${isGatePassed ? "rgba(0, 230, 160, 0.3)" : "rgba(255, 255, 255, 0.06)"}`,
                                borderRadius: "6px",
                                padding: "6px 8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                              }}
                              title={`Click to toggle Gate ${gIdx + 1}: ${gLabel}`}
                              onClick={() => handleToggleGate(proj.id, gIdx, s, dispatch)}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: 0 }}>
                                <span style={{ color: isGatePassed ? "#00e6a0" : "#64748b", fontWeight: "700", fontSize: "11px" }}>
                                  {isGatePassed ? "✓" : "○"}
                                </span>
                                <span style={{ fontSize: "11px", fontWeight: "600", color: isGatePassed ? "#f1f5f9" : "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                  {gLabel}
                                </span>
                              </div>
                              {gTasks.length > 0 && (
                                <span style={{ fontSize: "9.5px", fontWeight: "700", color: isGatePassed ? "#00e6a0" : "#64748b", background: "rgba(255,255,255,0.05)", padding: "1px 4px", borderRadius: "3px", flexShrink: 0 }}>
                                  {doneTasksCount}/{gTasks.length}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Card Footer */}
                      <div className="matrix-card-footer">
                        <button
                          type="button"
                          className="matrix-open-studio-btn"
                          style={{ borderColor: "rgba(255, 170, 0, 0.3)", color: "#ffaa00", background: "rgba(255, 170, 0, 0.08)" }}
                          onClick={() => {
                            handleSelectProject(proj.id, s, dispatch);
                            handleToggleGlobalProjectsMatrix(s, dispatch);
                          }}
                        >
                          Launch Project Studio <span>→</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
          <div className="projects-fs-body">
            {/* Left Sidebar: Projects List & Quick Switcher */}
            <div className="projects-fs-sidebar">
              <div className="projects-fs-sidebar-title">
                <span>PROJECTS ({projects.length})</span>
                <button
                  type="button"
                  className="projects-fs-mini-add-btn"
                  title="Add Project"
                  onClick={() => handleToggleAddProjectForm(s, dispatch)}
                >
                  +
                </button>
              </div>

              {showAddProject && (
                <form className="proj-add-form" style={{ marginBottom: "12px", background: "rgba(255,170,0,0.06)", border: "1px solid rgba(255,170,0,0.3)", padding: "10px", borderRadius: "8px" }} onSubmit={(e) => handleAddProject(e, s, dispatch)}>
                  <div className="proj-add-row" style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    <input className="proj-name-input" type="text" placeholder="Project name (e.g. Distributed Task Queue)" maxLength="80" autoFocus style={{ flex: 1, height: "32px", fontSize: "12.5px" }} />
                    <input className="proj-stack-input" type="text" placeholder="Tech stack (e.g. Java · Kafka)" maxLength="60" style={{ width: "120px", height: "32px", fontSize: "12px" }} />
                  </div>
                  <div className="proj-add-row" style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                    <button type="button" className="proj-form-btn proj-cancel" onClick={() => handleToggleAddProjectForm(s, dispatch)}>Cancel</button>
                    <button type="submit" className="proj-form-btn proj-submit" style={{ background: "#ffaa00", color: "#000", fontWeight: "700" }}>+ Add</button>
                  </div>
                </form>
              )}

              <div className="projects-fs-list">
                {projects.length === 0 ? (
                  <div className="projects-fs-empty-sidebar">
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#ffaa00" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M8 7v7M12 7v4M16 7v9" />
                    </svg>
                    <span>No projects tracked</span>
                    <button
                      type="button"
                      className="projects-fs-empty-btn"
                      onClick={() => handleToggleAddProjectForm(s, dispatch)}
                    >
                      + Add First Project
                    </button>
                  </div>
                ) : (
                  projects.map((proj) => {
                    const passedCount = (proj.gates || []).filter(Boolean).length;
                    const pct = Math.round((passedCount / 8) * 100);
                    const isSelected = selectedProject && selectedProject.id === proj.id;
                    const badge = getStageBadge(passedCount, 8);
                    const isShipped = passedCount === 8;

                    return (
                      <div
                        key={proj.id}
                        className={`projects-fs-card${isSelected ? " active" : ""}${isShipped ? " shipped" : ""}`}
                        onClick={() => handleSelectProject(proj.id, s, dispatch)}
                      >
                        <div className="projects-fs-card-left">
                          <div className="projects-fs-progress-pill" style={{ color: badge.color, borderColor: badge.border }}>
                            {pct}%
                          </div>
                          <div className="projects-fs-card-info">
                            <span
                              className="projects-fs-card-name"
                              title="Double-click to rename"
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                handleSelectProject(proj.id, s, dispatch);
                                handleToggleEditProject(proj.id, s, dispatch);
                              }}
                            >
                              {proj.name}
                            </span>
                            <div className="projects-fs-card-meta">
                              {proj.stack && <span className="projects-fs-card-stack">{proj.stack}</span>}
                              <span className="projects-fs-card-gates">{passedCount} / 8 Gates Passed</span>
                            </div>
                          </div>
                        </div>
                        <div className="projects-fs-card-actions" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            className="proj-tool-btn"
                            title="Rename project"
                            onClick={() => {
                              handleSelectProject(proj.id, s, dispatch);
                              handleToggleEditProject(proj.id, s, dispatch);
                            }}
                          >
                            ✎
                          </button>
                          <button
                            type="button"
                            className="proj-tool-btn"
                            title="Decrement gate"
                            onClick={() => handleDecrementGate(proj.id, s, dispatch)}
                          >
                            -
                          </button>
                          <button
                            type="button"
                            className="proj-tool-btn"
                            title="Increment gate"
                            onClick={() => handleIncrementGate(proj.id, s, dispatch)}
                          >
                            +
                          </button>
                          <button
                            type="button"
                            className="proj-tool-btn"
                            title={`Delete ${proj.name}`}
                            onClick={() => handleRemoveProject(proj.id, s, dispatch)}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Main Studio: Deep SDLC 8-Gate Pipeline */}
            {selectedProject ? (
              <div className="projects-fs-main">
                {/* Selected Project Hero */}
                {(() => {
                  const passedCount = (selectedProject.gates || []).filter(Boolean).length;
                  const pct = Math.round((passedCount / 8) * 100);
                  const badge = getStageBadge(passedCount, 8);
                  const isShipped = passedCount === 8;
                  const activeSegments = passedCount * 3;

                  return (
                    <div className="projects-fs-hero">
                      <div className="projects-fs-hero-top">
                        <div className="projects-fs-hero-details" style={{ flex: 1 }}>
                          {s.editingProjectId === selectedProject.id ? (
                            <div className="projects-inline-edit-row">
                              <input
                                key={`fs-edit-proj-${selectedProject.id}`}
                                className="projects-inline-edit-input"
                                defaultValue={`${selectedProject.name}${selectedProject.stack ? ` · ${selectedProject.stack}` : ""}`}
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                                onFocus={(e) => {
                                  const val = e.target.value;
                                  e.target.setSelectionRange(val.length, val.length);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const val = e.target.value.trim();
                                    let name = val;
                                    let stack = selectedProject.stack || "";
                                    if (val.includes("·")) {
                                      const p = val.split("·");
                                      name = p[0].trim();
                                      stack = p.slice(1).join("·").trim();
                                    }
                                    handleSaveProjectDetails(selectedProject.id, name, stack, s, dispatch);
                                  } else if (e.key === "Escape") {
                                    e.stopPropagation();
                                    handleToggleEditProject(selectedProject.id, s, dispatch);
                                  }
                                }}
                              />
                              <button
                                type="button"
                                className="projects-edit-btn save"
                                title="Save (Enter)"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const inp = e.currentTarget.closest(".projects-inline-edit-row").querySelector(".projects-inline-edit-input");
                                  const val = inp ? inp.value.trim() : selectedProject.name;
                                  let name = val;
                                  let stack = selectedProject.stack || "";
                                  if (val.includes("·")) {
                                    const p = val.split("·");
                                    name = p[0].trim();
                                    stack = p.slice(1).join("·").trim();
                                  }
                                  handleSaveProjectDetails(selectedProject.id, name, stack, s, dispatch);
                                }}
                              >
                                ✓
                              </button>
                              <button
                                type="button"
                                className="projects-edit-btn cancel"
                                title="Cancel (Esc)"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleEditProject(selectedProject.id, s, dispatch);
                                }}
                              >
                                ×
                              </button>
                            </div>
                          ) : (
                            <div className="projects-hero-title-row">
                              <h3
                                style={{ margin: 0, fontSize: "22px", fontWeight: "750", color: "#f6f6fa", cursor: "pointer" }}
                                title="Double-click to rename"
                                onDoubleClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleEditProject(selectedProject.id, s, dispatch);
                                }}
                              >
                                {selectedProject.name}
                              </h3>
                              {selectedProject.stack && (
                                <span className="projects-hero-stack-pill">
                                  {selectedProject.stack}
                                </span>
                              )}
                              <button
                                type="button"
                                className="projects-edit-btn"
                                title="Rename project (or change stack)"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleEditProject(selectedProject.id, s, dispatch);
                                }}
                              >
                                ✎
                              </button>
                            </div>
                          )}

                          <div className="projects-hero-meta-row" style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "10px" }}>
                            <span className="projects-hero-stats-text" style={{ fontSize: "13.5px", color: "#8e99ad" }}>
                              {passedCount} of 8 SDLC Architecture Gates Passed ({pct}%)
                            </span>
                            <span
                              className="projects-fs-stage-badge"
                              style={{ color: badge.color, background: badge.bg, borderColor: badge.border }}
                            >
                              {badge.text}
                            </span>
                          </div>
                        </div>

                        <div className="projects-fs-hero-actions">
                          <button
                            type="button"
                            className="projects-fs-tool-btn"
                            title="Decrement passed gate"
                            onClick={() => handleDecrementGate(selectedProject.id, s, dispatch)}
                          >
                            -
                          </button>
                          <button
                            type="button"
                            className="projects-fs-tool-btn"
                            title="Increment passed gate"
                            onClick={() => handleIncrementGate(selectedProject.id, s, dispatch)}
                          >
                            +
                          </button>
                          <button
                            type="button"
                            className="projects-fs-tool-btn"
                            title={`Delete ${selectedProject.name}`}
                            onClick={() => handleRemoveProject(selectedProject.id, s, dispatch)}
                          >
                            ×
                          </button>
                        </div>
                      </div>

                      {/* 24-Segment Glowing Cyberpunk Bar */}
                      <div className="projects-fs-segments-bar">
                        {Array.from({ length: 24 }).map((_, segIdx) => (
                          <div
                            key={segIdx}
                            className={`projects-fs-seg ${segIdx < activeSegments ? (isShipped ? "active-complete" : "active") : ""}`}
                          />
                        ))}
                      </div>

                      {/* Blocker or Production Shipped Banner */}
                      <div className={`projects-fs-blocker-banner${isShipped ? " is-complete" : ""}`}>
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          {isShipped ? (
                            <g>
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                              <polyline points="22 4 12 14.01 9 11.01" />
                            </g>
                          ) : (
                            <g>
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </g>
                          )}
                        </svg>
                        <span>{getNextBlocker(selectedProject.gates)}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* 8 Architecture & SDLC Gates Interactive Matrix */}
                <div className="projects-fs-gates-studio">
                  <div className="projects-fs-gates-header">
                    <div>
                      <h4>Full Architecture &amp; SDLC Verification Matrix (8 Gates)</h4>
                      <span>Interactive engineering verification matrix with granular tasks, subtasks &amp; CRUD controls</span>
                    </div>

                    <div className="projects-fs-filter-pills">
                      <button
                        type="button"
                        className={`gate-filter-pill${gateFilter === "all" ? " active" : ""}`}
                        onClick={() => dispatch({ type: "SET_GATE_FILTER", gateFilter: "all" })}
                      >
                        All Gates ({DEFAULT_SDLC_GATES.length})
                      </button>
                      <button
                        type="button"
                        className={`gate-filter-pill${gateFilter === "passed" ? " active passed" : ""}`}
                        onClick={() => dispatch({ type: "SET_GATE_FILTER", gateFilter: "passed" })}
                      >
                        ✓ Passed ({passedGatesCount})
                      </button>
                      <button
                        type="button"
                        className={`gate-filter-pill${gateFilter === "pending" ? " active pending" : ""}`}
                        onClick={() => dispatch({ type: "SET_GATE_FILTER", gateFilter: "pending" })}
                      >
                        ○ In Progress ({DEFAULT_SDLC_GATES.length - passedGatesCount})
                      </button>
                    </div>
                  </div>

                  <div className="projects-fs-gates-grid">
                    {DEFAULT_SDLC_GATES.map((gateLabel, gIdx) => {
                      const checked = Boolean(selectedProject.gates[gIdx]);
                      if (gateFilter === "passed" && !checked) return null;
                      if (gateFilter === "pending" && checked) return null;

                      const gateDescriptions = [
                        "System architecture, ER diagrams, data contracts & database schema definitions.",
                        "Core domain models, business service layer, validation & exception orchestration.",
                        "Schema DDL migrations, indexing strategies, query plan & transaction isolation.",
                        "Clean REST/gRPC endpoints, Swagger/OpenAPI documentation & payload validation.",
                        "Redis distributed caching, TTL & Kafka event streaming pipelines.",
                        "JUnit 5 / Mockito unit tests, integration test suite with Testcontainers.",
                        "Multi-stage Dockerfile, container hardening, non-root user & compose environment.",
                        "Live production deployment, health probes, Prometheus/Grafana metrics & telemetry.",
                      ];
                      const gTasks = (selectedProject.gateTasks && selectedProject.gateTasks[gIdx]) || (DEFAULT_GATE_TASKS[gIdx] || []);
                      const isExpanded = selectedProject.expandedGates ? Boolean(selectedProject.expandedGates[gIdx]) : true;
                      const doneTasks = gTasks.filter((t) => t.done).length;
                      const taskPercent = gTasks.length > 0 ? Math.round((doneTasks / gTasks.length) * 100) : (checked ? 100 : 0);

                      return (
                        <div
                          key={gIdx}
                          className={`projects-fs-gate-card${checked ? " is-passed" : ""}`}
                        >
                          {/* Gate Top Bar */}
                          <div className="projects-fs-gate-top">
                            <button
                              type="button"
                              className={`projects-fs-gate-check-btn${checked ? " checked" : ""}`}
                              title={checked ? "Mark Gate Pending" : "Mark Gate Passed"}
                              onClick={() => handleToggleGate(selectedProject.id, gIdx, s, dispatch)}
                            >
                              {checked ? (
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              ) : (
                                <span className="gate-check-dot" />
                              )}
                            </button>

                            <div className="gate-badge-group">
                              <span className="projects-fs-gate-num">GATE 0{gIdx + 1}</span>
                              <span className={`projects-fs-gate-status-pill ${checked ? "passed" : (doneTasks > 0 ? "active" : "pending")}`}>
                                {checked ? "✓ PASSED" : (doneTasks > 0 ? "● ACTIVE" : "○ PENDING")}
                              </span>
                            </div>

                            <div className="gate-top-right">
                              <span className={`gate-counter-pill ${checked ? "passed" : ""}`}>
                                {doneTasks}/{gTasks.length} Tasks
                              </span>
                              <button
                                type="button"
                                className="gate-expand-toggle-btn"
                                title={isExpanded ? "Collapse Gate" : "Expand Gate"}
                                onClick={() => handleToggleGateExpand(selectedProject.id, gIdx, s, dispatch)}
                              >
                                {isExpanded ? "▾" : "▸"}
                              </button>
                            </div>
                          </div>

                          {/* Gate Header Info */}
                          <div className="gate-info-block">
                            <h5 className="projects-fs-gate-title">{gateLabel}</h5>
                            <p className="projects-fs-gate-desc">{gateDescriptions[gIdx] || ""}</p>
                            {/* Gate Micro Progress Bar */}
                            <div className="gate-micro-bar-track">
                              <div
                                className={`gate-micro-bar-fill ${checked ? "passed" : (taskPercent > 0 ? "active" : "")}`}
                                style={{ width: `${taskPercent}%` }}
                              />
                            </div>
                          </div>

                          {/* Tasks & Subtasks Area */}
                          {isExpanded && (
                            <div className="gate-tasks-container">
                              {gTasks.length === 0 ? (
                                <div className="gate-empty-tasks">
                                  <span>No verification tasks assigned yet.</span>
                                </div>
                              ) : (
                                gTasks.map((t) => {
                                  const subs = Array.isArray(t.subtasks) ? t.subtasks : [];
                                  const doneSubs = subs.filter((st) => st.done).length;
                                  const isEditingTask = s.editingGateTaskId === t.id;
                                  const isAddingSub = s.addingGateSubtaskId === t.id;

                                  return (
                                    <div
                                      key={t.id}
                                      className={`gate-task-item${t.done ? " is-done" : ""}`}
                                    >
                                      {/* Task Main Row */}
                                      {isEditingTask ? (
                                        <form
                                          className="gate-inline-edit-form"
                                          onSubmit={(e) => {
                                            e.preventDefault();
                                            const inp = e.target.elements.taskInput;
                                            handleSaveGateTaskName(selectedProject.id, gIdx, t.id, inp ? inp.value : "", s, dispatch);
                                          }}
                                        >
                                          <span className="gate-cli-prompt">&gt;</span>
                                          <input
                                            name="taskInput"
                                            defaultValue={t.name}
                                            autoFocus
                                            className="gate-inline-input"
                                            onKeyDown={(e) => {
                                              if (e.key === "Escape") handleToggleEditGateTask(t.id, s, dispatch);
                                            }}
                                          />
                                          <button type="submit" className="gate-inline-save-btn">Save ✓</button>
                                          <button
                                            type="button"
                                            className="gate-inline-cancel-btn"
                                            onClick={() => handleToggleEditGateTask(t.id, s, dispatch)}
                                          >
                                            ✕
                                          </button>
                                        </form>
                                      ) : (
                                        <div className="gate-task-header-row">
                                          <button
                                            type="button"
                                            className={`gate-task-check${t.done ? " checked" : ""}`}
                                            title={t.done ? "Mark Task Incomplete" : "Mark Task Done"}
                                            onClick={() => handleToggleGateTask(selectedProject.id, gIdx, t.id, s, dispatch)}
                                          >
                                            {t.done && (
                                              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                <polyline points="20 6 9 17 4 12" />
                                              </svg>
                                            )}
                                          </button>

                                          <span
                                            className={`gate-task-title${t.done ? " completed" : ""}`}
                                            onClick={() => handleToggleGateTask(selectedProject.id, gIdx, t.id, s, dispatch)}
                                            title="Click to toggle completion"
                                          >
                                            {t.name}
                                          </span>

                                          {subs.length > 0 && (
                                            <span className={`gate-sub-count-tag${t.done ? " done" : ""}`}>
                                              {doneSubs}/{subs.length}
                                            </span>
                                          )}

                                          {/* Hover Actions: +sub, edit, delete */}
                                          <div className="gate-task-actions">
                                            <button
                                              type="button"
                                              className="gate-act-btn add-sub"
                                              title="Add Subtask"
                                              onClick={() => handleToggleAddGateSubtaskForm(t.id, s, dispatch)}
                                            >
                                              +sub
                                            </button>
                                            <button
                                              type="button"
                                              className="gate-act-btn edit"
                                              title="Edit Task Name"
                                              onClick={() => handleToggleEditGateTask(t.id, s, dispatch)}
                                            >
                                              ✎
                                            </button>
                                            <button
                                              type="button"
                                              className="gate-act-btn delete"
                                              title="Delete Task"
                                              onClick={() => handleDeleteGateTask(selectedProject.id, gIdx, t.id, s, dispatch)}
                                            >
                                              ×
                                            </button>
                                          </div>
                                        </div>
                                      )}

                                      {/* Subtask Add Form */}
                                      {isAddingSub && (
                                        <form
                                          className="gate-sub-add-form"
                                          onSubmit={(e) => {
                                            e.preventDefault();
                                            const inp = e.target.elements.subtaskInput;
                                            handleCreateGateSubtask(selectedProject.id, gIdx, t.id, inp ? inp.value : "", s, dispatch);
                                          }}
                                        >
                                          <span className="gate-cli-prompt">&gt;</span>
                                          <input
                                            name="subtaskInput"
                                            placeholder="Enter subtask contract/spec..."
                                            autoFocus
                                            className="gate-inline-input sub-input"
                                            onKeyDown={(e) => {
                                              if (e.key === "Escape") handleToggleAddGateSubtaskForm(t.id, s, dispatch);
                                            }}
                                          />
                                          <button type="submit" className="gate-inline-save-btn">+ Add</button>
                                          <button
                                            type="button"
                                            className="gate-inline-cancel-btn"
                                            onClick={() => handleToggleAddGateSubtaskForm(t.id, s, dispatch)}
                                          >
                                            ✕
                                          </button>
                                        </form>
                                      )}

                                      {/* Subtasks Tree Hierarchy */}
                                      {subs.length > 0 && (
                                        <div className="gate-subtasks-tree">
                                          {subs.map((st) => {
                                            const isEditingSub = s.editingGateSubtaskId === st.id;

                                            return isEditingSub ? (
                                              <form
                                                key={st.id}
                                                className="gate-sub-inline-edit"
                                                onSubmit={(e) => {
                                                  e.preventDefault();
                                                  const inp = e.target.elements.subEditInput;
                                                  handleSaveGateSubtaskName(selectedProject.id, gIdx, t.id, st.id, inp ? inp.value : "", s, dispatch);
                                                }}
                                              >
                                                <input
                                                  name="subEditInput"
                                                  defaultValue={st.name}
                                                  autoFocus
                                                  className="gate-inline-input sub-input"
                                                  onKeyDown={(e) => {
                                                    if (e.key === "Escape") handleToggleEditGateSubtask(st.id, s, dispatch);
                                                  }}
                                                />
                                                <button type="submit" className="gate-inline-save-btn">✓</button>
                                                <button
                                                  type="button"
                                                  className="gate-inline-cancel-btn"
                                                  onClick={() => handleToggleEditGateSubtask(st.id, s, dispatch)}
                                                >
                                                  ✕
                                                </button>
                                              </form>
                                            ) : (
                                              <div
                                                key={st.id}
                                                className={`gate-subtask-row${st.done ? " is-done" : ""}`}
                                              >
                                                <button
                                                  type="button"
                                                  className={`gate-sub-bullet-btn${st.done ? " done" : ""}`}
                                                  title={st.done ? "Mark Subtask Incomplete" : "Mark Subtask Done"}
                                                  onClick={() => handleToggleGateSubtask(selectedProject.id, gIdx, t.id, st.id, s, dispatch)}
                                                >
                                                  {st.done ? "✦" : "○"}
                                                </button>

                                                <span
                                                  className={`gate-subtask-text${st.done ? " completed" : ""}`}
                                                  onClick={() => handleToggleGateSubtask(selectedProject.id, gIdx, t.id, st.id, s, dispatch)}
                                                  title="Click to toggle subtask"
                                                >
                                                  {st.name}
                                                </span>

                                                <div className="gate-sub-actions">
                                                  <button
                                                    type="button"
                                                    className="gate-act-btn edit sub"
                                                    title="Edit Subtask Name"
                                                    onClick={() => handleToggleEditGateSubtask(st.id, s, dispatch)}
                                                  >
                                                    ✎
                                                  </button>
                                                  <button
                                                    type="button"
                                                    className="gate-act-btn delete sub"
                                                    title="Delete Subtask"
                                                    onClick={() => handleDeleteGateSubtask(selectedProject.id, gIdx, t.id, st.id, s, dispatch)}
                                                  >
                                                    ×
                                                  </button>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })
                              )}

                              {/* Gate-Level + Add Task Button / Form */}
                              {s.addingGateTaskGateIdx === gIdx ? (
                                <form
                                  className="gate-add-task-form"
                                  onSubmit={(e) => {
                                    e.preventDefault();
                                    const inp = e.target.elements.newTaskInput;
                                    handleCreateGateTask(selectedProject.id, gIdx, inp ? inp.value : "", s, dispatch);
                                  }}
                                >
                                  <span className="gate-cli-prompt">&gt;</span>
                                  <input
                                    name="newTaskInput"
                                    placeholder="Enter architecture verification task..."
                                    autoFocus
                                    className="gate-inline-input"
                                    onKeyDown={(e) => {
                                      if (e.key === "Escape") handleToggleAddGateTaskForm(gIdx, s, dispatch);
                                    }}
                                  />
                                  <button type="submit" className="gate-inline-save-btn">+ Add Task</button>
                                  <button
                                    type="button"
                                    className="gate-inline-cancel-btn"
                                    onClick={() => handleToggleAddGateTaskForm(gIdx, s, dispatch)}
                                  >
                                    ✕
                                  </button>
                                </form>
                              ) : (
                                <button
                                  type="button"
                                  className="gate-add-task-btn"
                                  onClick={() => handleToggleAddGateTaskForm(gIdx, s, dispatch)}
                                >
                                  <span className="gate-add-icon">+</span> Add Verification Task
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="projects-fs-main" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="projects-fs-empty-card">
                  <div className="projects-fs-empty-icon-wrap">
                    <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="#ffaa00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M8 7v7M12 7v4M16 7v9" />
                    </svg>
                  </div>
                  <h3>Full SDLC Engineering Studio</h3>
                  <p>
                    Track architecture, domain services, database indexing, API contracts,
                    integration testing, Docker containers, CI/CD pipelines, and production observability.
                  </p>
                  <button
                    type="button"
                    className="projects-fs-empty-cta-btn"
                    onClick={() => handleToggleAddProjectForm(s, dispatch)}
                  >
                    + Add New Project
                  </button>
                </div>
              </div>
            )}
          </div>
          )}
        </div>
      )}

      {/* Fullscreen Complete Screen Mode for Job Tracker */}
      {careerFullscreen && (
        <div
          className="career-fullscreen-overlay"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Escape") handleToggleCareerFullscreen(s, dispatch);
          }}
        >
          {/* Top Bar */}
          <div className="career-fs-topbar">
            <div className="career-fs-title-wrap">
              <svg className="career-fs-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="20" height="14" x="2" y="7" rx="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              <h2>
                Job Tracker
                <span className="career-fs-mode-tag">FULLSCREEN WORKSTATION</span>
              </h2>
              <div className="career-funnel-pills" style={{ marginLeft: "14px" }}>
                <span className="funnel-pill applied">{careerFunnel.applied} Applied</span>
                <span className="funnel-pill oa">{careerFunnel.oa} OA</span>
                <span className="funnel-pill interview">{careerFunnel.interview} Interview</span>
                <span className="funnel-pill offer">{careerFunnel.offer} Offer</span>
              </div>
            </div>

            <div className="career-fs-topbar-actions">
              <button
                type="button"
                className={`career-fs-btn${s.showAddCareerDrawer ? " active" : ""}`}
                title="Add New Application"
                onClick={() => handleToggleAddCareerDrawer(s, dispatch)}
              >
                + Add Application
              </button>
              <button
                type="button"
                className="career-fs-close-btn"
                title="Exit Fullscreen Mode (or press Esc)"
                onClick={() => handleToggleCareerFullscreen(s, dispatch)}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7" />
                </svg>
                Exit Fullscreen (Esc)
              </button>
            </div>
          </div>

          <div className="career-fs-body">
            {/* Left Sidebar: Target Pipelines */}
            <div className="career-fs-sidebar">
              <div className="career-fs-sidebar-title">
                <span>ACTIVE PIPELINES ({careerList.length})</span>
                <button
                  type="button"
                  className="career-fs-mini-add-btn"
                  title="Add Application"
                  onClick={() => handleToggleAddCareerDrawer(s, dispatch)}
                >
                  +
                </button>
              </div>

              <div className="career-fs-list">
                {careerList.length === 0 ? (
                  <div className="career-fs-empty-sidebar">
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="14" x="2" y="7" rx="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                    <span>No active applications</span>
                    <button
                      type="button"
                      className="career-fs-empty-btn"
                      onClick={() => handleToggleAddCareerDrawer(s, dispatch)}
                    >
                      + Add Application
                    </button>
                  </div>
                ) : (
                  careerList.map((comp) => {
                    const isSel = selectedCompany && selectedCompany.id === comp.id;
                    return (
                      <div
                        key={comp.id}
                        className={`career-fs-card${isSel ? " is-active" : ""}`}
                        onClick={() => handleSelectCareer(comp.id, s, dispatch)}
                      >
                        <span className={`career-status-dot${isSel ? " glowing" : ""}`}>●</span>
                        <div className="career-fs-card-info">
                          <div className="career-fs-card-line1">
                            <strong>{comp.company}</strong>
                            <span className="career-fs-ctc">({comp.ctc})</span>
                          </div>
                          <div className="career-fs-card-line2">
                            {comp.role}{comp.stack ? ` (${comp.stack})` : ""}
                          </div>
                          <div className="career-fs-card-line3">
                            <span className="career-fs-badge-stage">{getCareerStageBadge(comp)}</span>
                            {comp.mtechSponsored && <span className="career-fs-badge-mtech">M.Tech</span>}
                            <span className="career-fs-badge-source">{comp.source || "LinkedIn"}</span>
                          </div>
                        </div>
                        <div className="career-fs-card-actions" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            className="career-fs-card-del-btn"
                            title={`Withdraw ${comp.company}`}
                            onClick={() => handleWithdrawCompany(comp.id, s, dispatch)}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Main Pane: Full Detail Inspector or Add Form */}
            {s.showAddCareerDrawer ? (
              <div className="career-fs-main" style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "20px 24px" }}>
                <div className="career-fs-add-card">
                  {/* Intake Hero Header */}
                  <div className="career-fs-add-hero">
                    <div className="career-fs-add-hero-left">
                      <div className="career-fs-add-badge">
                        <span className="career-fs-add-spark">✦</span> PIPELINE INTAKE STATION
                      </div>
                      <h3>Add New Job Application</h3>
                      <p>
                        Register target organization, compensation bracket, tech stack domain, and track interview pipeline milestones from Applied to Offer.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="career-fs-add-close"
                      title="Close and return to active pipeline"
                      onClick={() => handleToggleAddCareerDrawer(s, dispatch)}
                    >
                      ×
                    </button>
                  </div>

                  <form className="career-fs-add-form" onSubmit={(e) => handleAddCareerSubmit(e, s, dispatch)}>
                    <div className="career-fs-fields-grid">
                      {/* Company Name */}
                      <div className="career-fs-field">
                        <label className="career-fs-label">COMPANY / TARGET ORGANIZATION *</label>
                        <div className="career-fs-input-wrap">
                          <span className="career-fs-input-icon">🏢</span>
                          <input
                            className="career-fs-input car-input-company"
                            type="text"
                            placeholder="e.g. Google, Razorpay, Uber, Stripe"
                            required
                            autoFocus
                          />
                        </div>
                      </div>

                      {/* CTC / Compensation */}
                      <div className="career-fs-field">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <label className="career-fs-label">COMPENSATION / PACKAGE</label>
                          <div className="career-fs-quick-presets">
                            {["24 LPA", "35 LPA", "45 LPA", "60 LPA"].map((preset) => (
                              <button
                                key={preset}
                                type="button"
                                className="career-fs-preset-pill"
                                onClick={(e) => {
                                  const form = e.target.closest("form");
                                  const ctcInp = form ? form.querySelector(".car-input-ctc") : null;
                                  if (ctcInp) ctcInp.value = `₹${preset}`;
                                }}
                              >
                                {preset}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="career-fs-input-wrap">
                          <span className="career-fs-input-icon">₹</span>
                          <input
                            className="career-fs-input car-input-ctc"
                            type="text"
                            placeholder="e.g. ₹45 LPA"
                            defaultValue="₹40 LPA"
                          />
                        </div>
                      </div>

                      {/* Target Role */}
                      <div className="career-fs-field">
                        <label className="career-fs-label">ROLE TITLE *</label>
                        <div className="career-fs-input-wrap">
                          <span className="career-fs-input-icon">💼</span>
                          <input
                            className="career-fs-input car-input-role"
                            type="text"
                            placeholder="e.g. Software Engineer III (Backend)"
                            required
                          />
                        </div>
                      </div>

                      {/* Tech Stack */}
                      <div className="career-fs-field">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <label className="career-fs-label">PRIMARY TECH STACK</label>
                          <div className="career-fs-quick-presets">
                            {["Java · Kafka", "Spring · SQL", "Go · K8s"].map((tech) => (
                              <button
                                key={tech}
                                type="button"
                                className="career-fs-preset-pill"
                                onClick={(e) => {
                                  const form = e.target.closest("form");
                                  const stackInp = form ? form.querySelector(".car-input-stack") : null;
                                  if (stackInp) stackInp.value = tech;
                                }}
                              >
                                {tech}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="career-fs-input-wrap">
                          <span className="career-fs-input-icon">⚡</span>
                          <input
                            className="career-fs-input car-input-stack"
                            type="text"
                            placeholder="e.g. Java 21 · Kafka · Spring Boot · GCP"
                          />
                        </div>
                      </div>

                      {/* Recruitment Source */}
                      <div className="career-fs-field">
                        <label className="career-fs-label">APPLICATION CHANNEL / SOURCE</label>
                        <div className="career-fs-input-wrap">
                          <span className="career-fs-input-icon">🌐</span>
                          <select className="career-fs-input car-input-source" defaultValue="LinkedIn">
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="Referral">Referral (Senior Staff Engineer)</option>
                            <option value="Instahyre">Instahyre</option>
                            <option value="Naukri">Naukri</option>
                            <option value="Wellfound">Wellfound</option>
                            <option value="Direct">Direct Careers Portal</option>
                          </select>
                        </div>
                      </div>

                      {/* Sponsorship & Perks */}
                      <div className="career-fs-field">
                        <label className="career-fs-label">WORK PERKS &amp; EDUCATION</label>
                        <div className="career-fs-toggle-card">
                          <label className="career-fs-toggle-label">
                            <input type="checkbox" className="car-input-mtech" defaultChecked />
                            <div className="career-fs-toggle-text">
                              <strong style={{ color: "#00e6a0" }}>✓ M.Tech Sponsored Program</strong>
                              <span>Higher education &amp; tuition assistance sponsored</span>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Job Posting URL */}
                      <div className="career-fs-field full-width">
                        <label className="career-fs-label">JOB POSTING / PORTAL URL (OPTIONAL)</label>
                        <div className="career-fs-input-wrap">
                          <span className="career-fs-input-icon">🔗</span>
                          <input
                            className="career-fs-input car-input-joburl"
                            type="text"
                            placeholder="https://careers.google.com/jobs/results/..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* 5-Stage Pipeline Milestone Preview */}
                    <div className="career-fs-preview-box">
                      <div className="career-fs-preview-head">
                        <span className="career-fs-preview-title">INITIALIZED PIPELINE MILESTONES:</span>
                        <span className="career-fs-preview-tag">STANDARD SE-3 / SDE-2 TRACK</span>
                      </div>
                      <div className="career-fs-rounds-track">
                        <div className="fs-round-step done">
                          <span className="fs-round-num">01</span>
                          <span className="fs-round-lbl">Applied</span>
                        </div>
                        <span className="fs-round-arrow">→</span>
                        <div className="fs-round-step active">
                          <span className="fs-round-num">02</span>
                          <span className="fs-round-lbl">Resume Shortlist</span>
                        </div>
                        <span className="fs-round-arrow">→</span>
                        <div className="fs-round-step">
                          <span className="fs-round-num">03</span>
                          <span className="fs-round-lbl">Online OA</span>
                        </div>
                        <span className="fs-round-arrow">→</span>
                        <div className="fs-round-step">
                          <span className="fs-round-num">04</span>
                          <span className="fs-round-lbl">LLD Design</span>
                        </div>
                        <span className="fs-round-arrow">→</span>
                        <div className="fs-round-step">
                          <span className="fs-round-num">05</span>
                          <span className="fs-round-lbl">HLD Design</span>
                        </div>
                        <span className="fs-round-arrow">→</span>
                        <div className="fs-round-step">
                          <span className="fs-round-num">06</span>
                          <span className="fs-round-lbl">HM &amp; Offer</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="career-fs-add-footer">
                      <button
                        type="button"
                        className="career-fs-cancel-btn"
                        onClick={() => handleToggleAddCareerDrawer(s, dispatch)}
                      >
                        ✕ Cancel
                      </button>
                      <button type="submit" className="career-fs-submit-btn">
                        <span>+</span> Register Application &amp; Launch Pipeline
                      </button>
                    </div>
                  </form>
                </div>
              </div>) : selectedCompany ? (
              <div className="career-fs-main">
                {/* Selected Company Hero Header */}
                <div className="career-fs-hero">
                  <div className="career-fs-hero-top">
                    <div className="career-fs-hero-details" style={{ flex: 1 }}>
                      {s.editingCareerCompanyId === selectedCompany.id ? (
                        <div className="career-inline-edit-row" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <input
                            key={`fs-edit-company-${selectedCompany.id}`}
                            className="career-inline-inp"
                            defaultValue={`${selectedCompany.company} · ${selectedCompany.role}${selectedCompany.stack ? ` (${selectedCompany.stack})` : ""} | ${selectedCompany.ctc}`}
                            autoFocus
                            style={{ fontSize: "19px", height: "38px", flex: 1 }}
                            onClick={(e) => e.stopPropagation()}
                            onFocus={(e) => {
                              const val = e.target.value;
                              e.target.setSelectionRange(val.length, val.length);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                e.stopPropagation();
                                handleSaveCompanyFromText(selectedCompany.id, e.target.value, s, dispatch);
                              } else if (e.key === "Escape") {
                                e.stopPropagation();
                                handleStartEditCompany(null, s, dispatch);
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="career-edit-btn save"
                            title="Save (Enter)"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={(e) => {
                              e.stopPropagation();
                              const inp = e.currentTarget.closest(".career-inline-edit-row").querySelector(".career-inline-inp");
                              handleSaveCompanyFromText(selectedCompany.id, inp ? inp.value : selectedCompany.company, s, dispatch);
                            }}
                          >
                            ✓
                          </button>
                          <button
                            type="button"
                            className="career-edit-btn cancel"
                            title="Cancel (Esc)"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEditCompany(null, s, dispatch);
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="career-fs-hero-title-row">
                          <h3
                            style={{ margin: 0, fontSize: "22px", fontWeight: "750", color: "#f6f6fa", cursor: "pointer" }}
                            title="Double-click to edit details"
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              handleStartEditCompany(selectedCompany.id, s, dispatch);
                            }}
                          >
                            {selectedCompany.company} · {selectedCompany.role}{selectedCompany.stack ? ` (${selectedCompany.stack})` : ""}
                          </h3>
                          <span className="career-fs-hero-ctc">{selectedCompany.ctc}</span>
                          <button
                            type="button"
                            className="career-edit-btn"
                            title="Edit company / role / CTC"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEditCompany(selectedCompany.id, s, dispatch);
                            }}
                          >
                            ✎
                          </button>
                        </div>
                      )}

                      {/* Interactive Metadata Pill Row */}
                      <div className="career-pills-row" style={{ marginTop: "8px", display: "flex", gap: "8px", alignItems: "center" }}>
                        <button
                          type="button"
                          className={`career-meta-pill sponsorship${selectedCompany.mtechSponsored ? " is-sponsored" : ""}`}
                          style={{ fontSize: "12px", padding: "4px 10px" }}
                          onClick={() => handleToggleSponsorship(selectedCompany.id, s, dispatch)}
                          title="Click to toggle M.Tech sponsorship"
                        >
                          [ {selectedCompany.mtechSponsored ? "M.Tech Sponsored" : "Standard Role"} ]
                        </button>

                        <button
                          type="button"
                          className="career-meta-pill source"
                          style={{ fontSize: "12px", padding: "4px 10px" }}
                          onClick={() => handleCycleSource(selectedCompany.id, s, dispatch)}
                          title="Click to cycle source (LinkedIn → Naukri → Referral → Direct)"
                        >
                          [ {selectedCompany.source || "LinkedIn"} ]
                        </button>

                        <span className="career-meta-pill stage" style={{ fontSize: "12px", padding: "4px 10px" }}>
                          [ {getCareerStageBadge(selectedCompany)} ]
                        </span>
                      </div>
                    </div>

                    <div className="career-fs-hero-actions">
                      <button
                        type="button"
                        className="career-fs-withdraw-btn"
                        title="Withdraw application & delete from list"
                        onClick={() => handleWithdrawCompany(selectedCompany.id, s, dispatch)}
                      >
                        Withdraw Application
                      </button>
                    </div>
                  </div>
                </div>

                {/* 5-Round Progress Checklist Matrix */}
                <div className="career-fs-checklist-studio">
                  <div className="career-fs-checklist-header">
                    <h4>Interactive Pipeline Milestones &amp; Interview Checklist</h4>
                    <span>Click the status icon to cycle status (Pending → Active → Done) · Click date/notes to edit</span>
                  </div>

                  <div className="career-fs-rounds-rows">
                    {selectedCompany.rounds.map((rnd, rIdx) => {
                      const isEditingRound = s.editingCareerRoundId === rnd.id;
                      return (
                        <div key={rnd.id} className={`career-fs-round-row is-${rnd.status}`}>
                          {/* Left: Level / Status Badge */}
                          <div className="career-fs-row-left">
                            <button
                              type="button"
                              className="career-round-status-btn"
                              style={{ width: "36px", height: "36px" }}
                              onClick={() => handleCycleRoundStatus(selectedCompany.id, rnd.id, s, dispatch)}
                              title="Click to cycle status (Pending → Active → Done)"
                            >
                              {rnd.status === "done" && (<svg className="rnd-icon done" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>)}
                              {rnd.status === "active" && (<svg className="rnd-icon active" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.83 6.72 2.24L21 8" /><path d="M21 3v5h-5" /></svg>)}
                              {rnd.status === "pending" && (<svg className="rnd-icon pending" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="16" height="16" x="4" y="4" rx="2.5" /></svg>)}
                            </button>
                            <div className="career-fs-level-badge-wrap">
                              <span className="career-fs-level-pill">LEVEL {rIdx + 1}</span>
                              <span className={`career-fs-round-badge ${rnd.status}`}>{rnd.status.toUpperCase()}</span>
                            </div>
                          </div>

                          {/* Center: Title & Notes */}
                          <div className="career-fs-row-center">
                            <h5 className="career-fs-round-name">{rnd.name}</h5>
                            {isEditingRound ? (
                              <div className="career-fs-round-edit-wrap">
                                <textarea
                                  key={`fs-edit-rnd-${rnd.id}`}
                                  className="career-fs-round-textarea"
                                  defaultValue={rnd.subtext}
                                  autoFocus
                                  style={{ minHeight: "55px", width: "100%", fontSize: "13px" }}
                                  onClick={(e) => e.stopPropagation()}
                                  onFocus={(e) => {
                                    const val = e.target.value;
                                    e.target.setSelectionRange(val.length, val.length);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleSaveRoundSubtext(selectedCompany.id, rnd.id, e.target.value, s, dispatch);
                                    } else if (e.key === "Escape") {
                                      e.stopPropagation();
                                      handleStartEditRound(null, s, dispatch);
                                    }
                                  }}
                                />
                                <div className="career-fs-round-edit-actions" style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                                  <button
                                    type="button"
                                    className="career-edit-btn save"
                                    title="Save (Enter)"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const inp = e.currentTarget.closest(".career-fs-round-edit-wrap").querySelector(".career-fs-round-textarea");
                                      handleSaveRoundSubtext(selectedCompany.id, rnd.id, inp ? inp.value : rnd.subtext, s, dispatch);
                                    }}
                                  >
                                    ✓ Save
                                  </button>
                                  <button
                                    type="button"
                                    className="career-edit-btn cancel"
                                    title="Cancel (Esc)"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStartEditRound(null, s, dispatch);
                                    }}
                                  >
                                    × Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div
                                className="career-fs-round-subtext"
                                onClick={() => handleStartEditRound(rnd.id, s, dispatch)}
                                title="Click to edit interview notes, feedback, or schedule"
                              >
                                {rnd.subtext || "Click to add scheduled date, interviewer notes, or feedback..."}
                              </div>
                            )}
                          </div>

                          {/* Right: Quick Status Actions */}
                          <div className="career-fs-row-right" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              className={`career-fs-cycle-btn status-${rnd.status}`}
                              onClick={() => handleCycleRoundStatus(selectedCompany.id, rnd.id, s, dispatch)}
                              title="Advance to next status"
                            >
                              {rnd.status === "pending" && "Activate Level →"}
                              {rnd.status === "active" && "Mark Passed ✓"}
                              {rnd.status === "done" && "Reset Level ↺"}
                            </button>
                            <button
                              type="button"
                              className="career-edit-btn"
                              title="Edit round notes"
                              onClick={() => handleStartEditRound(rnd.id, s, dispatch)}
                            >
                              ✎
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Quick Actions Bar */}
                <div className="career-fs-quick-bar">
                  <span className="quick-actions-label" style={{ fontSize: "12px", fontWeight: "700" }}>Quick Resources &amp; Links:</span>

                  {s.editingCareerResume ? (
                    <div style={{ display: "inline-flex", gap: "4px", alignItems: "center" }}>
                      <input
                        className="quick-action-inline-inp"
                        defaultValue={selectedCompany.resume || "Resume.pdf"}
                        autoFocus
                        style={{ height: "26px", fontSize: "12px", maxWidth: "160px" }}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSaveResume(selectedCompany.id, e.target.value, s, dispatch);
                          } else if (e.key === "Escape") {
                            e.stopPropagation();
                            handleToggleEditResume(false, s, dispatch);
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="career-edit-btn save"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={(e) => {
                          const inp = e.currentTarget.parentElement.querySelector("input");
                          handleSaveResume(selectedCompany.id, inp ? inp.value : selectedCompany.resume, s, dispatch);
                        }}
                      >✓</button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="career-action-link"
                      style={{ fontSize: "12px", padding: "4px 8px" }}
                      onClick={() => handleToggleEditResume(true, s, dispatch)}
                      title="Click to change resume file"
                    >
                      📄 {selectedCompany.resume || "Resume.pdf"} (Click to edit)
                    </button>
                  )}

                  {s.editingCareerJobUrl ? (
                    <div style={{ display: "inline-flex", gap: "4px", alignItems: "center" }}>
                      <input
                        className="quick-action-inline-inp"
                        defaultValue={selectedCompany.jobUrl || ""}
                        placeholder="Paste Job URL (https://...)"
                        autoFocus
                        style={{ height: "26px", fontSize: "12px", minWidth: "220px" }}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSaveJobUrl(selectedCompany.id, e.target.value, s, dispatch);
                          } else if (e.key === "Escape") {
                            e.stopPropagation();
                            handleToggleEditJobUrl(false, s, dispatch);
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="career-edit-btn save"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={(e) => {
                          const inp = e.currentTarget.parentElement.querySelector("input");
                          handleSaveJobUrl(selectedCompany.id, inp ? inp.value : selectedCompany.jobUrl, s, dispatch);
                        }}
                      >✓</button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="career-action-link"
                      style={{ fontSize: "12px", padding: "4px 8px" }}
                      onClick={() => {
                        if (selectedCompany.jobUrl) {
                          window.open(selectedCompany.jobUrl, "_blank");
                        } else {
                          handleToggleEditJobUrl(true, s, dispatch);
                        }
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        handleToggleEditJobUrl(true, s, dispatch);
                      }}
                      title={selectedCompany.jobUrl ? "Click to open job URL (Right-click to edit)" : "Click to set Job URL"}
                    >
                      🔗 {selectedCompany.jobUrl ? "Open Job Posting ↗" : "Set Job URL"}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="career-fs-main" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="career-fs-empty-card">
                  <div className="career-fs-empty-icon-wrap">
                    <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="14" x="2" y="7" rx="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </div>
                  <h3>Career &amp; Technical Pipeline Workstation</h3>
                  <p>
                    Track high-impact engineering roles, target CTC packages, M.Tech sponsorship,
                    and cycle through the 5-round technical interview pipeline from OA to Offer.
                  </p>
                  <button
                    type="button"
                    className="career-fs-empty-cta-btn"
                    onClick={() => handleToggleAddCareerDrawer(s, dispatch)}
                  >
                    + Add Job Application
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const className = `
  top: 38px; left: 0; width: 100vw; height: calc(100vh - 38px);
  z-index: 10; color: #f6f6fa;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
  * { box-sizing: border-box; }
  .dashboard { position:relative; width:100%; height:100%; padding:8px 8px 66px; display:grid; grid-template-columns:minmax(320px, .78fr) minmax(350px, .78fr); gap:clamp(18px, 3vw, 54px); justify-content:space-between; }
  .panel { background:rgba(5,6,9,.84); border:1px solid rgba(255,35,54,.9); border-radius:14px; box-shadow:0 0 12px rgba(255,0,35,.09), inset 0 0 18px rgba(255,255,255,.015); overflow:hidden; }
  .sidebar { padding:14px 10px; display:flex; flex-direction:column; min-height:0; }
  .profile { display:flex; align-items:center; gap:10px; padding:4px 5px 18px; border-bottom:1px solid #25252a; }
  .avatar { display:grid; place-items:center; width:38px;height:38px;border-radius:50%;background:#ff1935;color:white; }
  strong { font-weight:650; } small { color:#aeb4c5; display:block; font-size:11px; }
  .nav { padding:10px 9px; color:#c9d0df; border-radius:9px; font-size:13px; margin:2px 0; }
  .nav.active { background:linear-gradient(90deg,#8b0719,#32050c); border:1px solid #ef233c; color:white; }
  .quote { margin-top:auto; padding:14px 10px; border-radius:10px; background:linear-gradient(140deg,#22090e,#08080a); line-height:1.5; font-size:13px; }
  .center,.right { display:flex; flex-direction:column; gap:10px; min-width:0; min-height:0; }
  .center { max-width:620px; }
  .right { max-width:640px; justify-self:end; margin-top:-8px; height:100%; }
  .empty-state { color:#9da5b5; font-size:11px; line-height:1.5; padding:6px 0; }
  .topline { display:grid; grid-template-columns:minmax(180px,.95fr) minmax(0,2.05fr); gap:10px; min-height:195px; }
  .clock { height:160px; align-self:start; padding:15px; background:linear-gradient(130deg,rgba(30,7,13,.95),rgba(3,4,7,.88)); }
  .clock > small { font-size:10px; }
  .clock .time { font-size:clamp(27px,2.4vw,38px); font-weight:750; letter-spacing:-1px; margin:6px 0; white-space:nowrap; }
  .clock em { color:#aab5ce; font-style:normal; font-size:16px; }
  .clock > strong { font-size:13px; }
  .clock p { color:#b5bed0; font-size:11px; line-height:1.35; margin:8px 0 0; }
  .weatherrow { display:grid; width:calc(100% + 255px); grid-template-columns:repeat(4,minmax(0,1fr)); gap:6px; }
  .weatherrow .weather:nth-child(4),
  .weatherrow .weather-navi-mumbai { transform:translateX(285px); }
  .weather { height:87px; align-self:start; padding:4px 6px; background:linear-gradient(180deg,rgba(22,15,18,.93),rgba(2,3,5,.9)); }
  .weather strong { font-size:clamp(9px, .75vw, 12px); white-space:nowrap; }
  .weather-temp { display:flex; align-items:center; gap:5px; margin:3px 0; font-size:clamp(14px, 1.15vw, 19px); }
  .weather-temp span { font-size:clamp(18px, 1.5vw, 24px); color:#f5f7ff; }
  .weather small { margin:1px 0; font-size:clamp(8px, .65vw, 10px); white-space:nowrap; }
  .weather .weather-condition { color:#e8edf8; font-size:clamp(8px, .6vw, 9px); }
  h3 { margin:0 0 12px; font-size:14px; font-weight:650; }
  h3 span { float:right; color:#ff4658; font-size:11px; font-weight:500; }
  .tasks { width:calc(100% - 165px); min-height:250px; max-height:310px; padding:13px 15px; margin-top:-10px; margin-bottom:0; overflow-y:auto; }
  .tasks-heading { display:flex;align-items:center;gap:8px;margin-bottom:10px; }
  .tasks-heading h3 { margin:0;font-size:14px; }
  .task-count { margin-left:auto;color:#ff4658;font-size:11px;white-space:nowrap; }
  .task-actions { display:flex;align-items:center;gap:4px; }
  .task-add-form { display:flex;align-items:center;gap:5px;margin:0 0 9px; }
  .task-add-form input { height:27px;border:1px solid #34313a;border-radius:6px;background:#0c0c10;color:#f4f5fa;padding:4px 7px;font:inherit;font-size:10px;outline:none; }
  .task-add-form input:focus { border-color:#ff5365;box-shadow:0 0 0 1px rgba(255,83,101,.2); }
  .task-input { flex:1;min-width:0; }
  .task-minutes { width:48px; }
  .task-add-form > span { color:#aeb4c5;font-size:9px; }
  .task-add-submit { height:27px;padding:0 9px;border:1px solid #ff5365;border-radius:6px;background:#260910;color:#ff9aa5;font-size:10px;cursor:pointer; }
  .task-list { display:flex;flex-direction:column;gap:3px; }
  .task { display:flex;align-items:center;gap:9px;min-height:27px;padding:3px 0;font-size:12px; }
  .task-toggle { display:grid;place-items:center;width:18px;height:18px;padding:0;border:2px solid #ff5365;border-radius:50%;background:transparent;color:#001b12;font-size:12px;font-weight:800;line-height:1;flex:none;cursor:pointer; }
  .task-toggle.done { background:#00e6a0;border-color:#00e6a0; }
  .task-text { flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
  .task small { margin-left:auto;font-size:10px;white-space:nowrap; }
  .task-remove { width:17px;height:17px;padding:0;border:1px solid #ff5365;border-radius:50%;background:#1a070c;color:white;font-size:12px;line-height:13px;cursor:pointer; }
  .task-remove { display:none; }
  .tasks.editing-tasks .task-remove { display:grid;place-items:center; }
  /* Learning Progress 2x2 Bento Grid */
  .learning {
    width: calc(100% - 130px);
    padding: 8px 12px 6px;
    display: flex;
    flex-direction: column;
    min-height: 192px;
    max-height: 192px;
    overflow-y: auto;
  }
  .learning::-webkit-scrollbar { width:4px; }
  .learning::-webkit-scrollbar-thumb { background:#ff263b; border-radius:2px; }

  .learning-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 5px;
    flex-wrap: wrap;
  }
  .learning-title-wrap {
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .learning-title-icon {
    width: 15px;
    height: 15px;
    color: #ff263b;
    filter: drop-shadow(0 0 5px rgba(255, 38, 59, 0.6));
    flex-shrink: 0;
  }
  .learning-title-wrap h3 {
    margin: 0;
    font-size: 14px;
    font-weight: 650;
    color: #f6f6fa;
    white-space: nowrap;
  }
  .learning-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-left: auto;
  }

  .weekly-tracker {
    display: inline-flex;
    align-items: center;
    gap: 1px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 38, 59, 0.2);
    border-radius: 5px;
    padding: 1px 4px;
  }
  .weekly-bracket {
    color: #ff5365;
    font-size: 10px;
    font-weight: 700;
  }
  .week-day-btn {
    background: none;
    border: none;
    padding: 1px 2px;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    font: inherit;
    line-height: 1;
  }
  .week-day-letter {
    font-size: 9px;
    font-weight: 700;
    color: #6a7182;
    transition: color 0.15s ease;
  }
  .week-day-dot {
    width: 3.5px;
    height: 3.5px;
    border-radius: 50%;
    background: #343744;
    margin-top: 1px;
    transition: all 0.2s ease;
  }
  .week-day-btn.active .week-day-letter {
    color: #e1e5f0;
  }
  .week-day-btn.active .week-day-dot {
    background: #00e6a0;
    box-shadow: 0 0 4px #00e6a0;
  }
  .week-day-btn.is-today {
    background: rgba(8, 186, 255, 0.12);
    border-radius: 3px;
    box-shadow: 0 0 4px rgba(8, 186, 255, 0.35);
  }
  .week-day-btn.is-today .week-day-letter {
    color: #08baff;
    font-weight: 800;
  }
  .week-day-btn.is-today .week-day-dot {
    background: #08baff;
    box-shadow: 0 0 4px #08baff;
  }
  .week-day-btn.is-today.active .week-day-dot {
    background: #00e6a0;
    box-shadow: 0 0 6px #00e6a0;
  }

  .learning-avg-badge {
    font-size: 10.5px;
    font-weight: 700;
    color: #08baff;
    background: rgba(8, 186, 255, 0.08);
    border: 1px solid rgba(8, 186, 255, 0.25);
    padding: 2px 5px;
    border-radius: 4px;
    white-space: nowrap;
  }
  .learning-streak-badge {
    font-size: 10.5px;
    font-weight: 700;
    color: #ffaa00;
    background: rgba(255, 170, 0, 0.08);
    border: 1px solid rgba(255, 170, 0, 0.25);
    padding: 2px 5px;
    border-radius: 4px;
    white-space: nowrap;
  }
  .learn-eye-btn {
    width: 18px;
    height: 18px;
    padding: 0;
    border: 1px solid rgba(8, 186, 255, 0.45);
    border-radius: 4px;
    background: #09131e;
    color: #08baff;
    font-size: 11px;
    line-height: 15px;
    cursor: pointer;
    display: grid;
    place-items: center;
  }
  .learn-eye-btn:hover, .learn-eye-btn.active {
    border-color: #08baff;
    color: #fff;
    background: #0d2238;
  }
  .learn-add-toggle {
    width: 18px;
    height: 18px;
    padding: 0;
    border: 1px solid rgba(255, 83, 101, 0.55);
    border-radius: 4px;
    background: #15090d;
    color: #ff7380;
    font-size: 14px;
    line-height: 15px;
    cursor: pointer;
    display: grid;
    place-items: center;
  }
  .learn-add-toggle:hover {
    border-color: #ff5365;
    color: #fff;
    background: #220910;
  }

    /* Fullscreen Learning Progress Command Center Overlay */
  .learn-expand-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    background: rgba(8, 186, 255, 0.14);
    border: 1px solid rgba(8, 186, 255, 0.6);
    border-radius: 5px;
    color: #08baff;
    cursor: pointer;
    padding: 0;
    margin-left: 4px;
    transition: all 0.15s ease;
    flex-shrink: 0;
  }
  .learn-expand-btn:hover {
    background: #08baff;
    color: #050608;
    box-shadow: 0 0 10px rgba(8, 186, 255, 0.85);
    transform: scale(1.08);
  }

  .learning-fullscreen-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999999;
    background: rgba(4, 5, 8, 0.96);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    display: flex;
    flex-direction: column;
    padding: 16px 28px 20px 24px;
    box-sizing: border-box;
    overflow: hidden;
    animation: fsOverlayFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes fsOverlayFadeIn {
    from { opacity: 0; transform: scale(0.992); }
    to { opacity: 1; transform: scale(1); }
  }

  .learning-fs-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(8, 186, 255, 0.25);
    flex-shrink: 0;
    height: 48px;
    box-sizing: border-box;
  }

  .learning-fs-title-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .learning-fs-icon {
    width: 22px;
    height: 22px;
    color: #08baff;
    filter: drop-shadow(0 0 8px rgba(8, 186, 255, 0.7));
    flex-shrink: 0;
  }

  .learning-fs-title-wrap h2 {
    margin: 0;
    font-size: 17px;
    font-weight: 750;
    color: #f6f6fa;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .learning-fs-mode-tag {
    font-size: 9.5px;
    font-weight: 700;
    color: #08baff;
    background: rgba(8, 186, 255, 0.12);
    border: 1px solid rgba(8, 186, 255, 0.4);
    padding: 2px 7px;
    border-radius: 4px;
    letter-spacing: 0.6px;
  }

  .learning-fs-topbar-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .learning-fs-btn {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(8, 186, 255, 0.35);
    border-radius: 6px;
    color: #8fdfff;
    font-size: 11px;
    font-weight: 600;
    padding: 5px 12px;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .learning-fs-btn:hover {
    background: rgba(8, 186, 255, 0.18);
    border-color: #08baff;
    color: #fff;
    box-shadow: 0 0 8px rgba(8, 186, 255, 0.4);
  }

  .learning-fs-btn.active {
    background: #08baff;
    border-color: #08baff;
    color: #050608;
    font-weight: 700;
  }

  .learning-fs-close-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 38, 59, 0.15);
    border: 1px solid #ff263b;
    border-radius: 6px;
    color: #ff8593;
    font-size: 11.5px;
    font-weight: 650;
    padding: 5px 12px;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .learning-fs-close-btn:hover {
    background: #ff263b;
    color: #fff;
    box-shadow: 0 0 10px rgba(255, 38, 59, 0.7);
  }

  .learning-fs-body {
    display: flex;
    flex: 1;
    height: calc(100vh - 85px);
    max-height: calc(100vh - 85px);
    gap: 20px;
    min-height: 0;
    padding-top: 14px;
    box-sizing: border-box;
    overflow: hidden;
  }

  .learning-fs-sidebar {
    width: 340px;
    height: 100%;
    max-height: 100%;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    padding: 14px;
    box-sizing: border-box;
    overflow-y: auto;
  }

  .learning-fs-sidebar::-webkit-scrollbar { width: 4px; }
  .learning-fs-sidebar::-webkit-scrollbar-thumb { background: #08baff; border-radius: 2px; }

  .learning-fs-sidebar-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 11.5px;
    font-weight: 750;
    color: #8e99ad;
    letter-spacing: 0.5px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    flex-shrink: 0;
  }

  .learning-fs-mini-add-btn {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    background: rgba(8, 186, 255, 0.15);
    border: 1px solid #08baff;
    color: #08baff;
    font-size: 13px;
    line-height: 1;
    cursor: pointer;
    display: grid;
    place-items: center;
    padding: 0;
  }

  .learning-fs-courses-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    overflow-y: auto;
    padding-right: 2px;
  }

  .learning-fs-course-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.025);
    border: 1px solid rgba(255, 255, 255, 0.06);
    cursor: pointer;
    transition: all 0.15s ease;
    flex-shrink: 0;
  }

  .learning-fs-course-card:hover {
    background: rgba(8, 186, 255, 0.06);
    border-color: rgba(8, 186, 255, 0.35);
  }

  .learning-fs-course-card.active {
    background: rgba(8, 186, 255, 0.12);
    border-color: #08baff;
    box-shadow: 0 0 10px rgba(8, 186, 255, 0.3);
  }

  .learning-fs-course-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .learning-fs-course-name {
    font-size: 12px;
    font-weight: 700;
    color: #f6f6fa;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .learning-fs-course-sub {
    font-size: 10px;
    color: #8e99ad;
  }

  .learning-fs-course-actions {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }

  .learning-fs-main {
    flex: 1;
    height: 100%;
    max-height: 100%;
    min-width: 0;
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.015);
    border: 1px solid rgba(8, 186, 255, 0.2);
    border-radius: 10px;
    padding: 20px 24px;
    box-sizing: border-box;
    overflow-y: auto;
  }

  .learning-fs-main::-webkit-scrollbar { width: 5px; }
  .learning-fs-main::-webkit-scrollbar-thumb { background: #08baff; border-radius: 3px; }

  .learning-fs-course-hero {
    display: flex;
    align-items: center;
    gap: 16px;
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    flex-shrink: 0;
  }

  .learning-fs-topics-grid {
    display: flex !important;
    flex-direction: column !important;
    gap: 10px !important;
    width: 100% !important;
    max-height: none !important;
    overflow-y: visible !important;
    padding-right: 0 !important;
    flex: 1 !important;
  }

  /* Fullscreen Scale-Up for Fonts & Icons */
  .learning-fullscreen-overlay .learning-fs-topbar {
    height: 56px;
    padding-bottom: 12px;
  }
  .learning-fullscreen-overlay .learning-fs-icon {
    width: 26px;
    height: 26px;
  }
  .learning-fullscreen-overlay .learning-fs-title-wrap h2 {
    font-size: 20px;
  }
  .learning-fullscreen-overlay .learning-fs-mode-tag {
    font-size: 11px;
    padding: 3px 8px;
  }
  .learning-fullscreen-overlay .weekly-tracker {
    gap: 4px;
  }
  .learning-fullscreen-overlay .week-day-btn {
    width: 24px;
    height: 28px;
  }
  .learning-fullscreen-overlay .week-day-letter {
    font-size: 12px;
  }
  .learning-fullscreen-overlay .learning-avg-badge,
  .learning-fullscreen-overlay .learning-streak-badge {
    font-size: 13.5px;
    padding: 5px 12px;
  }
  .learning-fullscreen-overlay .learning-fs-btn {
    font-size: 13px;
    padding: 7px 16px;
  }
  .learning-fullscreen-overlay .learning-fs-close-btn {
    font-size: 13px;
    padding: 7px 16px;
    gap: 8px;
  }
  .learning-fullscreen-overlay .learning-fs-close-btn svg {
    width: 16px;
    height: 16px;
  }

  /* Fullscreen Sidebar */
  .learning-fullscreen-overlay .learning-fs-sidebar {
    width: 380px !important;
    padding: 16px !important;
  }
  .learning-fullscreen-overlay .learning-fs-sidebar-title {
    font-size: 14px;
    padding-bottom: 10px;
  }
  .learning-fullscreen-overlay .learning-fs-mini-add-btn {
    width: 26px;
    height: 26px;
    font-size: 16px;
  }
  .learning-fullscreen-overlay .learning-fs-course-card {
    padding: 12px 14px;
    gap: 14px;
  }
  .learning-fullscreen-overlay .learning-fs-course-card .course-ring {
    width: 46px !important;
    height: 46px !important;
    font-size: 12.5px !important;
  }
  .learning-fullscreen-overlay .learning-fs-course-name {
    font-size: 14.5px;
    font-weight: 750;
    white-space: normal;
    line-height: 1.3;
  }
  .learning-fullscreen-overlay .learning-fs-course-sub {
    font-size: 12px;
    margin-top: 2px;
  }
  .learning-fullscreen-overlay .learning-fs-course-actions .course-tool-btn {
    width: 26px;
    height: 26px;
    font-size: 14px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #a8b3cf;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
  }
  .learning-fullscreen-overlay .learning-fs-course-actions .course-tool-btn:hover {
    background: rgba(8, 186, 255, 0.18);
    color: #fff;
    border-color: #08baff;
  }

  /* Fullscreen Main Studio Header & Hero */
  .learning-fullscreen-overlay .learning-fs-course-hero {
    gap: 20px;
    padding-bottom: 18px;
  }
  .learning-fullscreen-overlay .learning-fs-course-hero .course-ring.large {
    width: 68px !important;
    height: 68px !important;
    font-size: 16px !important;
  }
  .learning-fullscreen-overlay .learning-fs-course-hero h3 {
    font-size: 22px !important;
  }
  .learning-fullscreen-overlay .learning-fs-course-hero .course-edit-title-btn {
    font-size: 17px;
    width: 32px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: all 0.15s ease;
  }
  .learning-fullscreen-overlay .learning-fs-course-hero .course-edit-title-btn:hover {
    background: rgba(8, 186, 255, 0.15);
    color: #08baff;
  }
  .learning-fullscreen-overlay .learning-fs-course-hero .focused-course-title-row.is-editing {
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
    width: 100% !important;
  }
  .learning-fullscreen-overlay .learning-fs-course-hero .course-inline-edit-input {
    font-size: 20px !important;
    font-weight: 700 !important;
    height: 38px !important;
    padding: 4px 10px !important;
    border-radius: 6px !important;
    background: #06070a !important;
    border: 1px solid #08baff !important;
    box-shadow: 0 0 10px rgba(8, 186, 255, 0.35) !important;
    color: #f6f6fa !important;
  }
  .learning-fullscreen-overlay .learning-fs-course-hero .course-edit-title-btn.save {
    color: #00e6a0 !important;
    background: rgba(0, 230, 160, 0.12) !important;
    border: 1px solid #00e6a0 !important;
    font-size: 18px !important;
  }
  .learning-fullscreen-overlay .learning-fs-course-hero .course-edit-title-btn.save:hover {
    background: #00e6a0 !important;
    color: #050608 !important;
    box-shadow: 0 0 8px rgba(0, 230, 160, 0.6) !important;
  }
  .learning-fullscreen-overlay .learning-fs-course-hero .course-edit-title-btn.cancel {
    color: #ff5365 !important;
    background: rgba(255, 83, 101, 0.12) !important;
    border: 1px solid #ff5365 !important;
    font-size: 18px !important;
  }
  .learning-fullscreen-overlay .learning-fs-course-hero .course-edit-title-btn.cancel:hover {
    background: #ff5365 !important;
    color: #fff !important;
    box-shadow: 0 0 8px rgba(255, 83, 101, 0.6) !important;
  }
  .learning-fullscreen-overlay .focused-course-stats {
    font-size: 13.5px !important;
    margin-top: 4px !important;
  }
  .learning-fullscreen-overlay .learning-fs-course-hero .course-actions {
    gap: 8px !important;
  }
  .learning-fullscreen-overlay .learning-fs-course-hero .course-tool-btn {
    width: 34px !important;
    height: 34px !important;
    font-size: 17px !important;
    background: rgba(255, 255, 255, 0.05) !important;
    border: 1px solid rgba(8, 186, 255, 0.35) !important;
    color: #8fdfff !important;
    border-radius: 6px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: all 0.15s ease !important;
  }
  .learning-fullscreen-overlay .learning-fs-course-hero .course-tool-btn:hover {
    background: rgba(8, 186, 255, 0.22) !important;
    color: #fff !important;
    border-color: #08baff !important;
    box-shadow: 0 0 8px rgba(8, 186, 255, 0.5) !important;
  }

  /* Add Main Topic Form */
  .learning-fullscreen-overlay .focused-add-topic-form {
    padding: 12px 16px !important;
    margin: 16px 0 !important;
    gap: 10px !important;
  }
  .learning-fullscreen-overlay .focused-topic-input {
    height: 40px !important;
    font-size: 14px !important;
    padding: 6px 14px !important;
  }
  .learning-fullscreen-overlay .focused-topic-submit {
    height: 40px !important;
    font-size: 13.5px !important;
    padding: 0 20px !important;
  }

  /* Syllabus Header */
  .learning-fullscreen-overlay .focused-syllabus-header h5 {
    font-size: 15px !important;
  }
  .learning-fullscreen-overlay .focused-syllabus-hint {
    font-size: 12.5px !important;
  }

  /* Topic Cards & Titles */
  .learning-fullscreen-overlay .learning-fs-card {
    padding: 14px 18px !important;
  }
  .learning-fullscreen-overlay .learning-fs-card .topic-num {
    font-size: 15.5px !important;
    font-weight: 800 !important;
  }
  .learning-fullscreen-overlay .learning-fs-card .topic-icon {
    font-size: 16px !important;
    width: 24px !important;
    height: 24px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  .learning-fullscreen-overlay .learning-fs-card .topic-bullet {
    font-size: 20px !important;
    color: #08baff !important;
    margin-right: 2px !important;
  }
  .learning-fullscreen-overlay .learning-fs-card .topic-expand-btn {
    width: 28px !important;
    height: 28px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    color: #08baff !important;
    background: rgba(8, 186, 255, 0.12) !important;
    border: 1px solid rgba(8, 186, 255, 0.35) !important;
    border-radius: 5px !important;
    cursor: pointer !important;
    transition: all 0.15s ease !important;
    flex-shrink: 0 !important;
    padding: 0 !important;
  }
  .learning-fullscreen-overlay .learning-fs-card .topic-expand-btn:hover {
    background: rgba(8, 186, 255, 0.25) !important;
    border-color: #08baff !important;
    box-shadow: 0 0 8px rgba(8, 186, 255, 0.5) !important;
  }
  .learning-fullscreen-overlay .learning-fs-card .topic-text {
    font-size: 15.5px !important;
    line-height: 1.5 !important;
    font-weight: 700 !important;
  }
  .learning-fullscreen-overlay .learning-fs-card .topic-sub-counter {
    font-size: 13.5px !important;
    font-weight: 700 !important;
  }
  .learning-fullscreen-overlay .learning-fs-card .topic-action-btn {
    width: 28px !important;
    height: 28px !important;
    font-size: 15px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    color: #c0ccdf !important;
    background: rgba(255, 255, 255, 0.05) !important;
    border: 1px solid rgba(255, 255, 255, 0.12) !important;
    border-radius: 5px !important;
    cursor: pointer !important;
    transition: all 0.15s ease !important;
  }
  .learning-fullscreen-overlay .learning-fs-card .topic-action-btn:hover {
    background: rgba(8, 186, 255, 0.18) !important;
    border-color: #08baff !important;
    color: #fff !important;
  }
  .learning-fullscreen-overlay .learning-fs-card .topic-action-btn.add:hover {
    color: #00e6a0 !important;
    border-color: #00e6a0 !important;
  }
  .learning-fullscreen-overlay .learning-fs-card .topic-action-btn.edit:hover {
    color: #08baff !important;
    border-color: #08baff !important;
  }
  .learning-fullscreen-overlay .learning-fs-card .topic-action-btn.del:hover {
    color: #ff5365 !important;
    border-color: #ff5365 !important;
  }

  /* Subtopics */
  .learning-fullscreen-overlay .learning-fs-card .subtopic-item {
    padding: 8px 14px !important;
    margin-bottom: 5px !important;
  }
  .learning-fullscreen-overlay .learning-fs-card .subtopic-icon {
    font-size: 14px !important;
    width: 20px !important;
    height: 20px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  .learning-fullscreen-overlay .learning-fs-card .subtopic-expand-btn {
    width: 24px !important;
    height: 24px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    color: #00e6a0 !important;
    background: rgba(0, 230, 160, 0.12) !important;
    border: 1px solid rgba(0, 230, 160, 0.35) !important;
    border-radius: 4px !important;
    cursor: pointer !important;
    transition: all 0.15s ease !important;
    flex-shrink: 0 !important;
    padding: 0 !important;
  }
  .learning-fullscreen-overlay .learning-fs-card .subtopic-expand-btn:hover {
    background: rgba(0, 230, 160, 0.25) !important;
    border-color: #00e6a0 !important;
    box-shadow: 0 0 8px rgba(0, 230, 160, 0.5) !important;
  }
  .learning-fullscreen-overlay .learning-fs-card .subtopic-bullet {
    font-size: 16px !important;
    color: #00e6a0 !important;
    margin-right: 2px !important;
  }
  .learning-fullscreen-overlay .learning-fs-card .subtopic-name {
    font-size: 14px !important;
    line-height: 1.45 !important;
    font-weight: 650 !important;
  }
  .learning-fullscreen-overlay .learning-fs-card .subtopic-counter {
    font-size: 12.5px !important;
    font-weight: 700 !important;
  }
  .learning-fullscreen-overlay .learning-fs-card .subtopic-btn {
    width: 26px !important;
    height: 26px !important;
    font-size: 14px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    color: #b5c2db !important;
    background: rgba(255, 255, 255, 0.04) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    border-radius: 4px !important;
    cursor: pointer !important;
    transition: all 0.15s ease !important;
  }
  .learning-fullscreen-overlay .learning-fs-card .subtopic-btn:hover {
    background: rgba(8, 186, 255, 0.18) !important;
    border-color: #08baff !important;
    color: #fff !important;
  }
  .learning-fullscreen-overlay .learning-fs-card .subtopic-btn.add:hover {
    color: #00e6a0 !important;
    border-color: #00e6a0 !important;
  }
  .learning-fullscreen-overlay .learning-fs-card .subtopic-btn.edit:hover {
    color: #08baff !important;
    border-color: #08baff !important;
  }
  .learning-fullscreen-overlay .learning-fs-card .subtopic-btn.del:hover {
    color: #ff5365 !important;
    border-color: #ff5365 !important;
  }

  .learning-fullscreen-overlay .learning-fs-card .subtopic-quick-add {
    margin-top: 8px !important;
    gap: 6px !important;
  }
  .learning-fullscreen-overlay .learning-fs-card .subtopic-add-input {
    height: 34px !important;
    font-size: 13px !important;
    padding: 6px 12px !important;
    background: rgba(9, 10, 13, 0.8) !important;
    border: 1px solid rgba(8, 186, 255, 0.25) !important;
    color: #f4f5fa !important;
  }
  .learning-fullscreen-overlay .learning-fs-card .subtopic-add-btn {
    height: 34px !important;
    font-size: 12.5px !important;
    padding: 0 16px !important;
    background: rgba(8, 186, 255, 0.12) !important;
    border: 1px solid #08baff !important;
    color: #08baff !important;
    font-weight: 700 !important;
    border-radius: 4px !important;
  }

  /* Sub-Subtopics (Level 3 Descriptions & Notes) */
  .learning-fullscreen-overlay .learning-fs-card .subsubtopic-item {
    padding: 8px 12px !important;
    margin-bottom: 4px !important;
  }
  .learning-fullscreen-overlay .learning-fs-card .subsubtopic-toggle {
    display: flex !important;
    align-items: flex-start !important;
    gap: 8px !important;
  }
  .learning-fullscreen-overlay .learning-fs-card .subsubtopic-icon {
    width: 22px !important;
    height: 22px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-shrink: 0 !important;
    margin-top: 1px !important;
    background: rgba(255, 170, 0, 0.12) !important;
    border: 1px solid rgba(255, 170, 0, 0.35) !important;
    border-radius: 4px !important;
    transition: all 0.15s ease !important;
  }
  .learning-fullscreen-overlay .learning-fs-card .subsubtopic-icon.is-done {
    background: rgba(0, 230, 160, 0.14) !important;
    border-color: rgba(0, 230, 160, 0.4) !important;
  }
  .learning-fullscreen-overlay .learning-fs-card .subtopic-bullet {
    font-size: 20px !important;
    color: #00e6a0 !important;
    width: 22px !important;
    text-align: center !important;
    line-height: 1 !important;
  }
  .learning-fullscreen-overlay .learning-fs-card .topic-bullet {
    font-size: 22px !important;
    color: #08baff !important;
    width: 24px !important;
    text-align: center !important;
    line-height: 1 !important;
  }
  .learning-fullscreen-overlay .learning-fs-card .subsubtopic-name {
    font-size: 13.5px !important;
    line-height: 1.55 !important;
    font-weight: 450 !important;
    color: #cfd8e8 !important;
  }
  .learning-fullscreen-overlay .learning-fs-card .subsubtopic-btn {
    width: 24px !important;
    height: 24px !important;
    font-size: 13px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    color: #b5c2db !important;
    background: rgba(255, 255, 255, 0.03) !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    border-radius: 4px !important;
    cursor: pointer !important;
    transition: all 0.15s ease !important;
  }
  .learning-fullscreen-overlay .learning-fs-card .subsubtopic-btn:hover {
    color: #08baff !important;
    background: rgba(8, 186, 255, 0.18) !important;
    border-color: #08baff !important;
  }
  .learning-fullscreen-overlay .learning-fs-card .subsubtopic-btn.del:hover {
    color: #ff5365 !important;
    border-color: #ff5365 !important;
  }

  .learning-fullscreen-overlay .learning-fs-card .subsubtopic-quick-add {
    margin-top: 6px !important;
    gap: 6px !important;
  }
  .learning-fullscreen-overlay .learning-fs-card .subsubtopic-add-input {
    height: 30px !important;
    font-size: 12.5px !important;
    padding: 4px 10px !important;
    background: rgba(7, 8, 11, 0.8) !important;
    border: 1px solid rgba(0, 230, 160, 0.25) !important;
    color: #f4f5fa !important;
  }
  .learning-fullscreen-overlay .learning-fs-card .subsubtopic-add-btn {
    height: 30px !important;
    font-size: 12px !important;
    padding: 0 14px !important;
    background: rgba(0, 230, 160, 0.12) !important;
    border: 1px solid #00e6a0 !important;
    color: #00e6a0 !important;
    font-weight: 700 !important;
    border-radius: 4px !important;
  }

  /* Inline Textarea Editors */
  .learning-fullscreen-overlay .topic-inline-edit-input {
    font-size: 15px !important;
    line-height: 1.5 !important;
    min-height: 85px !important;
  }
  .learning-fullscreen-overlay .subtopic-inline-edit-input {
    font-size: 14px !important;
    line-height: 1.45 !important;
    min-height: 70px !important;
  }
  .learning-fullscreen-overlay .subsubtopic-inline-edit-input {
    font-size: 13.5px !important;
    line-height: 1.45 !important;
    min-height: 60px !important;
  }

  .learning-fs-global-matrix {
    flex: 1;
    height: calc(100vh - 64px);
    max-height: calc(100vh - 64px);
    min-height: 0;
    overflow-y: auto;
    padding: 16px 28px 40px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .learning-fs-global-matrix::-webkit-scrollbar {
    width: 6px;
  }
  .learning-fs-global-matrix::-webkit-scrollbar-thumb {
    background: rgba(8, 186, 255, 0.25);
    border-radius: 4px;
  }
  .learning-fs-global-matrix::-webkit-scrollbar-thumb:hover {
    background: rgba(8, 186, 255, 0.55);
  }

  /* Matrix Hero Banner */
  .matrix-hero-banner {
    background: linear-gradient(135deg, rgba(8, 186, 255, 0.08) 0%, rgba(13, 17, 26, 0.9) 60%, rgba(10, 14, 22, 0.95) 100%);
    border: 1px solid rgba(8, 186, 255, 0.35);
    border-radius: 14px;
    padding: 18px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.08);
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
  }
  .matrix-hero-banner::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, #00f0ff, #00e6a0);
    box-shadow: 0 0 12px #00f0ff;
  }
  .matrix-hero-info {
    flex: 1;
    min-width: 0;
  }
  .matrix-hero-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(8, 186, 255, 0.12);
    border: 1px solid rgba(8, 186, 255, 0.4);
    border-radius: 4px;
    padding: 3px 8px;
    font-size: 10.5px;
    font-weight: 700;
    color: #00f0ff;
    letter-spacing: 0.8px;
    margin-bottom: 6px;
  }
  .matrix-hero-tag-icon {
    font-size: 11px;
    color: #00f0ff;
    text-shadow: 0 0 8px rgba(0, 240, 255, 0.8);
  }
  .matrix-hero-title {
    margin: 0 0 4px 0;
    font-size: 19px;
    font-weight: 800;
    color: #f8f9fc;
    letter-spacing: -0.3px;
  }
  .matrix-hero-desc {
    margin: 0;
    font-size: 12px;
    color: #94a3b8;
    line-height: 1.4;
    max-width: 720px;
  }
  .matrix-hero-stats {
    display: flex;
    align-items: center;
    gap: 16px;
    background: rgba(5, 7, 12, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    padding: 10px 16px;
    flex-shrink: 0;
  }
  .matrix-stat-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 55px;
  }
  .matrix-stat-num {
    font-size: 20px;
    font-weight: 800;
    color: #f8f9fc;
    line-height: 1.1;
  }
  .matrix-stat-lbl {
    font-size: 9.5px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 2px;
  }
  .matrix-stat-divider {
    width: 1px;
    height: 28px;
    background: rgba(255, 255, 255, 0.1);
  }
  .matrix-return-btn {
    background: rgba(8, 186, 255, 0.14);
    border: 1px solid rgba(8, 186, 255, 0.5);
    border-radius: 6px;
    color: #00f0ff;
    padding: 8px 14px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s ease;
    white-space: nowrap;
  }
  .matrix-return-btn:hover {
    background: #00f0ff;
    color: #07090e;
    box-shadow: 0 0 16px rgba(0, 240, 255, 0.6);
    transform: translateY(-1px);
  }


  /* Projects Global Matrix Fullscreen View */
  .projects-fs-global-matrix {
    flex: 1;
    height: calc(100vh - 64px);
    max-height: calc(100vh - 64px);
    min-height: 0;
    overflow-y: auto;
    padding: 16px 28px 40px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .projects-fs-global-matrix::-webkit-scrollbar {
    width: 6px;
  }
  .projects-fs-global-matrix::-webkit-scrollbar-thumb {
    background: rgba(255, 170, 0, 0.25);
    border-radius: 4px;
  }

  /* Career Tracker Row-Wise Levels */
  .career-fs-rounds-rows {
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex: 1;
    overflow-y: auto;
    padding-right: 4px;
  }
  .career-fs-round-row {
    background: rgba(13, 17, 26, 0.85);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 14px 18px;
    display: flex;
    align-items: center;
    gap: 20px;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  }
  .career-fs-round-row:hover {
    border-color: rgba(255, 255, 255, 0.18);
    box-shadow: 0 6px 22px rgba(0, 0, 0, 0.45);
    transform: translateY(-1px);
  }
  .career-fs-round-row.is-done {
    border-color: rgba(0, 230, 160, 0.35);
    background: linear-gradient(90deg, rgba(0, 230, 160, 0.06) 0%, rgba(13, 17, 26, 0.85) 40%);
  }
  .career-fs-round-row.is-active {
    border-color: rgba(255, 170, 0, 0.5);
    background: linear-gradient(90deg, rgba(255, 170, 0, 0.08) 0%, rgba(13, 17, 26, 0.85) 40%);
    box-shadow: 0 0 16px rgba(255, 170, 0, 0.15);
  }
  .career-fs-row-left {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 140px;
    flex-shrink: 0;
  }
  .career-fs-level-badge-wrap {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .career-fs-level-pill {
    font-size: 10px;
    font-weight: 800;
    color: #64748b;
    letter-spacing: 0.6px;
  }
  .career-fs-row-center {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .career-fs-round-name {
    margin: 0;
    font-size: 14.5px;
    font-weight: 750;
    color: #f1f5f9;
  }
  .career-fs-round-subtext {
    font-size: 12.5px;
    color: #94a3b8;
    line-height: 1.4;
    cursor: pointer;
    border-radius: 4px;
    padding: 2px 4px;
    transition: background 0.15s ease;
  }
  .career-fs-round-subtext:hover {
    background: rgba(255, 255, 255, 0.04);
    color: #f1f5f9;
  }
  .career-fs-row-right {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }
  .career-fs-cycle-btn {
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 11.5px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s ease;
    border: 1px solid transparent;
  }
  .career-fs-cycle-btn.status-pending {
    background: rgba(255, 170, 0, 0.12);
    border-color: rgba(255, 170, 0, 0.35);
    color: #ffaa00;
  }
  .career-fs-cycle-btn.status-pending:hover {
    background: #ffaa00;
    color: #07090e;
    box-shadow: 0 0 12px rgba(255, 170, 0, 0.5);
  }
  .career-fs-cycle-btn.status-active {
    background: rgba(0, 230, 160, 0.14);
    border-color: rgba(0, 230, 160, 0.4);
    color: #00e6a0;
  }
  .career-fs-cycle-btn.status-active:hover {
    background: #00e6a0;
    color: #07090e;
    box-shadow: 0 0 12px rgba(0, 230, 160, 0.6);
  }
  .career-fs-cycle-btn.status-done {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.15);
    color: #8e99ad;
  }
  .career-fs-cycle-btn.status-done:hover {
    background: rgba(255, 255, 255, 0.12);
    color: #f1f5f9;
  }


  /* Gate Tasks & Subtasks CRUD Styles */
  .gate-action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    padding: 0;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 700;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #94a3b8;
    cursor: pointer;
    transition: all 0.12s ease;
  }
  .gate-action-btn:hover {
    background: rgba(255, 255, 255, 0.14);
    color: #f1f5f9;
  }
  .gate-action-btn.add-sub {
    font-size: 9px;
    width: auto;
    padding: 1px 4px;
    color: #00e6a0;
    border-color: rgba(0, 230, 160, 0.25);
    background: rgba(0, 230, 160, 0.06);
  }
  .gate-action-btn.add-sub:hover {
    background: rgba(0, 230, 160, 0.2);
    border-color: #00e6a0;
    color: #fff;
    box-shadow: 0 0 6px rgba(0, 230, 160, 0.4);
  }
  .gate-action-btn.edit:hover {
    background: rgba(56, 189, 248, 0.2);
    border-color: rgba(56, 189, 248, 0.4);
    color: #38bdf8;
  }
  .gate-action-btn.delete:hover {
    background: rgba(239, 68, 68, 0.25);
    border-color: rgba(239, 68, 68, 0.5);
    color: #ef4444;
  }
  .gate-inline-input {
    background: #090d14 !important;
    border: 1px solid rgba(255, 170, 0, 0.4) !important;
    color: #f8fafc !important;
    font-size: 11.5px !important;
    padding: 3px 8px !important;
    border-radius: 4px !important;
    outline: none !important;
    font-family: inherit !important;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.5);
  }
  .gate-inline-input:focus {
    border-color: #ffaa00 !important;
    box-shadow: 0 0 8px rgba(255, 170, 0, 0.3) !important;
  }
  .gate-inline-save-btn {
    background: #00e6a0 !important;
    color: #050608 !important;
    font-size: 11px !important;
    font-weight: 750 !important;
    padding: 3px 8px !important;
    border-radius: 4px !important;
    border: none !important;
    cursor: pointer !important;
    transition: all 0.12s ease !important;
  }
  .gate-inline-save-btn:hover {
    background: #34d399 !important;
    box-shadow: 0 0 8px rgba(0, 230, 160, 0.5) !important;
  }
  .gate-inline-cancel-btn {
    background: rgba(255, 255, 255, 0.08) !important;
    color: #94a3b8 !important;
    font-size: 11px !important;
    font-weight: 700 !important;
    padding: 3px 7px !important;
    border-radius: 4px !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    cursor: pointer !important;
    transition: all 0.12s ease !important;
  }
  .gate-inline-cancel-btn:hover {
    background: rgba(255, 255, 255, 0.16) !important;
    color: #f1f5f9 !important;
  }
  .gate-add-task-btn {
    width: 100%;
    background: rgba(255, 170, 0, 0.05);
    border: 1px dashed rgba(255, 170, 0, 0.3);
    color: #ffaa00;
    font-size: 11px;
    font-weight: 700;
    padding: 5px 8px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    margin-top: 4px;
  }
  .gate-add-task-btn:hover {
    background: rgba(255, 170, 0, 0.14);
    border-color: #ffaa00;
    box-shadow: 0 0 10px rgba(255, 170, 0, 0.25);
    color: #ffbb22;
  }


  /* ==========================================================================
     CYBERPUNK HIGH-FIDELITY ARCHITECTURE GATE STUDIO & TASKS UX
     ========================================================================== */
  .projects-fs-gates-studio {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex: 1;
  }
  .projects-fs-gates-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }
  .projects-fs-gates-header h4 {
    margin: 0;
    font-size: 15px;
    font-weight: 750;
    letter-spacing: 0.3px;
    color: #f8fafc;
  }
  .projects-fs-gates-header span {
    font-size: 12.5px;
    color: #94a3b8;
  }
  .projects-fs-filter-pills {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .gate-filter-pill {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #94a3b8;
    font-size: 11.5px;
    font-weight: 700;
    padding: 5px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .gate-filter-pill:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #f1f5f9;
  }
  .gate-filter-pill.active {
    background: rgba(255, 170, 0, 0.15);
    border-color: #ffaa00;
    color: #ffaa00;
    box-shadow: 0 0 10px rgba(255, 170, 0, 0.25);
  }
  .gate-filter-pill.active.passed {
    background: rgba(0, 230, 160, 0.15);
    border-color: #00e6a0;
    color: #00e6a0;
    box-shadow: 0 0 10px rgba(0, 230, 160, 0.25);
  }
  .gate-filter-pill.active.pending {
    background: rgba(245, 158, 11, 0.15);
    border-color: #f59e0b;
    color: #f59e0b;
    box-shadow: 0 0 10px rgba(245, 158, 11, 0.25);
  }

  .projects-fullscreen-overlay .projects-fs-gates-grid {
    display: grid !important;
    grid-template-columns: repeat(auto-fit, minmax(330px, 1fr)) !important;
    gap: 16px !important;
    align-content: start;
    flex: 1;
  }

  .projects-fs-gate-card {
    background: linear-gradient(145deg, rgba(17, 24, 39, 0.6) 0%, rgba(9, 13, 20, 0.85) 100%) !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    border-radius: 10px !important;
    padding: 16px 18px !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 12px !important;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25) !important;
    position: relative !important;
    backdrop-filter: blur(8px) !important;
  }
  .projects-fs-gate-card:hover {
    border-color: rgba(255, 170, 0, 0.35) !important;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35), 0 0 12px rgba(255, 170, 0, 0.15) !important;
    transform: translateY(-1px) !important;
  }
  .projects-fs-gate-card.is-passed {
    border-color: rgba(0, 230, 160, 0.3) !important;
    background: linear-gradient(145deg, rgba(6, 78, 59, 0.12) 0%, rgba(9, 13, 20, 0.85) 100%) !important;
  }
  .projects-fs-gate-card.is-passed:hover {
    border-color: #00e6a0 !important;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35), 0 0 16px rgba(0, 230, 160, 0.2) !important;
  }

  .projects-fs-gate-top {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .projects-fs-gate-check-btn {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.04);
    border: 1.5px solid rgba(255, 255, 255, 0.2);
    display: grid;
    place-items: center;
    cursor: pointer;
    color: #050608;
    transition: all 0.15s ease;
    padding: 0;
    flex-shrink: 0;
  }
  .projects-fs-gate-check-btn:hover {
    border-color: #ffaa00;
    box-shadow: 0 0 8px rgba(255, 170, 0, 0.4);
  }
  .projects-fs-gate-check-btn.checked {
    background: linear-gradient(135deg, #00e6a0, #059669);
    border-color: #00e6a0;
    color: #050608;
    box-shadow: 0 0 10px rgba(0, 230, 160, 0.4);
  }
  .gate-check-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.25);
    transition: all 0.15s ease;
  }
  .projects-fs-gate-check-btn:hover .gate-check-dot {
    background: #ffaa00;
    box-shadow: 0 0 6px #ffaa00;
  }

  .gate-badge-group {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
  }
  .projects-fs-gate-num {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.6px;
    color: #ffaa00;
    background: rgba(255, 170, 0, 0.1);
    border: 1px solid rgba(255, 170, 0, 0.25);
    padding: 2px 7px;
    border-radius: 4px;
    font-family: monospace;
  }
  .projects-fs-gate-card.is-passed .projects-fs-gate-num {
    color: #00e6a0;
    background: rgba(0, 230, 160, 0.1);
    border-color: rgba(0, 230, 160, 0.3);
  }
  .projects-fs-gate-status-pill {
    font-size: 10.5px;
    font-weight: 750;
    padding: 2px 8px;
    border-radius: 4px;
    letter-spacing: 0.4px;
    border: 1px solid transparent;
  }
  .projects-fs-gate-status-pill.passed {
    background: rgba(0, 230, 160, 0.12);
    border-color: rgba(0, 230, 160, 0.35);
    color: #00e6a0;
  }
  .projects-fs-gate-status-pill.active {
    background: rgba(255, 170, 0, 0.12);
    border-color: rgba(255, 170, 0, 0.35);
    color: #ffaa00;
  }
  .projects-fs-gate-status-pill.pending {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.1);
    color: #64748b;
  }

  .gate-top-right {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-left: auto;
  }
  .gate-counter-pill {
    font-size: 11px;
    font-weight: 700;
    color: #ffaa00;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 2px 8px;
    border-radius: 4px;
    font-family: monospace;
  }
  .gate-counter-pill.passed {
    color: #00e6a0;
    border-color: rgba(0, 230, 160, 0.3);
    background: rgba(0, 230, 160, 0.08);
  }
  .gate-expand-toggle-btn {
    width: 22px;
    height: 22px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #94a3b8;
    display: grid;
    place-items: center;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .gate-expand-toggle-btn:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #f1f5f9;
  }

  .gate-info-block {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .projects-fs-gate-title {
    margin: 0;
    font-size: 14.5px;
    font-weight: 750;
    color: #f8fafc;
    letter-spacing: 0.2px;
  }
  .projects-fs-gate-desc {
    margin: 0;
    font-size: 12px;
    color: #94a3b8;
    line-height: 1.45;
  }
  .gate-micro-bar-track {
    height: 3px;
    width: 100%;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 2px;
    overflow: hidden;
    margin-top: 4px;
  }
  .gate-micro-bar-fill {
    height: 100%;
    transition: width 0.3s ease;
    border-radius: 2px;
  }
  .gate-micro-bar-fill.passed {
    background: linear-gradient(90deg, #00e6a0, #34d399);
    box-shadow: 0 0 6px rgba(0, 230, 160, 0.6);
  }
  .gate-micro-bar-fill.active {
    background: linear-gradient(90deg, #ffaa00, #fbbf24);
    box-shadow: 0 0 6px rgba(255, 170, 0, 0.6);
  }

  /* Tasks Container */
  .gate-tasks-container {
    margin-top: 4px;
    border-top: 1px solid rgba(255, 255, 255, 0.07);
    padding-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .gate-empty-tasks {
    font-size: 11.5px;
    color: #64748b;
    font-style: italic;
    padding: 6px 0;
  }

  /* Individual Task Item Card */
  .gate-task-item {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 7px;
    padding: 7px 10px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    transition: all 0.15s ease;
  }
  .gate-task-item:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.12);
  }
  .gate-task-item.is-done {
    background: rgba(0, 230, 160, 0.03);
    border-color: rgba(0, 230, 160, 0.2);
  }
  .gate-task-item.is-done:hover {
    border-color: rgba(0, 230, 160, 0.4);
    box-shadow: 0 0 8px rgba(0, 230, 160, 0.1);
  }

  .gate-task-header-row {
    display: flex;
    align-items: center;
    gap: 9px;
  }
  .gate-task-check {
    width: 17px;
    height: 17px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.04);
    border: 1.5px solid rgba(255, 255, 255, 0.2);
    display: grid;
    place-items: center;
    cursor: pointer;
    color: #050608;
    padding: 0;
    flex-shrink: 0;
    transition: all 0.12s ease;
  }
  .gate-task-check:hover {
    border-color: #00e6a0;
    box-shadow: 0 0 6px rgba(0, 230, 160, 0.3);
  }
  .gate-task-check.checked {
    background: #00e6a0;
    border-color: #00e6a0;
    color: #050608;
    box-shadow: 0 0 6px rgba(0, 230, 160, 0.4);
  }

  .gate-task-title {
    font-size: 12.5px;
    font-weight: 650;
    color: #f1f5f9;
    flex: 1;
    line-height: 1.35;
    cursor: pointer;
    transition: color 0.12s ease;
  }
  .gate-task-title:hover {
    color: #00e6a0;
  }
  .gate-task-title.completed {
    color: #94a3b8;
    text-decoration: line-through;
    text-decoration-color: rgba(148, 163, 175, 0.4);
  }

  .gate-sub-count-tag {
    font-size: 9.5px;
    font-weight: 750;
    color: #ffaa00;
    background: rgba(255, 170, 0, 0.1);
    border: 1px solid rgba(255, 170, 0, 0.25);
    padding: 1px 5px;
    border-radius: 4px;
    font-family: monospace;
  }
  .gate-sub-count-tag.done {
    color: #00e6a0;
    background: rgba(0, 230, 160, 0.1);
    border-color: rgba(0, 230, 160, 0.25);
  }

  /* Task Action Buttons Hover Reveal */
  .gate-task-actions {
    display: flex;
    align-items: center;
    gap: 4px;
    opacity: 0;
    transition: opacity 0.15s ease;
  }
  .gate-task-item:hover .gate-task-actions,
  .gate-subtask-row:hover .gate-sub-actions {
    opacity: 1;
  }

  .gate-act-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    font-size: 11px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #94a3b8;
    cursor: pointer;
    padding: 0;
    transition: all 0.12s ease;
  }
  .gate-act-btn:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #f1f5f9;
  }
  .gate-act-btn.add-sub {
    width: auto;
    padding: 2px 5px;
    font-size: 9.5px;
    font-weight: 750;
    color: #00e6a0;
    background: rgba(0, 230, 160, 0.08);
    border-color: rgba(0, 230, 160, 0.25);
  }
  .gate-act-btn.add-sub:hover {
    background: rgba(0, 230, 160, 0.25);
    border-color: #00e6a0;
    color: #fff;
    box-shadow: 0 0 8px rgba(0, 230, 160, 0.4);
  }
  .gate-act-btn.edit:hover {
    background: rgba(56, 189, 248, 0.2);
    border-color: #38bdf8;
    color: #38bdf8;
  }
  .gate-act-btn.delete:hover {
    background: rgba(239, 68, 68, 0.25);
    border-color: #ef4444;
    color: #ef4444;
  }
  .gate-act-btn.sub {
    width: 17px;
    height: 17px;
    font-size: 9.5px;
  }

  /* Subtasks Hierarchy Tree */
  .gate-subtasks-tree {
    margin-left: 8px;
    padding-left: 14px;
    border-left: 1.5px solid rgba(255, 255, 255, 0.09);
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 2px;
  }
  .gate-subtask-row {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 2px 4px;
    border-radius: 4px;
    transition: background 0.12s ease;
  }
  .gate-subtask-row:hover {
    background: rgba(255, 255, 255, 0.03);
  }
  .gate-sub-bullet-btn {
    background: none;
    border: none;
    padding: 0;
    font-size: 10px;
    font-weight: 700;
    color: #64748b;
    cursor: pointer;
    line-height: 1;
    transition: color 0.12s ease;
  }
  .gate-sub-bullet-btn.done {
    color: #00e6a0;
    text-shadow: 0 0 6px rgba(0, 230, 160, 0.6);
  }
  .gate-sub-bullet-btn:hover {
    color: #00e6a0;
  }
  .gate-subtask-text {
    font-size: 11.5px;
    color: #cbd5e1;
    flex: 1;
    line-height: 1.35;
    cursor: pointer;
    transition: color 0.12s ease;
  }
  .gate-subtask-text:hover {
    color: #f1f5f9;
  }
  .gate-subtask-text.completed {
    color: #64748b;
    text-decoration: line-through;
    text-decoration-color: rgba(100, 116, 139, 0.4);
  }
  .gate-sub-actions {
    display: flex;
    align-items: center;
    gap: 3px;
    opacity: 0;
    transition: opacity 0.15s ease;
  }

  /* Inline Forms */
  .gate-inline-edit-form,
  .gate-sub-add-form,
  .gate-sub-inline-edit,
  .gate-add-task-form {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
  }
  .gate-cli-prompt {
    font-family: monospace;
    font-size: 12px;
    font-weight: 800;
    color: #ffaa00;
  }
  .gate-inline-input {
    background: #080c14 !important;
    border: 1px solid rgba(255, 170, 0, 0.45) !important;
    color: #f8fafc !important;
    font-size: 12px !important;
    padding: 4px 8px !important;
    border-radius: 5px !important;
    outline: none !important;
    font-family: inherit !important;
    flex: 1;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.6);
  }
  .gate-inline-input:focus {
    border-color: #ffaa00 !important;
    box-shadow: 0 0 10px rgba(255, 170, 0, 0.35) !important;
  }
  .gate-inline-input.sub-input {
    font-size: 11px !important;
    padding: 3px 6px !important;
  }
  .gate-inline-save-btn {
    background: #00e6a0 !important;
    color: #050608 !important;
    font-size: 11px !important;
    font-weight: 750 !important;
    padding: 4px 9px !important;
    border-radius: 5px !important;
    border: none !important;
    cursor: pointer !important;
    transition: all 0.12s ease !important;
  }
  .gate-inline-save-btn:hover {
    background: #34d399 !important;
    box-shadow: 0 0 8px rgba(0, 230, 160, 0.5) !important;
  }
  .gate-inline-cancel-btn {
    background: rgba(255, 255, 255, 0.08) !important;
    color: #94a3b8 !important;
    font-size: 11px !important;
    font-weight: 700 !important;
    padding: 4px 8px !important;
    border-radius: 5px !important;
    border: 1px solid rgba(255, 255, 255, 0.12) !important;
    cursor: pointer !important;
    transition: all 0.12s ease !important;
  }
  .gate-inline-cancel-btn:hover {
    background: rgba(255, 255, 255, 0.16) !important;
    color: #f1f5f9 !important;
  }

  .gate-add-task-btn {
    width: 100%;
    background: rgba(255, 170, 0, 0.04);
    border: 1px dashed rgba(255, 170, 0, 0.3);
    color: #ffaa00;
    font-size: 11.5px;
    font-weight: 700;
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-top: 4px;
  }
  .gate-add-task-btn:hover {
    background: rgba(255, 170, 0, 0.12);
    border-color: #ffaa00;
    box-shadow: 0 0 12px rgba(255, 170, 0, 0.25);
    color: #ffbb22;
    transform: translateY(-1px);
  }
  .gate-add-icon {
    font-size: 13px;
    font-weight: 800;
  }


  /* ==========================================================================
     CYBERPUNK CAREER FULLSCREEN ADD APPLICATION INTAKE STATION
     ========================================================================== */
  .career-fs-add-card {
    max-width: 820px;
    width: 100%;
    margin: 10px auto;
    background: linear-gradient(145deg, rgba(28, 12, 18, 0.8) 0%, rgba(11, 14, 22, 0.95) 100%) !important;
    border: 1px solid rgba(239, 68, 68, 0.35) !important;
    border-radius: 14px !important;
    padding: 26px 30px !important;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6), 0 0 24px rgba(239, 68, 68, 0.15) !important;
    backdrop-filter: blur(16px) !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 20px !important;
  }
  .career-fs-add-hero {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
  .career-fs-add-hero-left {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .career-fs-add-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.8px;
    color: #ef4444;
    background: rgba(239, 68, 68, 0.12);
    border: 1px solid rgba(239, 68, 68, 0.3);
    padding: 3px 9px;
    border-radius: 5px;
    font-family: monospace;
    width: fit-content;
  }
  .career-fs-add-spark {
    color: #ef4444;
    text-shadow: 0 0 8px rgba(239, 68, 68, 0.8);
  }
  .career-fs-add-hero h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 750;
    color: #f8fafc;
    letter-spacing: 0.3px;
  }
  .career-fs-add-hero p {
    margin: 0;
    font-size: 13px;
    color: #94a3b8;
    line-height: 1.45;
  }
  .career-fs-add-close {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #94a3b8;
    font-size: 18px;
    display: grid;
    place-items: center;
    cursor: pointer;
    transition: all 0.15s ease;
    padding: 0;
    line-height: 1;
    flex-shrink: 0;
  }
  .career-fs-add-close:hover {
    background: rgba(239, 68, 68, 0.2);
    border-color: #ef4444;
    color: #fff;
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
  }

  .career-fs-add-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .career-fs-fields-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px 18px;
  }
  .career-fs-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .career-fs-field.full-width {
    grid-column: 1 / span 2;
  }
  .career-fs-label {
    font-size: 11px;
    font-weight: 750;
    color: #cbd5e1;
    letter-spacing: 0.4px;
    font-family: monospace;
  }
  .career-fs-quick-presets {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .career-fs-preset-pill {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #94a3b8;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.12s ease;
  }
  .career-fs-preset-pill:hover {
    background: rgba(239, 68, 68, 0.18);
    border-color: rgba(239, 68, 68, 0.4);
    color: #fca5a5;
  }

  .career-fs-input-wrap {
    display: flex;
    align-items: center;
    background: #090c14;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 7px;
    padding: 0 10px;
    height: 38px;
    transition: all 0.15s ease;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.5);
  }
  .career-fs-input-wrap:focus-within {
    border-color: #ef4444;
    box-shadow: 0 0 12px rgba(239, 68, 68, 0.35), inset 0 1px 3px rgba(0, 0, 0, 0.5);
    background: #0e121d;
  }
  .career-fs-input-icon {
    font-size: 14px;
    margin-right: 8px;
    opacity: 0.8;
  }
  .career-fs-input {
    flex: 1;
    background: transparent !important;
    border: none !important;
    color: #f8fafc !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    outline: none !important;
    padding: 0 !important;
    width: 100% !important;
    box-shadow: none !important;
  }
  .career-fs-input::placeholder {
    color: #475569 !important;
    font-weight: 400 !important;
  }
  select.career-fs-input {
    cursor: pointer;
  }
  select.career-fs-input option {
    background: #0d111a;
    color: #f1f5f9;
  }

  .career-fs-toggle-card {
    height: 38px;
    display: flex;
    align-items: center;
    background: rgba(0, 230, 160, 0.04);
    border: 1px solid rgba(0, 230, 160, 0.25);
    border-radius: 7px;
    padding: 0 12px;
    transition: all 0.15s ease;
  }
  .career-fs-toggle-card:hover {
    background: rgba(0, 230, 160, 0.08);
    border-color: rgba(0, 230, 160, 0.4);
  }
  .career-fs-toggle-label {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    width: 100%;
  }
  .career-fs-toggle-label input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #00e6a0;
    cursor: pointer;
  }
  .career-fs-toggle-text {
    display: flex;
    flex-direction: column;
    gap: 1px;
    font-size: 11px;
    line-height: 1.25;
  }
  .career-fs-toggle-text span {
    color: #94a3b8;
    font-size: 10px;
  }

  /* 5-Stage Preview Ribbon */
  .career-fs-preview-box {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 8px;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .career-fs-preview-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .career-fs-preview-title {
    font-size: 10.5px;
    font-weight: 800;
    color: #ef4444;
    letter-spacing: 0.6px;
    font-family: monospace;
  }
  .career-fs-preview-tag {
    font-size: 9.5px;
    font-weight: 700;
    color: #64748b;
    background: rgba(255, 255, 255, 0.04);
    padding: 2px 6px;
    border-radius: 3px;
  }
  .career-fs-rounds-track {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    flex-wrap: wrap;
  }
  .fs-round-step {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 4px 8px;
    border-radius: 5px;
    font-size: 11px;
    color: #cbd5e1;
  }
  .fs-round-step.done {
    border-color: rgba(0, 230, 160, 0.3);
    background: rgba(0, 230, 160, 0.06);
    color: #00e6a0;
  }
  .fs-round-step.active {
    border-color: rgba(255, 170, 0, 0.4);
    background: rgba(255, 170, 0, 0.08);
    color: #ffaa00;
  }
  .fs-round-num {
    font-size: 10px;
    font-weight: 800;
    font-family: monospace;
    opacity: 0.8;
  }
  .fs-round-lbl {
    font-weight: 600;
  }
  .fs-round-arrow {
    color: #475569;
    font-size: 12px;
  }

  /* Actions Footer */
  .career-fs-add-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 8px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }
  .career-fs-cancel-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #94a3b8;
    font-size: 12.5px;
    font-weight: 700;
    padding: 9px 18px;
    border-radius: 7px;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .career-fs-cancel-btn:hover {
    background: rgba(255, 255, 255, 0.12);
    color: #f1f5f9;
  }
  .career-fs-submit-btn {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    border: none;
    color: #fff;
    font-size: 13px;
    font-weight: 750;
    letter-spacing: 0.3px;
    padding: 9px 24px;
    border-radius: 7px;
    cursor: pointer;
    box-shadow: 0 0 16px rgba(239, 68, 68, 0.45);
    transition: all 0.15s ease;
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .career-fs-submit-btn:hover {
    background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
    box-shadow: 0 0 24px rgba(239, 68, 68, 0.7);
    transform: translateY(-1px);
  }
  .career-fs-submit-btn span {
    font-size: 16px;
    font-weight: 800;
  }

  /* Matrix Cards Grid */
  .matrix-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 18px;
    align-items: stretch;
  }

  /* Individual Matrix Course Card */
  .matrix-course-card {
    background: rgba(13, 17, 26, 0.88);
    backdrop-filter: blur(14px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
    position: relative;
  }
  .matrix-course-card:hover {
    border-color: rgba(8, 186, 255, 0.45);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 18px rgba(8, 186, 255, 0.15);
    transform: translateY(-2px);
  }

  .matrix-card-header {
    padding: 14px 16px 10px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0) 100%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .matrix-card-header-top {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .matrix-card-ring {
    width: 42px;
    height: 42px;
    font-size: 11px;
    flex-shrink: 0;
  }
  .matrix-card-title-wrap {
    flex: 1;
    min-width: 0;
  }
  .matrix-card-module-pill {
    font-size: 9px;
    font-weight: 800;
    color: #08baff;
    background: rgba(8, 186, 255, 0.1);
    padding: 2px 6px;
    border-radius: 3px;
    letter-spacing: 0.6px;
    display: inline-block;
    margin-bottom: 2px;
  }
  .matrix-card-title {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    color: #f1f5f9;
    line-height: 1.3;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: color 0.15s ease;
  }
  .matrix-card-title:hover {
    color: #00f0ff;
  }
  .matrix-card-arrow {
    font-size: 11px;
    opacity: 0.6;
    transition: transform 0.15s ease;
  }
  .matrix-card-title:hover .matrix-card-arrow {
    opacity: 1;
    transform: translate(2px, -2px);
  }

  .matrix-card-progress-wrap {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .matrix-card-progress-track {
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 2px;
    overflow: hidden;
  }
  .matrix-card-progress-bar {
    height: 100%;
    border-radius: 2px;
    transition: width 0.3s ease;
    box-shadow: 0 0 8px currentColor;
  }
  .matrix-card-progress-sub {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 10.5px;
    font-weight: 600;
    color: #8e99ad;
  }

  /* Topics List Inside Card */
  .matrix-card-topics-list {
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 7px;
    flex: 1;
  }
  .matrix-topic-item {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 7px;
    padding: 7px 9px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    transition: all 0.15s ease;
  }
  .matrix-topic-item:hover {
    background: rgba(8, 186, 255, 0.04);
    border-color: rgba(8, 186, 255, 0.25);
  }
  .matrix-topic-item.is-done {
    background: rgba(0, 230, 160, 0.04);
    border-color: rgba(0, 230, 160, 0.25);
  }
  .matrix-topic-header {
    display: flex;
    align-items: flex-start;
    gap: 7px;
    cursor: pointer;
    user-select: none;
  }
  .matrix-topic-check {
    width: 15px;
    height: 15px;
    border-radius: 3px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 700;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #64748b;
    flex-shrink: 0;
    margin-top: 1px;
    transition: all 0.15s ease;
  }
  .matrix-topic-check.checked {
    background: #00e6a0;
    border-color: #00e6a0;
    color: #07090e;
    box-shadow: 0 0 8px rgba(0, 230, 160, 0.6);
  }
  .matrix-topic-name {
    flex: 1;
    font-size: 12px;
    font-weight: 600;
    color: #e2e8f0;
    line-height: 1.3;
    word-break: break-word;
  }
  .matrix-topic-item.is-done .matrix-topic-name {
    color: #00e6a0;
  }
  .matrix-topic-subs-badge {
    font-size: 9.5px;
    font-weight: 700;
    padding: 1px 4px;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.06);
    color: #94a3b8;
    flex-shrink: 0;
  }
  .matrix-topic-subs-badge.done {
    background: rgba(0, 230, 160, 0.15);
    color: #00e6a0;
  }

  /* Subtopics Preview Chips */
  .matrix-subtopics-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding-left: 22px;
  }
  .matrix-subtopic-chip {
    font-size: 10px;
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 3px;
    padding: 2px 5px;
    color: #94a3b8;
    cursor: pointer;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: all 0.15s ease;
  }
  .matrix-subtopic-chip:hover {
    border-color: rgba(8, 186, 255, 0.4);
    color: #00f0ff;
    background: rgba(8, 186, 255, 0.08);
  }
  .matrix-subtopic-chip.done {
    border-color: rgba(0, 230, 160, 0.3);
    color: #00e6a0;
    background: rgba(0, 230, 160, 0.06);
  }
  .matrix-subtopic-more-chip {
    font-size: 9.5px;
    font-weight: 600;
    color: #08baff;
    background: rgba(8, 186, 255, 0.1);
    border-radius: 3px;
    padding: 2px 5px;
    cursor: pointer;
  }
  .matrix-subtopic-more-chip:hover {
    background: rgba(8, 186, 255, 0.2);
  }

  /* Card Footer */
  .matrix-card-footer {
    padding: 8px 12px 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.04);
  }
  .matrix-open-studio-btn {
    width: 100%;
    background: rgba(8, 186, 255, 0.08);
    border: 1px solid rgba(8, 186, 255, 0.25);
    border-radius: 6px;
    padding: 7px 10px;
    color: #00f0ff;
    font-size: 11.5px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all 0.2s ease;
  }
  .matrix-open-studio-btn:hover {
    background: #00f0ff;
    color: #07090e;
    box-shadow: 0 0 14px rgba(0, 240, 255, 0.5);
    border-color: #00f0ff;
  }

  /* Project Tracker Fullscreen Workstation */
  .proj-fs-toggle-btn {
    width: 24px;
    height: 24px;
    background: rgba(255, 170, 0, 0.14);
    border: 1px solid rgba(255, 170, 0, 0.6);
    border-radius: 5px;
    color: #ffaa00;
    cursor: pointer;
    padding: 0;
    margin-left: 4px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
    flex-shrink: 0;
  }
  .proj-fs-toggle-btn:hover {
    background: #ffaa00;
    color: #050608;
    box-shadow: 0 0 10px rgba(255, 170, 0, 0.85);
    transform: scale(1.08);
  }

  .career-fs-toggle-btn {
    width: 24px;
    height: 24px;
    background: rgba(239, 68, 68, 0.14);
    border: 1px solid rgba(239, 68, 68, 0.6);
    border-radius: 5px;
    color: #ff5365;
    cursor: pointer;
    padding: 0;
    margin-left: 4px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
    flex-shrink: 0;
  }
  .career-fs-toggle-btn:hover {
    background: #ef4444;
    color: #fff;
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.85);
    transform: scale(1.08);
  }

  /* Fullscreen Overlay - Projects */
  .projects-fullscreen-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999999;
    background: rgba(4, 5, 8, 0.96);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    display: flex;
    flex-direction: column;
    padding: 16px 28px 20px 24px;
    box-sizing: border-box;
    overflow: hidden;
    animation: fsOverlayFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .projects-fs-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(255, 170, 0, 0.3);
    flex-shrink: 0;
    height: 48px;
    box-sizing: border-box;
  }

  .projects-fs-title-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .projects-fs-icon {
    width: 22px;
    height: 22px;
    color: #ffaa00;
    filter: drop-shadow(0 0 8px rgba(255, 170, 0, 0.7));
    flex-shrink: 0;
  }

  .projects-fs-title-wrap h2 {
    margin: 0;
    font-size: 17px;
    font-weight: 750;
    color: #f6f6fa;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .projects-fs-mode-tag {
    font-size: 9.5px;
    font-weight: 700;
    color: #ffaa00;
    background: rgba(255, 170, 0, 0.12);
    border: 1px solid rgba(255, 170, 0, 0.4);
    padding: 2px 7px;
    border-radius: 4px;
    letter-spacing: 0.6px;
  }

  .projects-fs-stats-badge {
    font-size: 11px;
    font-weight: 600;
    color: #ffd074;
    background: rgba(255, 170, 0, 0.08);
    border: 1px solid rgba(255, 170, 0, 0.25);
    padding: 3px 9px;
    border-radius: 5px;
  }

  .projects-fs-topbar-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .projects-fs-btn {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 170, 0, 0.4);
    border-radius: 6px;
    color: #ffd074;
    font-size: 11px;
    font-weight: 600;
    padding: 5px 12px;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .projects-fs-btn:hover, .projects-fs-btn.active {
    background: rgba(255, 170, 0, 0.22);
    border-color: #ffaa00;
    color: #fff;
    box-shadow: 0 0 8px rgba(255, 170, 0, 0.5);
  }

  .projects-fs-close-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 38, 59, 0.15);
    border: 1px solid #ff263b;
    border-radius: 6px;
    color: #ff8593;
    font-size: 11.5px;
    font-weight: 650;
    padding: 5px 12px;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .projects-fs-close-btn:hover {
    background: #ff263b;
    color: #fff;
    box-shadow: 0 0 10px rgba(255, 38, 59, 0.7);
  }

  .projects-fs-body {
    display: flex;
    flex: 1;
    height: calc(100vh - 85px);
    max-height: calc(100vh - 85px);
    gap: 20px;
    min-height: 0;
    padding-top: 14px;
    box-sizing: border-box;
    overflow: hidden;
  }

  .projects-fs-sidebar {
    width: 360px;
    height: 100%;
    max-height: 100%;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 170, 0, 0.2);
    border-radius: 10px;
    padding: 14px;
    box-sizing: border-box;
    overflow-y: auto;
  }
  .projects-fs-sidebar::-webkit-scrollbar { width: 4px; }
  .projects-fs-sidebar::-webkit-scrollbar-thumb { background: #ffaa00; border-radius: 2px; }

  .projects-fs-sidebar-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 11.5px;
    font-weight: 750;
    color: #ffaa00;
    letter-spacing: 0.5px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    flex-shrink: 0;
  }

  .projects-fs-mini-add-btn {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    background: rgba(255, 170, 0, 0.15);
    border: 1px solid #ffaa00;
    color: #ffaa00;
    font-size: 13px;
    line-height: 1;
    cursor: pointer;
    display: grid;
    place-items: center;
    padding: 0;
  }

  .projects-fs-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    overflow-y: auto;
    padding-right: 2px;
  }

  .projects-fs-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.025);
    border: 1px solid rgba(255, 255, 255, 0.06);
    cursor: pointer;
    transition: all 0.15s ease;
    flex-shrink: 0;
  }
  .projects-fs-card:hover {
    background: rgba(255, 170, 0, 0.06);
    border-color: rgba(255, 170, 0, 0.35);
  }
  .projects-fs-card.active {
    background: rgba(255, 170, 0, 0.12);
    border-color: #ffaa00;
    box-shadow: 0 0 10px rgba(255, 170, 0, 0.3);
  }
  .projects-fs-card.shipped {
    border-color: rgba(0, 230, 160, 0.4);
  }

  .projects-fs-card-left {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    min-width: 0;
  }

  .projects-fs-progress-pill {
    font-size: 12px;
    font-weight: 800;
    padding: 4px 8px;
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid;
    flex-shrink: 0;
  }

  .projects-fs-card-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .projects-fs-card-name {
    font-size: 13px;
    font-weight: 700;
    color: #f6f6fa;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .projects-fs-card-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 10.5px;
    color: #8e99ad;
  }

  .projects-fs-card-stack {
    color: #08baff;
    font-weight: 600;
  }

  .projects-fs-card-actions {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }

  .projects-fs-main {
    flex: 1;
    height: 100%;
    max-height: 100%;
    min-width: 0;
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.015);
    border: 1px solid rgba(255, 170, 0, 0.2);
    border-radius: 10px;
    padding: 20px 24px;
    box-sizing: border-box;
    overflow-y: auto;
  }
  .projects-fs-main::-webkit-scrollbar { width: 5px; }
  .projects-fs-main::-webkit-scrollbar-thumb { background: #ffaa00; border-radius: 3px; }

  .projects-fs-hero {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    flex-shrink: 0;
  }

  .projects-fs-hero-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }

  .projects-hero-title-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .projects-hero-stack-pill {
    background: rgba(8, 186, 255, 0.14);
    border: 1px solid #08baff;
    color: #08baff;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 11.5px;
    font-weight: 700;
  }

  .projects-edit-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 170, 0, 0.4);
    color: #ffd074;
    border-radius: 5px;
    padding: 2px 7px;
    font-size: 13px;
    cursor: pointer;
  }
  .projects-edit-btn:hover {
    background: #ffaa00;
    color: #000;
  }
  .projects-edit-btn.save {
    background: rgba(0, 230, 160, 0.15);
    border-color: #00e6a0;
    color: #00e6a0;
  }
  .projects-edit-btn.save:hover {
    background: #00e6a0;
    color: #000;
  }
  .projects-edit-btn.cancel {
    background: rgba(255, 83, 101, 0.15);
    border-color: #ff5365;
    color: #ff5365;
  }
  .projects-edit-btn.cancel:hover {
    background: #ff5365;
    color: #fff;
  }

  .projects-inline-edit-row {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
  }

  .projects-inline-edit-input {
    font-size: 20px;
    font-weight: 750;
    height: 38px;
    padding: 4px 10px;
    background: #06070a;
    border: 1px solid #ffaa00;
    border-radius: 6px;
    color: #f6f6fa;
    box-shadow: 0 0 10px rgba(255, 170, 0, 0.35);
    outline: none;
    flex: 1;
  }

  .projects-fs-stage-badge {
    font-size: 11px;
    font-weight: 750;
    padding: 3px 8px;
    border-radius: 4px;
    border: 1px solid;
    letter-spacing: 0.5px;
  }

  .projects-fs-hero-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .projects-fs-tool-btn {
    width: 34px;
    height: 34px;
    font-size: 17px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 170, 0, 0.35);
    color: #ffd074;
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .projects-fs-tool-btn:hover {
    background: rgba(255, 170, 0, 0.25);
    color: #fff;
    border-color: #ffaa00;
    box-shadow: 0 0 8px rgba(255, 170, 0, 0.5);
  }

  .projects-fs-segments-bar {
    display: flex;
    gap: 4px;
    height: 10px;
    width: 100%;
    background: rgba(0, 0, 0, 0.4);
    padding: 2px;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.06);
  }
  .projects-fs-seg {
    flex: 1;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 2px;
    transition: all 0.15s ease;
  }
  .projects-fs-seg.active {
    background: #ffaa00;
    box-shadow: 0 0 6px rgba(255, 170, 0, 0.8);
  }
  .projects-fs-seg.active-complete {
    background: #00e6a0;
    box-shadow: 0 0 6px rgba(0, 230, 160, 0.8);
  }

  .projects-fs-blocker-banner {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 6px;
    background: rgba(255, 170, 0, 0.08);
    border: 1px solid rgba(255, 170, 0, 0.25);
    color: #ffd074;
    font-size: 13px;
    font-weight: 600;
  }
  .projects-fs-blocker-banner.is-complete {
    background: rgba(0, 230, 160, 0.08);
    border-color: rgba(0, 230, 160, 0.35);
    color: #00e6a0;
  }

  .projects-fs-gates-studio {
    margin-top: 18px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .projects-fs-gates-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .projects-fs-gates-header h4 {
    margin: 0;
    font-size: 15px;
    font-weight: 750;
    color: #f6f6fa;
  }
  .projects-fs-gates-header span {
    font-size: 12.5px;
    color: #8e99ad;
  }

  .projects-fs-gates-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 14px;
  }

  .projects-fs-gate-card {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .projects-fs-gate-card:hover {
    background: rgba(255, 170, 0, 0.05);
    border-color: rgba(255, 170, 0, 0.35);
    transform: translateY(-1px);
  }
  .projects-fs-gate-card.is-passed {
    background: rgba(0, 230, 160, 0.04);
    border-color: rgba(0, 230, 160, 0.35);
  }
  .projects-fs-gate-card.is-passed:hover {
    border-color: #00e6a0;
    box-shadow: 0 0 10px rgba(0, 230, 160, 0.2);
  }

  .projects-fs-gate-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .projects-fs-gate-check {
    width: 22px;
    height: 22px;
    border-radius: 4px;
    border: 1.5px solid rgba(255, 255, 255, 0.2);
    background: rgba(0, 0, 0, 0.3);
    color: #00e6a0;
    font-size: 13px;
    font-weight: 800;
    display: grid;
    place-items: center;
    cursor: pointer;
    padding: 0;
  }
  .projects-fs-gate-card.is-passed .projects-fs-gate-check {
    border-color: #00e6a0;
    background: rgba(0, 230, 160, 0.18);
  }

  .projects-fs-gate-num {
    font-size: 10.5px;
    font-weight: 800;
    color: #ffaa00;
    letter-spacing: 0.5px;
  }

  .projects-fs-gate-status {
    font-size: 10.5px;
    font-weight: 750;
    padding: 2px 6px;
    border-radius: 4px;
  }
  .projects-fs-gate-status.passed {
    color: #00e6a0;
    background: rgba(0, 230, 160, 0.12);
  }
  .projects-fs-gate-status.pending {
    color: #8e99ad;
    background: rgba(255, 255, 255, 0.05);
  }

  .projects-fs-gate-title {
    margin: 4px 0 2px;
    font-size: 13.5px;
    font-weight: 700;
    color: #f6f6fa;
  }

  .projects-fs-gate-desc {
    margin: 0;
    font-size: 11.5px;
    color: #8e99ad;
    line-height: 1.4;
  }

  /* Fullscreen Overlay - Career */
  .career-fullscreen-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999999;
    background: rgba(4, 5, 8, 0.96);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    display: flex;
    flex-direction: column;
    padding: 16px 28px 20px 24px;
    box-sizing: border-box;
    overflow: hidden;
    animation: fsOverlayFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .career-fs-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(239, 68, 68, 0.3);
    flex-shrink: 0;
    height: 48px;
    box-sizing: border-box;
  }

  .career-fs-title-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .career-fs-icon {
    width: 22px;
    height: 22px;
    color: #ef4444;
    filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.7));
    flex-shrink: 0;
  }

  .career-fs-title-wrap h2 {
    margin: 0;
    font-size: 17px;
    font-weight: 750;
    color: #f6f6fa;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .career-fs-mode-tag {
    font-size: 9.5px;
    font-weight: 700;
    color: #ff5365;
    background: rgba(239, 68, 68, 0.12);
    border: 1px solid rgba(239, 68, 68, 0.4);
    padding: 2px 7px;
    border-radius: 4px;
    letter-spacing: 0.6px;
  }

  .career-fs-topbar-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .career-fs-btn {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(239, 68, 68, 0.4);
    border-radius: 6px;
    color: #ff8593;
    font-size: 11px;
    font-weight: 600;
    padding: 5px 12px;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .career-fs-btn:hover, .career-fs-btn.active {
    background: rgba(239, 68, 68, 0.22);
    border-color: #ef4444;
    color: #fff;
    box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
  }

  .career-fs-close-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 38, 59, 0.15);
    border: 1px solid #ff263b;
    border-radius: 6px;
    color: #ff8593;
    font-size: 11.5px;
    font-weight: 650;
    padding: 5px 12px;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .career-fs-close-btn:hover {
    background: #ff263b;
    color: #fff;
    box-shadow: 0 0 10px rgba(255, 38, 59, 0.7);
  }

  .career-fs-body {
    display: flex;
    flex: 1;
    height: calc(100vh - 85px);
    max-height: calc(100vh - 85px);
    gap: 20px;
    min-height: 0;
    padding-top: 14px;
    box-sizing: border-box;
    overflow: hidden;
  }

  .career-fs-sidebar {
    width: 360px;
    height: 100%;
    max-height: 100%;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 10px;
    padding: 14px;
    box-sizing: border-box;
    overflow-y: auto;
  }
  .career-fs-sidebar::-webkit-scrollbar { width: 4px; }
  .career-fs-sidebar::-webkit-scrollbar-thumb { background: #ef4444; border-radius: 2px; }

  .career-fs-sidebar-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 11.5px;
    font-weight: 750;
    color: #ff5365;
    letter-spacing: 0.5px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    flex-shrink: 0;
  }

  .career-fs-mini-add-btn {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid #ef4444;
    color: #ff5365;
    font-size: 13px;
    line-height: 1;
    cursor: pointer;
    display: grid;
    place-items: center;
    padding: 0;
  }

  .career-fs-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    overflow-y: auto;
    padding-right: 2px;
  }

  .career-fs-card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.025);
    border: 1px solid rgba(255, 255, 255, 0.06);
    cursor: pointer;
    transition: all 0.15s ease;
    flex-shrink: 0;
  }
  .career-fs-card:hover {
    background: rgba(239, 68, 68, 0.06);
    border-color: rgba(239, 68, 68, 0.35);
  }
  .career-fs-card.is-active {
    background: rgba(239, 68, 68, 0.12);
    border-color: #ef4444;
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
  }

  .career-fs-card-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .career-fs-card-line1 {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 700;
    color: #f6f6fa;
  }
  .career-fs-ctc {
    color: #ffd074;
    font-size: 11.5px;
    font-weight: 650;
  }

  .career-fs-card-line2 {
    font-size: 11px;
    color: #8e99ad;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .career-fs-card-line3 {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 2px;
  }

  .career-fs-badge-stage {
    font-size: 9.5px;
    font-weight: 700;
    color: #ff5365;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.25);
    padding: 1px 5px;
    border-radius: 3px;
  }
  .career-fs-badge-mtech {
    font-size: 9.5px;
    font-weight: 700;
    color: #00e6a0;
    background: rgba(0, 230, 160, 0.1);
    border: 1px solid rgba(0, 230, 160, 0.25);
    padding: 1px 5px;
    border-radius: 3px;
  }
  .career-fs-badge-source {
    font-size: 9.5px;
    color: #8e99ad;
  }

  .career-fs-card-del-btn {
    width: 20px;
    height: 20px;
    background: none;
    border: none;
    color: #777;
    font-size: 14px;
    cursor: pointer;
    display: grid;
    place-items: center;
    padding: 0;
    border-radius: 3px;
  }
  .career-fs-card-del-btn:hover {
    color: #ff263b;
    background: rgba(255, 38, 59, 0.15);
  }

  .career-fs-main {
    flex: 1;
    height: 100%;
    max-height: 100%;
    min-width: 0;
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.015);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 10px;
    padding: 20px 24px;
    box-sizing: border-box;
    overflow-y: auto;
  }
  .career-fs-main::-webkit-scrollbar { width: 5px; }
  .career-fs-main::-webkit-scrollbar-thumb { background: #ef4444; border-radius: 3px; }

  .career-fs-hero {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    flex-shrink: 0;
  }

  .career-fs-hero-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }

  .career-fs-hero-title-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .career-fs-hero-ctc {
    background: rgba(255, 170, 0, 0.12);
    border: 1px solid #ffaa00;
    color: #ffd074;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 750;
  }

  .career-edit-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(239, 68, 68, 0.4);
    color: #ff8593;
    border-radius: 5px;
    padding: 2px 7px;
    font-size: 13px;
    cursor: pointer;
  }
  .career-edit-btn:hover {
    background: #ef4444;
    color: #fff;
  }
  .career-edit-btn.save {
    background: rgba(0, 230, 160, 0.15);
    border-color: #00e6a0;
    color: #00e6a0;
  }
  .career-edit-btn.save:hover {
    background: #00e6a0;
    color: #000;
  }
  .career-edit-btn.cancel {
    background: rgba(255, 83, 101, 0.15);
    border-color: #ff5365;
    color: #ff5365;
  }
  .career-edit-btn.cancel:hover {
    background: #ff5365;
    color: #fff;
  }

  .career-fs-withdraw-btn {
    background: rgba(255, 38, 59, 0.12);
    border: 1px solid #ff263b;
    color: #ff8593;
    border-radius: 6px;
    padding: 6px 14px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .career-fs-withdraw-btn:hover {
    background: #ff263b;
    color: #fff;
    box-shadow: 0 0 10px rgba(255, 38, 59, 0.6);
  }

  .career-fs-checklist-studio {
    margin-top: 18px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .career-fs-checklist-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .career-fs-checklist-header h4 {
    margin: 0;
    font-size: 15px;
    font-weight: 750;
    color: #f6f6fa;
  }
  .career-fs-checklist-header span {
    font-size: 12.5px;
    color: #8e99ad;
  }

  .career-fs-rounds-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 14px;
  }
  @media (max-width: 1350px) {
    .career-fs-rounds-grid {
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    }
  }

  .career-fs-round-card {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: all 0.15s ease;
  }
  .career-fs-round-card.is-done {
    border-color: rgba(0, 230, 160, 0.35);
    background: rgba(0, 230, 160, 0.03);
  }
  .career-fs-round-card.is-active {
    border-color: rgba(255, 170, 0, 0.4);
    background: rgba(255, 170, 0, 0.04);
  }

  .career-fs-round-head {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .career-fs-round-titles {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .career-fs-round-name {
    font-size: 13.5px;
    font-weight: 700;
    color: #f6f6fa;
  }

  .career-fs-round-badge {
    font-size: 9.5px;
    font-weight: 750;
    padding: 2px 6px;
    border-radius: 4px;
  }
  .career-fs-round-badge.done {
    color: #00e6a0;
    background: rgba(0, 230, 160, 0.12);
  }
  .career-fs-round-badge.active {
    color: #ffaa00;
    background: rgba(255, 170, 0, 0.12);
  }
  .career-fs-round-badge.pending {
    color: #8e99ad;
    background: rgba(255, 255, 255, 0.05);
  }

  .career-fs-round-subtext {
    font-size: 12.5px;
    color: #8e99ad;
    line-height: 1.45;
    padding: 8px 10px;
    background: rgba(0, 0, 0, 0.25);
    border: 1px dashed rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    cursor: pointer;
    min-height: 48px;
  }
  .career-fs-round-subtext:hover {
    border-color: #ef4444;
    color: #f6f6fa;
  }

  .career-fs-round-textarea {
    font-size: 13px;
    padding: 8px 10px;
    background: #08080c;
    border: 1px solid #ef4444;
    border-radius: 6px;
    color: #f6f6fa;
    outline: none;
    box-shadow: 0 0 8px rgba(239, 68, 68, 0.35);
    box-sizing: border-box;
  }

  .career-fs-quick-bar {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
  }

  /* Fullscreen Scale-Up for Projects Fonts & Icons */
  .projects-fullscreen-overlay .projects-fs-topbar {
    height: 56px;
    padding-bottom: 12px;
  }
  .projects-fullscreen-overlay .projects-fs-icon {
    width: 26px;
    height: 26px;
  }
  .projects-fullscreen-overlay .projects-fs-title-wrap h2 {
    font-size: 20px;
  }
  .projects-fullscreen-overlay .projects-fs-mode-tag {
    font-size: 11px;
    padding: 3px 8px;
  }
  .projects-fullscreen-overlay .projects-fs-stats-badge {
    font-size: 13px;
    padding: 5px 12px;
  }
  .projects-fullscreen-overlay .projects-fs-btn {
    font-size: 13px;
    padding: 7px 16px;
  }
  .projects-fullscreen-overlay .projects-fs-close-btn {
    font-size: 13px;
    padding: 7px 16px;
    gap: 8px;
  }
  .projects-fullscreen-overlay .projects-fs-close-btn svg {
    width: 16px;
    height: 16px;
  }

  /* Projects Fullscreen Sidebar */
  .projects-fullscreen-overlay .projects-fs-sidebar {
    width: 380px !important;
    padding: 16px !important;
  }
  .projects-fullscreen-overlay .projects-fs-sidebar-title {
    font-size: 14px;
    padding-bottom: 10px;
  }
  .projects-fullscreen-overlay .projects-fs-mini-add-btn {
    width: 26px;
    height: 26px;
    font-size: 16px;
  }
  .projects-fullscreen-overlay .projects-fs-card {
    padding: 12px 14px;
    gap: 12px;
  }
  .projects-fullscreen-overlay .projects-fs-progress-pill {
    font-size: 13px;
    padding: 5px 9px;
  }
  .projects-fullscreen-overlay .projects-fs-card-name {
    font-size: 14.5px;
    font-weight: 750;
  }
  .projects-fullscreen-overlay .projects-fs-card-meta {
    font-size: 12px;
    gap: 8px;
  }
  .projects-fullscreen-overlay .projects-fs-card-actions .proj-tool-btn {
    width: 26px;
    height: 26px;
    font-size: 14px;
  }

  /* Projects Fullscreen Main Studio */
  .projects-fullscreen-overlay .projects-fs-main {
    padding: 24px 28px;
  }
  .projects-fullscreen-overlay .projects-fs-hero {
    gap: 16px;
    padding-bottom: 20px;
  }
  .projects-fullscreen-overlay .projects-hero-title-row h3 {
    font-size: 24px !important;
  }
  .projects-fullscreen-overlay .projects-hero-stack-pill {
    font-size: 13px;
    padding: 4px 10px;
  }
  .projects-fullscreen-overlay .projects-hero-stats-text {
    font-size: 14.5px !important;
  }
  .projects-fullscreen-overlay .projects-fs-stage-badge {
    font-size: 12.5px !important;
    padding: 4px 10px;
  }
  .projects-fullscreen-overlay .projects-fs-segments-bar {
    height: 12px;
    gap: 5px;
    padding: 3px;
  }
  .projects-fullscreen-overlay .projects-fs-blocker-banner {
    font-size: 14px;
    padding: 10px 16px;
  }
  .projects-fullscreen-overlay .projects-fs-blocker-banner svg {
    width: 20px;
    height: 20px;
  }
  .projects-fullscreen-overlay .projects-fs-gates-header h4 {
    font-size: 16px !important;
  }
  .projects-fullscreen-overlay .projects-fs-gates-header span {
    font-size: 13px !important;
  }
  .projects-fullscreen-overlay .projects-fs-gates-studio {
    margin-top: 22px;
    gap: 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .projects-fullscreen-overlay .projects-fs-gates-grid {
    gap: 16px;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    flex: 1;
  }
  @media (max-width: 1350px) {
    .projects-fullscreen-overlay .projects-fs-gates-grid {
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }
  }
  .projects-fullscreen-overlay .projects-fs-gate-card {
    padding: 18px 20px;
    min-height: 140px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  .projects-fullscreen-overlay .projects-fs-gate-check {
    width: 26px;
    height: 26px;
    font-size: 15px;
  }
  .projects-fullscreen-overlay .projects-fs-gate-num {
    font-size: 11.5px;
  }
  .projects-fullscreen-overlay .projects-fs-gate-status {
    font-size: 11.5px;
    padding: 3px 8px;
  }
  .projects-fullscreen-overlay .projects-fs-gate-title {
    font-size: 15px;
  }
  .projects-fullscreen-overlay .projects-fs-gate-desc {
    font-size: 12.5px;
  }

  /* Fullscreen Scale-Up for Career Fonts & Icons */
  .career-fullscreen-overlay .career-fs-topbar {
    height: 56px;
    padding-bottom: 12px;
  }
  .career-fullscreen-overlay .career-fs-icon {
    width: 26px;
    height: 26px;
  }
  .career-fullscreen-overlay .career-fs-title-wrap h2 {
    font-size: 20px;
  }
  .career-fullscreen-overlay .career-fs-mode-tag {
    font-size: 11px;
    padding: 3px 8px;
  }
  .career-fullscreen-overlay .funnel-pill {
    font-size: 12px;
    padding: 4px 10px;
  }
  .career-fullscreen-overlay .career-fs-btn {
    font-size: 13px;
    padding: 7px 16px;
  }
  .career-fullscreen-overlay .career-fs-close-btn {
    font-size: 13px;
    padding: 7px 16px;
    gap: 8px;
  }
  .career-fullscreen-overlay .career-fs-close-btn svg {
    width: 16px;
    height: 16px;
  }

  /* Career Fullscreen Sidebar */
  .career-fullscreen-overlay .career-fs-sidebar {
    width: 380px !important;
    padding: 16px !important;
  }
  .career-fullscreen-overlay .career-fs-sidebar-title {
    font-size: 14px;
    padding-bottom: 10px;
  }
  .career-fullscreen-overlay .career-fs-mini-add-btn {
    width: 26px;
    height: 26px;
    font-size: 16px;
  }
  .career-fullscreen-overlay .career-fs-card {
    padding: 12px 14px;
    gap: 12px;
  }
  .career-fullscreen-overlay .career-fs-card-line1 {
    font-size: 15px;
  }
  .career-fullscreen-overlay .career-fs-ctc {
    font-size: 13px;
  }
  .career-fullscreen-overlay .career-fs-card-line2 {
    font-size: 12px;
  }
  .career-fullscreen-overlay .career-fs-badge-stage,
  .career-fullscreen-overlay .career-fs-badge-mtech {
    font-size: 11px;
    padding: 2px 7px;
  }
  .career-fullscreen-overlay .career-fs-badge-source {
    font-size: 11px;
  }
  .career-fullscreen-overlay .career-fs-card-del-btn {
    width: 26px;
    height: 26px;
    font-size: 16px;
  }

  /* Career Fullscreen Main Studio */
  .career-fullscreen-overlay .career-fs-main {
    padding: 24px 28px;
  }
  .career-fullscreen-overlay .career-fs-hero {
    gap: 16px;
    padding-bottom: 20px;
  }
  .career-fullscreen-overlay .career-fs-hero-title-row h3 {
    font-size: 24px !important;
  }
  .career-fullscreen-overlay .career-fs-hero-ctc {
    font-size: 18px !important;
    padding: 4px 10px;
  }
  .career-fullscreen-overlay .career-meta-pill {
    font-size: 13px !important;
    padding: 5px 12px !important;
  }
  .career-fullscreen-overlay .career-fs-withdraw-btn {
    font-size: 13px;
    padding: 7px 16px;
  }
  .career-fullscreen-overlay .career-fs-checklist-header h4 {
    font-size: 16px !important;
  }
  .career-fullscreen-overlay .career-fs-checklist-header span {
    font-size: 13px !important;
  }
  .career-fullscreen-overlay .career-fs-checklist-studio {
    margin-top: 22px;
    gap: 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .career-fullscreen-overlay .career-fs-rounds-grid {
    gap: 16px;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    flex: 1;
  }
  @media (max-width: 1350px) {
    .career-fullscreen-overlay .career-fs-rounds-grid {
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    }
  }
  .career-fullscreen-overlay .career-fs-round-card {
    padding: 20px 20px;
    min-height: 220px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  .career-fullscreen-overlay .career-round-status-btn {
    width: 38px !important;
    height: 38px !important;
  }
  .career-fullscreen-overlay .career-round-status-btn svg {
    width: 22px !important;
    height: 22px !important;
  }
  .career-fullscreen-overlay .career-fs-round-name {
    font-size: 16px !important;
  }
  .career-fullscreen-overlay .career-fs-round-badge {
    font-size: 12px !important;
    padding: 3px 9px !important;
  }
  .career-fullscreen-overlay .career-fs-round-subtext {
    font-size: 14px !important;
    line-height: 1.6;
    margin-top: 10px;
  }
  .career-fullscreen-overlay .career-fs-round-textarea {
    font-size: 14.5px !important;
    min-height: 90px;
  }
  .career-fullscreen-overlay .career-fs-quick-bar {
    padding: 16px 20px;
    gap: 16px;
    margin-top: 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  .career-fullscreen-overlay .quick-actions-label {
    font-size: 14px !important;
  }
  .career-fullscreen-overlay .career-action-link {
    font-size: 13.5px !important;
    padding: 7px 14px !important;
  }

  /* Empty States for Fullscreen Overlays */
  .projects-fs-empty-sidebar,
  .career-fs-empty-sidebar {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px 16px;
    gap: 12px;
    text-align: center;
    color: #8e99ad;
    font-size: 13px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px dashed rgba(255, 255, 255, 0.12);
    border-radius: 8px;
    margin-top: 10px;
  }
  .projects-fs-empty-btn {
    background: rgba(255, 170, 0, 0.15);
    border: 1px solid #ffaa00;
    color: #ffaa00;
    font-size: 12px;
    font-weight: 700;
    padding: 6px 14px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .projects-fs-empty-btn:hover {
    background: #ffaa00;
    color: #000;
  }
  .career-fs-empty-btn {
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid #ef4444;
    color: #ff8593;
    font-size: 12px;
    font-weight: 700;
    padding: 6px 14px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .career-fs-empty-btn:hover {
    background: #ef4444;
    color: #fff;
  }

  .projects-fs-main-empty,
  .career-fs-main-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  .projects-fs-empty-card,
  .career-fs-empty-card {
    max-width: 520px;
    text-align: center;
    padding: 40px 32px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
  }
  .projects-fs-empty-icon-wrap,
  .career-fs-empty-icon-wrap {
    width: 72px;
    height: 72px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.03);
    display: grid;
    place-items: center;
    margin-bottom: 6px;
  }
  .projects-fs-empty-card h3,
  .career-fs-empty-card h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 750;
    color: #f6f6fa;
  }
  .projects-fs-empty-card p,
  .career-fs-empty-card p {
    margin: 0;
    font-size: 13.5px;
    color: #8e99ad;
    line-height: 1.5;
  }
  .projects-fs-empty-cta-btn {
    margin-top: 8px;
    background: #ffaa00;
    color: #000;
    font-size: 13.5px;
    font-weight: 750;
    padding: 9px 22px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    box-shadow: 0 0 14px rgba(255, 170, 0, 0.4);
    transition: all 0.15s ease;
  }
  .projects-fs-empty-cta-btn:hover {
    background: #ffbb22;
    transform: translateY(-1px);
    box-shadow: 0 0 20px rgba(255, 170, 0, 0.6);
  }
  .career-fs-empty-cta-btn {
    margin-top: 8px;
    background: #ef4444;
    color: #fff;
    font-size: 13.5px;
    font-weight: 750;
    padding: 9px 22px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    box-shadow: 0 0 14px rgba(239, 68, 68, 0.4);
    transition: all 0.15s ease;
  }
  .career-fs-empty-cta-btn:hover {
    background: #ff5555;
    transform: translateY(-1px);
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.6);
  }

  /* Global Syllabus Matrix Drawer */
  .global-syllabus-drawer {
    display: flex;
    flex-direction: column;
    gap: 7px;
    background: rgba(0, 0, 0, 0.45);
    border: 1px solid rgba(8, 186, 255, 0.35);
    border-radius: 8px;
    padding: 8px 10px;
    margin-bottom: 9px;
    max-height: 180px;
  }
  .global-syllabus-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    padding-bottom: 4px;
  }
  .global-syllabus-header h4 {
    margin: 0;
    font-size: 11px;
    color: #08baff;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
  .global-syllabus-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    overflow-y: auto;
    max-height: 140px;
  }
  .global-course-col {
    display: flex;
    flex-direction: column;
    gap: 4px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 6px;
    padding: 5px 6px;
  }
  .global-col-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 9.5px;
  }
  .global-col-title strong { color: #f4f5fa; }
  .global-col-title small { color: #8e99ad; }
  .global-topics-list {
    display: flex;
    flex-wrap: wrap;
    gap: 3px;
    max-height: 80px;
    overflow-y: auto;
  }
  .global-topic-chip {
    background: #111318;
    border: 1px solid #333644;
    color: #8e99ad;
    border-radius: 3px;
    padding: 1.5px 5px;
    font-size: 9px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 3px;
  }
  .global-topic-chip.done {
    border-color: rgba(0, 230, 160, 0.3);
    color: #00e6a0;
  }

  .learn-add-form {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 8px;
    background: rgba(255, 38, 59, 0.06);
    border: 1px solid rgba(255, 38, 59, 0.25);
    border-radius: 8px;
    margin-bottom: 9px;
  }
  .learn-add-row {
    display: flex;
    gap: 6px;
  }
  .learn-input {
    height: 26px;
    border: 1px solid #34313a;
    border-radius: 5px;
    background: #0c0c10;
    color: #f4f5fa;
    padding: 2px 6px;
    font: inherit;
    font-size: 11px;
    outline: none;
    flex: 1;
    min-width: 0;
  }
  .learn-input:focus {
    border-color: #ff5365;
  }
  .learn-form-btn {
    height: 25px;
    padding: 0 8px;
    border-radius: 5px;
    font-size: 11px;
    cursor: pointer;
  }
  .learn-submit {
    border: 1px solid #ff5365;
    background: #260910;
    color: #ff9aa5;
  }
  .learn-cancel {
    border: 1px solid #3a3a44;
    background: #141418;
    color: #aeb4c5;
  }

  /* 2x2 Bento Grid: Minimal clean cards (Progress ring, Title, Count, Eye button - NO topic list) */
  .learning-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 7px;
  }
  .course-card {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 38, 59, 0.2);
    border-radius: 8px;
    padding: 8px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    transition: border-color 0.15s ease, background 0.15s ease;
    min-width: 0;
  }
  .course-card:hover {
    border-color: rgba(255, 38, 59, 0.45);
    background: rgba(255, 255, 255, 0.035);
  }
  .course-card-left {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    flex: 1;
  }
  .course-ring {
    --p: 50%;
    --c: #ff263b;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    position: relative;
    background: conic-gradient(var(--c) var(--p), #20232a 0);
    flex-shrink: 0;
  }
  .course-ring:before {
    content: "";
    position: absolute;
    inset: 4px;
    background: #0d0e12;
    border-radius: 50%;
  }
  .course-ring b {
    position: relative;
    font-size: 10.5px;
    font-weight: 700;
    color: #f6f6fa;
    letter-spacing: -0.2px;
  }
  .course-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;
  }
  .course-title-wrap {
    display: flex;
    align-items: center;
    gap: 4px;
    min-width: 0;
  }
  .course-title {
    font-size: 11.5px;
    font-weight: 650;
    color: #f6f6fa;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2;
  }
  .course-inline-rename-btn {
    background: none;
    border: none;
    color: #5e6475;
    font-size: 9.5px;
    cursor: pointer;
    padding: 0 1px;
    line-height: 1;
  }
  .course-inline-rename-btn:hover { color: #08baff; }
  .course-count {
    font-size: 9.5px;
    color: #8e99ad;
    white-space: nowrap;
    margin-top: 1px;
  }
  .course-card-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    flex-shrink: 0;
  }
  .course-actions {
    display: flex;
    align-items: center;
    gap: 3px;
  }
  .course-tool-btn {
    width: 17px;
    height: 17px;
    padding: 0;
    border: 1px solid rgba(255, 83, 101, 0.35);
    border-radius: 3px;
    background: #15090d;
    color: #ff7380;
    font-size: 11px;
    line-height: 12px;
    cursor: pointer;
    display: grid;
    place-items: center;
  }
  .course-tool-btn:hover {
    background: #250c14;
    border-color: #ff5365;
    color: #fff;
  }
  .course-eye-btn {
    background: rgba(8, 186, 255, 0.08);
    border: 1px solid rgba(8, 186, 255, 0.4);
    border-radius: 4px;
    color: #08baff;
    font-size: 9.5px;
    font-weight: 700;
    padding: 2px 6px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 3px;
    transition: all 0.15s ease;
  }
  .course-eye-btn:hover {
    background: #08baff;
    color: #000;
    box-shadow: 0 0 6px rgba(8, 186, 255, 0.6);
  }

  /* Focused Course Section View */
  .learn-unhide-btn { background:#111a24; border:1px solid #08baff; border-radius:4px; color:#08baff; font-size:10.5px; font-weight:700; padding:2px 7px; cursor:pointer; display:inline-flex; align-items:center; gap:4px; transition:all .15s ease; white-space:nowrap; }
  .learn-unhide-btn:hover { background:#08baff; color:#000; box-shadow:0 0 8px rgba(8,186,255,.6); }

  .learning.is-focused { min-height: 192px; max-height: 192px; }
  .focused-course-view { display:flex; flex-direction:column; gap:6px; background:rgba(8,186,255,.03); border:1px solid rgba(8,186,255,.35); border-radius:8px; padding:8px 10px; width:100%; box-sizing:border-box; }
  .focused-course-hero { display:flex; align-items:center; gap:9px; padding-bottom:6px; border-bottom:1px solid rgba(255,255,255,.07); width:100%; }
  .course-ring.large { width:42px; height:42px; }
  .course-ring.large b { font-size:12px; }
  .focused-course-details { display:flex; flex-direction:column; flex:1; min-width:0; }
  .focused-course-title-row { display:flex; align-items:center; gap:5px; }
  .focused-course-title { margin:0; font-size:13.5px; font-weight:700; color:#f6f6fa; }
  .course-edit-title-btn { background:none; border:none; color:#788094; font-size:11px; cursor:pointer; padding:0 2px; }
  .course-edit-title-btn:hover { color:#08baff; }
  .focused-course-stats { font-size:10.5px; color:#8e99ad; margin-top:2px; }

  .focused-syllabus-section { display:flex; flex-direction:column; width:100%; }
  .focused-syllabus-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:5px; }
  .focused-syllabus-header h5 { margin:0; font-size:10.5px; color:#00e6a0; text-transform:uppercase; letter-spacing:0.3px; }
  .focused-syllabus-hint { font-size:9px; color:#6a7182; }

  /* 1 TOPIC PER ROW (FULL WIDTH) */
  .focused-topics-grid { display:flex; flex-direction:column; gap:5px; width:100%; max-height:100px; overflow-y:auto; padding-right:4px; box-sizing:border-box; }
  .focused-topics-grid::-webkit-scrollbar { width:3px; }
  .focused-topics-grid::-webkit-scrollbar-thumb { background:#08baff; border-radius:2px; }

  .focused-topic-card { display:flex; flex-direction:column; gap:3px; width:100%; box-sizing:border-box; padding:4px 7px; border-radius:5px; background:rgba(255,255,255,.025); border:1px solid rgba(255,255,255,.06); transition:all .15s ease; }
  .focused-topic-card:hover { border-color:rgba(8,186,255,.3); }
  .focused-topic-card.is-done { background:rgba(0,230,160,.04); border-color:rgba(0,230,160,.22); }
  .focused-topic-main-row { display:flex; align-items:flex-start; gap:6px; width:100%; min-width:0; }
  .topic-expand-btn { display:inline-flex; align-items:center; justify-content:center; width:18px; height:18px; background:rgba(8,186,255,0.1); border:1px solid rgba(8,186,255,0.3); border-radius:3px; color:#08baff; cursor:pointer; padding:0; flex-shrink:0; margin-top:1px; transition:all 0.15s ease; }
  .topic-expand-btn:hover { background:rgba(8,186,255,0.22); border-color:#08baff; }
  .topic-bullet { color:#555866; font-size:9px; line-height:1; flex-shrink:0; width:10px; text-align:center; margin-top:3px; }
  .focused-topic-toggle { display:flex; align-items:flex-start; gap:6px; background:none; border:none; padding:0; color:#8e99ad; font:inherit; font-size:11px; font-weight:600; cursor:pointer; text-align:left; flex:1; min-width:0; }
  .focused-topic-card.is-done .focused-topic-toggle { color:#f6f6fa; }
  .focused-topic-toggle .topic-icon { font-weight:800; font-size:10px; color:#ffaa00; flex-shrink:0; margin-top:1px; }
  .focused-topic-card.is-done .focused-topic-toggle .topic-icon { color:#00e6a0; }
  .topic-num { font-size:10px; color:#788094; flex-shrink:0; margin-top:1px; }
  .topic-text { white-space:pre-wrap; word-break:break-word; line-height:1.35; flex:1; min-width:0; max-height:140px; overflow-y:auto; padding-right:2px; }
  .topic-text::-webkit-scrollbar { width:2.5px; }
  .topic-text::-webkit-scrollbar-thumb { background:#08baff; border-radius:2px; }
  .topic-sub-counter { font-size:9.5px; color:#08baff; font-weight:500; margin-left:3px; white-space:nowrap; flex-shrink:0; margin-top:1px; }
  .focused-topic-actions { display:flex; align-items:center; gap:3px; flex-shrink:0; align-self:flex-start; margin-top:1px; }
  .topic-action-btn { background:none; border:none; font-size:11px; line-height:1; cursor:pointer; padding:1px 2px; color:#616677; border-radius:3px; }
  .topic-action-btn:hover { background:rgba(255,255,255,.06); }
  .topic-action-btn.add:hover { color:#00e6a0; }
  .topic-action-btn.edit:hover { color:#08baff; }
  .topic-action-btn.del:hover { color:#ff5365; }

  /* Subtopics Section */
  .topic-subtopics-list { display:flex; flex-direction:column; gap:2.5px; padding:3px 0 3px 12px; border-left:1.5px dashed rgba(8,186,255,.3); margin:2px 0 2px 5px; width:calc(100% - 10px); box-sizing:border-box; }
  .subtopic-item { display:flex; align-items:flex-start; justify-content:space-between; gap:5px; padding:2px 5px; border-radius:3px; background:rgba(0,0,0,.3); border:1px solid rgba(255,255,255,.03); width:100%; box-sizing:border-box; }
  .subtopic-item.is-done { border-color:rgba(0,230,160,.2); background:rgba(0,230,160,.04); }
  .subtopic-toggle { display:flex; align-items:flex-start; gap:5px; background:none; border:none; padding:0; color:#788094; font:inherit; font-size:10px; cursor:pointer; text-align:left; flex:1; min-width:0; }
  .subtopic-item.is-done .subtopic-toggle { color:#e1e5f0; }
  .subtopic-icon { font-size:9px; font-weight:800; color:#ffaa00; flex-shrink:0; margin-top:1px; }
  .subtopic-item.is-done .subtopic-icon { color:#00e6a0; }
  .subtopic-name { white-space:pre-wrap; word-break:break-word; line-height:1.35; flex:1; min-width:0; max-height:120px; overflow-y:auto; padding-right:2px; }
  .subtopic-name::-webkit-scrollbar { width:2.5px; }
  .subtopic-name::-webkit-scrollbar-thumb { background:#08baff; border-radius:2px; }
  .subtopic-actions { display:flex; align-items:center; gap:2px; flex-shrink:0; align-self:flex-start; margin-top:1px; }
  .subtopic-btn { background:none; border:none; font-size:10px; line-height:1; cursor:pointer; padding:0 2px; color:#4e5262; }
  .subtopic-btn.edit:hover { color:#08baff; }
  .subtopic-btn.del:hover { color:#ff5365; }

  .subtopic-quick-add { display:flex; gap:3px; margin-top:2px; width:100%; box-sizing:border-box; }
  .subtopic-add-input { flex:1; height:22px; background:#090a0d; border:1px solid #282a36; border-radius:3px; color:#f4f5fa; font:inherit; font-size:9px; padding:2px 5px; outline:none; }
  .subtopic-add-input:focus { border-color:#08baff; }
  .subtopic-add-btn { height:22px; padding:0 6px; background:#09131e; border:1px solid #08baff; border-radius:3px; color:#8fdfff; font-size:9px; cursor:pointer; }

  /* Level 3: Nested Sub-Subtopics / Leaf Items */
  .subtopic-card-wrap { display: flex; flex-direction: column; gap: 2px; width: 100%; box-sizing: border-box; }
  .subtopic-expand-btn { display:inline-flex; align-items:center; justify-content:center; width:16px; height:16px; background:rgba(0,230,160,0.1); border:1px solid rgba(0,230,160,0.3); border-radius:3px; color:#00e6a0; cursor:pointer; padding:0; flex-shrink:0; margin-top:1px; transition:all 0.15s ease; }
  .subtopic-expand-btn:hover { background:rgba(0,230,160,0.22); border-color:#00e6a0; }
  .subtopic-bullet { color: #44495c; font-size: 9px; line-height: 1; flex-shrink: 0; width: 9px; text-align: center; margin-top: 2px; }
  .subtopic-counter { font-size: 9px; color: #00e6a0; font-weight: 500; margin-left: 3px; white-space: nowrap; flex-shrink: 0; margin-top: 1px; }
  .subsubtopics-list { display: flex; flex-direction: column; gap: 2px; padding: 2px 0 2px 10px; border-left: 1.5px dashed rgba(0, 230, 160, 0.35); margin: 1px 0 2px 8px; width: calc(100% - 12px); box-sizing: border-box; }
  .subsubtopic-item { display: flex; align-items: flex-start; justify-content: space-between; gap: 4px; padding: 2px 5px; border-radius: 3px; background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.025); width: 100%; box-sizing: border-box; }
  .subsubtopic-item.is-done { border-color: rgba(0, 230, 160, 0.2); background: rgba(0, 230, 160, 0.035); }
  .subsubtopic-toggle { display: flex; align-items: flex-start; gap: 5px; background: none; border: none; padding: 0; color: #8892a7; font: inherit; font-size: 9.5px; cursor: pointer; text-align: left; flex: 1; min-width: 0; }
  .subsubtopic-item.is-done .subsubtopic-toggle { color: #555c6d; text-decoration: line-through; }
  .subsubtopic-icon { font-size: 8px; font-weight: 800; color: #ffaa00; flex-shrink: 0; text-decoration: none !important; margin-top: 1px; }
  .subsubtopic-item.is-done .subsubtopic-icon { color: #00e6a0; }
  .subsubtopic-name { white-space: pre-wrap; word-break: break-word; line-height: 1.35; flex: 1; min-width: 0; max-height: 100px; overflow-y: auto; padding-right: 2px; }
  .subsubtopic-name::-webkit-scrollbar { width: 2px; }
  .subsubtopic-name::-webkit-scrollbar-thumb { background: #00e6a0; border-radius: 1px; }
  .subsubtopic-actions { display: flex; align-items: center; gap: 2px; flex-shrink: 0; align-self: flex-start; margin-top: 1px; }
  .subsubtopic-btn { background: none; border: none; font-size: 9.5px; line-height: 1; cursor: pointer; padding: 0 2px; color: #4e5262; }
  .subsubtopic-btn:hover { color: #08baff; }
  .subsubtopic-btn.del:hover { color: #ff5365; }
  .subsubtopic-quick-add { display: flex; gap: 3px; margin-top: 2px; width: 100%; box-sizing: border-box; }
  .subsubtopic-add-input { flex: 1; height: 20px; background: #07080b; border: 1px solid #20232c; border-radius: 3px; color: #f4f5fa; font: inherit; font-size: 8.5px; padding: 1px 4px; outline: none; }
  .subsubtopic-add-input:focus { border-color: #00e6a0; }
  .subsubtopic-add-btn { height: 20px; padding: 0 5px; background: #061713; border: 1px solid #00e6a0; border-radius: 3px; color: #72ffcf; font-size: 8.5px; cursor: pointer; }
  .subsubtopic-item.is-editing { display: flex; align-items: flex-start; gap: 4px; width: 100%; box-sizing: border-box; background: rgba(0, 230, 160, 0.06); border-color: rgba(0, 230, 160, 0.3); }
  .subsubtopic-inline-edit-input { flex: 1; min-width: 0; min-height: 24px; max-height: 100px; background: #090a0e; border: 1px solid #00e6a0; border-radius: 3px; color: #e1e5f0; font: inherit; font-size: 9px; line-height: 1.35; padding: 2px 5px; outline: none; resize: vertical; }
  .subsubtopic-btn.save { color: #00e6a0; font-weight: bold; }
  .subsubtopic-btn.cancel { color: #ff5365; font-weight: bold; }

  .focused-add-topic-form { display:flex; gap:5px; margin-top:5px; padding-top:5px; border-top:1px solid rgba(255,255,255,.06); width:100%; box-sizing:border-box; }
  .focused-topic-input { flex:1; height:24px; background:#090a0d; border:1px solid #333644; border-radius:3px; color:#f4f5fa; font:inherit; font-size:9.5px; padding:2px 6px; outline:none; }
  .focused-topic-input:focus { border-color:#08baff; }
  .focused-topic-submit { height:24px; padding:0 7px; background:#09131e; border:1px solid #08baff; border-radius:3px; color:#8fdfff; font-size:9.5px; cursor:pointer; }

  .task-edit-row { display:flex; align-items:center; gap:6px; flex:1; min-width:0; }
  .task-inline-input { flex:1; min-width:0; height:22px; border:1px solid #ff5365; border-radius:4px; background:#0c0c10; color:#f4f5fa; font:inherit; font-size:11px; padding:1px 6px; outline:none; }
  .task-inline-input:focus { box-shadow:0 0 5px rgba(255,38,59,.6); }
  .task-inline-min { width:42px; height:22px; border:1px solid #444755; border-radius:4px; background:#0c0c10; color:#f4f5fa; font:inherit; font-size:10px; padding:1px 4px; text-align:center; outline:none; }
  .task-min-label { font-size:9px; color:#8e99ad; }

  .course-title-wrap { display:flex; align-items:center; gap:4px; min-width:0; }
  .course-title-wrap.is-editing { display:flex; align-items:center; gap:3px; min-width:0; flex:1; }
  .course-inline-rename-btn { background:none; border:none; color:#5e6475; font-size:9px; cursor:pointer; padding:0 1px; line-height:1; }
  .course-inline-rename-btn:hover { color:#08baff; }
  .course-inline-rename-btn.save { color:#00e6a0; font-weight:bold; }
  .course-inline-rename-btn.cancel { color:#ff5365; font-weight:bold; }

  /* Course, Topic, Subtopic Inline Editing */
  .focused-course-title-row.is-editing { display:flex; align-items:center; gap:5px; flex:1; min-width:0; }
  .course-inline-edit-input { flex:1; min-width:0; height:24px; background:#0c0d12; border:1px solid #08baff; border-radius:4px; color:#f6f6fa; font:inherit; font-size:12.5px; font-weight:700; padding:1px 6px; outline:none; box-shadow:0 0 6px rgba(8,186,255,.3); }
  .course-inline-edit-input.compact { height:20px; font-size:10.5px; font-weight:600; padding:1px 4px; max-width:140px; }
  .course-edit-title-btn.save { color:#00e6a0; font-weight:bold; }
  .course-edit-title-btn.cancel { color:#ff5365; font-weight:bold; }

  .focused-topic-main-row.is-editing { display:flex; align-items:flex-start; gap:5px; width:100%; min-width:0; }
  .topic-inline-edit-input { flex:1; min-width:0; min-height:28px; max-height:140px; background:#0c0d12; border:1px solid #08baff; border-radius:3px; color:#f6f6fa; font:inherit; font-size:10.5px; font-weight:500; line-height:1.35; padding:3px 6px; outline:none; resize:vertical; box-shadow:0 0 5px rgba(8,186,255,.3); }
  .topic-action-btn.save { color:#00e6a0; font-weight:bold; }
  .topic-action-btn.cancel { color:#ff5365; font-weight:bold; }

  .subtopic-item.is-editing { display:flex; align-items:flex-start; gap:5px; width:100%; box-sizing:border-box; background:rgba(8,186,255,.06); border-color:rgba(8,186,255,.3); }
  .subtopic-inline-edit-input { flex:1; min-width:0; min-height:26px; max-height:120px; background:#090a0e; border:1px solid #08baff; border-radius:3px; color:#e1e5f0; font:inherit; font-size:9.5px; line-height:1.35; padding:2px 5px; outline:none; resize:vertical; }
  .subtopic-btn.save { color:#00e6a0; font-weight:bold; }
  .subtopic-btn.cancel { color:#ff5365; font-weight:bold; }

  .learning-pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 9px;
    padding-top: 6px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }
  .learn-page-nav-btn {
    width: 22px;
    height: 18px;
    padding: 0;
    border: 1px solid rgba(255, 83, 101, 0.35);
    border-radius: 3px;
    background: #15090d;
    color: #ff7380;
    font-size: 14px;
    line-height: 16px;
    cursor: pointer;
    display: grid;
    place-items: center;
    transition: all 0.15s ease;
  }
  .learn-page-nav-btn:disabled {
    opacity: 0.25;
    cursor: default;
    border-color: #2e303c;
    color: #555866;
    background: #0d0e12;
  }
  .learn-page-nav-btn:not(:disabled):hover {
    background: #250c14;
    border-color: #ff5365;
    color: #fff;
  }
  .learn-page-indicator {
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .learn-page-dots {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .learn-page-dot {
    width: 5px;
    height: 5px;
    padding: 0;
    border-radius: 50%;
    border: 1px solid #444755;
    background: #1b1d24;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .learn-page-dot.active {
    background: #ff263b;
    border-color: #ff263b;
    box-shadow: 0 0 5px rgba(255, 38, 59, 0.7);
    transform: scale(1.2);
  }
  .learn-page-label {
    font-size: 9.5px;
    color: #8e99ad;
    font-weight: 500;
  }

  .ring { --p:50%; --c:#ff263b; width:66px;height:66px;border-radius:50%; display:grid;place-items:center; position:relative; background:conic-gradient(var(--c) var(--p),#24262b 0); }
  .ring:before { content:"";position:absolute;inset:7px;background:#090a0d;border-radius:50%; }
  .ring b { position:relative;font-size:14px; } .ring.mini { width:58px;height:58px; } .ring.mini:before { inset:7px; }
  .learn small { color:#e1e4eb; font-size:11px; }
  .quick {
    width: calc(100% + 20px);
    min-height: 250px;
    padding: 4px 0 12px;
    margin-top: auto;
    display: flex;
    flex-direction: column;
    border: none;
    box-shadow: none;
    background: transparent;
  }
  .quick-groups {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 9px;
    align-items: stretch;
    flex: 1;
  }
  .quick-group {
    min-height: 195px;
    padding: 9px 8px 14px;
    border: 1px solid rgba(255, 35, 54, 0.35);
    border-radius: 9px;
    background: rgba(255, 255, 255, 0.025);
    display: flex;
    flex-direction: column;
  }
  .quick-group-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    margin-bottom: 9px;
  }
  .quick-group h4 {
    color: #ff5969;
    font-size: 11px;
    font-weight: 600;
    margin: 0;
    white-space: nowrap;
  }
  .quick-actions {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .quick-tool {
    width: 17px;
    height: 17px;
    padding: 0;
    border: 1px solid rgba(255, 83, 101, 0.55);
    border-radius: 4px;
    background: #15090d;
    color: #ff7380;
    font-size: 12px;
    line-height: 14px;
    cursor: pointer;
    display: grid;
    place-items: center;
  }
  .quick-tool:hover {
    border-color: #ff5365;
    color: #fff;
    background: #250c14;
  }

  .quick-groups .apps,
  .quick-groups .dev-apps,
  .quick-groups .stacked-apps {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 9px 4px;
    justify-items: center;
    align-content: start;
    width: 100%;
    flex: 1;
  }
  .quick-groups .app {
    width: 100%;
    max-width: 58px;
    position: relative;
    text-align: center;
  }
  .quick-groups .app-launch {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    cursor: pointer;
  }
  .quick-groups .app-icon {
    width: 44px;
    height: 44px;
    display: block;
    object-fit: contain;
    margin: 0 auto 3px;
    border-radius: 9px;
    transition: transform 0.15s ease, filter 0.15s ease;
  }
  .quick-groups .app-launch:hover .app-icon {
    transform: scale(1.08);
    filter: drop-shadow(0 0 6px rgba(255, 83, 101, 0.5));
  }
  .quick-groups .app-icon-fallback {
    display: grid;
    place-items: center;
    background: linear-gradient(145deg, #147cff, #111a36);
    color: white;
    font-weight: 700;
    font-size: 18px;
  }
  .app-icon-linkedin { background:#0a66c2; }
  .app-icon-naukri { background:linear-gradient(145deg,#ff7b1c,#e13a22); }
  .app-icon-gmail { background:#fff;color:#d93025; }
  .quick-groups .app small {
    display: block;
    width: 100%;
    font-size: 8px;
    line-height: 1.1;
    color: #d4d8e2;
    white-space: normal;
    overflow-wrap: anywhere;
    text-align: center;
    margin-top: 2px;
  }
  .quick-groups .app-remove {
    position: absolute;
    top: -4px;
    right: 2px;
    width: 15px;
    height: 15px;
    padding: 0;
    border: 1px solid #ff5365;
    border-radius: 50%;
    background: #1a070c;
    color: white;
    font-size: 11px;
    line-height: 12px;
    cursor: pointer;
    display: grid;
    place-items: center;
  }
  .status { width:calc(100% - 116px); align-self:flex-end; padding:14px; }
  .ai { width:calc(100% - 165px); align-self:flex-end; min-height:140px; }
  .emails {
    width: calc(100% - 165px);
    align-self: flex-end;
    flex: 1;
    min-height: 190px;
    max-height: 250px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 10px 14px;
    overflow: hidden;
  }
  .live { color:#00e6a0 !important; }
  .ai-apps-section { min-height:0; padding:7px 9px; margin-top:8px; border:1px solid rgba(255,35,54,0.3); border-radius:8px; background:rgba(255,255,255,0.02); }
  .ai-apps-section h4 { color:#ff5969;font-size:11px;font-weight:600;margin:0;white-space:nowrap; }
  .ai-apps {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 12px;
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 3px 1px 4px;
  }
  .ai-apps::-webkit-scrollbar { height: 3px; }
  .ai-apps::-webkit-scrollbar-thumb { background: rgba(255, 38, 59, 0.45); border-radius: 2px; }
  .ai-apps .app {
    flex: 0 0 auto;
    width: 54px;
    position: relative;
    text-align: center;
  }
  .ai-apps .app-launch {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    cursor: pointer;
  }
  .ai-apps .app-icon {
    width: 42px;
    height: 42px;
    border-radius: 9px;
    object-fit: cover;
    box-shadow: 0 0 6px rgba(255, 38, 59, 0.22);
  }
  .ai-apps .app-icon-fallback {
    display: grid;
    place-items: center;
    border: 1px solid rgba(255, 38, 59, 0.45);
    background: #18090f;
    color: #ff4d61;
    font-size: 13px;
    font-weight: 700;
  }
  .ai-apps .app small {
    display: block;
    width: 100%;
    font-size: 9px;
    color: #c9d0df;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    margin-top: 3px;
  }
  .ai-apps .app-remove {
    position: absolute;
    top: -4px;
    right: 1px;
    width: 14px;
    height: 14px;
    padding: 0;
    border: 1px solid #ff5365;
    border-radius: 50%;
    background: #1a070c;
    color: white;
    font-size: 10px;
    line-height: 12px;
    cursor: pointer;
    display: grid;
    place-items: center;
  }
  .ai-apps-empty { color:#9da5b5;font-size:10px; }
  .metrics { display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px; }
  .metric { display:flex;align-items:center;flex-direction:column;gap:5px;text-align:center;min-width:0; }
  .metric strong { font-size:11px; } .metric small { font-size:9px;white-space:normal; }
  .network { display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;align-items:stretch;border-top:1px solid #25252b;margin-top:13px;padding-top:11px;min-height:62px; }
  .network-item { display:flex;align-items:center;gap:7px;min-width:0;height:50px; }
  .network-copy { min-width:0;overflow:hidden; }
  .bubble { width:27px;height:27px;flex:0 0 27px;border-radius:50%;display:grid;place-items:center;background:#0879ff;font-weight:700;font-size:10px;color:#fff; }
  .bubble svg { width:16px;height:16px;display:block;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round; }
  .network strong { display:block;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; } .network small { font-size:9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
  .network .download { color:#08baff; } .network .upload { color:#ff4050; }
  .ai { padding:14px; }
  .modelchips { display:flex;gap:6px;margin:9px 0; }
  .modelchips span,.actions span { border:1px solid #454047;border-radius:8px;padding:7px 8px;font-size:10px;background:#111115; }
  .modelchips span:first-child { background:#f21c34;border-color:#f21c34; }
  .prompt { border:1px solid #333039;border-radius:9px;padding:13px 10px;color:#8e99ad;font-size:11px;background:#090a0c; }
  .prompt b { float:right;color:white;background:#ff203b;border-radius:7px;padding:5px 9px;margin-top:-6px; }
  .actions { display:flex;gap:5px;flex-wrap:wrap;margin-top:8px; }
  .hint { margin-top:8px; }
  /* Live Apple Mail Section */
  .mail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 5px;
    flex-shrink: 0;
  }
  .mail-filter-tabs {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 6px;
    flex-shrink: 0;
    width: 100%;
    box-sizing: border-box;
    overflow-x: auto;
  }
  .mail-filter-tabs::-webkit-scrollbar { display: none; }
  .mail-filter-tab {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 4px;
    color: #8e99ad;
    font-family: inherit;
    font-size: 9px;
    font-weight: 600;
    padding: 2.5px 7px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
    transition: all 0.15s ease;
  }
  .mail-filter-tab:hover {
    background: rgba(255, 255, 255, 0.07);
    color: #f6f6fa;
    border-color: rgba(255, 255, 255, 0.18);
  }
  .mail-filter-tab.active {
    background: rgba(255, 38, 59, 0.18);
    border-color: #ff263b;
    color: #ff8593;
    box-shadow: 0 0 6px rgba(255, 38, 59, 0.35);
  }
  .mail-filter-tab.jobs-tab.active {
    background: rgba(8, 186, 255, 0.18);
    border-color: #08baff;
    color: #8fdfff;
    box-shadow: 0 0 6px rgba(8, 186, 255, 0.35);
  }
  .mail-filter-tab.unread-tab.active {
    background: rgba(255, 170, 0, 0.18);
    border-color: #ffaa00;
    color: #ffd27f;
    box-shadow: 0 0 6px rgba(255, 170, 0, 0.35);
  }
  .mail-tab-count {
    font-size: 8.5px;
    opacity: 0.85;
    font-weight: 500;
  }
  .mail-tab-count.has-unread {
    color: #ff5365;
    font-weight: 700;
  }
  .mail-job-tag {
    display: inline-block;
    font-size: 7.5px;
    font-weight: 700;
    color: #08baff;
    background: rgba(8, 186, 255, 0.12);
    border: 1px solid rgba(8, 186, 255, 0.4);
    border-radius: 2.5px;
    padding: 0 3px;
    margin-left: 5px;
    letter-spacing: 0.4px;
    line-height: 1.2;
    vertical-align: middle;
  }
  .mail-item.is-job-mail {
    border-left: 2.5px solid rgba(8, 186, 255, 0.6);
  }
  .mail-title-wrap {
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .mail-title-icon {
    width: 15px;
    height: 15px;
    color: #ff263b;
    filter: drop-shadow(0 0 5px rgba(255, 38, 59, 0.6));
    flex-shrink: 0;
  }
  .mail-header h3 {
    margin: 0;
    font-size: 13.5px;
    font-weight: 700;
    color: #f6f6fa;
  }
  .mail-unread-badge {
    font-size: 8.5px;
    font-weight: 700;
    padding: 1px 5px;
    border-radius: 3px;
    background: rgba(255, 38, 59, 0.2);
    border: 1px solid #ff263b;
    color: #ff5365;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
  .mail-header-actions {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .mail-stats {
    font-size: 10px;
    color: #8e99ad;
    font-weight: 500;
  }
  .mail-open-app-btn {
    background: #15090d;
    border: 1px solid rgba(255, 83, 101, 0.45);
    border-radius: 4px;
    color: #ff7380;
    font-size: 9px;
    font-weight: 600;
    padding: 2px 7px;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .mail-open-app-btn:hover {
    background: #250c14;
    border-color: #ff5365;
    color: #fff;
    box-shadow: 0 0 6px rgba(255, 38, 59, 0.5);
  }
  .mail-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    overflow-y: auto;
    flex: 1;
    padding-right: 4px;
    margin-top: 2px;
  }
  .mail-list::-webkit-scrollbar {
    width: 3px;
  }
  .mail-list::-webkit-scrollbar-thumb {
    background: #ff263b;
    border-radius: 2px;
  }
  .mail-item {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 5px 8px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 38, 59, 0.15);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s ease;
    min-width: 0;
  }
  .mail-item:hover {
    background: rgba(255, 38, 59, 0.08);
    border-color: rgba(255, 38, 59, 0.45);
    transform: translateX(2px);
  }
  .mail-item.unread {
    background: rgba(255, 38, 59, 0.06);
    border-color: rgba(255, 38, 59, 0.35);
  }
  .mail-avatar {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    background: linear-gradient(135deg, #ff263b, #8b0719);
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    display: grid;
    place-items: center;
    flex-shrink: 0;
  }
  .mail-item.unread .mail-avatar {
    box-shadow: 0 0 6px rgba(255, 38, 59, 0.6);
  }
  .mail-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    gap: 1.5px;
  }
  .mail-row-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    min-width: 0;
  }
  .mail-sender {
    font-size: 11px;
    font-weight: 650;
    color: #f6f6fa;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .mail-item.unread .mail-sender {
    color: #fff;
    font-weight: 750;
  }
  .mail-unread-dot {
    font-size: 7px;
    color: #ff263b;
    filter: drop-shadow(0 0 4px rgba(255, 38, 59, 0.9));
  }
  .mail-date {
    font-size: 9.5px;
    color: #8e99ad;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .mail-subject {
    font-size: 10px;
    color: #aeb4c5;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .mail-item.unread .mail-subject {
    color: #e1e5f0;
  }
  .mail-empty-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 24px 10px;
    color: #888;
    font-size: 10.5px;
    text-align: center;
    flex: 1;
  }
  .mail-empty-icon {
    width: 24px;
    height: 24px;
    color: #555;
  }
  .mail-open-btn {
    background: rgba(255, 38, 59, 0.15);
    border: 1px solid #ff263b;
    color: #ff9aa5;
    border-radius: 4px;
    padding: 4px 12px;
    cursor: pointer;
    font-size: 10px;
    font-weight: 600;
    transition: all 0.15s ease;
  }
  .mail-open-btn:hover {
    background: #ff263b;
    color: #fff;
  }
  .bottomcards { display:grid; grid-template-columns:1fr 1.25fr; gap:10px; margin-top:0; }
  .bottomcards > .panel { min-height:210px; padding:10px 12px; }
  .projects { display:flex; flex-direction:column; min-height:210px; max-height:290px; overflow-y:auto; padding:10px 12px; }
  .projects::-webkit-scrollbar { width:3px; }
  .projects::-webkit-scrollbar-thumb { background:#ff263b; border-radius:2px; }
  .projects-heading { display:flex; align-items:center; gap:8px; margin-bottom:7px; }
  .projects-heading h3 { margin:0; font-size:13.5px; font-weight:700; }
  .projects-stats { margin-left:auto; color:#aeb4c5; font-size:10.5px; font-weight:500; display:flex; align-items:center; gap:6px; }
  .proj-add-toggle { width:18px; height:18px; padding:0; border:1px solid rgba(255,83,101,.55); border-radius:4px; background:#15090d; color:#ff7380; font-size:13.5px; line-height:16px; cursor:pointer; display:grid; place-items:center; }
  .proj-add-toggle:hover { border-color:#ff5365; color:#fff; background:#220910; }

  .proj-add-form { display:flex; flex-direction:column; gap:5px; padding:6px; background:rgba(255,38,59,.06); border:1px solid rgba(255,38,59,.25); border-radius:7px; margin-bottom:7px; }
  .proj-add-row { display:flex; gap:5px; }
  .proj-name-input, .proj-stack-input { height:26px; border:1px solid #34313a; border-radius:4px; background:#0c0c10; color:#f4f5fa; padding:2px 7px; font:inherit; font-size:11px; outline:none; }
  .proj-name-input:focus, .proj-stack-input:focus { border-color:#ff5365; }
  .proj-name-input { flex:1.3; min-width:0; }
  .proj-stack-input { flex:1; min-width:0; }
  .proj-form-btn { height:24px; padding:0 9px; border-radius:4px; font-size:10.5px; cursor:pointer; }
  .proj-submit { border:1px solid #ff5365; background:#260910; color:#ff9aa5; }
  .proj-cancel { border:1px solid #3a3a44; background:#141418; color:#aeb4c5; }

  .proj-list { display:flex; flex-direction:column; gap:6px; flex:1; }
  .proj-card { background:rgba(255,255,255,.02); border:1px solid rgba(255,38,59,.22); border-radius:8px; padding:6px 9px; transition:border-color .15s ease; }
  .proj-card:hover { border-color:rgba(255,38,59,.45); }
  .proj-card.is-shipped { border-color:rgba(0,230,160,.28); }
  .proj-header { display:flex; flex-direction:column; gap:2px; margin-bottom:3px; }
  .proj-top-row { display:flex; align-items:center; justify-content:space-between; gap:6px; min-width:0; }
  .proj-meta-row { display:flex; align-items:center; justify-content:flex-end; gap:6px; margin-top:1px; }
  .proj-title-btn { background:none; border:none; padding:0; color:inherit; font:inherit; text-align:left; cursor:pointer; display:flex; align-items:baseline; gap:5px; flex:1; min-width:0; overflow:hidden; }
  .proj-arrow { font-size:10px; color:#ff5365; line-height:1; flex-shrink:0; }
  .proj-name { font-weight:700; font-size:12px; color:#f6f6fa; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .proj-stack { font-size:10px; color:#8e99ad; font-weight:400; margin-left:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

  .proj-tools-group { display:flex; align-items:center; gap:3px; flex-shrink:0; }
  .proj-passed-text { font-size:10px; color:#c0c6d4; white-space:nowrap; }
  .proj-stage-badge { font-size:9px; font-weight:700; padding:1.5px 5px; border-radius:3px; text-transform:uppercase; letter-spacing:0.3px; white-space:nowrap; border:1px solid transparent; }
  .proj-tool-btn { width:17px; height:17px; padding:0; border:1px solid rgba(255,83,101,.4); border-radius:3px; background:#15090d; color:#ff7380; font-size:11.5px; line-height:14px; cursor:pointer; display:grid; place-items:center; }
  .proj-tool-btn:hover { background:#250c14; border-color:#ff5365; color:#fff; }

  .proj-segments { display:flex; gap:2.5px; height:6px; width:100%; margin:3px 0 5px; align-items:center; }
  .proj-seg { flex:1; height:100%; border-radius:1.5px; background:#20232a; transition:all .2s ease; }
  .proj-seg.active { background:#ff263b; box-shadow:0 0 4px rgba(255,38,59,.55); }
  .proj-seg.active-complete { background:#00e6a0; box-shadow:0 0 5px rgba(0,230,160,.65); }

  .proj-blocker { font-size:10px; color:#ffaa00; margin-top:2px; display:flex; align-items:center; gap:4px; }
  .proj-blocker.is-complete { color:#00e6a0; font-weight:600; }

  .proj-gates-list { display:flex; flex-direction:column; gap:3px; margin-top:5px; padding-top:5px; border-top:1px solid rgba(255,255,255,.05); width:100%; }
  .proj-gate-item { display:flex; align-items:center; gap:7px; width:100%; box-sizing:border-box; background:rgba(255,255,255,.025); border:1px solid rgba(255,255,255,.05); padding:3px 7px; text-align:left; cursor:pointer; border-radius:4px; font:inherit; color:#8e99ad; font-size:10.5px; line-height:1.3; transition:all .12s ease; }
  .proj-gate-label { flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-size:10.5px; font-weight:500; }
  .proj-gate-item:hover { color:#e1e5f0; }
  .proj-gate-item.checked { color:#ff5365; }
  .proj-check-box { width:13px; height:13px; border:1px solid #525666; border-radius:3px; display:grid; place-items:center; font-size:9.5px; font-weight:800; color:#0c0c10; line-height:1; flex-shrink:0; background:transparent; transition:all .15s ease; }
  .proj-gate-item.checked .proj-check-box { background:#ff263b; border-color:#ff263b; color:#fff; box-shadow:0 0 3px rgba(255,38,59,.5); }

  .proj-pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 5px;
    padding-top: 4px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }
  .proj-page-nav-btn {
    width: 22px;
    height: 18px;
    padding: 0;
    border: 1px solid rgba(255, 83, 101, 0.35);
    border-radius: 3px;
    background: #15090d;
    color: #ff7380;
    font-size: 13.5px;
    line-height: 14px;
    cursor: pointer;
    display: grid;
    place-items: center;
  }
  .proj-page-nav-btn:hover:not(:disabled) {
    border-color: #ff5365;
    background: #250c14;
    color: #fff;
  }
  .proj-page-nav-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    border-color: #2a2530;
    color: #555260;
  }
  .proj-page-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .proj-page-dots {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .proj-page-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #333644;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .proj-page-dot.active {
    background: #ff263b;
    box-shadow: 0 0 5px rgba(255, 38, 59, 0.8);
    transform: scale(1.2);
  }
  .proj-page-counter {
    font-size: 10px;
    color: #8e99ad;
    font-weight: 500;
  }

  /* Career Tracker Master-Detail Round Inspector */
  .career.panel {
    background: rgba(8, 8, 8, 0.94);
    border: 1.2px solid #991b1b;
    border-radius: 14px;
    padding: 8px 10px;
    display: flex;
    flex-direction: column;
    min-height: 210px;
    max-height: 290px;
    box-sizing: border-box;
    overflow: hidden;
    box-shadow: 0 0 14px rgba(153, 27, 27, 0.15), inset 0 0 18px rgba(255, 255, 255, 0.015);
  }

  .career-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    margin-bottom: 6px;
    flex-wrap: wrap;
    flex-shrink: 0;
  }
  .career-title-wrap {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .career-star {
    color: #ef4444;
    font-size: 13.5px;
    line-height: 1;
    filter: drop-shadow(0 0 4px rgba(239, 68, 68, 0.7));
  }
  .career-header h3 {
    margin: 0;
    font-size: 13.5px;
    font-weight: 700;
    color: #f6f6fa;
    white-space: nowrap;
    letter-spacing: 0.2px;
  }

  .career-funnel-pills {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-wrap: wrap;
  }
  .funnel-pill {
    font-size: 10px;
    font-weight: 650;
    padding: 2px 6.5px;
    border-radius: 3.5px;
    background: rgba(0, 0, 0, 0.45);
    white-space: nowrap;
    line-height: 1.2;
  }
  .funnel-pill.applied {
    border: 1px solid #4b5563;
    color: #9ca3af;
  }
  .funnel-pill.oa {
    border: 1px solid #f59e0b;
    color: #f59e0b;
  }
  .funnel-pill.interview {
    border: 1px solid #ef4444;
    color: #ef4444;
  }
  .funnel-pill.offer {
    border: 1px solid #10b981;
    color: #10b981;
  }
  .career-add-btn {
    width: 18px;
    height: 18px;
    padding: 0;
    border: 1px solid #ef4444;
    border-radius: 3.5px;
    background: #1a080c;
    color: #ef4444;
    font-size: 13.5px;
    line-height: 14px;
    cursor: pointer;
    display: grid;
    place-items: center;
    transition: all 0.15s ease;
  }
  .career-add-btn:hover {
    background: #ef4444;
    color: #fff;
    box-shadow: 0 0 6px rgba(239, 68, 68, 0.6);
  }

  /* Dedicated Full Add Application View */
  .career-add-view {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    background: rgba(153, 27, 27, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.35);
    border-radius: 8px;
    padding: 7px 10px;
    box-sizing: border-box;
    overflow-y: auto;
  }
  .career-add-view::-webkit-scrollbar {
    width: 2.5px;
  }
  .career-add-view::-webkit-scrollbar-thumb {
    background: #991b1b;
    border-radius: 2px;
  }
  .career-add-view-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 7px;
    padding-bottom: 4px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    flex-shrink: 0;
  }
  .career-add-title-wrap {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .add-view-icon {
    color: #ef4444;
    font-size: 13.5px;
    line-height: 1;
  }
  .career-add-view-header h4 {
    margin: 0;
    font-size: 12.5px;
    font-weight: 700;
    color: #f6f6fa;
    letter-spacing: 0.2px;
  }
  .career-add-close-btn {
    background: none;
    border: 1px solid rgba(239, 68, 68, 0.45);
    border-radius: 3px;
    color: #ef4444;
    font-size: 14px;
    line-height: 13px;
    width: 17px;
    height: 17px;
    cursor: pointer;
    display: grid;
    place-items: center;
    padding: 0;
    transition: all 0.15s ease;
  }
  .career-add-close-btn:hover {
    background: #ef4444;
    color: #fff;
  }
  .career-add-form-fullscreen {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
    min-height: 0;
  }
  .career-add-form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5px 8px;
    flex: 1;
  }
  .form-field-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .form-field-group.full-width {
    grid-column: 1 / span 2;
  }
  .car-form-label {
    font-size: 10px;
    color: #9ca3af;
    font-weight: 600;
  }
  .car-inp {
    height: 24px;
    background: #0c0d12;
    border: 1px solid #374151;
    border-radius: 3px;
    color: #f6f6fa;
    font: inherit;
    font-size: 10.5px;
    padding: 1px 6px;
    outline: none;
    width: 100%;
    box-sizing: border-box;
  }
  .car-inp:focus {
    border-color: #ef4444;
  }
  .car-mtech-toggle-box {
    display: flex;
    align-items: center;
    gap: 4px;
    height: 22px;
    font-size: 10px;
    color: #10b981;
    cursor: pointer;
  }
  .career-add-view-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;
    margin-top: 5px;
    padding-top: 5px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    flex-shrink: 0;
  }
  .car-drawer-btn {
    height: 23px;
    padding: 0 10px;
    font-size: 10px;
    border-radius: 4px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-weight: 600;
  }
  .car-drawer-btn.cancel {
    background: #141418;
    border: 1px solid #374151;
    color: #9ca3af;
  }
  .car-drawer-btn.cancel:hover {
    border-color: #6b7280;
    color: #f3f4f6;
  }
  .car-drawer-btn.submit {
    background: #2b0b12;
    border: 1px solid #ef4444;
    color: #ff9aa5;
    box-shadow: 0 0 6px rgba(239, 68, 68, 0.3);
  }
  .car-drawer-btn.submit:hover {
    background: #ef4444;
    color: #fff;
  }

  /* Master-Detail 2-Column Body */
  .career-body {
    display: flex;
    gap: 8px;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  /* Left Column: Target Selector (38%) */
  .career-target-col {
    width: 38%;
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
    border-right: 1px solid rgba(255, 255, 255, 0.05);
    padding-right: 6px;
  }
  .career-col-head {
    display: flex;
    flex-direction: column;
    margin-bottom: 4px;
    flex-shrink: 0;
  }
  .col-title {
    font-size: 11px;
    font-weight: 700;
    color: #f6f6fa;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
  .col-sub {
    font-size: 10px;
    color: #9ca3af;
    margin-top: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .career-pipeline-list {
    display: flex;
    flex-direction: column;
    gap: 3.5px;
    overflow-y: auto;
    flex: 1;
    padding-right: 2px;
  }
  .career-pipeline-list::-webkit-scrollbar {
    width: 2.5px;
  }
  .career-pipeline-list::-webkit-scrollbar-thumb {
    background: #991b1b;
    border-radius: 2px;
  }

  .career-card {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 3.5px 5px;
    border-radius: 5px;
    background: #0e0e0e;
    border: 1px solid #262626;
    cursor: pointer;
    transition: all 0.15s ease;
    min-width: 0;
  }
  .career-card:hover {
    border-color: rgba(239, 68, 68, 0.5);
  }
  .career-card.is-active {
    background: rgba(185, 28, 28, 0.18);
    border-color: #ef4444;
    box-shadow: inset 0 0 8px rgba(239, 68, 68, 0.15);
  }
  .career-status-dot {
    font-size: 9.5px;
    color: #555866;
    flex-shrink: 0;
    line-height: 1;
  }
  .career-status-dot.glowing {
    color: #ef4444;
    text-shadow: 0 0 5px rgba(239, 68, 68, 0.9);
  }
  .career-card-info {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }
  .career-card-line1 {
    display: flex;
    align-items: baseline;
    gap: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .career-card-line1 strong {
    font-size: 11.5px;
    color: #f6f6fa;
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .career-ctc {
    font-size: 10.5px;
    color: #ffaa00;
    font-weight: 600;
    flex-shrink: 0;
  }
  .career-card-line2 {
    font-size: 9.5px;
    color: #8e99ad;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 1px;
  }
  .career-chevron {
    font-size: 11.5px;
    color: #ef4444;
    font-weight: 800;
    flex-shrink: 0;
    line-height: 1;
  }

  /* Right Column: Detail Inspector (62%) */
  .career-detail-col {
    width: 62%;
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
  }
  .career-detail-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  /* Editable Title Row */
  .career-title-row {
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    margin-bottom: 2px;
    min-width: 0;
  }
  .career-title {
    margin: 0;
    font-size: 12px;
    font-weight: 700;
    color: #f6f6fa;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    min-width: 0;
  }
  .career-title-ctc {
    font-size: 11px;
    color: #ffaa00;
    font-weight: 700;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .career-pencil {
    font-size: 10.5px;
    color: #6b7280;
    flex-shrink: 0;
  }
  .career-title-row:hover .career-pencil {
    color: #ef4444;
  }
  .career-inline-edit-row {
    display: flex;
    margin-bottom: 3px;
    width: 100%;
  }
  .career-inline-inp {
    width: 100%;
    height: 22px;
    background: #08080a;
    border: 1px solid #ef4444;
    border-radius: 3px;
    color: #fff;
    font: inherit;
    font-size: 11px;
    font-weight: 600;
    padding: 1px 4px;
    outline: none;
    box-shadow: 0 0 5px rgba(239, 68, 68, 0.4);
  }

  /* Metadata Pills Row */
  .career-pills-row {
    display: flex;
    gap: 3px;
    align-items: center;
    margin-bottom: 4px;
    flex-wrap: wrap;
    flex-shrink: 0;
  }
  .career-meta-pill {
    background: none;
    border: 1px solid #374151;
    font: inherit;
    font-size: 9.5px;
    font-weight: 700;
    padding: 1.5px 5.5px;
    border-radius: 3px;
    cursor: pointer;
    line-height: 1.2;
    text-transform: uppercase;
    letter-spacing: 0.2px;
    white-space: nowrap;
    transition: all 0.15s ease;
  }
  .career-meta-pill.sponsorship.is-sponsored {
    border-color: rgba(16, 185, 129, 0.6);
    color: #10b981;
    background: rgba(16, 185, 129, 0.08);
  }
  .career-meta-pill.sponsorship:not(.is-sponsored) {
    border-color: #4b5563;
    color: #9ca3af;
  }
  .career-meta-pill.source {
    border-color: rgba(56, 189, 248, 0.6);
    color: #38bdf8;
    background: rgba(56, 189, 248, 0.08);
  }
  .career-meta-pill.stage {
    border-color: rgba(239, 68, 68, 0.6);
    color: #ef4444;
    background: rgba(239, 68, 68, 0.08);
    cursor: default;
  }

  /* 5-Round Progress Checklist */
  .career-checklist-section {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }
  .career-checklist-head {
    font-size: 10px;
    color: #9ca3af;
    margin-bottom: 2px;
    font-weight: 500;
    flex-shrink: 0;
  }
  .career-rounds-list {
    display: flex;
    flex-direction: column;
    gap: 2.5px;
    overflow-y: auto;
    flex: 1;
    padding-right: 2px;
  }
  .career-rounds-list::-webkit-scrollbar {
    width: 2.5px;
  }
  .career-rounds-list::-webkit-scrollbar-thumb {
    background: #991b1b;
    border-radius: 2px;
  }

  .career-round-card {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 2.5px 5px;
    border-radius: 4px;
    border: 1px solid #262626;
    background: #0c0c10;
    min-width: 0;
    transition: all 0.15s ease;
  }
  .career-round-card.is-done {
    border-color: #ef4444;
    background: rgba(153, 27, 27, 0.18);
  }
  .career-round-card.is-active {
    border-color: #f59e0b;
    background: rgba(245, 158, 11, 0.14);
  }
  .career-round-status-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: grid;
    place-items: center;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
  .rnd-icon.done {
    color: #ef4444;
    font-weight: 900;
    font-size: 11.5px;
    line-height: 1;
  }
  .rnd-icon.active {
    color: #f59e0b;
    font-weight: 900;
    font-size: 11.5px;
    line-height: 1;
  }
  .rnd-icon.pending {
    color: #555866;
    font-size: 11.5px;
    line-height: 1;
  }
  .career-round-info {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }
  .career-round-name {
    font-size: 10.5px;
    font-weight: 650;
    color: #f6f6fa;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .career-round-card.is-active .career-round-name {
    color: #fbbf24;
  }
  .career-round-subtext {
    font-size: 9.5px;
    color: #9ca3af;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    margin-top: 0.5px;
  }
  .career-round-subtext:hover {
    color: #38bdf8;
    text-decoration: underline;
  }
  .career-round-subtext-inp {
    height: 18px;
    background: #08080a;
    border: 1px solid #38bdf8;
    border-radius: 2px;
    color: #fff;
    font: inherit;
    font-size: 9.5px;
    padding: 0 3px;
    outline: none;
    width: 100%;
    box-sizing: border-box;
  }

  /* Bottom Quick Actions Bar */
  .career-quick-actions {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 4px;
    padding-top: 3px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    font-size: 9.5px;
    flex-shrink: 0;
    white-space: nowrap;
    overflow-x: auto;
  }
  .quick-actions-label {
    color: #6b7280;
    font-size: 9.5px;
    flex-shrink: 0;
  }
  .career-action-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: none;
    border: none;
    padding: 0;
    color: #9ca3af;
    font: inherit;
    font-size: 9.5px;
    cursor: pointer;
    text-decoration: none;
    white-space: nowrap;
    transition: color 0.15s ease;
  }
  .career-action-link:hover {
    color: #f6f6fa;
  }
  .career-action-link.withdraw {
    color: #ef4444;
    margin-left: auto;
  }
  .career-action-link.withdraw:hover {
    color: #ff263b;
    font-weight: 700;
  }
  .quick-action-inline-inp {
    height: 18px;
    background: #08080a;
    border: 1px solid #ef4444;
    border-radius: 2px;
    color: #fff;
    font: inherit;
    font-size: 9.5px;
    padding: 0 3px;
    outline: none;
    max-width: 95px;
  }

  /* Vector Icon styling for Project & Career Trackers */
  .projects-title-wrap { display: flex; align-items: center; gap: 7px; }
  .projects-title-icon { width: 15px; height: 15px; color: #ff263b; filter: drop-shadow(0 0 5px rgba(255, 38, 59, 0.6)); flex-shrink: 0; }
  .proj-chevron-svg { width: 16px; height: 16px; color: #ff5365; transition: transform 0.15s ease; flex-shrink: 0; stroke-width: 2.8; }
  .proj-chevron-svg.is-expanded { transform: rotate(90deg); }
  .proj-blocker-icon { width: 12px; height: 12px; flex-shrink: 0; color: currentColor; }
  .career-title-icon { width: 15px; height: 15px; color: #ef4444; filter: drop-shadow(0 0 5px rgba(239, 68, 68, 0.7)); flex-shrink: 0; }
  .career-sub-icon { width: 11px; height: 11px; color: currentColor; flex-shrink: 0; }
  .career-pencil-svg { width: 11px; height: 11px; color: #6b7280; flex-shrink: 0; transition: color 0.15s ease; }
  .career-title-row:hover .career-pencil-svg { color: #ef4444; }
  .career-action-icon { width: 11.5px; height: 11.5px; color: currentColor; flex-shrink: 0; }
  .rnd-icon { width: 12px; height: 12px; flex-shrink: 0; }
  .rnd-icon.done { color: #ef4444; }
  .rnd-icon.active { color: #f59e0b; }
  .rnd-icon.pending { color: #555866; }

  @media(max-width:1100px) { .dashboard {grid-template-columns:1fr;overflow:auto;} .topline {grid-template-columns:1fr;} }
`;
