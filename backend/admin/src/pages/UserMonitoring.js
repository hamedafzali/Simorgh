import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Space,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Row,
  Col,
  Statistic,
  Tooltip,
  Progress,
  Badge,
  Avatar,
  Timeline,
  Tabs,
  Alert,
} from "antd";
import {
  UserOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  StopOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  MobileOutlined,
  GlobalOutlined,
  DatabaseOutlined,
  TrophyOutlined,
  BookOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { apiService } from "../services/api";

const { Option } = Select;
const { TabPane } = Tabs;

const UserMonitoring = () => {
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userActivity, setUserActivity] = useState([]);
  const [userStats, setUserStats] = useState({
    total: 0,
    online: 0,
    activeToday: 0,
    newThisWeek: 0,
  });
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [activityModalVisible, setActivityModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
    fetchOnlineUsers();
    fetchUserStats();
    const interval = setInterval(() => {
      fetchOnlineUsers();
      fetchUserStats();
    }, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await apiService.getUsers();
      setUsers(data.users || []);
    } catch (error) {
      message.error("Failed to fetch users");
    }
  };

  const fetchOnlineUsers = async () => {
    try {
      const data = await apiService.getOnlineUsers();
      setOnlineUsers(data.online || []);
    } catch (error) {
      console.error("Failed to fetch online users:", error);
    }
  };

  const fetchUserStats = async () => {
    try {
      const data = await apiService.getUserStats();
      setUserStats(data.stats || {});
    } catch (error) {
      console.error("Failed to fetch user stats:", error);
    }
  };

  const fetchUserActivity = async (userId) => {
    try {
      const data = await apiService.getUserActivity(userId);
      setUserActivity(data.activity || []);
    } catch (error) {
      message.error("Failed to fetch user activity");
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    form.setFieldsValue(user);
    setModalVisible(true);
  };

  const handleUpdateUser = async (values) => {
    setLoading(true);
    try {
      await apiService.updateUser(selectedUser.id, values);
      message.success("User updated successfully");
      setModalVisible(false);
      fetchUsers();
    } catch (error) {
      message.error("Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (userId) => {
    Modal.confirm({
      title: "Delete User",
      content: "Are you sure you want to delete this user?",
      onOk: async () => {
        try {
          await apiService.deleteUser(userId);
          message.success("User deleted successfully");
          fetchUsers();
        } catch (error) {
          message.error("Failed to delete user");
        }
      },
    });
  };

  const handleBanUser = async (userId) => {
    try {
      await apiService.banUser(userId);
      message.success("User banned successfully");
      fetchUsers();
    } catch (error) {
      message.error("Failed to ban user");
    }
  };

  const handleViewActivity = (user) => {
    setSelectedUser(user);
    fetchUserActivity(user.id);
    setActivityModalVisible(true);
  };

  const userColumns = [
    {
      title: "User",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} src={record.avatar} />
          <div>
            <div>{name}</div>
            <div style={{ fontSize: 12, color: "#666" }}>{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        const isOnline = onlineUsers.some((user) => user.id === record.id);
        return (
          <Space>
            <Badge status={isOnline ? "success" : "default"} />
            <Tag
              color={
                isOnline ? "green" : status === "banned" ? "red" : "default"
              }
            >
              {isOnline ? "Online" : status}
            </Tag>
          </Space>
        );
      },
    },
    {
      title: "App Version",
      dataIndex: "appVersion",
      key: "appVersion",
      render: (version) => <Tag color="blue">{version}</Tag>,
    },
    {
      title: "DB Version",
      dataIndex: "dbVersion",
      key: "dbVersion",
      render: (version) => <Tag color="purple">{version}</Tag>,
    },
    {
      title: "Last Active",
      dataIndex: "lastActive",
      key: "lastActive",
      render: (date) => (date ? new Date(date).toLocaleString() : "Never"),
    },
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      render: (progress) => (
        <Space direction="vertical" size="small">
          <Progress percent={progress.exams || 0} size="small" />
          <Progress percent={progress.flashcards || 0} size="small" />
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="View Activity">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewActivity(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditUser(record)}
            />
          </Tooltip>
          <Tooltip title="Ban">
            <Button
              icon={<StopOutlined />}
              size="small"
              danger
              onClick={() => handleBanUser(record.id)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              onClick={() => handleDeleteUser(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const activityColumns = [
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
    },
    {
      title: "Device",
      dataIndex: "device",
      key: "device",
      render: (device) => (
        <Space>
          {device.type === "mobile" ? <MobileOutlined /> : <GlobalOutlined />}
          {device.name}
        </Space>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (location) =>
        location ? `${location.city}, ${location.country}` : "Unknown",
    },
    {
      title: "Time",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  // Sample data for charts
  const userGrowthData = [
    { date: "2024-01", users: 120 },
    { date: "2024-02", users: 180 },
    { date: "2024-03", users: 250 },
    { date: "2024-04", users: 320 },
    { date: "2024-05", users: 410 },
    { date: "2024-06", users: 520 },
  ];

  const deviceDistribution = [
    { name: "iOS", value: 45, color: "#000000" },
    { name: "Android", value: 35, color: "#3DDC84" },
    { name: "Web", value: 20, color: "#1890ff" },
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
        <h1>User Monitoring</h1>
        <Space>
          <Badge
            count={userStats.online}
            style={{ backgroundColor: "#52c41a" }}
          >
            <Button icon={<UserOutlined />}>
              Online Users: {userStats.online}
            </Button>
          </Badge>
        </Space>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={userStats.total}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Online Now"
              value={userStats.online}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Active Today"
              value={userStats.activeToday}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="New This Week"
              value={userStats.newThisWeek}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="User Growth (6 Months)">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
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
        <Col xs={24} lg={8}>
          <Card title="Device Distribution">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={deviceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deviceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ textAlign: "center", marginTop: 16 }}>
              {deviceDistribution.map((item) => (
                <Tag key={item.name} color={item.color} style={{ margin: 4 }}>
                  {item.name}: {item.value}%
                </Tag>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="All Users">
        <Table
          columns={userColumns}
          dataSource={users}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Edit User Modal */}
      <Modal
        title="Edit User"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleUpdateUser} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter user name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
              <Option value="banned">Banned</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update
              </Button>
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* User Activity Modal */}
      <Modal
        title={`Activity: ${selectedUser?.name}`}
        visible={activityModalVisible}
        onCancel={() => setActivityModalVisible(false)}
        width="80%"
        footer={[
          <Button key="close" onClick={() => setActivityModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="Recent Activity" key="1">
            <Table
              columns={activityColumns}
              dataSource={userActivity}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
          <TabPane tab="Learning Progress" key="2">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="Exams Progress" extra={<BookOutlined />}>
                  <Progress
                    type="circle"
                    percent={selectedUser?.progress?.exams || 0}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Flashcards Progress" extra={<DatabaseOutlined />}>
                  <Progress
                    type="circle"
                    percent={selectedUser?.progress?.flashcards || 0}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  );
};

export default UserMonitoring;
