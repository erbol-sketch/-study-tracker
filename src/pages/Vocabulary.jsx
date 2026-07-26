import { useState } from "react";
import { useData } from "../context/DataContext";

function Vocabulary() {
  const { data, addVocabDeck, deleteVocabDeck, renameVocabDeck } = useData();
  const [openDeckId, setOpenDeckId] = useState(null);
  const [showAddDeck, setShowAddDeck] = useState(false);
  const [newDeckName, setNewDeckName] = useState("");

  const openDeck = data.vocabDecks.find((d) => d.id === openDeckId);

  function handleAddDeck(e) {
    e.preventDefault();
    if (!newDeckName.trim()) return;
    addVocabDeck(newDeckName.trim());
    setNewDeckName("");
    setShowAddDeck(false);
  }

  if (openDeck) {
    return <DeckView deck={openDeck} onBack={() => setOpenDeckId(null)} />;
  }

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Словарь</h2>
      <p className="text-slate-500 mb-6">Файлы со словами — открой, чтобы поучить карточки</p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {data.vocabDecks.map((deck) => (
          <button
            key={deck.id}
            onClick={() => setOpenDeckId(deck.id)}
            className="text-left bg-white/80 backdrop-blur-sm border border-rose-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-rose-300 transition group"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">📁</span>
              {deck.words.length > 0 && (
                <span className="text-xs font-medium text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                  {deck.words.length}
                </span>
              )}
            </div>
            <p className="font-semibold text-slate-800 group-hover:text-rose-600 transition">{deck.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {deck.words.length === 0 ? "пусто" : `${deck.words.length} слов`}
            </p>
          </button>
        ))}

        <button
          onClick={() => setShowAddDeck((v) => !v)}
          className="flex flex-col items-center justify-center gap-1 border-2 border-dashed border-rose-200 rounded-2xl p-5 text-rose-400 hover:bg-rose-50 transition min-h-[112px]"
        >
          <span className="text-2xl">+</span>
          <span className="text-sm font-medium">Новый файл</span>
        </button>
      </div>

      {showAddDeck && (
        <form onSubmit={handleAddDeck} className="flex gap-2 mb-6">
          <input
            type="text"
            autoFocus
            value={newDeckName}
            onChange={(e) => setNewDeckName(e.target.value)}
            placeholder="Например: Топик — Работа"
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

function DeckView({ deck, onBack }) {
  const { addWord, deleteWord, deleteVocabDeck, renameVocabDeck } = useData();
  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");
  const [example, setExample] = useState("");
  const [flippedIds, setFlippedIds] = useState(() => new Set());
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(deck.name);

  function handleSubmit(e) {
    e.preventDefault();
    if (!word.trim() || !translation.trim()) return;
    addWord(deck.id, word.trim(), translation.trim(), example.trim());
    setWord("");
    setTranslation("");
    setExample("");
  }

  function toggleFlip(id) {
    setFlippedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleDeleteDeck() {
    if (confirm(`Удалить файл «${deck.name}» вместе со всеми словами (${deck.words.length})?`)) {
      deleteVocabDeck(deck.id);
      onBack();
    }
  }

  return (
    <div className="max-w-3xl">
      <button
        onClick={onBack}
        className="text-sm text-slate-500 hover:text-rose-600 mb-4 inline-flex items-center gap-1"
      >
        ← Все файлы
      </button>

      <div className="flex items-start justify-between mb-1 gap-3">
        {editingName ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (nameDraft.trim()) renameVocabDeck(deck.id, nameDraft.trim());
              setEditingName(false);
            }}
            className="flex-1"
          >
            <input
              autoFocus
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onBlur={() => {
                if (nameDraft.trim()) renameVocabDeck(deck.id, nameDraft.trim());
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
            {deck.name}
          </h2>
        )}
        <button
          onClick={handleDeleteDeck}
          className="text-xs text-slate-300 hover:text-rose-500 shrink-0 mt-2"
        >
          Удалить файл
        </button>
      </div>
      <p className="text-slate-500 mb-6">Нажми на карточку, чтобы увидеть перевод и пример</p>

      <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm border border-rose-100 rounded-2xl p-5 mb-8 flex flex-col gap-3 shadow-sm">
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Слово (например, achieve)"
            className="px-3 py-2 rounded-lg border border-rose-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
          <input
            type="text"
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            placeholder="Перевод (достигать)"
            className="px-3 py-2 rounded-lg border border-rose-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
        </div>
        <input
          type="text"
          value={example}
          onChange={(e) => setExample(e.target.value)}
          placeholder="Пример предложения (необязательно)"
          className="px-3 py-2 rounded-lg border border-rose-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-rose-400"
        />
        <button type="submit" className="self-start px-4 py-2 rounded-lg bg-rose-500 text-white font-medium hover:bg-rose-600">
          Добавить слово
        </button>
      </form>

      {deck.words.length === 0 ? (
        <p className="text-sm text-slate-400">В этом файле пока нет слов</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...deck.words].reverse().map((w) => (
            <FlipCard
              key={w.id}
              word={w}
              flipped={flippedIds.has(w.id)}
              onFlip={() => toggleFlip(w.id)}
              onDelete={() => deleteWord(deck.id, w.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FlipCard({ word, flipped, onFlip, onDelete }) {
  return (
    <div className="h-40" style={{ perspective: "1000px" }}>
      <div
        onClick={onFlip}
        className="relative w-full h-full cursor-pointer"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.5s",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Лицевая сторона: слово */}
        <div
          className="absolute inset-0 rounded-2xl border border-rose-100 bg-white/90 backdrop-blur-sm shadow-sm flex flex-col items-center justify-center px-4 text-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <p className="text-lg font-semibold text-slate-800 break-words">{word.word}</p>
          <p className="text-[11px] text-slate-300 mt-2">нажми, чтобы перевернуть</p>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="absolute top-2 right-2 text-slate-300 hover:text-rose-500 text-xs"
          >
            ✕
          </button>
        </div>

        {/* Обратная сторона: перевод + пример */}
        <div
          className="absolute inset-0 rounded-2xl bg-rose-500 shadow-sm flex flex-col items-center justify-center px-4 text-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <p className="text-lg font-semibold text-white break-words">{word.translation}</p>
          {word.example && (
            <p className="text-xs text-rose-100 mt-2 italic break-words">{word.example}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Vocabulary;