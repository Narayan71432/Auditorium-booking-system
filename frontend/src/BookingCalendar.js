import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Button, Modal, Form, Spinner } from 'react-bootstrap';
import { getEvents } from './utils/apiConfig';
import CustomToolbar from './CustomToolbar'; // Import the custom toolbar

const localizer = momentLocalizer(moment);

const BookingCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: null,
    end: null,
    department: '',
    coordinator: '',
    speaker: '',
    requiredAttendance: 0
  });

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch events from backend
        const fetchedEvents = await getEvents();
        
        // Filter to only show approved events
        const approvedEvents = fetchedEvents
          .filter(event => event.status === 'Approved')
          .map(event => ({
            id: event._id,
            title: event.topic,
            start: new Date(event.startDate),
            end: new Date(event.endDate),
            department: event.department,
            coordinator: event.coordinatorName,
            speaker: event.speakerName,
            requiredAttendance: event.requiredAttendance,
            hall: event.hall,
            status: event.status
          }));
        
        setEvents(approvedEvents);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to fetch events. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  const handleSelect = ({ start, end }) => {
    setNewEvent({
      ...newEvent,
      start,
      end
    });
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    // Reset new event state
    setNewEvent({
      title: '',
      start: null,
      end: null,
      department: '',
      coordinator: '',
      speaker: '',
      requiredAttendance: 0
    });
  };

  const handleEventSubmit = () => {
    if (newEvent.title) {
      setEvents([
        ...events,
        {
          title: newEvent.title,
          start: newEvent.start,
          end: newEvent.end,
          department: newEvent.department,
          coordinator: newEvent.coordinator,
          speaker: newEvent.speaker,
          requiredAttendance: newEvent.requiredAttendance
        }
      ]);
      handleModalClose();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Custom event component to display more details
  const EventComponent = ({ event }) => (
    <div style={{ 
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      backgroundColor: '#3174ad',
      color: 'white',
      borderRadius: '4px',
      padding: '2px 5px',
      fontSize: '12px'
    }}>
      <strong>{event.title}</strong>
      <div>{event.hall} - {event.department}</div>
    </div>
  );
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      width: '100%',  
      maxWidth: '1200px',  
      margin: '16px auto'  
    }}>
      <div style={{ 
        width: '100%',  
        height: '90vh',  
        minHeight: '600px'  
      }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelect}
          date={date}
          onNavigate={(newDate) => setDate(newDate)}
          view={view}
          onView={(newView) => setView(newView)}
          toolbar
          components={{ 
            toolbar: CustomToolbar,
            event: EventComponent
          }}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: '#3174ad',
              borderRadius: '4px',
              opacity: 0.8,
              color: 'white',
              border: '0px',
              display: 'block'
            }
          })}
          tooltipAccessor={(event) => `${event.title}\nHall: ${event.hall}\nDepartment: ${event.department}\nCoordinator: ${event.coordinator}\nSpeaker: ${event.speaker}\nAttendance: ${event.requiredAttendance}`}
          style={{ 
            height: '100%', 
            width: '100%',
            fontSize: '16px'  
          }}
        />
      </div>

      {/* Event Creation Modal */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Event Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newEvent.title}
                onChange={handleInputChange}
                placeholder="Enter event title"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Department</Form.Label>
              <Form.Control
                type="text"
                name="department"
                value={newEvent.department}
                onChange={handleInputChange}
                placeholder="Enter department"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Coordinator</Form.Label>
              <Form.Control
                type="text"
                name="coordinator"
                value={newEvent.coordinator}
                onChange={handleInputChange}
                placeholder="Enter coordinator name"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Speaker</Form.Label>
              <Form.Control
                type="text"
                name="speaker"
                value={newEvent.speaker}
                onChange={handleInputChange}
                placeholder="Enter speaker name"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Required Attendance</Form.Label>
              <Form.Control
                type="number"
                name="requiredAttendance"
                value={newEvent.requiredAttendance}
                onChange={handleInputChange}
                placeholder="Enter required attendance"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEventSubmit}>
            Create Event
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BookingCalendar;
