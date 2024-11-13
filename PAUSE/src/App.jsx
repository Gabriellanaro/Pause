/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FeedPage from './screens/feedPage';
import { UserProvider } from './contexts/UserContext';
import EventFormPage from './screens/EventFormPage';
import EditEventPage from './screens/EditEventPage';
import LoginPage from './screens/LoginPage';
import MapPage from './screens/MapPage';
import ProfilePage from './screens/ProfilePage';
import UserRegistrationPage from './screens/RegistrationPage';
import YourEventsPage from './screens/YourEventsPage';
import YourEventsMapPage from './screens/YourEventsMapPage';
import NavBar from './components/NavBar';
import './App.css'


function App() {
  return (

    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<FeedPage />} />
          <Route path="/event-form" element={<EventFormPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/registration" element={<UserRegistrationPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/your-events" element={<YourEventsPage />} />
          <Route path="/your-events-map" element={<YourEventsMapPage />} />
          <Route path="/edit-event/:eventId" element={<EditEventPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;