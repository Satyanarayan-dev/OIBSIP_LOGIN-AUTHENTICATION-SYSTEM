const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "..", "public"))); 


const users = new Map();

// Routes
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (users.has(username)) {
    res.status(400).send("Username already exists");
  } else {
    users.set(username, { password });
    res.status(200).send("User registered successfully");
  }
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.get(username);
  if (user && user.password === password) {
    res.redirect("/dashboard"); // Redirect to dashboard page on successful login
  } else {
    res.status(401).send("Invalid credentials");
  }
});

// Route handlers
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "dashboard.html"));
});

// Logout route
app.get("/logout", (req, res) => {
  // redirect to login page
  res.redirect("/login");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
