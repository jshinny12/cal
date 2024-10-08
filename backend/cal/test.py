from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os
import certifi
from django.contrib.auth.hashers import make_password, check_password

ca = certifi.where()
# Load environment variables from .env file
load_dotenv()

# Get the MongoDB connection string from the environment variables
MONGO_CONNECTION_STRING = os.getenv("MONGO_CONNECTION_STRING", )

# Check if the connection string is loaded correctly
if not MONGO_CONNECTION_STRING:
    print("MongoDB connection string not found. Check your .env file.")
else:
    print(f"Using connection string: {MONGO_CONNECTION_STRING}")

    # Create a new client and connect to the server
    client = MongoClient(MONGO_CONNECTION_STRING, tlsCAFile=ca)
    db = client['cal']
    collection = db['users']
    hashed_password = "password"
    user_document = {
        "_id": "test",
        "password": hashed_password,
        "categories": []
    }

    
    # Send a ping to confirm a successful connection
    try:
        collection.insert_one(user_document)
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(f"Connection error: {e}")