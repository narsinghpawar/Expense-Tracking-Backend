const Income = require("../model/Income");
const Expense = require("../model/Expense");

exports.getDashboardReport = async (req, res) => {
  try {
    const { type, fromDate, toDate } = req.query;

    let incomeFilter = {};
    let expenseFilter = {};

    // ==========================
    // Date Range Filter
    // ==========================

    if (fromDate && toDate) {
      incomeFilter.incomeDate = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };

      expenseFilter.expenseDate = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    }

    // ==========================
    // Monthly / Weekly / Yearly
    // ==========================

    const today = new Date();

    if (type === "Monthly") {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      incomeFilter.incomeDate = {
        $gte: start,
        $lte: end,
      };

      expenseFilter.expenseDate = {
        $gte: start,
        $lte: end,
      };
    }

    if (type === "Yearly") {
      const start = new Date(today.getFullYear(), 0, 1);
      const end = new Date(today.getFullYear(), 11, 31);

      incomeFilter.incomeDate = {
        $gte: start,
        $lte: end,
      };

      expenseFilter.expenseDate = {
        $gte: start,
        $lte: end,
      };
    }

    if (type === "Weekly") {
      const first = today.getDate() - today.getDay();

      const start = new Date(today.setDate(first));

      const end = new Date(start);

      end.setDate(start.getDate() + 6);

      incomeFilter.incomeDate = {
        $gte: start,
        $lte: end,
      };

      expenseFilter.expenseDate = {
        $gte: start,
        $lte: end,
      };
    }

    // ==========================
    // Summary
    // ==========================

    const incomeResult = await Income.aggregate([
      {
        $match: incomeFilter,
      },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const expenseResult = await Expense.aggregate([
      {
        $match: expenseFilter,
      },
      {
        $group: {
          _id: null,
          totalExpense: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalIncome =
      incomeResult.length > 0 ? incomeResult[0].totalIncome : 0;

    const totalExpense =
      expenseResult.length > 0 ? expenseResult[0].totalExpense : 0;

    const balance = totalIncome - totalExpense;

    // ==========================
    // Monthly Income
    // ==========================

    const monthlyIncome = await Income.aggregate([
      {
        $match: incomeFilter,
      },
      {
        $group: {
          _id: {
            month: {
              $month: "$incomeDate",
            },
          },
          income: {
            $sum: "$amount",
          },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    // ==========================
    // Monthly Expense
    // ==========================

    const monthlyExpense = await Expense.aggregate([
      {
        $match: expenseFilter,
      },
      {
        $group: {
          _id: {
            month: {
              $month: "$expenseDate",
            },
          },
          expense: {
            $sum: "$amount",
          },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    // ==========================
    // Merge Monthly
    // ==========================

    const monthNames = [
      "",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthly = [];

    for (let i = 1; i <= 12; i++) {
      monthly.push({
        month: monthNames[i],
        income: monthlyIncome.find((x) => x._id.month === i)?.income || 0,
        expense: monthlyExpense.find((x) => x._id.month === i)?.expense || 0,
      });
    }

    // ==========================
    // Categories
    // ==========================

    const categories = await Expense.aggregate([
      {
        $match: expenseFilter,
      },
      {
        $group: {
          _id: "$category",
          amount: {
            $sum: "$amount",
          },
        },
      },
      {
        $sort: {
          amount: -1,
        },
      },
    ]);

    // ==========================
    // Recent Transactions
    // ==========================

    const incomeTransactions = await Income.find(incomeFilter)
      .sort({ createdAt: -1 })
      .limit(5);

    const expenseTransactions = await Expense.find(expenseFilter)
      .sort({ createdAt: -1 })
      .limit(5);

    const recentTransactions = [
      ...incomeTransactions.map((item) => ({
        title: item.title,
        amount: item.amount,
        type: "Income",
        date: item.incomeDate,
      })),

      ...expenseTransactions.map((item) => ({
        title: item.title,
        amount: item.amount,
        type: "Expense",
        date: item.expenseDate,
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    res.json({
      success: true,
      data: {
        summary: {
          totalIncome,
          totalExpense,
          balance,
        },
        monthly,
        categories,
        recentTransactions,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
