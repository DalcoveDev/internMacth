import { Request, Response } from 'express';
import pool from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';

// Get all discussions
export const getDiscussions = async (req: Request, res: Response) => {
  try {
    const [discussions] = await pool.execute(`
      SELECT 
        d.id,
        d.title,
        d.content,
        d.user_id,
        d.created_at,
        u.name as author,
        u.role as authorRole,
        COUNT(dr.id) as replies,
        COUNT(dl.id) as likes,
        GROUP_CONCAT(dt.tag_name) as tags
      FROM discussions d
      JOIN users u ON d.user_id = u.id
      LEFT JOIN discussion_replies dr ON d.id = dr.discussion_id
      LEFT JOIN discussion_likes dl ON d.id = dl.discussion_id
      LEFT JOIN discussion_tags dt ON d.id = dt.discussion_id
      GROUP BY d.id
      ORDER BY d.created_at DESC
    `);

    // Format the discussions data
    const formattedDiscussions = (discussions as any[]).map(discussion => ({
      id: discussion.id,
      title: discussion.title,
      content: discussion.content,
      author: discussion.author,
      authorRole: discussion.authorRole,
      replies: discussion.replies,
      likes: discussion.likes,
      tags: discussion.tags ? discussion.tags.split(',') : [],
      timeAgo: getTimeAgo(new Date(discussion.created_at))
    }));

    res.json({
      success: true,
      data: formattedDiscussions
    });
  } catch (error) {
    console.error('Error fetching discussions:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch discussions' }
    });
  }
};

// Get a single discussion by ID
export const getDiscussionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const [discussions] = await pool.execute(`
      SELECT 
        d.id,
        d.title,
        d.content,
        d.user_id,
        d.created_at,
        u.name as author,
        u.role as authorRole,
        COUNT(dr.id) as replies,
        COUNT(dl.id) as likes,
        GROUP_CONCAT(dt.tag_name) as tags
      FROM discussions d
      JOIN users u ON d.user_id = u.id
      LEFT JOIN discussion_replies dr ON d.id = dr.discussion_id
      LEFT JOIN discussion_likes dl ON d.id = dl.discussion_id
      LEFT JOIN discussion_tags dt ON d.id = dt.discussion_id
      WHERE d.id = ?
      GROUP BY d.id
    `, [id]);

    if ((discussions as any[]).length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Discussion not found' }
      });
    }

    const discussion = (discussions as any[])[0];
    const formattedDiscussion = {
      id: discussion.id,
      title: discussion.title,
      content: discussion.content,
      author: discussion.author,
      authorRole: discussion.authorRole,
      replies: discussion.replies,
      likes: discussion.likes,
      tags: discussion.tags ? discussion.tags.split(',') : [],
      timeAgo: getTimeAgo(new Date(discussion.created_at))
    };

    res.json({
      success: true,
      data: formattedDiscussion
    });
  } catch (error) {
    console.error('Error fetching discussion:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch discussion' }
    });
  }
};

// Create a new discussion
export const createDiscussion = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, tags } = req.body;
    const userId = req.user!.id;

    // Validate input
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: { message: 'Title and content are required' }
      });
    }

    // Create discussion
    const [result]: any = await pool.execute(
      'INSERT INTO discussions (title, content, user_id) VALUES (?, ?, ?)',
      [title, content, userId]
    );

    const discussionId = result.insertId;

    // Add tags if provided
    if (tags && Array.isArray(tags) && tags.length > 0) {
      for (const tag of tags) {
        await pool.execute(
          'INSERT INTO discussion_tags (discussion_id, tag_name) VALUES (?, ?)',
          [discussionId, tag]
        );
      }
    }

    // Fetch the created discussion
    const [discussions] = await pool.execute(
      `SELECT 
        d.id,
        d.title,
        d.content,
        d.user_id,
        d.created_at,
        u.name as author,
        u.role as authorRole,
        COUNT(dr.id) as replies,
        COUNT(dl.id) as likes,
        GROUP_CONCAT(dt.tag_name) as tags
      FROM discussions d
      JOIN users u ON d.user_id = u.id
      LEFT JOIN discussion_replies dr ON d.id = dr.discussion_id
      LEFT JOIN discussion_likes dl ON d.id = dl.discussion_id
      LEFT JOIN discussion_tags dt ON d.id = dt.discussion_id
      WHERE d.id = ?
      GROUP BY d.id`,
      [discussionId]
    );

    const discussion = (discussions as any[])[0];
    const formattedDiscussion = {
      id: discussion.id,
      title: discussion.title,
      content: discussion.content,
      author: discussion.author,
      authorRole: discussion.authorRole,
      replies: discussion.replies,
      likes: discussion.likes,
      tags: discussion.tags ? discussion.tags.split(',') : [],
      timeAgo: getTimeAgo(new Date(discussion.created_at))
    };

    res.status(201).json({
      success: true,
      data: formattedDiscussion,
      message: 'Discussion created successfully'
    });
  } catch (error) {
    console.error('Error creating discussion:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create discussion' }
    });
  }
};

