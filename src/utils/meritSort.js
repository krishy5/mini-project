/**
 * Merit-Based Student Ranking System
 * 4-Step Deterministic Sorting Algorithm
 */

/**
 * Calculate SHA256 hash and convert to micro-precision value
 * @param {string} studentId - Student ID (e.g., "kf23cs164")
 * @param {number[]} sgpaList - Array of SGPA values
 * @returns {Promise<number>} - Micro-precision value between 0 and 1
 */
async function calculateMicroPrecision(studentId, sgpaList) {
  // Format SGPA values to 2 decimal places for consistency
  const formattedSGPAs = sgpaList.map(sgpa => sgpa.toFixed(2)).join('|');
  const input = `${studentId}|${formattedSGPAs}`;
  
  // Convert string to ArrayBuffer
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  
  // Calculate SHA-256 hash
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  
  // Convert to BigInt and divide by 2^256 to get value between 0 and 1
  let hashBigInt = 0n;
  for (let i = 0; i < hashArray.length; i++) {
    hashBigInt = (hashBigInt << 8n) | BigInt(hashArray[i]);
  }
  
  // Divide by 2^256 and convert to float
  const divisor = 2n ** 256n;
  const microPrecision = Number(hashBigInt) / Number(divisor);
  
  return microPrecision;
}

/**
 * Calculate CGPA from semester grade points
 * @param {number[]} sgpaList - Array of SGPA values
 * @returns {number} - CGPA value
 */
function calculateCGPA(sgpaList) {
  if (!sgpaList || sgpaList.length === 0) return 0;
  const sum = sgpaList.reduce((acc, sgpa) => acc + sgpa, 0);
  return sum / sgpaList.length;
}

/**
 * Get current semester SGPA
 * @param {number[]} sgpaList - Array of SGPA values
 * @returns {number} - Current semester SGPA
 */
function getCurrentSGPA(sgpaList) {
  if (!sgpaList || sgpaList.length === 0) return 0;
  return sgpaList[sgpaList.length - 1];
}

/**
 * Calculate academic improvement trend
 * @param {number[]} sgpaList - Array of SGPA values
 * @returns {number} - Trend score (0 for first semester)
 */
function calculateTrend(sgpaList) {
  if (!sgpaList || sgpaList.length <= 1) return 0;
  
  const currentSGPA = sgpaList[sgpaList.length - 1];
  const previousSGPAs = sgpaList.slice(0, -1);
  const previousAverage = previousSGPAs.reduce((acc, sgpa) => acc + sgpa, 0) / previousSGPAs.length;
  
  return currentSGPA - previousAverage;
}

/**
 * Calculate all merit metrics for a student
 * @param {Object} student - Student object with id and sgpaList
 * @returns {Promise<Object>} - Object with all merit metrics
 */
async function calculateMeritMetrics(student) {
  const { id, sgpaList = [] } = student;
  
  const cgpa = calculateCGPA(sgpaList);
  const currentSGPA = getCurrentSGPA(sgpaList);
  const trend = calculateTrend(sgpaList);
  const microPrecision = sgpaList.length > 0 
    ? await calculateMicroPrecision(id, sgpaList) 
    : 0;
  
  return {
    ...student,
    cgpa,
    currentSGPA,
    trend,
    microPrecision
  };
}

/**
 * Compare two students based on merit criteria
 * Step 1: CGPA (higher is better)
 * Step 2: Current SGPA (higher is better)
 * Step 3: Trend (higher is better)
 * Step 4: MicroPrecision (higher is better)
 * @param {Object} a - First student with metrics
 * @param {Object} b - Second student with metrics
 * @returns {number} - Comparison result
 */
function compareStudents(a, b) {
  // Step 1: Compare CGPA
  if (a.cgpa !== b.cgpa) {
    return b.cgpa - a.cgpa; // Descending order
  }
  
  // Step 2: Compare Current SGPA
  if (a.currentSGPA !== b.currentSGPA) {
    return b.currentSGPA - a.currentSGPA; // Descending order
  }
  
  // Step 3: Compare Trend
  if (a.trend !== b.trend) {
    return b.trend - a.trend; // Descending order
  }
  
  // Step 4: Compare MicroPrecision (deterministic tie-breaker)
  return b.microPrecision - a.microPrecision; // Descending order
}

/**
 * Sort students by merit with ranking
 * @param {Array} students - Array of student objects with id and sgpaList
 * @returns {Promise<Array>} - Sorted array with rank assigned
 */
export async function sortStudentsByMerit(students) {
  if (!students || students.length === 0) return [];
  
  // Calculate metrics for all students
  const studentsWithMetrics = await Promise.all(
    students.map(student => calculateMeritMetrics(student))
  );
  
  // Sort by merit criteria
  const sortedStudents = studentsWithMetrics.sort(compareStudents);
  
  // Assign ranks
  return sortedStudents.map((student, index) => ({
    ...student,
    rank: index + 1
  }));
}

/**
 * Get student rank without sorting entire list
 * @param {Object} targetStudent - Student to rank
 * @param {Array} allStudents - All students for comparison
 * @returns {Promise<Object>} - Student with rank and metrics
 */
export async function getStudentRank(targetStudent, allStudents) {
  const sortedStudents = await sortStudentsByMerit(allStudents);
  return sortedStudents.find(s => s.id === targetStudent.id);
}

/**
 * Export individual calculation functions for testing/debugging
 */
export {
  calculateCGPA,
  getCurrentSGPA,
  calculateTrend,
  calculateMicroPrecision,
  calculateMeritMetrics
};
