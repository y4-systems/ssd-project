/* global globalThis */
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// ✅ Helper for safe global object
function getGlobal() {
  return typeof globalThis === "undefined" ? window : globalThis;
}

const SsoHandler = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      console.warn("[SSO] no token in URL");
      navigate("/login", { replace: true });
      return;
    }

    try {
      const decoded = jwtDecode(token); // {_id, role?, username}
      // normalize to a simple "User" object so App.js sees someone logged in
      const user = {
        _id: decoded._id,
        username: decoded.username || decoded.email || "google_user",
        role: "User",
      };

      const g = getGlobal();
      g.localStorage.setItem("user", JSON.stringify(user));
      console.log("[SSO] user stored, redirecting to /home", user);

      // ✅ Use globalThis (fallback to window only if needed)
      g.location.replace("/home");
    } catch (e) {
      console.error("[SSO] jwt decode failed", e);
      navigate("/login", { replace: true });
    }
  }, [navigate, params]);

  return <p style={{ textAlign: "center", marginTop: 20 }}>Signing you in…</p>;
};

export default SsoHandler;
