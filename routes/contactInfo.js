const express = require("express");
const router = express.Router();
const contactInfoController = require("../controllers/contact-info-controller");

// Routes
router.get("/", contactInfoController.findAll);
router.post("/", contactInfoController.create);
router.put("/:id", contactInfoController.update);
router.delete("/:id", contactInfoController.delete);

module.exports = router;
