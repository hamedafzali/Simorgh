import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Switch,
  Button,
  Space,
  message,
  Row,
  Col,
  Select,
  InputNumber,
  Tabs,
  Divider,
  Alert,
  Upload,
  Descriptions,
} from "antd";
import {
  SaveOutlined,
  ReloadOutlined,
  UploadOutlined,
  DownloadOutlined,
  DatabaseOutlined,
  SettingOutlined,
  SecurityScanOutlined,
  NotificationOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { apiService } from "../services/api";

const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [systemInfo, setSystemInfo] = useState(null);
  const [settings, setSettings] = useState({
    general: {
      appName: "Simorgh",
      version: "1.0.0",
      maintenance: false,
      debugMode: false,
      maxUsers: 10000,
    },
    database: {
      host: "localhost",
      port: 27017,
      name: "simorgh",
      autoBackup: true,
      backupInterval: 24,
      maxBackups: 10,
    },
    security: {
      jwtSecret: "your-secret-key",
      jwtExpiry: 24,
      rateLimit: true,
      maxRequests: 100,
      corsEnabled: true,
      allowedOrigins: ["http://localhost:3000"],
    },
    notifications: {
      emailEnabled: false,
      smtpHost: "",
      smtpPort: 587,
      smtpUser: "",
      smtpPass: "",
      pushEnabled: true,
      pushKey: "",
    },
    analytics: {
      enabled: true,
      trackingCode: "",
      anonymizeData: true,
      retentionDays: 90,
    },
  });
  const [form] = Form.useForm();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const [data, info] = await Promise.all([
        apiService.getSettings(),
        apiService.getSystemInfo(),
      ]);
      setSettings(data.settings || settings);
      form.setFieldsValue(data.settings || settings);
      setSystemInfo(info);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  };

  const handleSave = async (values) => {
    setLoading(true);
    try {
      await apiService.updateSettings(values);
      message.success("Settings saved successfully");
      setSettings(values);
    } catch (error) {
      message.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    form.setFieldsValue(settings);
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "simorgh-settings.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleImportSettings = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target.result);
        setSettings(importedSettings);
        form.setFieldsValue(importedSettings);
        message.success("Settings imported successfully");
      } catch (error) {
        message.error("Invalid settings file");
      }
    };
    reader.readAsText(file);
    return false;
  };

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
        <h1>Settings</h1>
        <Space>
          <Button icon={<DownloadOutlined />} onClick={handleExportSettings}>
            Export
          </Button>
          <Upload
            accept=".json"
            showUploadList={false}
            beforeUpload={handleImportSettings}
          >
            <Button icon={<UploadOutlined />}>Import</Button>
          </Upload>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            Reset
          </Button>
        </Space>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={settings}
        onFinish={handleSave}
      >
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <span>
                <SettingOutlined /> General
              </span>
            }
            key="1"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card title="Application Settings">
                  <Form.Item
                    name={["general", "appName"]}
                    label="Application Name"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item name={["general", "version"]} label="Version">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item
                    name={["general", "maxUsers"]}
                    label="Maximum Users"
                  >
                    <InputNumber min={1} max={100000} />
                  </Form.Item>
                  <Form.Item
                    name={["general", "maintenance"]}
                    label="Maintenance Mode"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  <Form.Item
                    name={["general", "debugMode"]}
                    label="Debug Mode"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title="System Information">
                  <Alert
                    message="System Status"
                    description="Live backend runtime information"
                    type="success"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                  <Descriptions size="small" column={1}>
                    <Descriptions.Item label="Node Version">
                      {systemInfo?.nodeVersion || "n/a"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Platform">
                      {systemInfo?.platform || "n/a"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Uptime">
                      {systemInfo?.uptime
                        ? `${Math.floor(systemInfo.uptime / 3600)}h ${Math.floor(
                            (systemInfo.uptime % 3600) / 60
                          )}m`
                        : "n/a"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Heap Used">
                      {systemInfo?.memory?.heapUsed
                        ? `${Math.round(systemInfo.memory.heapUsed / 1024 / 1024)} MB`
                        : "n/a"}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane
            tab={
              <span>
                <DatabaseOutlined /> Database
              </span>
            }
            key="2"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card title="Database Configuration">
                  <Form.Item
                    name={["database", "host"]}
                    label="Host"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name={["database", "port"]}
                    label="Port"
                    rules={[{ required: true }]}
                  >
                    <InputNumber min={1} max={65535} />
                  </Form.Item>
                  <Form.Item
                    name={["database", "name"]}
                    label="Database Name"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name={["database", "autoBackup"]}
                    label="Auto Backup"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  <Form.Item
                    name={["database", "backupInterval"]}
                    label="Backup Interval (hours)"
                  >
                    <InputNumber min={1} max={168} />
                  </Form.Item>
                  <Form.Item
                    name={["database", "maxBackups"]}
                    label="Maximum Backups"
                  >
                    <InputNumber min={1} max={100} />
                  </Form.Item>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title="Database Statistics">
                  <Alert
                    message="Database statistics moved"
                    description="Operational database counts and generated SQLite artifacts are now tracked in Dashboard, Database Management, and SQLite Generator."
                    type="info"
                    showIcon
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane
            tab={
              <span>
                <SecurityScanOutlined /> Security
              </span>
            }
            key="3"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card title="Security Settings">
                  <Form.Item
                    name={["security", "jwtSecret"]}
                    label="JWT Secret"
                  >
                    <Input.Password />
                  </Form.Item>
                  <Form.Item
                    name={["security", "jwtExpiry"]}
                    label="JWT Expiry (hours)"
                  >
                    <InputNumber min={1} max={168} />
                  </Form.Item>
                  <Form.Item
                    name={["security", "rateLimit"]}
                    label="Rate Limiting"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  <Form.Item
                    name={["security", "maxRequests"]}
                    label="Max Requests per Hour"
                  >
                    <InputNumber min={1} max={10000} />
                  </Form.Item>
                  <Form.Item
                    name={["security", "corsEnabled"]}
                    label="CORS Enabled"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  <Form.Item
                    name={["security", "allowedOrigins"]}
                    label="Allowed Origins"
                  >
                    <Select mode="tags" style={{ width: "100%" }}>
                      <Option value="http://localhost:3000">Localhost</Option>
                      <Option value="http://192.168.1.100:3000">Network</Option>
                    </Select>
                  </Form.Item>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title="Security Audit">
                  <Alert
                    message="Security Status"
                    description="This panel stores configuration only. No automated security scanner is implemented yet."
                    type="warning"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                  <p>Persisted settings are active, but audit automation is not implemented.</p>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane
            tab={
              <span>
                <NotificationOutlined /> Notifications
              </span>
            }
            key="4"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card title="Email Settings">
                  <Form.Item
                    name={["notifications", "emailEnabled"]}
                    label="Email Notifications"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  <Form.Item
                    name={["notifications", "smtpHost"]}
                    label="SMTP Host"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name={["notifications", "smtpPort"]}
                    label="SMTP Port"
                  >
                    <InputNumber min={1} max={65535} />
                  </Form.Item>
                  <Form.Item
                    name={["notifications", "smtpUser"]}
                    label="SMTP Username"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name={["notifications", "smtpPass"]}
                    label="SMTP Password"
                  >
                    <Input.Password />
                  </Form.Item>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title="Push Notifications">
                  <Form.Item
                    name={["notifications", "pushEnabled"]}
                    label="Push Notifications"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  <Form.Item
                    name={["notifications", "pushKey"]}
                    label="Push API Key"
                  >
                    <TextArea rows={4} />
                  </Form.Item>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane
            tab={
              <span>
                <GlobalOutlined /> Analytics
              </span>
            }
            key="5"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card title="Analytics Settings">
                  <Form.Item
                    name={["analytics", "enabled"]}
                    label="Analytics Enabled"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  <Form.Item
                    name={["analytics", "trackingCode"]}
                    label="Tracking Code"
                  >
                    <TextArea rows={4} />
                  </Form.Item>
                  <Form.Item
                    name={["analytics", "anonymizeData"]}
                    label="Anonymize Data"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  <Form.Item
                    name={["analytics", "retentionDays"]}
                    label="Data Retention (days)"
                  >
                    <InputNumber min={1} max={365} />
                  </Form.Item>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title="Analytics Overview">
                  <Alert
                    message="Analytics storage overview unavailable"
                    description="This page stores analytics configuration. Live analytics data is shown on the Analytics dashboard."
                    type="info"
                    showIcon
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane
            tab={
              <span>
                <SettingOutlined /> Features
              </span>
            }
            key="6"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Card title="App Feature Flags">
                  <Alert
                    message="Delivered with database version sync"
                    description="These values are consumed by the mobile app when it checks or syncs database version metadata."
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                  <Row gutter={[16, 8]}>
                    {[
                      "learning",
                      "community",
                      "jobs",
                      "chat",
                      "events",
                      "documents",
                      "countries",
                      "checklist",
                      "deadlines",
                      "forms",
                      "emergency",
                      "phrasebook",
                      "reminders",
                      "school",
                      "support",
                      "housing",
                      "tax",
                      "services",
                      "guides",
                      "locations",
                      "timeline",
                    ].map((key) => (
                      <Col xs={24} md={12} lg={8} key={key}>
                        <Form.Item
                          name={["featureFlags", key]}
                          label={key}
                          valuePropName="checked"
                        >
                          <Switch />
                        </Form.Item>
                      </Col>
                    ))}
                  </Row>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>

        <Divider />

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SaveOutlined />}
            >
              Save Settings
            </Button>
            <Button onClick={handleReset}>Reset</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Settings;
