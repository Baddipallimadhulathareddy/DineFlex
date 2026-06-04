const router = require("express").Router();

const {
  getNotifications,
  markRead,
  deleteNotification
} = require("../controllers/notificationController");

router.get("/:adminId", getNotifications);
router.put("/:id", markRead);
router.delete("/:id", deleteNotification);

module.exports = router;