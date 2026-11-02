const express = require("express");
const router = express.Router();

const {
    checkFact
} = require("../controllers/factCheckController");

router.post("/", checkFact);

module.exports = router;