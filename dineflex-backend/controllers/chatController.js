const db = require("../db");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const chatMessage = async (req, res) => {
  try {
    const { adminId, message } = req.body;

    let restaurant = [];
    let dishes = [];
    let tables = [];
    let reservations = [];

    if (adminId) {

      // =====================
      // SINGLE RESTAURANT
      // =====================

      restaurant = await new Promise((resolve, reject) => {
        db.query(
          "SELECT * FROM admins WHERE id=?",
          [adminId],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });

      dishes = await new Promise((resolve, reject) => {
        db.query(
          "SELECT * FROM dishes WHERE adminId=?",
          [adminId],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });

      tables = await new Promise((resolve, reject) => {
        db.query(
          "SELECT * FROM tables WHERE adminId=?",
          [adminId],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });

      reservations = await new Promise((resolve, reject) => {
        db.query(
          "SELECT * FROM reservations WHERE adminId=?",
          [adminId],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });

    } else {

      // =====================
      // ALL RESTAURANTS
      // =====================

      restaurant = await new Promise((resolve, reject) => {
        db.query(
          "SELECT * FROM admins",
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });

      dishes = await new Promise((resolve, reject) => {
        db.query(
          "SELECT * FROM dishes",
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });

      tables = await new Promise((resolve, reject) => {
        db.query(
          "SELECT * FROM tables",
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });

      reservations = await new Promise((resolve, reject) => {
        db.query(
          "SELECT * FROM reservations",
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });

    }

    // =====================
    // LIMIT DATA SENT TO GEMINI
    // =====================

    const limitedRestaurants = restaurant.slice(0, 10);
    const limitedDishes = dishes.slice(0, 20);
    const limitedTables = tables.slice(0, 20);
    const limitedReservations = reservations.slice(0, 20);

    // =====================
    // DETECT RESTAURANT QUESTIONS
    // =====================

    const restaurantKeywords = [
      "dish",
      "menu",
      "food",
      "restaurant",
      "reservation",
      "booking",
      "table",
      "customer",
      "sales",
      "selling"
    ];

    const isRestaurantQuestion =
      restaurantKeywords.some(keyword =>
        message.toLowerCase().includes(keyword)
      );

    // =====================
    // GEMINI MODEL
    // =====================

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    let prompt;

    if (isRestaurantQuestion) {

      prompt = `
You are DineFlex Restaurant AI Assistant.

ADMIN ID:
${adminId || "ALL_RESTAURANTS"}

RESTAURANTS:
${JSON.stringify(limitedRestaurants)}

DISHES:
${JSON.stringify(limitedDishes)}

TABLES:
${JSON.stringify(limitedTables)}

RESERVATIONS:
${JSON.stringify(limitedReservations)}

Rules:

1. Use restaurant database whenever relevant.
2. If adminId exists, answer only for that restaurant.
3. If adminId is null, answer using all restaurants.
4. Compare restaurants when user asks.
5. Suggest best selling dishes.
6. Suggest low selling dishes.
7. Analyze reservations and table usage.
8. Mention restaurant names when comparing data.
9. Never say database is empty unless it is truly empty.

User Question:
${message}
`;

    } else {

      prompt = `
You are a helpful AI assistant.

User Question:
${message}
`;

    }

    const result = await model.generateContent(prompt);

    const reply = result.response.text();

    return res.json({
      reply
    });

  } catch (err) {
    console.log("CHATBOT ERROR:", err);

    if (err.status === 429) {
      return res.status(200).json({
        reply:
          "AI quota exceeded. Please wait a while or upgrade the Gemini API plan."
      });
    }

    if (err.status === 503) {
      return res.status(200).json({
        reply:
          "Gemini is currently busy. Please try again in a few seconds."
      });
    }

    return res.status(200).json({
      reply:
        "Something went wrong while generating the response."
    });
  }
};

module.exports = {
  chatMessage
};