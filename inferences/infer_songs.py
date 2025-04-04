import math, torchaudio
from utils import process_audio


if __name__ == "__main__":
    waveform, sr =torchaudio.load("./inferences/blue.wav" )
    process_audio(
        waveform=waveform,
        model_path="./models/all-separation/multisepmodelp1.pth",
        mode='multi',
        save=True,
        output_dir=".",
        hop_length=512,
        window_size=2048,
        samp_rate=sr,
        samples_step=88200
    )
