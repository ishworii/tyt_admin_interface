import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { createRule, updateRule } from '../../services/api';

const RuleDialog = ({ open, onClose, ruleToEdit }) => {
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    title: '',
    fine: '',
  });

  useEffect(() => {
    if (ruleToEdit) {
      setFormData({
        title: ruleToEdit.title,
        fine: ruleToEdit.fine,
      });
    }
  }, [ruleToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (ruleToEdit) {
        await updateRule(ruleToEdit._id, formData);
        showNotification('Rule updated successfully');
      } else {
        await createRule(formData);
        showNotification('Rule created successfully');
      }
      onClose(true); // true indicates successful operation
    } catch (error) {
      showNotification('Error saving rule', 'error');
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {ruleToEdit ? 'Edit Traffic Rule' : 'Add New Traffic Rule'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              name="title"
              label="Rule Title"
              value={formData.title}
              onChange={handleChange}
              required
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              name="fine"
              label="Fine Amount"
              value={formData.fine}
              onChange={handleChange}
              required
              fullWidth
              type="number"
              InputProps={{
                startAdornment: 'Rs. ',
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose(false)}>Cancel</Button>
          <Button type="submit" variant="contained">
            {ruleToEdit ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RuleDialog;
