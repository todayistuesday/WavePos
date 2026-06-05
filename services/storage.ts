const STORAGE_KEY = "wavepos.workspace.version";
const STORAGE_VERSION = "2026-05-29";

export function ensureWorkspaceVersion() {
  if (typeof window === "undefined") {
    return;
  }

  const currentVersion = window.localStorage.getItem(STORAGE_KEY);
  if (currentVersion !== STORAGE_VERSION) {
    window.localStorage.setItem(STORAGE_KEY, STORAGE_VERSION);
  }
}
