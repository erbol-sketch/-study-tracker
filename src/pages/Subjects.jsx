import { useState } from "react";
import { useData } from "../context/DataContext";

function Subjects() {
  const { data, addSubject, addSubjectEntry, deleteSubjectEntry } = useData();
  const [activeSubjectId, setActiveSubjectId] = useState(data.subjects[0]?.id ?? null);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [entryText, setEntryText] = useState("");
  const [showAddSubject, setShowAddSubject] = useState(false);

  const activeSubject = data.subjects.find((s) => s.id === activeSubjectId) ?? data.subjects[0];

  function handleAddSubject(e) {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    addSubject(newSubjectName.trim());
    setNewSubjectName("");
    setShowAddSubject(false);
  }

  function handleAddEntry(e) {
    e.preventDefault();
    if (!entryText.trim() || !activeSubject) return;
    addSubjectEntry(activeSubject.id, entryText.trim());
    setEntryText("");
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Предметы</h2>
      <p className="text-slate-500 mb-6">Записывай, что понял по каждой теме — так закрепляется лучше</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {data.subjects.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSubjectId(s.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition
              ${activeSubject?.id === s.id ? "bg-rose-500 text-white shadow-sm shadow-rose-200" : "bg-white/80 backdrop-blur-sm border border-rose-100 text-slate-600 hover:bg-rose-50"}`}
          >
            {s.name}
          </button>
        ))}

        <button
          onClick={() => setShowAddSubject((v) => !v)}
          className="px-4 py-2 rounded-full text-sm font-medium border border-dashed border-rose-200 text-rose-400 hover:bg-rose-50"
        >
          + Добавить предмет
        </button>
      </div>

      {showAddSubject && (
        <form onSubmit={handleAddSubject} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            placeholder="Например: История"
            className="flex-1 px-3 py-2 rounded-lg border border-rose-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
          <button type="submit" className="px-4 py-2 rounded-lg bg-rose-500 text-white font-medium hover:bg-rose-600">
            Создать
          </button>
        </form>
      )}

      {activeSubject && (
        <>
          <form onSubmit={handleAddEntry} className="bg-white/80 backdrop-blur-sm border border-rose-100 rounded-2xl p-5 mb-6 shadow-sm">
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Что понял сегодня по теме «{activeSubject.name}»?
            </label>
            <textarea
              value={entryText}
              onChange={(e) => setEntryText(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-rose-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-rose-400 mb-3"
              placeholder="Опиши своими словами — это помогает закрепить материал"
            />
            <button type="submit" className="px-4 py-2 rounded-lg bg-rose-500 text-white font-medium hover:bg-rose-600">
              Сохранить
            </button>
          </form>

          <h3 className="font-semibold text-slate-700 mb-2">Записи</h3>
          {activeSubject.entries.length === 0 ? (
            <p className="text-sm text-slate-400">Пока нет записей</p>
          ) : (
            <div className="flex flex-col gap-2">
              {[...activeSubject.entries].reverse().map((entry) => (
                <div
                  key={entry.id}
                  className="flex justify-between items-start bg-white/80 backdrop-blur-sm border border-rose-100 rounded-xl px-4 py-3 shadow-sm"
                >
                  <div>
                    <p className="text-xs text-slate-400 mb-1">{entry.date}</p>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{entry.text}</p>
                  </div>
                  <button
                    onClick={() => deleteSubjectEntry(activeSubject.id, entry.id)}
                    className="text-slate-300 hover:text-rose-500 text-sm shrink-0"
                  >
                    Удалить
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Subjects;