// Update a discussion
export const updateDiscussion = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, tags } = req.body;
    const userId = req.user!.id;

    // Check if discussion exists and belongs to user
    const [discussions] = await pool.execute(
      'SELECT * FROM discussions WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if ((discussions as any[]).length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Discussion not found or unauthorized' }
      });
    }

    // Update discussion
    await pool.execute(
      'UPDATE discussions SET title = ?, content = ? WHERE id = ?',
      [title, content, id]
    );

    // Update tags if provided
    if (tags && Array.isArray(tags)) {
      // Delete existing tags
      await pool.execute('DELETE FROM discussion_tags WHERE discussion_id = ?', [id]);
      
      // Add new tags
      for (const tag of tags) {
        await pool.execute(
          'INSERT INTO discussion_tags (discussion_id, tag_name) VALUES (?, ?)',
          [id, tag]
        );
      }
    }

    // Fetch the updated discussion
    const [updatedDiscussions] = await pool.execute(
      `SELECT 
        d.id,
        d.title,
        d.content,
        d.user_id,
        d.created_at,
        u.name as author,
        u.role as authorRole,
        COUNT(dr.id) as replies,
        COUNT(dl.id) as likes,
        GROUP_CONCAT(dt.tag_name) as tags
      FROM discussions d
      JOIN users u ON d.user_id = u.id
      LEFT JOIN discussion_replies dr ON d.id = dr.discussion_id
      LEFT JOIN discussion_likes dl ON d.id = dl.discussion_id
      LEFT JOIN discussion_tags dt ON d.id = dt.discussion_id
      WHERE d.id = ?
      GROUP BY d.id`,
      [id]
    );

    const discussion = (updatedDiscussions as any[])[0];
    const formattedDiscussion = {
      id: discussion.id,
      title: discussion.title,
      content: discussion.content,
      author: discussion.author,
      authorRole: discussion.authorRole,
      replies: discussion.replies,
      likes: discussion.likes,
      tags: discussion.tags ? discussion.tags.split(',') : [],
      timeAgo: getTimeAgo(new Date(discussion.created_at))
    };

    res.json({
      success: true,
      data: formattedDiscussion,
      message: 'Discussion updated successfully'
    });
  } catch (error) {
    console.error('Error updating discussion:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update discussion' }
    });
  }
};

// Delete a discussion
export const deleteDiscussion = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Check if discussion exists and belongs to user (or user is admin)
    const [discussions] = await pool.execute(
      'SELECT * FROM discussions WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if ((discussions as any[]).length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Discussion not found or unauthorized' }
      });
    }

    // Delete discussion (cascading will delete replies, likes, and tags)
    await pool.execute('DELETE FROM discussions WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Discussion deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting discussion:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to delete discussion' }
    });
  }
};

// Get all events
export const getEvents = async (req: Request, res: Response) => {
  try {
    const [events] = await pool.execute(`
      SELECT 
        id,
        title,
        description,
        event_date,
        event_time,
        location,
        event_type,
        attendees_count,
        created_at
      FROM community_events
      ORDER BY event_date ASC
    `);

    // Format the events data
    const formattedEvents = (events as any[]).map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: formatDate(new Date(event.event_date)),
      time: event.event_time,
      location: event.location,
      type: event.event_type,
      attendees: event.attendees_count,
      createdAt: event.created_at
    }));

    res.json({
      success: true,
      data: formattedEvents
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch events' }
    });
  }
};

// Get a single event by ID
export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const [events] = await pool.execute(`
      SELECT 
        id,
        title,
        description,
        event_date,
        event_time,
        location,
        event_type,
        attendees_count,
        created_at
      FROM community_events
      WHERE id = ?
    `, [id]);

    if ((events as any[]).length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Event not found' }
      });
    }

    const event = (events as any[])[0];
    const formattedEvent = {
      id: event.id,
      title: event.title,
      description: event.description,
      date: formatDate(new Date(event.event_date)),
      time: event.event_time,
      location: event.location,
      type: event.event_type,
      attendees: event.attendees_count,
      createdAt: event.created_at
    };

    res.json({
      success: true,
      data: formattedEvent
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch event' }
    });
  }
};

