const db = require("../db");

exports.getNotifications = (req, res) => {
  db.query(
    "SELECT * FROM notifications WHERE adminId=? ORDER BY createdAt DESC",
    [req.params.adminId],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json(result);
    }
  );
};

exports.markRead = (req, res) => {
  db.query(
    "UPDATE notifications SET isRead=1 WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Updated" });
    }
  );
};
exports.deleteNotification = (req, res) => {
  db.query(
    "DELETE FROM notifications WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Notification deleted" });
    }
  );
};