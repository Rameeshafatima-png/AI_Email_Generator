import os
from dotenv import load_dotenv

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, Field

from google import genai


# ============================================================
# Configuration
# ============================================================

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

if API_KEY:
    client = genai.Client(api_key=API_KEY)
else:
    client = None


# ============================================================
# FastAPI App
# ============================================================

app = FastAPI(
    title="AI Email Generator",
    description="Generate professional emails using Google Gemini.",
    version="1.0.0"
)


# ============================================================
# Static Files & Templates
# ============================================================

app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")


# ============================================================
# Request Model
# ============================================================

class EmailRequest(BaseModel):
    recipient_name: str = Field(..., min_length=1, max_length=100)
    purpose: str = Field(..., min_length=5, max_length=1000)
    tone: str = Field(..., pattern="^(Professional|Friendly|Formal)$")


# ============================================================
# Routes
# ============================================================

# ============================================================
# Routes
# ============================================================

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={}
    )


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "model": MODEL
    }


# ============================================================
# Email Generation
# ============================================================

@app.post("/generate")
async def generate_email(data: EmailRequest):

    if not client:
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": "GEMINI_API_KEY is not configured."
            }
        )

    prompt = f"""
You are an expert professional email writer.

Generate a complete, polished email based on the information below.

Recipient Name:
{data.recipient_name}

Email Purpose:
{data.purpose}

Tone:
{data.tone}

Requirements:
- Write a clear subject line.
- Address the recipient using exactly the provided recipient name.
- Do NOT invent titles such as Mr., Ms., Dr., Professor, etc.
- Do NOT modify, shorten, or reinterpret the recipient's name.
- Write a complete, concise email.
- Match the requested tone exactly.
- Use natural human-like language.
- Do not invent facts that were not provided.
- Do not use markdown formatting.
- Include an appropriate closing.
- Do NOT use placeholders such as [Your Name], Your Name, Sender Name, or Recipient Name.
- End the email with "Best regards," only. Do not add a sender name.
"""

    try:

        interaction = client.interactions.create(
            model=MODEL,
            input=prompt
        )

        generated_email = interaction.output_text.strip()

        return {
            "success": True,
            "email": generated_email
        }

    except Exception as e:

        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": f"Unable to generate email: {str(e)}"
            }
        )
 