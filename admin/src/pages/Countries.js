import React, { useState, useEffect } from "react";
import {
  Table, Button, Switch, Space, message, Tag, Modal, Form,
  Input, Collapse, Row, Col, Divider, Popconfirm, Alert, Tooltip,
} from "antd";
import {
  PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined,
  GlobalOutlined, CheckCircleOutlined, SaveOutlined,
} from "@ant-design/icons";
import { apiService } from "../services/api";

const { Panel } = Collapse;

const ALL_FEATURES = [
  { key: "emergency", label: "Emergency", group: "Safety" },
  { key: "guides", label: "Guides", group: "Settlement" },
  { key: "checklist", label: "Checklist", group: "Settlement" },
  { key: "timeline", label: "Timeline", group: "Settlement" },
  { key: "deadlines", label: "Deadlines", group: "Settlement" },
  { key: "documents", label: "Documents", group: "Settlement" },
  { key: "reminders", label: "Reminders", group: "Settlement" },
  { key: "school", label: "School", group: "Settlement" },
  { key: "housing", label: "Housing", group: "Settlement" },
  { key: "tax", label: "Tax", group: "Settlement" },
  { key: "support", label: "Support", group: "Settlement" },
  { key: "forms", label: "Forms", group: "Settlement" },
  { key: "services", label: "Services", group: "Settlement" },
  { key: "phrasebook", label: "Phrasebook", group: "Language" },
  { key: "learning", label: "Learning", group: "Language" },
  { key: "events", label: "Events", group: "Community" },
  { key: "community", label: "Community", group: "Community" },
  { key: "chat", label: "Chat", group: "Community" },
  { key: "jobs", label: "Jobs", group: "Community" },
  { key: "countries", label: "Countries", group: "Navigation" },
  { key: "locations", label: "Locations", group: "Navigation" },
];
const FEATURE_GROUPS = ["Safety", "Settlement", "Language", "Community", "Navigation"];

