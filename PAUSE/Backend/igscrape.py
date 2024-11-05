from flask import Flask, request, render_template, redirect, url_for, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import instaloader
import os
import openai
from openai import OpenAI
from apscheduler.schedulers.background import BackgroundScheduler
import atexit


app = Flask(__name__)

# Configuration for the database
app.config["SQLALCHEMY_DATABASE_URI"] = (
    # "postgresql://postgres:Pause2024@10.209.155.74:5432/Pausedatabase"  # URI EXPOSED, MUY PELIGROSO
    "postgresql://postgres:Pause2024@localhost:5432/Pausedatabase"  # URI EXPOSED, MUY PELIGROSO
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)
# Allow CORS for specific origin
CORS(
    app,
    methods=["GET", "POST", "OPTIONS"],
    resources={r"/*": {"origins": "http://localhost:5173"}},
)


# --------------------------------------------------------------------
# Model for table User
class User(db.Model):
    __tablename__ = "users"  # table name in postgresql
    user_id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(200), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    first_name = db.Column(db.String(200), nullable=False)
    last_name = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    events = db.relationship(
        "Event", backref="user", lazy=True
    )  # Relationship with Event table

    def __repr__(self):
        return f"<User {self.email}>"
    
# Model for table Event (one model for each table in the database)
class Event(db.Model):
    # NB: the names of the fields like event_name don't have to match the names of the columns in the database
    __tablename__ = "events"  # table name in postgresql
    id = db.Column(db.Integer, primary_key=True)
    event_name = db.Column(db.String(200), nullable=False)
    event_description = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    event_date = db.Column(db.Date, nullable=False)  
    event_start_time = db.Column(db.Time, nullable=True) 
    event_end_time = db.Column(db.Time, nullable=True)
    event_location = db.Column(db.String(255), nullable=True) 
    event_latitude = db.Column(db.Float, nullable=True)
    event_longitude = db.Column(db.Float, nullable=True)
    user_email = db.Column(
        db.String(200), db.ForeignKey("users.email"), nullable=False
    )  # Foreign key

    def __repr__(self):
        return f"<Event {self.event_name}>" 

   

# it converts the Event object (that is an instance of SQLAlchemy model) to a dictionary, that can be converted to JSON.
# this is because SQLAlchemy objects are not serializable to JSON.

def format_event(event):
    return {
        "id": event.id,
        "event_name": event.event_name,
        "event_description": event.event_description,
        "event_date": event.event_date,
        "event_start_time": event.event_start_time.strftime("%H:%M"),
        "event_end_time": event.event_end_time.strftime("%H:%M"),
        "event_location": event.event_location,
        "event_latitude": event.event_latitude,
        "event_longitude": event.event_longitude,
        "created_at": event.created_at,
        "user_email": event.user_email,
    }

def scrape_events():
    caption_last_post = ''
    #instaloader instance 
    loader = instaloader.Instaloader()
    loader.login('icoliandro', 'Pause2024')        # (login)

    #list of the profiles to be scraped
    profile_name = 'nicolaaccoto' 
    profile = instaloader.Profile.from_username(loader.context, profile_name)

    for post in profile.get_posts():
        if post.caption:  # check if caption is empty
            caption_last_post = post.caption
            break # get only the first post
        else:
            print(f"Post ID: {post.media_id} non ha didascalia.\n")

    openai.api_key = ""

    client = OpenAI(api_key="") #ask gabriele for key
    messages = [
        {"role": "system", "content": "You are a helpful assistant. You will find only date (in the format 'YYYY-MM-DD'), start_time, end_time, location, name (of the event), description (of the event) (if it is more than 200 char make a summary that it is under 200 char),  from a text that i will provide you. If you don't manage to find some of these information, put these default values: date: 2025-01-01 ,start_time = 09:00:00, end_time = 00:00:00, name= Scraped Event, description: no description available  . The output should have a dictionary structure. If the date of the event is more than one day, just provide the starting date."},
        {"role": "user", "content": caption_last_post},
    ]

    response=client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages,
        temperature=0.5,
    )
    # Parse the response as JSON
    event_data = response.choices[0].message.content
    print(event_data)
    event_info = eval(event_data)  # Be cautious with eval, consider safer alternatives like json.loads if possible

    # Extract the information
    event_name = event_info.get("name")
    event_description = event_info.get("description")
    event_location = event_info.get("location")
    event_date_str = event_info.get("date")  # Assuming 'start_time' includes the date
    event_start_time = event_info.get("start_time")
    event_end_time = event_info.get("end_time")

    # Convert event_date_str to a date object (consider parsing the date format correctly)
    event_date = datetime.strptime(event_date_str, '%Y-%m-%d').date()  # Adjust the date format as necessary
    event_start_time = datetime.strptime(event_start_time, '%H:%M:%S').time()  # Modifica il formato se necessario
    event_end_time = datetime.strptime(event_end_time, '%H:%M:%S').time() 

    # Create a new event instance
    new_event = Event(
        event_name=event_name,
        event_description=event_description,
        event_date=event_date,
        event_location=event_location,
        user_email="user@example.com",  # Replace with actual user email or make it dynamic
        event_start_time=event_start_time,
        event_end_time=event_end_time
    )

    # Add the event to the session and commit
    with app.app_context():
        db.session.add(new_event)
        db.session.commit()

    print(f"New event added: {event_name}")

    return response.choices[0].message.content


# # Configure APScheduler
# scheduler = BackgroundScheduler()
# scheduler.add_job(func=scrape_events, trigger="interval", hours=24)  # Call scrape_events every 24 hours
# scheduler.start()

# # Shutdown the scheduler when exiting the app
# atexit.register(lambda: scheduler.shutdown())

eventstruct = scrape_events()


# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)
