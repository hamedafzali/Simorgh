import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Table,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Progress,
  Timeline,
  Tooltip,
  Alert,
  Steps,
  Descriptions,
  Badge,
  Spin,
} from "antd";
import {
  DatabaseOutlined,
  DownloadOutlined,
  CloudDownloadOutlined,
  SyncOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  PlayCircleOutlined,
  FileZipOutlined,
  MobileOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { apiService } from "../services/api";

const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;

const SQLiteGenerator = () => {
  const [stats, setStats] = useState({
    exams: 0,
    flashcards: 0,
    words: 0,
    sourceExams: 0,
    sourceFlashcards: 0,
    sourceWords: 0,
    version: "1.0.0",
    lastGenerated: null,
    packageSize: 0,
    databaseExists: false,
    hasContent: false,
  });
  const [generating, setGenerating] = useState(false);
  const [packaging, setPackaging] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [generationLogs, setGenerationLogs] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const generationSteps = [
    {
      title: "Initialize",
      description: "Connect to MongoDB and setup SQLite",
      icon: <DatabaseOutlined />,
    },
    {
      title: "Create Tables",
      description: "Generate database schema",
      icon: <DatabaseOutlined />,
    },
    {
      title: "Import Data",
      description: "Transfer data from MongoDB to SQLite",
      icon: <SyncOutlined />,
    },
    {
      title: "Create Indexes",
      description: "Optimize database performance",
      icon: <RocketOutlined />,
    },
    {
      title: "Package",
      description: "Create distribution package",
      icon: <FileZipOutlined />,
    },
  ];

  useEffect(() => {
    fetchSQLiteDatabaseStats();
  }, []);

  const fetchSQLiteDatabaseStats = async () => {
    try {
      const data = await apiService.getSQLiteDatabaseStats();
      setStats({
        exams: data.stats.exams,
        flashcards: data.stats.flashcards,
        words: data.stats.words,
        sourceExams: data.sourceStats?.exams || 0,
        sourceFlashcards: data.sourceStats?.flashcards || 0,
        sourceWords: data.sourceStats?.words || 0,
        version: data.version.version,
        lastGenerated: data.version.timestamp,
        packageSize: data.packageSize || 0,
        databaseExists: Boolean(data.databaseExists),
        hasContent: Boolean(data.hasContent),
      });
    } catch (error) {
      console.error("Failed to fetch SQLite database stats:", error);
    }
  };

  const addLog = (message, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setGenerationLogs((prev) => [...prev, { timestamp, message, type }]);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setCurrentStep(0);
    setGenerationLogs([]);
    addLog("Starting SQLite database generation...", "info");

    try {
      addLog("Checking MongoDB source data...", "info");
      setCurrentStep(0);

      const result = await apiService.generateSQLiteDatabase();

      setCurrentStep(1);
      addLog("SQLite tables created.", "success");

      setCurrentStep(2);
      if (result.source?.seeded) {
        addLog(
          `MongoDB was empty. Seeded ${result.source.after.exams} exams, ${result.source.after.flashcards} flashcards, ${result.source.after.words} words.`,
          "warning"
        );
      } else {
        addLog(
          `Using existing MongoDB data: ${result.source?.after?.exams || 0} exams, ${result.source?.after?.flashcards || 0} flashcards, ${result.source?.after?.words || 0} words.`,
          "info"
        );
      }

      addLog(`Imported ${result.stats.exams} exams into SQLite.`, "success");
      addLog(
        `Imported ${result.stats.flashcards} flashcards into SQLite.`,
        "success"
      );
      addLog(`Imported ${result.stats.words} words into SQLite.`, "success");

      setCurrentStep(3);
      addLog("SQLite indexes created.", "success");
      setCurrentStep(4);
      addLog("SQLite database generated successfully!", "success");
      message.success("SQLite database generated successfully");
      fetchSQLiteDatabaseStats();
    } catch (error) {
      addLog(`Generation failed: ${error.message}`, "error");
      message.error("Failed to generate SQLite database");
    } finally {
      setGenerating(false);
    }
  };

  const handlePackage = async () => {
    setPackaging(true);
    addLog("Creating distribution package...", "info");

    try {
      await apiService.packageSQLiteDatabase();

      addLog("Package created successfully!", "success");
      message.success("Database package created successfully");
      fetchSQLiteDatabaseStats();
    } catch (error) {
      addLog(`Packaging failed: ${error.message}`, "error");
      message.error("Failed to create package");
    } finally {
      setPackaging(false);
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    setDownloadProgress(0);

    try {
      const response = await apiService.downloadSQLiteDatabase();

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "simorgh-app-sqlite.db");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      message.success("SQLite database downloaded successfully");
    } catch (error) {
      message.error("Failed to download SQLite database");
    } finally {
      setLoading(false);
      setDownloadProgress(0);
    }
  };

  const handleDownloadPackage = async () => {
    setLoading(true);

    try {
      // This would download the full package including metadata
      const response = await apiService.downloadSQLiteDatabase();

      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "simorgh-app-package.zip");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      message.success("Database package downloaded successfully");
    } catch (error) {
      message.error("Failed to download package");
    } finally {
      setLoading(false);
    }
  };

  const logColumns = [
    {
      title: "Time",
      dataIndex: "timestamp",
      key: "timestamp",
      width: 100,
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 80,
      render: (type) => (
        <Tag
          color={
            type === "success"
              ? "green"
              : type === "error"
              ? "red"
              : type === "warning"
              ? "orange"
              : "blue"
          }
        >
          {type}
        </Tag>
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
        <h1>SQLite Database Generator</h1>
        <Space>
          <Button
            icon={<PlayCircleOutlined />}
            onClick={handleGenerate}
            loading={generating}
            type="primary"
          >
            Generate Database
          </Button>
          <Button
            icon={<FileZipOutlined />}
            onClick={handlePackage}
            loading={packaging}
            disabled={stats.exams === 0}
          >
            Create Package
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            loading={loading}
            disabled={stats.exams === 0}
          >
            Download DB
          </Button>
          <Button
            icon={<CloudDownloadOutlined />}
            onClick={handleDownloadPackage}
            loading={loading}
            disabled={stats.packageSize === 0}
          >
            Download Package
          </Button>
        </Space>
      </div>

      <Alert
        message="Mobile App Database Generation"
        description="Generate SQLite databases for React Native mobile app deployment. This creates optimized offline databases with all learning content."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Alert
        message="MongoDB Source Data"
        description={`Source collections currently contain ${stats.sourceExams} exams, ${stats.sourceFlashcards} flashcards, and ${stats.sourceWords} words. If empty, generation now seeds initial data automatically.`}
        type={
          stats.sourceExams + stats.sourceFlashcards + stats.sourceWords > 0
            ? "success"
            : "warning"
        }
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Exams"
              value={stats.exams}
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Flashcards"
              value={stats.flashcards}
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Words"
              value={stats.words}
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card title="Generation Progress" extra={<MobileOutlined />}>
            <Steps current={currentStep} size="small" items={generationSteps} />
            {generating && (
              <div style={{ marginTop: 16 }}>
                <Spin size="small" /> Generating database...
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Database Information">
            <Descriptions size="small" column={1}>
              <Descriptions.Item label="Version">
                <Badge status="processing" text={stats.version} />
              </Descriptions.Item>
              <Descriptions.Item label="Last Generated">
                {stats.lastGenerated
                  ? new Date(stats.lastGenerated).toLocaleString()
                  : "Never"}
              </Descriptions.Item>
              <Descriptions.Item label="Package Size">
                {stats.packageSize
                  ? `${(stats.packageSize / 1024 / 1024).toFixed(2)} MB`
                  : "Not packaged"}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Badge
                  status={
                    !stats.databaseExists
                      ? "default"
                      : stats.hasContent
                      ? "success"
                      : "warning"
                  }
                  text={
                    !stats.databaseExists
                      ? "Not Generated"
                      : stats.hasContent
                      ? "Ready"
                      : "Generated (Empty)"
                  }
                />
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <Card title="Generation Logs" extra={<HistoryOutlined />}>
        <Table
          columns={logColumns}
          dataSource={generationLogs}
          rowKey={(record, index) => index}
          pagination={{ pageSize: 10 }}
          size="small"
          locale={{ emptyText: "No logs yet. Start generation to see logs." }}
        />
      </Card>
    </div>
  );
};

export default SQLiteGenerator;
