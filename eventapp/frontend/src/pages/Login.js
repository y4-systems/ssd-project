import React from "react";
import { Row, Col, Form, Input } from "antd";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../redux/actions/userActions";
import AOS from "aos";
import Spinner from "../components/Spinner";
import "aos/dist/aos.css"; // You can also use <link> for styles
// ..
AOS.init();

function Login() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alertsReducer);

  function onFinish(values) {
    dispatch(userLogin(values));
    console.log(values);
  }

  return (
    <div
      className="login"
      style={{
        overflowX: "hidden",
      }}
    >
      {loading && <Spinner />}
      <Row gutter={16} className="d-flex align-items-center">
        <Col lg={16} style={{ position: "relative" }}>
          <img
          // data-aos="slide-right"
          // data-aos-duration="1500"
          // src="https://images.unsplash.com/photo-1621621667797-e06afc217fb0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          // className="loginimg"
          />
        </Col>
        <Col lg={8} className="text-start p-5">
          <Form
            layout="vertical"
            className="login-form p-5"
            onFinish={onFinish}
            style={{
              borderRadius: "0px",
            }}
          >
            <h1>Login</h1>
            <p>Enter your login credentials again</p>
            <hr />
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true }]}
            >
              <Input type="password" />
            </Form.Item>

            <button
              style={{
                backgroundColor: "#4d1c9c",
                width: "100%",
                // textTransform: "uppercase",
                color: "white",
                borderRadius: "5px",
                padding: "10px",
                border: "none",
                marginBottom: "10px",
              }}
            >
              Login
            </button>
            <br />
            <Link to={"/register"}>Not Registered? Click Here To Register</Link>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default Login;
