import { useData } from "../context/DataContext";

function Overview() {
  const { data, ENGLISH_SKILLS, SKILL_LABELS } = useData();

  // считаем, сколько раз за последние 7 дней отрабатывался каждый навык
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const counts = ENGLISH_SKILLS.map((skill) => {
    const count = data.englishLogs.filter(
      (l) => l.skill === skill && new Date(l.date) >= weekAgo
    ).length;
    return { skill, count };
  });

  const maxCount = Math.max(1, ...counts.map((c) => c.count));
  const weakest = [...counts].sort((a, b) => a.count - b.count)[0];

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Обзор прогресса</h2>
      <p className="text-slate-500 mb-8">Активность за последние 7 дней</p>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <h3 className="font-semibold text-slate-700 mb-4">Английский по навыкам</h3>

        <div className="flex flex-col gap-4">
          {counts.map(({ skill, count }) => (
            <div key={skill}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-600">{SKILL_LABELS[skill]}</span>
                <span className="text-slate-400">{count} раз</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    skill === weakest.skill && count < maxCount ? "bg-rose-400" : "bg-indigo-500"
                  }`}
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {weakest.count < maxCount && (
          <p className="text-sm text-rose-600 mt-4">
            Меньше всего практики в: <strong>{SKILL_LABELS[weakest.skill]}</strong> — стоит уделить больше внимания.
          </p>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-700 mb-4">Предметы</h3>
        <div className="flex flex-col gap-3">
          {data.subjects.map((s) => (
            <div key={s.id} className="flex justify-between items-center text-sm">
              <span className="font-medium text-slate-600">{s.name}</span>
              <span className="text-slate-400">{s.entries.length} записей</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Overview;