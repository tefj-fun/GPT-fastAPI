# Person Detection API

A FastAPI application that uses Ultralytics YOLOv8 for real-time person detection in images.

## Features

- Upload images through a web interface
- Real-time person detection using YOLOv8
- Display bounding boxes and confidence scores
- Simple and intuitive user interface

## Setup

1. Install the required dependencies:
```bash
pip install -r requirements.txt
```

2. Run the FastAPI server:
```bash
python -m uvicorn main:app --reload
```

3. Open your browser and navigate to:
```
http://localhost:8000/static/index.html
```

## Usage

1. Click the "Choose File" button to select an image
2. The image will be displayed on the canvas
3. Click the "Detect Objects" button to run the detection
4. Bounding boxes will appear around detected objects with their names and confidence scores

## API Endpoints

- `POST /inference`: Upload an image for object detection
  - Input: Image file
  - Output: JSON with detection results including bounding boxes, class names, and confidence scores

## Dependencies

- FastAPI
- Uvicorn
- Ultralytics YOLOv8
- Pillow
- Requests

## Note

Make sure to replace the API_KEY in `main.py` with your own Ultralytics API key if needed.