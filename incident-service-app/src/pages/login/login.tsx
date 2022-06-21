import { Form, Input, Button, Spin, Alert } from "antd";
import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { login } from "../../services/auth.service";
import "./Login.scss";

const Login = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  const onSubmit = (values: any) => {
    setLoading(true);
    login(values.username, values.password)
      .then(
        (response) => {
          return navigate("/");
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setMessage(resMessage);
        }
      )
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="Login">
      <div className="login-box">
        {loading ? (
          <Spin size="large" />
        ) : (
          <Form
            name="login-form"
            initialValues={{ remember: true }}
            onFinish={onSubmit}
          >
            <p className="form-title">Welcome back</p>
            <p>Login to the Incident System</p>
            {message && (
              <Alert
                showIcon
                style={{ marginBottom: 10 }}
                message={message}
                type="error"
              />
            )}
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                LOGIN
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </div>
  );
};
export default Login;
function useHistory() {
  throw new Error("Function not implemented.");
}
