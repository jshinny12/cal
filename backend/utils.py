import os
from dotenv import load_dotenv
from pymongo import MongoClient

# Load environment variables from the .env file
load_dotenv()

# Get the MongoDB connection string from the environment variables
MONGO_CONNECTION_STRING = os.getenv("MONGO_CONNECTION_STRING")

# Initialize MongoDB Client
MONGO_CLIENT = MongoClient(MONGO_CONNECTION_STRING)

# Specify the MongoDB database to use
MONGO_DB = MONGO_CLIENT['user']