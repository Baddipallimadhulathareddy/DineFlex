const db = require("../db");
const bcrypt = require("bcryptjs");

// ================= ADMIN SIGNUP =================
exports.signupAdmin = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      restaurantName,
      type,
      description
    } = req.body;

    const image = req.file ? req.file.filename : null;

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO admins
      (name, email, password, phone, address, restaurantName, type, description, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        name,
        email,
        hashedPassword,
        phone,
        address,
        restaurantName,
        type,
        description,
        image
      ],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json(err);
        }

        res.json({ message: "Admin registered successfully" });
      }
    );

  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};


// ================= ADMIN LOGIN =================
exports.loginAdmin = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM admins WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const admin = result[0];

    // Check if blocked by Super User
    if (admin.blocked) {
      return res.status(403).json({
        message: "Super User has blocked you. Ask them to unblock."
      });
    }

    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.json({
      message: "Admin login successful",
      admin: admin
    });
  });
};


// ================= ADMIN OVERVIEW =================
exports.getOverview = (req, res) => {
  const adminId = req.params.id;

  const queries = {
    admin: "SELECT * FROM admins WHERE id=?",
    dishes: "SELECT COUNT(*) as count FROM dishes WHERE adminId=?",
    tables: "SELECT COUNT(*) as count FROM tables WHERE adminId=?",
    reservations: "SELECT COUNT(*) as count FROM reservations WHERE adminId=?"
  };

  let data = {};

  db.query(queries.admin, [adminId], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    data.admin = result[0];

    db.query(queries.dishes, [adminId], (err, d) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      data.dishes = d[0].count;

      db.query(queries.tables, [adminId], (err, t) => {
        if (err) {
          console.log(err);
          return res.status(500).json(err);
        }

        data.tables = t[0].count;

        db.query(queries.reservations, [adminId], (err, r) => {
          if (err) {
            console.log(err);
            return res.status(500).json(err);
          }

          data.reservations = r[0].count;

          res.json(data);
        });
      });
    });
  });
};