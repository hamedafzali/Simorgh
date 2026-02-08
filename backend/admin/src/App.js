import React from "react";
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
import "./App.css";

const { Content } = Layout;

function App() {
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
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
