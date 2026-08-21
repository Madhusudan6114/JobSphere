import Job from '../models/Job.js';

// @desc    Create a new job (Recruiter only)
// @route   POST /api/jobs
export const createJob = async (req, res) => {
  try {
    const { title, company, description, location, salary, skills, jobType } = req.body;

    if (!title || !company || !description || !location || !salary || !skills) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const job = await Job.create({
      title,
      company,
      description,
      location,
      salary,
      skills: Array.isArray(skills) ? skills : skills.split(',').map((s) => s.trim()),
      jobType,
      createdBy: req.user._id, // Injected by authMiddleware
    });

    res.status(201).json({ success: true, message: 'Job posted successfully', job });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all jobs (Open to all authenticated users)
// @route   GET /api/jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('createdBy', 'name email').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('createdBy', 'name email');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a job (Recruiter owner only)
// @route   DELETE /api/jobs/:id
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Verify if the logged-in user is the owner of the job
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized: You can only delete your own jobs' });
    }

    await job.deleteOne();
    res.status(200).json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};