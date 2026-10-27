import os
import json
import shutil
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.messages import HumanMessage

os.environ["GOOGLE_API_KEY"] = "YOUR_API_KEY_HERE"

# Initialize Gemini Flash (which natively supports Video and Images)
llm = ChatGoogleGenerativeAI(model="gemini-flash-latest", temperature=0)

app = FastAPI(title="ACCURRATE Gatekeeper API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/scan-media")
async def scan_media(
    dataset_rules: str = Form(...), # The brand rules typed in by the user
    ad_file: UploadFile = File(...) # The video, image, or document uploaded
):
    print(f"Received file: {ad_file.filename}. Processing...")

    # 1. Save the uploaded file locally so Gemini can access it
    temp_file_path = f"temp_{ad_file.filename}"
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(ad_file.file, buffer)

    try:
        # 2. To process video/images in LangChain, we construct a complex message
        # Note: For very large videos, we would use the Google File API,
        # but LangChain handles local media paths directly for Flash.

        prompt_text = f"""
        You are the ACCURRATE AI Auditor.
        Verify this attached ad media using these dataset rules: {dataset_rules}

        You must respond ONLY in valid JSON format.
        {{
            "religious_sensitivity_flags": [],
            "tone_mismatches": [],
            "visual_errors": [],
            "actionable_fixes": []
        }}
        """

        message = HumanMessage(
            content=[
                {"type": "text", "text": prompt_text},
                {"type": "image_url", "image_url": temp_file_path} # LangChain uses 'image_url' for local media files (including video for Gemini)
            ]
        )

        # 3. Send the file and text to Gemini
        print("Sending media to Gemini Flash...")
        response = llm.invoke([message])

        # 4. Clean up the JSON response
        clean_json_string = response.content.replace("```json", "").replace("```", "").strip()
        report_data = json.loads(clean_json_string)

        # 5. Delete the temporary file from your server to save space
        os.remove(temp_file_path)

        return {"status": "success", "report": report_data}

    except Exception as e:
        # If anything fails, make sure we still delete the temporary file!
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        raise HTTPException(status_code=500, detail=f"AI Processing Error: {str(e)}")