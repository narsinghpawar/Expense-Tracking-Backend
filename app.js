require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const expenseRoutes = require("./routes/expenseRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const app = express();

// Connect to MongoDB
connectDB();
app.use(cors());
app.use(express.json());

app.use("/api/expense", expenseRoutes);
app.use("/api/income", incomeRoutes);
//addIncome

// Default Route
app.get("/", (req, res) => {
  res.send("Expense Tracker Backend Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
