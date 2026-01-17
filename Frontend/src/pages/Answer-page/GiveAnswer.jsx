import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../Utility/axios";
import styles from "./QuestionPage.module.css";
import { useTranslation } from "react-i18next";

function GiveAnswer({ onSuccess }) {
  const answer = useRef();
  const [error, setError] = useState("");
  const [msg, setmsg] = useState("");
  const { question_id } = useParams();
  const { t } = useTranslation();
  const token = localStorage.getItem("token");

  setTimeout(() => {
    setmsg("");
  }, 2000);

  async function handleSubmit(e) {
    e.preventDefault();
    const value = answer.current.value.trim();

    if (!value) {
      setError("Please provide your answer");
      return;
    }
    if (value.length < 10) {
      setError("Your answer is too short");
      return;
    }

    try {
      await axios.post(
        "/answer",
        { question_id, answer: value },
        { headers: { Authorization: "Bearer " + token } },
      );
      answer.current.value = "";
      setError("");
      setmsg("success");
      onSuccess();
    } catch {
      setError("Something went wrong!");
    }
  }

  return (
    <section className={styles.postAnswer}>
      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <textarea ref={answer} placeholder={t("question.answerPlaceholder")} />

        {msg && (
          <div className={styles.success}>{t("question.postSuccess")}</div>
        )}

        <button type="submit">{t("question.postButton")}</button>
      </form>
    </section>
  );
}

export default GiveAnswer;