// Create a new event
export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, date, time, location, type } = req.body;
    const userId = req.user!.id;

    // Validate input
    if (!title || !date || !time || !location) {
      return res.status(400).json({
        success: false,
        error: { message: 'Title, date, time, and location are required' }
      });
    }

    // Create event
    const [result]: any = await pool.execute(
      `INSERT INTO community_events 
        (title, description, event_date, event_time, location, event_type, created_by) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, description, date, time, location, type, userId]
    );

    const eventId = result.insertId;

    // Fetch the created event
    const [events] = await pool.execute(
      `SELECT 
        id,
        title,
        description,
        event_date,
        event_time,
        location,
        event_type,
        attendees_count,
        created_at
      FROM community_events
      WHERE id = ?`,
      [eventId]
    );

    const event = (events as any[])[0];
    const formattedEvent = {
      id: event.id,
      title: event.title,
      description: event.description,
      date: formatDate(new Date(event.event_date)),
      time: event.event_time,
      location: event.location,
      type: event.event_type,
      attendees: event.attendees_count,
      createdAt: event.created_at
    };

    res.status(201).json({
      success: true,
      data: formattedEvent,
      message: 'Event created successfully'
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create event' }
    });
  }
};

// Update an event
export const updateEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, date, time, location, type } = req.body;
    const userId = req.user!.id;

    // Check if event exists and belongs to user
    const [events] = await pool.execute(
      'SELECT * FROM community_events WHERE id = ? AND created_by = ?',
      [id, userId]
    );

    if ((events as any[]).length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Event not found or unauthorized' }
      });
    }

    // Update event
    await pool.execute(
      `UPDATE community_events 
       SET title = ?, description = ?, event_date = ?, event_time = ?, 
           location = ?, event_type = ? 
       WHERE id = ?`,
      [title, description, date, time, location, type, id]
    );

    // Fetch the updated event
    const [updatedEvents] = await pool.execute(
      `SELECT 
        id,
        title,
        description,
        event_date,
        event_time,
        location,
        event_type,
        attendees_count,
        created_at
      FROM community_events
      WHERE id = ?`,
      [id]
    );

    const event = (updatedEvents as any[])[0];
    const formattedEvent = {
      id: event.id,
      title: event.title,
      description: event.description,
      date: formatDate(new Date(event.event_date)),
      time: event.event_time,
      location: event.location,
      type: event.event_type,
      attendees: event.attendees_count,
      createdAt: event.created_at
    };

    res.json({
      success: true,
      data: formattedEvent,
      message: 'Event updated successfully'
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update event' }
    });
  }
};

// Delete an event
export const deleteEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Check if event exists and belongs to user
    const [events] = await pool.execute(
      'SELECT * FROM community_events WHERE id = ? AND created_by = ?',
      [id, userId]
    );

    if ((events as any[]).length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Event not found or unauthorized' }
      });
    }

    // Delete event
    await pool.execute('DELETE FROM community_events WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to delete event' }
    });
  }
};

// Get all achievements
export const getAchievements = async (req: Request, res: Response) => {
  try {
    const [achievements] = await pool.execute(`
      SELECT 
        id,
        title,
        description,
        icon,
        created_at
      FROM community_achievements
      ORDER BY created_at DESC
    `);

    // Get recent recipients for each achievement
    const achievementsWithRecipients = await Promise.all(
      (achievements as any[]).map(async (achievement) => {
        const [recipients] = await pool.execute(
          `SELECT u.name 
           FROM user_achievements ua
           JOIN users u ON ua.user_id = u.id
           WHERE ua.achievement_id = ?
           ORDER BY ua.awarded_at DESC
           LIMIT 5`,
          [achievement.id]
        );

        return {
          id: achievement.id,
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon,
          users: (recipients as any[]).map(recipient => recipient.name)
        };
      })
    );

    res.json({
      success: true,
      data: achievementsWithRecipients
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch achievements' }
    });
  }
};

// Get a single achievement by ID
export const getAchievementById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const [achievements] = await pool.execute(`
      SELECT 
        id,
        title,
        description,
        icon,
        created_at
      FROM community_achievements
      WHERE id = ?
    `, [id]);

    if ((achievements as any[]).length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Achievement not found' }
      });
    }

    const achievement = (achievements as any[])[0];
    
    // Get recipients for this achievement
    const [recipients] = await pool.execute(
      `SELECT u.name 
       FROM user_achievements ua
       JOIN users u ON ua.user_id = u.id
       WHERE ua.achievement_id = ?
       ORDER BY ua.awarded_at DESC`,
      [id]
    );

    const achievementWithRecipients = {
      id: achievement.id,
      title: achievement.title,
      description: achievement.description,
      icon: achievement.icon,
      users: (recipients as any[]).map(recipient => recipient.name)
    };

    res.json({
      success: true,
      data: achievementWithRecipients
    });
  } catch (error) {
    console.error('Error fetching achievement:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch achievement' }
    });
  }
};

// Create a new achievement (admin only)
export const createAchievement = async (req: AuthRequest, res: Response) => {
  try {
    // Check if user is admin
    if (req.user!.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { message: 'Unauthorized: Admin access required' }
      });
    }

    const { title, description, icon } = req.body;

    // Validate input
    if (!title || !description || !icon) {
      return res.status(400).json({
        success: false,
        error: { message: 'Title, description, and icon are required' }
      });
    }

    // Create achievement
    const [result]: any = await pool.execute(
      'INSERT INTO community_achievements (title, description, icon) VALUES (?, ?, ?)',
      [title, description, icon]
    );

    const achievementId = result.insertId;

    // Fetch the created achievement
    const [achievements] = await pool.execute(
      `SELECT 
        id,
        title,
        description,
        icon,
        created_at
      FROM community_achievements
      WHERE id = ?`,
      [achievementId]
    );

    const achievement = (achievements as any[])[0];

    res.status(201).json({
      success: true,
      data: achievement,
      message: 'Achievement created successfully'
    });
  } catch (error) {
    console.error('Error creating achievement:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create achievement' }
    });
  }
};

// Update an achievement (admin only)
export const updateAchievement = async (req: AuthRequest, res: Response) => {
  try {
    // Check if user is admin
    if (req.user!.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { message: 'Unauthorized: Admin access required' }
      });
    }

    const { id } = req.params;
    const { title, description, icon } = req.body;

    // Check if achievement exists
    const [achievements] = await pool.execute(
      'SELECT * FROM community_achievements WHERE id = ?',
      [id]
    );

    if ((achievements as any[]).length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Achievement not found' }
      });
    }

    // Update achievement
    await pool.execute(
      'UPDATE community_achievements SET title = ?, description = ?, icon = ? WHERE id = ?',
      [title, description, icon, id]
    );

    // Fetch the updated achievement
    const [updatedAchievements] = await pool.execute(
      `SELECT 
        id,
        title,
        description,
        icon,
        created_at
      FROM community_achievements
      WHERE id = ?`,
      [id]
    );

    const achievement = (updatedAchievements as any[])[0];

    res.json({
      success: true,
      data: achievement,
      message: 'Achievement updated successfully'
    });
  } catch (error) {
    console.error('Error updating achievement:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update achievement' }
    });
  }
};

// Delete an achievement (admin only)
export const deleteAchievement = async (req: AuthRequest, res: Response) => {
  try {
    // Check if user is admin
    if (req.user!.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { message: 'Unauthorized: Admin access required' }
      });
    }

    const { id } = req.params;

    // Check if achievement exists
    const [achievements] = await pool.execute(
      'SELECT * FROM community_achievements WHERE id = ?',
      [id]
    );

    if ((achievements as any[]).length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Achievement not found' }
      });
    }

    // Delete achievement (cascading will delete user achievements)
    await pool.execute('DELETE FROM community_achievements WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Achievement deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting achievement:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to delete achievement' }
    });
  }
};

// Award an achievement to a user (admin only)
export const awardAchievement = async (req: AuthRequest, res: Response) => {
  try {
    // Check if user is admin
    if (req.user!.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { message: 'Unauthorized: Admin access required' }
      });
    }

    const { userId, achievementId } = req.body;

    // Check if user exists
    const [users] = await pool.execute('SELECT * FROM users WHERE id = ?', [userId]);
    if ((users as any[]).length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    // Check if achievement exists
    const [achievements] = await pool.execute('SELECT * FROM community_achievements WHERE id = ?', [achievementId]);
    if ((achievements as any[]).length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Achievement not found' }
      });
    }

    // Check if user already has this achievement
    const [userAchievements] = await pool.execute(
      'SELECT * FROM user_achievements WHERE user_id = ? AND achievement_id = ?',
      [userId, achievementId]
    );

    if ((userAchievements as any[]).length > 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'User already has this achievement' }
      });
    }

    // Award achievement
    await pool.execute(
      'INSERT INTO user_achievements (user_id, achievement_id) VALUES (?, ?)',
      [userId, achievementId]
    );

    res.json({
      success: true,
      message: 'Achievement awarded successfully'
    });
  } catch (error) {
    console.error('Error awarding achievement:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to award achievement' }
    });
  }
};

// Helper function to calculate time ago
const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

// Helper function to format date
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};