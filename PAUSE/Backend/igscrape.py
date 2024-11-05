from flask import Flask, request, render_template, redirect, url_for, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

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

# Model for table Event (one model for each table in the database)
class Event(db.Model):
    # NB: the names of the fields like event_name don't have to match the names of the columns in the database
    __tablename__ = "events"  # table name in postgresql
    id = db.Column(db.Integer, primary_key=True)
    event_name = db.Column(db.String(200), nullable=False)
    event_description = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    event_date = db.Column(db.Date, nullable=False)  
    event_start_time = db.Column(db.Time, nullable=False) 
    event_end_time = db.Column(db.Time, nullable=False)
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

# Create the database tables
with app.app_context():
    db.create_all()  # Create tables if they don't exist

    # Create a new event instance
    new_event = Event(
        event_name="Festa di Halloween",
        event_description="Celebrazione della notte di Halloween con dolcetti e giochi.",
        event_date=datetime.strptime("2024-10-31", '%Y-%m-%d').date(),
        event_start_time=datetime.strptime("18:00", '%H:%M').time(),
        event_end_time=datetime.strptime("23:00", '%H:%M').time(),
        event_location="Copenhagen, DK",
        event_latitude=55.6761,
        event_longitude=12.5683,
        user_email="user@example.com"
    )

    # Add the event to the session and commit
    db.session.add(new_event)
    db.session.commit()

    print("Event added successfully!")

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)