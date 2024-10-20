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


def createUser(user_id, password, categories=None):
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


def addCategory(user_id, category):
    client = get_db_connection()
    db = client['cal']
    collection = db['users']
    user = collection.find_one({"_id": user_id})
    if user:
        categories = user.get('categories', [])
        for cat in categories:
            if cat['name'] == category:
                return {"status": "error", "message": "Category already exists"}

        new_category = {
            "name": category,
            "tasks": []  # Initialize with an empty list of tasks
        }
        collection.update_one(
            {"_id": user_id},
            {"$push": {"categories": new_category}}
        )

        # Return the updated user
        return find_user_by_user_id(user_id)
    else:
        return {"status": "error", "message": "User not found"}



def addTask(user_id, category_name, task):
    client = get_db_connection()
    db = client['cal']
    collection = db['users']
    
    collection.update_one(
        {"_id": user_id, "categories.name": category_name},
        {"$push": {"categories.$.tasks": task}} 
    )
    
    return find_user_by_user_id(user_id)

def deleteCategory(user_id, category_name):
    client = get_db_connection()
    db = client['cal']
    collection = db['users']

    # Remove the category with the specified name from the user's categories list
    result = collection.update_one(
        {"_id": user_id},
        {"$pull": {"categories": {"name": category_name}}}
    )
    
    if result.modified_count == 1:
        return find_user_by_user_id(user_id)  # Return the updated user after deletion
    else:
        return {"status": "error", "message": "Category not found or could not be deleted"}


def updateCategory(user_id, category_name, updated_category_data):
    client = get_db_connection()
    db = client['cal']
    collection = db['users']

    # Use $set to update the specific fields of the category
    return collection.update_one(
        {"_id": user_id, "categories.name": category_name},
        {"$set": {f"categories.$.{key}": value for key,
                  value in updated_category_data.items()}}
    )


def updateTask(user_id, category_name, task_name, updated_task_data):
    client = get_db_connection()
    db = client['cal']
    collection = db['users']

    # Update the specific fields of the task
    collection.update_one(
        {"_id": user_id},
        {"$set": {f"categories.$[category].tasks.$[task].{key}": value for key, value in updated_task_data.items()}},
        array_filters=[
            {"category.name": category_name},
            {"task.name": task_name}
        ]
    )
    return find_user_by_user_id(user_id)  # Return updated user

def deleteTask(user_id, category_name, task_name):
    client = get_db_connection()
    db = client['cal']
    collection = db['users']

    # Remove the task with the specified name from the category's task list
    result = collection.update_one(
        {"_id": user_id, "categories.name": category_name},
        {"$pull": {"categories.$.tasks": {"name": task_name}}}
    )
    
    if result.modified_count == 1:
        return find_user_by_user_id(user_id)  # Return the updated user after deletion
    else:
        return {"status": "error", "message": "Task not found or could not be deleted"}


