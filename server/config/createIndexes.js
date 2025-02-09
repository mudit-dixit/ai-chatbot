const { Department, Teacher, Student, Course } = require('../models/models');

async function createSearchIndexes() {
  try {
    await Department.collection.createIndex({
      name: 'text',
      code: 'text',
      description: 'text',
    });
    console.log('Department index created');

    await Teacher.collection.createIndex({
      firstName: 'text',
      lastName: 'text',
      specializations: 'text',
    });
    console.log('Teacher index created');

    await Student.collection.createIndex({
      firstName: 'text',
      lastName: 'text',
      rollNumber: 'text',
    });
    console.log('Student index created');

    await Course.collection.createIndex({
      name: 'text',
      courseCode: 'text',
      description: 'text',
    });
    console.log('Course index created');

    console.log('All indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
}

module.exports = createIndexes;
