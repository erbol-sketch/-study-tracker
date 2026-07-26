import { useState } from "react";
import { useData } from "../context/DataContext";

function Vocabulary() {
  const { data, addWord, deleteWord } = useData();
  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");
  const [example, setExample] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!word.trim() || !translation.trim()) return;
    addWord(word.trim(), translation.trim(), example.trim());
    setWord("");
    setTranslation("");
    setExample("");
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Словарь</h2>
      <p className="text-slate-500 mb-6">Слова, которые учишь</p>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Слово (например, achieve)"
            className="px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            placeholder="Перевод (достигать)"
            className="px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <input
          type="text"
          value={example}
          onChange={(e) => setExample(e.target.value)}
          placeholder="Пример предложения (необязательно)"
          className="px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button type="submit" className="self-start px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700">
          Добавить слово
        </button>
      </form>

      {data.vocab.length === 0 ? (
        <p className="text-sm text-slate-400">Пока нет слов</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {[...data.vocab].reverse().map((w) => (
            <div key={w.id} className="bg-white border border-slate-200 rounded-xl p-4 relative">
              <button
                onClick={() => deleteWord(w.id)}
                className="absolute top-3 right-3 text-slate-300 hover:text-rose-500 text-xs"
              >
                Удалить
              </button>
              <p className="font-semibold text-slate-800">{w.word}</p>
              <p className="text-sm text-indigo-600 mb-1">{w.translation}</p>
              {w.example && <p className="text-xs text-slate-400 italic">{w.example}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Vocabulary;