const express = require("express");

const router = express.Router();

const {
  addExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} = require("../controller/expenseController");

router.post("/add", addExpense);

router.get("/getAll", getAllExpenses);

router.get("/:id", getExpenseById);

router.put("/update/:id", updateExpense);

router.delete("/delete/:id", deleteExpense);

module.exports = router;
