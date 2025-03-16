import React, { useState } from 'react';
import { Box, Typography, Container, Paper, Grid, MenuItem, TextField } from '@mui/material';
import AnalyticsDashboard from '../components/dashboard/AnalyticsDashboard';

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7days');
  
  const handleTimeRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTimeRange(event.target.value);
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Dashboard
        </Typography>
        
        <TextField
          select
          label="Time Range"
          value={timeRange}
          onChange={handleTimeRangeChange}
          variant="outlined"
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="7days">Last 7 Days</MenuItem>
          <MenuItem value="30days">Last 30 Days</MenuItem>
          <MenuItem value="90days">Last 90 Days</MenuItem>
          <MenuItem value="year">Last Year</MenuItem>
        </TextField>
      </Box>
      
      <Paper elevation={0} sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
        <AnalyticsDashboard />
      </Paper>
    </Container>
  );
};

export default Dashboard; 