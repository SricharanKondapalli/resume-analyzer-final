const axios = require('axios');

async function getAISuggestions(resumeText) {
  try {
    const response = await axios.post(
      "https://api.x.ai/v1/chat/completions",
      {
        model: "grok-2-latest",
        messages: [
          {
            role: "system",
            content: "You are a resume analyzer. Give short improvement suggestions."
          },
          {
            role: "user",
            content: `Analyze this resume and give 3-5 improvement suggestions:\n${resumeText}`
          }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.AI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("AI RESPONSE:", response.data);

    return response.data.choices[0].message.content;
  } catch (err) {
    console.error("AI FULL ERROR:", err.response?.data || err.message);
    return "AI suggestions unavailable";
  }
}

module.exports = { getAISuggestions };