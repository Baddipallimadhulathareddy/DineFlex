require("dotenv").config();

const SibApiV3Sdk = require("sib-api-v3-sdk");

const client = SibApiV3Sdk.ApiClient.instance;

const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

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
  const email = {
    sender: {
      email: "madhulathareddy70@gmail.com",
      name: "DineFlex"
    },
    to: [
      {
        email: guestEmail,
        name: guestName
      }
    ],
    subject: "Reservation Confirmation - DineFlex",
    htmlContent: `
      <h2>Reservation Confirmed 🎉</h2>

      <p>Hello <b>${guestName}</b>,</p>

      <p>Your reservation has been successfully created.</p>

      <p><b>Reservation ID:</b> ${reservationId}</p>
      <p><b>Date:</b> ${date}</p>
      <p><b>Time:</b> ${startTime} - ${endTime}</p>
      <p><b>Guests:</b> ${guests}</p>
      <p><b>Payment Status:</b> ${paymentStatus}</p>
      <p><b>Amount Paid:</b> ₹${paidAmount}</p>

      <br>
      <p>Thank you for choosing DineFlex ❤️</p>
    `
  };

  return apiInstance.sendTransacEmail(email);
};

module.exports = sendReservationEmail;