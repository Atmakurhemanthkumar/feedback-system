import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Card, CardContent, Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

const Forms = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await axios.get('/forms');
        setForms(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err.response.data);
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Available Forms
      </Typography>
      <Grid container spacing={3}>
        {forms.map((form) => (
          <Grid item xs={12} sm={6} md={4} key={form._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{form.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {form.description}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button
                    component={Link}
                    to={`/feedback/${form._id}`}
                    variant="contained"
                    size="small"
                  >
                    Provide Feedback
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Forms;
