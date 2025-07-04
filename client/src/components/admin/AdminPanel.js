import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, Grid, Card, CardContent } from '@mui/material';

const AdminPanel = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fbRes, anRes] = await Promise.all([
          axios.get('/admin/feedback'),
          axios.get('/admin/analytics')
        ]);
        
        setFeedbacks(fbRes.data);
        setAnalytics(anRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err.response.data);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/admin/feedback/${id}`, { status });
      setFeedbacks(feedbacks.map(fb => 
        fb._id === id ? { ...fb, status } : fb
      ));
    } catch (err) {
      console.error(err.response.data);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Forms</Typography>
              <Typography variant="h3">{analytics.formCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Feedback</Typography>
              <Typography variant="h3">{analytics.feedbackCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Users</Typography>
              <Typography variant="h3">{analytics.userCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Typography variant="h5" gutterBottom>
        Feedback Moderation
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Form</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feedbacks.map((feedback) => (
              <TableRow key={feedback._id}>
                <TableCell>{feedback.formId?.title}</TableCell>
                <TableCell>{feedback.userId?.email}</TableCell>
                <TableCell>{new Date(feedback.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{feedback.status}</TableCell>
                <TableCell>
                  <Select
                    value={feedback.status}
                    onChange={(e) => updateStatus(feedback._id, e.target.value)}
                    size="small"
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Feedback Analytics
        </Typography>
        <Grid container spacing={3}>
          {analytics.feedbackByStatus.map((stat) => (
            <Grid item xs={12} md={4} key={stat._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{stat._id}</Typography>
                  <Typography variant="h3">{stat.count}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default AdminPanel;
