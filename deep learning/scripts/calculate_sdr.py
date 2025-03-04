import torch, math
import numpy as np
import mir_eval
from architectures.UNet.UNet import SpectrogramUNet
from utils import spec_to_audio, infer

SAMPLING_RATE = 44100
WINDOW_SIZE = 2048
HOP_LENGTH = 512
FREQ_BINS = 1025
T_FRAMES = 173

CUT_DURATION = math.ceil((HOP_LENGTH*(T_FRAMES-1))/SAMPLING_RATE)
SAMPLES_STEP = CUT_DURATION*SAMPLING_RATE
BASE_DIR = "../Spectrograms"

def compute_sdr(true_wave, pred_wave):
   
    true_wave[true_wave == 0] += 1e-10
    pred_wave[pred_wave == 0] += 1e-10
    true_wave = true_wave.cpu().numpy().reshape(1, -1)  
    pred_wave = pred_wave.cpu().numpy().reshape(1, -1)
    
    sdr, _, _, _ = mir_eval.separation.bss_eval_sources(true_wave, pred_wave)
    return sdr[0]  

if __name__ == "__main__":

    total_sdr_vocal = 0
    total_sdr_acc = 0
   
    model = SpectrogramUNet(in_channel=1, out_channel=2)
    model.load_state_dict(torch.load('./models/vocal-accompaniment-separation/voicemodelp2.pth', map_location="cpu"))
    model.eval()

    for i in range(0, 2158):
     spectrogram = np.load(BASE_DIR + f"/test/{i}.npz", allow_pickle=True)
     mix = torch.from_numpy(spectrogram['mix'])
     actual_vocal = torch.from_numpy(spectrogram['vocals'])
     actual_acc = torch.from_numpy(spectrogram['accompaniment'])
     phase = torch.from_numpy(spectrogram['phase_mix'])

   
     vocal_gt_wave = spec_to_audio(spectrogram=actual_vocal, phase=phase, n_fft=WINDOW_SIZE, hop_length=HOP_LENGTH, name="vocal")
     acc_gt_wave = spec_to_audio(spectrogram=actual_acc, phase=phase, n_fft=WINDOW_SIZE, hop_length=HOP_LENGTH, name="acc")

    

    
     inferred_vocal, inferred_acc = infer(model=model, mix_spectrogram=mix.unsqueeze(0))

    
     inferred_vocal_wave = spec_to_audio(spectrogram=1.5 * abs(inferred_vocal), phase=phase, n_fft=WINDOW_SIZE, hop_length=HOP_LENGTH, name="ivocal")
     inferred_acc_wave = spec_to_audio(spectrogram=abs(inferred_acc), phase=phase, name="iacc",n_fft=WINDOW_SIZE, hop_length=HOP_LENGTH,)


     sdr_vocal = compute_sdr(vocal_gt_wave, inferred_vocal_wave)
     sdr_acc = compute_sdr(acc_gt_wave, inferred_acc_wave)
     print(f"Calculated for {i}.npz: vocal_sdr = {sdr_vocal}, accompaniment_sdr = {sdr_acc} \n")
     total_sdr_vocal += sdr_vocal
     total_sdr_acc += sdr_acc
    


    print(f" Average SDR for vocals: {total_sdr_vocal/2158:.2f} dB")
    print(f"Average SDR for accompaniment: {total_sdr_acc/2158:.2f} dB")
