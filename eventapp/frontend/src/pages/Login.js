// src/pages/Login.js
import React, { useEffect } from "react";
import { Row, Col, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../redux/actions/userActions";
import Spinner from "../components/Spinner";
import { jwtDecode } from "jwt-decode"; // v4 named export
import AOS from "aos";
import "aos/dist/aos.css";

AOS.init();

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.alertsReducer);

  // If already logged in, go straight to /home
  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) navigate("/home", { replace: true });
  }, [navigate]);

  const onFinish = (values) => {
    dispatch(userLogin(values));
  };

  // --- Google popup sign-in flow ---
  const signInWithGooglePopup = () => {
    const w = 520,
      h = 600;
    const y = window.top.outerHeight / 2 + window.top.screenY - h / 2;
    const x = window.top.outerWidth / 2 + window.top.screenX - w / 2;

    const popup = window.open(
      "http://localhost:5003/auth/google?popup=1",
      "google-oauth",
      `width=${w},height=${h},left=${x},top=${y},resizable=yes,scrollbars=yes,status=yes`
    );

    const onMessage = (e) => {
      // Only accept messages from your backend origin
      if (e.origin !== "http://localhost:5003") return;
      if (!e.data || e.data.type !== "oauth-token") return;

      try {
        const decoded = jwtDecode(e.data.token); // {_id, role, username}
        const user = {
          _id: decoded._id,
          username: decoded.username || decoded.email || "google_user",
          role: decoded.role || "User",
        };
        localStorage.setItem("user", JSON.stringify(user));

        window.removeEventListener("message", onMessage);
        if (popup && !popup.closed) popup.close();

        // Hard reload so App remounts into logged-in route set
        window.location.replace("/home");
      } catch (err) {
        window.removeEventListener("message", onMessage);
        if (popup && !popup.closed) popup.close();
        navigate("/login", { replace: true });
      }
    };

    window.addEventListener("message", onMessage);
  };

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
          <img alt="" />
        </Col>

        <Col lg={8} className="text-start p-5">
          <Form
            layout="vertical"
            className="login-form p-5"
            onFinish={onFinish}
            style={{ borderRadius: 0 }}
          >
            <h1>Login</h1>
            <p>Use your credentials or continue with Google</p>
            <hr />

            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: "Please enter username" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please enter password" }]}
            >
              <Input type="password" />
            </Form.Item>

            {/* Submit credentials */}
            <button
              type="submit"
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
              Login
            </button>

            {/* Google popup option */}
            <button
              type="button"
              onClick={signInWithGooglePopup}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "8px",
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontWeight: 600,
              }}
            >
              Continue with Google
            </button>

            <br />
            <Link to="/register">Not Registered? Click Here To Register</Link>
          </Form>
        </Col>
      </Row>
    </div>
  );
}
