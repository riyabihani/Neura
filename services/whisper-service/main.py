from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from faster_whisper import WhisperModel
import tempfile
import os
import subprocess
import shutil

app = FastAPI()

app.add_middleware(
  CORSMiddleware, allow_origins=["http://localhost:3000", "http://localhost:5173"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"]
)

# loading the model at startup
MODEL_SIZE = os.getenv("WHISPER_MODEL", "base")
DEVICE = os.getenv("WHISPER_DEVICE", "cpu")
COMPUTE_TYPE = os.getenv("WHISPER_COMPUTE_TYPE", "int8")

model = WhisperModel(MODEL_SIZE, device=DEVICE, compute_type=COMPUTE_TYPE)

def ensure_ffmpeg():
    if shutil.which("ffmpeg") is None:
        raise RuntimeError("ffmpeg not found. Install ffmpeg and ensure it's in PATH.")
      

def convert_to_wav_16k_mono(input_path: str, output_path: str):
    ensure_ffmpeg()
    cmd = [
        "ffmpeg", "-y",
        "-i", input_path,
        "-ac", "1",
        "-ar", "16000",
        "-f", "wav",
        output_path
    ]
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"FFmpeg failed: {result.stderr}")


@app.get("/health")
def health():
    return {"ok": True, "model": MODEL_SIZE, "device": DEVICE, "compute_type": COMPUTE_TYPE}


@app.post("/api/transcribe")
async def transcribe(file: UploadFile = File(...)):
    try:
        # Save uploaded file to a temp path
        suffix = os.path.splitext(file.filename or "")[1] or ".webm"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp_in:
            tmp_in.write(await file.read())
            input_path = tmp_in.name

        # Convert to wav 16k mono for reliability
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_wav:
            wav_path = tmp_wav.name

        convert_to_wav_16k_mono(input_path, wav_path)

        # Transcribe
        segments, info = model.transcribe(
            wav_path,
            language="en",     # or set None to auto-detect
            vad_filter=True,   # helps cut silences
        )

        text = "".join(seg.text for seg in segments).strip()

        return {
            "text": text.strip(),
            "language": info.language,
            "duration": info.duration,
        }

    except subprocess.CalledProcessError as e:
        raise HTTPException(
            status_code=500, detail="FFmpeg conversion failed") from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
    finally:
        # Clean up temp files safely
        try:
            if "input_path" in locals() and os.path.exists(input_path):
                os.remove(input_path)
        except:
            pass
        try:
            if "wav_path" in locals() and os.path.exists(wav_path):
                os.remove(wav_path)
        except:
            pass
