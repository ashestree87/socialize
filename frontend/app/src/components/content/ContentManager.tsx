import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';

interface Post {
  id: string;
  title: string;
  content: string;
  type: 'image' | 'video' | 'text' | 'carousel';
  status: 'draft' | 'scheduled' | 'published';
  platforms: string[];
  mediaUrl?: string;
  scheduledDate?: Date;
  createdAt: Date;
}

const ContentManager: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      title: 'Summer Sale Announcement',
      content: 'Get ready for our biggest summer sale yet! Up to 50% off on all products.',
      type: 'image',
      status: 'published',
      platforms: ['Instagram', 'Facebook'],
      mediaUrl: 'https://source.unsplash.com/random/800x600/?summer',
      createdAt: new Date('2023-06-15'),
    },
    {
      id: '2',
      title: 'Product Launch',
      content: 'Introducing our new product line! Check it out now.',
      type: 'video',
      status: 'scheduled',
      platforms: ['Instagram', 'TikTok'],
      mediaUrl: 'https://source.unsplash.com/random/800x600/?product',
      scheduledDate: new Date('2023-07-20'),
      createdAt: new Date('2023-06-10'),
    },
    {
      id: '3',
      title: 'Customer Testimonial',
      content: 'Hear what our customers have to say about our services.',
      type: 'carousel',
      status: 'draft',
      platforms: ['Facebook', 'LinkedIn'],
      mediaUrl: 'https://source.unsplash.com/random/800x600/?people',
      createdAt: new Date('2023-06-05'),
    },
    {
      id: '4',
      title: 'Industry News Update',
      content: 'The latest trends and updates from the industry.',
      type: 'text',
      status: 'published',
      platforms: ['Twitter', 'LinkedIn'],
      createdAt: new Date('2023-06-01'),
    },
  ]);

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditPost = (post: Post) => {
    setSelectedPost({ ...post });
    setIsEditDialogOpen(true);
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleSavePost = () => {
    if (!selectedPost) return;

    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === selectedPost.id ? selectedPost : post
      )
    );
    
    setIsEditDialogOpen(false);
    setSelectedPost(null);
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    if (!selectedPost) return;
    setSelectedPost({
      ...selectedPost,
      status: event.target.value as 'draft' | 'scheduled' | 'published',
    });
  };

  const handlePlatformChange = (event: SelectChangeEvent<string[]>) => {
    if (!selectedPost) return;
    setSelectedPost({
      ...selectedPost,
      platforms: event.target.value as string[],
    });
  };

  const handleDateChange = (newDate: Date | null) => {
    if (!selectedPost) return;
    setSelectedPost({
      ...selectedPost,
      scheduledDate: newDate || undefined,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'scheduled':
        return 'info';
      case 'draft':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Content Manager
        </Typography>
        <Button variant="contained" color="primary">
          Create New Post
        </Button>
      </Box>

      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {post.mediaUrl && post.type !== 'video' && (
                <CardMedia
                  component="img"
                  height="140"
                  image={post.mediaUrl}
                  alt={post.title}
                />
              )}
              {post.mediaUrl && post.type === 'video' && (
                <CardMedia
                  component="video"
                  height="140"
                  image={post.mediaUrl}
                  title={post.title}
                  controls
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div" gutterBottom>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {post.content.length > 100
                    ? `${post.content.substring(0, 100)}...`
                    : post.content}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Chip
                    label={post.status}
                    size="small"
                    color={getStatusColor(post.status) as any}
                  />
                  <Chip label={post.type} size="small" />
                </Stack>
                <Stack direction="row" spacing={1}>
                  {post.platforms.map((platform) => (
                    <Chip key={platform} label={platform} size="small" variant="outlined" />
                  ))}
                </Stack>
                {post.scheduledDate && (
                  <Typography variant="caption" display="block" sx={{ mt: 2 }}>
                    Scheduled for: {post.scheduledDate.toLocaleString()}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <IconButton size="small" onClick={() => handleEditPost(post)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={() => handleDeletePost(post.id)}>
                  <DeleteIcon />
                </IconButton>
                <IconButton size="small">
                  <ShareIcon />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton size="small">
                  <MoreVertIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Post</DialogTitle>
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
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={selectedPost?.status || ''}
                    label="Status"
                    onChange={handleStatusChange}
                  >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="scheduled">Scheduled</MenuItem>
                    <MenuItem value="published">Published</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Platforms</InputLabel>
                  <Select
                    multiple
                    value={selectedPost?.platforms || []}
                    label="Platforms"
                    onChange={handlePlatformChange}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    <MenuItem value="Instagram">Instagram</MenuItem>
                    <MenuItem value="Facebook">Facebook</MenuItem>
                    <MenuItem value="Twitter">Twitter</MenuItem>
                    <MenuItem value="LinkedIn">LinkedIn</MenuItem>
                    <MenuItem value="TikTok">TikTok</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            {selectedPost?.status === 'scheduled' && (
              <DateTimePicker
                label="Schedule Date"
                value={selectedPost?.scheduledDate || null}
                onChange={handleDateChange}
                sx={{ width: '100%', mb: 2 }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSavePost} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContentManager; 