import { Form, Input, Checkbox, Button } from "antd";
import { useState } from "react";
import { login } from "../../services/auth.service";
import "./login.scss";

export const Login = () => {
  //const [loading, setLoading] = useState<boolean>(false);
  //const [message, setMessage] = useState<string>("");

  // const handleLogin = (formValue: { username: string; password: string }) => {
  //   const { username, password } = formValue;
  //   //setMessage("");
  //   //setLoading(true);
    
  // };
  const onSubmit = (values: any) => {
    console.log("Success:", values);
    login(values.username, values.password).then(
      () => {
        //history.push("/profile");
        // window.location.reload();
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        // setLoading(false);
        // setMessage(resMessage);
      }
    );
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="Login">
      <div className="login-box">
        <Form
          name="login-form"
          initialValues={{ remember: true }}
          onFinish={onSubmit}
          onFinishFailed={onFinishFailed}
        >
          <p className="form-title">Welcome back</p>
          <p>Login to the Incident System</p>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
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
      </div>
    </div>
  );
};
