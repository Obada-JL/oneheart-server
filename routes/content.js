const express = require("express");
const router = express.Router();
const { getContent, addContent } = require("../controllers/content-controller");

router.get("/", getContent);
router.post("/", addContent);

module.exports = router;
