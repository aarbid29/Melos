from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.responses import StreamingResponse, JSONResponse
from utils import process_audio
from io import BytesIO
import torchaudio
import math, os
import uvicorn
import zipfile

MODEL_PATH_BASE = "./models" 

VOICE_MODEL = 'voicemodelp2.pth'
INSTRUMENT_MODEL = 'multisepmodelp1.pth'


MODEL_PATH_BASE = "./models" 

VOICE_MODEL = 'voicemodelp2.pth'
INSTRUMENT_MODEL = 'multisepmodelp1.pth'


SAMPLING_RATE = 44100
WINDOW_SIZE = 2048
HOP_LENGTH = 512
FREQ_BINS = 1025
T_FRAMES = 173

CUT_DURATION = math.ceil((HOP_LENGTH*(T_FRAMES-1))/SAMPLING_RATE)
SAMPLES_STEP = CUT_DURATION*SAMPLING_RATE

CUT_DURATION = math.ceil((HOP_LENGTH*(T_FRAMES-1))/SAMPLING_RATE)
SAMPLES_STEP = CUT_DURATION*SAMPLING_RATE


server = FastAPI()

order_mapping = {
   'vocal': {
       0 : 'vocals',
       1 : 'accompaniment'
   },

   'multi':{
      0:'vocals',
      1:'drums',
      2:'guitar',
      3:'other'
   }
   
}

karaoke_modes= ['no-vocals', 'guitar-removed', 'drums-removed', 'guitar-only']



@server.post("/separate/{mode}")
async def separateV(mode: str,file: UploadFile = File(...) ):

    if mode not in [i for i in order_mapping.keys()] :
       return JSONResponse(
            status_code=400,
            content={"error": "mode should be vocal or multi"}
        )

    model_path = os.path.join(MODEL_PATH_BASE, VOICE_MODEL if mode=="vocal" else INSTRUMENT_MODEL)
@server.post("/separate/{mode}")
async def separateV(mode: str,file: UploadFile = File(...) ):

    if mode not in [i for i in order_mapping.keys()] :
       return JSONResponse(
            status_code=400,
            content={"error": "mode should be vocal or multi"}
        )

    model_path = os.path.join(MODEL_PATH_BASE, VOICE_MODEL if mode=="vocal" else INSTRUMENT_MODEL)

    try:
        
        
        audio_bytes = await file.read()
        waveform, sr = torchaudio.load(BytesIO(audio_bytes))
        waveform, sr = torchaudio.load(BytesIO(audio_bytes))

        separated = process_audio(waveform, model_path, SAMPLING_RATE, SAMPLES_STEP
                                  , WINDOW_SIZE, HOP_LENGTH, mode=mode)
        
        separated = process_audio(waveform, model_path, SAMPLING_RATE, SAMPLES_STEP
                                  , WINDOW_SIZE, HOP_LENGTH, mode=mode)
        
        zip_buffer = BytesIO()


        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
         for idx, audio in enumerate(separated):
            audio_buffer = BytesIO()
            torchaudio.save(audio_buffer, audio, SAMPLING_RATE, format="wav")
            audio_buffer.seek(0)

            #response[vocal_only_mapping[idx]] = StreamingResponse(audio_buffer, media_type="audio/wav")
            print(f"doing for {order_mapping[mode][idx]}")
            zip_file.writestr(f"{order_mapping[mode][idx]}.wav", audio_buffer.read())
         for idx, audio in enumerate(separated):
            audio_buffer = BytesIO()
            torchaudio.save(audio_buffer, audio, SAMPLING_RATE, format="wav")
            audio_buffer.seek(0)

            #response[vocal_only_mapping[idx]] = StreamingResponse(audio_buffer, media_type="audio/wav")
            print(f"doing for {order_mapping[mode][idx]}")
            zip_file.writestr(f"{order_mapping[mode][idx]}.wav", audio_buffer.read())
        
        
        return StreamingResponse(zip_buffer, media_type="application/zip")
    
        
        return StreamingResponse(zip_buffer, media_type="application/zip")
    
    except Exception as e:
        return {"error": f"Error : {str(e)}"}
    
@server.post("/karaoke/split/{mode}")
async def karaoke_split(mode: str, file: UploadFile=File(...)):
   pass

@server.post("/karaoke/merge")
async def karaoke_merge(vocal_file: UploadFile=File(...), track_file: UploadFile=File(...)):
   pass

if __name__ == "__main__":
    uvicorn.run(server, host="0.0.0.0", port=8000)
        


        

        


        
