# from flask import Flask, request, render_template, redirect, url_for, jsonify
# from flask_cors import CORS
# from flask_sqlalchemy import SQLAlchemy
# from datetime import datetime

from flask import Flask, request, render_template, redirect, url_for, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy import Enum, or_, text
from flask_cors import cross_origin
import instaloader
import os
import openai
from openai import OpenAI
from apscheduler.schedulers.background import BackgroundScheduler
import atexit


#scheduer to run scrap events every tot time
scheduler = BackgroundScheduler()

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
    event_tag = db.Column(
        Enum("Shop", "Flea Market", "Garage Sale", "Other", name="event_tag"),
        nullable=False,
    )
    media_id = db.Column(db.String(200), nullable=True) 

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
        "event_tag": event.event_tag,
    }


def scrape_events():
    caption_last_post = ''
    #instaloader instance 
    loader = instaloader.Instaloader()
    loader.login('mrscrape6', 'Pause2024')        # (login)

    #list of the profiles to be scraped
    profile_names = ['icoliandro'] 
    for profile_name in profile_names:
        profile = instaloader.Profile.from_username(loader.context, profile_name)

        for post in profile.get_posts():
            if post.caption:  # check if caption is empty
                caption_last_post = post.caption
                break # get only the first post
            else:
                print(f"Post ID: {post.shortcode} non ha didascalia.\n")

        with app.app_context():
            existing_event = Event.query.filter_by(media_id=post.shortcode).first()
            if existing_event is None:
                openai.api_key = ""

                client = OpenAI(api_key=openai.api_key) # ask Gabriele for the api key
                messages = [
                    {"role": "system", "content": '''You are a helpful assistant. 
                     from a text that i will provide you, you will find only date (in the format 'YYYY-MM-DD'), start_time, end_time, location (only if it is a real one, if location is for example "park", "secret", "street", leave it empty ), 
                     name (of the event), description (of the event) 
                     (if it is more than 200 char make a summary of the description that it is under 200 char). If you don't manage to 
                     find some of these information, default values: location: "", date: "" ,start_time = 09:00:00, end_time = 00:00:00, name=Scraped Event, description: no description available . 
                     The output should have a dictionary structure. If the date of the event is more than one day, just provide the starting date. 
                     If the caption say something like This <day of the week>, it means that the date is the closest <day of the week> from today.
                     If the caption say something like next <day of the week>, it means that the date is the closest <day of the week> next week'''},
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

                # Skip event if location or date is missing
                if not event_location or not event_date_str:
                    print(f"Skipping event: {event_name} - Missing location or date")
                    continue

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
                    event_end_time=event_end_time,
                    media_id=post.shortcode,
                )
                # Add the event to the session and commit
                db.session.add(new_event)
                db.session.commit()

                print(f"New event added: {event_name}")

            # return response.choices[0].message.content


# Apparently to solve the CORS issue, we need to add this route to the backend
@app.route("/events", methods=["OPTIONS"])
def events_options():
    return "", 200

# Get all events
@app.route("/events", methods=["GET"])
@cross_origin(methods=["GET"])
def get_events():

    # Ottieni i tag dalla query string
    event_tag = request.args.get("tag")

    # Se sono presenti tag, suddividi i tag e rimuovi i duplicati
    if event_tag:
        # Split the tags by comma and filter for each tag
        tags = [str(tag.strip()) for tag in event_tag.split(",")]
        tags = list(tags)

        events = (
            Event.query.filter(Event.event_tag.in_(tags)).order_by(Event.id.asc()).all()
        )

    else:
        events = Event.query.order_by(Event.id.asc()).all()

    event_list = []
    for event in events:
        event_list.append(format_event(event))

    return jsonify({"events": event_list}), 200


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
@app.route("/events_delete/<id>", methods=["DELETE"])
@cross_origin(methods=["DELETE"])
def delete_event(id):
    # Query the event by id
    event = Event.query.filter_by(id=id).one()

    # Delete the event from the database
    db.session.delete(event)
    db.session.commit()

    # Return a success message
    return f"Message: Event {id} deleted successfully"


# Update an event
@app.route("/events_update/<id>", methods=["PUT", "OPTIONS"])
@cross_origin(methods=["PUT"])
def update_event(id):

    if request.method == "PUT":  # Get the event by id
        event = Event.query.get(id)  # Prefer .get() for a single record by primary key
        if not event:
            return (
                jsonify({"error": "Event not found"}),
                404,
            )  # Return an error if not found

    # Get all the info needed to update
    event_name = request.json.get("event_name", event.event_name)
    event_description = request.json.get("event_description", event.event_description)
    event_date = request.json.get("event_date", event.event_date)
    event_start_time = request.json.get("event_start_time", event.event_start_time)
    event_end_time = request.json.get("event_end_time", event.event_end_time)
    event_location = request.json.get("event_location", event.event_location)
    event_latitude = request.json.get("event_latitude", event.event_latitude)
    event_longitude = request.json.get("event_longitude", event.event_longitude)
    event_user_email = request.json.get("user_email", event.user_email)
    event_tag = request.json.get("event_tag", event.event_tag)

    # Update the event attributes
    event.event_name = event_name
    event.event_description = event_description
    event.event_date = event_date
    event.event_start_time = event_start_time
    event.event_end_time = event_end_time
    event.event_location = event_location
    event.event_latitude = event_latitude
    event.event_longitude = event_longitude
    event.user_email = event_user_email
    event.event_tag = event_tag

    # Commit the changes to the database
    db.session.commit()

    return jsonify({"event": format_event(event)}), 200  # Return the updated event


