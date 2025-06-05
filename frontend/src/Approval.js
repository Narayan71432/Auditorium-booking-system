import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from './config';
import { 
    DataGrid, 
    GridToolbar 
} from '@mui/x-data-grid';
import { 
    Card, 
    CircularProgress, 
    Alert, 
    Chip, 
    Typography, 
    Box, 
    Tooltip,
    Button
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import './Approval.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ErrorBoundary } from 'react-error-boundary';

const Approval = () => {
    // Custom theme for MUI DataGrid
    const theme = createTheme({
        components: {
            MuiDataGrid: {
                styleOverrides: {
                    toolbar: {
                        flexDirection: 'row',
                        '& .MuiButton-root': {
                            margin: '0 4px',
                        },
                        '& .MuiFormControl-root': {
                            margin: '0 4px',
                            minWidth: 'auto',
                        },
                    },
                },
            },
        },
    });
    
    const [bookingStatus, setBookingStatus] = useState('All');
    const [bookingDepartment, setBookingDepartment] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    
    // State for events and loading
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // State for current user's details
    const [currentUser, setCurrentUser] = useState({
        username: '',
        role: ''
    });

    // Fetch events from backend
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setIsLoading(true);
                setError(null);  // Clear any previous errors
                
                // Get token and user details from localStorage
                const token = localStorage.getItem('token');
                const storedUsername = localStorage.getItem('username');
                const storedRole = localStorage.getItem('role');
                
                // Update current user state
                setCurrentUser({
                    username: storedUsername || '',
                    role: storedRole || ''
                });
                
                console.group('🔍 Event Fetching Details');
                console.log('🔑 Token:', token ? 'Present' : 'Missing');
                console.log('👤 Current User:', {
                    username: storedUsername,
                    role: storedRole
                });
                
                // Detailed localStorage debugging
                console.log('🗃️ All localStorage items:');
                Object.keys(localStorage).forEach(key => {
                    console.log(`${key}: ${localStorage.getItem(key)}`);
                });
                
                // Detailed token validation
                if (!token) {
                    throw new Error('❌ No authentication token found. Please log in.');
                }

                // Validate admin role
                if (storedRole !== 'admin') {
                    throw new Error('🚫 Only admin users can access this page.');
                }
                
                console.log('Using API URL:', config.API_BASE_URL);
                const response = await axios.get(`${config.API_BASE_URL}/api/events/list`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        // Fetch all events
                        status: null,
                        department: bookingDepartment === 'All' ? null : bookingDepartment
                    }
                });
                
                // Extract events from response
                const fetchedEvents = response.data || [];
                
                console.log('📋 Raw Fetched Events:', fetchedEvents);
                console.log('📊 Fetched Events Type:', typeof fetchedEvents);
                console.log('🔢 Fetched Events Length:', fetchedEvents.length);
                
                if (!Array.isArray(fetchedEvents)) {
                    throw new Error('❌ Invalid response format: events is not an array');
                }

                // Validate and process events with extensive logging
                const processedEvents = fetchedEvents.map((event, index) => {
                    console.group(`🎉 Event ${index + 1}`);
                    console.log('🆔 Event ID:', event._id);
                    console.log('🧑 Creator Details:', event.createdBy);
                    
                    const startDate = event.startDate ? new Date(event.startDate) : null;
                const endDate = event.endDate ? new Date(event.endDate) : null;
                
                const processedEvent = {
                        ...event,
                        // Ensure all fields have a value with logging
                        topic: event.topic || 'N/A',
                        coordinatorName: event.coordinatorName || 'N/A',
                        speakerName: event.speakerName || 'N/A',
                        department: event.department || 'N/A',
                        status: event.status || 'Pending',
                        startDate: event.startDate || null,
                        endDate: event.endDate || null,
                        // Add unique id for DataGrid
                        id: event._id,
                        // Ensure creator details are preserved
                        username: event.createdBy?.username || 'Unknown',
                        // Add computed date and time fields
                        eventDate: startDate ? startDate.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        }) : 'N/A',
                        eventTime: startDate && endDate ? 
                            `${startDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${endDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : 
                            'N/A'
                    };

                    console.log('✅ Processed Event:', processedEvent);
                    console.groupEnd();

                    return processedEvent;
                });

                console.log('📦 All Processed Events:', processedEvents);
                console.groupEnd();

                // Update state
                setEvents(processedEvents);
                setFilteredEvents(processedEvents);
                setIsLoading(false);
            } catch (err) {
                console.group('❌ Event Fetching Error');
                console.error('🚨 Error Details:', {
                    name: err.name,
                    message: err.message,
                    stack: err.stack
                });
                
                // Log additional error details
                if (err.response) {
                    console.error('📡 Response Details:', {
                        status: err.response.status,
                        data: err.response.data,
                        headers: err.response.headers
                    });
                }
                
                // Detailed error message for user
                const errorMessage = err.response?.data?.message || 
                    err.message || 
                    'An unexpected error occurred while fetching events';
                
                setError(errorMessage);
                console.groupEnd();
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, [bookingDepartment]);

    // Filter events based on search, status, and department
    useEffect(() => {
        let results = events;

        // Filter by status if not 'All'
        if (bookingStatus !== 'All') {
            results = results.filter(event => event.status === bookingStatus);
        }

        // Filter by department if not 'All'
        if (bookingDepartment !== 'All') {
            results = results.filter(event => event.department === bookingDepartment);
        }

        // Filter by search term
        if (searchTerm) {
            const searchTermLower = searchTerm.toLowerCase();
            results = results.filter(event => 
                event.coordinatorName?.toLowerCase().includes(searchTermLower) ||
                event.speakerName?.toLowerCase().includes(searchTermLower) ||
                event.topic?.toLowerCase().includes(searchTermLower)
            );
        }

        setFilteredEvents(results);
    }, [events, bookingStatus, bookingDepartment, searchTerm]);

    const handleApproveRequest = async (id) => {
        try {
            const token = localStorage.getItem('token');
            console.log(`Using API URL: ${config.API_BASE_URL} for approve event ${id}`);
            
            await axios.patch(`${config.API_BASE_URL}/api/events/${id}/approve`, 
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            // Update local state to change status
            const updatedEvents = events.map(event => 
                event._id === id ? { ...event, status: 'Approved' } : event
            );
            
            // Always set events to show all data
            setEvents(updatedEvents);
            
            // Reset filters to show all events
            setBookingStatus('All');
            setBookingDepartment('All');
            setSearchTerm('');
            
            // Set filtered events to all events
            setFilteredEvents(updatedEvents);
        } catch (error) {
            console.error('Error approving event:', error);
            setError('Failed to approve event');
        }
    };

    const handleRejectRequest = async (id) => {
        try {
            const token = localStorage.getItem('token');
            console.log(`Using API URL: ${config.API_BASE_URL} for reject event ${id}`);
            
            await axios.patch(`${config.API_BASE_URL}/api/events/${id}/reject`, 
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            // Update local state to change status
            const updatedEvents = events.map(event => 
                event._id === id ? { ...event, status: 'Rejected' } : event
            );
            
            // Always set events to show all data
            setEvents(updatedEvents);
            
            // Reset filters to show all events
            setBookingStatus('All');
            setBookingDepartment('All');
            setSearchTerm('');
            
            // Set filtered events to all events
            setFilteredEvents(updatedEvents);
        } catch (error) {
            console.error('Error rejecting event:', error);
            setError('Failed to reject event');
        }
    };

    // Comprehensive error boundary for DataGrid
    const ErrorFallback = ({ error }) => {
        console.error('DataGrid Rendering Error:', error);
        return (
            <Alert severity="error" sx={{ width: '100%' }}>
                An error occurred while rendering the events table. 
                Please refresh the page or contact support.
                Error: {error.message}
            </Alert>
        );
    };

    const columns = [
        { 
            field: '_id', 
            headerName: 'Event ID', 
            width: 100,
            hide: true
        },
        { 
            field: 'topic', 
            headerName: 'Event Topic', 
            width: 200,
            flex: 0.5,
            renderCell: (params) => (
                <Tooltip title={params.value || 'N/A'} placement="top">
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis', 
                            whiteSpace: 'nowrap' 
                        }}
                    >
                        {params.value || 'N/A'}
                    </Typography>
                </Tooltip>
            )
        },
        { 
            field: 'username', 
            headerName: 'Created By', 
            width: 150,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                        {params.row.createdBy?.username || 'N/A'}
                    </Typography>
                </Box>
            )
        },
        { 
            field: 'eventDate', 
            headerName: 'Event Date', 
            width: 150,
            renderCell: (params) => {
                // If we have a computed eventDate field, use it
                if (params.row.eventDate) {
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EventIcon fontSize="small" color="action" />
                            <Typography variant="body2">{params.row.eventDate}</Typography>
                        </Box>
                    );
                }
                
                // Otherwise compute from startDate
                const startDate = params.row.startDate ? new Date(params.row.startDate) : null;
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EventIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                            {startDate 
                                ? startDate.toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })
                                : 'N/A'
                            }
                        </Typography>
                    </Box>
                );
            }
        },
        { 
            field: 'eventTime', 
            headerName: 'Event Time', 
            width: 180,
            renderCell: (params) => {
                // If we have a computed eventTime field, use it
                if (params.row.eventTime) {
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EventIcon fontSize="small" color="action" />
                            <Typography variant="body2">{params.row.eventTime}</Typography>
                        </Box>
                    );
                }
                
                // Otherwise compute from startDate and endDate
                const startDate = params.row.startDate ? new Date(params.row.startDate) : null;
                const endDate = params.row.endDate ? new Date(params.row.endDate) : null;
                
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EventIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                            {startDate && endDate 
                                ? `${startDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${endDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
                                : 'N/A'
                            }
                        </Typography>
                    </Box>
                );
            }
        },
        { 
            field: 'coordinatorName', 
            headerName: 'Event Coordinator', 
            width: 150,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                        {params.value || 'N/A'}
                    </Typography>
                </Box>
            )
        },
        { 
            field: 'speakerName', 
            headerName: 'Speaker', 
            width: 150,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                        {params.value || 'N/A'}
                    </Typography>
                </Box>
            )
        },
        { 
            field: 'department', 
            headerName: 'Department', 
            width: 120,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                        {params.value || 'N/A'}
                    </Typography>
                </Box>
            )
        },
        { 
            field: 'status', 
            headerName: 'Status', 
            width: 100,
            renderCell: (params) => (
                <Chip 
                    label={params.value || 'Pending'} 
                    color={
                        params.value === 'Approved' ? 'success' : 
                        params.value === 'Rejected' ? 'error' : 
                        'warning'
                    }
                    size="small"
                />
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        disabled={params.row.status !== 'Pending'}
                        onClick={() => handleApproveRequest(params.row._id)}
                    >
                        Approve
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        disabled={params.row.status !== 'Pending'}
                        onClick={() => handleRejectRequest(params.row._id)}
                    >
                        Reject
                    </Button>
                </Box>
            )
        }
    ];

    // Comprehensive logging for events
    useEffect(() => {
        console.group('Events Debug');
        console.log('All Events:', events);
        console.log('Filtered Events:', filteredEvents);
        
        // Detailed logging of each event
        filteredEvents.forEach((event, index) => {
            console.group(`Event ${index + 1}`);
            console.log('Full Event Object:', event);
            console.log('Event ID:', event._id);
            console.log('CreatedBy:', event.createdBy);
            console.log('Username:', event.createdBy?.username);
            console.groupEnd();
        });

        // Log if no events are found
        if (filteredEvents.length === 0) {
            console.warn('No events found in filteredEvents');
        }
        console.groupEnd();
    }, [events, filteredEvents]);

    // Render loading or error state
    if (isLoading) {
        return (
            <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Card>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                {error}
            </Alert>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <div className="approval-container">
                <h1>Event Approval Dashboard</h1>
                <p>Welcome, {currentUser.username} (Admin)</p>
                
                {/* Filter section - horizontal layout */}
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'row', 
                    justifyContent: 'flex-start',
                    flexWrap: 'wrap',
                    gap: 2,
                    mb: 3,
                    alignItems: 'center'
                }}>
                    {/* Search input */}
                    <Box sx={{ minWidth: '200px', flex: 1 }}>
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                fontSize: '14px'
                            }}
                        />
                    </Box>
                    
                    {/* Status filter */}
                    <Box>
                        <label style={{ marginRight: '8px', fontSize: '14px' }}>Status: </label>
                        <select 
                            value={bookingStatus} 
                            onChange={(e) => setBookingStatus(e.target.value)}
                            style={{
                                padding: '8px 12px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                fontSize: '14px'
                            }}
                        >
                            <option value="All">All</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </Box>
                    
                    {/* Department filter */}
                    <Box>
                        <label style={{ marginRight: '8px', fontSize: '14px' }}>Department: </label>
                        <select 
                            value={bookingDepartment} 
                            onChange={(e) => setBookingDepartment(e.target.value)}
                            style={{
                                padding: '8px 12px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                fontSize: '14px'
                            }}
                        >
                            <option value="All">All</option>
                            <option value="IT">IT</option>
                            <option value="HR">HR</option>
                            <option value="Finance">Finance</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Operations">Operations</option>
                        </select>
                    </Box>
                </Box>
            
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    width: '100%', 
                    overflow: 'auto' 
                }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Events List
                    </Typography>
                
                {/* Render DataGrid with error boundary */}
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <Card sx={{ height: '100%', overflow: 'auto', margin: '0 0 20px 0' }}>
                        <DataGrid
                            rows={filteredEvents.map((event, index) => ({
                                ...event,
                                id: event._id || `event_${index}`,
                                createdBy: event.createdBy || { 
                                    username: 'Unknown' 
                                }
                            }))}
                            columns={columns}
                            getRowId={(row) => row.id}
                            loading={isLoading}
                            components={{
                                Toolbar: GridToolbar
                            }}
                            componentsProps={{
                                toolbar: {
                                    showQuickFilter: true,
                                    quickFilterProps: { debounceMs: 500 },
                                    sx: {
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        p: 1,
                                        '& .MuiButtonBase-root': {
                                            mx: 1
                                        },
                                        '& .MuiFormControl-root': {
                                            mx: 1,
                                            width: 'auto'
                                        }
                                    }
                                }
                            }}
                            initialState={{
                                pagination: {
                                    paginationModel: { pageSize: 10 }
                                }
                            }}
                            pageSizeOptions={[5, 10, 25]}
                            onRowClick={(params) => {
                                console.log('Row clicked:', params.row);
                            }}
                            onError={(error) => {
                                console.error('DataGrid Error:', error);
                            }}
                        />
                    </Card>
                </ErrorBoundary>
            </Box>
        </div>
    </ThemeProvider>
    );
};

export default Approval;
