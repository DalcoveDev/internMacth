import express from 'express';
import { 
  getDiscussions, 
  getDiscussionById,
  createDiscussion, 
  updateDiscussion,
  deleteDiscussion,
  getEvents, 
  getEventById,
  createEvent, 
  updateEvent,
  deleteEvent,
  getAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  awardAchievement
} from '../controllers/community';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Discussions routes
router.get('/discussions', getDiscussions);
router.get('/discussions/:id', getDiscussionById);
router.post('/discussions', authenticate, createDiscussion);
router.put('/discussions/:id', authenticate, updateDiscussion);
router.delete('/discussions/:id', authenticate, deleteDiscussion);

// Events routes
router.get('/events', getEvents);
router.get('/events/:id', getEventById);
router.post('/events', authenticate, createEvent);
router.put('/events/:id', authenticate, updateEvent);
router.delete('/events/:id', authenticate, deleteEvent);

// Achievements routes
router.get('/achievements', getAchievements);
router.get('/achievements/:id', getAchievementById);
router.post('/achievements', authenticate, createAchievement);
router.put('/achievements/:id', authenticate, updateAchievement);
router.delete('/achievements/:id', authenticate, deleteAchievement);
router.post('/achievements/award', authenticate, awardAchievement);

export default router;