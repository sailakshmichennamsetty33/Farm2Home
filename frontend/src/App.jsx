
import { useState } from "react";
import "./App.css";

function App() {
  const products = [
  {
    name: "Fresh Tomatoes",
    price: 40,
    unit: "1 kg",
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=500",
    category: "Vegetables"
  },
  {
    name: "Fresh Carrots",
    price: 50,
    unit: "1 kg",
    image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=500",
    category: "Vegetables"
  },
  {
    name: "Green Vegetables",
    price: 60,
    unit: "1 kg",
    image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=500",
    category: "Vegetables"
  },
  {
    name: "Fresh Apples",
    price: 120,
    unit: "1 kg",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500",
    category: "Fruits"
  },
  {
    name: "Rice",
    price: 70,
    unit: "1 kg",
    image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=500",
    category: "Grains"
  },
  {
    name: "Fresh Milk",
    price: 55,
    unit: "1 litre",
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500",
    category: "Dairy"
  },
];

  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [showRegister, setShowRegister] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);

  
  const [farmerRegister, setFarmerRegister] = useState(false);
  const [farmerName, setFarmerName] = useState("");
  const [farmerEmail, setFarmerEmail] = useState("");
  const [farmerPassword, setFarmerPassword] = useState("");
  const [farmerPhone, setFarmerPhone] = useState("");
  const [farmerVillage, setFarmerVillage] = useState("");
  const [farmerLoggedIn, setFarmerLoggedIn] = useState(false);

  const addToCart = (product) => {
    const existing = cart.find((item) => item.name === product.name);
    if (existing) {
      setCart(cart.map((item) => item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    alert(`${product.name} added to cart!`);
  };

  const increaseQuantity = (productName) => {
    setCart(cart.map((item) => item.name === productName ? { ...item, quantity: item.quantity + 1 } : item));
  };

  const decreaseQuantity = (productName) => {
    setCart(cart.map((item) => item.name === productName ? { ...item, quantity: item.quantity - 1 } : item).filter((item) => item.quantity > 0));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) { alert("Please fill all fields"); return; }
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (response.ok) { alert("Registration successful!"); setShowRegister(false); setName(""); setEmail(""); setPassword(""); }
      else { alert(data.message); }
    } catch (error) { alert("Backend connection failed."); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { alert("Please enter email and password"); return; }
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Login successful!"); setLoggedIn(true);
        if (data.customer) { setName(data.customer.name); setEmail(data.customer.email); }
        setPage("home");
      } else { alert(data.message); }
    } catch (error) { alert("Backend connection failed."); }
  };

  const handleFarmerRegister = async (e) => {
    e.preventDefault();
    if (!farmerName || !farmerEmail || !farmerPassword) { alert("Please fill all fields"); return; }
    try {
      const response = await fetch("http://localhost:5000/api/farmer/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: farmerName, email: farmerEmail, password: farmerPassword, phone: farmerPhone, village: farmerVillage }),
      });
      const data = await response.json();
      if (response.ok) { alert("Farmer Registration successful!"); setFarmerRegister(false); }
      else { alert(data.message); }
    } catch (error) { alert("Backend connection failed."); }
  };

  const handleFarmerLogin = async (e) => {
    e.preventDefault();
    if (!farmerEmail || !farmerPassword) { alert("Please enter email and password"); return; }
    try {
      const response = await fetch("http://localhost:5000/api/farmer/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: farmerEmail, password: farmerPassword }),
      });
      const data = await response.json();
      if (response.ok) { alert("Farmer Login successful!");
         setFarmerLoggedIn(true);
         setPage("farmerDashboard"); 
 }
      else { alert(data.message); }
    } catch (error) { alert("Backend connection failed."); }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!loggedIn) { alert("Please login before placing an order."); setPage("login"); return; }
    if (!address || !phone) { alert("Please enter address and phone number."); return; }
    if (cart.length === 0) { alert("Your cart is empty."); setPage("products"); return; }
    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName: name, customerEmail: email, address, phone, items: cart.map((item) => ({ name: item.name, price: item.price, quantity: item.quantity })), total }),
      });
      const data = await response.json();
      if (response.ok) { alert("Order placed successfully! 🎉"); setCart([]); setAddress(""); setPhone(""); setPage("orders"); loadOrders(); }
      else { alert(data.message); }
    } catch (error) { alert("Backend connection failed."); }
  };

  const loadOrders = async () => {
    if (!email) { alert("Please login first."); setPage("login"); return; }
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${email}`);
      const data = await response.json();
      if (response.ok) { setOrders(data); setPage("orders"); }
      else { alert("Failed to load orders."); }
    } catch (error) { alert("Backend connection failed."); }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo" onClick={() => setPage("home")}>🌾 Farm2Home</div>
        <div className="nav-links">
          <span onClick={() => setPage("home")}>Home</span>
          <span onClick={() => setPage("products")}>Products</span>
          <span onClick={() => setPage("farmerLogin")}>👨‍🌾 Farmer</span>
          <span onClick={() => setPage("cart")}>🛒 Cart ({cart.length})</span>
          {loggedIn && (<span onClick={loadOrders}>My Orders</span>)}
          {loggedIn ? (
            <span onClick={() => { setLoggedIn(false); setPage("home"); }}>Logout</span>
          ) : (
            <span onClick={() => setPage("login")}>Login</span>
          )}
        </div>
      </nav>
{page === "farmerDashboard" && (
  <section className="auth-section">
    <div className="auth-card">
      <h1>👨‍🌾 Farmer Dashboard</h1>

      <h2>Welcome, {farmerName}!</h2>

      <p>Manage your farm products from here.</p>

     <button
  onClick={() => setPage("farmerAddProduct")}
  style={{
    display: "block",
    width: "100%",
    marginBottom: "10px"
  }}
>
  ➕ Add Product
</button> 

      <button
        onClick={() => alert("My Products page ready!")}
        style={{
          display: "block",
          width: "100%",
          marginBottom: "10px",
        }}
      >
        🥕 My Products
      </button>

      <button
        onClick={() => {
          setFarmerLoggedIn(false);
          setPage("home");
        }}
        style={{
          display: "block",
          margin: "10px auto 0",
        }}
      >
        Logout
      </button>
    </div>
  </section>
)}
{page === "farmerAddProduct" && (
  <section className="auth-section">
    <div className="auth-card">
      <h1>➕ Add Farm Product</h1>

      <input
        type="text"
        placeholder="Product Name"
      />

      <input
        type="number"
        placeholder="Price (₹)"
      />

      <input
        type="text"
        placeholder="Quantity (e.g. 1 kg)"
      />

      <input
        type="text"
        placeholder="Category"
      />

      <button
        onClick={() => {
          alert("Product added successfully! 🌾");
          setPage("farmerDashboard");
        }}
      >
        Add Product
      </button>

      <button
        onClick={() => setPage("farmerDashboard")}
        style={{ marginTop: "10px" }}
      >
        ← Back to Dashboard
      </button>
    </div>
  </section>
)}



      {page === "home" && (
        <>
          <section className="hero">
            <div className="hero-content">
              <h1>Fresh from Farms,<br />Delivered to Homes</h1>
              <p>Buy fresh and quality farm products directly from farmers.</p>
              <button onClick={() => setPage("products")}>Shop Fresh Products</button>
            </div>
            <div className="hero-image">
  <img
    src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600"
    alt="Fresh Farm Products"
  />
</div>
          </section>
          <section className="categories">
            <h2>Shop by Category</h2>
            <div className="category-container">

  <div className="category-card">
    <img
      src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=500"
      alt="Vegetables"
    />
    <h3>Vegetables</h3>
  </div>

  <div className="category-card">
    <img
      src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500"
      alt="Fruits"
    />
    <h3>Fruits</h3>
  </div>

  <div className="category-card">
    <img
      src="https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500"
      alt="Grains"
    />
    <h3>Grains</h3>
  </div>

  <div className="category-card">
    <img
      src="https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500"
      alt="Dairy"
    />
    <h3>Dairy</h3>
  </div>

</div>
          </section>
        </>
      )}

      {page === "products" && (
        <section className="products-section">
          <h1>Fresh Farm Products</h1>
          <p>Buy fresh products directly from farmers</p>
          <input type="text" className="search-box" placeholder="🔍 Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <div className="product-categories">
            <button onClick={() => setCategory("All")}>All</button>
            <button onClick={() => setCategory("Vegetables")}>🥕 Vegetables</button>
            <button onClick={() => setCategory("Fruits")}>🍎 Fruits</button>
            <button onClick={() => setCategory("Grains")}>🌾 Grains</button>
            <button onClick={() => setCategory("Dairy")}>🥛 Dairy</button>
          </div>
          <div className="product-container">
            {filteredProducts.length === 0 ? (<p>No products found.</p>) : (
              filteredProducts.map((product) => (
                <div
                 className="product-card"
                  key={product.name}
                     onClick={() => {
                         setSelectedProduct(product);
                     setPage("productDetails");
             }}
                 style={{ cursor: "pointer" }}
>
                  <div className="product-image">
  <img src={product.image} alt={product.name} />
</div>
                  <h2>{product.name}</h2>
                  <p>{product.unit}</p>
                  <h3>₹{product.price}</h3>
                  <button className="cart-button" onClick={() => addToCart(product)}>Add to Cart 🛒</button>
                </div>
              ))
            )}
          </div>
        </section>
      )}
      {page === "productDetails" && selectedProduct && (
  <section className="products-section">
    <div className="auth-card" style={{ maxWidth: "600px", margin: "30px auto" }}>
      <div style={{ textAlign: "center" }}>
  <img
    src={selectedProduct.image}
    alt={selectedProduct.name}
    style={{
      width: "300px",
      height: "250px",
      objectFit: "cover",
      borderRadius: "15px"
    }}
  />
</div>

      <h1>{selectedProduct.name}</h1>

      <p>Fresh farm product directly from farmers.</p>

      <h2>₹{selectedProduct.price}</h2>

      <p>Quantity: {selectedProduct.unit}</p>
      <p>Category: {selectedProduct.category}</p>

      <button
        className="cart-button"
        onClick={() => addToCart(selectedProduct)}
      >
        🛒 Add to Cart
      </button>

      <button
        className="checkout-button"
        onClick={() => {
          addToCart(selectedProduct);
          setPage("cart");
        }}
        style={{ marginTop: "10px",
          marginRight: "15px"}}
         
      >
        🛍️ Buy Now
      </button>

      <button
        onClick={() => setPage("products")}
        style={{ marginTop: "10px" }}
      >
        ← Back to Products
      </button>
    </div>
  </section>
)}

      {page === "cart" && (
        <section className="cart-section">
          <h1>🛒 Your Cart</h1>
          {cart.length === 0 ? (<p>Your cart is empty.</p>) : (
            <>
              {cart.map((item) => (
                <div className="cart-item" key={item.name}>
                  <img
  src={item.image}
  alt={item.name}
  className="cart-emoji"
/>
                  <div><h3>{item.name}</h3><p>₹{item.price} × {item.quantity}</p></div>
                  <div className="quantity-buttons">
                    <button onClick={() => decreaseQuantity(item.name)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item.name)}>+</button>
                  </div>
                </div>
              ))}
              <h2 className="total">Total: ₹{total}</h2>
              <button className="checkout-button" onClick={() => { if (!loggedIn) { alert("Please login before checkout."); setPage("login"); } else { setPage("checkout"); } }}>Proceed to Checkout</button>
            </>
          )}
        </section>
      )}

      {page === "checkout" && (
        <section className="auth-section">
          <div className="auth-card">
            <h1>🛍️ Checkout</h1>
            <p>Order Total: <b>₹{total}</b></p>
            <form onSubmit={handlePlaceOrder}>
              <input type="text" placeholder="Customer Name" value={name} onChange={(e) => setName(e.target.value)} />
              <input type="email" placeholder="Customer Email" value={email} readOnly />
              <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <textarea placeholder="Enter Delivery Address" value={address} onChange={(e) => setAddress(e.target.value)} rows="4" style={{ padding: "13px", border: "1px solid #ccc", borderRadius: "7px", fontSize: "15px", resize: "none" }} />
              <button type="submit">Place Order</button>
            </form>
          </div>
        </section>
      )}

      {page === "orders" && (
        <section className="cart-section">
          <h1>📦 My Orders</h1>
          {orders.length === 0 ? (<p>No orders found.</p>) : (
            orders.map((order, index) => (
              <div className="cart-item" key={order._id || index} style={{ display: "block", textAlign: "left" }}>
                <h3>Order #{index + 1}</h3>
                <p><b>Name:</b> {order.customerName}</p>
                <p><b>Email:</b> {order.customerEmail}</p>
                <p><b>Address:</b> {order.address}</p>
                <p><b>Phone:</b> {order.phone}</p>
                <h3>Total: ₹{order.total}</h3>
                <p><b>Products:</b></p>
                {order.items.map((item, itemIndex) => (
                  <p key={itemIndex}>{item.name} × {item.quantity} — ₹{item.price * item.quantity}</p>
                ))}
              </div>
            ))
          )}
        </section>
      )}

      {page === "farmerLogin" && (
        <section className="auth-section">
          <div className="auth-card">
            {farmerRegister ? (
              <>
                <h1>👨‍🌾 Farmer Registration</h1>
                <form onSubmit={handleFarmerRegister}>
                  <input type="text" placeholder="Farmer Name" value={farmerName} onChange={(e) => setFarmerName(e.target.value)} />
                  <input type="email" placeholder="Email" value={farmerEmail} onChange={(e) => setFarmerEmail(e.target.value)} />
                  <input type="password" placeholder="Create Password" value={farmerPassword} onChange={(e) => setFarmerPassword(e.target.value)} />
                  <input type="tel" placeholder="Phone Number" value={farmerPhone} onChange={(e) => setFarmerPhone(e.target.value)} />
                  <input type="text" placeholder="Village" value={farmerVillage} onChange={(e) => setFarmerVillage(e.target.value)} />
                  <button type="submit">Register</button>
                </form>
                <p>Already registered? <span className="auth-link" onClick={() => setFarmerRegister(false)}>Farmer Login</span></p>
              </>
            ) : (
              <>
                <h1>👨‍🌾 Farmer Login</h1>
                <form onSubmit={handleFarmerLogin}>
                  <input type="email" placeholder="Farmer Email" value={farmerEmail} onChange={(e) => setFarmerEmail(e.target.value)} />
                  <input type="password" placeholder="Password" value={farmerPassword} onChange={(e) => setFarmerPassword(e.target.value)} />
                  <button type="submit">Login</button>
                </form>
                <p>New Farmer? <span className="auth-link" onClick={() => setFarmerRegister(true)}>Create Farmer Account</span></p>
              </>
            )}
          </div>
        </section>
      )}

      {page === "login" && (
        <section className="auth-section">
          <div className="auth-card">
            {showRegister ? (
              <>
                <h1>📝 Customer Registration</h1>
                <form onSubmit={handleRegister}>
                  <input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
                  <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <input type="password" placeholder="Create password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <button type="submit">Register</button>
                </form>
                <p>Already have an account? <span className="auth-link" onClick={() => setShowRegister(false)}>Login</span></p>
              </>
            ) : (
              <>
                <h1>🔐 Customer Login</h1>
                <form onSubmit={handleLogin}>
                  <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <button type="submit">Login</button>
                </form>
                <p>New customer? <span className="auth-link" onClick={() => setShowRegister(true)}>Create Account</span></p>
              </>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
