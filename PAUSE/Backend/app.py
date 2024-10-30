from flask import Flask, request, render_template, redirect, url_for, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)

# Configuration for the database
app.config["SQLALCHEMY_DATABASE_URI"] = (
<<<<<<< Updated upstream
    "postgresql://postgres:Pause2024@10.209.155.74:5432/Pausedatabase"  # URI EXPOSED, MUY PELIGROSO
=======
    # "postgresql://postgres:Pause2024@10.209.155.74:5432/Pausedatabase"  # URI EXPOSED, MUY PELIGROSO
    "postgresql://postgres:Pause2024@10.209.155.74/Pausedatabase"  # URI EXPOSED, MUY PELIGROSO
>>>>>>> Stashed changes
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)
CORS(app)


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
        "event_start_time": event.event_start_time.strftime('%H:%M'), 
        "event_end_time": event.event_end_time.strftime('%H:%M'),
        "event_location": event.event_location,
        "event_latitude": event.event_latitude,
        "event_longitude": event.event_longitude,
        "created_at": event.created_at
    }


# Get all events
@app.route("/events", methods=["GET"])
def get_events():
    # Query all events ordered by id in ascending order
    events = Event.query.order_by(Event.id.asc()).all()
    event_list = []

    # Format each event and add to the list
    for event in events:
        event_list.append(format_event(event))

    # Return the list of formatted events
    return {"events": event_list}


# Get all events for a specific user
@app.route("/events/user/<user_email>", methods=["GET"])
def get_events_user(user_email):
    # Query all events with the specified user_email
    events = Event.query.filter_by(user_email=user_email).order_by(Event.id.asc()).all()
    event_list = []

    # Format each event and add to the list
    for event in events:
        event_list.append(format_event(event))

    # Return the list of formatted events
    return jsonify({"events": event_list}), 200


# Get a single event
@app.route("/events/<id>", methods=["GET"])
def get_event(id):
    # Query the event by id
    event = Event.query.filter_by(id=id).one()

    # Format the event data
    formatted_event = format_event(event)

    # Return the formatted event data
    return {"event": formatted_event}


# Delete an event
@app.route("/events/<id>", methods=["DELETE"])
def delete_event(id):
    # Query the event by id
    event = Event.query.filter_by(id=id).one()

    # Delete the event from the database
    db.session.delete(event)
    db.session.commit()

    # Return a success message
    return f"Message: Event {id} deleted successfully"


# Update an event
@app.route("/events/<id>", methods=["PUT"])
def update_event(id):
    event = Event.query.filter_by(id=id).first()  # get the event by id
    if not event:
        return jsonify({"error": "Event not found"}), 404  # return an error if not found

    # get all the info needed to update
    event_name = request.json.get("event_name", event.event_name) #nb: first event_name is a new name for the variable, "event_name" must match the key in the json data, event.event_name must match the attribute of the Event object
    event_description = request.json.get("event_description", event.event_description)
    event_date = request.json.get("event_date", event.event_date)
    event_start_time = request.json.get("event_start_time", event.event_start_time)
    event_end_time = request.json.get("event_end_time", event.event_end_time)
    event_location = request.json.get("event_location", event.event_location)
    event_latitude = request.json.get("event_latitude", event.event_latitude)
    event_longitude = request.json.get("event_longitude", event.event_longitude)

    # update the event
    event.event_name = event_name
    # update the attributes of the Event object
    event.event_name = event_name 
    event.event_description = event_description
    event.event_date = event_date
    event.event_start_time = event_start_time
    event.event_end_time = event_end_time
    event.event_location = event_location
    event.event_latitude = event_latitude
    event.event_longitude = event_longitude

    db.session.commit()
    
    return {"event": format_event(event)}

# Create a new event
@app.route("/events", methods=["POST"])
def create_event():
    data = request.json  # retrieve data in json format from the request body
<<<<<<< Updated upstream
    print(data)
    event_name = data.get("event_name")  # get the value of the key "event_name" from the json data
    event_description = data.get("event_description")  
    event_date = data.get("event_date") 
    event_start_time = data.get("event_start_time")
    event_end_time = data.get("event_end_time")
    event_location = data.get("event_location")
    event_latitude = data.get("event_latitude")
    event_longitude = data.get("event_longitude")
=======
    print("DATA:", data)
    user_email = data.get(
        "user_email"
    )  # get the value of the key "user_email" from the json data
    # print("USER EMAIL: ", user_email)
    if not user_email:
        return jsonify({"error": "User email is required. Sign-in or log-in"}), 400
>>>>>>> Stashed changes

    # Convert start and end times to time objects
    start_time = datetime.strptime(event_start_time, "%H:%M").time()
    end_time = datetime.strptime(event_end_time, "%H:%M").time()

    # Create new instance of Event object
    event = Event(
        event_name=event_name,
        event_description=event_description,
        event_date=event_date,
        event_start_time=start_time,
        event_end_time=end_time,
        event_location=event_location,
        event_latitude=event_latitude,
        event_longitude=event_longitude
    )
    db.session.add(event)  # Aggiungi l'evento alla sessione
    db.session.commit()  # Esegui il commit della sessione

    # Return the created event in json format for the frontend
    return jsonify(format_event(event)), 201

<<<<<<< Updated upstream
=======

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


# Apparently to solve the CORS issue, we need to add this route to the backend
@app.route("/users", methods=["OPTIONS"])
def users_options():
    return "", 200


# Registration endpoint
@app.route("/users", methods=["POST"])
def register_user():
    data = request.json  # Get the registration data from the request body (JSON)

    print("DATA:", data)

    # Extract user data
    email = data.get("email")
    password = data.get("password")  # to hash
    first_name = data.get("first_name")
    last_name = data.get("last_name")

    # Check if any of these values are None
    if not email or not password or not first_name or not last_name:
        return jsonify({"error": "Missing fields"}), 400

    # Check if user already exists
    existing_user = db.session.query(User).filter(User.email == email).first()
    if existing_user:
        return jsonify({"error": "User already exists"}), 400

    # Create a new user and add to the database
    new_user = User(
        email=email,
        password=password,  # Remember to hash this in a real application!
        first_name=first_name,
        last_name=last_name,
        created_at=datetime.utcnow(),
    )

    # print("Received data:", data)
    # print("Email:", email)
    # print("First Name:", first_name)
    # print("Last Name:", last_name)

    # Add the user to the database
    db.session.add(new_user)
    db.session.commit()

    # Return success message
    return jsonify({"message": "User registered successfully"}), 201


@app.route("/users/<email>", methods=["GET"])
def get_user_by_email(email):
    user = User.query.filter_by(email=email).first()

    if user:
        user_data = {
            "user_id": user.user_id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "created_at": user.created_at,
        }
        return jsonify({"user": user_data}), 200
    else:
        return jsonify({"error": "User not found"}), 404


>>>>>>> Stashed changes
# creates tables in the database if they do not exist
with app.app_context():
    db.create_all()  


# what is the purpose of this?
@app.route("/name/<first_name>", methods=["GET"])
def name(first_name):
    return f"{first_name}"


if __name__ == "__main__":
    app.run(debug=True)
