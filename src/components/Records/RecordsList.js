import {
    Add,
    Close,
    KeyboardArrowDown,
    KeyboardArrowUp,
    Search,
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Collapse,
    Dialog,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import { getRecords, searchRecord } from '../../services/api';


// Record Row Component with expandable details
const RecordRow = ({ record }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src={record.image} alt={record.name} />
            {record.name}
          </Box>
        </TableCell>
        <TableCell>{record.licenseNum}</TableCell>
        <TableCell>{record.age}</TableCell>
        <TableCell>{record.address}</TableCell>
        <TableCell>
          {record.violationRecords.filter(v => v.title).length}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Violation Details
              </Typography>
              <Grid container spacing={2}>
                {record.violationRecords
                  .filter(violation => violation.title)
                  .map((violation, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1">
                            {violation.title}
                          </Typography>
                          <Chip
                            label={`Fine: Rs. ${violation.fine}`}
                            color="error"
                            size="small"
                            sx={{ mt: 1 }}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

// Search Dialog Component
const SearchDialog = ({ open, onClose }) => {
  const [licenseNumber, setLicenseNumber] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const { showNotification } = useNotification();

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await searchRecord(licenseNumber);
      setSearchResult(response.data);
      if (!response.data) {
        showNotification('No record found', 'info');
      }
    } catch (error) {
      showNotification('Error searching record', 'error');
      setSearchResult(null);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Search Records</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        <form onSubmit={handleSearch}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              label="License Number"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              startIcon={<Search />}
            >
              Search
            </Button>
          </Box>
        </form>

        {searchResult && (
          <Paper sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Avatar
                  src={searchResult.image}
                  sx={{ width: 150, height: 150, mb: 2 }}
                />
                <Typography variant="h6">{searchResult.name}</Typography>
                <Typography color="textSecondary">
                  License No: {searchResult.licenseNum}
                </Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography color="textSecondary">Age</Typography>
                    <Typography>{searchResult.age}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary">Sex</Typography>
                    <Typography>{searchResult.sex}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary">Date of Birth</Typography>
                    <Typography>{searchResult.dob}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary">Address</Typography>
                    <Typography>{searchResult.address}</Typography>
                  </Grid>
                </Grid>

                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                  Violations
                </Typography>
                {searchResult.violationRecords
                  .filter(violation => violation.title)
                  .map((violation, index) => (
                    <Card key={index} sx={{ mb: 1 }} variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2">
                          {violation.title}
                        </Typography>
                        <Chip
                          label={`Fine: Rs. ${violation.fine}`}
                          color="error"
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </CardContent>
                    </Card>
                  ))}
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>
    </Dialog>
  );
};

// Main RecordsList Component
const RecordsList = () => {
  const [records, setRecords] = useState([]);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const location = useLocation();

  useEffect(() => {
    fetchRecords();
    if (location.state?.openSearch) {
      setSearchDialogOpen(true);
    }
  }, [location]);

  const fetchRecords = async () => {
    try {
      const response = await getRecords();
      setRecords(response.data);
    } catch (error) {
      showNotification('Error fetching records', 'error');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Traffic Records</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Search />}
            onClick={() => setSearchDialogOpen(true)}
          >
            Search Record
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/records/add')}
          >
            Add New Record
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Name</TableCell>
              <TableCell>License Number</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Violations</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record) => (
              <RecordRow key={record._id} record={record} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <SearchDialog
        open={searchDialogOpen}
        onClose={() => setSearchDialogOpen(false)}
      />
    </Box>
  );
};

export default RecordsList;
