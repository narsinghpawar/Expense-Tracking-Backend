const express = require("express");
const router = express.Router();

const { getDashboardReport } = require("../controller/reportController");

router.get("/dashboard", getDashboardReport);

module.exports = router;
