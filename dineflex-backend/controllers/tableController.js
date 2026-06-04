const db = require("../db");

exports.addTable = (req, res) => {
  const { adminId, tableNumber, chairs } = req.body;

  db.query(
    "INSERT INTO tables (adminId,tableNumber,chairs) VALUES (?,?,?)",
    [adminId, tableNumber, chairs],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Table added" });
    }
  );
};

exports.getTables = (req, res) => {
  db.query(
    "SELECT * FROM tables WHERE adminId=?",
    [req.params.adminId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
};

exports.deleteTable = (req, res) => {
  db.query(
    "DELETE FROM tables WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Deleted" });
    }
  );
};