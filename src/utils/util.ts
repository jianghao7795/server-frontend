export function saveToSession(key: string, value: any) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

export function getToSession(key: string) {
  return JSON.parse(sessionStorage.getItem(key) || "[]");
}

export function deleteSession(key = "") {
  if (key) {
    sessionStorage.removeItem(key);
  } else {
    sessionStorage.clear();
  }
}
