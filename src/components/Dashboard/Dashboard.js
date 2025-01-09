import {
    Add,
    Description,
    Gavel,
    Person,
    Search,
} from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Grid,
    Typography,
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Custom styled card component
const DashboardCard = ({ title, icon, description, buttonText, onClick, disabled }) => (
  <Card 
    sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: disabled ? 'none' : 'translateY(-5px)',
        boxShadow: disabled ? 1 : 3,
      },
      opacity: disabled ? 0.7 : 1,
    }}
  >
    <CardContent sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 2,
        color: 'primary.main' 
      }}>
        {React.cloneElement(icon, { sx: { fontSize: 40 } })}
        <Typography variant="h5" component="div" sx={{ ml: 2 }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="body1" color="text.secondary">
        {description}
      </Typography>
    </CardContent>
    <CardActions sx={{ p: 2, pt: 0 }}>
      <Button 
        size="large" 
        variant="contained" 
        fullWidth 
        onClick={onClick}
        disabled={disabled}
        startIcon={React.cloneElement(icon, { sx: { fontSize: 20 } })}
      >
        {buttonText}
      </Button>
    </CardActions>
  </Card>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const isAdmin = userRole === 'admin';

  const dashboardItems = [
    {
    title: 'Users List',
    icon: <Person />,
    description: "View list of all traffic personnel and administrators.",
    buttonText: "View Users",
    path: '/users',
    adminOnly: false // Make it accessible to all users
  },
    {
      title: 'Rules Management',
      icon: <Gavel />,
      description: "View and manage traffic rules and fines. Create, update, or remove traffic violation rules.",
      buttonText: "View Rules",
      path: '/rules',
      adminOnly: false // Changed to false to make it accessible to all
    },
    {
      title: 'Records Management',
      icon: <Description />,
      description: "View and manage traffic violation records. Access complete history of violations.",
      buttonText: "View Records",
      path: '/records',
      adminOnly: false
    },
    {
      title: 'Add New Record',
      icon: <Add />,
      description: "Create a new traffic violation record. Record details of new violations.",
      buttonText: "Add Record",
      path: '/records/add',
      adminOnly: false
    },
    {
      title: 'Search Records',
      icon: <Search />,
      description: "Search for specific traffic violation records by license number or other criteria.",
      buttonText: "Search Records",
      path: '/records/search',
      adminOnly: false
    }
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 4,
          pb: 2,
          borderBottom: '2px solid',
          borderColor: 'primary.main'
        }}
      >
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {dashboardItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <DashboardCard
              title={item.title}
              icon={item.icon}
              description={item.description}
              buttonText={item.buttonText}
              onClick={() => navigate(item.path)}
              disabled={item.adminOnly && !isAdmin}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
