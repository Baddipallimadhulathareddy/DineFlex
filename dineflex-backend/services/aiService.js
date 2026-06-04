const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.getAIResponse = async (context, userMessage) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

  const prompt = `
Restaurant Context:
${context}

User Question:
${userMessage}

Answer using restaurant data when relevant.
`;

  const result = await model.generateContent(prompt);

  return result.response.text();
};