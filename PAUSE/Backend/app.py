from flask import Flask, request, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/", methods=["GET", "POST"])
def hello_world():

    request_method = request.method

    if request_method == "POST":
        print("-----------------")
        print(request.form)
        print(request.args)
        print(request.data)
        print("-----------------")

    return render_template("hello.html", request_method=request_method)


if __name__ == "__main__":
    app.run(debug=True)
