const STORAGE_KEY = "carShowroom.comments";

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (error) {
    return {};
  }
}

function writeAll(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadComments(vehicleId) {
  const all = readAll();
  return all[vehicleId] || [];
}

export function saveComment(vehicleId, comment) {
  const all = readAll();
  const current = all[vehicleId] || [];
  const next = [comment, ...current];
  const updated = { ...all, [vehicleId]: next };
  writeAll(updated);
  return next;
}
