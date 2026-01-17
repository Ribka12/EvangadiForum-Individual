import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./ForgotPassword.module.css";
import instance from "../../Utility/axios";

function Forgotpassword() {
  const emailRef = useRef(null);
const [message, setMessage] = useState({ text: "", type: "" });


  useEffect(() => {
    document.body.classList.add(styles.slideIn);
    return () => document.body.classList.remove(styles.slideIn);
  }, []);


  async function handleSubmit(e) {
    e.preventDefault();

    const email = emailRef.current.value.trim();
   if (!email) {
     setMessage({
       text: "Please enter your email address",
       type: "error",
     });
     return;
   }

   try {
     await instance.post("/user/forgot-password", { email });

     setMessage({
       text: "If this email exists, a reset link has been sent.",
       type: "success",
     });
   } catch {
     setMessage({
       text: "Something went wrong. Try again later.",
       type: "error",
     });
   }

  }


  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        {/* Back to login */}
        <Link to="/auth/login" className={styles.backLink}>
          ← Back to login
        </Link>

        <h3 className={styles.title}>Forgot password?</h3>
        <p className={styles.subtitle}>
          Enter your email and we’ll send you a reset link.
        </p>

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
          ref={emailRef}
          type="email"
          placeholder="Email address"
          className={styles.input}
        />

        <button type="submit" className={styles.button}>
          Send reset link
        </button>
      </form>
    </div>
  );
}

export default Forgotpassword;
