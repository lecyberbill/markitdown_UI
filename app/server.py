import os
import tempfile
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import HTMLResponse, PlainTextResponse
from fastapi.staticfiles import StaticFiles
from markitdown import MarkItDown, UnsupportedFormatException

HERE = Path(__file__).parent
STATIC = HERE / "static"

app = FastAPI(title="MarkItDown Web")

md = MarkItDown()

MAX_SIZE = 50 * 1024 * 1024


@app.get("/", response_class=HTMLResponse)
async def index():
    return (STATIC / "index.html").read_text(encoding="utf-8")


@app.post("/convert")
async def convert(file: UploadFile = File(...)):
    data = await file.read()
    if len(data) > MAX_SIZE:
        raise HTTPException(413, "File too large (max 50 MB)")

    suffix = Path(file.filename).suffix.lower() if file.filename else ""

    try:
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
            tmp.write(data)
            tmp_path = tmp.name

        try:
            result = md.convert(tmp_path)
        except UnsupportedFormatException:
            raise HTTPException(400, f"Unsupported format: {suffix or 'unknown'}")
        finally:
            os.unlink(tmp_path)

        return {"filename": file.filename, "text": result.markdown}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, str(e))


app.mount("/", StaticFiles(directory=str(STATIC), html=True), name="static")
