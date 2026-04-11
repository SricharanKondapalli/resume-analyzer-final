const axios = require('axios');

async function getAISuggestions(resumeText) {
  try {
    const prompt = `You are a helpful and experienced Career Coach. 
    Review the following resume carefully. Point out what is missing, what is written poorly, and what is done well.
    Please use simple, easy-to-understand English. Tell the user exactly how they can improve their resume with clear examples. Do not use overly complex or confusing words.

    You MUST respond with a valid JSON object matching the exact format requested below.

    JSON Schema:
    {
      "score": number (0-100 indicating overall resume quality based on keywords, action verbs, and structure),
      "grade": string (e.g. "A+", "A", "B+", "B", "C", "D"),
      "suggestions": array of objects, EACH with: "type" (must be exactly 'warning', 'info', or 'success') and "message" (Provide clear, simple feedback. Explain exactly how to fix the issue.),
      "missingKeywords": array of strings (top 5-10 important skills they are missing),
      "foundKeywords": array of strings (top skills you found in the text),
      "sectionScores": object containing these strictly integer scores (0-100): "contact", "summary", "experience", "education", "skills", "formatting"
    }
    
    Resume:\n${resumeText}`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "user",
            content: prompt
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
      const content = response.data.choices[0].message.content;
      try {
        return JSON.parse(content);
      } catch(parseErr) {
        console.error("AI parse error:", parseErr);
        throw new Error("Invalid AI JSON");
      }
    }

    throw new Error("No suggestion content");

  } catch (err) {
    console.error("AI ERROR:", err.response?.data || err.message);
    // Return a default fallback object so the frontend doesn't crash entirely.
    return {
      score: 0,
      grade: "D",
      suggestions: [{ type: "warning", message: "Failed to connect to AI for analysis." }],
      missingKeywords: [],
      foundKeywords: [],
      sectionScores: { contact: 0, summary: 0, experience: 0, education: 0, skills: 0, formatting: 0 }
    };
  }
}

module.exports = { getAISuggestions };