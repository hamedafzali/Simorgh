import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Table,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tabs,
  Switch,
  Tooltip,
  Alert,
  Progress,
} from "antd";
import {
  CodeOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
  DeleteOutlined,
  EditOutlined,
  CopyOutlined,
  HistoryOutlined,
  DownloadOutlined,
  UploadOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Editor } from "@monaco-editor/react";
import { apiService } from "../services/api";

const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

const ScriptEditor = () => {
  const [scripts, setScripts] = useState([]);
  const [selectedScript, setSelectedScript] = useState(null);
  const [scriptContent, setScriptContent] = useState("");
  const [runningScripts, setRunningScripts] = useState([]);
  const [logs, setLogs] = useState({});
  const [loading, setLoading] = useState(false);
  const [editorModalVisible, setEditorModalVisible] = useState(false);
  const [logsModalVisible, setLogsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchScripts();
    const interval = setInterval(fetchRunningScripts, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchScripts = async () => {
    try {
      const data = await apiService.getScripts();
      setScripts(data.scripts || []);
    } catch (error) {
      message.error("Failed to fetch scripts");
    }
  };

  const fetchRunningScripts = async () => {
    try {
      const data = await apiService.getRunningScripts();
      setRunningScripts(data.running || []);
    } catch (error) {
      console.error("Failed to fetch running scripts:", error);
    }
  };

  const fetchScriptLogs = async (scriptId) => {
    try {
      const data = await apiService.getScriptLogs(scriptId);
      setLogs((prev) => ({ ...prev, [scriptId]: data.logs || [] }));
    } catch (error) {
      message.error("Failed to fetch script logs");
    }
  };

  const handleCreateScript = (values) => {
    const newScript = {
      id: `script_${Date.now()}`,
      name: values.name,
      description: values.description,
      category: values.category,
      content: '// New script\nconsole.log("Hello, World!");',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "draft",
    };

    setScripts((prev) => [newScript, ...prev]);
    setSelectedScript(newScript);
    setScriptContent(newScript.content);
    setEditorModalVisible(true);
    form.resetFields();
  };

  const handleSaveScript = async () => {
    if (!selectedScript) return;

    setLoading(true);
    try {
      await apiService.saveScript(selectedScript.id, {
        ...selectedScript,
        content: scriptContent,
        updatedAt: new Date().toISOString(),
      });

      message.success("Script saved successfully");
      fetchScripts();
    } catch (error) {
      message.error("Failed to save script");
    } finally {
      setLoading(false);
    }
  };

  const handleRunScript = async (scriptId) => {
    try {
      await apiService.runScript(scriptId);
      message.success("Script started successfully");
      fetchRunningScripts();
      fetchScriptLogs(scriptId);
    } catch (error) {
      message.error("Failed to run script");
    }
  };

  const handleStopScript = async (scriptId) => {
    try {
      await apiService.stopScript(scriptId);
      message.success("Script stopped successfully");
      fetchRunningScripts();
    } catch (error) {
      message.error("Failed to stop script");
    }
  };

  const handleDeleteScript = (scriptId) => {
    Modal.confirm({
      title: "Delete Script",
      content: "Are you sure you want to delete this script?",
      onOk: async () => {
        try {
          await apiService.deleteScript(scriptId);
          message.success("Script deleted successfully");
          fetchScripts();
        } catch (error) {
          message.error("Failed to delete script");
        }
      },
    });
  };

  const scriptColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <Space>
          <FileTextOutlined />
          <div>
            <div>{name}</div>
            <div style={{ fontSize: 12, color: "#666" }}>
              {record.description}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => <Tag>{category}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const isRunning = runningScripts.some((rs) => rs.id === status);
        return (
          <Tag
            color={isRunning ? "green" : status === "draft" ? "orange" : "blue"}
          >
            {isRunning ? "Running" : status}
          </Tag>
        );
      },
    },
    {
      title: "Last Run",
      dataIndex: "lastRun",
      key: "lastRun",
      render: (date) => (date ? new Date(date).toLocaleString() : "Never"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => {
                setSelectedScript(record);
                setScriptContent(record.content);
                setEditorModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Run">
            <Button
              icon={<PlayCircleOutlined />}
              size="small"
              type="primary"
              onClick={() => handleRunScript(record.id)}
              disabled={runningScripts.some((rs) => rs.id === record.id)}
            />
          </Tooltip>
          <Tooltip title="Stop">
            <Button
              icon={<StopOutlined />}
              size="small"
              danger
              onClick={() => handleStopScript(record.id)}
              disabled={!runningScripts.some((rs) => rs.id === record.id)}
            />
          </Tooltip>
          <Tooltip title="Logs">
            <Button
              icon={<HistoryOutlined />}
              size="small"
              onClick={() => {
                setSelectedScript(record);
                fetchScriptLogs(record.id);
                setLogsModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              onClick={() => handleDeleteScript(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const runningColumns = [
    {
      title: "Script",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Started",
      dataIndex: "startedAt",
      key: "startedAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (_, record) => {
        const duration = Date.now() - new Date(record.startedAt).getTime();
        return `${Math.floor(duration / 1000)}s`;
      },
    },
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      render: (progress) => <Progress percent={progress} size="small" />,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<StopOutlined />}
            size="small"
            danger
            onClick={() => handleStopScript(record.id)}
          />
          <Button
            icon={<HistoryOutlined />}
            size="small"
            onClick={() => {
              setSelectedScript(record);
              fetchScriptLogs(record.id);
              setLogsModalVisible(true);
            }}
          />
        </Space>
      ),
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
        <h1>Script Editor</h1>
        <Button
          type="primary"
          icon={<CodeOutlined />}
          onClick={() => form.submit()}
        >
          Create New Script
        </Button>
      </div>

      <Form
        form={form}
        onFinish={handleCreateScript}
        layout="inline"
        style={{ marginBottom: 24 }}
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please enter script name" }]}
        >
          <Input placeholder="Script name" style={{ width: 200 }} />
        </Form.Item>
        <Form.Item
          name="description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <Input placeholder="Description" style={{ width: 250 }} />
        </Form.Item>
        <Form.Item
          name="category"
          rules={[{ required: true, message: "Please select category" }]}
        >
          <Select placeholder="Category" style={{ width: 150 }}>
            <Option value="seed">Seed Data</Option>
            <Option value="maintenance">Maintenance</Option>
            <Option value="analytics">Analytics</Option>
            <Option value="backup">Backup</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Form.Item>
      </Form>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Available Scripts">
            <Table
              columns={scriptColumns}
              dataSource={scripts}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Col>
      </Row>

      {runningScripts.length > 0 && (
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card title="Running Scripts" extra={<PlayCircleOutlined />}>
              <Table
                columns={runningColumns}
                dataSource={runningScripts}
                rowKey="id"
                pagination={false}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Script Editor Modal */}
      <Modal
        title={`Edit Script: ${selectedScript?.name}`}
        visible={editorModalVisible}
        onCancel={() => setEditorModalVisible(false)}
        width="80%"
        footer={[
          <Button key="cancel" onClick={() => setEditorModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={handleSaveScript}
            loading={loading}
          >
            Save
          </Button>,
        ]}
      >
        <Editor
          height="400px"
          defaultLanguage="javascript"
          value={scriptContent}
          onChange={(value) => setScriptContent(value || "")}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </Modal>

      {/* Logs Modal */}
      <Modal
        title={`Logs: ${selectedScript?.name}`}
        visible={logsModalVisible}
        onCancel={() => setLogsModalVisible(false)}
        width="70%"
        footer={[
          <Button key="close" onClick={() => setLogsModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        <div
          style={{
            backgroundColor: "#001529",
            color: "#fff",
            padding: 16,
            borderRadius: 4,
            height: 400,
            overflow: "auto",
            fontFamily: "monospace",
            fontSize: 12,
          }}
        >
          {logs[selectedScript?.id]?.map((log, index) => (
            <div key={index} style={{ marginBottom: 4 }}>
              <span style={{ color: "#666" }}>
                [{new Date(log.timestamp).toLocaleTimeString()}]
              </span>
              <span
                style={{
                  marginLeft: 8,
                  color:
                    log.level === "error"
                      ? "#ff4d4f"
                      : log.level === "warn"
                      ? "#faad14"
                      : "#52c41a",
                }}
              >
                [{log.level.toUpperCase()}]
              </span>
              <span style={{ marginLeft: 8 }}>{log.message}</span>
            </div>
          )) || <div>No logs available</div>}
        </div>
      </Modal>
    </div>
  );
};

export default ScriptEditor;
