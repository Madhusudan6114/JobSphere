import express from 'express';
import { createJob, getAllJobs, getJobById, deleteJob } from '../controllers/jobController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Publicly viewable for any logged in user; only recruiters can create
router
  .route('/')
  .get(protect, getAllJobs)
  .post(protect, authorizeRoles('recruiter'), createJob);

router
  .route('/:id')
  .get(protect, getJobById)
  .delete(protect, authorizeRoles('recruiter'), deleteJob);

export default router;