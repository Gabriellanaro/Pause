from flask import Flask, request, render_template, redirect, url_for, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import urllib.parse
import requests


# Geo location API
GEO_API_KEY = "9d29ea05a6da462eafba2c6c4aefde2d"


def geocode_address(address):
    encoded_address = urllib.parse.quote(address)
    print(encoded_address)

    url = f"https://api.opencagedata.com/geocode/v1/json?q={encoded_address}&key={GEO_API_KEY}"

    response = requests.get(url)
    data = response.json()

    if data["results"]:
        coordinates = data["results"][0]["geometry"]
        return coordinates["lat"], coordinates["lng"]
    else:
        return "NESSUN RISULTATO"


# Esempio di utilizzo
address = "Via Roma, 1, Milano, Italia"
coords = geocode_address(address)
print(coords)
