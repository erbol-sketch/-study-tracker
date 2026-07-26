import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import Login from "./components/Login";
import Layout from "./components/Layout";
import Overview from "./pages/Overview";
import Schedule from "./pages/Schedule";
import English from "./pages/English";
import Subjects from "./pages/Subjects";
import Vocabulary from "./pages/Vocabulary";
import SakuraPetals from "./components/SakuraPetals";
import MusicPlayer from "./components/MusicPlayer";

function AppContent() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-rose-50 via-white to-indigo-50">
      {/* Фоновая картина — только когда пользователь залогинен, на логине её нет */}
      {currentUser && (
        <>
          <div
            className="fixed inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: "url(/mountains-bg.jpg)" }}
          />
          {/* лёгкая белая дымка поверх, чтобы карточки/текст не терялись на фоне картины */}
          <div className="fixed inset-0 z-0 bg-white/55" />
        </>
      )}

      {/* Фон и музыка монтируются один раз и не перезапускаются при входе/выходе */}
      <SakuraPetals />
      <MusicPlayer />

      <div className="relative z-10">
        {!currentUser ? (
          <Login />
        ) : (
          <DataProvider>
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              {activeTab === "overview" && <Overview />}
              {activeTab === "schedule" && <Schedule />}
              {activeTab === "english" && <English />}
              {activeTab === "subjects" && <Subjects />}
              {activeTab === "vocab" && <Vocabulary />}
            </Layout>
          </DataProvider>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;