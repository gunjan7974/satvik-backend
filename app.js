const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const path = require("path");

const app = express();

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow cross-origin images
})); 
app.use(cors());
app.use(mongoSanitize());
app.use(morgan("dev"));

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate Limiting (Prevents Brute Force)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later."
});
app.use("/api", limiter);

// Payload Limits (Prevents DoS)
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

// Routes
app.use("/api/foods", require("./routes/foodRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/blogs", require("./routes/blogRoutes"));
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/gallery", require("./routes/galleryRoutes"));

app.get("/", (req, res) => {
  res.send("API Running Securely...");
});

module.exports = app;