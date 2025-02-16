const express = require("express");
const router = express.Router();
const { login, verifyToken } = require("../controllers/auth-controller");

router.post("/login", login);
router.get("/verify", verifyToken);

module.exports = router;
