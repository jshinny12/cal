from pymongo import MongoClient
from django.conf import settings
from django.contrib.auth.hashers import make_password, check_password
from dotenv import load_dotenv
import os
import certifi


def get_db_connection():
    load_dotenv()
    ca = certifi.where()
    MONGO_CONNECTION_STRING = os.getenv("MONGO_CONNECTION_STRING")
    return MongoClient(MONGO_CONNECTION_STRING, tlsCAFile=ca)

def find_user_by_user_id(user_id):
    users_collection = get_db_connection()['cal']['users']
    return users_collection.find_one({"_id": user_id})

def create_user(user_id, password, categories=None):
    client = get_db_connection()
    db = client['cal']
    collection = db['users']
    hashed_password = make_password(password)
    user_document = {
        "_id": user_id,
        "password": hashed_password,
        "categories": categories or []
    }

    return collection.insert_one(user_document)
