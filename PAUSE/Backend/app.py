from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

# database connection
# format: postgresql://username:password@host:port/database_name
app.config["SQLALCHEMY_DATABASE_URI"] = (
    "postgresql://postgres:Pause2024@localhost:5432/pauseDemo"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

# Model for table Event (one model for each table in the database)
class Event(db.Model):
    __tablename__ = "events"  # table name in postgresql
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Event {self.text}>"


@app.route("/event", methods=["POST"])
def create_event():
    data = request.json  #retrieve data in json format from the request body 
    text = data.get("myInput")  #get the value of the key "myInput" from the json data

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


if __name__ == "__main__":
    app.run(debug=True)
