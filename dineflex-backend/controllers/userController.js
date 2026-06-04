const db = require("../db");
const bcrypt = require("bcryptjs");

// ================= USER SIGNUP =================
exports.signupUser = async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  try {
    // check if user already exists
    const checkUser = "SELECT * FROM users WHERE email = ?";
    db.query(checkUser, [email], async (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const sql =
        "INSERT INTO users (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)";

      db.query(
        sql,
        [name, email, hashedPassword, phone, address],
        (err, result) => {
          if (err) return res.status(500).json(err);

          res.status(201).json({
            message: "User registered successfully",
            userId: result.insertId,
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

// ================= USER LOGIN =================
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result[0];

    // Check if blocked by Super User
    if (user.blocked) {
      return res.status(403).json({
        message: "Super User has blocked you. Ask them to unblock."
      });
    }

    try {
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(401).json({ message: "Invalid password" });
      }

      res.status(200).json({
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
        },
      });

    } catch (error) {
      res.status(500).json(error);
    }
  });
};
// ================= GET ALL RESTAURANTS =================
exports.getRestaurants = (req, res) => {
  const sql = `
    SELECT
      id,
      name,
      email,
      phone,
      address,
      restaurantName,
      type,
      description,
      image
    FROM admins
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};


// ================= GET SINGLE RESTAURANT =================
exports.getRestaurantById = (req, res) => {
  const sql = `
    SELECT
      id,
      name,
      email,
      phone,
      address,
      restaurantName,
      type,
      description,
      image
    FROM admins
    WHERE id = ?
  `;

  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({
        message: "Restaurant not found"
      });
    }

    res.json(result[0]);
  });
};