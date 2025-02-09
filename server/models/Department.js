// src/models/Department.js
const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    headOfDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
    },
    establishedDate: Date,
    description: String,
    contactEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    contactPhone: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
departmentSchema.index({
  name: 'text',
  code: 'text',
  description: 'text',
});

// Methods
departmentSchema.methods = {
  // Get all teachers in department
  async getTeachers() {
    return await mongoose.model('Teacher').find({ department: this._id });
  },

  // Get all students in department
  async getStudents() {
    return await mongoose.model('Student').find({ department: this._id });
  },

  // Get all courses offered by department
  async getCourses() {
    return await mongoose.model('Course').find({ department: this._id });
  },

  // Get department statistics
  async getStats() {
    const [teacherCount, studentCount, courseCount] = await Promise.all([
      mongoose.model('Teacher').countDocuments({ department: this._id }),
      mongoose.model('Student').countDocuments({ department: this._id }),
      mongoose.model('Course').countDocuments({ department: this._id }),
    ]);

    return {
      teacherCount,
      studentCount,
      courseCount,
    };
  },
};

// Static methods
departmentSchema.statics = {
  // Find department by code
  async findByCode(code) {
    return this.findOne({ code: code.toUpperCase() });
  },

  // Get departments with student count
  async getDepartmentsWithStats() {
    const departments = await this.find();
    return Promise.all(
      departments.map(async (dept) => {
        const stats = await dept.getStats();
        return {
          ...dept.toObject(),
          stats,
        };
      })
    );
  },
};

module.exports = mongoose.model('Department', departmentSchema);
