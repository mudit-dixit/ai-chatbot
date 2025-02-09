// src/models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    credits: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
    },
    type: {
      type: String,
      enum: ['core', 'elective'],
      required: true,
    },
    prerequisites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    syllabus: [String],
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
courseSchema.index({
  name: 'text',
  courseCode: 'text',
  description: 'text',
});

// Methods
courseSchema.methods = {
  // Get current enrollments
  async getCurrentEnrollments() {
    return await mongoose
      .model('Enrollment')
      .find({
        course: this._id,
        status: 'enrolled',
      })
      .populate('student');
  },

  // Get enrolled students
  async getEnrolledStudents() {
    const enrollments = await this.getCurrentEnrollments();
    return enrollments.map((e) => e.student);
  },

  // Get course statistics
  async getStats() {
    const [totalEnrollments, activeEnrollments, completedEnrollments] =
      await Promise.all([
        mongoose.model('Enrollment').countDocuments({ course: this._id }),
        mongoose
          .model('Enrollment')
          .countDocuments({ course: this._id, status: 'enrolled' }),
        mongoose
          .model('Enrollment')
          .countDocuments({ course: this._id, status: 'completed' }),
      ]);

    const completedEnrollmentsData = await mongoose
      .model('Enrollment')
      .find({ course: this._id, status: 'completed' });

    const avgGrade =
      completedEnrollmentsData.reduce(
        (sum, e) => sum + (e.grades.totalGrade || 0),
        0
      ) / (completedEnrollmentsData.length || 1);

    return {
      totalEnrollments,
      activeEnrollments,
      completedEnrollments,
      averageGrade: avgGrade.toFixed(2),
    };
  },

  // Check if a student has completed prerequisites
  async checkPrerequisites(studentId) {
    if (!this.prerequisites || this.prerequisites.length === 0) return true;

    const completedCourses = await mongoose.model('Enrollment').find({
      student: studentId,
      course: { $in: this.prerequisites },
      status: 'completed',
    });

    return completedCourses.length === this.prerequisites.length;
  },
};

// Static methods
courseSchema.statics = {
  // Find by department
  async findByDepartment(departmentId) {
    return this.find({ department: departmentId })
      .populate('department')
      .populate('prerequisites');
  },

  // Find by semester
  async findBySemester(semester) {
    return this.find({ semester })
      .populate('department')
      .populate('prerequisites');
  },

  // Find courses without prerequisites (starter courses)
  async findStarterCourses() {
    return this.find({
      prerequisites: { $size: 0 },
    }).populate('department');
  },
};

module.exports = mongoose.model('Course', courseSchema);
