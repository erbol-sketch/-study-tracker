import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";

const DataContext = createContext(null);

const ENGLISH_SKILLS = ["listening", "reading", "writing", "speaking"];

const SKILL_LABELS = {
  listening: "Listening",
  reading: "Reading",
  writing: "Writing",
  speaking: "Speaking",
};

function emptyData() {
  return {
    englishLogs: [],   // { id, date, skill, note }
    subjects: [
      { id: "it", name: "IT", entries: [] }, // entries: { id, date, text }
    ],
    tasks: [],         // { id, date, text, done }
    vocab: [],         // { id, word, translation, example }
  };
}

function storageKey(username) {
  return `study-tracker:data:${username}`;
}

export function DataProvider({ children }) {
  const { currentUser } = useAuth();
  const [data, setData] = useState(emptyData());
  const isLoaded = useRef(false); // защита от сохранения раньше, чем данные реально загрузились

  // При смене пользователя — загружаем его данные из localStorage
  useEffect(() => {
    isLoaded.current = false;

    if (!currentUser) {
      setData(emptyData());
      return;
    }
    try {
      const raw = localStorage.getItem(storageKey(currentUser));
      setData(raw ? JSON.parse(raw) : emptyData());
    } catch {
      setData(emptyData());
    }
    isLoaded.current = true;
  }, [currentUser]);

  // При любом изменении данных — сохраняем их обратно в localStorage
  // (но только после того, как загрузка для текущего пользователя уже завершена)
  useEffect(() => {
    if (!currentUser || !isLoaded.current) return;
    localStorage.setItem(storageKey(currentUser), JSON.stringify(data));
  }, [data, currentUser]);

  // ---------- English ----------

  function logEnglish(skill, note) {
    setData((prev) => ({
      ...prev,
      englishLogs: [
        ...prev.englishLogs,
        { id: crypto.randomUUID(), date: new Date().toISOString().slice(0, 10), skill, note },
      ],
    }));
  }

  function deleteEnglishLog(id) {
    setData((prev) => ({
      ...prev,
      englishLogs: prev.englishLogs.filter((l) => l.id !== id),
    }));
  }

  // ---------- Subjects (IT, History, ...) ----------

  function addSubject(name) {
    setData((prev) => ({
      ...prev,
      subjects: [...prev.subjects, { id: crypto.randomUUID(), name, entries: [] }],
    }));
  }

  function addSubjectEntry(subjectId, text) {
    setData((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) =>
        s.id === subjectId
          ? {
              ...s,
              entries: [
                ...s.entries,
                { id: crypto.randomUUID(), date: new Date().toISOString().slice(0, 10), text },
              ],
            }
          : s
      ),
    }));
  }

  function deleteSubjectEntry(subjectId, entryId) {
    setData((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) =>
        s.id === subjectId
          ? { ...s, entries: s.entries.filter((e) => e.id !== entryId) }
          : s
      ),
    }));
  }

  // ---------- Tasks / schedule ----------

  function addTask(text, date) {
    setData((prev) => ({
      ...prev,
      tasks: [
        ...prev.tasks,
        { id: crypto.randomUUID(), text, date: date || new Date().toISOString().slice(0, 10), done: false },
      ],
    }));
  }

  function toggleTask(id) {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    }));
  }

  function deleteTask(id) {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
    }));
  }

  // ---------- Vocabulary ----------

  function addWord(word, translation, example) {
    setData((prev) => ({
      ...prev,
      vocab: [...prev.vocab, { id: crypto.randomUUID(), word, translation, example }],
    }));
  }

  function deleteWord(id) {
    setData((prev) => ({
      ...prev,
      vocab: prev.vocab.filter((w) => w.id !== id),
    }));
  }

  const value = {
    data,
    ENGLISH_SKILLS,
    SKILL_LABELS,
    logEnglish,
    deleteEnglishLog,
    addSubject,
    addSubjectEntry,
    deleteSubjectEntry,
    addTask,
    toggleTask,
    deleteTask,
    addWord,
    deleteWord,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData должен использоваться внутри DataProvider");
  return ctx;
}