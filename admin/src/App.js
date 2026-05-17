import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "antd";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import DatabaseManagement from "./pages/DatabaseManagement";
import SQLiteGenerator from "./pages/SQLiteGenerator";
import ScriptEditor from "./pages/ScriptEditor";
import UserMonitoring from "./pages/UserMonitoring";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Countries from "./pages/Countries";
import Events from "./pages/Events";
import Login from "./pages/Login";
import "./App.css";

const { Content } = Layout;

function App() {
  const [authed, setAuthed] = useState(!!localStorage.getItem("admin_token"));

  if (!authed) {
    return <Login onLogin={() => setAuthed(true)} />;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout className="site-layout">
        <Content style={{ margin: "24px 16px", padding: 24, minHeight: 280 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/database" element={<DatabaseManagement />} />
            <Route path="/sqlite-generator" element={<SQLiteGenerator />} />
            <Route path="/scripts" element={<ScriptEditor />} />
            <Route path="/users" element={<UserMonitoring />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/countries" element={<Countries />} />
            <Route path="/events" element={<Events />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
