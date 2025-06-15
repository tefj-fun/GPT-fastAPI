import io
import json
import requests
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

API_KEY = "824e7f266df96dc8b9434f989e3ef66c0e568f711a"
ULTRALYTICS_API_URL = "https://predict.ultralytics.com"
MODEL_URL = "https://hub.ultralytics.com/models/4iiEIb7peyXxmzwkUbVN"  # Using the example model URL

@app.post("/inference")
async def run_inference(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        files = {"file": (file.filename, contents, file.content_type)}
        data = {
            "model": MODEL_URL,
            "imgsz": 640,
            "conf": 0.25,
            "iou": 0.45
        }
        headers = {"x-api-key": API_KEY}

        print(f"Sending request to Ultralytics API with model: {MODEL_URL}")
        response = requests.post(ULTRALYTICS_API_URL, headers=headers, data=data, files=files)
        
        if response.status_code != 200:
            print(f"Error from Ultralytics API: {response.status_code} - {response.text}")
            raise HTTPException(status_code=response.status_code, detail=f"Ultralytics API error: {response.text}")
        
        return JSONResponse(content=response.json())
    except requests.exceptions.RequestException as e:
        print(f"Request error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Request error: {str(e)}")
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
