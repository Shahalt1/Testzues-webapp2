from fastapi import FastAPI, Form, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import os
import json
import pandas as pd
import uvicorn

app = FastAPI()

# CORS setup
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Create uploads directory if it doesn't exist
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Define data models
class TestResult(BaseModel):
    id: int
    timestamp: str
    gherkin_text: str
    testing_data_filename: Optional[str]
    file_content: Optional[dict]  # Add field to store file content
    model: str
    browser: str
    params: List[str]

# Store to hold the test results
test_results: List[TestResult] = []
current_id = 0

async def process_file(file: UploadFile) -> dict:
    """Process the uploaded file based on its extension"""
    if not file:
        return None
        
    file_extension = os.path.splitext(file.filename)[1].lower()
    
    try:
        content = await file.read()  # Read the file content
        
        # Save the file
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            f.write(content)
        
        # Process based on file type
        if file_extension == '.csv':
            df = pd.read_csv(file_path)
            return {"type": "csv", "data": df.to_dict(orient='records')}
            
        elif file_extension == '.json':
            return {"type": "json", "data": json.loads(content.decode())}
            
        elif file_extension == '.txt':
            return {"type": "text", "data": content.decode()}
            
        else:
            return {"type": "unknown", "data": f"File saved at {file_path}"}
            
    except Exception as e:
        print(f"Error processing file: {str(e)}")
        return {"type": "error", "data": str(e)}
    finally:
        await file.seek(0)  # Reset file pointer for any subsequent operations

@app.post("/settings")
async def receive_form_data(
    gherkin_data: str = Form(...),
    filename: Optional[UploadFile] = File(None),
    llm_model: str = Form(...),
    apikey: str = Form(...),
    browser: str = Form(...),
    params: List[str] = Form([]),
):
    try:
        global current_id
        current_id += 1
        
        # Process the file if it exists
        file_content = await process_file(filename) if filename else None
        
        # Create new test result
        new_result = TestResult(
            id=current_id,
            timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            gherkin_text=gherkin_data,
            testing_data_filename=filename.filename if filename else None,
            file_content=file_content,
            model=llm_model,
            browser=browser,
            params=params
        )
        
        # Add to storage
        test_results.append(new_result)
        
        return new_result

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/results")
async def get_all_results():
    """Get all test results"""
    return test_results

@app.get("/results/{result_id}")
async def get_result(result_id: int):
    """Get a specific test result by ID"""
    for result in test_results:
        if result.id == result_id:
            return result
    raise HTTPException(status_code=404, detail="Result not found")

@app.get("/results/latest")
async def get_latest_result():
    """Get the most recent test result"""
    if test_results:
        return test_results[-1]
    raise HTTPException(status_code=404, detail="No results found")

@app.get("/files/{result_id}")
async def get_file_content(result_id: int):
    """Get the file content for a specific result"""
    for result in test_results:
        if result.id == result_id:
            if result.file_content:
                return result.file_content
            raise HTTPException(status_code=404, detail="No file content available")
    raise HTTPException(status_code=404, detail="Result not found")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)