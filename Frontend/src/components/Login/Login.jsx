import React, { useContext, useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import api from "../../Utility/axios";
import style from "./Login.module.css";
import { Appstate } from "../../App";
import { useTranslation } from "react-i18next";

function Login() {
  const email = useRef(null);
  const password = useRef(null);
  const navigate = useNavigate();
  const { setUser } = useContext(Appstate);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    document.body.classList.add(style.slideIn);
    return () => document.body.classList.remove(style.slideIn);
  }, []);

  function showError(message) {
    setErrorMsg(message);
    setTimeout(() => setErrorMsg(""), 4000);
  }

  async function handleSubmit(e) {
    e.preventDefault();

  const emailValue = email.current.value.trim();
  const passwordValue = password.current.value.trim();


if (!emailValue || !passwordValue) {
  showError(t("errors.fillAll"));
  return;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(emailValue)) {
  showError(t("errors.invalidEmail"));
  return;
}

if (passwordValue.length < 8) {
  showError(t("errors.passwordLength"));
  return;
}

if (/\s/.test(passwordValue)) {
  showError(t("errors.passwordSpaces"));
  return;
}


    try {
      const { data } = await api.post("/user/login", {
        email: emailValue,
        password: passwordValue,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data);
      navigate("/home");
    } catch {
      showError(t("errors.invalidCredentials"));
    }
  }

  return (
    <div className={style.loginContainer}>
      <form className={style.loginForm} onSubmit={handleSubmit}>
        <h2 className={style.loginTitle}>{t("login.title")}</h2>

        {errorMsg && <div className={style.errorBox}>{errorMsg}</div>}

        <div className={style.formGroup}>
          <input ref={email} type="email" placeholder={t("login.email")} />
        </div>

        <div className={style.formGroup}>
          <div className={style.passwordWrapper}>
            <input
              ref={password}
              type={showPassword ? "text" : "password"}
              placeholder={t("login.password")}
            />
            <span
              className={style.eye}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeSlash /> : <Eye />}
            </span>
          </div>
        </div>

        <div className={style.links}>
          <Link to="/auth/forgotpassword">Forgot password?</Link>
        </div>

        <button className={style.loginBtn}>{t("login.submit")}</button>

        <p className={style.switchText}>
          No account? <Link to="/auth/register">Create one</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
