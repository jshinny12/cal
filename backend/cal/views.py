import traceback
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .utils import create_user, add_category, add_task, update_category, update_task, login, find_user_by_user_id

@csrf_exempt
def register_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            _id = data['_id']
            password = data['password']
            categories = data.get('categories', [])
            if find_user_by_user_id(_id):
                return JsonResponse({"status": "error", "message": "User Exists"}, status=402)
            else:
                create_user(_id, password, categories)
            return JsonResponse({"status": "success", "message": "User registered successfully"}, status=201)
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)
    return JsonResponse({"status": "error", "message": "Invalid request method"}, status=405)

@csrf_exempt
def login_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            _id = data['_id']
            password = data['password']
            if not _id or not password:
                return JsonResponse({"status": "error", "message": "Missing user ID or password"}, status=400)
            user = login(_id, password)
            if user:  # Call the helper function
                user_data = {
                    "_id": user['_id'],
                    "categories": user.get('categories', []),
                    # You can include other fields if needed
                }
                return JsonResponse({"status": "success", "message": "User login successful", "user": user_data}, status=200)
            else:
                return JsonResponse({"status": "error", "message": "Invalid user ID or password"}, status=401)
        
        except Exception as e:
            print("Exception occurred during login:", e)
            print(traceback.format_exc())
            return JsonResponse({"status": "error", "message": "Internal server error: " + str(e)}, status=500)


@csrf_exempt
def add_category(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_id = data['_id']
            category = data['category']

            add_category(user_id, category)
            return JsonResponse({"status": "success", "message": "Category added successfully"}, status=200)
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)
    return JsonResponse({"status": "error", "message": "Invalid request method"}, status=405)

@csrf_exempt
def add_task(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_id = data['_id']
            category_name = data['category']
            task = {
                "name": data['name'],
                "due_date": data['due_date'],
                "do_date": data['do_date'],
                "time_it_takes": data['time_it_takes'],
                "description": data['description'],
                "done": data.get('done', False)  # Default to False if not provided
            }

            add_task(user_id, category_name, task)
            return JsonResponse({"status": "success", "message": "Task added successfully"}, status=200)
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)
    return JsonResponse({"status": "error", "message": "Invalid request method"}, status=405)

@csrf_exempt
def update_category(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_id = data['_id']
            category_name = data['category_name']
            updated_data = data['updated_data']  # Updated category details (name, color, etc.)

            update_category(user_id, category_name, updated_data)
            return JsonResponse({"status": "success", "message": "Category updated successfully"}, status=200)
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)
    return JsonResponse({"status": "error", "message": "Invalid request method"}, status=405)

@csrf_exempt
def update_task(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_id = data['_id']
            category_name = data['category']
            task_name = data['task_name']
            updated_task_data = {
                "name": data.get('name', task_name),  # Use new name or default to current task_name
                "due_date": data.get('due_date'),
                "do_date": data.get('do_date'),
                "time_it_takes": data.get('time_it_takes'),
                "description": data.get('description'),
                "done": data.get('done')  # Allow updating the 'done' field
            }

            update_task(user_id, category_name, task_name, updated_task_data)
            return JsonResponse({"status": "success", "message": "Task updated successfully"}, status=200)
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)
    return JsonResponse({"status": "error", "message": "Invalid request method"}, status=405)


def home(request):
    return HttpResponse("Welcome to the To-Do App!")
