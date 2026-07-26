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

function AppContent() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  if (!currentUser) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-rose-50 via-white to-indigo-50">
        <SakuraPetals />
        <div className="relative z-10">
          <Login />
        </div>
      </div>
    );
  }

  return (
    <DataProvider>
      <div className="relative min-h-screen bg-gradient-to-br from-rose-50 via-white to-indigo-50">
        <SakuraPetals />
        <div className="relative z-10">
          <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
            {activeTab === "overview" && <Overview />}
            {activeTab === "schedule" && <Schedule />}
            {activeTab === "english" && <English />}
            {activeTab === "subjects" && <Subjects />}
            {activeTab === "vocab" && <Vocabulary />}
          </Layout>
        </div>
      </div>
    </DataProvider>
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