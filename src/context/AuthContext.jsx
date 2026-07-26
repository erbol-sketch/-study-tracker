import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const USERS_KEY = "study-tracker:users";       // список всех аккаунтов { username: password }
const SESSION_KEY = "study-tracker:session";   // кто сейчас залогинен

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState("");

  // При запуске приложения проверяем, был ли кто-то залогинен
  useEffect(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) setCurrentUser(saved);
  }, []);

  function register(username, password) {
    setError("");
    const users = loadUsers();

    if (!username.trim() || !password.trim()) {
      setError("Заполни имя пользователя и пароль");
      return false;
    }
    if (users[username]) {
      setError("Такой пользователь уже существует");
      return false;
    }

    users[username] = password;
    saveUsers(users);
    localStorage.setItem(SESSION_KEY, username);
    setCurrentUser(username);
    return true;
  }

  function login(username, password) {
    setError("");
    const users = loadUsers();

    if (!users[username] || users[username] !== password) {
      setError("Неверное имя пользователя или пароль");
      return false;
    }

    localStorage.setItem(SESSION_KEY, username);
    setCurrentUser(username);
    return true;
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider value={{ currentUser, error, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth должен использоваться внутри AuthProvider");
  return ctx;
}