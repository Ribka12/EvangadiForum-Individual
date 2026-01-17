import PersonIcon from "@mui/icons-material/Person";
import ArrowForwardIosTwoToneIcon from "@mui/icons-material/ArrowForwardIosTwoTone";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./Home.module.css";
import instance from "../../Utility/axios";
import { Appstate } from "../../App";
import Pagination from "../../components/Pagination/Pagination";

function Home() {
  const { user } = useContext(Appstate);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [questions, setQuestions] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3); // 3 questions per page

  useEffect(() => {
    if (!user) return;

    async function fetchQuestions() {
      const token = localStorage.getItem("token");
      try {
        setLoading(true);
        const { data } = await instance.get("/question", {
          headers: { Authorization: "Bearer " + token },
        });
        const list = data.questions || data || [];
        setQuestions(list);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setQuestions([]);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [navigate, user]);

  // FILTER QUESTIONS
  const filteredQuestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return questions;

    return questions.filter((item) => {
      const title = (item.title || "").toLowerCase();
      const description = (
        item.description ||
        item.content ||
        ""
      ).toLowerCase();
      const userName = (item.username || item.user_name || "").toLowerCase();
      return (
        title.includes(q) || description.includes(q) || userName.includes(q)
      );
    });
  }, [questions, query]);

  // GET CURRENT PAGE QUESTIONS
  const currentQuestions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredQuestions.slice(startIndex, endIndex);
  }, [filteredQuestions, currentPage, itemsPerPage]);

  // CALCULATE TOTAL PAGES
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);

  // RESET TO PAGE 1 WHEN SEARCH CHANGES
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  // FORMAT DATE
  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleAskQuestion = () => {
    navigate("/ask");
  };

  const handleQuestionClick = (questionId) => {
    navigate(`/answer/${questionId}`);
  };

  // GET USERNAME
  const getUsername = () => {
    if (user?.username) {
      return user.username.charAt(0).toUpperCase() + user.username.slice(1);
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        return userData.username;
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.username || payload.email || "User";
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }

    return "User";
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <div className={styles.container} id="top">
      <div className={styles.content}>
        {/* TOP BAR */}
        <div className={styles.topBar}>
          <button onClick={handleAskQuestion} className={styles.askBtn}>
            {t("home.askQuestion")}
          </button>

          <p className={styles.welcome}>
            {t("home.welcome")} <span >{getUsername()}</span>
          </p>
        </div>

        {/* SEARCH */}
        <input
          className={styles.search}
          placeholder={t("home.searchPlaceholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* QUESTIONS */}
        <div className={styles.list}>
          {currentQuestions.length > 0 ? (
            currentQuestions.map((item) => {
              const questionId = item.question_id || item.id;

              return (
                <div
                  key={questionId}
                  className={styles.card}
                  onClick={() => handleQuestionClick(questionId)}
                >
                  {/* USER */}
                  <div className={styles.user}>
                    <div className={styles.avatar}>
                      <PersonIcon sx={{ fontSize: 52 }} />
                    </div>
                    <span className={styles.username}>
                      {item.username || item.user_name}
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div className={styles.cardContent}>
                    <div className={styles.titleRow}>
                      <h3 className={styles.title}>
                        {item.title || item.content}
                      </h3>
                      <span className={styles.time}>
                        {formatDate(item.created_at)}
                      </span>
                    </div>

                    {item.description && (
                      <p className={styles.description}>{item.description.length < 50 ? item.description : item.description.slice(0, 50) + "..."}</p>
                    )}
                  </div>

                  {/* ARROW */}
                  <div className={styles.arrow}>
                    <ArrowForwardIosTwoToneIcon fontSize="large" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.noQuestions}>{t("home.empty")}</div>
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className={styles.paginationCenter}>
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onChange={setCurrentPage}
              labels={{
                prev: t("pagination.prev"),
                next: t("pagination.next"),
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
