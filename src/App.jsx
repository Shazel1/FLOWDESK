import { useState, useEffect, useRef } from "react";
import {
  CheckSquare,
  Calendar,
  Clock,
  Grid,
  Activity,
  LayoutDashboard,
  Brain,
  Plus,
  Trash2,
  Check,
  Zap,
  X,
  Mic,
  Settings as Cog,
  Moon,
  Sun,
  Map,
  BookHeart,
  GitBranch,
  Star,
  Edit2,
  Bell,
  User,
  TrendingDown,
  TrendingUp,
  Volume2,
  VolumeX,
  ChevronRight,
  Layers,
  RefreshCw,
  Smile,
  Frown,
  BarChart2,
  Target,
  Lightbulb,
  Save,
  MicOff,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════
// THEME SYSTEM
// ═══════════════════════════════════════════════════════════
const MODES = {
  light: {
    bg: "#f0f4ff",
    card: "#ffffff",
    sec: "#e8edf8",
    text: "#0d1117",
    sub: "#5a6478",
    bdr: "#dde3f0",
  },
  dark: {
    bg: "#0d1117",
    card: "#161b27",
    sec: "#1c2333",
    text: "#e6edf3",
    sub: "#8b949e",
    bdr: "#30363d",
  },
  midnight: {
    bg: "#060810",
    card: "#0d1021",
    sec: "#111525",
    text: "#cdd9f0",
    sub: "#606880",
    bdr: "#1e2438",
  },
  warm: {
    bg: "#fdf6ec",
    card: "#fffdf8",
    sec: "#fef3e2",
    text: "#3a1f00",
    sub: "#8b6a45",
    bdr: "#e8d5b7",
  },
};
const ACCENTS = {
  indigo: { p: "#5a67e8", bg: "#eef2ff", bdr: "#a5b4fc" },
  emerald: { p: "#059669", bg: "#ecfdf5", bdr: "#6ee7b7" },
  rose: { p: "#e11d48", bg: "#fff1f2", bdr: "#fda4af" },
  amber: { p: "#d97706", bg: "#fffbeb", bdr: "#fcd34d" },
  cyan: { p: "#0891b2", bg: "#ecfeff", bdr: "#67e8f9" },
  violet: { p: "#7c3aed", bg: "#f5f3ff", bdr: "#c4b5fd" },
};
const QUADRANTS = {
  Q1: {
    label: "Do First",
    sub: "Urgent & Important",
    color: "#dc2626",
    bg: "#fef2f2",
    bdr: "#fca5a5",
    icon: "🔥",
  },
  Q2: {
    label: "Schedule",
    sub: "Not Urgent, Important",
    color: "#5a67e8",
    bg: "#eef2ff",
    bdr: "#a5b4fc",
    icon: "📅",
  },
  Q3: {
    label: "Delegate",
    sub: "Urgent, Not Important",
    color: "#d97706",
    bg: "#fffbeb",
    bdr: "#fcd34d",
    icon: "👥",
  },
  Q4: {
    label: "Eliminate",
    sub: "Not Urgent & Not Important",
    color: "#6b7280",
    bg: "#f9fafb",
    bdr: "#d1d5db",
    icon: "🗑️",
  },
};
const TT_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TT_SLOTS = Array.from(
  { length: 48 },
  (_, i) =>
    `${String(Math.floor(i / 2)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`,
);
const TODAY = new Date().toISOString().split("T")[0];
const WEEK7 = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (6 - i));
  return {
    date: d.toISOString().split("T")[0],
    label: d.toLocaleDateString("en", { weekday: "short" }).slice(0, 1),
  };
});

const DW_TEMPLATES = {
  idea: {
    name: "Idea Canvas",
    icon: "💡",
    fields: [
      "The Big Idea",
      "Problem Being Solved",
      "Who Needs This (Target Audience)",
      "Unique Value Proposition",
      "How It Works (Core Solution)",
      "Market Size / Impact Potential",
      "Revenue or Impact Model",
      "Key Risks & Assumptions",
      "Resources Needed",
      "3 Immediate Next Steps",
    ],
  },
  charter: {
    name: "Project Charter",
    icon: "📋",
    fields: [
      "Project Name & Vision Statement",
      "Business Objectives & Goals",
      "Scope & Key Deliverables",
      "Out of Scope (What We Won't Do)",
      "Stakeholders & Roles",
      "Timeline & Major Milestones",
      "Budget & Resources Required",
      "Risks & Mitigation Strategies",
      "Success Metrics & KPIs",
      "Sign-off & Approval",
    ],
  },
  lean: {
    name: "Lean Canvas",
    icon: "🎯",
    fields: [
      "Problem (Top 3 Problems)",
      "Customer Segments",
      "Unique Value Proposition",
      "Solution",
      "Channels to Reach Customers",
      "Revenue Streams",
      "Cost Structure",
      "Key Metrics",
      "Unfair Advantage",
      "Early Adopters Profile",
    ],
  },
  design: {
    name: "Design Sprint",
    icon: "🎨",
    fields: [
      "Monday — Map & Define Target",
      "Tuesday — Sketch Competing Solutions",
      "Wednesday — Decide & Storyboard",
      "Thursday — Build Prototype",
      "Friday — Test with Real Users",
      "Key Learnings from Sprint",
      "What to Change / Iterate",
      "Next Sprint Focus",
    ],
  },
  swot: {
    name: "SWOT Analysis",
    icon: "⚖️",
    fields: [
      "Strengths (Internal Positives)",
      "Weaknesses (Internal Negatives)",
      "Opportunities (External Positives)",
      "Threats (External Negatives)",
      "S+O Strategic Actions",
      "W+O Strategic Actions",
      "S+T Strategic Actions",
      "W+T Strategic Actions",
      "Priority Actions",
      "Timeline for Implementation",
    ],
  },
  pain: {
    name: "Pain-Point Deep Dive",
    icon: "🔍",
    fields: [
      "Who Is Experiencing the Pain?",
      "Describe the Pain in Detail",
      "Emotional Cost of This Pain",
      "Financial / Time Cost of This Pain",
      "Current Solutions & Why They Fail",
      "Root Cause Analysis (5 Whys)",
      "Your Proposed Remedy",
      "How You Validated the Pain",
      "Business / Mission Case",
      "Call to Action — First Steps",
    ],
  },
};

const GRATITUDE_LIST = [
  "The gift of life itself",
  "Every breath you take without effort",
  "Clean water to drink today",
  "Food on your table",
  "A safe place to sleep at night",
  "Your beating heart working for you",
  "The ability to see the world's beauty",
  "Music and the emotions it stirs",
  "Laughter and the joy it brings",
  "Family members who love you",
  "Friends who believe in your potential",
  "God's grace that is new every morning",
  "Answered prayers — big and small",
  "Unanswered prayers that protected you",
  "Second chances you didn't deserve",
  "Your healthy and brilliant mind",
  "The ability to learn absolutely anything",
  "The sunrise every single morning",
  "Stars and the moon lighting the night",
  "Rain that nourishes the earth",
  "The warmth of sunlight on your skin",
  "Seasons that bring change and renewal",
  "Birds singing outside your window",
  "Trees giving oxygen and shade",
  "Flowers and their breathtaking colors",
  "The ocean and its infinite vastness",
  "Mountains that inspire awe",
  "Rivers and streams that carve through rock",
  "Fresh air you breathe without thinking",
  "Electricity and the comforts it brings",
  "The internet and access to knowledge",
  "Books and all the wisdom they carry",
  "Art that moves and inspires you",
  "Freedom to worship and pray",
  "Freedom to speak and express yourself",
  "Your country's relative peace",
  "Your culture and heritage",
  "Your mother tongue and language",
  "Your unique personality and quirks",
  "Your God-given gifts and talents",
  "Challenges that made you resilient",
  "Failures that became your best teachers",
  "Mentors who invested their time in you",
  "Teachers who shaped your thinking",
  "Childhood memories that shaped you",
  "People who prayed for you silently",
  "Strangers who showed unexpected kindness",
  "Doctors and nurses who brought healing",
  "Scientists who discovered life-saving cures",
  "Engineers who built your world",
  "Farmers who grow your food",
  "Clean clothes to wear today",
  "Shoes on your feet",
  "A working phone and computer",
  "Transportation that takes you places",
  "Your education and what you've earned",
  "Skills you've built over the years",
  "Opportunities that came when you were ready",
  "Doors that opened at the right time",
  "Dreams that refuse to die in you",
  "Hope for a better tomorrow",
  "Faith that sustains you in darkness",
  "Peace that surpasses all understanding",
  "Joy that runs deeper than happiness",
  "Love that never truly fails",
  "Patience in the difficult seasons",
  "Wisdom to make sound decisions",
  "Strength when you felt completely broken",
  "Courage in moments of deep fear",
  "Healing from wounds of the past",
  "Growth through painful seasons",
  "This present moment — a gift",
  "Time itself and how it restores",
  "The ability to forgive and be forgiven",
  "Grace when you least deserved it",
  "Mercy that held back consequences",
  "Provision in times of scarcity",
  "Protection you may never fully know",
  "Divine direction guiding your steps",
  "Clarity when you were deeply confused",
  "Comfort when grief was overwhelming",
  "Community and a sense of belonging",
  "Your faith community and church",
  "People who celebrate your victories",
  "People who correct you in love",
  "Siblings who grew up with you",
  "Your own name and your identity",
  "Your story — every chapter of it",
  "The miracle that you are still here",
  "Any health improvement no matter how small",
  "Energy to work, create, and serve",
  "Sweet rest and sleep",
  "The ability to taste and enjoy food",
  "Your sense of humor that lightens loads",
  "Your resilience that surprises even you",
  "Your compassion that blesses others",
  "The love you have given and received",
  "Pets and animals that bring pure joy",
  "Nature walks and open parks",
  "Sunsets that take your breath away",
  "Changing seasons and what they teach",
  "Cultural foods and traditions",
  "Celebrations, birthdays, and milestones",
  "Technology connecting us across distance",
  "Creative tools in your hands",
  "The ability to start completely over",
  "Blank pages and fresh beginnings",
  "Monday mornings full of new possibility",
  "The last day of every hard season",
  "Progress however small and slow",
  "Every single step forward you take",
  "The lesson in every step backward",
  "Permission to dream impossibly big",
  "Your imagination and creative mind",
  "Problem-solving wired into your brain",
  "Critical thinking you've developed",
  "Emotional intelligence you've grown",
  "Empathy you carry for others",
  "Your conscience that guides and corrects",
  "Values and principles you live by",
  "Integrity you've chosen to maintain",
  "The reputation you've built carefully",
  "Trust earned through consistent character",
  "Loyalty shown and received",
  "Partnerships that multiplied your impact",
  "Teamwork and what it accomplishes",
  "Diversity of thought around you",
  "Exposure to different people and cultures",
  "Travel and experiences that broadened you",
  "Beautiful memories frozen in photographs",
  "Journals that hold your history",
  "A kind word given at the right moment",
  "Encouragement that redirected your path",
  "A phone call that came just in time",
  "Perfect timing you didn't orchestrate",
  "God's sovereignty over all things",
  "His plans higher than your plans",
  "His ways better than yours",
  "His faithfulness across generations",
  "His presence that has never left you",
  "His promises that have never failed",
  "Scripture that speaks to your exact situation",
  "Worship that lifts your weary spirit",
  "Prayer as direct access to the Almighty",
  "Your own testimony and life story",
  "Hope that stretches beyond this life",
  "Legacy you are quietly building",
  "Children and their wonder at the world",
  "The wisdom of elders around you",
  "Your roots that keep you grounded",
  "Your wings that set you free",
  "The fact that you chose gratitude today",
  "A grateful heart that changes everything",
];

