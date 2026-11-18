// Progress kept in localStorage (wrapped: storage can be missing or throw).
// Day strings are local 'YYYY-MM-DD', which compare correctly as strings.
const KEY = 'nacws.save.v1';

const defaults = () => ({ v: 1, best: 0, lastWinDay: null, hung: 0, plays: 0 });

export function loadSave(storage) {
  try {
    const raw = storage && storage.getItem(KEY);
    if (!raw) return defaults();
    const s = JSON.parse(raw);
    if (!s || typeof s !== 'object') return defaults();
    const d = defaults();
    return {
      ...d,
      best: Number.isFinite(s.best) ? s.best : 0,
      lastWinDay: typeof s.lastWinDay === 'string' ? s.lastWinDay : null,
      hung: Number.isFinite(s.hung) ? s.hung : 0,
      plays: Number.isFinite(s.plays) ? s.plays : 0,
    };
  } catch {
    return defaults();
  }
}

export function writeSave(storage, save) {
  try { if (storage) storage.setItem(KEY, JSON.stringify(save)); } catch { /* private mode etc. */ }
}

export function recordWin(save, night, day, hungThisNight = 0) {
  const isNewBest = night > save.best;
  return {
    ...save,
    best: Math.max(save.best, night),
    lastWinDay: isNewBest || !save.lastWinDay ? day : save.lastWinDay,
    hung: isNewBest ? save.hung + hungThisNight : save.hung,
  };
}

// The menu's line for someone coming back: what their tree holds and which night is next. Nothing before a
// first win.
export function menuProgress(save, today) {
  if (!save || !save.best) return null;
  const n = save.hung, tree = `Your tree has ${n} ornament${n === 1 ? '' : 's'}.`;
  const open = unlockedNight(save, today);
  return open > save.best ? `${tree} Night ${open} is open tonight.` : `${tree} Night ${save.best + 1} opens tomorrow.`;
}

// Highest night the player may start today. Night 1 is always open; the next
// night opens on a later calendar day than the last new win.
export function unlockedNight(save, today) {
  if (!save.best) return 1;
  if (save.lastWinDay && today > save.lastWinDay) return save.best + 1;
  return save.best;
}

export function todayString(date = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
}
