const db = require("../db");

/* =========================
   LOW STOCK NOTIFICATION
========================= */
const checkLowStock = (dishId) => {
  db.query(
    "SELECT * FROM dishes WHERE id=?",
    [dishId],
    (err, result) => {
      if (err || result.length === 0) return;

      const dish = result[0];

      if (Number(dish.quantity) <= Number(dish.threshold)) {
        const msg =
          `⚠️ Low Stock Alert! "${dish.name}" quantity is ${dish.quantity}. Please prepare more.`;

        db.query(
  "SELECT * FROM notifications WHERE adminId=? AND message=?",
  [dish.adminId, msg],
  (err, rows) => {

    if (!err && rows.length === 0) {

      db.query(
        "INSERT INTO notifications(adminId,message) VALUES(?,?)",
        [dish.adminId, msg]
      );

    }
  }
);
      }
    }
  );
};

exports.addDish = (req, res) => {
  const {
    adminId,
    name,
    description,
    price,
    quantity,
    threshold,
    type
  } = req.body;

  const image = req.file ? req.file.filename : null;

  const sql = `
    INSERT INTO dishes
    (adminId,name,image,description,price,quantity,threshold,type)
    VALUES (?,?,?,?,?,?,?,?)
  `;

  db.query(
    sql,
    [adminId, name, image, description, price, quantity, threshold, type],
    (err, result) => {
      if (err) return res.status(500).json(err);

      // Check stock after dish is added
      checkLowStock(result.insertId);

      res.json({ message: "Dish added" });
    }
  );
};

exports.getDishes = (req, res) => {
  db.query(
    "SELECT * FROM dishes WHERE adminId=?",
    [req.params.adminId],
    (err, result) => {
      if (err) return res.status(500).json(err);

      result.forEach((dish) => {
        if (Number(dish.quantity) <= Number(dish.threshold)) {

          const msg =
            `⚠️ Low Stock Alert! "${dish.name}" quantity is ${dish.quantity}. Please prepare more.`;

          db.query(
            `SELECT * FROM notifications
             WHERE adminId=? AND message=?`,
            [dish.adminId, msg],
            (err, rows) => {

              if (!err && rows.length === 0) {
                db.query(
                  "INSERT INTO notifications(adminId,message) VALUES(?,?)",
                  [dish.adminId, msg]
                );
              }
            }
          );
        }
      });

      res.json(result);
    }
  );
};
exports.deleteDish = (req, res) => {
  db.query(
    "DELETE FROM dishes WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Dish deleted" });
    }
  );
};
exports.updateDishQuantity = (req, res) => {

  const { quantity } = req.body;

  db.query(
    "UPDATE dishes SET quantity=? WHERE id=?",
    [quantity, req.params.id],
    (err) => {

      if (err) return res.status(500).json(err);

      checkLowStock(req.params.id);

      res.json({
        message: "Quantity Updated"
      });
    }
  );
};
exports.updateDishQuantity = (req, res) => {
  const { quantity } = req.body;

  db.query(
    "UPDATE dishes SET quantity=? WHERE id=?",
    [quantity, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);

      checkLowStock(req.params.id);

      res.json({
        message: "Quantity Updated"
      });
    }
  );
};