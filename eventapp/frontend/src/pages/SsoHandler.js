/* eslint-env browser, es2020 */
/* global globalThis */
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// ✅ Helper for safe global object (SonarQube-friendly, no window usage)
function getGlobal() {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  return new Function("return this")(); // fallback
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
      const user = {
        _id: decoded._id,
        username: decoded.username || decoded.email || "google_user",
        role: "User",
      };

      const g = getGlobal();
      g.localStorage.setItem("user", JSON.stringify(user));
      console.log("[SSO] user stored, redirecting to /home", user);

      // ✅ Hard reload so App state remounts and picks up the user
      g.location.href = "/home";
    } catch (e) {
      console.error("[SSO] jwt decode failed", e);
      navigate("/login", { replace: true });
    }
  }, [navigate, params]);

  return <p style={{ textAlign: "center", marginTop: 20 }}>Signing you in…</p>;
};

export default SsoHandler;
