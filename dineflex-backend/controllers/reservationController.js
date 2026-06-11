const db = require("../db");
const nodemailer = require("nodemailer");
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
require("dotenv").config();
console.log("EMAIL_USER =", process.env.EMAIL_USER);
console.log(
  "EMAIL_PASS exists =",
  !!process.env.EMAIL_PASS
);
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Brevo SMTP Error:", error);
  } else {
    console.log("Brevo SMTP Ready");
  }
});

transporter.verify(function (error, success) {
  if (error) {
    console.error("SMTP Verify Error:", error);
  } else {
    console.log("SMTP Server Ready");
  }
});

// AUTO DELETE EXPIRED RESERVATIONS
const deleteExpiredReservations = () => {
  const now = new Date();

  const currentDate = now.toISOString().split("T")[0];
  const currentTime = now.toTimeString().slice(0, 5);

  const sql = `
    DELETE FROM reservations
    WHERE date < ?
    OR (date = ? AND endTime < ?)
  `;

 db.query(
  sql,
  [currentDate, currentDate, currentTime],
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(
        `${result.affectedRows} expired reservations deleted`
      );
    }
  }
);
};

// run every 1 minute
setInterval(deleteExpiredReservations, 60000);

// Add Reservation
exports.addReservation = (req, res) => {
  const {
  guestName,
  guestEmail,
  guests,
  tableId,
  date,
  startTime,
  endTime,
  adminId,
  userId,
  dishes,
  paymentStatus,
  paymentId,
  paidAmount
} = req.body;
 const finalAdminId = Number(adminId);
const finalUserId = userId ? Number(userId) : 0;

  if (
    !guestName ||
    !guestEmail ||
    !guests ||
    !tableId ||
    !date ||
    !startTime ||
    !endTime ||
    (!adminId && !userId)
  ) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  const checkSql = `
    SELECT * FROM reservations
    WHERE tableId = ? AND date = ? AND startTime = ? AND endTime = ?
  `;

  db.query(
    checkSql,
    [tableId, date, startTime, endTime],
    (err, result) => {
      if (err) {
        console.error("Slot check error:", err);
        return res.status(500).json({
          message: "Database error during slot check"
        });
      }

      if (result.length > 0) {
        return res.status(400).json({
          message: "Slot already booked"
        });
      }

      const insertSql = `
  INSERT INTO reservations
  (
    guestName,
    guestEmail,
    guests,
    tableId,
    date,
    startTime,
    endTime,
    adminId,
    userId,
    dishes,
    paymentStatus,
    paymentId,
    paidAmount
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

      db.query(
        insertSql,
        [
  guestName,
  guestEmail,
  Number(guests),
  tableId,
  date,
  startTime,
  endTime,
  finalAdminId,
  finalUserId,
  JSON.stringify(dishes || []),
  paymentStatus || "Unpaid",
  paymentId || null,
  paidAmount || 0
],
        (err, result) => {
          if (err) {
            console.error("Insert reservation error:", err);
            return res.status(500).json({
              message:
                "Database error during reservation creation"
            });
          }

          if (dishes && dishes.length > 0) {
  dishes.forEach((dish) => {
    db.query(
      `
      UPDATE dishes
      SET quantity = quantity - ?
      WHERE id = ? AND adminId = ?
      `,
      [
        Number(dish.quantity),
        dish.dishId,
        finalAdminId
      ],
      (err) => {
        if (err) {
          console.error(
            "Dish quantity update error:",
            err
          );
        }
      }
    );
  });
}

// EMAIL STARTS HERE
const mailOptions = {
  from: "DineFlex <madhulathareddy70@gmail.com>",
  to: guestEmail,
  subject: "Reservation Confirmation - DineFlex",
  html: `
    <h2>Reservation Confirmed 🎉</h2>

    <p>Hello <b>${guestName}</b>,</p>

    <p>Your reservation has been successfully created.</p>

    <table border="1" cellpadding="10" cellspacing="0">
      <tr>
        <td><b>Reservation ID</b></td>
        <td>${result.insertId}</td>
      </tr>

      <tr>
        <td><b>Date</b></td>
        <td>${date}</td>
      </tr>

      <tr>
        <td><b>Start Time</b></td>
        <td>${startTime}</td>
      </tr>

      <tr>
        <td><b>End Time</b></td>
        <td>${endTime}</td>
      </tr>

      <tr>
        <td><b>Guests</b></td>
        <td>${guests}</td>
      </tr>

      <tr>
        <td><b>Table Number</b></td>
        <td>${tableId}</td>
      </tr>

      <tr>
        <td><b>Payment Status</b></td>
        <td>${paymentStatus || "Unpaid"}</td>
      </tr>

      <tr>
        <td><b>Amount Paid</b></td>
        <td>₹${paidAmount || 0}</td>
      </tr>
    </table>

    <br>

    <p>Thank you for choosing us ❤️</p>

    <p>DineFlex Team</p>
  `
};

transporter.sendMail(mailOptions, (error) => {
  if (error) {
    console.log("Email Error:", error);
  } else {
    console.log("Reservation email sent");
  }
});

// RESPONSE TO FRONTEND
res.json({
  message: "Reservation created successfully",
  id: result.insertId
});
        }
      );
    }
  );
};

// Get Reservations by adminId
exports.getReservations = (req, res) => {
  const { adminId } = req.params;

  db.query(
    "SELECT * FROM reservations WHERE adminId = ? ORDER BY id DESC",
    [adminId],
    (err, result) => {
      if (err) {
        console.error(
          "Fetch reservations error:",
          err
        );
        return res.status(500).json({
          message:
            "Database error fetching reservations"
        });
      }

      res.json(result);
    }
  );
};

// Get Reservations for specific user
exports.getUserReservations = (req, res) => {
  const { adminId, userId } = req.params;

  const sql = `
    SELECT *
    FROM reservations
    WHERE adminId = ?
    AND userId = ?
  `;

  db.query(sql, [adminId, userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// Delete Reservation
exports.deleteReservation = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM reservations WHERE id = ?",
    [id],
    (err) => {
      if (err) {
        console.error(
          "Delete reservation error:",
          err
        );
        return res.status(500).json({
          message:
            "Database error deleting reservation"
        });
      }

      res.json({
        message:
          "Reservation deleted successfully"
      });
    }
  );
};