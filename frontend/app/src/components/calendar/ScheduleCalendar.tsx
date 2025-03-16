import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  addDays,
  subDays,
  isSameDay,
  addWeeks,
  subWeeks,
  isWithinInterval,
} from 'date-fns';

interface ScheduledPost {
  id: string;
  title: string;
  content: string;
  platform: string;
  scheduledDate: Date;
  mediaUrl?: string;
}

const ScheduleCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [posts, setPosts] = useState<ScheduledPost[]>([
    {
      id: '1',
      title: 'Product Launch',
      content: 'Introducing our new product line! Check it out now.',
      platform: 'Instagram',
      scheduledDate: new Date(new Date().setHours(10, 0, 0, 0)),
    },
    {
      id: '2',
      title: 'Summer Sale',
      content: 'Get ready for our biggest summer sale yet! Up to 50% off on all products.',
      platform: 'Facebook',
      scheduledDate: new Date(new Date().setHours(14, 30, 0, 0)),
    },
    {
      id: '3',
      title: 'Customer Testimonial',
      content: 'Hear what our customers have to say about our services.',
      platform: 'LinkedIn',
      scheduledDate: addDays(new Date(), 2),
    },
    {
      id: '4',
      title: 'Industry News',
      content: 'The latest trends and updates from the industry.',
      platform: 'Twitter',
      scheduledDate: addDays(new Date(), 3),
    },
  ]);

  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewPost, setIsNewPost] = useState(false);

  const start = startOfWeek(currentDate, { weekStartsOn: 1 });
  const end = endOfWeek(currentDate, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start, end });

  const handlePreviousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const handleNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleAddPost = () => {
    setIsNewPost(true);
    setSelectedPost({
      id: `post-${Date.now()}`,
      title: '',
      content: '',
      platform: '',
      scheduledDate: new Date(),
    });
    setIsDialogOpen(true);
  };

  const handleEditPost = (post: ScheduledPost) => {
    setIsNewPost(false);
    setSelectedPost({ ...post });
    setIsDialogOpen(true);
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleSavePost = () => {
    if (!selectedPost) return;

    if (isNewPost) {
      setPosts([...posts, selectedPost]);
    } else {
      setPosts(posts.map(post => (post.id === selectedPost.id ? selectedPost : post)));
    }

    setIsDialogOpen(false);
    setSelectedPost(null);
  };

  const handlePlatformChange = (event: SelectChangeEvent) => {
    if (!selectedPost) return;
    setSelectedPost({
      ...selectedPost,
      platform: event.target.value,
    });
  };

  const handleDateChange = (newDate: Date | null) => {
    if (!selectedPost || !newDate) return;
    setSelectedPost({
      ...selectedPost,
      scheduledDate: newDate,
    });
  };

  const getPostsForDay = (day: Date) => {
    return posts.filter(post => isSameDay(post.scheduledDate, day));
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Instagram':
        return '#E1306C';
      case 'Facebook':
        return '#4267B2';
      case 'Twitter':
        return '#1DA1F2';
      case 'LinkedIn':
        return '#0077B5';
      case 'TikTok':
        return '#000000';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Schedule Calendar
        </Typography>
        <Box>
          <Button variant="outlined" onClick={handleToday} sx={{ mr: 1 }}>
            Today
          </Button>
          <IconButton onClick={handlePreviousWeek}>
            <ChevronLeftIcon />
          </IconButton>
          <IconButton onClick={handleNextWeek}>
            <ChevronRightIcon />
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddPost}
            sx={{ ml: 2 }}
          >
            Add Post
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {format(start, 'MMMM d, yyyy')} - {format(end, 'MMMM d, yyyy')}
        </Typography>

        <Grid container spacing={2}>
          {days.map((day) => (
            <Grid item xs={12} sm={6} md={12 / 7} key={day.toString()}>
              <Paper
                sx={{
                  p: 2,
                  height: '100%',
                  minHeight: 200,
                  backgroundColor: isSameDay(day, new Date())
                    ? 'rgba(25, 118, 210, 0.08)'
                    : 'background.paper',
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={isSameDay(day, new Date()) ? 'bold' : 'normal'}
                  sx={{ mb: 2 }}
                >
                  {format(day, 'EEEE')}
                  <br />
                  {format(day, 'MMM d')}
                </Typography>

                {getPostsForDay(day).map((post) => (
                  <Box
                    key={post.id}
                    sx={{
                      p: 1,
                      mb: 1,
                      borderRadius: 1,
                      backgroundColor: 'background.paper',
                      borderLeft: `4px solid ${getPlatformColor(post.platform)}`,
                      boxShadow: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" fontWeight="bold">
                        {post.title}
                      </Typography>
                      <Box>
                        <IconButton size="small" onClick={() => handleEditPost(post)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeletePost(post.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="caption" display="block">
                      {format(post.scheduledDate, 'h:mm a')} · {post.platform}
                    </Typography>
                  </Box>
                ))}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isNewPost ? 'Add New Post' : 'Edit Post'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={selectedPost?.title || ''}
              onChange={(e) => selectedPost && setSelectedPost({ ...selectedPost, title: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Content"
              multiline
              rows={4}
              value={selectedPost?.content || ''}
              onChange={(e) => selectedPost && setSelectedPost({ ...selectedPost, content: e.target.value })}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Platform</InputLabel>
              <Select
                value={selectedPost?.platform || ''}
                label="Platform"
                onChange={handlePlatformChange}
              >
                <MenuItem value="Instagram">Instagram</MenuItem>
                <MenuItem value="Facebook">Facebook</MenuItem>
                <MenuItem value="Twitter">Twitter</MenuItem>
                <MenuItem value="LinkedIn">LinkedIn</MenuItem>
                <MenuItem value="TikTok">TikTok</MenuItem>
              </Select>
            </FormControl>
            <DateTimePicker
              label="Schedule Date & Time"
              value={selectedPost?.scheduledDate || null}
              onChange={handleDateChange}
              sx={{ width: '100%', mb: 2 }}
            />
            <TextField
              fullWidth
              label="Media URL (optional)"
              value={selectedPost?.mediaUrl || ''}
              onChange={(e) => selectedPost && setSelectedPost({ ...selectedPost, mediaUrl: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSavePost} variant="contained" color="primary">
            {isNewPost ? 'Add Post' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ScheduleCalendar; 