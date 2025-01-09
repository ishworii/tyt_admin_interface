import {
    Box,
    Button,
    Grid,
    MenuItem,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import { createRecord } from '../../services/api';

const AddRecord = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    licenseNum: '',
    name: '',
    sex: '',
    age: '',
    dob: '',
    address: '',
    violationRecords: [{ title: '', fine: '' }],
    image: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleViolationChange = (index, field, value) => {
    const newViolationRecords = [...formData.violationRecords];
    newViolationRecords[index] = {
      ...newViolationRecords[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      violationRecords: newViolationRecords
    }));
  };

  const handleAddViolation = () => {
    setFormData(prev => ({
      ...prev,
      violationRecords: [...prev.violationRecords, { title: '', fine: '' }]
    }));
  };

  const handleRemoveViolation = (index) => {
    setFormData(prev => ({
      ...prev,
      violationRecords: prev.violationRecords.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      image: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'violationRecords') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === 'image') {
          if (formData[key]) {
            formDataToSend.append(key, formData[key]);
          }
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      await createRecord(formDataToSend);
      showNotification('Record created successfully');
      navigate('/records');
    } catch (error) {
      showNotification('Error creating record', 'error');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Add New Record
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="License Number"
                name="licenseNum"
                value={formData.licenseNum}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Sex"
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                required
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ marginBottom: '1rem' }}
              />
            </Grid>

            {/* Violation Records */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Violation Records
              </Typography>
              {formData.violationRecords.map((violation, index) => (
                <Box key={index} sx={{ mb: 2, display: 'flex', gap: 2 }}>
                  <TextField
                    label="Violation Title"
                    value={violation.title}
                    onChange={(e) => handleViolationChange(index, 'title', e.target.value)}
                    sx={{ flex: 2 }}
                  />
                  <TextField
                    label="Fine Amount"
                    type="number"
                    value={violation.fine}
                    onChange={(e) => handleViolationChange(index, 'fine', e.target.value)}
                    sx={{ flex: 1 }}
                  />
                  <Button
                    color="error"
                    onClick={() => handleRemoveViolation(index)}
                    disabled={formData.violationRecords.length === 1}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
              <Button onClick={handleAddViolation}>
                Add Violation
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/records')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                >
                  Create Record
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AddRecord;
