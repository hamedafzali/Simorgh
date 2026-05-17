import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
  message,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import apiService from "../services/api";

const CATEGORIES = [
  "Tax", "Integration", "Community", "Language", "Employment", "Legal",
  "Health", "Housing", "Education", "Culture", "Other",
];

const CATEGORY_COLORS = {
  Tax: "gold",
  Integration: "blue",
  Community: "green",
  Language: "purple",
  Employment: "orange",
  Legal: "red",
  Health: "cyan",
  Housing: "geekblue",
  Education: "lime",
  Culture: "magenta",
  Other: "default",
};

const CATEGORY_FA = {
  Tax: "مالیات", Integration: "یکپارچگی", Community: "جامعه",
  Language: "زبان", Employment: "اشتغال", Legal: "حقوقی",
  Health: "بهداشت", Housing: "مسکن", Education: "آموزش",
  Culture: "فرهنگ", Other: "سایر",
};

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form] = Form.useForm();

  async function load() {
    setLoading(true);
    try {
      const res = await apiService.getEvents();
      setEvents(res.events || []);
    } catch {
      message.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setEditingEvent(null);
    form.resetFields();
    form.setFieldsValue({ enabled: true, country: "DE", category: "Community" });
    setModalOpen(true);
  }

  function openEdit(record) {
    setEditingEvent(record);
    form.setFieldsValue({
      ...record,
      date: record.date ? dayjs(record.date) : null,
      endDate: record.endDate ? dayjs(record.endDate) : null,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        date: values.date ? values.date.format("YYYY-MM-DD") : null,
        endDate: values.endDate ? values.endDate.format("YYYY-MM-DD") : null,
        categoryFa: CATEGORY_FA[values.category] || values.category,
      };
      if (editingEvent) {
        await apiService.updateEvent(editingEvent.id, payload);
        message.success("Event updated");
      } else {
        await apiService.addEvent(payload);
        message.success("Event added");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      if (err?.errorFields) return;
      message.error(err?.response?.data?.error || "Save failed");
    }
  }

  async function handleDelete(id) {
    try {
      await apiService.deleteEvent(id);
      message.success("Event deleted");
      load();
    } catch {
      message.error("Delete failed");
    }
  }

  async function toggleEnabled(record) {
    try {
      await apiService.updateEvent(record.id, { enabled: !record.enabled });
      load();
    } catch {
      message.error("Toggle failed");
    }
  }

  const columns = [
    {
      title: "Enabled",
      dataIndex: "enabled",
      width: 80,
      render: (val, record) => (
        <Switch size="small" checked={val} onChange={() => toggleEnabled(record)} />
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      width: 120,
      render: (cat) => <Tag color={CATEGORY_COLORS[cat] || "default"}>{cat}</Tag>,
    },
    {
      title: "Title",
      dataIndex: "title",
      render: (title, record) => (
        <div>
          <div>{title}</div>
          {record.titleFa && (
            <div style={{ color: "#888", fontSize: 12, direction: "rtl" }}>{record.titleFa}</div>
          )}
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      width: 120,
      render: (d, r) => r.endDate ? `${d} → ${r.endDate}` : d,
    },
    {
      title: "Location",
      width: 130,
      render: (_, r) => [r.country, r.state, r.city].filter(Boolean).join(" / ") || "Nationwide",
    },
    {
      title: "Price",
      dataIndex: "price",
      width: 80,
    },
    {
      title: "Source",
      dataIndex: "source",
      width: 120,
    },
    {
      title: "Actions",
      width: 90,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(record)} />
          </Tooltip>
          <Popconfirm title="Delete this event?" onConfirm={() => handleDelete(record.id)}>
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Events</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
          Add Event
        </Button>
      </div>

      <Table
        dataSource={events}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 20 }}
        size="small"
      />

      <Modal
        title={editingEvent ? "Edit Event" : "Add Event"}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        width={680}
        okText="Save"
      >
        <Form form={form} layout="vertical" size="small">
          <Form.Item name="enabled" label="Enabled" valuePropName="checked">
            <Switch />
          </Form.Item>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Form.Item name="category" label="Category" rules={[{ required: true }]}>
              <Select>
                {CATEGORIES.map((c) => (
                  <Select.Option key={c} value={c}>{c}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="country" label="Country" rules={[{ required: true }]}>
              <Input placeholder="DE" maxLength={3} style={{ textTransform: "uppercase" }} />
            </Form.Item>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Form.Item name="state" label="State (optional)">
              <Input placeholder="Bayern" />
            </Form.Item>
            <Form.Item name="city" label="City (optional)">
              <Input placeholder="Munich" />
            </Form.Item>
          </div>

          <Form.Item name="title" label="Title (English)" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="titleFa" label="Title (Persian / فارسی)">
            <Input dir="rtl" />
          </Form.Item>

          <Form.Item name="description" label="Description (English)">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="descriptionFa" label="Description (Persian / فارسی)">
            <Input.TextArea rows={2} dir="rtl" />
          </Form.Item>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <Form.Item name="date" label="Date" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="endDate" label="End Date (optional)">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="time" label="Time (optional)">
              <Input placeholder="14:00" />
            </Form.Item>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Form.Item name="venue" label="Venue (optional)">
              <Input />
            </Form.Item>
            <Form.Item name="price" label="Price">
              <Input placeholder="Free / Paid / Subsidized / €10" />
            </Form.Item>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Form.Item name="link" label="Link (optional)">
              <Input placeholder="https://..." />
            </Form.Item>
            <Form.Item name="source" label="Source">
              <Input placeholder="BAMF / Community / ..." />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
