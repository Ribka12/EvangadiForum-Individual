const express = require("express");
const router = express.Router();
const {
  register,
  login,
  checkUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

//register route
router.post("/register", register);
router.post("/login", login);
router.get("/check", authMiddleware, checkUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
