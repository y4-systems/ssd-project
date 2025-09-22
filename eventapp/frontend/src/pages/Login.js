/* eslint-env browser, es2020 */
/* global globalThis */

import React, { useEffect } from "react";
import { Row, Col, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../redux/actions/userActions";
import Spinner from "../components/Spinner";
import { jwtDecode } from "jwt-decode";
import AOS from "aos";
import "aos/dist/aos.css";

AOS.init();

const BACKEND_ORIGIN = "http://localhost:5003";

// ✅ Universal global object getter (SonarQube-friendly, no window usage)
function getGlobal() {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  // fallback for very old environments
  return Function("return this")();
}

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.alertsReducer);

  // If already logged in, go straight to /home
  useEffect(() => {
    const g = getGlobal();
    const u = g.localStorage?.getItem("user");
    if (u) navigate("/home", { replace: true });
  }, [navigate]);

  const onFinish = (values) => {
    dispatch(userLogin(values));
  };

  // --- Google popup sign-in flow ---
  const signInWithGooglePopup = () => {
    const g = getGlobal();

    const w = 520;
    const h = 600;

    const topCtx = g.top || g;
    const y = (topCtx.outerHeight || 0) / 2 + (topCtx.screenY || 0) - h / 2;
    const x = (topCtx.outerWidth || 0) / 2 + (topCtx.screenX || 0) - w / 2;

    const popup = g.open(
      `${BACKEND_ORIGIN}/auth/google?popup=1`,
      "google-oauth",
      `width=${w},height=${h},left=${x},top=${y},resizable=yes,scrollbars=yes,status=yes`
    );

    const onMessage = (e) => {
      // Only accept messages from your backend origin
      if (e.origin !== BACKEND_ORIGIN) return;
      if (!e.data || e.data.type !== "oauth-token") return;

      try {
        const decoded = jwtDecode(e.data.token);
        const user = {
          _id: decoded._id,
          username: decoded.username || decoded.email || "google_user",
          role: decoded.role || "User",
        };

        g.localStorage?.setItem("user", JSON.stringify(user));
        // ✅ Force a full reload so app state resets properly
        g.location.href = "/home";
      } catch (err) {
        // Properly handle the exception
        // eslint-disable-next-line no-console
        console.error("Google OAuth message handling failed:", err);
        navigate("/login", { replace: true });
      } finally {
        // Always clean up listeners and popup
        g.removeEventListener("message", onMessage);
        if (popup && !popup.closed) popup.close();
      }
    };

    g.addEventListener("message", onMessage);
  };

  return (
    <div className="login" style={{ overflowX: "hidden" }}>
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
