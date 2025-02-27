const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const bcrypt = require("bcryptjs");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;
const saltRounds = 10;

app.use(express.json());

// ✅ Proper CORS Configuration
const allowedOrigins = ["http://localhost:5173"];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization"
}));

// ✅ Handle Preflight Requests
app.options("*", cors());

// ✅ Check if MONGO_URI is defined
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing. Please check your .env file.");
  process.exit(1);
}

const uri = process.env.MONGO_URI;

// ✅ Database Connection with Error Handling
mongoose.connect(uri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  });

// ✅ Ensure 'uploads/images' directory exists
const uploadDir = "./uploads/images";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer Storage Configuration
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });
app.use('/uploads/images', express.static(uploadDir));

// ✅ API to check if server is running
app.get("/", (req, res) => {
  res.send("🚀 Express App is Running");
});

// ✅ File Upload API
app.post("/upload", upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }
  res.json({
    success: true,
    image_url: `http://localhost:${port}/uploads/images/${req.file.filename}`
  });
});

// ✅ Product Schema
const Product = mongoose.model("Product", {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

// ✅ Add Product API
app.post('/addproduct', async (req, res) => {
  try {
    let lastProduct = await Product.findOne().sort({ id: -1 });
    let id = lastProduct ? lastProduct.id + 1 : 1;

    const product = new Product({
      id: id,
      name: req.body.name,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
      image: req.body.image,
    });

    await product.save();
    res.json({ success: true, name: req.body.name });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// ✅ Remove Product API
app.post('/removeproduct', async (req, res) => {
  try {
    let deletedProduct = await Product.findByIdAndDelete(req.body._id);
    if (deletedProduct) {
      res.json({ success: true, message: "Product removed successfully" });
    } else {
      res.status(404).json({ success: false, message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// ✅ Get All Products API
app.get('/allproducts', async (req, res) => {
  try {
    let products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// ✅ User Schema
const User = mongoose.model("User", {
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  cartData: { type: Object, default: {} },
  date: { type: Date, default: Date.now }
});

// ✅ Signup API
app.post('/signup', async (req, res) => {
  try {
    let existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "User already exists with this email" });
    }

    let hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    let cart = {};
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }

    const user = new User({
      name: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      cartData: cart,
    });

    await user.save();
    const token = jwt.sign({ user: { id: user.id } }, 'secret_ecom');
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// ✅ Login API
app.post('/login', async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ success: false, error: "Invalid email or password" });
    }

    let isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: "Invalid email or password" });
    }

    const token = jwt.sign({ user: { id: user.id } }, 'secret_ecom');
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// ✅ Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ success: false, error: "Internal Server Error" });
});

// ✅ Start Server
app.listen(port, () => {
  console.log(`🚀 Server Running on Port: ${port}`);
});
