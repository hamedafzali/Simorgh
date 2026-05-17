import React, { useState } from "react";
import { Layout, Menu, Button, Space, Badge } from "antd";
import {
  DashboardOutlined,
  DatabaseOutlined,
  CodeOutlined,
  UserOutlined,
  BarChartOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MobileOutlined,
  GlobalOutlined,
  CalendarOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import apiService from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: "/",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/database",
      icon: <DatabaseOutlined />,
      label: "Database Management",
    },
    {
      key: "/sqlite-generator",
      icon: <MobileOutlined />,
      label: "SQLite Generator",
    },
    {
      key: "/scripts",
      icon: <CodeOutlined />,
      label: "Script Editor",
    },
    {
      key: "/users",
      icon: <UserOutlined />,
      label: "User Monitoring",
    },
    {
      key: "/analytics",
      icon: <BarChartOutlined />,
      label: "Analytics",
    },
    {
      key: "/countries",
      icon: <GlobalOutlined />,
      label: "Countries",
    },
    {
      key: "/events",
      icon: <CalendarOutlined />,
      label: "Events",
    },
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
  ];

  return (
    <Layout.Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={250}
      style={{
        background: "#001529",
        borderRight: "1px solid #f0f0f0",
      }}
    >
      <div
        style={{
          height: 64,
          margin: 16,
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            color: "#fff",
            fontSize: 18,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <DatabaseOutlined style={{ fontSize: 24 }} />
          <span>Simorgh Admin</span>
        </div>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{ color: "#fff" }}
        />
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        style={{ borderRight: 0 }}
        onClick={({ key }) => navigate(key)}
      />

      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: 16,
          right: 16,
          borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingTop: 16,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={() => apiService.logout()}
          style={{ color: "#aaa", width: "100%" }}
        >
          {!collapsed && "Sign Out"}
        </Button>
      </div>
    </Layout.Sider>
  );
};

export default Sidebar;
