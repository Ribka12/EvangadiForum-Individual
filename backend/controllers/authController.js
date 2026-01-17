const db = require("../config/db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

// 1. register user
async function register(req, res) {
  const { username, first_name, last_name, email, password } = req.body;

  if (!email || !password || !first_name || !last_name || !username) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please provide all the required field" });
  }
  try {
    const [user] = await db.query(
      "select username,user_id from userTable where username =? or email=?",
      [username, email],
    );
    if (user.length > 0) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ msg: "user already exists" });
    }
    //to limit length of password

    if (password.length <= 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "password must be at least 8 characters" });
    }
    //TO encrypt the password...
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    await db.query(
      "INSERT INTO userTable (username,first_name,last_name,email,password) VALUES (?,?,?,?,?)",
      [username, first_name, last_name, email, hashedPassword],
    );
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "User registered successfully" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occured" });
  }
}

// 2. login user
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please enter all required fields" });
  }

  try {
    const [user] = await db.query(
      "select username,user_id,password from userTable where email = ? ",
      [email],
    );

    if (user.length === 0) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "invalid credential" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user[0].password);

    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "invalid credential" });
    }

    const username = user[0].username;
    const user_id = user[0].user_id;
    const token = jwt.sign({ username, user_id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(StatusCodes.OK).json({
      msg: "user login successful",
      token,
      username,
      user_id,
      user: {
        user_id: user_id,
        username: username,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong, try again later!" });
  }
}

// 3. check user
async function checkUser(req, res) {
  const { user_id, username } = req.user;

  return res.status(StatusCodes.OK).json({
    message: "Valid user",
    user_id,
    username,
  });
}

//Forgot password
async function forgotPassword(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // 1. Check if user exists
    const [users] = await db.query(
      "SELECT user_id FROM userTable WHERE email = ?",
      [email],
    );

    // Always respond the same (security best practice)
    if (users.length === 0) {
      return res.status(200).json({
        message: "If this email exists, a reset link has been sent.",
      });
    }

    // 2. Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // 3. Token expiry (15 minutes)
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    // 4. Save token to DB
    await db.query(
      "UPDATE userTable SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
      [hashedToken, expiry, email],
    );

    // 5. Create reset link (ABSOLUTE URL REQUIRED)
    const resetLink = `https://evangadiforum.ribkamengiste.com/auth/reset-password/${resetToken}`;

    // 6. Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password
      },
    });

    await transporter.sendMail({
      from: `"Evangadi Forum" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <h3>Password Reset</h3>
        <p>You requested to reset your password.</p>
        <p>Click the link below to continue:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 15 minutes.</p>
      `,
    });

    return res.status(200).json({
      message: "If this email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

//Reset password
async function resetPassword(req, res) {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters",
    });
  }

  // Hash token to compare with DB
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  try {
    // 1. Find valid token
    const [users] = await db.query(
      `SELECT user_id FROM userTable
       WHERE reset_token = ?
       AND reset_token_expiry > NOW()`,
      [hashedToken],
    );

    if (users.length === 0) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    // 2. Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Update password and clear token
    await db.query(
      `UPDATE userTable
       SET password = ?, reset_token = NULL, reset_token_expiry = NULL
       WHERE user_id = ?`,
      [hashedPassword, users[0].user_id],
    );

    return res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = { register, login, checkUser, forgotPassword, resetPassword };
