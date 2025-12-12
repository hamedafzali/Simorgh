import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  Button,
  Space,
  Statistic,
  Table,
  Tag,
  Progress,
} from "antd";
import {
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  DownloadOutlined,
  ReloadOutlined,
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
  AreaChart,
  Area,
} from "recharts";
import { apiService } from "../services/api";
import moment from "moment";

const { Option } = Select;
const { RangePicker } = DatePicker;

const Analytics = () => {
  const [period, setPeriod] = useState("7d");
  const [dateRange, setDateRange] = useState(null);
  const [loading, setLoading] = useState(false);

  const [userAnalytics, setUserAnalytics] = useState({
    dailyActive: [],
    totalUsers: 0,
    newUsers: 0,
    retention: 0,
  });

  const [performanceAnalytics, setPerformanceAnalytics] = useState({
    responseTime: [],
    errorRate: 0,
    uptime: 0,
    requests: [],
  });

  const [usageAnalytics, setUsageAnalytics] = useState({
    examStats: [],
    flashcardStats: [],
    categoryDistribution: [],
    timeSpent: [],
  });

  useEffect(() => {
    fetchAnalytics();
  }, [period, dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [user, performance, usage] = await Promise.all([
        apiService.getUserAnalytics(period),
        apiService.getPerformanceAnalytics(period),
        apiService.getUsageAnalytics(period),
      ]);

      setUserAnalytics(user);
      setPerformanceAnalytics(performance);
      setUsageAnalytics(usage);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportAnalytics = async () => {
    try {
      const data = {
        userAnalytics,
        performanceAnalytics,
        usageAnalytics,
        period,
        exportDate: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `analytics-${period}-${moment().format(
        "YYYY-MM-DD"
      )}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export analytics:", error);
    }
  };

  // Sample data for demonstration
  const dailyActiveData = [
    { date: "Mon", users: 120, sessions: 180 },
    { date: "Tue", users: 150, sessions: 220 },
    { date: "Wed", users: 180, sessions: 260 },
    { date: "Thu", users: 165, sessions: 240 },
    { date: "Fri", users: 200, sessions: 300 },
    { date: "Sat", users: 140, sessions: 200 },
    { date: "Sun", users: 110, sessions: 160 },
  ];

  const responseTimeData = [
    { time: "00:00", avg: 120, max: 250 },
    { time: "04:00", avg: 80, max: 150 },
    { time: "08:00", avg: 200, max: 400 },
    { time: "12:00", avg: 180, max: 350 },
    { time: "16:00", avg: 160, max: 300 },
    { time: "20:00", avg: 140, max: 280 },
    { time: "23:59", avg: 100, max: 200 },
  ];

  const categoryData = [
    { name: "Vocabulary", value: 35, color: "#1890ff" },
    { name: "Grammar", value: 25, color: "#52c41a" },
    { name: "Conversation", value: 20, color: "#faad14" },
    { name: "Reading", value: 12, color: "#722ed1" },
    { name: "Listening", value: 8, color: "#ff4d4f" },
  ];

  const performanceColumns = [
    {
      title: "Metric",
      dataIndex: "metric",
      key: "metric",
    },
    {
      title: "Current",
      dataIndex: "current",
      key: "current",
      render: (value, record) => (
        <Space>
          <Progress
            percent={record.percentage}
            size="small"
            status={record.status}
            style={{ width: 100 }}
          />
          <span>{value}</span>
        </Space>
      ),
    },
    {
      title: "Target",
      dataIndex: "target",
      key: "target",
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
          {status}
        </Tag>
      ),
    },
  ];

  const performanceData = [
    {
      key: "1",
      metric: "Response Time",
      current: "145ms",
      target: "200ms",
      percentage: 72,
      status: "success",
    },
    {
      key: "2",
      metric: "Error Rate",
      current: "0.5%",
      target: "1%",
      percentage: 50,
      status: "success",
    },
    {
      key: "3",
      metric: "Uptime",
      current: "99.9%",
      target: "99.5%",
      percentage: 99,
      status: "success",
    },
    {
      key: "4",
      metric: "Memory Usage",
      current: "68%",
      target: "80%",
      percentage: 68,
      status: "success",
    },
    {
      key: "5",
      metric: "CPU Usage",
      current: "45%",
      target: "70%",
      percentage: 45,
      status: "success",
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
        <h1>Analytics Dashboard</h1>
        <Space>
          <Select value={period} onChange={setPeriod} style={{ width: 120 }}>
            <Option value="24h">Last 24h</Option>
            <Option value="7d">Last 7 days</Option>
            <Option value="30d">Last 30 days</Option>
            <Option value="90d">Last 90 days</Option>
          </Select>
          <RangePicker onChange={setDateRange} style={{ width: 250 }} />
          <Button icon={<DownloadOutlined />} onClick={exportAnalytics}>
            Export
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchAnalytics}
            loading={loading}
          >
            Refresh
          </Button>
        </Space>
      </div>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={userAnalytics.totalUsers}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="New Users"
              value={userAnalytics.newUsers}
              prefix={<LineChartOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Retention Rate"
              value={userAnalytics.retention}
              suffix="%"
              prefix={<PieChartOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Avg. Session"
              value="12:45"
              prefix={<BarChartOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      {/* User Analytics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Daily Active Users & Sessions">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyActiveData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Area
                  type="monotone"
                  dataKey="users"
                  stackId="1"
                  stroke="#1890ff"
                  fill="#1890ff"
                />
                <Area
                  type="monotone"
                  dataKey="sessions"
                  stackId="1"
                  stroke="#52c41a"
                  fill="#52c41a"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Category Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ textAlign: "center", marginTop: 16 }}>
              {categoryData.map((item) => (
                <Tag key={item.name} color={item.color} style={{ margin: 4 }}>
                  {item.name}: {item.value}%
                </Tag>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Performance Analytics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Response Time Trends">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <RechartsTooltip />
                <Line
                  type="monotone"
                  dataKey="avg"
                  stroke="#1890ff"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="max"
                  stroke="#ff4d4f"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Performance Metrics">
            <Table
              columns={performanceColumns}
              dataSource={performanceData}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* Usage Analytics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Exam Completion Rate">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={[
                  { category: "Vocabulary", completed: 85, attempted: 120 },
                  { category: "Grammar", completed: 65, attempted: 95 },
                  { category: "Conversation", completed: 45, attempted: 78 },
                  { category: "Reading", completed: 70, attempted: 90 },
                  { category: "Listening", completed: 35, attempted: 60 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="completed" fill="#52c41a" />
                <Bar dataKey="attempted" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Flashcard Review Activity">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart
                data={[
                  { day: "Mon", reviews: 450 },
                  { day: "Tue", reviews: 520 },
                  { day: "Wed", reviews: 480 },
                  { day: "Thu", reviews: 590 },
                  { day: "Fri", reviews: 650 },
                  { day: "Sat", reviews: 420 },
                  { day: "Sun", reviews: 380 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <RechartsTooltip />
                <Line
                  type="monotone"
                  dataKey="reviews"
                  stroke="#722ed1"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;
