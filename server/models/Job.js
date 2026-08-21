import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    salary: {
      type: Number,
      required: [true, 'Salary is required'],
    },
    skills: {
      type: [String], // Array of strings (e.g. ["React", "Node.js"])
      required: [true, 'At least one skill is required'],
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
      default: 'Full-time',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Establishes relationship to User model
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Job', jobSchema);