import { useState } from "react";
import { useData } from "../context/DataContext";

function Schedule() {
  const { data, addTask, toggleTask, deleteTask } = useData();
  const [text, setText] = useState("");

  const today = new Date().toISOString().slice(0, 10);
  const todayTasks = data.tasks.filter((t) => t.date === today);
  const otherTasks = data.tasks.filter((t) => t.date !== today);

  function handleAdd(e) {
    e.preventDefault();
    if (!text.trim()) return;
    addTask(text.trim(), today);
    setText("");
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Расписание</h2>
      <p className="text-slate-500 mb-6">Что нужно сделать сегодня</p>

      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Например: Сделать Listening 20 минут"
          className="flex-1 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
        >
          Добавить
        </button>
      </form>

      <TaskList title="Сегодня" tasks={todayTasks} toggleTask={toggleTask} deleteTask={deleteTask} />

      {otherTasks.length > 0 && (
        <TaskList title="Другие дни" tasks={otherTasks} toggleTask={toggleTask} deleteTask={deleteTask} />
      )}
    </div>
  );
}

function TaskList({ title, tasks, toggleTask, deleteTask }) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold text-slate-700 mb-2">{title}</h3>
      {tasks.length === 0 ? (
        <p className="text-sm text-slate-400">Пока пусто</p>
      ) : (
        <div className="flex flex-col gap-2">
          {tasks.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3"
            >
              <button
                onClick={() => toggleTask(t.id)}
                className={`w-6 h-6 flex items-center justify-center rounded-md text-sm font-bold shrink-0
                  ${t.done ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"}`}
              >
                {t.done ? "✓" : "✕"}
              </button>

              <div className="flex-1">
                <p className={`text-sm ${t.done ? "text-slate-400 line-through" : "text-slate-700"}`}>
                  {t.text}
                </p>
                <p className="text-xs text-slate-400">{t.date}</p>
              </div>

              <button
                onClick={() => deleteTask(t.id)}
                className="text-slate-300 hover:text-rose-500 text-sm"
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Schedule;