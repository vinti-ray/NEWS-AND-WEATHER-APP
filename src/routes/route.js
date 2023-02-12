const express = require("express");
const router = express.Router();
const { newsLatest } = require("../controller/newsController");
const {weatherReport}=require("../controller/weather")

router.get("/news/:keyword", newsLatest);
router.get("/weather/:city",weatherReport)

module.exports = router;
