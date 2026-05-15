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
  Alert,
  Empty,
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
    dataAvailable: false,
  });

  const [performanceAnalytics, setPerformanceAnalytics] = useState({
    responseTime: [],
    errorRate: 0,
    uptime: 0,
    requests: [],
    memoryMb: 0,
    cpuMicros: 0,
    dataAvailable: true,
  });

  const [usageAnalytics, setUsageAnalytics] = useState({
    examStats: [],
    flashcardStats: [],
    categoryDistribution: [],
    timeSpent: [],
    dataAvailable: false,
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
      metric: "Heap Memory",
      current: `${performanceAnalytics.memoryMb} MB`,
      target: "n/a",
      percentage: Math.min(performanceAnalytics.memoryMb, 100),
      status: "success",
    },
    {
      key: "2",
      metric: "Error Rate",
      current: `${performanceAnalytics.errorRate}%`,
      target: "0%",
      percentage: performanceAnalytics.errorRate,
      status: performanceAnalytics.errorRate > 0 ? "warning" : "success",
    },
    {
      key: "3",
      metric: "Uptime",
      current: `${performanceAnalytics.uptime}%`,
      target: "100%",
      percentage: performanceAnalytics.uptime,
      status: "success",
    },
    {
      key: "4",
      metric: "CPU Time",
      current: `${performanceAnalytics.cpuMicros} μs`,
      target: "n/a",
      percentage: 0,
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

      {!userAnalytics.dataAvailable && (
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
          message="User analytics unavailable"
          description="No User model or user activity data is available yet. Charts below show empty states instead of fabricated data."
        />
      )}

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
              value="n/a"
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
            {userAnalytics.dailyActive.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={userAnalytics.dailyActive.map((item) => ({
                    ...item,
                    sessions: item.users,
                  }))}
                >
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
            ) : (
              <Empty description="No user activity data" />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Category Distribution">
            {usageAnalytics.categoryDistribution.some((item) => item.value > 0) ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={usageAnalytics.categoryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {usageAnalytics.categoryDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={["#1890ff", "#52c41a", "#faad14", "#722ed1", "#ff4d4f"][index % 5]}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ textAlign: "center", marginTop: 16 }}>
                  {usageAnalytics.categoryDistribution.map((item, index) => (
                    <Tag
                      key={item.name}
                      color={["#1890ff", "#52c41a", "#faad14", "#722ed1", "#ff4d4f"][index % 5]}
                      style={{ margin: 4 }}
                    >
                      {item.name}: {item.value}%
                    </Tag>
                  ))}
                </div>
              </>
            ) : (
              <Empty description="No category usage data" />
            )}
          </Card>
        </Col>
      </Row>

      {/* Performance Analytics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Response Time Trends">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceAnalytics.responseTime}>
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
            {usageAnalytics.examStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={usageAnalytics.examStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="completed" fill="#52c41a" />
                  <Bar dataKey="attempted" fill="#1890ff" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Empty description="No exam usage data" />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Flashcard Review Activity">
            {usageAnalytics.flashcardStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={usageAnalytics.flashcardStats}>
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
            ) : (
              <Empty description="No flashcard review data" />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;
