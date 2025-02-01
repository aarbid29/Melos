"""
This section is used to make inference (separate sources) using the trained models. It assumes that the input data is in an npz file with mix, accompaniment, drum, bass
and other components. Each of these components should contain data of shape (1, 1025, 173) ---> (channel, freq_bins, time frames)
"""


import torch, torchaudio
from torchaudio.transforms import GriffinLim
import numpy as np
import os
from architectures.UNet.UNet import SpectrogramUNet
import torch.nn.functional as F

SAMPLING_RATE = 44100
BASE_DIR = "./Spectrograms"


def spec_to_audio(spectrogram, phase, name, n_fft=2048 ):
 
 stft_comp = spectrogram*torch.exp(1j*phase)
 print(spectrogram.dim())
 if (spectrogram.dim()==2):
  spectrogram=spectrogram.unsqueeze(0)
 audio = torch.istft(
        stft_comp, 
        n_fft=n_fft, 
        hop_length=512, 
        normalized=False, 
        return_complex=False,
        
    )
 audio = audio.to(dtype=torch.float32)
 torchaudio.save(f"./{name}.wav", audio, SAMPLING_RATE)
 print("Audio saved")




def infer(model, mix_spectrogram):
 
 with torch.no_grad():
  output = model(mix_spectrogram).squeeze(0)
 return output[0, :, :], output[1, :, :]

  
 
if __name__=="__main__":
 
 model = SpectrogramUNet(in_channel=1, out_channel=2)
 model.load_state_dict(torch.load('./models/vocal-accompaniment-separation/voicemodelp2.pth', weights_only=True))
 model.eval()
 
 spectrogram = np.load(BASE_DIR+"/test/810.npz")
 mix = torch.from_numpy(spectrogram['mix'])


 actual_vocal_part = torch.from_numpy(spectrogram['vocals'])
 actual_acc_part = torch.from_numpy(spectrogram['accompaniment'])
 phase = torch.from_numpy(spectrogram['phase_mix'])
 spec_to_audio(spectrogram=mix, phase=phase, name="mix")
 spec_to_audio(spectrogram=actual_vocal_part, phase=phase, name="vocal")
 spec_to_audio(spectrogram=actual_acc_part, phase=phase, name="acc")

 inferred_vocal, inferred_acc = infer(model=model, mix_spectrogram=mix.unsqueeze(0))
 spec_to_audio(1.5*abs(inferred_vocal), phase=phase, name="ivocal")
 spec_to_audio(abs(inferred_acc), phase=phase, name="iacc")

 

 




