from flask import Flask, request, render_template, redirect, url_for
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config["SECRET_KEY"] = "password"
app.config["SQLALCHEMY_DATABASE_URI"] = (
    "postgresql://postgres:password@localhost:5000/PAUSE"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)
CORS(app)

# ---------------------------------#
# trial for database POStGRESQL
class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    email = db.Column(db.String(100), unique=True)
    description = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Event {self.name}>"


    def __init__(self, description, name, email):
        self.name = name
        self.email = email
        self.description = description
# Create an event
@app.route("/events", methods=["POST"])
def create_event():
    name = request.json["name"]
    email = request.json["email"]
    description = request.json["description"]

    event = Event(name=name, email=email, description=description)
    db.session.add(event)
    db.session.commit()

    return format_event(event)


# Get all events
@app.route("/events", methods=["GET"])
def get_events():
    events = Event.query.order_by(Event.id.asc()).all()
    event_list = []

    for event in events:
        event_list.append(format_event(event))
    return {"events": event_list}


# Get a single event
@app.route("/events/<id>", methods=["GET"])
def get_event(id):
    event = Event.query.filter_by(id=id).one()
    formatted_event = format_event(event)
    return {"event": formatted_event}


# Delete an event
@app.route("/events/<id>", methods=["DELETE"])
def delete_event(id):
    event = Event.query.filter_by(id=id).one()
    db.session.delete(event)
    db.session.commit()
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

@app.route("/", methods=["GET", "POST"])
def hello_world():

    request_method = request.method

    if request_method == "POST":
        print("-----------------")
        print(request_method)
        print(request.form)
        print(request.args)
        print(request.data)
        print("-----------------")
        first_name = request.form["first_name"]
        return redirect(url_for("name", first_name=first_name))
    return render_template("hello.html", request_method=request_method)


@app.route("/name/<first_name>", methods=["GET"])
def name(first_name):
    return f"{first_name}"


if __name__ == "__main__":
    app.run(debug=True)
