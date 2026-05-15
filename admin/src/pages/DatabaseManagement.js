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
  Descriptions,
  Tabs,
} from "antd";
import {
  DatabaseOutlined,
  CloudDownloadOutlined,
  CloudUploadOutlined,
  SyncOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { apiService } from "../services/api";

const { Option } = Select;
const { TextArea } = Input;

const DatabaseManagement = () => {
  const [stats, setStats] = useState({
    exams: 0,
    flashcards: 0,
    words: 0,
    version: "1.0.0",
    lastUpdated: null,
  });
  const [backups, setBackups] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [backupModalVisible, setBackupModalVisible] = useState(false);
  const [restoreModalVisible, setRestoreModalVisible] = useState(false);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerLoading, setViewerLoading] = useState(false);
  const [viewerArtifact, setViewerArtifact] = useState(null);
  const [viewerTables, setViewerTables] = useState([]);
  const [viewerTable, setViewerTable] = useState(null);
  const [viewerRows, setViewerRows] = useState([]);
  const [viewerPagination, setViewerPagination] = useState({
    current: 1,
    pageSize: 25,
    total: 0,
  });
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchDatabaseStats();
    fetchBackups();
  }, []);

  const fetchDatabaseStats = async () => {
    try {
      const data = await apiService.getDatabaseStats();
      setStats({
        exams: data.stats.exams,
        flashcards: data.stats.flashcards,
        words: data.stats.words,
        version: data.version.version,
        lastUpdated: data.version.timestamp,
      });
    } catch (error) {
      message.error("Failed to fetch database stats");
    }
  };

  const fetchBackups = async () => {
    try {
      const data = await apiService.getBackups();
      setBackups(data.backups || []);
    } catch (error) {
      console.error("Failed to fetch backups:", error);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await apiService.syncDatabase();
      message.success("Database synchronized successfully");
      fetchDatabaseStats();
    } catch (error) {
      message.error("Failed to synchronize database");
    } finally {
      setSyncing(false);
    }
  };

  const handleBackup = async (values) => {
    setLoading(true);
    try {
      await apiService.backupDatabase(values);
      message.success("Database backup created successfully");
      setBackupModalVisible(false);
      form.resetFields();
      fetchBackups();
    } catch (error) {
      message.error("Failed to create backup");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!selectedBackup) return;

    setLoading(true);
    try {
      await apiService.restoreDatabase(selectedBackup.id);
      message.success("Database restored successfully");
      setRestoreModalVisible(false);
      setSelectedBackup(null);
      fetchDatabaseStats();
    } catch (error) {
      message.error("Failed to restore database");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadBackup = async (backupId) => {
    try {
      const response = await apiService.downloadBackup(backupId);
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `backup-${backupId}.db`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      message.error("Failed to download backup");
    }
  };

  const fetchBackupTable = async (backupId, tableName, page = 1, limit = 25) => {
    const data = await apiService.getBackupTableRows(
      backupId,
      tableName,
      page,
      limit
    );
    setViewerTable(tableName);
    setViewerRows(data.rows || []);
    setViewerPagination({
      current: data.pagination?.current || 1,
      pageSize: data.pagination?.pageSize || limit,
      total: data.pagination?.total || 0,
    });
  };

  const handleOpenViewer = async (backup) => {
    setViewerVisible(true);
    setViewerLoading(true);
    try {
      const data = await apiService.getBackupDetails(backup.id);
      setViewerArtifact(data.artifact);
      setViewerTables(data.tables || []);
      if ((data.tables || []).length > 0) {
        await fetchBackupTable(backup.id, data.tables[0], 1, 25);
      } else {
        setViewerTable(null);
        setViewerRows([]);
      }
    } catch (error) {
      message.error("Failed to load backup contents");
    } finally {
      setViewerLoading(false);
    }
  };

  const backupColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Contents",
      key: "counts",
      render: (_, record) =>
        `${record.counts?.exams || 0} exams • ${record.counts?.flashcards || 0} flashcards • ${record.counts?.words || 0} words`,
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      render: (size) => `${(size / 1024 / 1024).toFixed(2)} MB`,
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "completed"
              ? "green"
              : status === "generated"
              ? "blue"
              : "red"
          }
        >
          {status === "completed" ? (
            <CheckCircleOutlined />
          ) : status === "generated" ? (
            <ClockCircleOutlined />
          ) : (
            <ExclamationCircleOutlined />
          )}
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="View content">
            <Button size="small" onClick={() => handleOpenViewer(record)}>
              View
            </Button>
          </Tooltip>
          <Tooltip title="Download">
            <Button
              icon={<DownloadOutlined />}
              size="small"
              onClick={() => handleDownloadBackup(record.id)}
            />
          </Tooltip>
          <Tooltip title="Restore">
            <Button
              icon={<CloudUploadOutlined />}
              size="small"
              onClick={() => {
                setSelectedBackup(record);
                setRestoreModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              onClick={() => {
                Modal.confirm({
                  title: "Delete Backup",
                  content: "Are you sure you want to delete this backup?",
                  onOk: async () => {
                    try {
                      await apiService.deleteBackup(record.id);
                      message.success("Backup deleted successfully");
                      fetchBackups();
                    } catch (error) {
                      message.error("Failed to delete backup");
                    }
                  },
                });
              }}
            />
          </Tooltip>
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
        <h1>Database Management</h1>
        <Space>
          <Button
            icon={<SyncOutlined />}
            onClick={handleSync}
            loading={syncing}
          >
            Sync Database
          </Button>
          <Button
            icon={<CloudDownloadOutlined />}
            onClick={() => setBackupModalVisible(true)}
          >
            Create Backup
          </Button>
        </Space>
      </div>

      <Alert
        message="Database Information"
        description={`Version ${stats.version} • Last updated: ${
          stats.lastUpdated
            ? new Date(stats.lastUpdated).toLocaleString()
            : "Never"
        } • Artifacts: ${backups.length}`}
        type="info"
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

      <Card title="Database Backups" extra={<HistoryOutlined />}>
        <Table
          columns={backupColumns}
          dataSource={backups}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: "No generated databases yet." }}
        />
      </Card>

      {/* Backup Modal */}
      <Modal
        title="Create Database Backup"
        visible={backupModalVisible}
        onCancel={() => setBackupModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleBackup} layout="vertical">
          <Form.Item
            name="name"
            label="Backup Name"
            rules={[{ required: true, message: "Please enter backup name" }]}
          >
            <Input placeholder="Enter backup name" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={3} placeholder="Enter backup description" />
          </Form.Item>
          <Form.Item name="type" label="Backup Type" initialValue="full">
            <Select>
              <Option value="full">Full Backup</Option>
              <Option value="incremental">Incremental Backup</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Create Backup
              </Button>
              <Button onClick={() => setBackupModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Restore Modal */}
      <Modal
        title="Restore Database"
        visible={restoreModalVisible}
        onOk={handleRestore}
        onCancel={() => setRestoreModalVisible(false)}
        confirmLoading={loading}
        okText="Restore"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to restore the database from backup:</p>
        <p>
          <strong>{selectedBackup?.name}</strong>
        </p>
        <p>
          This action will replace the current database and cannot be undone.
        </p>
      </Modal>

      <Modal
        title={viewerArtifact ? `Database Content: ${viewerArtifact.name}` : "Database Content"}
        open={viewerVisible}
        onCancel={() => setViewerVisible(false)}
        footer={null}
        width={1100}
      >
        {viewerArtifact && (
          <Descriptions size="small" column={3} style={{ marginBottom: 16 }}>
            <Descriptions.Item label="Created">
              {new Date(viewerArtifact.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Size">
              {(viewerArtifact.size / 1024 / 1024).toFixed(2)} MB
            </Descriptions.Item>
            <Descriptions.Item label="Contents">
              {`${viewerArtifact.counts?.exams || 0} exams • ${viewerArtifact.counts?.flashcards || 0} flashcards • ${viewerArtifact.counts?.words || 0} words`}
            </Descriptions.Item>
          </Descriptions>
        )}
        <Tabs
          activeKey={viewerTable || undefined}
          onChange={(key) =>
            viewerArtifact && fetchBackupTable(viewerArtifact.id, key, 1, 25)
          }
          items={viewerTables.map((table) => ({
            key: table,
            label: table,
            children: (
              <Table
                loading={viewerLoading}
                dataSource={viewerRows}
                rowKey={(_, index) => `${table}-${index}`}
                scroll={{ x: true }}
                columns={
                  viewerRows.length > 0
                    ? Object.keys(viewerRows[0]).map((key) => ({
                        title: key,
                        dataIndex: key,
                        key,
                        render: (value) =>
                          typeof value === "object"
                            ? JSON.stringify(value)
                            : String(value),
                      }))
                    : []
                }
                pagination={{
                  current: viewerPagination.current,
                  pageSize: viewerPagination.pageSize,
                  total: viewerPagination.total,
                  onChange: (page, pageSize) =>
                    viewerArtifact &&
                    fetchBackupTable(viewerArtifact.id, table, page, pageSize),
                }}
              />
            ),
          }))}
        />
      </Modal>
    </div>
  );
};

export default DatabaseManagement;
