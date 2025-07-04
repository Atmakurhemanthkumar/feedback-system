import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Typography, Paper, Box, TextField,
  Button, Radio, RadioGroup, FormControlLabel, FormControl,
  FormLabel, Checkbox, Select, MenuItem, Rating
} from '@mui/material';

const Feedback = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [history, setHistory] = useState([]);
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      axios.get(`/forms/${id}`)
        .then(res => {
          setForm(res.data);
          setLoading(false);

          // Initialize response structure
          const initial = {};
          res.data.questions.forEach(q => {
            initial[q.id] = q.type === 'checkbox' ? [] : '';
          });
          setResponses(initial);
        })
        .catch(err => {
          console.error("Form fetch error:", err.message);
          setLoading(false);
        });
    } else {
      axios.get('/feedback/history')
        .then(res => {
          setHistory(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("History fetch error:", err.message);
          setLoading(false);
        });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedResponses = Object.entries(responses).map(([questionId, answer]) => ({
        questionId,
        answer
      }));
      await axios.post('/feedback', {
        formId: id,
        responses: formattedResponses
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Submission error:", err.message);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  // ✅ Show feedback history at /feedback
 if (!id) {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        My Submitted Feedbacks
      </Typography>

      {history.length === 0 ? (
        <Typography>No feedbacks found.</Typography>
      ) : (
        history.map((fb) => (
          <Paper key={fb._id} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">
              {fb.formId?.title || "Untitled Form"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Submitted on: {new Date(fb.createdAt).toLocaleString()}
            </Typography>
            <Box mt={1}>
              {fb.responses.map((r, i) => (
                <Typography key={i}>
                  <strong>{r.questionId}:</strong>{" "}
                  {Array.isArray(r.answer) ? r.answer.join(", ") : r.answer}
                </Typography>
              ))}
            </Box>
          </Paper>
        ))
      )}
    </Container>
  );
}


  // ✅ Feedback form submission at /feedback/:id
  if (submitted) {
    return (
      <Container>
        <Typography variant="h5">Thank you for your feedback!</Typography>
        <Typography>Your responses have been submitted successfully.</Typography>
      </Container>
    );
  }

  if (!form) {
    return (
      <Container>
        <Typography variant="h5">Form loading failed.</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>{form.title}</Typography>
      <Typography variant="body1" gutterBottom>{form.description}</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        {form.questions.map((q) => (
          <FormControl key={q.id} fullWidth sx={{ mb: 3 }}>
            <FormLabel>{q.question} {q.required && '*'}</FormLabel>

            {q.type === 'text' && (
              <TextField
                required={q.required}
                multiline
                rows={3}
                value={responses[q.id] || ''}
                onChange={(e) => setResponses({ ...responses, [q.id]: e.target.value })}
              />
            )}

            {q.type === 'radio' && (
              <RadioGroup
                value={responses[q.id] || ''}
                onChange={(e) => setResponses({ ...responses, [q.id]: e.target.value })}
              >
                {q.options.map(opt => (
                  <FormControlLabel key={opt} value={opt} control={<Radio />} label={opt} />
                ))}
              </RadioGroup>
            )}

            {q.type === 'checkbox' && (
              <Box>
                {q.options.map(opt => (
                  <FormControlLabel
                    key={opt}
                    control={
                      <Checkbox
                        checked={(responses[q.id] || []).includes(opt)}
                        onChange={() => {
                          const current = responses[q.id] || [];
                          const updated = current.includes(opt)
                            ? current.filter(v => v !== opt)
                            : [...current, opt];
                          setResponses({ ...responses, [q.id]: updated });
                        }}
                      />
                    }
                    label={opt}
                  />
                ))}
              </Box>
            )}

            {q.type === 'dropdown' && (
              <Select
                value={responses[q.id] || ''}
                onChange={(e) => setResponses({ ...responses, [q.id]: e.target.value })}
                required={q.required}
              >
                <MenuItem value=""><em>Select an option</em></MenuItem>
                {q.options.map(opt => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </Select>
            )}

            {q.type === 'rating' && (
              <Rating
                value={Number(responses[q.id]) || 0}
                onChange={(e, newVal) => setResponses({ ...responses, [q.id]: newVal.toString() })}
                max={5}
              />
            )}
          </FormControl>
        ))}

        <Button type="submit" variant="contained">Submit Feedback</Button>
      </Box>
    </Container>
  );
};

export default Feedback;
