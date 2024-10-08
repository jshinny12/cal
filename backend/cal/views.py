from django.http import JsonResponse
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .utils import create_user


@csrf_exempt
def register_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_id = data['_id_']
            password = data['password']
            create_user(user_id, password, [])
            return JsonResponse({"status": "success", "message": "User registered successfully"}, status=201)
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)
    return JsonResponse({"status": "error", "message": "Invalid request method"}, status=405)

def home(request):
    return HttpResponse("Welcome to the To-Do App!")
