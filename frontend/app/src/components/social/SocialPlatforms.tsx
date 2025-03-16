import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Chip,
  Avatar,
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
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import {
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Link as LinkIcon,
} from '@mui/icons-material';

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  profileUrl: string;
  connected: boolean;
  avatar?: string;
  stats: {
    followers: number;
    following: number;
    posts: number;
    engagement: number;
  };
}

const SocialPlatforms: React.FC = () => {
  const [accounts, setAccounts] = useState<SocialAccount[]>([
    {
      id: '1',
      platform: 'Instagram',
      username: 'yourbrand',
      profileUrl: 'https://instagram.com/yourbrand',
      connected: true,
      avatar: 'https://source.unsplash.com/random/100x100/?profile',
      stats: {
        followers: 12500,
        following: 850,
        posts: 342,
        engagement: 3.2,
      },
    },
    {
      id: '2',
      platform: 'Facebook',
      username: 'Your Brand',
      profileUrl: 'https://facebook.com/yourbrand',
      connected: true,
      avatar: 'https://source.unsplash.com/random/100x100/?profile',
      stats: {
        followers: 25800,
        following: 0,
        posts: 520,
        engagement: 1.8,
      },
    },
    {
      id: '3',
      platform: 'Twitter',
      username: '@yourbrand',
      profileUrl: 'https://twitter.com/yourbrand',
      connected: true,
      avatar: 'https://source.unsplash.com/random/100x100/?profile',
      stats: {
        followers: 8900,
        following: 1200,
        posts: 1560,
        engagement: 2.5,
      },
    },
    {
      id: '4',
      platform: 'LinkedIn',
      username: 'Your Brand Inc.',
      profileUrl: 'https://linkedin.com/company/yourbrand',
      connected: false,
      avatar: 'https://source.unsplash.com/random/100x100/?profile',
      stats: {
        followers: 3400,
        following: 0,
        posts: 85,
        engagement: 4.1,
      },
    },
  ]);

  const [selectedAccount, setSelectedAccount] = useState<SocialAccount | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewAccount, setIsNewAccount] = useState(false);

  const handleAddAccount = () => {
    setIsNewAccount(true);
    setSelectedAccount({
      id: `account-${Date.now()}`,
      platform: '',
      username: '',
      profileUrl: '',
      connected: false,
      stats: {
        followers: 0,
        following: 0,
        posts: 0,
        engagement: 0,
      },
    });
    setIsDialogOpen(true);
  };

  const handleEditAccount = (account: SocialAccount) => {
    setIsNewAccount(false);
    setSelectedAccount({ ...account });
    setIsDialogOpen(true);
  };

  const handleDeleteAccount = (accountId: string) => {
    setAccounts(accounts.filter(account => account.id !== accountId));
  };

  const handleSaveAccount = () => {
    if (!selectedAccount) return;

    if (isNewAccount) {
      setAccounts([...accounts, selectedAccount]);
    } else {
      setAccounts(accounts.map(account => 
        account.id === selectedAccount.id ? selectedAccount : account
      ));
    }

    setIsDialogOpen(false);
    setSelectedAccount(null);
  };

  const handlePlatformChange = (event: SelectChangeEvent) => {
    if (!selectedAccount) return;
    setSelectedAccount({
      ...selectedAccount,
      platform: event.target.value,
    });
  };

  const handleConnectionToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedAccount) return;
    setSelectedAccount({
      ...selectedAccount,
      connected: event.target.checked,
    });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Instagram':
        return <InstagramIcon sx={{ color: '#E1306C' }} />;
      case 'Facebook':
        return <FacebookIcon sx={{ color: '#4267B2' }} />;
      case 'Twitter':
        return <TwitterIcon sx={{ color: '#1DA1F2' }} />;
      case 'LinkedIn':
        return <LinkedInIcon sx={{ color: '#0077B5' }} />;
      default:
        return <LinkIcon />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Social Platforms
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddAccount}
        >
          Add Account
        </Button>
      </Box>

      <Grid container spacing={3}>
        {accounts.map((account) => (
          <Grid item xs={12} sm={6} md={4} key={account.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={account.avatar}
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="h6" component="div">
                      {account.username}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getPlatformIcon(account.platform)}
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                        {account.platform}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ flexGrow: 1 }} />
                  <Chip
                    label={account.connected ? 'Connected' : 'Disconnected'}
                    color={account.connected ? 'success' : 'default'}
                    size="small"
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Followers
                    </Typography>
                    <Typography variant="h6">
                      {formatNumber(account.stats.followers)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Following
                    </Typography>
                    <Typography variant="h6">
                      {formatNumber(account.stats.following)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Posts
                    </Typography>
                    <Typography variant="h6">
                      {formatNumber(account.stats.posts)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Engagement
                    </Typography>
                    <Typography variant="h6">
                      {account.stats.engagement}%
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<LinkIcon />}
                  href={account.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Profile
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton size="small" onClick={() => handleEditAccount(account)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={() => handleDeleteAccount(account.id)}>
                  <DeleteIcon />
                </IconButton>
                <IconButton size="small">
                  <RefreshIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isNewAccount ? 'Add Social Account' : 'Edit Social Account'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Platform</InputLabel>
              <Select
                value={selectedAccount?.platform || ''}
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
            <TextField
              fullWidth
              label="Username"
              value={selectedAccount?.username || ''}
              onChange={(e) => selectedAccount && setSelectedAccount({ ...selectedAccount, username: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Profile URL"
              value={selectedAccount?.profileUrl || ''}
              onChange={(e) => selectedAccount && setSelectedAccount({ ...selectedAccount, profileUrl: e.target.value })}
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={selectedAccount?.connected || false}
                  onChange={handleConnectionToggle}
                />
              }
              label="Connected"
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveAccount} variant="contained" color="primary">
            {isNewAccount ? 'Add Account' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SocialPlatforms; 