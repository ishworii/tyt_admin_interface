import { Search } from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Grid,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { searchRecord } from '../../services/api';

const SearchRecord = () => {
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Search Records
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSearch}>
          <Box sx={{ display: 'flex', gap: 2 }}>
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
      </Paper>

      {searchResult && (
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Avatar
                src={searchResult.image}
                sx={{ width: 200, height: 200, mb: 2 }}
              />
              <Typography variant="h6">{searchResult.name}</Typography>
              <Typography color="textSecondary">
                License No: {searchResult.licenseNum}
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
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
              </Box>

              <Typography variant="h6" gutterBottom>
                Violation Records
              </Typography>
              {searchResult.violationRecords
                .filter(violation => violation.title) // Filter out empty violations
                .map((violation, index) => (
                  <Card key={index} sx={{ mb: 1 }}>
                    <CardContent>
                      <Typography variant="subtitle1">
                        {violation.title}
                      </Typography>
                      <Chip
                        label={`Fine: Rs. ${violation.fine}`}
                        color="error"
                        size="small"
                      />
                    </CardContent>
                  </Card>
                ))}
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default SearchRecord;
