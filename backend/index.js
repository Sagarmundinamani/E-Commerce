const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();

const port = process.env.PORT || 4000; // ✅ Define port properly

app.use(express.json());
app.use(cors());

// ✅ Check if .env file is loaded correctly
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing. Please check your .env file.");
  process.exit(1);
}

const uri = process.env.MONGO_URI;

// ✅ Database connection
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
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

// ✅ Image Storage Engine
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

app.use('/images', express.static(uploadDir));

// ✅ API creation
app.get("/", (req, res) => {
  res.send("Express App is Running");
});

// ✅ File Upload API (Fixing "Unexpected field" issue)
app.post("/upload", upload.single('product'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: 0, message: "No file uploaded" });
  }
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
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
  let products = await Product.find({});
  let id = (products.length > 0) ? products[products.length - 1].id + 1 : 1;

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
});

// ✅ Remove Product API
app.post('/removeproduct', async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  res.json({ success: true, name: req.body.name });
});

// ✅ Get All Products API
app.get('/allproducts', async (req, res) => {
  let products = await Product.find({});
  res.send(products);
});
const users = mongoose.model('users',{
  name:{
    type:String,

  },
  email:{
    type:String,
    unique:true,
  },
  passwords:{
    type:String,

  },
  cartData:{
    type:Object,

  },
  date:{
    type:Date,
    default:Date.now,
  }
})
app.post('/signup',async (req, res) => {
  let check = awaitUser.findOne({email:req.body.email});
  if(check){
    return res.status(400).json({success:false,errors:"exsting user found with same email"})
  }
  let cart={};
  for (let i=0; i<300; i++){
    cart[i]=0;
  }
  const user =new Users({
    name:req.body.username,
    email:req.body.email,
    password:req.body.password,
    cartData:cart,
  })

  await user.save();
  const data ={
    user:{
      id:user.id
    }
  }

  const token =jwt.sign(data,'secret_ecom');
  res.json({success:true, token})
})
// ✅ Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ success: 0, error: "Internal Server Error", details: err.message });
});

app.post('/login',async(req, res) => {
  let user= await Users.findOne({ email: req.body.email});
  if (user){
    const passCompare =req.body.password ===user.password;
    if(passCompare){
      const data={
        user:{
          id:user.id
        }
      }
      const token =jwt.sign(data,'secret_ecom');
      res.json({success:true, token});
    }
    else{
      res.json({success:false, errors:"Wrong Password"});
    }
  }
  else{
    res.json({success:false, errors:"Wrong email Id"})
  }
})

// ✅ Start Server
app.listen(port, (error) => {
  if (!error) {
    console.log(`🚀 Server Running on Port: ${port}`);
  } else {
    console.error("❌ Error:", error);
  }
});
