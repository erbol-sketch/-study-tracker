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
    tasks: [],         // { id, date, text, done } — старый однодневный список
    habits: [],        // { id, text, marks: { "2026-07-20": true|false, ... } }
    vocabDecks: [
      {
        id: "general",
        name: "Общие слова",
        words: [], // { id, word, translation, example }
      },
    ],
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
      const parsed = raw ? JSON.parse(raw) : emptyData();

      // миграция для тех, у кого данные сохранены в старом формате
      if (!parsed.habits) parsed.habits = [];
      if (!parsed.vocabDecks) {
        // если раньше было плоское поле vocab — переносим все слова в одну колоду
        const oldWords = Array.isArray(parsed.vocab) ? parsed.vocab : [];
        parsed.vocabDecks = [{ id: "general", name: "Общие слова", words: oldWords }];
        delete parsed.vocab;
      }

      setData(parsed);
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

  // ---------- Tasks (старый однодневный список, оставлен на всякий случай) ----------

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

  // ---------- Habits (недельный трекер: задача x дни недели) ----------

  function addHabit(text) {
    setData((prev) => ({
      ...prev,
      habits: [...prev.habits, { id: crypto.randomUUID(), text, marks: {} }],
    }));
  }

  function deleteHabit(id) {
    setData((prev) => ({
      ...prev,
      habits: prev.habits.filter((h) => h.id !== id),
    }));
  }

  function renameHabit(id, text) {
    setData((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => (h.id === id ? { ...h, text } : h)),
    }));
  }

  function cycleHabitMark(habitId, dateKey) {
    setData((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => {
        if (h.id !== habitId) return h;
        const current = h.marks[dateKey];
        const marks = { ...h.marks };
        if (current === undefined) marks[dateKey] = true;
        else if (current === true) marks[dateKey] = false;
        else delete marks[dateKey];
        return { ...h, marks };
      }),
    }));
  }

  // ---------- Vocabulary: колоды (файлы) слов + карточки внутри ----------

  function addVocabDeck(name) {
    const id = crypto.randomUUID();
    setData((prev) => ({
      ...prev,
      vocabDecks: [...prev.vocabDecks, { id, name, words: [] }],
    }));
    return id;
  }

  function renameVocabDeck(deckId, name) {
    setData((prev) => ({
      ...prev,
      vocabDecks: prev.vocabDecks.map((d) => (d.id === deckId ? { ...d, name } : d)),
    }));
  }

  function deleteVocabDeck(deckId) {
    setData((prev) => ({
      ...prev,
      vocabDecks: prev.vocabDecks.filter((d) => d.id !== deckId),
    }));
  }

  function addWord(deckId, word, translation, example) {
    setData((prev) => ({
      ...prev,
      vocabDecks: prev.vocabDecks.map((d) =>
        d.id === deckId
          ? {
              ...d,
              words: [...d.words, { id: crypto.randomUUID(), word, translation, example }],
            }
          : d
      ),
    }));
  }

  function deleteWord(deckId, wordId) {
    setData((prev) => ({
      ...prev,
      vocabDecks: prev.vocabDecks.map((d) =>
        d.id === deckId ? { ...d, words: d.words.filter((w) => w.id !== wordId) } : d
      ),
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
    addHabit,
    deleteHabit,
    renameHabit,
    cycleHabitMark,
    addVocabDeck,
    renameVocabDeck,
    deleteVocabDeck,
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