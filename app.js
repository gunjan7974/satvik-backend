const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

// ⭐ IMPORTANT (image upload fix)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.use("/api/foods", require("./routes/foodRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));

app.get("/", (req, res) => {
  res.send("API Running...");
});

module.exports = app;