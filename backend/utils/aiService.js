const axios = require('axios');

async function getAISuggestions(resumeText) {
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/google/flan-t5-large",
      {
        inputs: `Analyze this resume and give 3 to 5 improvement suggestions:\n${resumeText}`
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("AI RESPONSE:", response.data);

    return response.data[0]?.generated_text || "No suggestions generated";

  } catch (err) {
    console.error("AI ERROR:", err.response?.data || err.message);
    return "AI suggestions unavailable";
  }
}

module.exports = { getAISuggestions };