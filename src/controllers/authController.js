import User from "../models/User.js";
import { setAuthCookie, clearAuthCookie } from "../utils/cookies.js";
import { signToken } from "../utils/token.js";

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

function payloadFromRequest(req) {
  return req.method === "GET" ? req.query : req.body;
}

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

export async function register(req, res, next) {
  try {
    const payload = payloadFromRequest(req);
    const name = cleanString(payload?.name);
    const email = cleanString(payload?.email).toLowerCase();
    const password = cleanString(payload?.password);

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, and password are required." });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    if (name.length > 50) {
      return res.status(400).json({ message: "Name must not exceed 50 characters." });
    }

    if (email.length > 100) {
      return res.status(400).json({ message: "Email must not exceed 100 characters." });
    }

    if (password.length > 72) {
      return res.status(400).json({ message: "Password must not exceed 72 characters." });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "Registration failed. Please try again with different credentials." });
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user._id.toString());

    setAuthCookie(res, token);

    return res.status(201).json({
      message: "Registration successful.",
      user: sanitizeUser(user),
      token,
    });
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const payload = payloadFromRequest(req);
    const email = cleanString(payload?.email).toLowerCase();
    const password = cleanString(payload?.password);

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required." });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = signToken(user._id.toString());
    setAuthCookie(res, token);

    return res.status(200).json({
      message: "Login successful.",
      user: sanitizeUser(user),
      token,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getProfile(req, res) {
  return res.status(200).json({ user: sanitizeUser(req.user) });
}

export async function logout(req, res) {
  clearAuthCookie(res);
  return res.status(200).json({ message: "Logged out successfully." });
}
