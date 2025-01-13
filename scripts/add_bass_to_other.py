'''
Running this script results in every other.wav and bass.wav present in DSD100 dataset getting mixed and saved as 'other.wav' in same directory. 
This is only to be done if separation of bass isn't needed, as in my case.'''

import os
import torchaudio

PATH = ".//DSD100//Sources//train"
mix = None


for dirpath, dirname, filenames in os.walk(PATH):
    if dirpath!=PATH:
       print(f"Mixing other and bass of {dirpath.split(os.path.sep)[-1] } \n")
       other_waveform, _ = torchaudio.load(os.path.join(dirpath, "other.wav"))
       bass_waveform, _= torchaudio.load(os.path.join(dirpath, "bass.wav"))
       min_length = min(other_waveform.size(1), bass_waveform.size(1))
       mix = other_waveform[:, :min_length] + bass_waveform[:, :min_length]
       torchaudio.save(os.path.join(dirpath, "other.wav"), mix, 44100)
       print(f"Done! \n\n")
       