const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [countryConfig, setCountryConfig] = useState({});
  const [globalFlags, setGlobalFlags] = useState({});
  const [loading, setLoading] = useState(false);
  const [savingFlags, setSavingFlags] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const [expandedCode, setExpandedCode] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [countriesRes, settingsRes] = await Promise.all([
        apiService.getCountries(),
        apiService.getSettings(),
      ]);
      setCountries(countriesRes.countries || []);
      setCountryConfig(settingsRes.settings?.countryConfig || {});
      setGlobalFlags(settingsRes.settings?.featureFlags || {});
    } catch {
      message.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // ── Country enable/disable ──────────────────────────────────────
  const toggleEnabled = async (code, enabled) => {
    try {
      await apiService.updateCountry(code, { enabled });
      setCountries(prev => prev.map(c => c.code === code ? { ...c, enabled } : c));
      message.success(`${code} ${enabled ? "enabled" : "disabled"}`);
    } catch {
      message.error("Failed to update country");
    }
  };

  // ── Add / Edit country ──────────────────────────────────────────
  const openAdd = () => {
    setEditingCountry(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (country) => {
    setEditingCountry(country);
    form.setFieldsValue(country);
    setModalOpen(true);
  };

  const handleModalSave = async () => {
    const values = await form.validateFields();
    values.code = values.code.toUpperCase();
    try {
      if (editingCountry) {
        const res = await apiService.updateCountry(editingCountry.code, values);
        setCountries(res.countries);
        message.success("Country updated");
      } else {
        const res = await apiService.addCountry(values);
        setCountries(res.countries);
        // seed empty feature flags for new country
        setCountryConfig(prev => ({
          ...prev,
          [values.code]: {
            enabled: false,
            name: values.name,
            features: Object.fromEntries(ALL_FEATURES.map(f => [f.key, false])),
          },
        }));
        message.success("Country added");
      }
      setModalOpen(false);
    } catch (err) {
      message.error(err?.response?.data?.error || "Failed to save country");
    }
  };

  const handleDelete = async (code) => {
    try {
      const res = await apiService.deleteCountry(code);
      setCountries(res.countries);
      message.success(`${code} deleted`);
    } catch {
      message.error("Failed to delete country");
    }
  };

  // ── Feature flags ───────────────────────────────────────────────
  const toggleFeature = (code, feature, value) => {
    setCountryConfig(prev => ({
      ...prev,
      [code]: {
        ...prev[code],
        features: { ...prev[code]?.features, [feature]: value },
      },
    }));
  };

  const bulkFeatures = (code, value) => {
    const features = Object.fromEntries(ALL_FEATURES.map(f => [f.key, value]));
    setCountryConfig(prev => ({
      ...prev,
      [code]: { ...prev[code], features },
    }));
  };

  const saveFlags = async () => {
    setSavingFlags(true);
    try {
      const settingsRes = await apiService.getSettings();
      await apiService.updateSettings({ ...settingsRes.settings, countryConfig });
      message.success("Feature flags saved");
    } catch {
      message.error("Failed to save feature flags");
    } finally {
      setSavingFlags(false);
    }
  };

  // ── Table columns ───────────────────────────────────────────────
  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      width: 80,
      render: (code) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: "Country",
      dataIndex: "name",
      render: (name, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>{name}</div>
          {record.localName && record.localName !== name && (
            <div style={{ fontSize: 12, color: "#888" }}>{record.localName}</div>
          )}
        </div>
      ),
    },
    {
      title: "Summary",
      dataIndex: "summary",
      render: (s) => <span style={{ color: "#666", fontSize: 13 }}>{s}</span>,
    },
    {
      title: "Enabled",
      dataIndex: "enabled",
      width: 100,
      render: (enabled, record) => (
        <Switch
          checked={enabled}
          onChange={(v) => toggleEnabled(record.code, v)}
          checkedChildren="ON"
          unCheckedChildren="OFF"
        />
      ),
    },
    {
      title: "Active Features",
      width: 130,
      render: (_, record) => {
        const cfg = countryConfig[record.code];
        const count = cfg ? ALL_FEATURES.filter(f =>
          !!cfg.features?.[f.key] && globalFlags[f.key] !== false
        ).length : 0;
        return (
          <Tag icon={<CheckCircleOutlined />} color={count > 0 ? "success" : "default"}>
            {count}/{ALL_FEATURES.length}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      width: 160,
      render: (_, record) => (
        <Space>
          <Tooltip title="Configure features">
            <Button
              size="small"
              icon={<SettingOutlined />}
              onClick={() => setExpandedCode(expandedCode === record.code ? null : record.code)}
              type={expandedCode === record.code ? "primary" : "default"}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          </Tooltip>
          <Popconfirm
            title={`Delete ${record.name}?`}
            onConfirm={() => handleDelete(record.code)}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete">
              <Button size="small" icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0 }}>Countries</h1>
          <p style={{ color: "#888", margin: "4px 0 0" }}>
            Manage which countries are available in the app and configure their features.
          </p>
        </div>
        <Space>
          <Button icon={<SaveOutlined />} loading={savingFlags} onClick={saveFlags}>
            Save Feature Flags
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
            Add Country
          </Button>
        </Space>
      </div>

      <Alert
        message="How it works"
        description="Enabling a country makes it visible in the app. The gear icon lets you configure which features are available for that country. Changes to feature flags require 'Save Feature Flags'."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Table
        dataSource={countries}
        columns={columns}
        rowKey="code"
        loading={loading}
        pagination={false}
        expandable={{
          expandedRowKeys: expandedCode ? [expandedCode] : [],
          showExpandColumn: false,
          expandedRowRender: (record) => {
            const cfg = countryConfig[record.code] || { features: {} };
            return (
              <div style={{ padding: "12px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>
                    Features for {record.name}
                  </span>
                  <Space>
                    <Button size="small" onClick={() => bulkFeatures(record.code, true)}>Enable All</Button>
                    <Button size="small" onClick={() => bulkFeatures(record.code, false)}>Disable All</Button>
                  </Space>
                </div>
                <Divider style={{ margin: "8px 0 16px" }} />
                {FEATURE_GROUPS.map(group => (
                  <div key={group} style={{ marginBottom: 16 }}>
                    <div style={{ fontWeight: 500, color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                      {group}
                    </div>
                    <Row gutter={[16, 8]}>
                      {ALL_FEATURES.filter(f => f.group === group).map(feature => {
                        const globalOn = globalFlags[feature.key] !== false;
                        const countryOn = !!cfg.features?.[feature.key];
                        const effectiveOn = globalOn && countryOn;
                        return (
                          <Col xs={12} sm={8} md={6} lg={4} key={feature.key}>
                            <Tooltip title={!globalOn ? "Disabled globally in Settings → Features" : ""}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <Switch
                                  size="small"
                                  checked={effectiveOn}
                                  onChange={(v) => toggleFeature(record.code, feature.key, v)}
                                  disabled={!globalOn}
                                />
                                <span style={{ fontSize: 13, color: !globalOn ? "#bbb" : "inherit" }}>
                                  {feature.label}
                                  {!globalOn && (
                                    <span style={{ fontSize: 10, color: "#f5222d", marginLeft: 4 }}>off</span>
                                  )}
                                </span>
                              </div>
                            </Tooltip>
                          </Col>
                        );
                      })}
                    </Row>
                  </div>
                ))}
              </div>
            );
          },
        }}
      />

      <Modal
        title={editingCountry ? `Edit ${editingCountry.name}` : "Add Country"}
        open={modalOpen}
        onOk={handleModalSave}
        onCancel={() => setModalOpen(false)}
        okText={editingCountry ? "Save" : "Add"}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="code"
            label="Country Code"
            rules={[
              { required: true, message: "Required" },
              { max: 3, message: "Max 3 characters" },
              { pattern: /^[A-Za-z]+$/, message: "Letters only" },
            ]}
          >
            <Input
              placeholder="DE"
              maxLength={3}
              style={{ textTransform: "uppercase" }}
              disabled={!!editingCountry}
            />
          </Form.Item>
          <Form.Item name="name" label="Name (English)" rules={[{ required: true }]}>
            <Input placeholder="Germany" />
          </Form.Item>
          <Form.Item name="localName" label="Local Name">
            <Input placeholder="Deutschland" />
          </Form.Item>
          <Form.Item name="summary" label="Summary">
            <Input placeholder="Short description shown in app" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Countries;
