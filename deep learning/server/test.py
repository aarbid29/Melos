import requests
import sys

API_URL = "http://127.0.0.1:8000/separate-voice"
INPUT_AUDIO_FILE = "scale.wav" 
OUTPUT_ZIP_FILE = "separated_audio.zip"

def upload_audio_and_download_zip(input_audio, output_zip):
    try:
        with open(input_audio, "rb") as file:
            files = {"file": file}
            response = requests.post(API_URL, files=files)
            
            if response.status_code == 200:
                with open(output_zip, "wb") as out_file:
                    out_file.write(response.content)
                print(f"Downloaded: {output_zip}")
            else:
                print(f"Error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Exception occurred: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        INPUT_AUDIO_FILE = sys.argv[1]
    upload_audio_and_download_zip(INPUT_AUDIO_FILE, OUTPUT_ZIP_FILE)
