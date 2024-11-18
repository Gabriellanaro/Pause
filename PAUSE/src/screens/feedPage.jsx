/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from "react";
import '../App.css';
import EventInFeedPage from "../components/eventInFeedPage";
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import PopUpEvent from '../components/PopUpEvent';
import Header from '../components/Header';
import Footer from "../components/Footer";

const FeedPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // State to manage selected event
  const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility
  const [selectedTags, setSelectedTags] = useState([]); // State to manage selected tags
  const navigate = useNavigate();
  const user = useUser();

  
  //FETCH EVENTS FROM THE DATABASE
  useEffect(() => {
      fetchEvents(selectedTags); // Fetch events whenever selectedTags change
    }, [selectedTags]);

  const handleTagClick1 = (tag) => {
    let updatedTags;
  
    if (selectedTags.includes(tag)) {
      updatedTags = selectedTags.filter(t => t !== tag);  // Rimuovi il tag
    } else {
      updatedTags = [...selectedTags, tag];  // Aggiungi il tag
    }
  
    setSelectedTags(updatedTags);  // Aggiorna lo stato
  
    fetchEvents(updatedTags);  // Ricarica gli eventi con i nuovi tag
  };
  
  const fetchEvents = async (filterTags = []) => {
    try {
      const tagQuery = Array.isArray(filterTags) && filterTags.length > 0
      ? `?tag=${encodeURIComponent(filterTags.join(','))}` 
      : '';
  
      const url = `http://127.0.0.1:5000/events${tagQuery}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const rawText = await response.text(); // Leggi il testo grezzo della risposta
  
      // Se la risposta è vuota o non valida, gestisci l'errore
      const data = JSON.parse(rawText || '{}');
      // Ottieni la data odierna a mezzanotte
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      // Filtra gli eventi passati e ordina per data e ora
      const filteredAndSortedEvents = data.events
        .filter(event => new Date(event.event_date) >= today) // Filtra gli eventi passati
        .filter(event => {
          if (filterTags.length === 0) return true; // Se non ci sono tag, non filtrare
          // Confronto diretto se l'evento contiene il tag selezionato
          return filterTags.includes(event.event_tag);
        })
        .sort((a, b) => {
          const dateA = new Date(a.event_date);
          const dateB = new Date(b.event_date);
          if (dateA.getTime() === dateB.getTime()) {
            return new Date(`1970-01-01T${a.event_start_time}`) - new Date(`1970-01-01T${b.event_start_time}`);
          }
          return dateA - dateB;
        });
      
      setEvents(filteredAndSortedEvents); // Imposta lo stato degli eventi con quelli filtrati e ordinati  
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

    const handleEventClick = (event) => {
      setSelectedEvent(event);
      setShowPopup(true);
    };

    const handleClosePopup = () => {
      setShowPopup(false);
      setSelectedEvent(null);
    };

    return (
      
      <>
        <Header title='HOT IN COPENHAGEN' navigation={true} onTagClick={handleTagClick1} />
        <div className="feed-container">
          {events && events.length > 0 ? (
            events.map((event, index) => (
              <div key={index} onClick={() => handleEventClick(event)}>
                <EventInFeedPage event={event} />
              </div>
            ))
          ) : (
            <p>No events found</p>
          )}
          {showPopup && selectedEvent && (
            <PopUpEvent event={selectedEvent} onClose={handleClosePopup} />
          )}

        <Footer/>
        </div>
      </>
    )
  }

export default FeedPage;