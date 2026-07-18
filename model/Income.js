const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    incomeSource: {
      type: String,
      required: true,
      enum: [
        "Salary",
        "Business",
        "Freelancing",
        "Rental Income",
        "Investment",
        "Interest",
        "Gift",
        "Bonus",
        "Refund",
        "Others",
      ],
    },

    incomeDate: {
      type: Date,
      required: true,
    },

    paymentMethod: {
      type: String,
      required: true,
      enum: [
        "Bank Transfer",
        "UPI",
        "Cash",
        "Credit Card",
        "Debit Card",
        "Cheque",
      ],
    },

    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Income", incomeSchema);
