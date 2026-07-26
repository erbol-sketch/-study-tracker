import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login, register, error } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (mode === "login") {
      login(username, password);
    } else {
      register(username, password);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white/85 backdrop-blur-sm rounded-2xl shadow-sm border border-rose-100 p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">
          {mode === "login" ? "Вход" : "Регистрация"}
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          {mode === "login"
            ? "Войди, чтобы увидеть свой прогресс"
            : "Создай аккаунт для отслеживания учёбы"}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Имя пользователя</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-rose-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-rose-400"
              placeholder="например, ali_dev"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-rose-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-rose-400"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <button
            type="submit"
            className="mt-2 py-2.5 rounded-lg bg-rose-500 text-white font-semibold hover:bg-rose-600 transition"
          >
            {mode === "login" ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="w-full text-center text-sm text-rose-600 hover:text-rose-700 mt-5"
        >
          {mode === "login" ? "Нет аккаунта? Зарегистрируйся" : "Уже есть аккаунт? Войти"}
        </button>
      </div>
    </div>
  );
}

export default Login;