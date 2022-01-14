import express from 'express';
import {
  getAllReviews,
  createAReview,
  deleteAReview,
} from '../controllers/reviewController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

// No the params coming from other route is accessible to all the route as we set the mergerParams true.
const router = express.Router({ mergeParams: true });

// POST /tour/234faad4/reviews
// GET /tour/234faad4/reviews
// GET /tour/234faad4/reviews/94887fda

router
  .route('/')
  .get(protect, getAllReviews)
  .post(protect, restrictTo('user'), createAReview); // Only User can create Reviews

router.route('/:id').delete(protect, deleteAReview);

export default router;