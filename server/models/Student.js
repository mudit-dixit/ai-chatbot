// src/models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    rollNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: String,
    dateOfBirth: {
      type: Date,
      required: true,
    },
    admissionYear: {
      type: Number,
      required: true,
    },
    program: {
      type: String,
      required: true,
      enum: ['BTech', 'MTech', 'PhD', 'BBA', 'MBA'],
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    currentSemester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    guardian: {
      name: String,
      relationship: String,
      phone: String,
      email: String,
    },
    status: {
      type: String,
      enum: ['active', 'graduated', 'withdrawn'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
studentSchema.index({
  firstName: 'text',
  lastName: 'text',
  rollNumber: 'text',
});

// Methods
studentSchema.methods = {
  // Get full name
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  },

  // Get age
  getAge() {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  },

  // Get current courses
  async getCurrentCourses() {
    const enrollments = await mongoose
      .model('Enrollment')
      .find({
        student: this._id,
        status: 'enrolled',
        semester: this.currentSemester,
      })
      .populate('course');
    return enrollments.map((e) => e.course);
  },

  // Get academic history
  async getAcademicHistory() {
    return await mongoose
      .model('Enrollment')
      .find({
        student: this._id,
        status: 'completed',
      })
      .populate('course')
      .sort('-academicYear -semester');
  },

  // Calculate CGPA
  async calculateCGPA() {
    const completedEnrollments = await mongoose
      .model('Enrollment')
      .find({
        student: this._id,
        status: 'completed',
      })
      .populate('course');

    if (completedEnrollments.length === 0) return 0;

    const totalGradePoints = completedEnrollments.reduce((sum, enrollment) => {
      return sum + enrollment.grades.gradePoints * enrollment.course.credits;
    }, 0);

    const totalCredits = completedEnrollments.reduce((sum, enrollment) => {
      return sum + enrollment.course.credits;
    }, 0);

    return totalGradePoints / totalCredits;
  },
};

// Static methods
studentSchema.statics = {
  // Find by department
  async findByDepartment(departmentId) {
    return this.find({ department: departmentId }).populate('department');
  },

  // Find by program
  async findByProgram(program) {
    return this.find({ program }).populate('department');
  },

  // Find active students
  async findActive() {
    return this.find({ status: 'active' }).populate('department');
  },
};

module.exports = mongoose.model('Student', studentSchema);
