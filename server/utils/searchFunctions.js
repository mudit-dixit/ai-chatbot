// src/utils/searchFunctions.js
const {
  Department,
  Teacher,
  Student,
  Course,
  Enrollment,
} = require('../models');

// Search functions for specific types of queries
const searchFunctions = {
  // Find course details
  async findCourseDetails(courseCode) {
    const course = await Course.findOne({ courseCode })
      .populate('department')
      .populate('prerequisites');

    if (!course) return null;

    const enrollments = await Enrollment.countDocuments({
      course: course._id,
      status: 'enrolled',
    });

    return {
      ...course.toObject(),
      currentEnrollments: enrollments,
    };
  },

  // Find teacher's schedule
  async findTeacherSchedule(teacherId) {
    const teacher = await Teacher.findById(teacherId)
      .populate('currentlyTeaching')
      .populate('department');

    return teacher;
  },

  // Find student's current courses
  async findStudentCourses(rollNumber) {
    const student = await Student.findOne({ rollNumber });
    if (!student) return null;

    const enrollments = await Enrollment.find({
      student: student._id,
      status: 'enrolled',
    }).populate('course');

    return enrollments;
  },

  // Find department overview
  async findDepartmentOverview(deptCode) {
    const dept = await Department.findOne({ code: deptCode });
    if (!dept) return null;

    const [teachers, students, courses] = await Promise.all([
      Teacher.countDocuments({ department: dept._id }),
      Student.countDocuments({ department: dept._id }),
      Course.countDocuments({ department: dept._id }),
    ]);

    return {
      ...dept.toObject(),
      stats: { teachers, students, courses },
    };
  },
};

module.exports = searchFunctions;
