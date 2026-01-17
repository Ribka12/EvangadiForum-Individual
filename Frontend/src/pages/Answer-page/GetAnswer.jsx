import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "../../Utility/axios";
import PersonIcon from "@mui/icons-material/Person";
import Pagination from "../../components/Pagination/Pagination";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "./QuestionPage.module.css";

function GetAnswer({ refreshKey }) {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const { question_id } = useParams();
  const token = localStorage.getItem("token");
  const { t } = useTranslation();

  // ✅ Correct user object: must include user_id
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [emptyErrorOpen, setEmptyErrorOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  // ================= HANDLERS =================

  const handleEditClick = (answer) => {
    setEditingId(answer.answer_id);
    setEditedText(answer.answer);
  };

  const handleSave = async (answer_id) => {
    if (!editedText.trim()) {
      setEmptyErrorOpen(true);
      return;
    }

    try {
      await axios.put(
        `/answer/${answer_id}`,
        { answer: editedText },
        { headers: { Authorization: "Bearer " + token } },
      );
      setEditingId(null);
      setEditedText("");
      getAnswer(); // refresh answers
    } catch (error) {
      console.error(error);
      alert("Failed to update answer");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedText("");
  };

  const handleDeleteClick = (answer_id) => {
    setDeleteId(answer_id);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/answer/${deleteId}`, {
        headers: { Authorization: "Bearer " + token },
      });
      setDeleteId(null);
      getAnswer(); // refresh answers
    } catch (error) {
      console.error(error);
      alert("Failed to delete answer");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteId(null);
  };

  // ================= FETCH ANSWERS =================

  const getAnswer = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/answer/${question_id}`, {
        headers: { Authorization: "Bearer " + token },
      });
      setAnswers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err?.response || err);
      setAnswers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAnswer();
  }, [question_id, refreshKey]);

  const currentAnswers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return answers.slice(start, start + itemsPerPage);
  }, [answers, currentPage]);

  const totalPages = Math.ceil(answers.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [answers.length]);

  const formatDate = (dateString) => {
    if (!dateString) return t("common.recently", { defaultValue: "Recently" });
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

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>{t("common.loading")}</p>
      </div>
    );
  }

  if (answers.length === 0) {
    return (
      <div className={styles.noAnswer}>
        {t("question.noAnswers", { defaultValue: "No answers yet" })}
      </div>
    );
  }

  // ================= JSX =================

  return (
    <>
      {currentAnswers.map((a) => (
        <div key={a.answer_id} className={styles.answerCard}>
          <div className={styles.avatar}>
            {a.username?.charAt(0).toUpperCase() || <PersonIcon />}
            {console.log("answer user_id:", a.user)}
          </div>

          <div className={styles.answerContent}>
            {/* Header: username + time + actions */}
            <div className={styles.answerHeader}>
              <div>
                <span className={styles.username}>{a.username}</span>
                <span
                  style={{
                    opacity: 0.6,
                    marginLeft: "30px",
                    fontSize: "0.9rem",
                  }}
                  className={styles.questionTime}
                >
                  {formatDate(a.created_at)}
                </span>
              </div>

              {/* EDIT / DELETE ICONS */}
              {a.user_id === user?.user_id && (
                <div className={styles.answerActions}>
                  <EditIcon
                    fontSize="medium"
                    onClick={() => handleEditClick(a)}
                  />
                  <DeleteIcon
                    fontSize="medium"
                    onClick={() => handleDeleteClick(a.answer_id)}
                  />
                </div>
              )}
            </div>

            {/* Answer Body */}
            {editingId === a.answer_id ? (
              <>
                <textarea
                  className={styles.editTextarea}
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
                <div className={styles.editButtons}>
                  <button onClick={() => handleSave(a.answer_id)}>Save</button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </div>
              </>
            ) : (
              <p>{a.answer}</p>
            )}
          </div>
        </div>
      ))}

      {/* EMPTY ANSWER ERROR MODAL */}
      {emptyErrorOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>⚠️ Empty Answer</h3>
            <p>
              Your answer cannot be empty. Please write something before saving.
            </p>
            <div className={styles.modalButtons}>
              <button
                className={styles.deleteBtn}
                onClick={() => setEmptyErrorOpen(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteId && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>⚠️ Delete Answer?</h3>
            <p>This action cannot be undone.</p>
            <div className={styles.modalButtons}>
              <button
                className={styles.deleteBtn}
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
              <button
                className={styles.deleteBtn}
                style={{
                  backgroundColor: "#b0afafff",
                }}
                onClick={handleDeleteCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className={styles.answersPagination}>
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onChange={setCurrentPage}
          />
        </div>
      )}
    </>
  );
}

export default GetAnswer;
