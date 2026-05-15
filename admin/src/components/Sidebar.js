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
} from "@ant-design/icons";
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
          borderTop: "1px solid #f0f0f0",
          paddingTop: 16,
          textAlign: "center",
        }}
      >
        <Space>
          <Badge count={3} style={{ backgroundColor: "#52c41a" }} />
          <span style={{ color: "#666", fontSize: 12 }}>Online Users: 3</span>
        </Space>
      </div>
    </Layout.Sider>
  );
};

export default Sidebar;
