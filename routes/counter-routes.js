const express = require("express");
const router = express.Router();
const { getCounterItems } = require("../controllers/counter-controller");

router.get("/", getCounterItems);

module.exports = router;
