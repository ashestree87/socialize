import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  LinearProgress,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Image as ImageIcon,
  VideoLibrary as VideoIcon,
  Article as ArticleIcon,
  Add as AddIcon,
} from '@mui/icons-material';

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video' | 'document';
  name: string;
  size: number;
  uploadProgress: number;
  status: 'uploading' | 'completed' | 'error';
  metadata?: {
    title?: string;
    description?: string;
    tags?: string[];
  };
}

const ContentUploader: React.FC = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []) as File[];
    
    const newFiles: MediaFile[] = selectedFiles.map(file => {
      const fileType = file.type.startsWith('image/')
        ? 'image'
        : file.type.startsWith('video/')
        ? 'video'
        : 'document';

      return {
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        preview: fileType === 'image' ? URL.createObjectURL(file) : '',
        type: fileType,
        name: file.name,
        size: file.size,
        uploadProgress: 0,
        status: 'uploading',
        metadata: {
          title: file.name.split('.')[0],
          description: '',
          tags: [],
        },
      };
    });

    setFiles(prevFiles => [...prevFiles, ...newFiles]);
    simulateUpload(newFiles);
  };

  const simulateUpload = (uploadFiles: MediaFile[]) => {
    uploadFiles.forEach(file => {
      const interval = setInterval(() => {
        setFiles(prevFiles => prevFiles.map(f => {
          if (f.id === file.id) {
            const progress = Math.min(f.uploadProgress + 10, 100);
            return {
              ...f,
              uploadProgress: progress,
              status: progress === 100 ? 'completed' : 'uploading',
            };
          }
          return f;
        }));
      }, 500);

      setTimeout(() => clearInterval(interval), 5000);
    });
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files) as File[];
    
    const newFiles: MediaFile[] = droppedFiles.map(file => ({
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
      type: file.type.startsWith('image/')
        ? 'image'
        : file.type.startsWith('video/')
        ? 'video'
        : 'document',
      name: file.name,
      size: file.size,
      uploadProgress: 0,
      status: 'uploading',
      metadata: {
        title: file.name.split('.')[0],
        description: '',
        tags: [],
      },
    }));

    setFiles(prevFiles => [...prevFiles, ...newFiles]);
    simulateUpload(newFiles);
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleDelete = (fileId: string) => {
    setFiles(prevFiles => prevFiles.filter(f => f.id !== fileId));
  };

  const handleEdit = (file: MediaFile) => {
    setSelectedFile(file);
    setIsDialogOpen(true);
  };

  const handleSaveMetadata = () => {
    if (!selectedFile) return;

    setFiles(prevFiles => prevFiles.map(f =>
      f.id === selectedFile.id ? { ...f, metadata: selectedFile.metadata } : f
    ));
    setIsDialogOpen(false);
    setSelectedFile(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const getFileIcon = (type: MediaFile['type']) => {
    switch (type) {
      case 'image':
        return <ImageIcon />;
      case 'video':
        return <VideoIcon />;
      case 'document':
        return <ArticleIcon />;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Content Uploader
      </Typography>

      <Paper
        sx={{
          p: 3,
          mb: 3,
          border: '2px dashed',
          borderColor: 'divider',
          backgroundColor: 'background.default',
          textAlign: 'center',
          cursor: 'pointer',
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          multiple
          hidden
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*,video/*,.pdf,.doc,.docx"
        />
        <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Drag and drop files here
        </Typography>
        <Typography variant="body2" color="text.secondary">
          or click to select files
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ mt: 2 }}
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
        >
          Upload Files
        </Button>
      </Paper>

      <Grid container spacing={3}>
        {files.map((file) => (
          <Grid item xs={12} sm={6} md={4} key={file.id}>
            <Card>
              {file.type === 'image' && (
                <CardMedia
                  component="img"
                  height="200"
                  image={file.preview}
                  alt={file.name}
                />
              )}
              {file.type !== 'image' && (
                <Box
                  sx={{
                    height: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'action.hover',
                  }}
                >
                  {getFileIcon(file.type)}
                </Box>
              )}
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" noWrap>
                    {file.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatFileSize(file.size)}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Chip
                    label={file.type}
                    size="small"
                    icon={getFileIcon(file.type)}
                  />
                  <Chip
                    label={file.status}
                    color={file.status === 'completed' ? 'success' : 'default'}
                    size="small"
                  />
                </Stack>
                {file.status === 'uploading' && (
                  <LinearProgress
                    variant="determinate"
                    value={file.uploadProgress}
                    sx={{ mb: 2 }}
                  />
                )}
                {file.metadata?.tags && file.metadata.tags.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    {file.metadata.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                )}
              </CardContent>
              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => handleEdit(file)}
                  disabled={file.status === 'uploading'}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDelete(file.id)}
                  disabled={file.status === 'uploading'}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit File Metadata</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={selectedFile?.metadata?.title || ''}
              onChange={(e) => setSelectedFile(prev => prev ? {
                ...prev,
                metadata: { ...prev.metadata, title: e.target.value }
              } : null)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={selectedFile?.metadata?.description || ''}
              onChange={(e) => setSelectedFile(prev => prev ? {
                ...prev,
                metadata: { ...prev.metadata, description: e.target.value }
              } : null)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Tags"
              placeholder="Add tags separated by commas"
              value={selectedFile?.metadata?.tags?.join(', ') || ''}
              onChange={(e) => setSelectedFile(prev => prev ? {
                ...prev,
                metadata: { ...prev.metadata, tags: e.target.value.split(',').map(tag => tag.trim()) }
              } : null)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveMetadata} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContentUploader; 