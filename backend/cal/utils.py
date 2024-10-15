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


def login(user_id, user_pw):
    user = find_user_by_user_id(user_id)

    if user and "password" in user:
        if check_password(user_pw, user['password']):
            return user

    return None


def add_category(user_id, category):
    client = get_db_connection()
    db = client['cal']
    collection = db['users']
    collection.update_one(
        {"_id": user_id},
        {"$push": {"categories": category}}
    )


def add_task(user_id, category_name, task):
    client = get_db_connection()
    db = client['cal']
    collection = db['users']
    collection.update_one(
        {"_id": user_id},
        {"categories.name": category_name},
        {"$push": {"tasks": task}}
    )


def update_category(user_id, category_name, updated_category_data):
    client = get_db_connection()
    db = client['cal']
    collection = db['users']

    # Use $set to update the specific fields of the category
    return collection.update_one(
        {"_id": user_id, "categories.name": category_name},
        {"$set": {f"categories.$.{key}": value for key,
                  value in updated_category_data.items()}}
    )


def update_task(user_id, category_name, task_name, updated_task_data):
    client = get_db_connection()
    db = client['cal']
    collection = db['users']

    # Use $set to update the specific fields of the task
    return collection.update_one(
        {"_id": user_id, "categories.name": category_name,
            "categories.tasks.name": task_name},
        {"$set": {f"categories.$[category].tasks.$[task].{
            key}": value for key, value in updated_task_data.items()}},
        array_filters=[
            {"category.name": category_name},
            {"task.name": task_name}
        ]
    )
