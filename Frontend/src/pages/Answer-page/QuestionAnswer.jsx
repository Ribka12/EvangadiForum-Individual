import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../../Utility/axios";
import GiveAnswer from "./GiveAnswer";
import GetAnswer from "./GetAnswer";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import PeopleTwoToneIcon from "@mui/icons-material/PeopleTwoTone";
import styles from "./QuestionPage.module.css";
import { useTranslation } from "react-i18next";

function QuestionAnswer() {
  const [singleQuestion, setSingleQuestion] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { question_id } = useParams();
  const { t } = useTranslation();
  const token = localStorage.getItem("token");

  async function getSingleQuestion() {
    try {
      const { data } = await axios.get(`/question/${question_id}`, {
        headers: { Authorization: "Bearer " + token },
      });
      setSingleQuestion(data.question);
    } catch (error) {
      console.log(error.response);
    }
  }

  useEffect(() => {
    if (question_id) getSingleQuestion();
  }, [question_id]);

  if (!singleQuestion) {
    return (
      <div className={styles.spinnerWrapper}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return (
    <>
      {/* Back Arrow */}
      <Link to="/home" className={styles.backArrow}>
        <KeyboardBackspaceIcon className={styles.icon} />
      </Link>

      <div className={styles.container}>
        <div className={styles.page}>
          {/* QUESTION */}
          <section className={styles.questionCard}>
            <h5 className={styles.label}>QUESTION</h5>

            <h1 className={styles.title}>
              <span className={styles.arrow}>➜</span>
              {singleQuestion.title}
            </h1>

            <p className={styles.subtitle}>{singleQuestion.description}</p>
          </section>

          {/* ANSWERS HEADER */}
          <section className={styles.answers}>
            <div className={styles.community}>
              <PeopleTwoToneIcon sx={{ fontSize: 60 }} />
              <p>{t("question.community")}</p>
            </div>

            <GetAnswer refreshKey={refreshKey} />
          </section>

          {/* POST ANSWER */}
          <GiveAnswer onSuccess={() => setRefreshKey((prev) => prev + 1)} />
        </div>
      </div>
    </>
  );
}

export default QuestionAnswer;
