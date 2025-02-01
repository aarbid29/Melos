import torch
import torchaudio
import numpy as np
import os
import math
from architectures.UNet.UNet import SpectrogramUNet
from torchaudio.transforms import GriffinLim
from scripts.preprocess import to_mono, audio_to_spectrogram, cut_out_waveform
from inferences.infer_test import infer, spec_to_audio

SAMPLING_RATE = 44100
WINDOW_SIZE = 2048
HOP_LENGTH = 512
FREQ_BINS = 1025
T_FRAMES = 173
CUT_DURATION = math.ceil((HOP_LENGTH * (T_FRAMES - 1)) / SAMPLING_RATE)
SAMPLES_STEP = CUT_DURATION * SAMPLING_RATE




def process_audio(file_path, model_path, output_dir="./output"):
    
    os.makedirs(output_dir, exist_ok=True)

    model = SpectrogramUNet(in_channel=1, out_channel=2)
    model.load_state_dict(torch.load(model_path, map_location=torch.device("cpu")))
    model.eval()

   
    waveform, sr = torchaudio.load(file_path)
    if sr != SAMPLING_RATE:
        resample = torchaudio.transforms.Resample(orig_freq=sr, new_freq=SAMPLING_RATE)
        waveform = resample(waveform)

    
    segments = cut_out_waveform(waveform, SAMPLES_STEP)
    if not segments:
        print("No valid segments to process.")
        return

    reconstructed_vocals = []
    reconstructed_accompaniment = []

    for idx, segment in enumerate(segments):
        print(f"Processing segment {idx + 1}/{len(segments)}...")
        magnitude, phase = audio_to_spectrogram(segment, WINDOW_SIZE, HOP_LENGTH)
        magnitude = magnitude.unsqueeze(0)  

        
        inferred_vocal, inferred_acc = infer(model, mix_spectrogram=magnitude)

      
        reconstructed_vocals.append((1.5 * abs(inferred_vocal), phase))
        reconstructed_accompaniment.append((abs(inferred_acc), phase))

    
    for name, parts in zip(["vocals", "accompaniment"], [reconstructed_vocals, reconstructed_accompaniment]):
        combined_audio = []
        for magnitude, phase in parts:
            audio_segment = torch.istft(
                magnitude * torch.exp(1j * phase),
                n_fft=WINDOW_SIZE,
                hop_length=HOP_LENGTH,
                normalized=False,
                return_complex=False,
            )
            combined_audio.append(audio_segment)

        final_audio = torch.cat(combined_audio, dim=-1)
        torchaudio.save(os.path.join(output_dir, f"{name}.wav"), to_mono(final_audio), SAMPLING_RATE)
        print(f"Saved: {name}.wav")

if __name__ == "__main__":
    
    process_audio(
        file_path="./inferences/tum se hi.mp3",
        model_path="./models/vocal-accompaniment-separation/voicemodelp2.pth",
        output_dir="."
    )
