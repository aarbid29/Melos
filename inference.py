import torch, torchaudio
from torchaudio.transforms import GriffinLim
import numpy as np
import os
from architectures.UNet.UNet import SpectrogramUNet
import torch.nn.functional as F

SAMPLING_RATE = 44100
BASE_DIR = "./Spectrograms"

def spec_to_audio(spectrogram, name, n_fft=2048 ):
 
 griffith = GriffinLim(2048)
 print(spectrogram.dim())
 if (spectrogram.dim()==2):
  spectrogram=spectrogram.unsqueeze(0)
 audio = griffith(spectrogram)
 audio = audio.to(dtype=torch.float32)
 torchaudio.save(f"./{name}.wav", audio, SAMPLING_RATE)
 print("Audio saved")


def infer(model, mix_spectrogram):
 
 with torch.no_grad():
  output = model(mix_spectrogram).squeeze(0)
 return output[0, :, :], output[1, :, :]

  
 
if __name__=="__main__":
 
 model = SpectrogramUNet(in_channel=1, out_channel=2)
 model.load_state_dict(torch.load('.voicemodel.pth', weights_only=True))
 model.eval()
 
 spectrogram = np.load(BASE_DIR+"/test/350.npz")
 mix = torch.from_numpy(spectrogram['mix'])


 actual_vocal_part = torch.from_numpy(spectrogram['vocals'])
 actual_acc_part = torch.from_numpy(spectrogram['accompaniment'])
 spec_to_audio(spectrogram=mix, name="mix")
 spec_to_audio(spectrogram=actual_vocal_part, name="vocal")
 spec_to_audio(spectrogram=actual_acc_part, name="acc")

 inferred_vocal, inferred_acc = infer(model=model, mix_spectrogram=mix.unsqueeze(0))
 spec_to_audio(10*abs(inferred_vocal), name="ivocal")
 spec_to_audio(abs(inferred_acc), name="iacc")

 

 




