"""
This section of the project is used to extract spectrograms from the raw DSD100 dataset and organize them into the Spectrograms
directory. If you run this section correctly, you should see a Spectrograms folder in the main directory with test and train sub directories.
Each contain spectrograms (.npz format) of songs from the DSD100 dataset (mixture, vocal, drum, bass, accompaniment, other). 

"""


import torchaudio
import torch
import os
import numpy as np

ARCHITECTURE_IN_USE = "UNET"
DATASET_PATH = "./DSD100"
SAVE_DIR = "./Spectrograms"

SAMPLING_RATE = 44100
WINDOW_SIZE = 2048
HOP_LENGTH = 512


def to_mono(signal):
  if signal.shape[0]>1:
    signal = torch.mean(signal, dim=0, keepdim=True)
  return signal


def audio_to_spectrogram(audio_path, window_size, hop_length):
  waveform, sr = torchaudio.load(uri=audio_path)
  waveform = to_mono(waveform)
  to_spectrogram  = torchaudio.transforms.Spectrogram(n_fft=window_size, hop_length=hop_length)
  stft = to_spectrogram(waveform)
  magnitude = torch.abs(stft)

  norm = magnitude.max()
  magnitude /= norm
  return magnitude


def preprocess_DSD100(dataset_base_path, save_path, window_size, hop_length):

  os.makedirs(save_path, exist_ok=True)
  
  for i, (dirpath, dirname, filename) in enumerate(os.walk(os.path.join(dataset_base_path, 'Mixtures'))):
    for f in filename:
      path_components = dirpath.split(os.path.sep)

      song_name = path_components[-1]
      song_index = int(str(song_name)[:3])
      section = path_components[-2]
      file_save_path = os.path.join(save_path, str(section))
      
      os.makedirs(file_save_path, exist_ok=True)
      
      print(f"Processing : {song_name} ({section})")
      
      mixture_spec = audio_to_spectrogram(os.path.join(dirpath, f), window_size, hop_length)
      vocal_spec = audio_to_spectrogram(os.path.join(dataset_base_path, 'Sources', str(section), str(song_name), 'vocals.wav'), window_size, hop_length)
      #accompaniment_spec = audio_to_spectrogram(os.path.join(dataset_base_path, 'Sources', str(section), str(song_name), 'accompaniments.wav'), window_size, hop_length)
      bass_spec = audio_to_spectrogram(os.path.join(dataset_base_path, 'Sources', str(section), str(song_name), 'bass.wav'), window_size, hop_length)
      drums_spec = audio_to_spectrogram(os.path.join(dataset_base_path, 'Sources', str(section), str(song_name), 'drums.wav'), window_size, hop_length)
      other_spec = audio_to_spectrogram(os.path.join(dataset_base_path, 'Sources', str(section), str(song_name), 'other.wav'), window_size, hop_length)
      np.savez(os.path.join(file_save_path, str(song_index)+'.npz') , mix = mixture_spec.numpy(), vocal = vocal_spec.numpy(), bass = bass_spec.numpy(), drum = drums_spec.numpy(), other = other_spec.numpy())
      

if __name__=="__main__":
  preprocess_DSD100(dataset_base_path=DATASET_PATH, save_path=SAVE_DIR, window_size=WINDOW_SIZE, hop_length=HOP_LENGTH)