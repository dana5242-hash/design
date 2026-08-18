import type { StateStorage } from "zustand/middleware";
import { emitStorageError } from "./storageEvents";

const STORAGE_ERROR_MESSAGE =
  "저장 공간이 부족해 최근 변경사항이 저장되지 못했습니다. 참고 이미지를 정리하거나 오래된 프로젝트를 삭제한 뒤 다시 시도해 주세요.";
const ERROR_NOTIFY_COOLDOWN_MS = 8000;
let lastNotifiedAt = 0;

// zustand's persist middleware calls setItem with no error handling of its own,
// so a QuotaExceededError here would otherwise throw uncaught inside a store
// action and leave the user with no indication that their data wasn't saved.
export const safeLocalStorage: StateStorage = {
  getItem: (name) => localStorage.getItem(name),
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value);
    } catch (err) {
      console.error("localStorage write failed:", err);
      const now = Date.now();
      if (now - lastNotifiedAt > ERROR_NOTIFY_COOLDOWN_MS) {
        lastNotifiedAt = now;
        emitStorageError(STORAGE_ERROR_MESSAGE);
      }
    }
  },
  removeItem: (name) => localStorage.removeItem(name),
};
