import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Appstate } from "../../App";
import styles from "./Register.module.css";
import axios from "../../Utility/axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const navigate = useNavigate();
  const { setUser } = useContext(Appstate);
  const { t } = useTranslation();

  const [form, setForm] = useState({
    email: "",
    first_name: "",
    last_name: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const { email, first_name, last_name, username, password } = form;

    if (!email || !first_name || !last_name || !username || !password) {
      setError(t("errors.fillAll"));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t("errors.invalidEmail"));
      return;
    }

    if (username.length < 4) {
      setError(t("errors.usernameLength"));
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError(t("errors.usernameInvalid"));
      return;
    }

    if (password.length < 8) {
      setError(t("errors.passwordLength"));
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError(t("errors.passwordUppercase"));
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError(t("errors.passwordNumber"));
      return;
    }

    if (!/[!@#$%^&*]/.test(password)) {
      setError(t("errors.passwordSpecial"));
      return;
    }

    if (/\s/.test(password)) {
      setError(t("errors.passwordSpaces"));
      return;
    }

    try {
      await axios.post("/user/register", form);
      navigate("/auth/login");
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          err.response?.data?.message ||
          t("errors.registrationFailed"),
      );
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 style={{ textAlign: "center" }}>{t("signup.title")}</h2>
        <p className={styles.topText}>
          {t("signup.haveAccount")}{" "}
          <Link to="/auth/login">{t("signup.signIn")}</Link>
        </p>
        <form className={styles.form} onSubmit={submit}>
          <input
            className={styles.input}
            name="username"
            placeholder={t("signup.username")}
            value={form.username}
            onChange={change}
          />
          <div className={styles.row}>
            <input
              className={styles.input}
              name="first_name"
              placeholder={t("signup.firstName")}
              value={form.first_name}
              onChange={change}
            />
            <input
              className={styles.input}
              name="last_name"
              placeholder={t("signup.lastName")}
              value={form.last_name}
              onChange={change}
            />
          </div>
          <input
            className={styles.input}
            name="email"
            type="email"
            placeholder={t("signup.email")}
            value={form.email}
            onChange={change}
          />
          <div className={styles.passwordWrap}>
            <input
              className={styles.input}
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("signup.password")}
              value={form.password}
              onChange={change}
            />
            <span
              className={styles.eye}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <p className={styles.policy}>
            I agree to the <span>privacy policy</span> and{" "}
            <span>terms of service</span>.
          </p>
          <button type="submit" className={styles.primary}>
            {t("signup.agreeJoin")}
          </button>
        </form>
      </div>
    </div>
  );
}
