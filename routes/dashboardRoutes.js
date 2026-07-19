const express = require("express");
const router = express.Router();
const { getDashboardSummary } = require("../controller/getDashboardSummary");

console.log("dashboardRoutes.js loaded");
router.get("/summary", getDashboardSummary);

module.exports = router;
