import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAvailability, createEvent } from './utils/apiConfig';
import { Form, Button, Container, Row, Col, Alert, ListGroup } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { setHours, setMinutes } from 'date-fns';
import './BookingForm.css';

function EventForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    department: '',
    topic: '',
    coordinatorName: '',
    coordinatorNumber: '',
    speakerName: '',
    speakerNumber: '',
    requiredAttendance: '',
    hall: '',
    startDate: new Date(),
    endDate: new Date(),
    duration: '1', // Default duration in hours
    startTime: null,
  });

  const [availabilityStatus, setAvailabilityStatus] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [conflictingEvents, setConflictingEvents] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  
  // Time slots are defined with 30-minute intervals from 9 AM to 5 PM
  
  // Time slots for availability check
  const timeSlots = [
    { start: '09:00', end: '10:00', label: '9:00 AM - 10:00 AM' },
    { start: '10:00', end: '11:00', label: '10:00 AM - 11:00 AM' },
    { start: '11:00', end: '12:00', label: '11:00 AM - 12:00 PM' },
    { start: '12:00', end: '13:00', label: '12:00 PM - 1:00 PM' },
    { start: '13:00', end: '14:00', label: '1:00 PM - 2:00 PM' },
    { start: '14:00', end: '15:00', label: '2:00 PM - 3:00 PM' },
    { start: '15:00', end: '16:00', label: '3:00 PM - 4:00 PM' },
    { start: '16:00', end: '17:00', label: '4:00 PM - 5:00 PM' },
  ];

  // Calculate end time based on start time and duration
  const calculateEndTime = (startTime, durationHours) => {
    if (!startTime) return new Date();
    
    const endTime = new Date(startTime);
    const durationMs = parseFloat(durationHours) * 60 * 60 * 1000;
    endTime.setTime(endTime.getTime() + durationMs);
    return endTime;
  };

  const handleDateChange = (name, date) => {
    if (name === 'startDate') {
      // If only changing the date part, preserve the time part if it exists
      if (formData.startTime) {
        const newDate = new Date(date);
        newDate.setHours(
          formData.startTime.getHours(),
          formData.startTime.getMinutes(),
          0, 0
        );
        date = newDate;
      }
      
      // Calculate end date based on duration
      const endDate = calculateEndTime(date, formData.duration);
      
      setFormData(prev => ({
        ...prev,
        [name]: date,
        endDate: endDate,
        startTime: date // Update startTime when startDate changes
      }));
    } else if (name === 'startTime') {
      // When only time changes, preserve the date part
      const newStartDate = new Date(formData.startDate);
      newStartDate.setHours(
        date.getHours(),
        date.getMinutes(),
        0, 0
      );
      
      // Calculate end date based on duration
      const endDate = calculateEndTime(newStartDate, formData.duration);
      
      setFormData(prev => ({
        ...prev,
        startDate: newStartDate,
        endDate: endDate,
        startTime: date
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: date
      }));
    }
    
    // Reset availability status when date or time changes
    setAvailabilityStatus(null);
    setAvailableTimeSlots([]);
    setConflictingEvents([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for phone numbers - only allow digits and limit to 10 digits
    if (name === 'coordinatorNumber' || name === 'speakerNumber') {
      // Remove any non-digit characters
      const digitsOnly = value.replace(/\D/g, '');
      // Limit to 10 digits
      const limitedValue = digitsOnly.slice(0, 10);
      
      setFormData(prev => ({
        ...prev,
        [name]: limitedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Reset availability status when hall changes
    if (name === 'hall') {
      setAvailabilityStatus(null);
      setAvailableTimeSlots([]);
      setConflictingEvents([]);
    }
  };

  const handleCheckAvailability = async () => {
    if (!formData.startDate || !formData.hall) {
      setError('Please select both date and hall');
      return;
    }
    
    try {
      setIsCheckingAvailability(true);
      setError('');
      
      // Format date for API request
      const dateStr = formData.startDate.toISOString().split('T')[0];
      
      // Check availability with backend
      const result = await checkAvailability({
        date: dateStr,
        hall: formData.hall
      });
      
      setAvailabilityStatus(result.available);
      
      // Store conflicting events regardless of availability status
      if (result.conflictingEvents && result.conflictingEvents.length > 0) {
        setConflictingEvents(result.conflictingEvents);
      } else {
        setConflictingEvents([]);
      }
      
      // Check if there are approved events (this is the key check)
      const hasApprovedEvents = result.hasApprovedEvents || 
        (result.conflictingEvents && result.conflictingEvents.some(event => event.status === 'Approved'));
      
      // If there are approved events, don't show any time slots
      if (hasApprovedEvents) {
        setAvailableTimeSlots([]);
        // Override availability status to false if there are approved events
        setAvailabilityStatus(false);
      } else if (!result.available) {
        // No approved events but still marked as unavailable
        setAvailableTimeSlots([]);
      } else {
        // Filter available time slots based on all conflicting events
        const bookedSlots = new Set();
        
        // Check all conflicting events (approved ones should already be filtered out by backend)
        if (result.conflictingEvents && result.conflictingEvents.length > 0) {
          result.conflictingEvents.forEach(event => {
            const eventStart = new Date(event.startDate);
            const eventEnd = new Date(event.endDate);
            
            // Mark time slots that overlap with existing events as booked
            timeSlots.forEach((slot, index) => {
              const slotStartHour = parseInt(slot.start.split(':')[0]);
              const slotEndHour = parseInt(slot.end.split(':')[0]);
              
              const slotStartDate = new Date(formData.startDate);
              slotStartDate.setHours(slotStartHour, 0, 0, 0);
              
              const slotEndDate = new Date(formData.startDate);
              slotEndDate.setHours(slotEndHour, 0, 0, 0);
              
              // Check if this slot overlaps with the event
              if (slotStartDate < eventEnd && slotEndDate > eventStart) {
                bookedSlots.add(index);
              }
            });
          });
        }
        
        // Filter available slots
        const available = timeSlots.filter((_, index) => !bookedSlots.has(index));
        setAvailableTimeSlots(available);
      }
    } catch (err) {
      setError(err.message || 'Failed to check availability');
      setAvailabilityStatus(false);
    } finally {
      setIsCheckingAvailability(false);
    }
  };
  
  const handleTimeSlotSelect = (slot) => {
    // Set start and end dates based on selected time slot
    const startDate = new Date(formData.startDate);
    const [startHour, startMinute] = slot.start.split(':').map(Number);
    startDate.setHours(startHour, startMinute, 0, 0);
    
    const endDate = new Date(formData.startDate);
    const [endHour, endMinute] = slot.end.split(':').map(Number);
    endDate.setHours(endHour, endMinute, 0, 0);
    
    setFormData(prev => ({
      ...prev,
      startDate,
      endDate
    }));
    
    // Set availability to true since we selected an available slot
    setAvailabilityStatus(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validate all required fields
    const requiredFields = [
      'department', 'topic', 'coordinatorName', 
      'coordinatorNumber', 'speakerName', 
      'speakerNumber', 'requiredAttendance', 'hall',
      'startDate', 'endDate'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      setIsSubmitting(false);
      return;
    }
    
    // Validate phone numbers are exactly 10 digits
    if (formData.coordinatorNumber.length !== 10) {
      setError('Coordinator number must be exactly 10 digits');
      setIsSubmitting(false);
      return;
    }
    
    if (formData.speakerNumber.length !== 10) {
      setError('Speaker number must be exactly 10 digits');
      setIsSubmitting(false);
      return;
    }

    // Check availability
    if (availabilityStatus === null) {
      setError('Please check availability first');
      setIsSubmitting(false);
      return;
    }

    if (!availabilityStatus) {
      setError('The selected time slot is not available');
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare data for backend
      const eventData = {
        ...formData,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString()
      };

      // Send event data to backend using the apiConfig utility
      await createEvent(eventData);

      // Show success message
      alert('Event submitted successfully! Waiting for admin approval.');

      // Navigate to calendar or home page
      navigate('/CalendarComponent');
    } catch (err) {
      console.error('Event submission error:', err);
      setError(err.message || 'Failed to submit event. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="booking-form-container">
      <Form onSubmit={handleSubmit}>
        <h2 className="text-center mb-4">Event Booking Form</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {availabilityStatus !== null && (
          <Alert variant={availabilityStatus ? 'success' : 'warning'}>
            {availabilityStatus 
              ? 'Time slot is available!' 
              : 'Time slot is not available for the selected date and hall.'}
          </Alert>
        )}
        
        {/* Display conflicting events if any */}
        {conflictingEvents && conflictingEvents.length > 0 && (
          <Alert variant="info">
            <p>The following events are already scheduled for this hall and date:</p>
            <ListGroup>
              {conflictingEvents.map((event, index) => (
                <ListGroup.Item key={index}>
                  <strong>{event.topic}</strong> - {new Date(event.startDate).toLocaleTimeString()} to {new Date(event.endDate).toLocaleTimeString()}
                  <br />
                  <small>Status: {event.status}, Department: {event.department}</small>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Alert>
        )}

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Event Date</Form.Label>
              <DatePicker
                selected={formData.startDate}
                onChange={(date) => handleDateChange('startDate', date)}
                className="form-control"
                placeholderText="Select event date"
                dateFormat="MMMM d, yyyy"
                minDate={new Date()}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Event Duration</Form.Label>
              <Form.Select 
                name="duration"
                value={formData.duration}
                onChange={(e) => {
                  const newDuration = e.target.value;
                  const newEndDate = calculateEndTime(formData.startDate, newDuration);
                  setFormData(prev => ({
                    ...prev,
                    duration: newDuration,
                    endDate: newEndDate
                  }));
                  // Reset availability when duration changes
                  setAvailabilityStatus(null);
                  setAvailableTimeSlots([]);
                }}
                className="form-control"
              >
                <option value="0.5">30 minutes</option>
                <option value="1">1 hour</option>
                <option value="1.5">1.5 hours</option>
                <option value="2">2 hours</option>
                <option value="2.5">2.5 hours</option>
                <option value="3">3 hours</option>
                <option value="3.5">3.5 hours</option>
                <option value="4">4 hours</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Start Time</Form.Label>
              <DatePicker
                selected={formData.startTime || formData.startDate}
                onChange={(date) => handleDateChange('startTime', date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                timeCaption="Time"
                dateFormat="h:mm aa"
                className="form-control"
                placeholderText="Select start time"
                minTime={setHours(setMinutes(new Date(), 0), 9)}
                maxTime={setHours(setMinutes(new Date(), 30), 16)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>End Time (Calculated)</Form.Label>
              <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                {formData.startDate && formData.duration ? 
                  calculateEndTime(formData.startDate, formData.duration).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 
                  'Select start time and duration'}
              </div>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Department</Form.Label>
              <Form.Select 
                name="department" 
                value={formData.department} 
                onChange={handleInputChange}
              >
                <option value="">Select Department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Aerospace">Aerospace</option>
                <option value="Biomedical">Biomedical</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Topic</Form.Label>
              <Form.Control
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                placeholder="Enter event topic"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Coordinator Name</Form.Label>
              <Form.Control
                type="text"
                name="coordinatorName"
                value={formData.coordinatorName}
                onChange={handleInputChange}
                placeholder="Enter coordinator name"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Coordinator Number</Form.Label>
              <Form.Control
                type="tel"
                name="coordinatorNumber"
                value={formData.coordinatorNumber}
                onChange={handleInputChange}
                placeholder="Enter coordinator contact number"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Speaker Name</Form.Label>
              <Form.Control
                type="text"
                name="speakerName"
                value={formData.speakerName}
                onChange={handleInputChange}
                placeholder="Enter speaker name"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Speaker Number</Form.Label>
              <Form.Control
                type="tel"
                name="speakerNumber"
                value={formData.speakerNumber}
                onChange={handleInputChange}
                placeholder="Enter speaker contact number"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Required Attendance</Form.Label>
              <Form.Control
                type="number"
                name="requiredAttendance"
                value={formData.requiredAttendance}
                onChange={handleInputChange}
                placeholder="Enter required attendance"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Hall</Form.Label>
              <Form.Select 
                name="hall" 
                value={formData.hall} 
                onChange={handleInputChange}
              >
                <option value="">Select Hall</option>
                <option value="Main Hall">Main Hall</option>
                <option value="Conference Room">Conference Room</option>
                <option value="Auditorium">Auditorium</option>
                <option value="Seminar Hall">Seminar Hall</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Available Time Slots */}
        {availableTimeSlots.length > 0 && (
          <div className="my-3">
            <h4>Available Time Slots</h4>
            <Row>
              {availableTimeSlots.map((slot, index) => (
                <Col md={4} key={index} className="mb-2">
                  <Button 
                    variant="outline-primary"
                    className="w-100"
                    onClick={() => handleTimeSlotSelect(slot)}
                  >
                    {slot.label}
                  </Button>
                </Col>
              ))}
            </Row>
          </div>
        )}
        
        <div className="text-center mt-4">
          <Button 
            variant="primary" 
            onClick={handleCheckAvailability} 
            className="me-2"
            disabled={isCheckingAvailability || !formData.startDate || !formData.hall}
          >
            {isCheckingAvailability ? 'Checking...' : 'Check Availability'}
          </Button>
          <Button 
            variant="success" 
            type="submit" 
            disabled={!availabilityStatus || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Booking'}
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default EventForm;
