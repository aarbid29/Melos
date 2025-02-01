from fastapi import FastAPI, UploadFile, File
from fastapi.responses import StreamingResponse
from utils import process_audio
from io import BytesIO
import torchaudio
import math, os
import uvicorn
import zipfile

MODEL_PATH_BASE = "./models" 

SAMPLING_RATE = 44100
WINDOW_SIZE = 2048
HOP_LENGTH = 512
FREQ_BINS = 1025
T_FRAMES = 173

CUT_DURATION = math.ceil((HOP_LENGTH*(T_FRAMES-1))/SAMPLING_RATE)
SAMPLES_STEP = CUT_DURATION*SAMPLING_RATE


server = FastAPI()

vocal_only_mapping = {
    0 : 'vocals',
    1 : 'accompaniment'
}

@server.post("/separate-voice")
async def separateV(file: UploadFile = File(...)):

    model_path = os.path.join(MODEL_PATH_BASE, "vocal-accompaniment-separation/voicemodelp2.pth")

    try:
        
        audio_bytes = await file.read()
        waveform, sr = torchaudio.load(BytesIO(audio_bytes))

        separated = process_audio(waveform, model_path, SAMPLING_RATE, SAMPLES_STEP
                                  , WINDOW_SIZE, HOP_LENGTH)
        
        zip_buffer = BytesIO()

        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
         for idx, audio in enumerate(separated):
            audio_buffer = BytesIO()
            torchaudio.save(audio_buffer, audio, SAMPLING_RATE, format="wav")
            audio_buffer.seek(0)

            #response[vocal_only_mapping[idx]] = StreamingResponse(audio_buffer, media_type="audio/wav")
            zip_file.writestr(f"{vocal_only_mapping[idx]}.wav", audio_buffer.read())
        
        return StreamingResponse(zip_buffer, media_type="application/zip")
    
    except Exception as e:
        return {"error": f"Error : {str(e)}"}

if __name__ == "__main__":
    uvicorn.run(server, host="0.0.0.0", port=8000)
        


        
