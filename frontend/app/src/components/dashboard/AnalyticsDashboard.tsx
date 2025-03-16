import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Sample data for charts
const engagementData = [
  { name: 'Jan', likes: 4000, comments: 2400, shares: 1200 },
  { name: 'Feb', likes: 3000, comments: 1398, shares: 900 },
  { name: 'Mar', likes: 2000, comments: 9800, shares: 2200 },
  { name: 'Apr', likes: 2780, comments: 3908, shares: 2000 },
  { name: 'May', likes: 1890, comments: 4800, shares: 2181 },
  { name: 'Jun', likes: 2390, comments: 3800, shares: 2500 },
  { name: 'Jul', likes: 3490, comments: 4300, shares: 2100 },
];

const platformData = [
  { name: 'Instagram', value: 400 },
  { name: 'Twitter', value: 300 },
  { name: 'Facebook', value: 300 },
  { name: 'LinkedIn', value: 200 },
  { name: 'TikTok', value: 150 },
];

const contentPerformanceData = [
  { name: 'Images', views: 4000, engagement: 2400 },
  { name: 'Videos', views: 3000, engagement: 1398 },
  { name: 'Carousels', views: 2000, engagement: 9800 },
  { name: 'Text', views: 2780, engagement: 3908 },
  { name: 'Stories', views: 1890, engagement: 4800 },
];

const audienceData = [
  { name: '18-24', male: 400, female: 400, other: 200 },
  { name: '25-34', male: 300, female: 500, other: 100 },
  { name: '35-44', male: 200, female: 300, other: 50 },
  { name: '45-54', male: 200, female: 200, other: 30 },
  { name: '55+', male: 100, female: 100, other: 20 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Analytics Dashboard
        </Typography>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel id="time-range-select-label">Time Range</InputLabel>
          <Select
            labelId="time-range-select-label"
            id="time-range-select"
            value={timeRange}
            label="Time Range"
            onChange={handleTimeRangeChange}
          >
            <MenuItem value="7d">Last 7 days</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
            <MenuItem value="90d">Last 90 days</MenuItem>
            <MenuItem value="1y">Last year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Metrics Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Followers
              </Typography>
              <Typography variant="h4">24,532</Typography>
              <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                +5.3% from last period
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Engagement Rate
              </Typography>
              <Typography variant="h4">3.2%</Typography>
              <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                +0.8% from last period
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Posts
              </Typography>
              <Typography variant="h4">342</Typography>
              <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                +12 from last period
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avg. Reach per Post
              </Typography>
              <Typography variant="h4">5,234</Typography>
              <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
                -2.1% from last period
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Engagement Over Time */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Engagement Over Time
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={engagementData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="likes" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="comments" stroke="#82ca9d" />
            <Line type="monotone" dataKey="shares" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      <Grid container spacing={3}>
        {/* Platform Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Platform Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Content Performance */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Content Performance by Type
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={contentPerformanceData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="views" fill="#8884d8" />
                <Bar dataKey="engagement" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Audience Demographics */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Audience Demographics
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={audienceData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="male" stackId="a" fill="#8884d8" />
                <Bar dataKey="female" stackId="a" fill="#82ca9d" />
                <Bar dataKey="other" stackId="a" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsDashboard; 