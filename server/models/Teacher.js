// src/models/Teacher.js
const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    designation: {
      type: String,
      required: true,
      enum: [
        'Professor',
        'Associate Professor',
        'Assistant Professor',
        'Lecturer',
      ],
    },
    specializations: [String],
    joiningDate: {
      type: Date,
      required: true,
    },
    qualifications: [
      {
        degree: String,
        field: String,
        institution: String,
        year: Number,
      },
    ],
    currentlyTeaching: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    status: {
      type: String,
      enum: ['active', 'on-leave', 'retired'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
teacherSchema.index({
  firstName: 'text',
  lastName: 'text',
  specializations: 'text',
});

// Methods
teacherSchema.methods = {
  // Get full name
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  },

  // Get current courses with details
  async getCurrentCourses() {
    return await mongoose
      .model('Course')
      .find({ _id: { $in: this.currentlyTeaching } })
      .populate('department');
  },

  // Get all students in current courses
  async getCurrentStudents() {
    const enrollments = await mongoose
      .model('Enrollment')
      .find({
        course: { $in: this.currentlyTeaching },
        status: 'enrolled',
      })
      .populate('student');
    return enrollments.map((e) => e.student);
  },

  // Get teaching history
  async getTeachingHistory() {
    return await mongoose
      .model('Enrollment')
      .find({
        course: { $in: this.currentlyTeaching },
        status: 'completed',
      })
      .populate('course')
      .populate('student')
      .sort('-academicYear -semester');
  },

  // Get years of service
  getYearsOfService() {
    return new Date().getFullYear() - this.joiningDate.getFullYear();
  },
};

// Static methods
teacherSchema.statics = {
  // Find by department
  async findByDepartment(departmentId) {
    return this.find({ department: departmentId })
      .populate('department')
      .populate('currentlyTeaching');
  },

  // Find active teachers
  async findActive() {
    return this.find({ status: 'active' })
      .populate('department')
      .populate('currentlyTeaching');
  },
};

module.exports = mongoose.model('Teacher', teacherSchema);
