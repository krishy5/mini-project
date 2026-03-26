/**
 * AI-Powered Marksheet Extraction using Google Gemini
 * Automatically extracts student data, subjects, and grades from uploaded documents
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';

const GRADE_POINTS = {
  'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6,
  'C': 5, 'D': 4, 'E': 3, 'F': 0, 'P': 5
};

/**
 * Convert file to base64
 */
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Extract marksheet data using Gemini AI
 */
export async function extractMarksheetWithAI(file) {
  try {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
      throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file');
    }
    
    const base64Data = await fileToBase64(file);
    const mimeType = file.type || 'image/jpeg';

    const prompt = `Analyze this marksheet/grade sheet image and extract the following information in JSON format:

{
  "studentId": "student enrollment/ID number",
  "studentName": "full name of student",
  "semester": "semester number (1-8)",
  "branch": "branch/department name",
  "subjects": [
    {
      "code": "subject code",
      "name": "subject name",
      "credits": "credit hours (number)",
      "grade": "grade (O/A+/A/B+/B/C/D/F)",
      "marks": "marks obtained (if available)"
    }
  ]
}

Rules:
- Extract ALL subjects with their grades
- Use standard grade format: O, A+, A, B+, B, C, D, F
- If semester not found, try to infer from subject codes
- If student ID not clear, use "UNKNOWN"
- Return ONLY valid JSON, no extra text`;

    const requestBody = {
      contents: [{
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Data
            }
          }
        ]
      }]
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Response:', errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const textResponse = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from response
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response');
    }

    const extractedData = JSON.parse(jsonMatch[0]);
    
    // Calculate SGPA
    const sgpa = calculateSGPA(extractedData.subjects);
    
    return {
      success: true,
      data: {
        studentId: extractedData.studentId,
        name: extractedData.studentName,
        semester: parseInt(extractedData.semester) || 1,
        branch: extractedData.branch,
        subjects: extractedData.subjects,
        sgpa: parseFloat(sgpa.toFixed(2)),
        extractedAt: new Date().toISOString()
      },
      errors: []
    };

  } catch (error) {
    console.error('AI Extraction Error:', error);
    return {
      success: false,
      data: null,
      errors: [error.message]
    };
  }
}

/**
 * Calculate SGPA from subjects
 */
function calculateSGPA(subjects) {
  if (!subjects || subjects.length === 0) return 0;

  let totalCredits = 0;
  let totalGradePoints = 0;

  for (const subject of subjects) {
    const gradePoint = GRADE_POINTS[subject.grade] || 0;
    const credits = parseInt(subject.credits) || 0;
    totalGradePoints += gradePoint * credits;
    totalCredits += credits;
  }

  return totalCredits > 0 ? (totalGradePoints / totalCredits) : 0;
}

/**
 * Process multiple marksheets
 */
export async function processMultipleMarksheetsWithAI(files) {
  const results = [];
  const sgpaList = [];

  for (const file of files) {
    const result = await extractMarksheetWithAI(file);
    results.push(result);

    if (result.success && result.data.sgpa) {
      sgpaList.push({
        semester: result.data.semester,
        sgpa: result.data.sgpa
      });
    }
  }

  sgpaList.sort((a, b) => a.semester - b.semester);

  return {
    results,
    sgpaList: sgpaList.map(item => item.sgpa),
    studentId: results[0]?.data?.studentId,
    name: results[0]?.data?.name
  };
}

export { GRADE_POINTS, calculateSGPA };
