import { useMemo, useState } from "react";
import { useData } from "../context/DataContext";

const DAY_LABELS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function toKey(d) {
  return d.toISOString().slice(0, 10);
}

// Понедельник — воскресенье текущей недели
function getCurrentWeek() {
  const now = new Date();
  const dayIndex = (now.getDay() + 6) % 7; // 0 = понедельник
  const monday = new Date(now);
  monday.setDate(now.getDate() - dayIndex);
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function Schedule() {
  const { data, addHabit, deleteHabit, renameHabit, cycleHabitMark } = useData();
  const [newHabitText, setNewHabitText] = useState("");

  const week = useMemo(() => getCurrentWeek(), []);
  const todayKey = toKey(new Date());

  function handleAdd(e) {
    e.preventDefault();
    if (!newHabitText.trim()) return;
    addHabit(newHabitText.trim());
    setNewHabitText("");
  }

  function progressFor(habit) {
    const values = week.map((d) => habit.marks[toKey(d)]);
    const done = values.filter((v) => v === true).length;
    const marked = values.filter((v) => v !== undefined).length;
    return { done, marked, total: 7 };
  }

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Расписание</h2>
      <p className="text-slate-500 mb-6">
        Впиши, что делаешь каждый день, и отмечай: клик по клетке — ✓ сделано, ещё клик — ✗ не сделано
      </p>

      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newHabitText}
          onChange={(e) => setNewHabitText(e.target.value)}
          placeholder="Например: Listening 20 минут"
          className="flex-1 px-3 py-2 rounded-lg border border-rose-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-rose-400"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-rose-500 text-white font-medium hover:bg-rose-600 shrink-0"
        >
          Добавить
        </button>
      </form>

      {data.habits.length === 0 ? (
        <p className="text-sm text-slate-400">Пока нет ни одной задачи — добавь первую выше</p>
      ) : (
        <div className="bg-white/80 backdrop-blur-sm border border-rose-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm min-w-[640px]">
              <thead>
                <tr>
                  <th className="text-left font-semibold text-slate-600 bg-rose-50 px-4 py-3 sticky left-0 z-10 min-w-[180px]">
                    Задача
                  </th>
                  {week.map((d, i) => {
                    const isToday = toKey(d) === todayKey;
                    return (
                      <th
                        key={i}
                        className={`font-semibold px-2 py-3 text-center min-w-[56px]
                          ${isToday ? "bg-rose-500 text-white" : "bg-rose-50 text-slate-600"}`}
                      >
                        <div>{DAY_LABELS[i]}</div>
                        <div className={`text-[11px] font-normal ${isToday ? "text-rose-100" : "text-slate-400"}`}>
                          {d.getDate()}.{String(d.getMonth() + 1).padStart(2, "0")}
                        </div>
                      </th>
                    );
                  })}
                  <th className="font-semibold text-slate-600 bg-rose-50 px-4 py-3 min-w-[140px]">Прогресс</th>
                  <th className="bg-rose-50 px-2 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {data.habits.map((habit, rowIdx) => {
                  const { done, marked, total } = progressFor(habit);
                  return (
                    <tr key={habit.id} className={rowIdx % 2 === 0 ? "bg-white/60" : "bg-rose-50/30"}>
                      <td className="px-4 py-2.5 sticky left-0 z-10 bg-inherit">
                        <input
                          type="text"
                          value={habit.text}
                          onChange={(e) => renameHabit(habit.id, e.target.value)}
                          className="w-full bg-transparent text-slate-700 font-medium focus:outline-none focus:bg-white/80 rounded px-1 -mx-1"
                        />
                      </td>

                      {week.map((d, i) => {
                        const key = toKey(d);
                        const mark = habit.marks[key];
                        return (
                          <td key={i} className="px-2 py-2.5 text-center">
                            <button
                              onClick={() => cycleHabitMark(habit.id, key)}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center text-base font-bold mx-auto transition
                                ${mark === true
                                  ? "bg-emerald-500 text-white"
                                  : mark === false
                                  ? "bg-rose-400 text-white"
                                  : "bg-slate-100 text-slate-300 hover:bg-slate-200"}`}
                            >
                              {mark === true ? "✓" : mark === false ? "✕" : ""}
                            </button>
                          </td>
                        );
                      })}

                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full bg-rose-50 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-rose-500"
                              style={{ width: `${(done / total) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-400 shrink-0">{done}/{total}</span>
                        </div>
                        {marked === 0 && (
                          <p className="text-[11px] text-slate-300 mt-0.5">пока нет отметок</p>
                        )}
                      </td>

                      <td className="px-2 py-2.5">
                        <button
                          onClick={() => deleteHabit(habit.id)}
                          className="text-slate-300 hover:text-rose-500 text-sm"
                          title="Удалить задачу"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Schedule;