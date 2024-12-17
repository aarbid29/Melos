"""
This section of the project is used to extract spectrograms from the raw DSD100 dataset and organize them into the Spectrograms
directory. If you run this section correctly, you should see a Spectrograms folder in the main directory with test and train sub directories.
Each spectrogram (.npz format) represents a 2 second segment of songs from the DSD100 dataset (mixture, vocal, drum, bass, accompaniment, other). 

"""


import torchaudio
import torch
import os
import numpy as np
import math

ARCHITECTURE_IN_USE = "UNET"
DATASET_PATH = "./DSD100"
SAVE_DIR = "./Spectrograms"

SAMPLING_RATE = 44100
WINDOW_SIZE = 2048
HOP_LENGTH = 512
FREQ_BINS = 1025
T_FRAMES = 173

CUT_DURATION = math.ceil((HOP_LENGTH*(T_FRAMES-1))/SAMPLING_RATE)
SAMPLES_STEP = CUT_DURATION*SAMPLING_RATE


def to_mono(signal):
  if signal.shape[0]>1:
    signal = torch.mean(signal, dim=0, keepdim=True)
  return signal


def audio_to_spectrogram(waveform, window_size, hop_length):
  waveform = to_mono(waveform)
  to_spectrogram  = torchaudio.transforms.Spectrogram(n_fft=window_size, hop_length=hop_length)
  stft = to_spectrogram(waveform)
  magnitude = torch.abs(stft)
  return magnitude


def cut_out_waveform(waveform, sample_step):
  if waveform.shape[1]<sample_step:
    return []
  if waveform.shape[1] % sample_step != 0:
    waveform = waveform[:, :int(waveform.shape[1]/sample_step)*sample_step]
  result = []
  for i in range(0, waveform.shape[1], sample_step):
    tukra = waveform[:, i:i+sample_step]
    result.append(tukra)
  return result




def preprocess_DSD100(dataset_base_path, save_path, window_size, hop_length):
  idx = 0
  os.makedirs(save_path, exist_ok=True)
  
  for i, (dirpath, dirname, filename) in enumerate(os.walk(os.path.join(dataset_base_path, 'Mixtures'))):
    for f in filename:
      path_components = dirpath.split(os.path.sep)

      song_name = path_components[-1]
      section = path_components[-2]
      file_save_path = os.path.join(save_path, str(section))
      
      os.makedirs(file_save_path, exist_ok=True)
      
      print(f"Processing : {song_name} ({section})")
      
      mixture_waveform, _ = torchaudio.load(os.path.join(dirpath, f))
      vocal_waveform, _= torchaudio.load(os.path.join(dataset_base_path, 'Sources', str(section), str(song_name), 'vocals.wav'))
      #accompaniment_waveform, _ = torchaudio.load(os.path.join(dataset_base_path, 'Sources', str(section), str(song_name))
      bass_waveform , _= torchaudio.load(os.path.join(dataset_base_path, 'Sources', str(section), str(song_name), 'bass.wav'))
      drums_waveform, _ = torchaudio.load(os.path.join(dataset_base_path, 'Sources', str(section), str(song_name), 'drums.wav'))
      other_waveform, _= torchaudio.load(os.path.join(dataset_base_path, 'Sources', str(section), str(song_name), 'other.wav'))

      mixture_tukras_spectrograms = [audio_to_spectrogram(tukra, WINDOW_SIZE, HOP_LENGTH) for tukra in cut_out_waveform(mixture_waveform, SAMPLES_STEP)]
      vocal_tukras_spectrograms = [audio_to_spectrogram(tukra, WINDOW_SIZE, HOP_LENGTH) for tukra in cut_out_waveform(vocal_waveform, SAMPLES_STEP)]
      bass_tukras_spectrograms = [audio_to_spectrogram(tukra, WINDOW_SIZE, HOP_LENGTH) for tukra in cut_out_waveform(bass_waveform, SAMPLES_STEP)]
      drums_tukras_spectrograms = [audio_to_spectrogram(tukra, WINDOW_SIZE, HOP_LENGTH) for tukra in cut_out_waveform(drums_waveform, SAMPLES_STEP)]
      other_tukras_spectrograms = [audio_to_spectrogram(tukra, WINDOW_SIZE, HOP_LENGTH) for tukra in cut_out_waveform(other_waveform, SAMPLES_STEP)]

      for n in range(len(mixture_tukras_spectrograms)):
       np.savez(os.path.join(file_save_path, str(idx)+'.npz') , 
                mix = mixture_tukras_spectrograms[n].numpy(), 
                vocal = vocal_tukras_spectrograms[n].numpy(), bass = bass_tukras_spectrograms[n].numpy(), drum = drums_tukras_spectrograms[n].numpy(), other = other_tukras_spectrograms[n].numpy())
       idx+=1
      

if __name__=="__main__":
  preprocess_DSD100(dataset_base_path=DATASET_PATH, save_path=SAVE_DIR, window_size=WINDOW_SIZE, hop_length=HOP_LENGTH)