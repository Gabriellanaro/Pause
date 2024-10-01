import React, {useEffect, useState, useContext} from "react";
import '../App.css';
import EventInFeedPage from "../components/eventInFeedPage";
import veras from '../assets/veras-market.jpg';

const exampleEvents = [
  {
    date: "12-10-2024",
    startingTime: "10",
    endingTime: "15",
    title: "VERAS MARKET",
    location: "Bispeengen 20, 2000 Frederiksberg",
    image: veras
  },
  {
    date: "13-10-2024",
    startingTime: "9",
    endingTime: "15",
    time: "Every Saturday 9h - 15h",
    title: "FREDERIKSBERG FLEA MARKET",
    location: "Frederiksberg Rådhus, Smallegade, 2000 Frederiksberg",
    image: veras
  }
];

const FeedPage = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
      // To test the code with some event
      setEvents(exampleEvents);
    });
    
    return (
    <div className="feed-container">
      {/* <h1>FeedPage</h1>
      <h2>Welcome to the Feed</h2>
      Add more content here */}
      {events.map((event, index) => (
        <EventInFeedPage key={index} event={event} />
      ))}
    </div>
    )
}

export default FeedPage;