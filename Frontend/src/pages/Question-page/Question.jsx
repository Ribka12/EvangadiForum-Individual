import React, { useContext, useState } from "react";
import { Appstate } from "../../App";
import instance from "../../Utility/axios";
import styles from "./Question.module.css";
import { Link, useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

const steps = [
  "Summarize your problem in a clear, one-line title.",
  "Describe your problem in more detail.",
  "Explain what you tried and what you expected to happen.",
  "Review your question and post it.",
];

export default function Question() {
  const { user } = useContext(Appstate);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");

  const showMessage = (text, type = "success") => {
    setMsg(text);
    setMsgType(type);
    setTimeout(() => {
      setMsg("");
      setMsgType("");
    }, 2000);
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!title && !description) {
      showMessage("Please fill in all required fields.", "error");
      return;
    }
    if (!title) {
      showMessage("Please fill in title field.", "error");
      return;
    }
    if (!description) {
      showMessage("Please fill in description field.", "error");
      return;
    }
    if (title.length < 5 && description.length < 10) {
      showMessage("Title length should be more than 5 character and description length should be more than 10.", "error");
      return;
    }
    if (title.length < 5) {
      showMessage("Title length should be more than 5 character.", "error");
      return;
    }
    if (description.length < 10) {
      showMessage(
        "Descriptin length should be more than 10 character.",
        "error",
      );
      return;
    }

    try {
      await instance.post(
        "/question/",
        { title, description },
        {
          headers: { Authorization: "Bearer " + token },
        },
      );

      setTitle("");
      setDescription("");
      showMessage("Question posted successfully!", "success");

      setTimeout(() => navigate("/home"), 1200);
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Failed to post question.",
        "error",
      );
    }
  };

  return (
    <>
      {/* Back Arrow */}
      <Link to="/home" className={styles.backArrow}>
        <KeyboardBackspaceIcon className={styles.icon} />
      </Link>

      <div className={styles.page}>
        {/* LEFT GUIDE */}
        <aside className={styles.guide}>
          <h2>Steps to write a good question</h2>
          <div className={styles.horizontal}></div>

          <ul>
            {steps.map((step, index) => (
              <li key={index}>
                <span className={styles.stepNumber}>{index + 1}</span>
                <p>{step}</p>
              </li>
            ))}
          </ul>
        </aside>

        {/* FORM */}
        <main className={styles.formWrapper}>
          <h1>Post Your Question</h1>

          <form className={styles.queform} onSubmit={submit}>
            <div className={styles.field}>
              <label>Question Title</label>
              <input
                type="text"
                placeholder="e.g. Why does my React component re-render twice?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <small>
                Be specific and imagine you’re asking another developer.
              </small>
            </div>

            <div className={styles.field}>
              <label>Question Details</label>
              <textarea
                rows="6"
                placeholder="Explain the problem, what you've tried, and what you're expecting..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <small>
                Include code snippets, errors, and expected behavior.
              </small>
            </div>

            {msg && (
              <div
                className={`${styles.status} ${
                  msgType === "success" ? styles.success : styles.error
                }`}
              >
                {msg}
              </div>
            )}

            <button type="submit" className={styles.submitBtn}>
              🚀 Post Question
            </button>
          </form>
        </main>
      </div>
    </>
  );
}
