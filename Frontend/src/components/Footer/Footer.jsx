import React from "react";
import classes from "./Footer.module.css";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import logo from "../../../public/evangadi-logo.png";

const Footer = () => {
  return (
    <footer className={classes.footer}>
      <div className={classes.footer_container}>
        {/* LEFT - Logo & Socials */}
        <div className={classes.footer_left}>
          <img src={logo} alt="Evangadi Logo" />
          <p className={classes.footer_desc}>
            Empowering global learners with innovative online solutions.
          </p>
          <div className={classes.social_icons}>
            <a href="#" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* MIDDLE - Useful Links */}
        <div className={classes.footer_middle}>
          <h3>Useful Links</h3>
          <ul>
            <li>
              <a href="#">How it Works</a>
            </li>
            <li>
              <a href="#">Terms of Service</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Support</a>
            </li>
          </ul>
        </div>

        {/* RIGHT - Contact Info */}
        <div className={classes.footer_right}>
          <h3>Contact Info</h3>
          <ul>
            <li>Evangadi Networks</li>
            <li>
              <a href="mailto:support@evangadi.com">support@evangadi.com</a>
            </li>
            <li>
              <a href="tel:+12023862702">+1-202-386-2702</a>
            </li>
          </ul>
        </div>
      </div>

      <div className={classes.footer_bottom}>
        <p>
          © {new Date().getFullYear()} Evangadi Networks. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
