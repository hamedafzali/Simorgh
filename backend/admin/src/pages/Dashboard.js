import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Progress,
  Space,
  Button,
  Tooltip,
} from "antd";
import {
  DatabaseOutlined,
  UserOutlined,
  CodeOutlined,
  CloudServerOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { apiService } from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    database: { exams: 0, flashcards: 0, words: 0 },
    users: { total: 0, online: 0, activeToday: 0 },
    scripts: { total: 0, running: 0, failed: 0 },
    system: { uptime: 0, memory: 0, cpu: 0 },
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await apiService.getDashboardStats();
      setStats(data.stats);
      setRecentActivity(data.recentActivity);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Sample data for charts
  const userActivityData = [
    { time: "00:00", users: 12 },
    { time: "04:00", users: 8 },
    { time: "08:00", users: 45 },
    { time: "12:00", users: 78 },
    { time: "16:00", users: 65 },
    { time: "20:00", users: 34 },
    { time: "23:59", users: 18 },
  ];

  const databaseDistribution = [
    { name: "Exams", value: stats.database.exams, color: "#1890ff" },
    { name: "Flashcards", value: stats.database.flashcards, color: "#52c41a" },
    { name: "Words", value: stats.database.words, color: "#faad14" },
  ];

  const activityColumns = [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (user) => (
        <Space>
          <UserOutlined /> {user}
        </Space>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "success"
              ? "green"
              : status === "warning"
              ? "orange"
              : "red"
          }
        >
          {status === "success" ? (
            <CheckCircleOutlined />
          ) : status === "warning" ? (
            <ExclamationCircleOutlined />
          ) : (
            <ClockCircleOutlined />
          )}
          {status}
        </Tag>
      ),
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h1>Dashboard</h1>
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchDashboardData}
          loading={loading}
        >
          Refresh
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {/* Database Stats */}
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Exams"
              value={stats.database.exams}
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Flashcards"
              value={stats.database.flashcards}
              prefix={<CodeOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Words"
              value={stats.database.words}
              prefix={<CodeOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Online Users"
              value={stats.users.online}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#722ed1" }}
              suffix={`/ ${stats.users.total}`}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {/* System Status */}
        <Col xs={24} lg={12}>
          <Card title="System Status" extra={<CloudServerOutlined />}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span>CPU Usage</span>
                  <span>{stats.system.cpu}%</span>
                </div>
                <Progress
                  percent={stats.system.cpu}
                  status={stats.system.cpu > 80 ? "exception" : "normal"}
                />
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span>Memory Usage</span>
                  <span>{stats.system.memory}%</span>
                </div>
                <Progress
                  percent={stats.system.memory}
                  status={stats.system.memory > 80 ? "exception" : "normal"}
                />
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span>Server Uptime</span>
                  <span>
                    {Math.floor(stats.system.uptime / 3600)}h{" "}
                    {Math.floor((stats.system.uptime % 3600) / 60)}m
                  </span>
                </div>
                <Progress
                  percent={((stats.system.uptime % 86400) / 86400) * 100}
                  strokeColor="#52c41a"
                  format={() => "24h"}
                />
              </div>
            </Space>
          </Card>
        </Col>

        {/* Database Distribution */}
        <Col xs={24} lg={12}>
          <Card title="Database Distribution">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={databaseDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {databaseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ textAlign: "center", marginTop: 16 }}>
              {databaseDistribution.map((item) => (
                <Tag key={item.name} color={item.color} style={{ margin: 4 }}>
                  {item.name}: {item.value}
                </Tag>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {/* User Activity Chart */}
        <Col xs={24} lg={16}>
          <Card title="User Activity (24h)">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <RechartsTooltip />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#1890ff"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Recent Activity */}
        <Col xs={24} lg={8}>
          <Card title="Recent Activity">
            <Table
              columns={activityColumns}
              dataSource={recentActivity}
              pagination={false}
              size="small"
              scroll={{ y: 200 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
