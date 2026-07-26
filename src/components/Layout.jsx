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
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Десктоп: узкая панель с иконками, при наведении раскрывается (как в Instagram) */}
      <aside
        className="hidden md:flex group w-20 hover:w-60 shrink-0 flex-col
                   bg-white/80 backdrop-blur-sm border-r border-rose-100
                   transition-all duration-300 ease-in-out overflow-hidden"
      >
        <div className="mb-8 px-5 pt-4 h-12 flex items-center">
          <span className="text-xl shrink-0">🌸</span>
          <div className="ml-3 min-w-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-75">
            <h1 className="text-base font-bold text-slate-800 whitespace-nowrap">Study Tracker</h1>
            <p className="text-xs text-slate-400 whitespace-nowrap">{currentUser}</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 flex-1 px-3">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              title={tab.label}
              className={`flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-colors text-left
                ${activeTab === tab.id
                  ? "bg-rose-50 text-rose-600"
                  : "text-slate-600 hover:bg-rose-50/60"}`}
            >
              <span className="text-lg shrink-0 w-5 text-center">{tab.icon}</span>
              <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-75">
                {tab.label}
              </span>
            </button>
          ))}
        </nav>

        <button
          onClick={logout}
          title="Выйти"
          className="flex items-center gap-3 mx-3 mb-4 px-2.5 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-rose-50/60 text-left"
        >
          <span className="text-lg shrink-0 w-5 text-center">🚪</span>
          <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-75">
            Выйти
          </span>
        </button>
      </aside>

      {/* Мобильная шапка: заголовок + выход. Видна только на мобильном */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-sm border-b border-rose-100">
        <div>
          <h1 className="text-base font-bold text-slate-800">Study Tracker</h1>
          <p className="text-xs text-slate-400">{currentUser}</p>
        </div>
        <button
          onClick={logout}
          className="text-sm font-medium text-slate-500 px-2 py-1"
        >
          🚪 Выйти
        </button>
      </header>

      {/* Контент. Снизу оставлен отступ на мобильном под нижнюю панель вкладок */}
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto">{children}</main>

      {/* Мобильная нижняя панель вкладок. Скрыта на десктопе */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-white/90 backdrop-blur-sm border-t border-rose-100
                   flex justify-around items-stretch pb-[env(safe-area-inset-bottom)]"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium transition
              ${activeTab === tab.id ? "text-rose-600" : "text-slate-400"}`}
          >
            <span className="text-lg leading-none">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default Layout;