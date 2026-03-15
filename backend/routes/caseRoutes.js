const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createCase,
  getCases,
} = require("../controllers/caseController");

router.post("/", authMiddleware, createCase);
router.get("/", authMiddleware, getCases);

module.exports = router;


