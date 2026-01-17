const db = require("../config/db");
const { StatusCodes } = require("http-status-codes");

// GET ANSWERS FOR QUESTION
async function getAnswers(req, res) {
  try {
    const question_id = req.params.question_id;
    if (!question_id || isNaN(question_id)) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "The requested question could not be found." });
    }
    const sql =
      "SELECT a.*, u.username FROM answerTable a JOIN userTable u ON a.user_id = u.user_id WHERE a.question_id = ? ORDER BY a.created_at ASC";
    const result = await db.execute(sql, [question_id]);
    res.status(StatusCodes.OK).json(result[0]);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "An unexpected error occurred." });
  }
}

// POST ANSWER
async function postAnswer(req, res) {
  const question_id = req.body.question_id;
  const answer = req.body.answer;
  const user_id = req.user.user_id;
  try {
    if (!question_id || !answer) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "All fields are required" });
    }

    const sql =
      "INSERT INTO answerTable (question_id, user_id, answer) VALUES (?, ?, ?)";

    await db.execute(sql, [question_id, user_id, answer]);

    res
      .status(StatusCodes.CREATED)
      .json({ message: "Answer posted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error posting answer" });
  }
}


// EDIT ANSWER
async function updateAnswer(req, res) {
  const { answer_id } = req.params;
  const { answer } = req.body;
  const user_id = req.user.user_id;

  try {
    const [rows] = await db.execute(
      "SELECT * FROM answerTable WHERE answer_id = ?",
      [answer_id],
    );

    if (rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Answer not found",
      });
    }

    if (rows[0].user_id !== user_id) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "You can only edit your own answer",
      });
    }

    await db.execute("UPDATE answerTable SET answer = ? WHERE answer_id = ?", [
      answer,
      answer_id,
    ]);

    res.status(StatusCodes.OK).json({ message: "Answer updated" });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to update answer",
    });
  }
}


// DELETE ANSWER
async function deleteAnswer(req, res) {
  const { answer_id } = req.params;
  const user_id = req.user.user_id;

  try {
    const [rows] = await db.execute(
      "SELECT * FROM answerTable WHERE answer_id = ?",
      [answer_id],
    );

    if (rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Answer not found",
      });
    }

    if (rows[0].user_id !== user_id) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "You can only delete your own answer",
      });
    }

    await db.execute("DELETE FROM answerTable WHERE answer_id = ?", [
      answer_id,
    ]);

    res.status(StatusCodes.OK).json({ message: "Answer deleted" });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to delete answer",
    });
  }
}


module.exports = { getAnswers, postAnswer, updateAnswer, deleteAnswer };
