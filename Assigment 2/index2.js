const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const fileUpload = require('express-fileupload');
const port = 3000;

// Models
const Order = require("./model/Order");
const Customer = require("./model/Customer");
const Product = require("./model/Product");
const Vendor = require("./model/Vendor");
const Shipper = require("./model/Shipper");

// Express app
const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());

// Routes
/* app.post("/register/customer", async (req, res) => {
  const { name, email, password } = req.body;
  // Check if customer already exists
  const customerExists = await Customer.findOne({ email });
  if (customerExists) {
    return res.status(409).json({ message: "Customer already exists" });
  }
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  // Create new customer object
  const customer = new Customer({ name, email, password: hashedPassword });
  // Save customer object to MongoDB Atlas
  try {
    const savedCustomer = await customer.save();
    res.status(201).json({ message: "Customer registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/register/vendor", async (req, res) => {
  const { name, email, password } = req.body;
  // Check if vendor already exists
  const vendorExists = await Vendor.findOne({ email });
  if (vendorExists) {
    return res.status(409).json({ message: "Vendor already exists" });
  }
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  // Create new vendor object
  const vendor = new Vendor({ name, email, password: hashedPassword });
  // Save vendor object to MongoDB Atlas
  try {
    const savedVendor = await vendor.save();
    res.status(201).json({ message: "Vendor registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/register/shipper", async (req, res) => {
  const { name, email, password } = req.body;
  // Check if shipper already exists
  const shipperExists = await Shipper.findOne({ email });
  if (shipperExists) {
    return res.status(409).json({ message: "Shipper already exists" });
  }
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  // Create new shipper object
  const shipper = new Shipper({ name, email, password: hashedPassword });
  // Save shipper object to MongoDB Atlas
  try {
    const savedShipper = await shipper.save();
    res.status(201).json({ message: "Shipper registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // Check if user exists
  const customer = await Customer.findOne({ email });
  const vendor = await Vendor.findOne({ email });
  const shipper = await Shipper.findOne({ email });
  if (!customer && !vendor && !shipper) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const user = customer || vendor || shipper;
  // Validate password using bcrypt
  const passwordIsValid = await bcrypt.compare(password, user.password);
  if (!passwordIsValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  // Set session variable
  req.session.user = user;
  res.json({ message: "Logged in successfully" });
});

app.get("/my-account", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  let role;
  if (req.session.user instanceof Customer) {
    role = "customer";
  } else if (req.session.user instanceof Vendor) {
    role = "vendor";
  } else if (req.session.user instanceof Shipper) {
    role = "shipper";
  }
  res.render("my-account.hbs", { user: req.session.user, role });
});

app.post("/my-account/change-profile-image", upload.single("profile-image"), async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  req.session.user.profileImage = req.file.filename;
  await req.session.user.save();
  res.redirect("/my-account");
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
}); */

app.get("/vendor/view-my-products", async (req, res) => {
  if (!req.session.user || !(req.session.user instanceof Vendor)) {
    return res.redirect("/login");
  }
  const vendor = await Vendor.findById(req.session.user._id).populate("products");
  res.render("view-my-products.hbs", { vendor });
});

app.get("/vendor/add-new-product", async (req, res) => {
  if (!req.session.user || !(req.session.user instanceof Vendor)) {
    return res.redirect("/login");
  }
  res.render("add-new-product.hbs");
});

app.post("/vendor/add-new-product", upload.single("image"), async (req, res) => {
  if (!req.session.user || !(req.session.user instanceof Vendor)) {
    return res.redirect("/login");
  }
  const { name, price, description } = req.body;
  const product = new Product({
    name,
    price,
    image: {
        data: req.files.data,
        mimeType: req.files.data.mimetype,
    },
    description,
    vendor: req.session.user._id,
  });
  const savedProduct = await product.save();
  const vendor = await Vendor.findById(req.session.user._id);
  vendor.products.push(savedProduct);
  await vendor.save();
  res.redirect("/vendor/view-my-products");
});

