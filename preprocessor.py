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
FILE_TYPES = ['vocals', 'accompaniment', 'bass', 'drums', 'other', 'mix']
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
  to_spectrogram  = torchaudio.transforms.Spectrogram(n_fft=window_size, hop_length=hop_length, power=None)
  stft = to_spectrogram(waveform)
  magnitude = torch.abs(stft)
  phase = torch.angle(stft)
  return magnitude, phase


def cut_out_waveform(waveform, sample_step):
  if waveform.shape[1]<sample_step:
    print("Warning: No segments generated. Skipping...")
    return []
  if waveform.shape[1] % sample_step != 0:
    waveform = waveform[:, :int(waveform.shape[1]/sample_step)*sample_step]
  result = []
  for i in range(0, waveform.shape[1], sample_step):
    tukra = waveform[:, i:i+sample_step]
    result.append(tukra)
  return result




def preprocess_DSD100(dataset_base_path, save_path, window_size, hop_length, sample_step, file_types):
  idx = 0
  os.makedirs(save_path, exist_ok=True)
  
  for i, (dirpath, dirname, filename) in enumerate(os.walk(os.path.join(dataset_base_path, 'Mixtures'))):
   if idx<=2157:
    for f in filename:

        waveforms = {}
        spectrograms = {} 
     
        path_components = dirpath.split(os.path.sep)

        song_name = path_components[-1]
          
        section = path_components[-2]
        file_save_path = os.path.join(save_path, str(section))
        
        os.makedirs(file_save_path, exist_ok=True)
        
        print(f"Processing : {song_name} ({section})")
        
        mixture_waveform, _ = torchaudio.load(os.path.join(dirpath, f))
        waveforms['mix'] = mixture_waveform

        for t in file_types:
          if t != 'mix':
            waveforms[t], _ = torchaudio.load(os.path.join(dataset_base_path, 'Sources', str(section), str(song_name), t+'.wav')) 
          spectrograms[t] = []

          phase_mix = None if section=="train" else []

          for tukra in cut_out_waveform(waveforms[t], sample_step):
            mag, phase = audio_to_spectrogram(tukra, window_size, hop_length)
            spectrograms[t].append(mag)

            if section != "train" and t=="mix": 
             phase_mix.append(phase)
             

        print(f"Processing complete. \n")
        print(f"mix size={len(spectrograms['mix'])}\naccompaniment size = {len(spectrograms['accompaniment'])}\nvocal size ={len(spectrograms['vocals'])}\n phase of mixture size = {len(phase_mix)}")

        for n in range(len(spectrograms['accompaniment'])):
        
          np.savez(os.path.join(file_save_path, str(idx)+'.npz') , 
                  mix = spectrograms['mix'][n].numpy(), 
                  accompaniment = spectrograms['accompaniment'][n].numpy(),
                  vocals = spectrograms['vocals'][n].numpy(), 
                  bass = spectrograms['bass'][n].numpy(), 
                  drum = spectrograms['drums'][n].numpy(), 
                  other = spectrograms['other'][n].numpy(),
                  phase_mix = phase_mix[n].numpy() if section != "train" else None
                  )
          idx+=1
      

if __name__=="__main__":
  preprocess_DSD100(dataset_base_path=DATASET_PATH, save_path=SAVE_DIR, window_size=WINDOW_SIZE, hop_length=HOP_LENGTH, sample_step=SAMPLES_STEP, file_types=FILE_TYPES)