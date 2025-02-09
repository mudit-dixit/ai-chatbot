// src/controllers/chatController.js
const {
  Department,
  Teacher,
  Student,
  Course,
  Enrollment,
} = require('../models');
const Anthropic = require('@anthropic-ai/sdk');

const NetworkUtils = require('../config/networkUtils');

const anthropic = new Anthropic({
  apiKey: NetworkUtils.ANTHROPIC_API_KEY,
});

// Helper function to gather context based on query
async function gatherContextData(query) {
  try {
    // First, let's try simple queries without text search
    const simpleQueries = await Promise.all([
      Department.find().exec(),
      Teacher.find().populate('department').exec(),
      Student.find().populate('department').exec(),
      Course.find().populate('department').exec(),
    ]);

    console.log('\n=== Simple Queries Full Results ===');
    console.log('\nDepartments:', JSON.stringify(simpleQueries[0], null, 2));
    console.log('\nTeachers:', JSON.stringify(simpleQueries[1], null, 2));
    console.log('\nStudents:', JSON.stringify(simpleQueries[2], null, 2));
    console.log('\nCourses:', JSON.stringify(simpleQueries[3], null, 2));

    // Now try text search
    const textSearchResults = await Promise.all([
      Department.find({ $text: { $search: query } }).exec(),
      Teacher.find({ $text: { $search: query } })
        .populate('department')
        .exec(),
      Student.find({ $text: { $search: query } })
        .populate('department')
        .exec(),
      Course.find({ $text: { $search: query } })
        .populate('department')
        .exec(),
    ]);

    console.log('\n=== Text Search Full Results ===');
    console.log(
      '\nDepartments:',
      JSON.stringify(textSearchResults[0], null, 2)
    );
    console.log('\nTeachers:', JSON.stringify(textSearchResults[1], null, 2));
    console.log('\nStudents:', JSON.stringify(textSearchResults[2], null, 2));
    console.log('\nCourses:', JSON.stringify(textSearchResults[3], null, 2));

    // Format context as before...
    let context = '';
    const [departments, teachers, students, courses] = simpleQueries;

    if (departments.length) {
      context +=
        '\nDepartment Information:\n' +
        departments
          .map(
            (dept) =>
              `${dept.name} (${dept.code}): ${
                dept.description || 'No description available'
              }`
          )
          .join('\n');
    }

    if (teachers.length) {
      context +=
        '\nTeacher Information:\n' +
        teachers
          .map(
            (teacher) =>
              `${teacher.firstName} ${teacher.lastName}: ${
                teacher.designation
              } in ${teacher.department?.name || 'Unknown Department'}`
          )
          .join('\n');
    }

    if (students.length) {
      context +=
        '\nStudent Information:\n' +
        students
          .map(
            (student) =>
              `${student.firstName} ${student.lastName}: ${
                student.program
              } student in ${
                student.department?.name || 'Unknown Department'
              }, Semester ${student.currentSemester}`
          )
          .join('\n');
    }

    if (courses.length) {
      context +=
        '\nCourse Information:\n' +
        courses
          .map(
            (course) =>
              `${course.courseCode} - ${course.name}: ${
                course.credits
              } credit ${course.type} course in ${
                course.department?.name || 'Unknown Department'
              }`
          )
          .join('\n');
    }

    console.log('\n=== Formatted Context ===');
    console.log(context);

    return {
      context,
      sources: [...departments, ...teachers, ...students, ...courses],
      debug: {
        simpleQueryResults: simpleQueries,
        textSearchResults: textSearchResults,
      },
    };
  } catch (error) {
    console.error('Error details:', error);
    return {
      context: '',
      sources: [],
      error: error.message,
    };
  }
}

// Chat controller
const generateResponse = async (req, res) => {
  try {
    const { question } = req.body;

    // Gather relevant context
    const { context, sources } = await gatherContextData(question);
    console.log('================context==============', context);
    //Generate AI response
    const completion = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: `You are a college information assistant. Use the following data to answer the question. If the data doesn't contain relevant information, say so politely.

          Available Information:
          ${context}

          Question: ${question}`,
        },
      ],
    });

    res.json({
      answer: completion.content[0].text,
      sources: sources,
    });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ error: 'Error generating response' });
  }
};

module.exports = {
  generateResponse,
};
