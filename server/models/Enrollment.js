// src/models/Enrollment.js
const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    academicYear: {
      type: Number,
      required: true,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    grades: {
      assignments: [
        {
          name: String,
          score: Number,
          maxScore: Number,
          weight: Number,
        },
      ],
      midterm: {
        score: Number,
        maxScore: { type: Number, default: 100 },
      },
      final: {
        score: Number,
        maxScore: { type: Number, default: 100 },
      },
      totalGrade: Number,
      letterGrade: String,
      gradePoints: Number,
    },
    attendance: {
      totalClasses: { type: Number, default: 0 },
      attendedClasses: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ['enrolled', 'completed', 'withdrawn'],
      default: 'enrolled',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });
enrollmentSchema.index({ academicYear: 1, semester: 1 });

// Methods
enrollmentSchema.methods = {
  // Calculate total grade
  calculateTotalGrade() {
    let totalGrade = 0;

    // Calculate assignments grade
    if (this.grades.assignments && this.grades.assignments.length > 0) {
      const assignmentGrade = this.grades.assignments.reduce(
        (sum, assignment) => {
          return (
            sum + (assignment.score / assignment.maxScore) * assignment.weight
          );
        },
        0
      );
      totalGrade += assignmentGrade;
    }

    // Calculate midterm grade (30%)
    if (this.grades.midterm && this.grades.midterm.score) {
      totalGrade +=
        (this.grades.midterm.score / this.grades.midterm.maxScore) * 30;
    }

    // Calculate final grade (40%)
    if (this.grades.final && this.grades.final.score) {
      totalGrade += (this.grades.final.score / this.grades.final.maxScore) * 40;
    }

    return totalGrade;
  },

  // Update attendance
  async updateAttendance(attended) {
    this.attendance.attendedClasses += attended ? 1 : 0;
    this.attendance.totalClasses += 1;
    this.attendance.percentage =
      (this.attendance.attendedClasses / this.attendance.totalClasses) * 100;
    await this.save();
  },

  // Calculate grade points (4.0 scale)
  calculateGradePoints() {
    const totalGrade = this.calculateTotalGrade();

    if (totalGrade >= 90) return 4.0;
    if (totalGrade >= 80) return 3.0;
    if (totalGrade >= 70) return 2.0;
    if (totalGrade >= 60) return 1.0;
    return 0.0;
  },

  // Get letter grade
  getLetterGrade() {
    const totalGrade = this.calculateTotalGrade();

    if (totalGrade >= 90) return 'A';
    if (totalGrade >= 80) return 'B';
    if (totalGrade >= 70) return 'C';
    if (totalGrade >= 60) return 'D';
    return 'F';
  },
};

// Static methods
enrollmentSchema.statics = {
  // Find by academic year and semester
  async findByAcademicPeriod(academicYear, semester) {
    return this.find({ academicYear, semester })
      .populate('student')
      .populate('course');
  },

  // Get course performance statistics
  async getCourseStats(courseId) {
    const enrollments = await this.find({
      course: courseId,
      status: 'completed',
    });

    const grades = enrollments.map((e) => e.grades.totalGrade);
    const average = grades.reduce((a, b) => a + b, 0) / grades.length;

    return {
      totalStudents: enrollments.length,
      averageGrade: average,
      maxGrade: Math.max(...grades),
      minGrade: Math.min(...grades),
    };
  },
};

// Middleware
enrollmentSchema.pre('save', async function (next) {
  if (this.isModified('grades')) {
    this.grades.totalGrade = this.calculateTotalGrade();
    this.grades.letterGrade = this.getLetterGrade();
    this.grades.gradePoints = this.calculateGradePoints();
  }
  next();
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
