import React, { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import apiService from "../services/api";

function Login({ onLogin }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit({ password }) {
    setLoading(true);
    try {
      const { token } = await apiService.login(password);
      localStorage.setItem("admin_token", token);
      onLogin();
    } catch {
      message.error("Invalid password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#001529",
      }}
    >
      <Card
        title={
          <span style={{ fontSize: 18, fontWeight: "bold" }}>
            Simorgh Admin
          </span>
        }
        style={{ width: 360, borderRadius: 8 }}
      >
        <Form onFinish={handleSubmit} autoComplete="off">
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Enter your password" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Admin password"
              size="large"
              autoFocus
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Login;
