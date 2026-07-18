const express = require("express");

const router = express.Router();

const {
  addIncome,
  getAllIncome,
  getIncomeById,
  updateIncome,
  deleteIncome,
} = require("../controller/incomeController");

router.post("/add", addIncome);
router.get("/getAll", getAllIncome);
router.get("/:id", getIncomeById);
router.put("/update/:id", updateIncome);
router.delete("/delete/:id", deleteIncome);

module.exports = router;
