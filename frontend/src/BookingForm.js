import React, { useState } from 'react';
import { checkAvailability, createEvent } from './utils/apiConfig';

const BookingForm = () => {
  const [startDate, setStartDate] = useState(null);
  const [hall, setHall] = useState('');
  const [coordinatorName, setCoordinatorName] = useState('');
  const [speakerName, setSpeakerName] = useState('');
  const [department, setDepartment] = useState('');
  const [topic, setTopic] = useState('');
  const [availabilityChecked, setAvailabilityChecked] = useState(false);

  const checkHallAvailability = async () => {
    if (!startDate || !hall) {
        alert('Please select a date and hall');
        return;
    }

    try {
        const response = await checkAvailability({
            date: startDate.toISOString(),
            hall: hall,
            coordinatorName: coordinatorName,
            speakerName: speakerName,
            department: department,
            topic: topic
        });

        const { available, message, conflictingEvents } = response.data;

        if (available) {
            // Hall is available, you can proceed with booking
            alert('Hall is available for the selected date!');
            setAvailabilityChecked(true);
        } else {
            // Hall is not available
            alert(message);
            
            // Show conflicting events details
            if (conflictingEvents && conflictingEvents.length > 0) {
                const conflictDetails = conflictingEvents.map(event => 
                    `Topic: ${event.topic}\n` +
                    `Coordinator: ${event.coordinatorName}\n` +
                    `Speaker: ${event.speakerName}\n` +
                    `Department: ${event.department}\n` +
                    `Start: ${new Date(event.startDate).toLocaleString()}\n` +
                    `End: ${new Date(event.endDate).toLocaleString()}\n` +
                    `Status: ${event.status}`
                ).join('\n\n');
                
                alert(`Conflicting Events:\n${conflictDetails}`);
            }
            
            setAvailabilityChecked(false);
        }
    } catch (error) {
        console.error('Availability check error:', error);
        alert('Error checking hall availability');
        setAvailabilityChecked(false);
    }
  };
  
  // Add your form JSX here
  return (
    <div className="booking-form">
      <h2>Book a Hall</h2>
      {/* Form implementation goes here */}
    </div>
  );
};

export default BookingForm;