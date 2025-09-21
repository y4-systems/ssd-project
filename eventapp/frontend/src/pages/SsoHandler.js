import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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
      localStorage.setItem("user", JSON.stringify(user));
      console.log("[SSO] user stored, redirecting to /home", user);

      // Force a full reload so App remounts and switches route sets
      window.location.replace("/home");
    } catch (e) {
      console.error("[SSO] jwt decode failed", e);
      navigate("/login", { replace: true });
    }
  }, [navigate, params]);

  return <p style={{ textAlign: "center", marginTop: 20 }}>Signing you in…</p>;
};

export default SsoHandler;
