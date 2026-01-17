import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import classes from "./Header.module.css";
import logo from "../../../public/evangadi-logo.png";
import { Appstate } from "../../App";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";

const Header = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setUser } = useContext(Appstate);
  const isLoggedIn = localStorage.getItem("token");

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/auth/login");
    setMenuOpen(false);
  };

  return (
    <header className={classes.header}>
      <div className={classes.header_container}>
        {/* Logo */}
        <Link to="/" className={classes.logo}>
          <img src={logo} alt="Evangadi Logo" />
        </Link>

        {/* Hamburger */}
        <div
          className={classes.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </div>

        {/* Navigation */}
        <nav className={`${classes.nav} ${menuOpen ? classes.open : ""}`}>
          <Link to="/home" onClick={() => setMenuOpen(false)}>
            {t("header.home")}
          </Link>

          <Link to="/Howitworks" onClick={() => setMenuOpen(false)}>
            {t("header.howItWorks")}
          </Link>

          <LanguageSwitcher />

          {isLoggedIn ? (
            <button className={classes.authBtn} onClick={handleLogout}>
              {t("header.logout")}
            </button>
          ) : (
            <Link
              to="/auth/login"
              className={classes.authBtn}
              onClick={() => setMenuOpen(false)}
            >
              {t("header.signIn")}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
