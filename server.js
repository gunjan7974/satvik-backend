require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

// Connect DB
connectDB();

// Error Middleware (LAST)
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});