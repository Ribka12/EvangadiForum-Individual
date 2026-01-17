const express = require("express");
const router = express.Router();
const {
  postAnswer,
  getAnswers,
  updateAnswer,
  deleteAnswer,
} = require("../controllers/answerController");

router.get("/:question_id", getAnswers);
router.post("/", postAnswer);

router.put("/:answer_id", updateAnswer);
router.delete("/:answer_id", deleteAnswer);

module.exports = router;
