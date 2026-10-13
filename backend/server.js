const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());



const MONGO_URL = "mongodb+srv://sailakshmichennamsetty33_db_user:xLsJBa3gAfEjJQ2E@cluster0.dmdz7au.mongodb.net/farm2home?appName=Cluster0";
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((error) => {
    console.log("MongoDB Connection Error:", error.message);
  });



const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const Customer = mongoose.model("Customer", customerSchema);



const orderSchema = new mongoose.Schema({
  customerName: String,
  customerEmail: String,
  address: String,
  phone: String,

  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
    },
  ],

  total: Number,

  orderDate: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);



app.get("/", (req, res) => {
  res.send("Farm2Home Backend is Running");
});



app.get("/api/test", (req, res) => {
  res.json({
    message: "API connection is working!",
  });
});


app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingCustomer = await Customer.findOne({ email });

    if (existingCustomer) {
      return res.status(400).json({
        message: "Customer already registered",
      });
    }

    const customer = new Customer({
      name,
      email,
      password,
    });

    await customer.save();

    res.status(201).json({
      message: "Registration successful",
    });
  } catch (error) {
    console.log("Registration Error:", error.message);

    res.status(500).json({
      message: "Registration failed",
    });
  }
});



app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findOne({
      email: email,
      password: password,
    });

    if (!customer) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.json({
      message: "Login successful",

      customer: {
        name: customer.name,
        email: customer.email,
      },
    });
  } catch (error) {
    console.log("Login Error:", error.message);

    res.status(500).json({
      message: "Login failed",
    });
  }
});

const farmerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  village: String,
});

const Farmer = mongoose.model("Farmer", farmerSchema);



app.post("/api/farmer/register", async (req, res) => {
  try {
    const { name, email, password, phone, village } = req.body;

    const existingFarmer = await Farmer.findOne({ email });

    if (existingFarmer) {
      return res.status(400).json({
        message: "Farmer already registered",
      });
    }

    const farmer = new Farmer({
      name,
      email,
      password,
      phone,
      village,
    });

    await farmer.save();

    res.status(201).json({
      message: "Farmer registration successful",
    });
  } catch (error) {
    console.log("Farmer Registration Error:", error.message);

    res.status(500).json({
      message: "Farmer registration failed",
    });
  }
});


app.post("/api/farmer/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const farmer = await Farmer.findOne({
      email: email,
      password: password,
    });

    if (!farmer) {
      return res.status(401).json({
        message: "Invalid farmer email or password",
      });
    }

    res.json({
      message: "Farmer login successful",
      farmer: {
        name: farmer.name,
        email: farmer.email,
        phone: farmer.phone,
        village: farmer.village,
      },
    });
  } catch (error) {
    console.log("Farmer Login Error:", error.message);

    res.status(500).json({
      message: "Farmer login failed",
    });
  }
});



app.post("/api/orders", async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      address,
      phone,
      items,
      total,
    } = req.body;

    const order = new Order({
      customerName,
      customerEmail,
      address,
      phone,
      items,
      total,
    });

    await order.save();

    res.status(201).json({
      message: "Order placed successfully",
      order: order,
    });
  } catch (error) {
    console.log("Order Error:", error.message);

    res.status(500).json({
      message: "Order placement failed",
    });
  }
});


app.get("/api/orders/:email", async (req, res) => {
  try {
    const orders = await Order.find({
      customerEmail: req.params.email,
    }).sort({
      orderDate: -1,
    });

    res.json(orders);
  } catch (error) {
    console.log("Get Orders Error:", error.message);

    res.status(500).json({
      message: "Failed to get orders",
    });
  }
});


const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});