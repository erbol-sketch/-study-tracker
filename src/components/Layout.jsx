import { useAuth } from "../context/AuthContext";

const TABS = [
  { id: "overview", label: "Обзор", icon: "📊" },
  { id: "schedule", label: "Расписание", icon: "📅" },
  { id: "english", label: "Английский", icon: "🗣️" },
  { id: "subjects", label: "Предметы", icon: "📚" },
  { id: "vocab", label: "Словарь", icon: "🔤" },
];

function Layout({ activeTab, setActiveTab, children }) {
  const { currentUser, logout } = useAuth();

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 bg-white/80 backdrop-blur-sm border-r border-rose-100 flex flex-col p-4">
        <div className="mb-8 px-2">
          <h1 className="text-lg font-bold text-slate-800">Study Tracker</h1>
          <p className="text-xs text-slate-400 mt-0.5">{currentUser}</p>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition text-left
                ${activeTab === tab.id
                  ? "bg-rose-50 text-rose-600"
                  : "text-slate-600 hover:bg-rose-50/60"}`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <button
          onClick={logout}
          className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-rose-50/60 text-left"
        >
          🚪 Выйти
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}

export default Layout;