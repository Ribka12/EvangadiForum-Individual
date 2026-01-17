import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "./ResetPassword.module.css";
import instance from "../../Utility/axios";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
 const [message, setMessage] = useState({ text: "", type: "" });


  async function handleSubmit(e) {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!password || !confirmPassword) {
      setMessage({
        text: "All fields are required",
        type: "error",
      });
      return;
    }

    if (password.length < 6) {
      setMessage({
        text: "Password must be at least 6 characters",
        type: "error",
      });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({
        text: "Passwords do not match",
        type: "error",
      });
      return;
    }

    try {
      await instance.post(`/user/reset-password/${token}`, { password });

      setMessage({
        text: "Password reset successful. Redirecting to login...",
        type: "success",
      });

      setTimeout(() => navigate("/auth/login"), 2000);
    } catch {
      setMessage({
        text: "Invalid or expired reset link",
        type: "error",
      });
    }

  }

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <Link to="/auth/login" className={styles.backLink}>
          ← Back to login
        </Link>

        <h3 className={styles.title}>Reset your password</h3>
        <p className={styles.subtitle}>Enter your new password below.</p>

        {message.text && (
          <div
            className={`${styles.message} ${
              message.type === "error" ? styles.error : styles.success
            }`}
          >
            {message.text}
          </div>
        )}

        <input
          type="password"
          placeholder="New password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm new password"
          className={styles.input}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit" className={styles.button}>
          Reset password
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
