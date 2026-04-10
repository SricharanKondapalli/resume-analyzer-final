const axios = require('axios');

async function getAISuggestions(resumeText) {
  try {
    // Step 1: Get available models from Grok (xAI)
    const modelsResponse = await axios.get(
      "https://api.x.ai/v1/models",
      {
        headers: {
          "Authorization": `Bearer ${process.env.AI_API_KEY}`
        }
      }
    );

    console.log("AVAILABLE MODELS:", modelsResponse.data);

    // TEMP RETURN (we just want to see models first)
    return "Check server logs for available models";

  } catch (err) {
    console.error("MODEL FETCH ERROR:", err.response?.data || err.message);
    return "Error fetching models";
  }
}

module.exports = { getAISuggestions };