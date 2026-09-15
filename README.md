<div align="center">

# Dispatch

### AI Email Generator

Create polished, professional emails in seconds with the power of Google Gemini AI.

<p>
  <img src="https://img.shields.io/badge/Python-3.10%2B-1f2937?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/FastAPI-Backend-0f172a?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/Google%20Gemini-AI-334155?style=for-the-badge&logo=google&logoColor=white" alt="Gemini">
  <img src="https://img.shields.io/badge/JavaScript-Frontend-1e293b?style=for-the-badge&logo=javascript&logoColor=white" alt="JavaScript">
</p>

<br>

**A desk for writing better email.**

</div>

---


## Overview

Writing the right email can often take time, especially when the message needs to sound professional, formal, or friendly.

AI Email Generator simplifies this process by combining a FastAPI backend with Google Gemini to generate customized emails in seconds.

The application is designed to be simple, practical, and easy to use while maintaining high-quality AI-generated responses.

---

## Key Features

* AI-powered email generation
* Google Gemini integration
* FastAPI backend
* Simple and responsive web interface
* Personalized recipient name
* Automatic subject line generation
* Three available writing tones:

  * Professional
  * Friendly
  * Formal
* Input validation using Pydantic
* Environment-based API key configuration
* Health-check endpoint
* Error handling for API and configuration issues

The backend validates the recipient name, email purpose, and selected tone before generating the email.

---

## Technologies Used

| Technology    | Purpose                         |
| ------------- | ------------------------------- |
| Python        | Application development         |
| FastAPI       | Backend framework               |
| Google Gemini | AI-powered email generation     |
| Pydantic      | Data validation                 |
| Jinja2        | HTML template rendering         |
| HTML          | Frontend structure              |
| CSS           | Frontend styling                |
| JavaScript    | Frontend interaction            |
| python-dotenv | Environment variable management |

---

## Project Architecture

```text
AI-Email-Generator/
│
├── app/
│   └── main.py
│
├── templates/
│   └── index.html
│
├── static/
│   ├── style.css
│   └── script.js
│
├── .env
├── .gitignore
├── requirements.txt
└── README.md
```

---

## How It Works

The application follows a simple workflow:

```text
User Input
    |
    v
Recipient Name
Email Purpose
Preferred Tone
    |
    v
FastAPI Backend
    |
    v
Google Gemini
    |
    v
Generated Email
    |
    v
User Interface
```

### Step 1 — User Input

The user provides:

* Recipient name
* Purpose of the email
* Preferred tone

### Step 2 — Request Validation

FastAPI validates the submitted information before processing the request.

### Step 3 — AI Processing

The application creates a structured prompt and sends it to Google Gemini.

### Step 4 — Email Generation

Gemini generates a complete email containing an appropriate subject line, personalized greeting, concise content, and closing.

### Step 5 — Result

The generated email is returned to the application and displayed to the user.

---

## Google Gemini Configuration

The application uses an environment variable for the Gemini API key.

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

The application loads the API key using `python-dotenv` and uses the configured Gemini model. If no model is specified, the application defaults to `gemini-2.5-flash`.

### Important

Never upload your actual API key to GitHub.

Add the following to `.gitignore`:

```text
.env
venv/
.venv/
__pycache__/
*.pyc
```

---

## Installation

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd AI-Email-Generator
```

### 2. Create a Virtual Environment

```bash
python -m venv venv
```

### 3. Activate the Environment

For Windows:

```bash
venv\Scripts\activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Running the Application

Start the FastAPI development server:

```bash
uvicorn app.main:app --reload
```

Open the application in your browser:

```text
http://127.0.0.1:8000
```

---

## API Endpoints

### Home

```text
GET /
```

Loads the main email generator interface.

### Health Check

```text
GET /health
```

Returns the current application status and configured Gemini model.

Example:

```json
{
  "status": "healthy",
  "model": "gemini-2.5-flash"
}
```

The health endpoint is implemented specifically to provide a simple application status check.

### Generate Email

```text
POST /generate
```

Generates an email using the submitted information.

Example request:

```json
{
  "recipient_name": "Sarah",
  "purpose": "Request a meeting to discuss the new project",
  "tone": "Professional"
}
```

Example response:

```json
{
  "success": true,
  "email": "Subject: Project Discussion Meeting..."
}
```

---

## AI Prompt Design

The application uses a structured prompt to guide Gemini toward consistent and useful email responses.

The generated email is instructed to:

* Include a clear subject line
* Use the recipient's name exactly as provided
* Avoid inventing titles
* Match the requested tone
* Use natural human-like language
* Avoid creating facts that were not provided
* Produce a concise and complete email
* Avoid unnecessary markdown formatting
* Include an appropriate closing
* End with "Best regards,"
* Avoid adding a sender name or placeholder

These requirements are explicitly defined in the application's generation prompt.

---

## Error Handling

The application includes error handling for common problems such as:

* Missing Gemini API key
* Invalid request data
* Gemini API failures
* Email generation errors

If the Gemini API key is unavailable, the application returns a clear error response instead of attempting to generate an email.

---

## Use Cases

AI Email Generator can be useful for:

* Professional emails
* Business communication
* Meeting requests
* Job-related communication
* Academic communication
* Formal requests
* Thank-you emails
* Friendly messages
* General everyday communication

---

## Future Improvements

Possible future enhancements include:

* Email history
* Copy-to-clipboard functionality
* Multi-language support
* Additional writing tones
* Custom email templates
* User authentication
* Direct email sending
* Saved drafts
* User accounts
* Improved personalization
* Email generation analytics

---

## Project Highlights

AI Email Generator demonstrates how Generative AI can be integrated into a modern Python web application.

The project combines:

```text
Python
   +
FastAPI
   +
Google Gemini
   +
HTML / CSS / JavaScript
   =
AI-Powered Email Generation
```

It provides a practical example of using an AI model through an API while maintaining a structured backend and user-friendly interface.

---

## Author

**Rameesha Fatima**

AI & Python Project

---

## License

This project is intended for educational and personal use.

