from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings

def get_collections(request):
    try:
        # Get the MongoDB database from settings
        db = settings.MONGO_DB
        
        # Get list of collections in the MongoDB database
        collections = db.list_collection_names()

        # Return the collections as JSON response
        return JsonResponse({
            "status": "success",
            "collections": collections
        }, status=200)
    except Exception as e:
        return JsonResponse({
            "status": "error",
            "message": str(e)
        }, status=500)

