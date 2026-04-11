const axios = require('axios');

async function getAISuggestions(resumeText) {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: `Analyze this resume and give 3 to 5 improvement suggestions. Keep the response concise.\n\nResume:\n${resumeText}`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("AI RESPONSE SUCCESS");

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content || "No suggestions generated";
    }

    return "No suggestions generated";

  } catch (err) {
    console.error("AI ERROR:", err.response?.data || err.message);
    return "AI suggestions unavailable";
  }
}

module.exports = { getAISuggestions };