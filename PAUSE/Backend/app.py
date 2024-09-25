from flask import Flask, request, render_template, redirect, url_for, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)

# Configuration for the database
app.config["SQLALCHEMY_DATABASE_URI"] = (
    "postgresql://postgres:Pause2024@localhost:5432/pauseDemo"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)
CORS(app)

# ---------------------------------#
# trial for database POStGRESQL
class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(50))
    # email = db.Column(db.String(100), unique=True)
    # description = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Event {self.name}>"

    def __init__(self, description, name, email):
        self.name = name
        self.email = email
        self.description = description


# Create an event
# @app.route("/events", methods=["POST"])
# def create_event1():
#     # Extract data from the request
#     name = request.json["name"]
#     text = request.json["email"]
#     description = request.json["description"]

#     # Create a new event instance
#     event = Event(name=name, email=email, description=description)

#     # Add the event to the database
#     db.session.add(event)
#     db.session.commit()

#     # Return the formatted event data
#     return format_event(event)


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
    event = Event.query.filter_by(id=id)  # get events list

    # get all the info needed to update
    name = request.json["name"]
    email = request.json["email"]
    description = request.json["description"]

    # update the event
    event.update(
        dict(
            name=name,
            email=email,
            description=description,
            created_at=datetime.utcnow(),
        )
    )
    db.session.commit()
    return {"event": format_event(event.one())}


def format_event(event):
    return {
        "id": event.id,
        "name": event.name,
        "email": event.email,
        "description": event.description,
        "created_at": event.created_at
    }   

# ---------------------------------#

# Model for table Event (one model for each table in the database)
class Event(db.Model):
    __tablename__ = "events"  # table name in postgresql
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Event {self.text}>"


@app.route("/events", methods=["POST"])
def create_event():
    data = request.json  # retrieve data in json format from the request body
    text = data.get("text")  # get the value of the key "myInput" from the json data

    # Crea una nuova istanza dell'oggetto Event
    event = Event(text=text)
    db.session.add(event)  # Aggiungi l'evento alla sessione
    db.session.commit()  # Esegui il commit della sessione

    return jsonify({"id": event.id, "text": event.text, "created_at": event.created_at}), 201


with app.app_context():
    db.create_all()  # Crea le tabelle se non esistono


# @app.route("/", methods=["GET", "POST"])
# def hello_world():

#     request_method = request.method

#     if request_method == "POST":
#         print("-----------------")
#         print(request.form)
#         print(request.args)
#         print(request.data)
#         print("-----------------")

#     return render_template("hello.html", request_method=request_method)


@app.route("/name/<first_name>", methods=["GET"])
def name(first_name):
    return f"{first_name}"


if __name__ == "__main__":
    app.run(debug=True)
