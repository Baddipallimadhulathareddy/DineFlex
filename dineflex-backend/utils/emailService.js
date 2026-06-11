require("dotenv").config();
const brevo = require("@getbrevo/brevo");

const apiInstance = new brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sendReservationEmail = async ({
  guestEmail,
  guestName,
  reservationId,
  date,
  startTime,
  endTime,
  guests,
  paymentStatus,
  paidAmount
}) => {
  const email = new brevo.SendSmtpEmail();

  email.sender = {
    name: "DineFlex",
    email: "madhulathareddy70@gmail.com"
  };

  email.to = [
    {
      email: guestEmail,
      name: guestName
    }
  ];

  email.subject = "Reservation Confirmation - DineFlex";

  email.htmlContent = `
    <h2>Reservation Confirmed 🎉</h2>

    <p>Hello <b>${guestName}</b>,</p>

    <p>Your reservation has been successfully created.</p>

    <table border="1" cellpadding="10" cellspacing="0">
      <tr>
        <td><b>Reservation ID</b></td>
        <td>${reservationId}</td>
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
        <td><b>Payment Status</b></td>
        <td>${paymentStatus}</td>
      </tr>
      <tr>
        <td><b>Amount Paid</b></td>
        <td>₹${paidAmount}</td>
      </tr>
    </table>

    <br>

    <p>Thank you for choosing us ❤️</p>
    <p>DineFlex Team</p>
  `;

  return apiInstance.sendTransacEmail(email);
};

module.exports = sendReservationEmail;