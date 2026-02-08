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
  Modal,
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
      const data = await apiService.getSettings();
      setSettings(data.settings || settings);
      form.setFieldsValue(data.settings || settings);
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
                    description="All systems operational"
                    type="success"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                  <p>
                    <strong>Node Version:</strong> v18.17.0
                  </p>
                  <p>
                    <strong>Platform:</strong> macOS
                  </p>
                  <p>
                    <strong>Memory:</strong> 8GB
                  </p>
                  <p>
                    <strong>Storage:</strong> 256GB
                  </p>
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
                  <p>
                    <strong>Total Documents:</strong> 10,543
                  </p>
                  <p>
                    <strong>Database Size:</strong> 245 MB
                  </p>
                  <p>
                    <strong>Indexes:</strong> 12
                  </p>
                  <p>
                    <strong>Last Backup:</strong> 2 hours ago
                  </p>
                  <p>
                    <strong>Next Backup:</strong> 22 hours
                  </p>
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
                    description="All security checks passed"
                    type="success"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                  <p>
                    <strong>SSL Certificate:</strong> Valid
                  </p>
                  <p>
                    <strong>Firewall:</strong> Active
                  </p>
                  <p>
                    <strong>Last Security Scan:</strong> 1 day ago
                  </p>
                  <p>
                    <strong>Vulnerabilities:</strong> 0
                  </p>
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
                  <p>
                    <strong>Data Points:</strong> 1.2M
                  </p>
                  <p>
                    <strong>Storage Used:</strong> 45 MB
                  </p>
                  <p>
                    <strong>Processing Time:</strong> 2.3s
                  </p>
                  <p>
                    <strong>Last Update:</strong> 5 minutes ago
                  </p>
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
