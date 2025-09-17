import React from "react";
import { Row, Col, Form, Input, message } from "antd";
import DefaultLayout from "../components/DefaultLayout";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { userRegister } from "../redux/actions/userActions";
import AOS from "aos";
import "aos/dist/aos.css"; // You can also use <link> for styles
// ..
AOS.init();

function Register() {
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.alertsReducer);

  function onFinish(values) {
    //check if password and confirm password are same
    if (values.password !== values.cpassword) {
      message.error("Password and Confirm Password do not match");
      return;
    } else {
      dispatch(userRegister(values));
    }
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
          {/* <img
            // data-aos="slide-right"
            // data-aos-duration="1500"
            // src="https://c1.wallpaperflare.com/preview/722/258/368/various-marriage-married-wedding.jpg"
            // className="loginimg"
          /> */}
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
            <h1>Register</h1>
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
            <Form.Item
              name="cpassword"
              label="Confirm Password"
              rules={[{ required: true }]}
            >
              <Input type="password" />
            </Form.Item>

            <button
              style={{
                backgroundColor: "#4d1c9c",
                width: "100%",
                color: "white",
                borderRadius: "5px",
                padding: "10px",
                border: "none",
                marginBottom: "10px",
              }}
            >
              Register
            </button>
            <br />
            <Link to={"/login"}>Click Here To Login</Link>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default Register;
