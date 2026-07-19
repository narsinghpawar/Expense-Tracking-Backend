const Income = require("../model/Income");
const Expense = require("../model/Expense");

exports.getDashboardSummary = async (req, res) => {
  try {
    const income = await Income.aggregate([
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$amount" },
        },
      },
    ]);

    const expense = await Expense.aggregate([
      {
        $group: {
          _id: null,
          totalExpense: { $sum: "$amount" },
        },
      },
    ]);

    const totalIncome = income.length ? income[0].totalIncome : 0;
    const totalExpense = expense.length ? expense[0].totalExpense : 0;

    res.status(200).json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
