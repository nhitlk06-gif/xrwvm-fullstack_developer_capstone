import os
import requests
from dotenv import load_dotenv

load_dotenv()

backend_url = os.getenv('backend_url', default="http://localhost:3030")
sentiment_analyzer_url = os.getenv(
    'sentiment_analyzer_url',
    default="http://localhost:5000/"
)


def get_request(endpoint, **kwargs):
    """GET request to the Express/Mongo backend."""
    params = ""
    if kwargs:
        for key, value in kwargs.items():
            params = params + key + "=" + str(value) + "&"

    request_url = backend_url.rstrip("/") + endpoint + "?" + params
    print("GET from {} ".format(request_url))
    try:
        response = requests.get(request_url, timeout=10)
        return response.json()
    except Exception as err:
        print(f"Network exception occurred: {err}")
        return None


def analyze_review_sentiments(text):
    """Call the Flask sentiment analyzer microservice."""
    request_url = sentiment_analyzer_url.rstrip("/") + "/analyze/" + text
    try:
        response = requests.get(request_url, timeout=10)
        return response.json()
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
        print("Network exception occurred")
        return {"sentiment": "neutral"}


def post_review(data_dict):
    """POST a new review to the Express/Mongo backend."""
    request_url = backend_url.rstrip("/") + "/insert_review"
    try:
        response = requests.post(request_url, json=data_dict, timeout=10)
        print(response.json())
        return response.json()
    except Exception as err:
        print(f"Network exception occurred: {err}")
        return None
