import { useState } from "react";
import { useData } from "../context/DataContext";

function English() {
  const { data, ENGLISH_SKILLS, SKILL_LABELS, logEnglish, deleteEnglishLog } = useData();
  const [skill, setSkill] = useState("listening");
  const [note, setNote] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    logEnglish(skill, note.trim());
    setNote("");
  }

  const sortedLogs = [...data.englishLogs].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Английский</h2>
      <p className="text-slate-500 mb-6">Отметь, чем занимался сегодня</p>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-5 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {ENGLISH_SKILLS.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => setSkill(s)}
              className={`py-2 rounded-lg text-sm font-medium transition
                ${skill === s ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              {SKILL_LABELS[s]}
            </button>
          ))}
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Что именно делал? (необязательно)"
          className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
          rows={2}
        />

        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
        >
          Записать
        </button>
      </form>

      <h3 className="font-semibold text-slate-700 mb-2">История</h3>
      {sortedLogs.length === 0 ? (
        <p className="text-sm text-slate-400">Пока нет записей</p>
      ) : (
        <div className="flex flex-col gap-2">
          {sortedLogs.map((log) => (
            <div
              key={log.id}
              className="flex justify-between items-start bg-white border border-slate-200 rounded-xl px-4 py-3"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                    {SKILL_LABELS[log.skill]}
                  </span>
                  <span className="text-xs text-slate-400">{log.date}</span>
                </div>
                {log.note && <p className="text-sm text-slate-600">{log.note}</p>}
              </div>
              <button
                onClick={() => deleteEnglishLog(log.id)}
                className="text-slate-300 hover:text-rose-500 text-sm shrink-0"
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

export default English;