// ═══════════════════════════════════════════════════════════
// HOOKS & UTILITIES
// ═══════════════════════════════════════════════════════════
function useLS(key, init) {
  const [v, setV] = useState(() => {
    try {
      const s = localStorage.getItem(key);
      return s ? JSON.parse(s) : init;
    } catch {
      return init;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {}
  }, [key, v]);
  return [v, setV];
}

function useTheme(mode, accent) {
  useEffect(() => {
    const m = MODES[mode] || MODES.light,
      a = ACCENTS[accent] || ACCENTS.indigo;
    let el = document.getElementById("fd-theme");
    if (!el) {
      el = document.createElement("style");
      el.id = "fd-theme";
      document.head.appendChild(el);
    }
    el.textContent = `
      .fd{--bg:${m.bg};--card:${m.card};--sec:${m.sec};--text:${m.text};--sub:${m.sub};--bdr:${m.bdr};--acc:${a.p};--acc-bg:${a.bg};--acc-bdr:${a.bdr};
        background:var(--bg);color:var(--text);font-family:'Outfit',system-ui,sans-serif;}
      .fd *{box-sizing:border-box;transition:background .2s,color .2s,border-color .2s;}
      .fd input,.fd select,.fd textarea{background:var(--card);border:1px solid var(--bdr);color:var(--text);border-radius:10px;padding:8px 12px;font-family:inherit;font-size:13px;outline:none;width:100%;}
      .fd input:focus,.fd select:focus,.fd textarea:focus{border-color:var(--acc);box-shadow:0 0 0 3px var(--acc-bg);}
      .fd textarea{resize:vertical;min-height:80px;}
      .fd ::-webkit-scrollbar{width:5px;height:5px;}
      .fd ::-webkit-scrollbar-track{background:var(--sec);}
      .fd ::-webkit-scrollbar-thumb{background:var(--bdr);border-radius:99px;}
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
    `;
  }, [mode, accent]);
}

// ═══════════════════════════════════════════════════════════
// STYLE HELPERS
// ═══════════════════════════════════════════════════════════
const card = {
  background: "var(--card)",
  border: "1px solid var(--bdr)",
  borderRadius: 14,
  padding: "1rem 1.2rem",
};
const sec = {
  background: "var(--sec)",
  border: "1px solid var(--bdr)",
  borderRadius: 10,
  padding: "0.7rem 1rem",
};
const btn = (bg = "#5a67e8", fg = "white") => ({
  fontSize: 13,
  padding: "8px 14px",
  borderRadius: 10,
  background: bg,
  color: fg,
  border: "none",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontFamily: "inherit",
  fontWeight: 500,
});
const ghost = {
  fontSize: 13,
  padding: "8px 14px",
  borderRadius: 10,
  background: "transparent",
  border: "1px solid var(--bdr)",
  color: "var(--text)",
  cursor: "pointer",
  fontFamily: "inherit",
};
const badge = (bg, c) => ({
  fontSize: 11,
  padding: "3px 9px",
  borderRadius: 20,
  background: bg,
  color: c,
  fontWeight: 500,
  display: "inline-flex",
  alignItems: "center",
  whiteSpace: "nowrap",
});
const lbl = {
  fontSize: 12,
  color: "var(--sub)",
  marginBottom: 4,
  fontWeight: 500,
};

// ═══════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════
function Dashboard({ tasks, todos, habits, userName, setView, setTodos }) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const name = userName?.trim() ? `, ${userName.trim()}` : "";
  const pendingQ1 = tasks.filter((t) => !t.done && t.quadrant === "Q1");
  const todayHabits = habits.filter((h) => h.completedDates?.includes(TODAY));

  return (
    <div style={{ padding: "1.5rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2
          style={{
            fontSize: 26,
            fontWeight: 700,
            margin: "0 0 4px",
            letterSpacing: "-0.5px",
          }}>
          {greeting}
          {name} 👋
        </h2>
        <p style={{ color: "var(--sub)", margin: 0, fontSize: 14 }}>
          {new Date().toLocaleDateString("en", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))",
          gap: 10,
          marginBottom: "1.5rem",
        }}>
        {[
          {
            label: "Tasks to do",
            val: tasks.filter((t) => !t.done).length,
            color: "#e11d48",
          },
          {
            label: "Completed",
            val: tasks.filter((t) => t.done).length,
            color: "#059669",
          },
          {
            label: "To‑dos left",
            val: todos.filter((t) => !t.done).length,
            color: "var(--acc)",
          },
          {
            label: "Habits today",
            val: `${todayHabits.length}/${habits.length}`,
            color: "#d97706",
          },
        ].map((m, i) => (
          <div
            key={i}
            style={{
              ...sec,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}>
            <span
              style={{ fontSize: 11, color: "var(--sub)", fontWeight: 500 }}>
              {m.label}
            </span>
            <span
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: m.color,
                lineHeight: 1,
              }}>
              {m.val}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: "1rem",
        }}>
        <div style={card}>
          <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 10px" }}>
            🔥 Urgent tasks
          </p>
          {pendingQ1.slice(0, 3).map((t) => (
            <div
              key={t.id}
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                padding: "6px 0",
                borderBottom: "1px solid var(--bdr)",
              }}>
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#dc2626",
                  flexShrink: 0,
                }}
              />
              <span style={{ flex: 1, fontSize: 13 }}>{t.title}</span>
              <span style={{ fontSize: 11, color: "var(--sub)" }}>{t.due}</span>
            </div>
          ))}
          {pendingQ1.length === 0 && (
            <p style={{ fontSize: 13, color: "var(--sub)", margin: 0 }}>
              All clear 🎉
            </p>
          )}
          <button
            onClick={() => setView("tasks")}
            style={{
              ...btn("transparent", "var(--acc)"),
              padding: "6px 0",
              marginTop: 8,
              fontSize: 12,
              border: "none",
            }}>
            View all tasks →
          </button>
        </div>

        <div style={card}>
          <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 10px" }}>
            ✅ Quick to‑dos
          </p>
          {todos
            .filter((t) => !t.done)
            .slice(0, 4)
            .map((t) => (
              <div
                key={t.id}
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  padding: "6px 0",
                }}>
                <button
                  onClick={() =>
                    setTodos((p) =>
                      p.map((td) =>
                        td.id === t.id ? { ...td, done: true } : td,
                      ),
                    )
                  }
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 4,
                    border: "1.5px solid var(--bdr)",
                    background: "none",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 13, flex: 1 }}>{t.text}</span>
              </div>
            ))}
          <button
            onClick={() => setView("todo")}
            style={{
              ...btn("transparent", "var(--acc)"),
              padding: "6px 0",
              marginTop: 8,
              fontSize: 12,
              border: "none",
            }}>
            Manage list →
          </button>
        </div>

        <div style={card}>
          <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 10px" }}>
            🔄 Today's habits
          </p>
          {habits.slice(0, 5).map((h) => {
            const done = h.completedDates?.includes(TODAY);
            return (
              <div
                key={h.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 0",
                }}>
                <span style={{ fontSize: 18 }}>{h.icon}</span>
                <span style={{ fontSize: 13, flex: 1 }}>{h.name}</span>
                <span
                  style={badge(
                    done ? "#dcfce7" : "var(--sec)",
                    done ? "#166534" : "var(--sub)",
                  )}>
                  {done ? "✓" : "—"}
                </span>
              </div>
            );
          })}
          <button
            onClick={() => setView("habits")}
            style={{
              ...btn("transparent", "var(--acc)"),
              padding: "6px 0",
              marginTop: 8,
              fontSize: 12,
              border: "none",
            }}>
            Track habits →
          </button>
        </div>

        <div style={card}>
          <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 10px" }}>
            🧠 Eisenhower snapshot
          </p>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {Object.entries(QUADRANTS).map(([k, q]) => {
              const count = tasks.filter(
                (t) => t.quadrant === k && !t.done,
              ).length;
              return (
                <div
                  key={k}
                  style={{
                    background: q.bg,
                    border: `1px solid ${q.bdr}`,
                    borderRadius: 10,
                    padding: "8px 10px",
                  }}>
                  <p
                    style={{
                      fontSize: 11,
                      color: q.color,
                      fontWeight: 600,
                      margin: "0 0 2px",
                    }}>
                    {q.icon} {q.label}
                  </p>
                  <p
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: q.color,
                      margin: 0,
                    }}>
                    {count}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TASK MANAGER (with Voice AI Copilot)
// ═══════════════════════════════════════════════════════════
function TaskManager({ tasks, setTasks }) {
  const [view, setView] = useState("matrix");
  const [showAdd, setShowAdd] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMsg, setAiMsg] = useState("");
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [copilotReply, setCopilotReply] = useState("");
  const [newTask, setNewTask] = useState({
    title: "",
    desc: "",
    due: "",
    priority: "medium",
  });
  const recogRef = useRef(null);

  const addTask = (t = newTask) => {
    if (!t.title.trim()) return;
    setTasks((p) => [
      ...p,
      { id: Date.now(), ...t, quadrant: null, done: false, reason: null },
    ]);
    setNewTask({ title: "", desc: "", due: "", priority: "medium" });
    setShowAdd(false);
  };

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.0;
    u.pitch = 1.05;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  };

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setAiMsg("❌ Voice not supported — use Chrome or Edge");
      return;
    }
    const r = new SR();
    r.lang = "en-US";
    r.interimResults = true;
    r.continuous = false;
    setListening(true);
    setTranscript("");
    setCopilotReply("");
    r.onresult = (e) => {
      const t = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join("");
      setTranscript(t);
      if (e.results[e.results.length - 1].isFinal) handleVoiceResult(t);
    };
    r.onerror = () => setListening(false);
    r.onend = () => setListening(false);
    r.start();
    recogRef.current = r;
  };

  const stopVoice = () => {
    recogRef.current?.stop();
    setListening(false);
  };

  const handleVoiceResult = async (text) => {
    if (!text.trim()) return;
    const taskObj = {
      id: Date.now(),
      title: text,
      desc: "Added via voice",
      due: "",
      priority: "medium",
      quadrant: null,
      done: false,
      reason: null,
    };
    setTasks((p) => [...p, taskObj]);
    setAiLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `You are FlowDesk AI, a warm and smart productivity copilot. The user just spoke this task: "${text}". 
1) Classify it: Q1 (Urgent+Important), Q2 (Important, not urgent), Q3 (Urgent, not important), Q4 (neither). 
2) Give a brief, encouraging response in under 40 words. Be warm and personal. Start with "Got it!" 
Return JSON only: {"quadrant":"Q1|Q2|Q3|Q4","reply":"your spoken message"}`,
            },
          ],
        }),
      });
      const data = await res.json();
      const raw = (data.content || [])
        .map((c) => c.text || "")
        .join("")
        .replace(/```json|```/g, "")
        .trim();
      const parsed = JSON.parse(raw);
      setTasks((p) =>
        p.map((t) =>
          t.id === taskObj.id ? { ...t, quadrant: parsed.quadrant } : t,
        ),
      );
      setCopilotReply(parsed.reply);
      speak(parsed.reply);
    } catch {
      const reply =
        "Got it! I've added your task. Use AI Prioritize to classify it.";
      setCopilotReply(reply);
      speak(reply);
    }
    setAiLoading(false);
  };

  const aiPrioritize = async () => {
    const pending = tasks.filter((t) => !t.done);
    if (!pending.length) return;
    setAiLoading(true);
    setAiMsg("🧠 Analyzing your tasks...");
    const prompt = `You are a productivity expert. Classify each task into the Eisenhower Matrix. Today: ${TODAY}.
Tasks: ${pending.map((t) => `ID:${t.id}|"${t.title}"|Priority:${t.priority}|Due:${t.due}|Desc:${t.desc}`).join("\n")}
Return ONLY a JSON array, no markdown:
[{"id":<number>,"quadrant":"Q1"|"Q2"|"Q3"|"Q4","reason":"<one short sentence why>"}]`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = (data.content || [])
        .map((c) => c.text || "")
        .join("")
        .replace(/```json|```/g, "")
        .trim();
      const parsed = JSON.parse(text);
      setTasks((p) =>
        p.map((t) => {
          const m = parsed.find((x) => x.id === t.id);
          return m ? { ...t, quadrant: m.quadrant, reason: m.reason } : t;
        }),
      );
      setAiMsg(
        `✅ ${parsed.length} tasks classified into the Eisenhower Matrix`,
      );
    } catch {
      setAiMsg("❌ Error — please try again");
    }
    setAiLoading(false);
    setTimeout(() => setAiMsg(""), 5000);
  };

  const unclassified = tasks.filter((t) => !t.done && !t.quadrant).length;

  return (
    <div style={{ padding: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: "1.25rem",
          flexWrap: "wrap",
        }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, flex: 1 }}>
          Task Manager
        </h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={() => setView((v) => (v === "matrix" ? "list" : "matrix"))}
            style={ghost}>
            {view === "matrix" ? "📋 List" : "⊞ Matrix"}
          </button>
          <button onClick={() => setShowAdd(!showAdd)} style={btn()}>
            <Plus size={14} />
            Add task
          </button>
          <button
            onClick={aiPrioritize}
            disabled={aiLoading}
            style={btn(aiLoading ? "#9ca3af" : "#7c3aed")}>
            <Zap size={14} />
            {aiLoading ? "Analyzing…" : "AI Prioritize"}
          </button>
        </div>
      </div>

      {/* Voice AI Copilot */}
      <div
        style={{
          ...card,
          marginBottom: "1rem",
          background: "linear-gradient(135deg,var(--acc-bg),var(--card))",
        }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                margin: "0 0 3px",
                color: "var(--acc)",
              }}>
              🎙️ Voice AI Copilot
            </p>
            <p style={{ fontSize: 12, color: "var(--sub)", margin: 0 }}>
              {listening
                ? "Listening… speak your task now"
                : transcript ||
                  copilotReply ||
                  "Click the mic and speak a task — I'll add and classify it for you"}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {speaking && (
              <button onClick={stopSpeaking} style={btn("#6b7280")}>
                <VolumeX size={14} />
                Stop
              </button>
            )}
            {aiLoading && (
              <span style={{ fontSize: 12, color: "var(--acc)" }}>
                Processing…
              </span>
            )}
            <button
              onClick={listening ? stopVoice : startVoice}
              style={{
                ...btn(listening ? "#dc2626" : "var(--acc)"),
                borderRadius: "50%",
                width: 44,
                height: 44,
                padding: 0,
                justifyContent: "center",
                boxShadow: listening ? "0 0 0 4px #fca5a5" : "none",
              }}>
              {listening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          </div>
        </div>
      </div>

      {aiMsg && (
        <div
          style={{
            fontSize: 13,
            color: "var(--acc)",
            background: "var(--acc-bg)",
            border: "1px solid var(--acc-bdr)",
            borderRadius: 10,
            padding: "8px 12px",
            marginBottom: 12,
          }}>
          {aiMsg}
        </div>
      )}
      {unclassified > 0 && (
        <div
          style={{
            fontSize: 13,
            color: "#d97706",
            background: "#fffbeb",
            border: "1px solid #fcd34d",
            borderRadius: 10,
            padding: "8px 12px",
            marginBottom: 12,
          }}>
          {unclassified} task{unclassified > 1 ? "s" : ""} not yet classified —
          hit <strong>AI Prioritize</strong> to sort them.
        </div>
      )}

      {showAdd && (
        <div
          style={{ ...card, marginBottom: "1rem", display: "grid", gap: 10 }}>
          <div>
            <p style={lbl}>Task title *</p>
            <input
              placeholder="What needs to be done?"
              value={newTask.title}
              onChange={(e) =>
                setNewTask((p) => ({ ...p, title: e.target.value }))
              }
            />
          </div>
          <div>
            <p style={lbl}>Description</p>
            <input
              placeholder="Optional details"
              value={newTask.desc}
              onChange={(e) =>
                setNewTask((p) => ({ ...p, desc: e.target.value }))
              }
            />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 130 }}>
              <p style={lbl}>Due date</p>
              <input
                type="date"
                value={newTask.due}
                onChange={(e) =>
                  setNewTask((p) => ({ ...p, due: e.target.value }))
                }
              />
            </div>
            <div style={{ flex: 1, minWidth: 130 }}>
              <p style={lbl}>Priority</p>
              <select
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask((p) => ({ ...p, priority: e.target.value }))
                }>
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => addTask()} style={btn()}>
              Add task
            </button>
            <button onClick={() => setShowAdd(false)} style={ghost}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {view === "matrix" ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
            gap: "1rem",
          }}>
          {Object.entries(QUADRANTS).map(([k, q]) => {
            const qTasks = tasks.filter((t) => t.quadrant === k && !t.done);
            return (
              <div
                key={k}
                style={{
                  background: q.bg,
                  border: `1.5px solid ${q.bdr}`,
                  borderRadius: 14,
                  padding: "1rem",
                }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    marginBottom: 12,
                  }}>
                  <span style={{ fontSize: 22 }}>{q.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: q.color,
                        margin: 0,
                      }}>
                      {q.label}
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: q.color + "99",
                        margin: "2px 0 0",
                      }}>
                      {q.sub}
                    </p>
                  </div>
                  <span style={badge(q.color + "20", q.color)}>
                    {qTasks.length}
                  </span>
                </div>
                {qTasks.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      background: "var(--card)",
                      borderRadius: 10,
                      padding: "8px 10px",
                      marginBottom: 6,
                      border: `1px solid ${q.bdr}`,
                    }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() =>
                          setTasks((p) =>
                            p.map((tk) =>
                              tk.id === t.id ? { ...tk, done: true } : tk,
                            ),
                          )
                        }
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 3,
                          border: `1.5px solid ${q.color}`,
                          background: "none",
                          cursor: "pointer",
                          marginTop: 2,
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>
                          {t.title}
                        </p>
                        {t.reason && (
                          <p
                            style={{
                              fontSize: 11,
                              color: "var(--sub)",
                              margin: "3px 0 0",
                              fontStyle: "italic",
                            }}>
                            {t.reason}
                          </p>
                        )}
                        {t.due && (
                          <p
                            style={{
                              fontSize: 11,
                              color: q.color,
                              margin: "4px 0 0",
                            }}>
                            Due: {t.due}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() =>
                          setTasks((p) => p.filter((tk) => tk.id !== t.id))
                        }
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--sub)",
                          padding: 2,
                        }}>
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                ))}
                {qTasks.length === 0 && (
                  <p
                    style={{
                      fontSize: 12,
                      color: q.color + "70",
                      textAlign: "center",
                      padding: "12px 0",
                      margin: 0,
                    }}>
                    Empty
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {tasks.map((t) => (
            <div
              key={t.id}
              style={{
                ...card,
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                opacity: t.done ? 0.6 : 1,
              }}>
              <button
                onClick={() =>
                  setTasks((p) =>
                    p.map((tk) =>
                      tk.id === t.id ? { ...tk, done: !tk.done } : tk,
                    ),
                  )
                }
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  border: "1.5px solid var(--bdr)",
                  background: t.done ? "var(--acc)" : "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                {t.done && <Check size={12} color="white" strokeWidth={3} />}
              </button>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 14,
                    margin: 0,
                    fontWeight: 600,
                    textDecoration: t.done ? "line-through" : "none",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                  {t.title}
                </p>
                {t.desc && (
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--sub)",
                      margin: "2px 0 0",
                    }}>
                    {t.desc}
                  </p>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  alignItems: "center",
                  flexShrink: 0,
                  flexWrap: "wrap",
                }}>
                {t.quadrant && (
                  <span
                    style={badge(
                      QUADRANTS[t.quadrant].bg,
                      QUADRANTS[t.quadrant].color,
                    )}>
                    {QUADRANTS[t.quadrant].icon} {QUADRANTS[t.quadrant].label}
                  </span>
                )}
                {t.due && (
                  <span style={{ fontSize: 11, color: "var(--sub)" }}>
                    {t.due}
                  </span>
                )}
                <button
                  onClick={() =>
                    setTasks((p) => p.filter((tk) => tk.id !== t.id))
                  }
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--sub)",
                    padding: 2,
                  }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TO-DO LIST
