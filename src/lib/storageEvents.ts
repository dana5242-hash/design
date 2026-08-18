type Listener = (message: string) => void;

const listeners = new Set<Listener>();

export function onStorageError(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function emitStorageError(message: string): void {
  listeners.forEach((listener) => listener(message));
}
