from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from pathlib import Path
import os
from dotenv import load_dotenv

from .agent import WealthVisorAgent

load_dotenv()

app = FastAPI(title="WealthVisor API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your frontend origin(s)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _resolve_prompt_path() -> Path:
    backend_dir = Path(__file__).resolve().parent
    # Prefer an exact name if present, else fall back to the existing copy
    preferred = backend_dir / "Agent-Prompt.md"
    fallback = backend_dir / "Agent-Prompt copy.md"
    if preferred.exists():
        return preferred
    if fallback.exists():
        return fallback
    # Final fallback: use a non-existent preferred path; agent will load default
    return preferred


# Initialize the WealthVisor agent with the system prompt
agent = WealthVisorAgent(system_prompt_path=_resolve_prompt_path())


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    session_id: str
    reply: str


@app.get("/")
async def root() -> Dict[str, str]:
    return {"message": "WealthVisor API is running"}


@app.get("/health")
async def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.get("/agent/provider")
async def get_provider() -> Dict[str, str]:
    return agent.provider_info()


@app.post("/agent/chat", response_model=ChatResponse)
async def chat(req: ChatRequest) -> ChatResponse:
    try:
        result = agent.chat(req.message, session_id=req.session_id)
        return ChatResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/agent/history")
async def get_history(session_id: str) -> List[Dict[str, Any]]:
    try:
        return agent.history(session_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