# Create a new event
@app.route("/events", methods=["POST"])
@cross_origin(methods=["POST"])
def create_event():
    data = request.json  # retrieve data in json format from the request body

    print("DATA:", data)

    user_email = data.get(
        "user_email"
    )  # get the value of the key "user_email" from the json data
    # print("USER EMAIL: ", user_email)
    if not user_email:
        return jsonify({"error": "User email is required. Sign-in or log-in"}), 400

    # Convert start and end times to time objects
    start_time = datetime.strptime(data["event_start_time"], "%H:%M").time()
    end_time = datetime.strptime(data["event_end_time"], "%H:%M").time()

    # Create new instance of Event object
    event = Event(
        event_name=data["event_name"],
        event_description=data["event_description"],
        event_date=data["event_date"],
        event_start_time=start_time,
        event_end_time=end_time,
        event_location=data.get("event_location"),
        event_latitude=data.get("event_latitude"),
        event_longitude=data.get("event_longitude"),
        user_email=user_email,  # Store the user email for reference
        event_tag=data.get("event_tag"),
    )

    db.session.add(event)  # add event to the session
    db.session.commit()  # Commit session to the database

    # Return the created event in json format for the frontend
    return jsonify(format_event(event)), 201


# # Model for table User
# class User(db.Model):
#     __tablename__ = "users"  # table name in postgresql
#     user_id = db.Column(db.Integer, primary_key=True)
#     email = db.Column(db.String(200), unique=True, nullable=False)
#     password = db.Column(db.String(200), nullable=False)
#     first_name = db.Column(db.String(200), nullable=False)
#     last_name = db.Column(db.String(200), nullable=False)
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)

#     events = db.relationship(
#         "Event", backref="user", lazy=True
#     )  # Relationship with Event table

#     def __repr__(self):
#         return f"<User {self.email}>"


# # Apparently to solve the CORS issue, we need to add this route to the backend
# @app.route("/users", methods=["OPTIONS"])
# def users_options():
#     return "", 200


# # Registration endpoint
# @app.route("/users", methods=["POST"])
# def register_user():
#     data = request.json  # Get the registration data from the request body (JSON)

#     print("DATA:", data)

#     # Extract user data
#     email = data.get("email")
#     password = data.get("password")  # to hash
#     first_name = data.get("first_name")
#     last_name = data.get("last_name")

#     # Check if any of these values are None
#     if not email or not password or not first_name or not last_name:
#         return jsonify({"error": "Missing fields"}), 400

#     # Check if user already exists
#     existing_user = db.session.query(User).filter(User.email == email).first()
#     if existing_user:
#         return jsonify({"error": "User already exists"}), 400

#     # Create a new user and add to the database
#     new_user = User(
#         email=email,
#         password=password,  # Remember to hash this in a real application!
#         first_name=first_name,
#         last_name=last_name,
#         created_at=datetime.utcnow(),
#     )

#     # print("Received data:", data)
#     # print("Email:", email)
#     # print("First Name:", first_name)
#     # print("Last Name:", last_name)

#     # Add the user to the database
#     db.session.add(new_user)
#     db.session.commit()

#     # Return success message
#     return jsonify({"message": "User registered successfully"}), 201


# @app.route("/users/<email>", methods=["GET"])
# def get_user_by_email(email):
#     user = User.query.filter_by(email=email).first()

#     if user:
#         user_data = {
#             "user_id": user.user_id,
#             "email": user.email,
#             "first_name": user.first_name,
#             "last_name": user.last_name,
#             "created_at": user.created_at,
#         }
#         return jsonify({"user": user_data}), 200
#     else:
#         return jsonify({"error": "User not found"}), 404


# # creates tables in the database if they do not exist
# with app.app_context():
#     db.create_all()

# ======================================== USER MODEL ==========================================
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


# creates tables in the database if they do not exist
with app.app_context():
    db.create_all()


#scheduler to run scrap events every tot time
# scheduler.add_job(scrape_events, 'interval', seconds=20)
# scheduler.start()
# # exit handler to stop scheduler when flask is stopped
# atexit.register(lambda: scheduler.shutdown())
scrape_events()

if __name__ == "__main__":
    app.run(debug=True)
