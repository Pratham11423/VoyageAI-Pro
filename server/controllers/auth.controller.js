const jwt = require("jsonwebtoken");
const User = require("../models/User");
const UserPreference = require("../models/UserPreference");
const { JWT_SECRET } = require("../middleware/auth");

const signToken = (userId, email, name, role) => {
  return jwt.sign({ userId, email, name, role }, JWT_SECRET, { expiresIn: "7d" });
};

// @desc    Register a new user
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please provide name, email and password." });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "User already exists with this email." });
    }

    const user = await User.create({ name, email, password });
    
    // Create default preferences
    const preferences = await UserPreference.create({
      userId: user._id,
      defaultCurrency: "USD",
      preferredInterests: [],
      pacePreference: "moderate",
    });

    const token = signToken(user._id, user.email, user.name, user.role);

    return res.status(201).json({
      message: "Registration successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      preferences,
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please provide email and password." });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const preferences = await UserPreference.findOne({ userId: user._id });
    const token = signToken(user._id, user.email, user.name, user.role);

    return res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      preferences,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
const logout = async (req, res) => {
  return res.status(200).json({ message: "Successfully logged out." });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
const getProfile = async (req, res) => {
  try {
    const user = req.user;
    const preferences = await UserPreference.findOne({ userId: user._id });

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      preferences: preferences || null,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// @desc    Update user profile & preferences
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const user = req.user;
    const { name, preferredInterests, pacePreference, defaultCurrency } = req.body;

    if (name) {
      user.name = name.trim();
      await user.save();
    }

    let prefs = await UserPreference.findOne({ userId: user._id });
    if (prefs) {
      if (defaultCurrency !== undefined) prefs.defaultCurrency = defaultCurrency;
      if (preferredInterests !== undefined) prefs.preferredInterests = preferredInterests;
      if (pacePreference !== undefined) prefs.pacePreference = pacePreference;
      await prefs.save();
    } else {
      prefs = await UserPreference.create({
        userId: user._id,
        defaultCurrency: defaultCurrency || "USD",
        preferredInterests: preferredInterests || [],
        pacePreference: pacePreference || "moderate",
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      preferences: prefs,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ error: "Failed to update profile." });
  }
};

// @desc    Get user preferences
// @route   GET /api/auth/profile/preferences
const getPreferences = async (req, res) => {
  try {
    let preferences = await UserPreference.findOne({ userId: req.user._id });
    if (!preferences) {
      preferences = await UserPreference.create({
        userId: req.user._id,
        defaultCurrency: "USD",
        preferredInterests: [],
        pacePreference: "moderate",
      });
    }
    return res.status(200).json({ preferences });
  } catch (error) {
    return res.status(500).json({ error: "Failed to load preferences." });
  }
};

// @desc    Update user preferences
// @route   PUT /api/auth/profile/preferences
const updatePreferences = async (req, res) => {
  try {
    const { defaultCurrency, preferredInterests, pacePreference, dietaryRestrictions, accommodationStyle } = req.body;
    let preferences = await UserPreference.findOne({ userId: req.user._id });
    
    if (!preferences) {
      preferences = new UserPreference({ userId: req.user._id });
    }

    if (defaultCurrency !== undefined) preferences.defaultCurrency = defaultCurrency;
    if (preferredInterests !== undefined) preferences.preferredInterests = preferredInterests;
    if (pacePreference !== undefined) preferences.pacePreference = pacePreference;
    if (dietaryRestrictions !== undefined) preferences.dietaryRestrictions = dietaryRestrictions;
    if (accommodationStyle !== undefined) preferences.accommodationStyle = accommodationStyle;

    await preferences.save();

    return res.status(200).json({ preferences });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update preferences." });
  }
};

// @desc    Upload avatar
// @route   POST /api/auth/profile/avatar
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload an image file." });
    }
    const avatarPath = `/uploads/${req.file.filename}`;
    
    const user = req.user;
    user.avatar = avatarPath;
    await user.save();

    return res.status(200).json({ avatar: avatarPath, message: "Avatar uploaded successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Failed to upload avatar." });
  }
};

// @desc    Delete user account
// @route   DELETE /api/auth/profile
const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    await UserPreference.findOneAndDelete({ userId: req.user._id });
    return res.status(200).json({ message: "Account deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete account." });
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  getPreferences,
  updatePreferences,
  uploadAvatar,
  deleteAccount,
};
