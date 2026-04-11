const axios = require('axios');

async function getAISuggestions(resumeText) {
  try {
    const prompt = `You are an elite Career Coach, Senior Technical Recruiter, and an advanced Applicant Tracking System (ATS). 
    Your goal is to provide a masterclass-level analysis of the user's resume. Do not hold back. You must clearly identify every single weakness, missing element, poor phrasing, lack of metrics, and formatting issue, while also praising what they did right. 
    Instead of limiting your suggestions, provide comprehensive and highly actionable advice. Tell them exactly what to rewrite, what metrics to add, and how to position themselves as a top 1% candidate. 

    You MUST respond with a valid JSON object matching the exact format requested below.

    JSON Schema:
    {
      "score": number (0-100 indicating overall resume qualify based on ATS parsing, keyword density, action verbs, quantification of achievements, and structure),
      "grade": string (e.g. "A+", "A", "B+", "B", "C", "D"),
      "suggestions": array of objects, EACH with: "type" (must be exactly 'warning', 'info', or 'success') and "message" (Provide highly detailed, actionable feedback. Explain WHY it is an issue and EXACTLY how to fix it. Give specific examples based on their text.),
      "missingKeywords": array of strings (top 5-10 tech/soft skills they are missing based on their role level),
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