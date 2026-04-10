const axios = require('axios');

async function getAISuggestions(resumeText) {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a resume analyzer. Give 3 to 5 short, clear improvement suggestions."
          },
          {
            role: "user",
            content: `Analyze this resume and give improvement suggestions:\n${resumeText}`
          }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("AI RESPONSE:", response.data);

    return response.data.choices[0].message.content;

  } catch (err) {
    console.error("AI ERROR:", err.response?.data || err.message);
    return "AI suggestions unavailable";
  }
}

module.exports = { getAISuggestions };