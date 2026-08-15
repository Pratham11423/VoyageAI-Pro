const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  getPreferences,
  updatePreferences,
  uploadAvatar,
  deleteAccount,
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only images of type jpeg, jpg, png, or webp are allowed!"));
  },
});

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.route("/profile")
  .get(protect, getProfile)
  .put(protect, updateProfile)
  .delete(protect, deleteAccount);

router.route("/profile/preferences")
  .get(protect, getPreferences)
  .put(protect, updatePreferences);

router.post("/profile/avatar", protect, upload.single("avatar"), uploadAvatar);

module.exports = router;