// ═══════════════════════════════════════════════════════════
function TodoList({ todos, setTodos }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newTodo, setNewTodo] = useState({ text: "", priority: "medium" });
  const addTodo = () => {
    if (!newTodo.text.trim()) return;
    setTodos((p) => [...p, { id: Date.now(), ...newTodo, done: false }]);
    setNewTodo({ text: "", priority: "medium" });
    setShowAdd(false);
  };
  const groups = ["high", "medium", "low"];
  const pClr = { high: "#dc2626", medium: "#d97706", low: "#059669" };
  return (
    <div style={{ padding: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: "1.25rem",
          flexWrap: "wrap",
        }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, flex: 1 }}>
          To‑Do List
        </h2>
        <span style={{ fontSize: 13, color: "var(--sub)" }}>
          {todos.filter((t) => !t.done).length} left ·{" "}
          {todos.filter((t) => t.done).length} done
        </span>
        <button onClick={() => setShowAdd(!showAdd)} style={btn()}>
          <Plus size={14} />
          Add item
        </button>
      </div>
      {showAdd && (
        <div
          style={{
            ...card,
            marginBottom: "1rem",
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}>
          <input
            placeholder="What needs doing?"
            value={newTodo.text}
            onChange={(e) =>
              setNewTodo((p) => ({ ...p, text: e.target.value }))
            }
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            style={{ flex: 1, minWidth: 200 }}
          />
          <select
            value={newTodo.priority}
            onChange={(e) =>
              setNewTodo((p) => ({ ...p, priority: e.target.value }))
            }
            style={{ width: "auto" }}>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
          <button onClick={addTodo} style={btn()}>
            Add
          </button>
          <button onClick={() => setShowAdd(false)} style={ghost}>
            Cancel
          </button>
        </div>
      )}
      {groups.map((p) => {
        const g = todos.filter((t) => t.priority === p && !t.done);
        if (!g.length) return null;
        return (
          <div key={p} style={{ marginBottom: "1rem" }}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: pClr[p],
                margin: "0 0 6px",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
              }}>
              {p} priority — {g.length}
            </p>
            {g.map((t) => (
              <div
                key={t.id}
                style={{
                  ...card,
                  padding: "10px 14px",
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  marginBottom: 6,
                }}>
                <button
                  onClick={() =>
                    setTodos((p) =>
                      p.map((td) =>
                        td.id === t.id ? { ...td, done: true } : td,
                      ),
                    )
                  }
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    border: `1.5px solid ${pClr[t.priority]}`,
                    background: "none",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                />
                <span style={{ flex: 1, fontSize: 14 }}>{t.text}</span>
                <button
                  onClick={() =>
                    setTodos((p) => p.filter((td) => td.id !== t.id))
                  }
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--sub)",
                  }}>
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        );
      })}
      {todos.filter((t) => t.done).length > 0 && (
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--sub)",
              margin: "1.5rem 0 6px",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
            }}>
            Completed — {todos.filter((t) => t.done).length}
          </p>
          {todos
            .filter((t) => t.done)
            .map((t) => (
              <div
                key={t.id}
                style={{
                  ...card,
                  padding: "10px 14px",
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  marginBottom: 6,
                  opacity: 0.5,
                }}>
                <button
                  onClick={() =>
                    setTodos((p) =>
                      p.map((td) =>
                        td.id === t.id ? { ...td, done: false } : td,
                      ),
                    )
                  }
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    border: "none",
                    background: "#059669",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                  <Check size={12} color="white" strokeWidth={3} />
                </button>
                <span
                  style={{
                    flex: 1,
                    fontSize: 14,
                    textDecoration: "line-through",
                    color: "var(--sub)",
                  }}>
                  {t.text}
                </span>
                <button
                  onClick={() =>
                    setTodos((p) => p.filter((td) => td.id !== t.id))
                  }
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--sub)",
                  }}>
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DAILY PLANNER
// ═══════════════════════════════════════════════════════════
function DailyPlanner() {
  const [blocks, setBlocks] = useState([
    {
      id: 1,
      time: "07:00",
      title: "Morning routine",
      duration: 60,
      color: "#059669",
      category: "personal",
    },
    {
      id: 2,
      time: "09:00",
      title: "Deep work session",
      duration: 120,
      color: "var(--acc)",
      category: "work",
    },
    {
      id: 3,
      time: "12:00",
      title: "Lunch break",
      duration: 60,
      color: "#d97706",
      category: "break",
    },
    {
      id: 4,
      time: "14:00",
      title: "Team meeting",
      duration: 30,
      color: "#0891b2",
      category: "meeting",
    },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [nb, setNb] = useState({
    time: "08:00",
    title: "",
    duration: 60,
    color: "var(--acc)",
    category: "work",
  });
  const hours = Array.from(
    { length: 17 },
    (_, i) => `${String(i + 6).padStart(2, "0")}:00`,
  );
  return (
    <div style={{ padding: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          marginBottom: "1.25rem",
          flexWrap: "wrap",
        }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
            Daily Planner
          </h2>
          <p style={{ fontSize: 13, color: "var(--sub)", margin: "3px 0 0" }}>
            {new Date().toLocaleDateString("en", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} style={btn()}>
          <Plus size={14} />
          Add block
        </button>
      </div>
      {showAdd && (
        <div
          style={{
            ...card,
            marginBottom: "1rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))",
            gap: 8,
          }}>
          <input
            placeholder="Title"
            value={nb.title}
            onChange={(e) => setNb((p) => ({ ...p, title: e.target.value }))}
          />
          <input
            type="time"
            value={nb.time}
            onChange={(e) => setNb((p) => ({ ...p, time: e.target.value }))}
          />
          <select
            value={nb.duration}
            onChange={(e) =>
              setNb((p) => ({ ...p, duration: Number(e.target.value) }))
            }
            style={{ width: "auto" }}>
            {[15, 30, 45, 60, 90, 120, 180].map((d) => (
              <option key={d} value={d}>
                {d} min
              </option>
            ))}
          </select>
          <select
            value={nb.category}
            onChange={(e) => setNb((p) => ({ ...p, category: e.target.value }))}
            style={{ width: "auto" }}>
            {[
              "work",
              "meeting",
              "personal",
              "break",
              "exercise",
              "learning",
            ].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="color"
              value={nb.color.startsWith("#") ? nb.color : "#5a67e8"}
              onChange={(e) => setNb((p) => ({ ...p, color: e.target.value }))}
              style={{ height: 38, padding: 2, cursor: "pointer", flex: 1 }}
            />
            <button
              onClick={() => {
                if (!nb.title) return;
                setBlocks((p) => [...p, { id: Date.now(), ...nb }]);
                setShowAdd(false);
              }}
              style={btn()}>
              Add
            </button>
          </div>
        </div>
      )}
      <div style={{ display: "flex", gap: "1rem" }}>
        <div style={{ width: 52, flexShrink: 0 }}>
          {hours.map((h) => (
            <div
              key={h}
              style={{
                height: 60,
                display: "flex",
                alignItems: "flex-start",
                paddingTop: 4,
              }}>
              <span
                style={{
                  fontSize: 11,
                  color: "var(--sub)",
                  display: "block",
                  width: "100%",
                  textAlign: "right",
                }}>
                {h}
              </span>
            </div>
          ))}
        </div>
        <div
          style={{
            flex: 1,
            position: "relative",
            borderLeft: "1px solid var(--bdr)",
          }}>
          {hours.map((h) => (
            <div
              key={h}
              style={{ height: 60, borderBottom: "1px solid var(--bdr)" }}
            />
          ))}
          {blocks.map((b) => {
            const [bh, bm] = b.time.split(":").map(Number);
            const top = (((bh - 6) * 60 + bm) / 60) * 60,
              height = (b.duration / 60) * 60;
            const col = b.color.startsWith("#") ? b.color : "#5a67e8";
            return (
              <div
                key={b.id}
                style={{
                  position: "absolute",
                  left: 8,
                  right: 8,
                  top,
                  height: Math.max(height - 4, 22),
                  background: col + "1a",
                  border: `1.5px solid ${col}`,
                  borderRadius: 8,
                  padding: "4px 8px",
                  overflow: "hidden",
                }}>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    margin: 0,
                    color: col,
                  }}>
                  {b.title}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    margin: "1px 0 0",
                    color: col + "bb",
                  }}>
                  {b.duration}min · {b.category}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// WEEKLY SCHEDULER
// ═══════════════════════════════════════════════════════════
function Scheduler() {
  const [events, setEvents] = useState([
    {
      id: 1,
      day: "Mon",
      hour: 9,
      title: "Team standup",
      color: "#5a67e8",
      duration: 1,
    },
    {
      id: 2,
      day: "Tue",
      hour: 14,
      title: "Client call",
      color: "#0891b2",
      duration: 1,
    },
    {
      id: 3,
      day: "Wed",
      hour: 10,
      title: "Design review",
      color: "#059669",
      duration: 2,
    },
    {
      id: 4,
      day: "Thu",
      hour: 13,
      title: "Lunch meeting",
      color: "#d97706",
      duration: 1,
    },
    {
      id: 5,
      day: "Fri",
      hour: 11,
      title: "Sprint review",
      color: "#7c3aed",
      duration: 1,
    },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [ne, setNe] = useState({
    day: "Mon",
    hour: 9,
    title: "",
    color: "#5a67e8",
    duration: 1,
  });
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hrs = Array.from({ length: 12 }, (_, i) => i + 7);
  return (
    <div style={{ padding: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: "1.25rem",
          flexWrap: "wrap",
        }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, flex: 1 }}>
          Weekly Scheduler
        </h2>
        <button onClick={() => setShowAdd(!showAdd)} style={btn()}>
          <Plus size={14} />
          Add event
        </button>
      </div>
      {showAdd && (
        <div
          style={{
            ...card,
            marginBottom: "1rem",
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}>
          <input
            placeholder="Event title"
            value={ne.title}
            onChange={(e) => setNe((p) => ({ ...p, title: e.target.value }))}
            style={{ flex: 1, minWidth: 140 }}
          />
          <select
            value={ne.day}
            onChange={(e) => setNe((p) => ({ ...p, day: e.target.value }))}
            style={{ width: "auto" }}>
            {DAYS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            value={ne.hour}
            onChange={(e) =>
              setNe((p) => ({ ...p, hour: Number(e.target.value) }))
            }
            style={{ width: "auto" }}>
            {hrs.map((h) => (
              <option key={h} value={h}>
                {String(h).padStart(2, "0")}:00
              </option>
            ))}
          </select>
          <select
            value={ne.duration}
            onChange={(e) =>
              setNe((p) => ({ ...p, duration: Number(e.target.value) }))
            }
            style={{ width: "auto" }}>
            {[0.5, 1, 1.5, 2, 3].map((d) => (
              <option key={d} value={d}>
                {d}h
              </option>
            ))}
          </select>
          <input
            type="color"
            value={ne.color}
            onChange={(e) => setNe((p) => ({ ...p, color: e.target.value }))}
            style={{ height: 38, padding: 2, width: 48 }}
          />
          <button
            onClick={() => {
              if (!ne.title) return;
              setEvents((p) => [...p, { id: Date.now(), ...ne }]);
              setShowAdd(false);
            }}
            style={btn()}>
            Add
          </button>
        </div>
      )}
      <div style={{ overflowX: "auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `56px repeat(7,minmax(90px,1fr))`,
            border: "1px solid var(--bdr)",
            borderRadius: 14,
            overflow: "hidden",
            minWidth: 580,
          }}>
          <div
            style={{
              background: "var(--sec)",
              padding: 8,
              borderBottom: "1px solid var(--bdr)",
            }}
          />
          {DAYS.map((d) => (
            <div
              key={d}
              style={{
                background: "var(--sec)",
                padding: "10px 6px",
                borderLeft: "1px solid var(--bdr)",
                borderBottom: "1px solid var(--bdr)",
                textAlign: "center",
              }}>
              <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{d}</p>
            </div>
          ))}
          {hrs.map((h) => (
            <div key={h} style={{ display: "contents" }}>
              <div
                style={{
                  padding: "6px 4px",
                  borderTop: "1px solid var(--bdr)",
                  fontSize: 11,
                  color: "var(--sub)",
                  height: 52,
                  display: "flex",
                  alignItems: "flex-start",
                  paddingTop: 6,
                  justifyContent: "center",
                }}>
                {String(h).padStart(2, "0")}:00
              </div>
              {DAYS.map((d) => {
                const ev = events.find((e) => e.day === d && e.hour === h);
                return (
                  <div
                    key={d}
                    style={{
                      borderLeft: "1px solid var(--bdr)",
                      borderTop: "1px solid var(--bdr)",
                      height: 52,
                      padding: 3,
                    }}>
                    {ev && (
                      <div
                        onClick={() =>
                          setEvents((p) => p.filter((e) => e.id !== ev.id))
                        }
                        style={{
                          background: ev.color + "1a",
                          border: `1.5px solid ${ev.color}`,
                          borderRadius: 4,
                          padding: "3px 5px",
                          fontSize: 11,
                          color: ev.color,
                          fontWeight: 600,
                          height: "100%",
                          overflow: "hidden",
                          cursor: "pointer",
                        }}
                        title="Click to remove">
                        {ev.title}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <p style={{ fontSize: 12, color: "var(--sub)", marginTop: 8 }}>
        Click any event to remove it.
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TIMETABLE — 30-min slots, 00:00–24:00, Mon–Sun
// ═══════════════════════════════════════════════════════════
function Timetable() {
  const [tt, setTt] = useLS("fd-timetable", {});
  const [sel, setSel] = useState(null);
  const [entry, setEntry] = useState({
    subject: "",
    room: "",
    color: "#5a67e8",
  });

  const selectSlot = (key) => {
    setSel(key);
    const e = tt[key];
    setEntry(
      e
        ? { subject: e.subject, room: e.room || "", color: e.color }
        : { subject: "", room: "", color: "#5a67e8" },
    );
  };
  const save = () => {
    if (!sel || !entry.subject.trim()) return;
    setTt((p) => ({ ...p, [sel]: { ...entry } }));
    setSel(null);
  };
  const remove = () => {
    setTt((p) => {
      const n = { ...p };
      delete n[sel];
      return n;
    });
    setSel(null);
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "1.25rem",
          gap: 12,
          flexWrap: "wrap",
        }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Timetable</h2>
        <span style={{ fontSize: 13, color: "var(--sub)" }}>
          30-min slots · 00:00–24:00 · Mon–Sun
        </span>
        <span style={{ fontSize: 13, color: "var(--sub)" }}>
          Click any slot to edit
        </span>
      </div>

      {sel && (
        <div
          style={{
            ...card,
            marginBottom: "1rem",
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            alignItems: "center",
            background: "var(--acc-bg)",
            border: "1px solid var(--acc-bdr)",
          }}>
          <span style={{ fontSize: 13, flexShrink: 0 }}>
            Slot: <strong>{sel}</strong>
          </span>
          <input
            placeholder="Subject / Class"
            value={entry.subject}
            onChange={(e) =>
              setEntry((p) => ({ ...p, subject: e.target.value }))
            }
            style={{ flex: 1, minWidth: 100 }}
          />
          <input
            placeholder="Room"
            value={entry.room}
            onChange={(e) => setEntry((p) => ({ ...p, room: e.target.value }))}
            style={{ width: 80 }}
          />
          <input
            type="color"
            value={entry.color}
            onChange={(e) => setEntry((p) => ({ ...p, color: e.target.value }))}
            style={{ height: 38, padding: 2, width: 48 }}
          />
          <button onClick={save} style={btn()}>
            Save
          </button>
          {tt[sel] && (
            <button onClick={remove} style={btn("#dc2626")}>
              Remove
            </button>
          )}
          <button onClick={() => setSel(null)} style={ghost}>
            Cancel
          </button>
        </div>
      )}

      <div
        style={{
          overflowX: "auto",
          overflowY: "auto",
          maxHeight: "70vh",
          borderRadius: 14,
          border: "1px solid var(--bdr)",
        }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "52px repeat(7,minmax(80px,1fr))",
            minWidth: 620,
          }}>
          {/* header */}
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              background: "var(--sec)",
              padding: 8,
              borderBottom: "1px solid var(--bdr)",
              borderRight: "1px solid var(--bdr)",
            }}
          />
          {TT_DAYS.map((d) => (
            <div
              key={d}
              style={{
                position: "sticky",
                top: 0,
                zIndex: 10,
                background: "var(--sec)",
                padding: "10px 4px",
                borderBottom: "1px solid var(--bdr)",
                borderRight: "1px solid var(--bdr)",
                textAlign: "center",
              }}>
              <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>{d}</p>
            </div>
          ))}
          {/* rows */}
          {TT_SLOTS.map((slot, si) => (
            <div key={slot} style={{ display: "contents" }}>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--sub)",
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderBottom: "1px solid var(--bdr)",
                  borderRight: "1px solid var(--bdr)",
                  background: "var(--sec)",
                  position: "sticky",
                  left: 0,
                  zIndex: 5,
                  flexShrink: 0,
                }}>
                {slot}
              </div>
              {TT_DAYS.map((d) => {
                const key = `${d}-${slot}`;
                const e = tt[key];
                const active = sel === key;
                return (
                  <div
                    key={d}
                    onClick={() => selectSlot(key)}
                    style={{
                      height: 36,
                      borderBottom: "1px solid var(--bdr)",
                      borderRight: "1px solid var(--bdr)",
                      padding: 2,
                      cursor: "pointer",
                      background: active ? "var(--acc-bg)" : "transparent",
                    }}>
                    {e && (
                      <div
                        style={{
                          background: e.color + "1a",
                          border: `1.5px solid ${e.color}`,
                          borderRadius: 3,
                          height: "100%",
                          padding: "1px 4px",
                          overflow: "hidden",
                        }}>
                        <p
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            margin: 0,
                            color: e.color,
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                          }}>
                          {e.subject}
                        </p>
                        {e.room && (
                          <p
                            style={{
                              fontSize: 8,
                              margin: 0,
                              color: e.color + "aa",
                            }}>
                            {e.room}
                          </p>
                        )}
                      </div>
                    )}
                    {!e && active && (
                      <div
                        style={{
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}>
                        <Plus size={10} color="var(--sub)" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// HABIT TRACKER — Positive & Negative with Bar Chart
// ═══════════════════════════════════════════════════════════
function HabitTracker({ habits, setHabits }) {
  const [tab, setTab] = useState("tracker");
  const [showAdd, setShowAdd] = useState(false);
  const [nh, setNh] = useState({ name: "", icon: "⭐", type: "positive" });

  const addHabit = () => {
    if (!nh.name.trim()) return;
    setHabits((p) => [
      ...p,
      { id: Date.now(), ...nh, completedDates: [], count: {} },
    ]);
    setNh({ name: "", icon: "⭐", type: "positive" });
    setShowAdd(false);
  };

  const toggle = (hid, date) =>
    setHabits((p) =>
      p.map((h) =>
        h.id !== hid
          ? h
          : {
              ...h,
              completedDates:
                h.type === "positive"
                  ? h.completedDates?.includes(date)
                    ? h.completedDates.filter((d) => d !== date)
                    : [...(h.completedDates || []), date]
                  : h.completedDates,
              count:
                h.type === "negative"
                  ? {
                      ...(h.count || {}),
                      [date]: ((h.count || {})[date] || 0) + 1,
                    }
                  : h.count,
            },
      ),
    );
  const decrement = (hid, date) =>
    setHabits((p) =>
      p.map((h) =>
        h.id !== hid
          ? h
          : {
              ...h,
              count: {
                ...(h.count || {}),
                [date]: Math.max(0, ((h.count || {})[date] || 1) - 1),
              },
            },
      ),
    );

  const getStreak = (h) => {
    if (h.type !== "positive") return 0;
    let s = 0;
    const cur = new Date();
    while (true) {
      const ds = cur.toISOString().split("T")[0];
      if (!h.completedDates?.includes(ds)) break;
      s++;
      cur.setDate(cur.getDate() - 1);
    }
    return s;
  };
  const weekRate = (h) => {
    if (h.type === "positive") {
      const done = WEEK7.filter((d) =>
        h.completedDates?.includes(d.date),
      ).length;
      return Math.round((done / 7) * 100);
    } else {
      const total = WEEK7.reduce(
        (a, d) => a + ((h.count || {})[d.date] || 0),
        0,
      );
      return total;
    }
  };

  const pos = habits.filter((h) => h.type === "positive");
  const neg = habits.filter((h) => h.type === "negative");
  const maxBar = Math.max(1, ...habits.map((h) => weekRate(h)));

  return (
    <div style={{ padding: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: "1.25rem",
          flexWrap: "wrap",
        }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, flex: 1 }}>
          Habit Tracker
        </h2>
        <div style={{ display: "flex", gap: 6 }}>
          {[
            ["tracker", "📋 Tracker"],
            ["chart", "📊 Charts"],
          ].map(([id, l]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={tab === id ? btn() : ghost}>
              {l}
            </button>
          ))}
          <button onClick={() => setShowAdd(!showAdd)} style={btn()}>
            <Plus size={14} />
            New habit
          </button>
        </div>
      </div>

      {showAdd && (
        <div
          style={{
            ...card,
            marginBottom: "1rem",
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            alignItems: "flex-end",
          }}>
          <div style={{ flex: 1, minWidth: 160 }}>
            <p style={lbl}>Habit name</p>
            <input
              placeholder="e.g. Morning exercise"
              value={nh.name}
              onChange={(e) => setNh((p) => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div>
            <p style={lbl}>Icon</p>
            <select
              value={nh.icon}
              onChange={(e) => setNh((p) => ({ ...p, icon: e.target.value }))}
              style={{ width: "auto" }}>
              {[
                "⭐",
                "🏃",
                "📖",
                "💧",
                "🧘",
                "🍎",
                "💊",
                "✍️",
                "🎯",
                "💪",
                "🌙",
                "☀️",
                "🎵",
                "🛌",
                "🚭",
                "📵",
                "🍺",
                "🎮",
                "🍫",
                "🚫",
              ].map((ic) => (
                <option key={ic} value={ic}>
                  {ic}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p style={lbl}>Type</p>
            <select
              value={nh.type}
              onChange={(e) => setNh((p) => ({ ...p, type: e.target.value }))}
              style={{ width: "auto" }}>
              <option value="positive">✅ Positive (build)</option>
              <option value="negative">❌ Negative (break)</option>
            </select>
          </div>
          <button
            onClick={addHabit}
            style={btn(nh.type === "positive" ? "#059669" : "#dc2626")}>
            Add
          </button>
          <button onClick={() => setShowAdd(false)} style={ghost}>
            Cancel
          </button>
        </div>
      )}

      {tab === "tracker" && (
        <div>
          {/* Today summary */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))",
              gap: 10,
              marginBottom: "1.25rem",
            }}>
            <div style={{ ...sec, borderLeft: "3px solid #059669" }}>
              <p style={lbl}>✅ Positive done today</p>
              <p
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#059669",
                  margin: 0,
                }}>
                {pos.filter((h) => h.completedDates?.includes(TODAY)).length}/
                {pos.length}
              </p>
            </div>
            <div style={{ ...sec, borderLeft: "3px solid #dc2626" }}>
              <p style={lbl}>❌ Negative occurrences today</p>
              <p
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#dc2626",
                  margin: 0,
                }}>
                {neg.reduce((a, h) => a + ((h.count || {})[TODAY] || 0), 0)}
              </p>
            </div>
            <div style={{ ...sec, borderLeft: "3px solid var(--acc)" }}>
              <p style={lbl}>🔥 Longest streak</p>
              <p
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "var(--acc)",
                  margin: 0,
                }}>
                {Math.max(0, ...pos.map((h) => getStreak(h)))} days
              </p>
            </div>
          </div>

          {/* Tracker grid */}
          {[
            {
              label: "Positive Habits — build these 🟢",
              list: pos,
              color: "#059669",
            },
            {
              label: "Negative Habits — break these 🔴",
              list: neg,
              color: "#dc2626",
            },
          ].map(({ label, list, color }) => {
            if (!list.length) return null;
            return (
              <div key={label} style={{ marginBottom: "1.5rem" }}>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color,
                    margin: "0 0 10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                  }}>
                  {label}
                </p>
                <div style={{ ...card, padding: 0, overflow: "hidden" }}>
                  {/* header */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 220px 80px",
                      background: "var(--sec)",
                      padding: "10px 16px",
                      borderBottom: "1px solid var(--bdr)",
                    }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "var(--sub)",
                      }}>
                      Habit
                    </span>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(7,1fr)",
                        gap: 2,
                      }}>
                      {WEEK7.map((d) => (
                        <span
                          key={d.date}
                          style={{
                            fontSize: 10,
                            textAlign: "center",
                            fontWeight: 700,
                            color:
                              d.date === TODAY ? "var(--acc)" : "var(--sub)",
                          }}>
                          {d.label}
                        </span>
                      ))}
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "var(--sub)",
                        textAlign: "center",
                      }}>
                      Streak/Count
                    </span>
                  </div>
                  {list.map((h, i) => {
                    const streak = getStreak(h);
                    return (
                      <div
                        key={h.id}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 220px 80px",
                          padding: "12px 16px",
                          borderBottom:
                            i < list.length - 1
                              ? "1px solid var(--bdr)"
                              : "none",
                          alignItems: "center",
                        }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}>
                          <span style={{ fontSize: 20 }}>{h.icon}</span>
                          <div>
                            <p
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                margin: 0,
                              }}>
                              {h.name}
                            </p>
                            <p
                              style={{
                                fontSize: 11,
                                color: "var(--sub)",
                                margin: "1px 0 0",
                              }}>
                              {h.completedDates?.length || 0} total completions
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              setHabits((p) => p.filter((x) => x.id !== h.id))
                            }
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "var(--sub)",
                              marginLeft: "auto",
                            }}>
                            <X size={12} />
                          </button>
                        </div>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(7,1fr)",
                            gap: 2,
                          }}>
                          {WEEK7.map((d) => {
                            if (h.type === "positive") {
                              const done = h.completedDates?.includes(d.date);
                              return (
                                <button
                                  key={d.date}
                                  onClick={() => toggle(h.id, d.date)}
                                  style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: 6,
                                    border: done
                                      ? "none"
                                      : `1.5px solid var(--bdr)`,
                                    background: done ? color : "transparent",
                                    cursor: "pointer",
                                    margin: "0 auto",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "all .15s",
                                  }}>
                                  {done && (
                                    <Check
                                      size={13}
                                      color="white"
                                      strokeWidth={3}
                                    />
                                  )}
                                </button>
                              );
                            } else {
                              const cnt = (h.count || {})[d.date] || 0;
                              return (
                                <div
                                  key={d.date}
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 1,
                                  }}>
                                  {cnt > 0 && (
                                    <button
                                      onClick={() => decrement(h.id, d.date)}
                                      style={{
                                        fontSize: 8,
                                        padding: "0 3px",
                                        background: color + "20",
                                        border: `1px solid ${color}`,
                                        borderRadius: 3,
                                        cursor: "pointer",
                                        color,
                                        fontWeight: 700,
                                        lineHeight: "14px",
                                      }}>
                                      −
                                    </button>
                                  )}
                                  <button
                                    onClick={() => toggle(h.id, d.date)}
                                    style={{
                                      width: 26,
                                      height: 26,
                                      borderRadius: 5,
                                      border:
                                        cnt > 0
                                          ? "none"
                                          : `1.5px solid var(--bdr)`,
                                      background:
                                        cnt > 0 ? color : "transparent",
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontSize: 10,
                                      fontWeight: 700,
                                      color: cnt > 0 ? "white" : color,
                                    }}>
                                    {cnt > 0 ? cnt : "✕"}
                                  </button>
                                </div>
                              );
                            }
                          })}
                        </div>
                        <div style={{ textAlign: "center" }}>
                          {h.type === "positive" ? (
                            streak > 0 ? (
                              <span
                                style={{
                                  fontSize: 15,
                                  fontWeight: 700,
                                  color: "#d97706",
                                }}>
                                🔥{streak}
                              </span>
                            ) : (
                              <span
                                style={{ fontSize: 13, color: "var(--sub)" }}>
                                —
                              </span>
                            )
                          ) : (
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color:
                                  Object.values(h.count || {}).reduce(
                                    (a, b) => a + b,
                                    0,
                                  ) > 0
                                    ? "#dc2626"
                                    : "var(--sub)",
                              }}>
                              {Object.values(h.count || {}).reduce(
                                (a, b) => a + b,
                                0,
                              )}{" "}
                              total
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "chart" && (
        <div>
          <p
            style={{ fontSize: 13, color: "var(--sub)", marginBottom: "1rem" }}>
            Weekly performance (last 7 days)
          </p>
          {habits.map((h) => {
            const rate = weekRate(h);
            const isPos = h.type === "positive";
            const barColor = isPos ? "#059669" : "#dc2626";
            const pct = isPos ? rate : Math.min((rate / 10) * 100, 100);
            return (
              <div
                key={h.id}
                style={{ ...card, marginBottom: 10, padding: "12px 16px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 8,
                  }}>
                  <span style={{ fontSize: 18 }}>{h.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>
                      {h.name}
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: "var(--sub)",
                        margin: "2px 0 0",
                      }}>
                      {isPos
                        ? `${rate}% completion this week`
                        : `${rate} occurrences this week`}
                    </p>
                  </div>
                  <span style={badge(isPos ? "#dcfce7" : "#fef2f2", barColor)}>
                    {isPos ? `${rate}%` : `${rate}×`}
                  </span>
                </div>
                <div
                  style={{
                    height: 12,
                    background: "var(--sec)",
                    borderRadius: 99,
                    overflow: "hidden",
                  }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${pct}%`,
                      background: barColor,
                      borderRadius: 99,
                      transition: "width .6s cubic-bezier(.4,0,.2,1)",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 6,
                  }}>
                  {WEEK7.map((d) => {
                    const val = isPos
                      ? h.completedDates?.includes(d.date)
                        ? 1
                        : 0
                      : (h.count || {})[d.date] || 0;
                    return (
                      <div
                        key={d.date}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 2,
                        }}>
                        <div
                          style={{
                            width: 16,
                            background: "var(--sec)",
                            borderRadius: 3,
                            overflow: "hidden",
                            height: 32,
                            display: "flex",
                            alignItems: "flex-end",
                          }}>
                          <div
                            style={{
                              width: "100%",
                              background: barColor,
                              height: `${isPos ? val * 100 : Math.min((val / 3) * 100, 100)}%`,
                              transition: "height .4s",
                            }}
                          />
                        </div>
                        <span style={{ fontSize: 9, color: "var(--sub)" }}>
                          {d.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {habits.length === 0 && (
            <div style={{ ...sec, textAlign: "center", padding: "2rem" }}>
              <p style={{ color: "var(--sub)" }}>
                Add habits to see your charts here.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MIND MAP
// ═══════════════════════════════════════════════════════════
function MindMap() {
  const [nodes, setNodes] = useState([
    {
      id: 1,
      x: 320,
      y: 220,
      text: "Central Idea",
      type: "root",
      color: "var(--acc)",
    },
  ]);
  const [edges, setEdges] = useState([]);
  const [connecting, setConnecting] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editText, setEditText] = useState("");
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);
  const COLORS = [
    "var(--acc)",
    "#059669",
    "#dc2626",
    "#d97706",
    "#7c3aed",
    "#0891b2",
    "#e11d48",
  ];

  const addNode = (e) => {
    if (dragging || editing) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left,
      y = e.clientY - rect.top;
    const hit = nodes.find(
      (n) => Math.abs(n.x - x) < 60 && Math.abs(n.y - y) < 20,
    );
    if (hit) return;
    const newN = {
      id: Date.now(),
      x,
      y,
      text: "New idea",
      type: "branch",
      color: COLORS[nodes.length % COLORS.length],
    };
    setNodes((p) => [...p, newN]);
  };

  const startDrag = (e, id) => {
    e.stopPropagation();
    const rect = svgRef.current.getBoundingClientRect();
    const n = nodes.find((x) => x.id === id);
    setDragging(id);
    setOffset({
      x: e.clientX - rect.left - n.x,
      y: e.clientY - rect.top - n.y,
    });
  };
  const onMove = (e) => {
    if (!dragging) return;
    const rect = svgRef.current.getBoundingClientRect();
    setNodes((p) =>
      p.map((n) =>
        n.id === dragging
          ? {
              ...n,
              x: e.clientX - rect.left - offset.x,
              y: e.clientY - rect.top - offset.y,
            }
          : n,
      ),
    );
  };
  const endDrag = () => setDragging(null);

  const handleNodeClick = (e, id) => {
    e.stopPropagation();
    if (connecting) {
      if (connecting !== id) {
        setEdges((p) => [...p, { id: Date.now(), from: connecting, to: id }]);
      }
      setConnecting(null);
    } else {
      setConnecting(id);
    }
  };
  const startEdit = (e, n) => {
    e.stopPropagation();
    setEditing(n.id);
    setEditText(n.text);
  };
  const saveEdit = (id) => {
    setNodes((p) => p.map((n) => (n.id === id ? { ...n, text: editText } : n)));
    setEditing(null);
  };
  const deleteNode = (e, id) => {
    e.stopPropagation();
    setNodes((p) => p.filter((n) => n.id !== id));
    setEdges((p) => p.filter((e) => e.from !== id && e.to !== id));
    setConnecting(null);
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, flex: 1 }}>
          Mind Map
        </h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {connecting && (
            <span
              style={{
                fontSize: 12,
                background: "var(--acc-bg)",
                color: "var(--acc)",
                padding: "6px 10px",
                borderRadius: 8,
                fontWeight: 600,
              }}>
              Click another node to connect →
            </span>
          )}
          <button
            onClick={() => setConnecting(null)}
            style={connecting ? btn("#dc2626") : ghost}>
            {connecting ? "Cancel connect" : "🔗 Connect mode"}
          </button>
          <button
            onClick={() => {
              setNodes([
                {
                  id: 1,
                  x: 320,
                  y: 220,
                  text: "Central Idea",
                  type: "root",
                  color: "var(--acc)",
                },
              ]);
              setEdges([]);
            }}
            style={ghost}>
            Reset
          </button>
        </div>
      </div>
      <div style={{ fontSize: 12, color: "var(--sub)", marginBottom: 8 }}>
        Click empty area to add a node · Double-click a node to edit · Drag to
        move · Right-click to delete
      </div>
      <div
        style={{
          border: "1px solid var(--bdr)",
          borderRadius: 14,
          overflow: "hidden",
          background: "var(--card)",
        }}>
        <svg
          ref={svgRef}
          width="100%"
          height="500"
          onClick={addNode}
          onMouseMove={onMove}
          onMouseUp={endDrag}
          style={{ cursor: "crosshair", userSelect: "none", display: "block" }}>
          <defs>
            <pattern
              id="grid"
              width="30"
              height="30"
              patternUnits="userSpaceOnUse">
              <path
                d="M 30 0 L 0 0 0 30"
                fill="none"
                stroke="var(--bdr)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {edges.map((e) => {
            const f = nodes.find((n) => n.id === e.from),
              t = nodes.find((n) => n.id === e.to);
            if (!f || !t) return null;
            return (
              <line
                key={e.id}
                x1={f.x}
                y1={f.y}
                x2={t.x}
                y2={t.y}
                stroke="var(--bdr)"
                strokeWidth="2"
                strokeDasharray="5,3"
              />
            );
          })}
          {nodes.map((n) => {
            const w = Math.max(100, n.text.length * 8 + 20),
              h = 34;
            const col = n.color.startsWith("var") ? n.color : n.color;
            return (
              <g
                key={n.id}
                transform={`translate(${n.x},${n.y})`}
                onMouseDown={(e) => startDrag(e, n.id)}
                onClick={(e) => handleNodeClick(e, n.id)}
                onDoubleClick={(e) => startEdit(e, n)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  deleteNode(e, n.id);
                }}>
                <rect
                  x={-w / 2}
                  y={-h / 2}
                  width={w}
                  height={h}
                  rx="10"
                  fill={n.type === "root" ? "var(--acc)" : "var(--acc-bg)"}
                  stroke={connecting === n.id ? "#dc2626" : "var(--acc)"}
                  strokeWidth={connecting === n.id ? 2.5 : 1.5}
                  style={{
                    cursor: dragging === n.id ? "grabbing" : "grab",
                    filter:
                      connecting === n.id
                        ? "drop-shadow(0 0 6px #dc262660)"
                        : "none",
                  }}
                />
                {editing === n.id ? (
                  <foreignObject x={-w / 2} y={-h / 2} width={w} height={h}>
                    <div
                      xmlns="http://www.w3.org/1999/xhtml"
                      style={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                      }}>
                      <input
                        autoFocus
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={() => saveEdit(n.id)}
                        onKeyDown={(e) => e.key === "Enter" && saveEdit(n.id)}
                        style={{
                          width: "100%",
                          border: "none",
                          background: "transparent",
                          textAlign: "center",
                          fontSize: 12,
                          fontWeight: 600,
                          outline: "none",
                          padding: "0 4px",
                          color: n.type === "root" ? "white" : "var(--acc)",
                        }}
                      />
                    </div>
                  </foreignObject>
                ) : (
                  <text
                    textAnchor="middle"
                    dy="0.35em"
                    fontSize="12"
                    fontWeight="600"
                    fill={n.type === "root" ? "white" : "var(--acc)"}
                    style={{ pointerEvents: "none" }}>
                    {n.text.length > 16 ? n.text.slice(0, 16) + "…" : n.text}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DEEP WORK STUDIO
// ═══════════════════════════════════════════════════════════
function DeepWork() {
  const [projects, setProjects] = useLS("fd-projects", []);
  const [selId, setSelId] = useState(null);
  const [tab, setTab] = useState("canvas");
  const [showNew, setShowNew] = useState(false);
  const [np, setNp] = useState({
    name: "",
    desc: "",
    template: "idea",
    status: "Idea",
  });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");

  const selProject = projects.find((p) => p.id === selId);

  const createProject = () => {
    if (!np.name.trim()) return;
    const p = {
      id: Date.now(),
      ...np,
      fields: {},
      milestones: [],
      notes: "",
      createdAt: TODAY,
    };
    setProjects((prev) => [...prev, p]);
    setSelId(p.id);
    setShowNew(false);
    setNp({ name: "", desc: "", template: "idea", status: "Idea" });
  };
  const updateField = (field, val) =>
    setProjects((p) =>
      p.map((pr) =>
        pr.id !== selId
          ? pr
          : { ...pr, fields: { ...pr.fields, [field]: val } },
      ),
    );
  const updateNotes = (val) =>
    setProjects((p) =>
      p.map((pr) => (pr.id !== selId ? pr : { ...pr, notes: val })),
    );
  const addMilestone = () =>
    setProjects((p) =>
      p.map((pr) =>
        pr.id !== selId
          ? pr
          : {
              ...pr,
              milestones: [
                ...(pr.milestones || []),
                {
                  id: Date.now(),
                  text: "New milestone",
                  done: false,
                  date: "",
                },
              ],
            },
      ),
    );
  const toggleMilestone = (mid) =>
    setProjects((p) =>
      p.map((pr) =>
        pr.id !== selId
          ? pr
          : {
              ...pr,
              milestones: pr.milestones.map((m) =>
                m.id === mid ? { ...m, done: !m.done } : m,
              ),
            },
      ),
    );
  const updateStatus = (s) =>
    setProjects((p) =>
      p.map((pr) => (pr.id === selId ? { ...pr, status: s } : pr)),
    );
  const deleteProject = (id) => {
    setProjects((p) => p.filter((pr) => pr.id !== id));
    if (selId === id) setSelId(null);
  };

  const aiSuggest = async () => {
    if (!selProject) return;
    setAiLoading(true);
    setAiSuggestion("");
    const tmpl = DW_TEMPLATES[selProject.template];
    const filled = Object.entries(selProject.fields || {})
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `You are a startup advisor and project management expert reviewing someone's ${tmpl.name}. 
Project: "${selProject.name}"
Template: ${tmpl.name}
What they've filled in so far:
${filled || "Nothing yet."}
Give 3-5 sharp, specific, actionable suggestions to improve or complete this canvas. Be direct and insightful. Format as a numbered list. Under 200 words total.`,
            },
          ],
        }),
      });
      const data = await res.json();
      setAiSuggestion((data.content || []).map((c) => c.text || "").join(""));
    } catch {
      setAiSuggestion("Could not load AI suggestions. Please try again.");
    }
    setAiLoading(false);
  };

  const STATUSES = [
    "Idea",
    "Researching",
    "In Progress",
    "Testing",
    "Launched",
    "On Hold",
  ];
  const SBADGE = {
    Idea: "#7c3aed",
    Researching: "#0891b2",
    "In Progress": "var(--acc)",
    Testing: "#d97706",
    Launched: "#059669",
    "On Hold": "#6b7280",
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: "1.25rem",
          flexWrap: "wrap",
        }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, flex: 1 }}>
          🔬 Deep Work Studio
        </h2>
        <button onClick={() => setShowNew(!showNew)} style={btn()}>
          <Plus size={14} />
          New project
        </button>
      </div>

      {showNew && (
        <div
          style={{ ...card, marginBottom: "1rem", display: "grid", gap: 10 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}>
            <div>
              <p style={lbl}>Project name *</p>
              <input
                placeholder="e.g. My SaaS idea"
                value={np.name}
                onChange={(e) => setNp((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div>
              <p style={lbl}>Template</p>
              <select
                value={np.template}
                onChange={(e) =>
                  setNp((p) => ({ ...p, template: e.target.value }))
                }
                style={{ width: "auto" }}>
                {Object.entries(DW_TEMPLATES).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.icon} {v.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <p style={lbl}>Description / vision</p>
            <textarea
              placeholder="What is this about? What problem does it solve?"
              value={np.desc}
              onChange={(e) => setNp((p) => ({ ...p, desc: e.target.value }))}
              style={{ height: 60 }}
            />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={createProject} style={btn()}>
              Create project
            </button>
            <button onClick={() => setShowNew(false)} style={ghost}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Project list */}
      {!selProject && (
        <div>
          {projects.length === 0 && (
            <div style={{ ...sec, textAlign: "center", padding: "3rem 2rem" }}>
              <p style={{ fontSize: 32, margin: "0 0 8px" }}>🔬</p>
              <p style={{ fontWeight: 700, fontSize: 16, margin: "0 0 4px" }}>
                Your Deep Work Studio awaits
              </p>
              <p
                style={{
                  color: "var(--sub)",
                  fontSize: 13,
                  margin: "0 0 16px",
                }}>
                Create your first project and start bringing your ideas to life
              </p>
              <button onClick={() => setShowNew(true)} style={btn()}>
                Start a project
              </button>
            </div>
          )}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
              gap: "1rem",
            }}>
            {projects.map((p) => {
              const tmpl = DW_TEMPLATES[p.template];
              return (
                <div
                  key={p.id}
                  onClick={() => setSelId(p.id)}
                  style={{
                    ...card,
                    cursor: "pointer",
                    borderLeft: `4px solid ${SBADGE[p.status] || "var(--acc)"}`,
                    transition: "transform .15s",
                    ":hover": { transform: "translateY(-2px)" },
                  }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 8,
                    }}>
                    <span style={{ fontSize: 22 }}>{tmpl?.icon || "📋"}</span>
                    <div
                      style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <span
                        style={badge(
                          SBADGE[p.status] + "20",
                          SBADGE[p.status] || "var(--acc)",
                        )}>
                        {p.status}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProject(p.id);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--sub)",
                        }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      margin: "0 0 4px",
                    }}>
                    {p.name}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--sub)",
                      margin: "0 0 8px",
                    }}>
                    {tmpl?.name}
                  </p>
                  {p.desc && (
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--sub)",
                        margin: 0,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}>
                      {p.desc}
                    </p>
                  )}
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--sub)",
                      margin: "8px 0 0",
                    }}>
                    Created {p.createdAt} ·{" "}
                    {Object.values(p.fields || {}).filter(Boolean).length}/
                    {DW_TEMPLATES[p.template]?.fields.length || 0} fields
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Project detail */}
      {selProject &&
        (() => {
          const tmpl = DW_TEMPLATES[selProject.template];
          return (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: "1rem",
                  flexWrap: "wrap",
                }}>
                <button onClick={() => setSelId(null)} style={ghost}>
                  ← Back
                </button>
                <span style={{ fontSize: 20 }}>{tmpl?.icon}</span>
                <h3
                  style={{ fontSize: 18, fontWeight: 700, margin: 0, flex: 1 }}>
                  {selProject.name}
                </h3>
                <select
                  value={selProject.status}
                  onChange={(e) => updateStatus(e.target.value)}
                  style={{ width: "auto" }}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: "1rem",
                  flexWrap: "wrap",
                }}>
                {[
                  ["canvas", "🗃️ Canvas"],
                  ["milestones", "🎯 Milestones"],
                  ["notes", "📝 Notes"],
                  ["ai", "🤖 AI Advisor"],
                ].map(([id, l]) => (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    style={tab === id ? btn() : ghost}>
                    {l}
                  </button>
                ))}
              </div>

              {tab === "canvas" && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
                    gap: "1rem",
                  }}>
                  {tmpl.fields.map((f, i) => (
                    <div key={i} style={{ ...card }}>
                      <p
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "var(--acc)",
                          margin: "0 0 6px",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}>
                        {f}
                      </p>
                      <textarea
                        value={selProject.fields?.[f] || ""}
                        onChange={(e) => updateField(f, e.target.value)}
                        placeholder={`Describe your ${f.toLowerCase()}…`}
                        style={{
                          minHeight: 90,
                          border: "none",
                          background: "transparent",
                          padding: 0,
                          resize: "vertical",
                          fontSize: 13,
                          color: "var(--text)",
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {tab === "milestones" && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginBottom: "1rem",
                    }}>
                    <button onClick={addMilestone} style={btn()}>
                      <Plus size={14} />
                      Add milestone
                    </button>
                  </div>
                  {(selProject.milestones || []).map((m) => (
                    <div
                      key={m.id}
                      style={{
                        ...card,
                        display: "flex",
                        gap: 10,
                        alignItems: "center",
                        marginBottom: 8,
                        padding: "10px 14px",
                        opacity: m.done ? 0.6 : 1,
                      }}>
                      <button
                        onClick={() => toggleMilestone(m.id)}
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 4,
                          border: "1.5px solid var(--bdr)",
                          background: m.done ? "#059669" : "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}>
                        {m.done && (
                          <Check size={12} color="white" strokeWidth={3} />
                        )}
                      </button>
                      <input
                        value={m.text}
                        onChange={(e) =>
                          setProjects((p) =>
                            p.map((pr) =>
                              pr.id !== selId
                                ? pr
                                : {
                                    ...pr,
                                    milestones: pr.milestones.map((mi) =>
                                      mi.id === m.id
                                        ? { ...mi, text: e.target.value }
                                        : mi,
                                    ),
                                  },
                            ),
                          )
                        }
                        style={{
                          flex: 1,
                          border: "none",
                          background: "transparent",
                          fontSize: 14,
                          fontWeight: 600,
                          textDecoration: m.done ? "line-through" : "none",
                        }}
                      />
                      <input
                        type="date"
                        value={m.date || ""}
                        onChange={(e) =>
                          setProjects((p) =>
                            p.map((pr) =>
                              pr.id !== selId
                                ? pr
                                : {
                                    ...pr,
                                    milestones: pr.milestones.map((mi) =>
                                      mi.id === m.id
                                        ? { ...mi, date: e.target.value }
                                        : mi,
                                    ),
                                  },
                            ),
                          )
                        }
                        style={{ width: 140, fontSize: 12 }}
                      />
                      <button
                        onClick={() =>
                          setProjects((p) =>
                            p.map((pr) =>
                              pr.id !== selId
                                ? pr
                                : {
                                    ...pr,
                                    milestones: pr.milestones.filter(
                                      (mi) => mi.id !== m.id,
                                    ),
                                  },
                            ),
                          )
                        }
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--sub)",
                        }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                  {!(selProject.milestones || []).length && (
                    <div
                      style={{ ...sec, textAlign: "center", padding: "2rem" }}>
                      <p style={{ color: "var(--sub)" }}>
                        No milestones yet. Add some to track your progress.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {tab === "notes" && (
                <div style={card}>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--sub)",
                      margin: "0 0 8px",
                    }}>
                    Free-form notes, ideas, and research for this project
                  </p>
                  <textarea
                    value={selProject.notes || ""}
                    onChange={(e) => updateNotes(e.target.value)}
                    placeholder="Write anything here — raw ideas, research notes, links, thoughts…"
                    style={{
                      minHeight: 300,
                      border: "none",
                      background: "transparent",
                      padding: 0,
                      resize: "vertical",
                      fontSize: 14,
                      lineHeight: 1.7,
                    }}
                  />
                </div>
              )}

              {tab === "ai" && (
                <div>
                  <div
                    style={{
                      ...card,
                      marginBottom: "1rem",
                      background:
                        "linear-gradient(135deg,var(--acc-bg),var(--card))",
                    }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: "1rem",
                      }}>
                      <span style={{ fontSize: 28 }}>🤖</span>
                      <div>
                        <p style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>
                          AI Project Advisor
                        </p>
                        <p
                          style={{
                            fontSize: 12,
                            color: "var(--sub)",
                            margin: "3px 0 0",
                          }}>
                          Get sharp, actionable suggestions to improve your{" "}
                          {tmpl?.name}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={aiSuggest}
                      disabled={aiLoading}
                      style={btn(aiLoading ? "#9ca3af" : "#7c3aed")}>
                      <Zap size={14} />
                      {aiLoading
                        ? "Analyzing your project…"
                        : "Get AI suggestions"}
                    </button>
                  </div>
                  {aiSuggestion && (
                    <div style={{ ...card }}>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          margin: "0 0 10px",
                          color: "var(--acc)",
                        }}>
                        💡 AI Suggestions for "{selProject.name}"
                      </p>
                      <div
                        style={{
                          fontSize: 13,
                          lineHeight: 1.8,
                          color: "var(--text)",
                          whiteSpace: "pre-wrap",
                        }}>
                        {aiSuggestion}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })()}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// GRATITUDE JOURNAL
// ═══════════════════════════════════════════════════════════
function GratitudeJournal() {
  const [entries, setEntries] = useLS("fd-gratitude", []);
  const [showAdd, setShowAdd] = useState(false);
  const [text, setText] = useState("");
  const [suggIdx, setSuggIdx] = useState(0);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  const addEntry = () => {
    if (!text.trim()) return;
    setEntries((p) => [
      {
        id: Date.now(),
        text,
        date: TODAY,
        time: new Date().toLocaleTimeString("en", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      ...p,
    ]);
    setText("");
    setShowAdd(false);
  };

  const useSuggestion = (s) => {
    setText(s);
    setShowAdd(true);
  };

  const loadMoreAI = async () => {
    setAiLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `Generate 10 unique, heartfelt, spiritually-grounded things to be grateful to God about. 
These should be personal, deep, and varied — covering life, relationships, faith, creation, grace, provision, etc.
Return as a JSON array of strings only, no markdown, no numbering:
["gratitude item 1","gratitude item 2",...]`,
            },
          ],
        }),
      });
      const data = await res.json();
      const raw = (data.content || [])
        .map((c) => c.text || "")
        .join("")
        .replace(/```json|```/g, "")
        .trim();
      const parsed = JSON.parse(raw);
      setAiSuggestions(parsed);
    } catch {
      setAiSuggestions([
        "Every morning God's mercies are new",
        "The peace that passes all understanding",
        "Being chosen and loved unconditionally",
      ]);
    }
    setAiLoading(false);
  };

  const allSuggestions = [...GRATITUDE_LIST, ...aiSuggestions];
  const todayEntries = entries.filter((e) => e.date === TODAY);
  const streak = () => {
    let s = 0,
      cur = new Date();
    while (true) {
      const ds = cur.toISOString().split("T")[0];
      if (!entries.some((e) => e.date === ds)) break;
      s++;
      cur.setDate(cur.getDate() - 1);
    }
    return s;
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: "1.25rem",
          flexWrap: "wrap",
        }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, flex: 1 }}>
          🙏 Gratitude Journal
        </h2>
        <div style={{ display: "flex", gap: 8 }}>
          <span
            style={{ fontSize: 13, color: "var(--sub)", alignSelf: "center" }}>
            🔥 {streak()} day streak
          </span>
          <button onClick={() => setShowAdd(!showAdd)} style={btn()}>
            <Plus size={14} />
            Add gratitude
          </button>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))",
          gap: 10,
          marginBottom: "1.5rem",
        }}>
        <div style={{ ...sec, borderLeft: "3px solid #d97706" }}>
          <p style={lbl}>Today's entries</p>
          <p
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#d97706",
              margin: 0,
            }}>
            {todayEntries.length}
          </p>
        </div>
        <div style={{ ...sec, borderLeft: "3px solid var(--acc)" }}>
          <p style={lbl}>Total entries</p>
          <p
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "var(--acc)",
              margin: 0,
            }}>
            {entries.length}
          </p>
        </div>
        <div style={{ ...sec, borderLeft: "3px solid #059669" }}>
          <p style={lbl}>Day streak</p>
          <p
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#059669",
              margin: 0,
            }}>
            🔥{streak()}
          </p>
        </div>
      </div>

      {showAdd && (
        <div
          style={{
            ...card,
            marginBottom: "1rem",
            background: "linear-gradient(135deg,#fffbeb,var(--card))",
          }}>
          <p
            style={{
              fontSize: 14,
              fontWeight: 700,
              margin: "0 0 8px",
              color: "#d97706",
            }}>
            🙏 What are you grateful to God for today?
          </p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write from your heart — even the smallest blessing counts…"
            style={{ minHeight: 80, fontSize: 14, lineHeight: 1.7 }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={addEntry} style={btn("#d97706")}>
              Save entry
            </button>
            <button onClick={() => setShowAdd(false)} style={ghost}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Daily Suggestions */}
      <div style={{ ...card, marginBottom: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: "1rem",
            flexWrap: "wrap",
          }}>
          <p style={{ fontSize: 14, fontWeight: 700, margin: 0, flex: 1 }}>
            ✨ 1001+ Gratitude Suggestions
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() =>
                setSuggIdx(
                  (i) =>
                    (i - 5 + allSuggestions.length) % allSuggestions.length,
                )
              }
              style={ghost}>
              ← Prev
            </button>
            <button
              onClick={() => setSuggIdx((i) => (i + 5) % allSuggestions.length)}
              style={ghost}>
              Next →
            </button>
            <button
              onClick={loadMoreAI}
              disabled={aiLoading}
              style={btn("#7c3aed")}>
              {aiLoading ? "Loading…" : "✨ AI More"}
            </button>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
            gap: 8,
          }}>
          {allSuggestions.slice(suggIdx, suggIdx + 10).map((s, i) => (
            <button
              key={i}
              onClick={() => useSuggestion(s)}
              style={{
                ...sec,
                textAlign: "left",
                cursor: "pointer",
                fontSize: 13,
                lineHeight: 1.5,
                border: "1px solid var(--bdr)",
                borderRadius: 10,
                padding: "10px 12px",
                color: "var(--text)",
                fontFamily: "inherit",
                transition: "all .15s",
                background: "var(--sec)",
              }}>
              <span style={{ color: "#d97706", marginRight: 6 }}>🙏</span>
              {s}
            </button>
          ))}
        </div>
        <p
          style={{
            fontSize: 11,
            color: "var(--sub)",
            margin: "10px 0 0",
            textAlign: "center",
          }}>
          Showing {suggIdx + 1}–{Math.min(suggIdx + 10, allSuggestions.length)}{" "}
          of {allSuggestions.length}+ suggestions. Click any to use it as a
          starting point.
        </p>
      </div>

      {/* Journal entries */}
      <p
        style={{
          fontSize: 13,
          fontWeight: 700,
          margin: "0 0 10px",
          color: "var(--sub)",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}>
        Recent entries — {entries.length} total
      </p>
      {entries.slice(0, 20).map((e) => (
        <div
          key={e.id}
          style={{
            ...card,
            marginBottom: 8,
            padding: "12px 16px",
            borderLeft: "3px solid #d97706",
          }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}>
            <span style={badge("#fffbeb", "#d97706")}>
              {e.date} · {e.time}
            </span>
            <button
              onClick={() => setEntries((p) => p.filter((x) => x.id !== e.id))}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--sub)",
              }}>
              <X size={12} />
            </button>
          </div>
          <p
            style={{
              fontSize: 14,
              margin: 0,
              lineHeight: 1.6,
              fontStyle: "italic",
              color: "var(--text)",
            }}>
            "…{e.text}"
          </p>
        </div>
      ))}
      {entries.length === 0 && (
        <div style={{ ...sec, textAlign: "center", padding: "2rem" }}>
          <p style={{ fontSize: 32, margin: "0 0 8px" }}>🙏</p>
          <p style={{ color: "var(--sub)" }}>
            Start your gratitude journey today. Even one entry changes your
            perspective.
          </p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════════
function Settings({
  userName,
  setUserName,
  themeMode,
  setThemeMode,
  accentColor,
  setAccentColor,
  notifEnabled,
  setNotifEnabled,
}) {
  const [name, setName] = useState(userName);
  const saveName = () => setUserName(name);
  const requestNotif = async () => {
    if (!("Notification" in window)) {
      alert("Notifications not supported in this browser.");
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      setNotifEnabled(true);
      new Notification("FlowDesk ✅", {
        body: "Notifications enabled! You'll get daily reminders.",
      });
    } else setNotifEnabled(false);
  };
  const THEME_LABELS = {
    light: "☀️ Light",
    dark: "🌙 Dark",
    midnight: "🌌 Midnight",
    warm: "🌅 Warm",
  };
  const ACCENT_LABELS = {
    indigo: "Indigo",
    emerald: "Emerald",
    rose: "Rose",
    amber: "Amber",
    cyan: "Cyan",
    violet: "Violet",
  };
  const ACCENT_COLORS_MAP = {
    indigo: "#5a67e8",
    emerald: "#059669",
    rose: "#e11d48",
    amber: "#d97706",
    cyan: "#0891b2",
    violet: "#7c3aed",
  };

  return (
    <div style={{ padding: "1.5rem", maxWidth: 600 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 1.5rem" }}>
        ⚙️ Settings
      </h2>

      <div style={{ ...card, marginBottom: "1rem" }}>
        <p
          style={{
            fontSize: 15,
            fontWeight: 700,
            margin: "0 0 1rem",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
          <User size={16} /> Profile
        </p>
        <p style={lbl}>Your first name</p>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            onKeyDown={(e) => e.key === "Enter" && saveName()}
          />
          <button onClick={saveName} style={btn()}>
            Save
          </button>
        </div>
        {userName && (
          <p style={{ fontSize: 12, color: "#059669", margin: "6px 0 0" }}>
            ✓ Greeting: "Good morning, {userName}!"
          </p>
        )}
      </div>

      <div style={{ ...card, marginBottom: "1rem" }}>
        <p
          style={{
            fontSize: 15,
            fontWeight: 700,
            margin: "0 0 1rem",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
          <Palette size={16} /> Theme
        </p>
        <p style={lbl}>Background mode</p>
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: "1rem",
          }}>
          {Object.entries(THEME_LABELS).map(([k, l]) => (
            <button
              key={k}
              onClick={() => setThemeMode(k)}
              style={{
                ...ghost,
                background: themeMode === k ? "var(--acc)" : "transparent",
                color: themeMode === k ? "white" : "var(--text)",
                border: themeMode === k ? "none" : "1px solid var(--bdr)",
                fontWeight: themeMode === k ? 700 : 400,
              }}>
              {l}
            </button>
          ))}
        </div>
        <p style={lbl}>Accent color</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {Object.entries(ACCENT_LABELS).map(([k, l]) => (
            <button
              key={k}
              onClick={() => setAccentColor(k)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 10,
                border:
                  accentColor === k
                    ? "2px solid var(--text)"
                    : "1px solid var(--bdr)",
                background: "transparent",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: accentColor === k ? 700 : 400,
                color: "var(--text)",
              }}>
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: ACCENT_COLORS_MAP[k],
                  display: "inline-block",
                }}
              />
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ ...card, marginBottom: "1rem" }}>
        <p
          style={{
            fontSize: 15,
            fontWeight: 700,
            margin: "0 0 1rem",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
          <Bell size={16} /> Notifications
        </p>
        <p style={{ fontSize: 13, color: "var(--sub)", margin: "0 0 12px" }}>
          Enable browser notifications to get daily productivity reminders and
          task due date alerts.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={notifEnabled ? () => setNotifEnabled(false) : requestNotif}
            style={btn(notifEnabled ? "#059669" : "var(--acc)")}>
            {notifEnabled ? (
              <>
                <Check size={14} /> Notifications enabled
              </>
            ) : (
              <>
                <Bell size={14} /> Enable notifications
              </>
            )}
          </button>
          {notifEnabled && (
            <button
              onClick={() => {
                new Notification("FlowDesk 🔔", {
                  body: "Test notification from FlowDesk!",
                });
              }}
              style={ghost}>
              Test
            </button>
          )}
        </div>
      </div>

      <div style={{ ...card }}>
        <p style={{ fontSize: 15, fontWeight: 700, margin: "0 0 1rem" }}>
          📱 About FlowDesk
        </p>
        <p
          style={{
            fontSize: 13,
            color: "var(--sub)",
            margin: 0,
            lineHeight: 1.7,
          }}>
          FlowDesk is your all-in-one AI-powered productivity system. All data
          is stored locally on your device and never sent to any server.
          <br />
          <br />
          <strong>Version:</strong> 2.0 · <strong>Features:</strong> Dashboard,
          AI Task Manager, Voice Copilot, To-Do, Daily Planner, Scheduler,
          Timetable, Habits, Mind Map, Deep Work Studio, Gratitude Journal.
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════
const INIT_TASKS = [
  {
    id: 1,
    title: "Submit quarterly report",
    desc: "Finance team needs Q3 numbers",
    due: "2026-05-27",
    priority: "high",
    quadrant: null,
    done: false,
    reason: null,
  },
  {
    id: 2,
    title: "Fix critical production bug",
    desc: "Users reporting 500 errors",
    due: "2026-05-25",
    priority: "high",
    quadrant: null,
    done: false,
    reason: null,
  },
  {
    id: 3,
    title: "Prepare team meeting slides",
    desc: "Monday standup",
    due: "2026-05-26",
    priority: "medium",
    quadrant: null,
    done: false,
    reason: null,
  },
  {
    id: 4,
    title: "Update LinkedIn profile",
    desc: "Add recent projects",
    due: "2026-06-10",
    priority: "low",
    quadrant: null,
    done: false,
    reason: null,
  },
];
const INIT_TODOS = [
  { id: 1, text: "Review pull requests", done: false, priority: "high" },
  { id: 2, text: "Reply to client emails", done: false, priority: "medium" },
  { id: 3, text: "Grocery shopping", done: true, priority: "low" },
];
const INIT_HABITS = [
  {
    id: 1,
    name: "Morning exercise",
    icon: "🏃",
    type: "positive",
    completedDates: [TODAY],
    count: {},
  },
  {
    id: 2,
    name: "Read 30 mins",
    icon: "📖",
    type: "positive",
    completedDates: [TODAY],
    count: {},
  },
  {
    id: 3,
    name: "Drink 8 glasses water",
    icon: "💧",
    type: "positive",
    completedDates: [],
    count: {},
  },
  {
    id: 4,
    name: "Scrolled social media too long",
    icon: "📵",
    type: "negative",
    completedDates: [],
    count: { [TODAY]: 2 },
  },
];

export default function App() {
  const [view, setView] = useLS("fd-view", "dashboard");
  const [userName, setUserName] = useLS("fd-username", "");
  const [themeMode, setThemeMode] = useLS("fd-theme-mode", "light");
  const [accentColor, setAccentColor] = useLS("fd-accent", "indigo");
  const [notifEnabled, setNotifEnabled] = useLS("fd-notif", false);
  const [tasks, setTasks] = useLS("fd-tasks", INIT_TASKS);
  const [todos, setTodos] = useLS("fd-todos", INIT_TODOS);
  const [habits, setHabits] = useLS("fd-habits", INIT_HABITS);
  const [mobile, setMobile] = useState(false);

  useTheme(themeMode, accentColor);
  useEffect(() => {
    const c = () => setMobile(window.innerWidth < 720);
    c();
    window.addEventListener("resize", c);
    return () => window.removeEventListener("resize", c);
  }, []);

  const NAV = [
    { id: "dashboard", label: "Home", icon: "🏠" },
    { id: "tasks", label: "Tasks", icon: "🧠" },
    { id: "todo", label: "To-Do", icon: "✅" },
    { id: "planner", label: "Planner", icon: "🕐" },
    { id: "scheduler", label: "Schedule", icon: "📅" },
    { id: "timetable", label: "Timetable", icon: "📊" },
    { id: "habits", label: "Habits", icon: "🔄" },
    { id: "mindmap", label: "MindMap", icon: "🗺️" },
    { id: "deepwork", label: "Deep Work", icon: "🔬" },
    { id: "gratitude", label: "Gratitude", icon: "🙏" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div
      className="fd"
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "var(--bg)",
        color: "var(--text)",
      }}>
      {/* Sidebar (desktop) */}
      {!mobile && (
        <nav
          style={{
            width: 216,
            background: "var(--card)",
            borderRight: "1px solid var(--bdr)",
            display: "flex",
            flexDirection: "column",
            padding: "1.25rem 0.75rem",
            flexShrink: 0,
            overflowY: "auto",
          }}>
          <div style={{ padding: "0 6px", marginBottom: "1.5rem" }}>
            <h1
              style={{
                fontSize: 18,
                fontWeight: 800,
                margin: 0,
                letterSpacing: "-0.5px",
                color: "var(--acc)",
              }}>
              FlowDesk
            </h1>
            <p style={{ fontSize: 11, color: "var(--sub)", margin: "3px 0 0" }}>
              {userName ? `Hello, ${userName}!` : "Your productivity suite"}
            </p>
          </div>
          {NAV.map(({ id, label, icon }) => {
            const active = view === id;
            return (
              <button
                key={id}
                onClick={() => setView(id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  padding: "9px 10px",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  width: "100%",
                  background: active ? "var(--acc-bg)" : "transparent",
                  color: active ? "var(--acc)" : "var(--sub)",
                  fontSize: 13,
                  fontWeight: active ? 700 : 400,
                  textAlign: "left",
                  marginBottom: 2,
                  fontFamily: "inherit",
                  borderLeft: `2px solid ${active ? "var(--acc)" : "transparent"}`,
                }}>
                <span style={{ fontSize: 16 }}>{icon}</span>
                {label}
              </button>
            );
          })}
          <div
            style={{
              marginTop: "auto",
              padding: "12px 10px",
              background: "var(--sec)",
              borderRadius: 10,
              border: "1px solid var(--bdr)",
            }}>
            <p style={{ fontSize: 11, color: "var(--sub)", margin: "0 0 3px" }}>
              Tasks completed
            </p>
            <p
              style={{
                fontSize: 22,
                fontWeight: 700,
                margin: 0,
                color: "var(--acc)",
              }}>
              {tasks.filter((t) => t.done).length}/{tasks.length}
            </p>
            <div
              style={{
                marginTop: 6,
                height: 4,
                background: "var(--bdr)",
                borderRadius: 2,
                overflow: "hidden",
              }}>
              <div
                style={{
                  height: "100%",
                  width: `${tasks.length > 0 ? (tasks.filter((t) => t.done).length / tasks.length) * 100 : 0}%`,
                  background: "var(--acc)",
                  borderRadius: 2,
                  transition: "width .3s",
                }}
              />
            </div>
          </div>
        </nav>
      )}

      {/* Main content */}
      <main
        style={{ flex: 1, overflowY: "auto", paddingBottom: mobile ? 72 : 0 }}>
        {view === "dashboard" && (
          <Dashboard
            tasks={tasks}
            todos={todos}
            habits={habits}
            userName={userName}
            setView={setView}
            setTodos={setTodos}
          />
        )}
        {view === "tasks" && <TaskManager tasks={tasks} setTasks={setTasks} />}
        {view === "todo" && <TodoList todos={todos} setTodos={setTodos} />}
        {view === "planner" && <DailyPlanner />}
        {view === "scheduler" && <Scheduler />}
        {view === "timetable" && <Timetable />}
        {view === "habits" && (
          <HabitTracker habits={habits} setHabits={setHabits} />
        )}
        {view === "mindmap" && <MindMap />}
        {view === "deepwork" && <DeepWork />}
        {view === "gratitude" && <GratitudeJournal />}
        {view === "settings" && (
          <Settings
            userName={userName}
            setUserName={setUserName}
            themeMode={themeMode}
            setThemeMode={setThemeMode}
            accentColor={accentColor}
            setAccentColor={setAccentColor}
            notifEnabled={notifEnabled}
            setNotifEnabled={setNotifEnabled}
          />
        )}
      </main>

      {/* Bottom nav (mobile) */}
      {mobile && (
        <nav
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "var(--card)",
            borderTop: "1px solid var(--bdr)",
            display: "flex",
            padding: "6px 0 4px",
            zIndex: 100,
            overflowX: "auto",
          }}>
          {NAV.map(({ id, label, icon }) => {
            const active = view === id;
            return (
              <button
                key={id}
                onClick={() => setView(id)}
                style={{
                  flex: "0 0 auto",
                  minWidth: 52,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: active ? "var(--acc)" : "var(--sub)",
                  fontFamily: "inherit",
                  padding: "4px 6px",
                }}>
                <span style={{ fontSize: 18 }}>{icon}</span>
                <span style={{ fontSize: 8, fontWeight: active ? 700 : 400 }}>
                  {label}
                </span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
