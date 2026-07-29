import { useState } from "react";
import { useData } from "../context/DataContext";

function Subjects() {
  const { data, addSubject, deleteSubject, renameSubject } = useData();
  const [openSubjectId, setOpenSubjectId] = useState(null);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");

  const openSubject = data.subjects.find((s) => s.id === openSubjectId);

  function handleAddSubject(e) {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    addSubject(newSubjectName.trim());
    setNewSubjectName("");
    setShowAddSubject(false);
  }

  if (openSubject) {
    return <SubjectView subject={openSubject} onBack={() => setOpenSubjectId(null)} />;
  }

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Предметы</h2>
      <p className="text-slate-500 mb-6">Папки по темам — открой нужную и пиши туда, ничего не перепутается</p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {data.subjects.map((s) => (
          <button
            key={s.id}
            onClick={() => setOpenSubjectId(s.id)}
            className="text-left bg-white/80 backdrop-blur-sm border border-rose-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-rose-300 transition group"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">📁</span>
              {s.entries.length > 0 && (
                <span className="text-xs font-medium text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                  {s.entries.length}
                </span>
              )}
            </div>
            <p className="font-semibold text-slate-800 group-hover:text-rose-600 transition">{s.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {s.entries.length === 0 ? "пусто" : `${s.entries.length} записей`}
            </p>
          </button>
        ))}

        <button
          onClick={() => setShowAddSubject((v) => !v)}
          className="flex flex-col items-center justify-center gap-1 border-2 border-dashed border-rose-200 rounded-2xl p-5 text-rose-400 hover:bg-rose-50 transition min-h-[112px]"
        >
          <span className="text-2xl">+</span>
          <span className="text-sm font-medium">Новая папка</span>
        </button>
      </div>

      {showAddSubject && (
        <form onSubmit={handleAddSubject} className="flex gap-2">
          <input
            type="text"
            autoFocus
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
    </div>
  );
}

function SubjectView({ subject, onBack }) {
  const { addSubjectEntry, deleteSubjectEntry, editSubjectEntry, deleteSubject, renameSubject } = useData();
  const [entryText, setEntryText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(subject.name);

  function handleAddEntry(e) {
    e.preventDefault();
    if (!entryText.trim()) return;
    addSubjectEntry(subject.id, entryText.trim());
    setEntryText("");
    // поле остаётся открытым и пустым — можно сразу писать следующую запись
  }

  function startEdit(entry) {
    setEditingId(entry.id);
    setEditDraft(entry.text);
  }

  function saveEdit(entryId) {
    if (editDraft.trim()) {
      editSubjectEntry(subject.id, entryId, editDraft.trim());
    }
    setEditingId(null);
  }

  function handleDeleteSubject() {
    if (confirm(`Удалить папку «${subject.name}» вместе со всеми записями (${subject.entries.length})?`)) {
      deleteSubject(subject.id);
      onBack();
    }
  }

  return (
    <div className="max-w-2xl">
      <button
        onClick={onBack}
        className="text-sm text-slate-500 hover:text-rose-600 mb-4 inline-flex items-center gap-1"
      >
        ← Все папки
      </button>

      <div className="flex items-start justify-between gap-3 mb-1">
        {editingName ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (nameDraft.trim()) renameSubject(subject.id, nameDraft.trim());
              setEditingName(false);
            }}
            className="flex-1"
          >
            <input
              autoFocus
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onBlur={() => {
                if (nameDraft.trim()) renameSubject(subject.id, nameDraft.trim());
                setEditingName(false);
              }}
              className="text-2xl font-bold text-slate-800 bg-white/80 border border-rose-200 rounded-lg px-2 py-0.5 w-full focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </form>
        ) : (
          <h2
            onClick={() => setEditingName(true)}
            className="text-2xl font-bold text-slate-800 cursor-text"
            title="Нажми, чтобы переименовать"
          >
            {subject.name}
          </h2>
        )}
        <button onClick={handleDeleteSubject} className="text-xs text-slate-300 hover:text-rose-500 shrink-0 mt-2">
          Удалить папку
        </button>
      </div>
      <p className="text-slate-500 mb-6">Записывай, что понял — можно добавлять сколько угодно записей в любое время</p>

      <form onSubmit={handleAddEntry} className="bg-white/80 backdrop-blur-sm border border-rose-100 rounded-2xl p-5 mb-6 shadow-sm">
        <label className="block text-sm font-medium text-slate-600 mb-2">
          Что понял сегодня по теме «{subject.name}»?
        </label>
        <textarea
          value={entryText}
          onChange={(e) => setEntryText(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-rose-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-rose-400 mb-3"
          placeholder="Опиши своими словами — это помогает закрепить материал"
        />
        <button type="submit" className="px-4 py-2 rounded-lg bg-rose-500 text-white font-medium hover:bg-rose-600">
          Сохранить запись
        </button>
      </form>

      <h3 className="font-semibold text-slate-700 mb-2">
        Записи {subject.entries.length > 0 && <span className="text-slate-400 font-normal">({subject.entries.length})</span>}
      </h3>

      {subject.entries.length === 0 ? (
        <p className="text-sm text-slate-400">Пока нет записей — добавь первую выше</p>
      ) : (
        <div className="flex flex-col gap-2">
          {[...subject.entries].reverse().map((entry) => (
            <div
              key={entry.id}
              className="bg-white/80 backdrop-blur-sm border border-rose-100 rounded-xl px-4 py-3"
            >
              {editingId === entry.id ? (
                <div>
                  <textarea
                    autoFocus
                    value={editDraft}
                    onChange={(e) => setEditDraft(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-rose-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-rose-400 mb-2 text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(entry.id)}
                      className="px-3 py-1.5 rounded-lg bg-rose-500 text-white text-xs font-medium hover:bg-rose-600"
                    >
                      Сохранить
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-500 text-xs font-medium hover:bg-slate-200"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400 mb-1">{entry.date}</p>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{entry.text}</p>
                  </div>
                  <div className="flex gap-3 shrink-0">
                    <button
                      onClick={() => startEdit(entry)}
                      className="text-slate-300 hover:text-rose-500 text-sm"
                    >
                      Изменить
                    </button>
                    <button
                      onClick={() => deleteSubjectEntry(subject.id, entry.id)}
                      className="text-slate-300 hover:text-rose-500 text-sm"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Subjects;