app.get("/customer/products", async (req, res) => {
  if (!req.session.user || !(req.session.user instanceof Customer)) {
    return res.redirect("/login");
  }
  const { minPrice, maxPrice, name } = req.query;
  let query = {};
  if (minPrice && maxPrice) {
    query.price = { $gte: minPrice, $lte: maxPrice };
  }
  if (name) {
    query.name = { $regex: name, $options: "i" };
  }
  const products = await Product.find(query).populate("vendor");
  res.render("customer-products.hbs", { products });
});

app.get("/customer/products/:productId", async (req, res) => {
  if (!req.session.user || !(req.session.user instanceof Customer)) {
    return res.redirect("/login");
  }
  const product = await Product.findById(req.params.productId).populate("vendor");
  res.render("product-detail.hbs", { product });
});

app.post("/customer/products/:productId/add-to-cart", async (req, res) => {
  if (!req.session.user || !(req.session.user instanceof Customer)) {
    return res.redirect("/login");
  }
  const product = await Product.findById(req.params.productId);
  req.session.user.shoppingCart.push(product);
  await req.session.user.save();
  res.redirect("/customer/products");
});

app.post("/customer/shopping-cart/remove-product", async (req, res) => {
  if (!req.session.user || !(req.session.user instanceof Customer)) {
    return res.redirect("/login");
  }
  const indexToRemove = req.session.user.shoppingCart.findIndex(
    (product) => product._id.toString() === req.body.productId.toString()
  );
  if (indexToRemove !== -1) {
    req.session.user.shoppingCart.splice(indexToRemove, 1);
    await req.session.user.save();
  }
  res.redirect("/customer/shopping-cart");
});

app.get("/customer/shopping-cart", async (req, res) => {
  if (!req.session.user || !(req.session.user instanceof Customer)) {
    return res.redirect("/login");
  }
  const shoppingCartProducts = await Product.find({ _id: { $in: req.session.user.shoppingCart } }).populate(
    "vendor"
  );
  res.render("shopping-cart.hbs", { shoppingCartProducts });
});

app.get("/customer/order", async (req, res) => {
  if (!req.session.user || !(req.session.user instanceof Customer)) {
    return res.redirect("/login");
  }
  if (!req.session.user.shoppingCart.length) {
    return res.redirect("/customer/shopping-cart");
  }
  const distributionHubs = await Shipper.find().distinct("distributionHub");
  const distributionHubOrders = new Map();
  // Create an order for each distribution hub
  for (const distributionHub of distributionHubs) {
    const order = new Order({
      customer: req.session.user._id,
      distributionHub,
      products: req.session.user.shoppingCart,
    });
    const savedOrder = await order.save();
    distributionHubOrders.set(distributionHub, savedOrder._id);
  }
  req.session.user.shoppingCart = [];
  await req.session.user.save();
  res.render("order.hbs", { distributionHubOrders });
});

app.get("/shipper/orders", async (req, res) => {
  if (!req.session.user || !(req.session.user instanceof Shipper)) {
    return res.redirect("/login");
  }
  const orders = await Order.find({
    status: { $eq: "active" },
  }).populate("customer products");
  res.render("shipper-orders.hbs", { orders });
});

app.post("/shipper/orders/:orderId/change-status", async (req, res) => {
  if (!req.session.user || !(req.session.user instanceof Shipper)) {
    return res.redirect("/login");
  }
  const order = await Order.findById(req.params.orderId);
  order.status = req.body.status;
  await order.save();
  res.redirect("/shipper/orders");
});

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://datle:bruhbruh@cluster0.t1rzjtc.mongodb.net/?retryWrites=true&w=majority')
.then(()=>console.log('Connect to Mongodb Atlas'))
.catch((error)=>console.log(error.message));

app.listen(port, () => {
    console.log(`E-commerce app listening at http://localhost:${port}`);
  });
