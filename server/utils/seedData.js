// server/utils/seedData.js
const mongoose = require('mongoose');
const {
  Department,
  Teacher,
  Student,
  Course,
  Enrollment,
} = require('../models');
require('dotenv').config();

// Sample data
const departments = [
  {
    name: 'Computer Science',
    code: 'CS',
    description: 'Department of Computer Science and Engineering',
    contactEmail: 'cs@university.edu',
    contactPhone: '123-456-7890',
    establishedDate: new Date('2000-01-01'),
  },
  {
    name: 'Electrical Engineering',
    code: 'EE',
    description: 'Department of Electrical and Electronics Engineering',
    contactEmail: 'ee@university.edu',
    contactPhone: '123-456-7891',
    establishedDate: new Date('2000-01-01'),
  },
  {
    name: 'Mechanical Engineering',
    code: 'ME',
    description: 'Department of Mechanical Engineering',
    contactEmail: 'me@university.edu',
    contactPhone: '123-456-7892',
    establishedDate: new Date('2000-01-01'),
  },
];

const teachers = [
  {
    employeeId: 'CS001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@university.edu',
    phone: '123-456-7801',
    designation: 'Professor',
    specializations: ['Artificial Intelligence', 'Machine Learning'],
    joiningDate: new Date('2015-01-01'),
    status: 'active',
    qualifications: [
      {
        degree: 'PhD',
        field: 'Computer Science',
        institution: 'MIT',
        year: 2010,
      },
    ],
  },
  {
    employeeId: 'CS002',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@university.edu',
    phone: '123-456-7802',
    designation: 'Associate Professor',
    specializations: ['Database Systems', 'Cloud Computing'],
    joiningDate: new Date('2017-01-01'),
    status: 'active',
    qualifications: [
      {
        degree: 'PhD',
        field: 'Computer Science',
        institution: 'Stanford',
        year: 2012,
      },
    ],
  },
];

const courses = [
  {
    courseCode: 'CS101',
    name: 'Introduction to Programming',
    description: 'Basic programming concepts using Python',
    credits: 3,
    type: 'core',
    semester: 1,
    syllabus: [
      'Introduction to Programming',
      'Variables and Data Types',
      'Control Structures',
      'Functions',
      'Basic Data Structures',
    ],
  },
  {
    courseCode: 'CS201',
    name: 'Data Structures',
    description: 'Advanced data structures and algorithms',
    credits: 4,
    type: 'core',
    semester: 3,
    syllabus: [
      'Arrays and Linked Lists',
      'Stacks and Queues',
      'Trees and Graphs',
      'Sorting Algorithms',
      'Search Algorithms',
    ],
  },
];

const students = [
  {
    rollNumber: 'CS2023001',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.j@university.edu',
    phone: '123-456-7701',
    dateOfBirth: new Date('2000-05-15'),
    admissionYear: 2023,
    program: 'BTech',
    currentSemester: 1,
    status: 'active',
    address: {
      street: '123 College St',
      city: 'University City',
      state: 'State',
      postalCode: '12345',
      country: 'Country',
    },
    guardian: {
      name: 'Bob Johnson',
      relationship: 'Father',
      phone: '123-456-7702',
      email: 'bob.j@email.com',
    },
  },
  {
    rollNumber: 'CS2023002',
    firstName: 'Bob',
    lastName: 'Wilson',
    email: 'bob.w@university.edu',
    phone: '123-456-7703',
    dateOfBirth: new Date('2001-03-20'),
    admissionYear: 2023,
    program: 'BTech',
    currentSemester: 1,
    status: 'active',
    address: {
      street: '456 University Ave',
      city: 'College Town',
      state: 'State',
      postalCode: '12346',
      country: 'Country',
    },
    guardian: {
      name: 'Carol Wilson',
      relationship: 'Mother',
      phone: '123-456-7704',
      email: 'carol.w@email.com',
    },
  },
];

// Function to seed the database
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      'mongodb+srv://muditdixit:AqUjrB4mCDrAfN0z@cluster0.6sqrf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    );
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Department.deleteMany({}),
      Teacher.deleteMany({}),
      Course.deleteMany({}),
      Student.deleteMany({}),
      Enrollment.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // Insert departments
    const insertedDepartments = await Department.insertMany(departments);
    console.log('Inserted departments');

    // Add department references to teachers
    const teachersWithDept = teachers.map((teacher) => ({
      ...teacher,
      department: insertedDepartments[0]._id, // Assigning to CS department
    }));

    // Insert teachers
    const insertedTeachers = await Teacher.insertMany(teachersWithDept);
    console.log('Inserted teachers');

    // Update department with head
    await Department.findByIdAndUpdate(insertedDepartments[0]._id, {
      headOfDepartment: insertedTeachers[0]._id,
    });

    // Add department references to courses
    const coursesWithDept = courses.map((course) => ({
      ...course,
      department: insertedDepartments[0]._id,
    }));

    // Insert courses
    const insertedCourses = await Course.insertMany(coursesWithDept);
    console.log('Inserted courses');

    // Add department references to students
    const studentsWithDept = students.map((student) => ({
      ...student,
      department: insertedDepartments[0]._id,
    }));

    // Insert students
    const insertedStudents = await Student.insertMany(studentsWithDept);
    console.log('Inserted students');

    // Create enrollments
    const enrollments = [
      {
        student: insertedStudents[0]._id,
        course: insertedCourses[0]._id,
        academicYear: 2023,
        semester: 1,
        status: 'enrolled',
        attendance: {
          totalClasses: 15,
          attendedClasses: 13,
          percentage: 86.67,
        },
        grades: {
          assignments: [
            { name: 'Assignment 1', score: 85, maxScore: 100, weight: 15 },
            { name: 'Assignment 2', score: 90, maxScore: 100, weight: 15 },
          ],
          midterm: { score: 88, maxScore: 100 },
          final: { score: 92, maxScore: 100 },
          totalGrade: 89.5,
          letterGrade: 'A',
          gradePoints: 4.0,
        },
      },
    ];

    // Insert enrollments
    await Enrollment.insertMany(enrollments);
    console.log('Inserted enrollments');

    console.log('Database seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
