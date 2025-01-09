import { Add, Delete, Edit, Search } from '@mui/icons-material';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { createRule, deleteRule, getRules, updateRule } from '../../services/api';

// RuleDialog Component (Internal component for add/edit functionality)
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
    } else {
      setFormData({
        title: '',
        fine: '',
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
      onClose(true);
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

// Main RulesList Component
const RulesList = () => {
  const [rules, setRules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await getRules();
      setRules(response.data);
    } catch (error) {
      showNotification('Error fetching rules', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      try {
        await deleteRule(id);
        fetchRules();
        showNotification('Rule deleted successfully');
      } catch (error) {
        showNotification('Error deleting rule', 'error');
      }
    }
  };

  const handleOpenDialog = (rule = null) => {
    setSelectedRule(rule);
    setOpenDialog(true);
  };

  const handleCloseDialog = (refresh = false) => {
    setSelectedRule(null);
    setOpenDialog(false);
    if (refresh) {
      fetchRules();
    }
  };

  const getFineColor = (fine) => {
    if (fine <= 500) return 'success';
    if (fine <= 1000) return 'warning';
    return 'error';
  };

  const filteredRules = rules.filter(rule =>
    rule.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Traffic Rules Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total Rules: {rules.length}
        </Typography>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <TextField
          placeholder="Search rules..."
          variant="outlined"
          size="small"
          sx={{ width: '300px' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add New Rule
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rule Title</TableCell>
              <TableCell align="center">Fine Amount</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRules.map((rule) => (
              <TableRow 
                key={rule._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{rule.title}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={`Rs. ${rule.fine}`}
                    color={getFineColor(rule.fine)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => handleOpenDialog(rule)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={() => handleDelete(rule._id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <RuleDialog
        open={openDialog}
        onClose={handleCloseDialog}
        ruleToEdit={selectedRule}
      />
    </div>
  );
};

export default RulesList;
