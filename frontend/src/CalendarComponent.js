import React, { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { DataGrid } from '@mui/x-data-grid';
import { Card, Badge, Tooltip } from '@mui/material';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import { getEvents } from './utils/apiConfig';
import './CalendarComponent.modern.css';

const CalendarComponent = ({ onLogout }) => {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);
    const [bookingStatus, setBookingStatus] = useState('All');
    const [bookingDepartment, setBookingDepartment] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userDetails, setUserDetails] = useState({
        username: '',
        email: ''
    });
    // No longer using zoom context - using global zoom instead
    const calendarRef = useRef(null);

    // Fetch events from backend
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setIsLoading(true);
                
                const storedUsername = localStorage.getItem('username');
                const storedEmail = localStorage.getItem('email');
                
                setUserDetails({
                    username: storedUsername || '',
                    email: storedEmail || ''
                });
                
                // Use the apiConfig utility to fetch events
                const fetchedEvents = await getEvents();
                
                // Process the events data
                const processedEvents = fetchedEvents.map(event => ({
                    ...event,
                    id: event._id, // Ensure each event has an id for DataGrid
                    startDate: new Date(event.startDate),
                    endDate: new Date(event.endDate)
                }));
                
                setEvents(processedEvents);
                setFilteredEvents(processedEvents);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching events:', err);
                setError(err.message || 'Failed to fetch events');
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []);

    useEffect(() => {
        const results = events.filter(event =>
            (event.coordinatorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.speakerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.topic?.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (bookingStatus === 'All' || event.status === bookingStatus) &&
            (bookingDepartment === 'All' || event.department === bookingDepartment)
        );
        setFilteredEvents(results);
    }, [searchTerm, events, bookingStatus, bookingDepartment]);

    const handleDateChange = (date) => {
        setSelectedDate(date);

        const selectedDateStart = new Date(date).setHours(0, 0, 0, 0);
        const selectedDateEnd = new Date(date).setHours(23, 59, 59, 999);

        const results = events.filter(event => {
            const eventStart = new Date(event.startDate).getTime();
            const eventEnd = new Date(event.endDate).getTime();
            return (eventStart <= selectedDateEnd && eventEnd >= selectedDateStart) &&
                (event.coordinatorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.speakerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.topic?.toLowerCase().includes(searchTerm.toLowerCase())) &&
                (bookingStatus === 'All' || event.status === bookingStatus) &&
                (bookingDepartment === 'All' || event.department === bookingDepartment);
        });
        setFilteredEvents(results);
    };

    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
    };

    const handleStatusChange = (status) => {
        setBookingStatus(status);
    };

    const handleDepartmentChange = (department) => {
        setBookingDepartment(department);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 150 },
        { field: 'eventDate', headerName: 'Event Date', width: 150 },
        { field: 'eventTime', headerName: 'Event Time', width: 150 },
        { field: 'coordinatorName', headerName: 'Coordinator Name', width: 150 },
        { field: 'coordinatorNumber', headerName: 'Coordinator Number', width: 150 },
        { field: 'speakerName', headerName: 'Speaker Name', width: 150 },
        { field: 'speakerNumber', headerName: 'Speaker Number', width: 150 },
        { field: 'department', headerName: 'Department', width: 150 },
        { field: 'topic', headerName: 'Topic', width: 150 },
        { field: 'hall', headerName: 'Hall', width: 150 },
        { field: 'requiredAttendance', headerName: 'Required Attendance', width: 150 },
        { field: 'createdBy', headerName: 'Created By', width: 150 },
        { field: 'status', headerName: 'Status', width: 150 },
    ];

    const rows = filteredEvents.map(event => {
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);
        
        return {
            id: event.id || Math.random(),
            eventDate: startDate ? new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }).format(startDate) : '',
            eventTime: startDate && endDate ? `${startDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${endDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : '',
            coordinatorName: event.coordinatorName,
            coordinatorNumber: event.coordinatorNumber,
            speakerName: event.speakerName,
            speakerNumber: event.speakerNumber,
            department: event.department,
            topic: event.topic,
            hall: event.hall,
            requiredAttendance: event.requiredAttendance,
            createdBy: event.createdBy?.username || 'Unknown',
            status: event.status,
        };
    });

    if (isLoading) {
        return (
            <div className="calendar-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Loading events...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="calendar-page">
                <div className="error-container">
                    <h3>⚠️ Error Loading Events</h3>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="calendar-page">
            <div className="calendar-container-outer">
                {/* Header Section */}
                <div className="calendar-header">
                    <h1>📅 Booking Dashboard</h1>
                    <p>Welcome, {userDetails.username} • {userDetails.email}</p>
                </div>

                {/* Search and Filters Section */}
                <div className="search-filter-section">
                    <div className="search-input-wrapper">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search by coordinator, speaker, or topic..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="search-input"
                        />
                    </div>
                    <div className="filters-grid">
                        <div className="filter-group">
                            <label>Status Filter</label>
                            <select value={bookingStatus} onChange={(e) => handleStatusChange(e.target.value)}>
                                <option value="All">All Status</option>
                                <option value="Approved">✅ Approved</option>
                                <option value="Pending">⏳ Pending</option>
                                <option value="Rejected">❌ Rejected</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Department Filter</label>
                            <select value={bookingDepartment} onChange={(e) => handleDepartmentChange(e.target.value)}>
                                <option value="All">All Departments</option>
                                <option value="Department of ComputerScience">Computer Science</option>
                                <option value="Department of Electronics">Electronics</option>
                                <option value="Department of Mechanical">Mechanical</option>
                                <option value="Department of Aerospace">Aerospace</option>
                                <option value="Department of Biomedical">Biomedical</option>
                                <option value="Department of Aeronautical">Aeronautical</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Calendar Section */}
                <div className="calendar-section">
                    <button 
                        onClick={toggleCalendar} 
                        className="toggle-calendar-btn"
                    >
                        {showCalendar ? '📅 Hide Calendar' : '📅 Show Calendar'}
                        <ArrowDownward style={{ 
                            transition: 'transform 0.3s ease', 
                            transform: showCalendar ? 'rotate(180deg)' : 'rotate(0deg)',
                        }} />
                    </button>
                    {showCalendar && (
                        <div className="calendar-wrapper" ref={calendarRef}>
                            <Calendar
                                onChange={handleDateChange}
                                value={selectedDate}
                                tileContent={({ date, view }) => {
                                    if (view !== 'month') return null;
                                    
                                    const dateEvents = events.filter(event => {
                                        const eventDate = new Date(event.startDate);
                                        return date.getDate() === eventDate.getDate() &&
                                               date.getMonth() === eventDate.getMonth() &&
                                               date.getFullYear() === eventDate.getFullYear() &&
                                               event.status === 'Approved';
                                    });
                                    
                                    if (dateEvents.length > 0) {
                                        return (
                                            <Tooltip title={dateEvents.map(event => 
                                                `${event.topic} (${event.hall}) - ${new Date(event.startDate).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}`
                                            ).join('\n')}>
                                                <Badge 
                                                    badgeContent={dateEvents.length} 
                                                    color="primary"
                                                    style={{ position: 'absolute', top: '4px', right: '4px' }}
                                                />
                                            </Tooltip>
                                        );
                                    }
                                    return null;
                                }}
                                tileClassName={({ date, view }) => {
                                    if (view === 'month') {
                                        const dateHasEvents = events.some(event => {
                                            const eventDate = new Date(event.startDate);
                                            return date.getDate() === eventDate.getDate() &&
                                                   date.getMonth() === eventDate.getMonth() &&
                                                   date.getFullYear() === eventDate.getFullYear() &&
                                                   event.status === 'Approved';
                                        });
                                        
                                        return dateHasEvents ? 'has-events' : null;
                                    }
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Data Grid Section */}
                <div className="data-grid-section">
                    <div className="data-grid-header">
                        <h2>📋 Event Bookings</h2>
                        <span className="event-count">{filteredEvents.length} events</span>
                    </div>
                    <Card style={{ height: 600, width: '100%' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[10, 25, 50]}
                            disableSelectionOnClick
                        />
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CalendarComponent;
