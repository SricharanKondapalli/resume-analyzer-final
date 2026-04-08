const TECH_KEYWORDS = [
  'javascript','typescript','python','java','c++','c#','go','rust','ruby','php',
  'react','angular','vue','node.js','express','django','flask','spring','laravel',
  'sql','mongodb','postgresql','mysql','redis','elasticsearch','graphql','rest',
  'docker','kubernetes','aws','azure','gcp','terraform','ci/cd','git','linux',
  'machine learning','deep learning','tensorflow','pytorch','data science','nlp',
  'html','css','tailwind','bootstrap','sass','webpack','vite','next.js','nuxt',
  'microservices','api','agile','scrum','devops','cloud','serverless',
];

const SOFT_SKILL_KEYWORDS = [
  'leadership','communication','teamwork','problem-solving','analytical',
  'collaboration','mentoring','project management','strategic','innovative',
  'cross-functional','stakeholder','agile','scrum','kanban',
];

const ACTION_VERBS = [
  'developed','implemented','designed','built','led','managed','created',
  'improved','optimized','delivered','architected','launched','collaborated',
  'engineered','automated','reduced','increased','achieved','spearheaded',
  'deployed','migrated','maintained','integrated','streamlined','coordinated',
];

const SECTION_PATTERNS = {
  contact: /\b(email|phone|linkedin|github|portfolio|@|\d{3}[-.\s]\d{3}[-.\s]\d{4})\b/i,
  summary: /\b(summary|objective|profile|about me|professional summary)\b/i,
  experience: /\b(experience|work history|employment|career|positions?|jobs?)\b/i,
  education: /\b(education|degree|university|college|bachelor|master|phd|diploma|certification)\b/i,
  skills: /\b(skills|technologies|competencies|expertise|proficiencies)\b/i,
};

function normalizeText(text) {
  return text.toLowerCase().replace(/[^a-z0-9.\s@+#]/g, ' ');
}

function countMatches(text, keywords) {
  const normalized = normalizeText(text);
  return keywords.filter((kw) => normalized.includes(kw.toLowerCase()));
}

function detectSections(text) {
  const scores = {};
  for (const [section, pattern] of Object.entries(SECTION_PATTERNS)) {
    scores[section] = pattern.test(text) ? 1 : 0;
  }
  return scores;
}

function scoreSection(sectionPresent) {
  return sectionPresent ? 100 : 0;
}

function generateGrade(score) {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B+';
  if (score >= 60) return 'B';
  if (score >= 50) return 'C+';
  if (score >= 40) return 'C';
  return 'D';
}

function analyzeResume(text) {
  if (!text || text.trim().length < 50) {
    return {
      score: 0,
      grade: 'D',
      suggestions: [{ type: 'warning', message: 'Resume text is too short to analyze.' }],
      missingKeywords: TECH_KEYWORDS.slice(0, 10),
      foundKeywords: [],
      sectionScores: { contact: 0, summary: 0, experience: 0, education: 0, skills: 0, formatting: 0 },
    };
  }

  const wordCount = text.trim().split(/\s+/).length;
  const sections = detectSections(text);
  const foundTechKeywords = countMatches(text, TECH_KEYWORDS);
  const foundSoftSkills = countMatches(text, SOFT_SKILL_KEYWORDS);
  const foundActionVerbs = countMatches(text, ACTION_VERBS);
  const missingTech = TECH_KEYWORDS.filter((k) => !foundTechKeywords.includes(k));

  const sectionScores = {
    contact: scoreSection(sections.contact),
    summary: scoreSection(sections.summary),
    experience: scoreSection(sections.experience),
    education: scoreSection(sections.education),
    skills: scoreSection(sections.skills),
    formatting: 0,
  };

  let formattingScore = 50;
  if (wordCount >= 300 && wordCount <= 800) formattingScore += 30;
  else if (wordCount > 800 && wordCount <= 1200) formattingScore += 15;
  else if (wordCount < 150) formattingScore -= 20;
  if (foundActionVerbs.length >= 5) formattingScore += 20;
  sectionScores.formatting = Math.min(100, Math.max(0, formattingScore));

  const sectionWeight = 0.35;
  const keywordWeight = 0.35;
  const verbWeight = 0.15;
  const lengthWeight = 0.15;

  const sectionAvg = Object.values(sectionScores).reduce((a, b) => a + b, 0) / Object.keys(sectionScores).length;
  const keywordRatio = Math.min(1, (foundTechKeywords.length + foundSoftSkills.length) / 15);
  const verbRatio = Math.min(1, foundActionVerbs.length / 8);
  const lengthScore = wordCount >= 300 && wordCount <= 900 ? 100 : wordCount < 150 ? 20 : 60;

  const rawScore =
    sectionAvg * sectionWeight +
    keywordRatio * 100 * keywordWeight +
    verbRatio * 100 * verbWeight +
    lengthScore * lengthWeight;

  const score = Math.round(Math.min(100, Math.max(0, rawScore)));
  const grade = generateGrade(score);

  const suggestions = [];

  if (!sections.contact) {
    suggestions.push({ type: 'warning', message: 'Add contact information (email, phone, LinkedIn).' });
  }
  if (!sections.summary) {
    suggestions.push({ type: 'info', message: 'Include a professional summary or objective statement.' });
  }
  if (!sections.experience) {
    suggestions.push({ type: 'warning', message: 'Add a work experience section with detailed role descriptions.' });
  }
  if (!sections.education) {
    suggestions.push({ type: 'info', message: 'Include your education background and relevant certifications.' });
  }
  if (!sections.skills) {
    suggestions.push({ type: 'warning', message: 'Add a dedicated skills section listing your technical competencies.' });
  }
  if (foundActionVerbs.length < 5) {
    suggestions.push({ type: 'info', message: `Use more action verbs (e.g., "developed", "led", "optimized") — found only ${foundActionVerbs.length}.` });
  }
  if (wordCount < 300) {
    suggestions.push({ type: 'warning', message: `Resume is too short (${wordCount} words). Aim for 400–700 words.` });
  } else if (wordCount > 1000) {
    suggestions.push({ type: 'info', message: `Resume is quite long (${wordCount} words). Consider trimming to under 800 words.` });
  }
  if (foundTechKeywords.length < 5) {
    suggestions.push({ type: 'warning', message: 'Include more relevant technical keywords to pass ATS screening.' });
  }
  if (foundSoftSkills.length < 2) {
    suggestions.push({ type: 'info', message: 'Add soft skills like leadership, communication, or teamwork.' });
  }
  if (score >= 80) {
    suggestions.push({ type: 'success', message: 'Great resume! Strong keyword coverage and well-structured sections.' });
  } else if (score >= 60) {
    suggestions.push({ type: 'success', message: 'Good foundation! A few targeted improvements will significantly boost your score.' });
  }

  const topMissingKeywords = missingTech
    .filter((k) => ['javascript','python','react','node.js','sql','docker','aws','git','typescript','api'].includes(k))
    .slice(0, 8);

  return {
    score,
    grade,
    suggestions,
    missingKeywords: topMissingKeywords.length > 0 ? topMissingKeywords : missingTech.slice(0, 8),
    foundKeywords: [...foundTechKeywords, ...foundSoftSkills].slice(0, 20),
    sectionScores,
  };
}

module.exports = { analyzeResume };
