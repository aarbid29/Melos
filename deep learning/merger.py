import torchaudio

f1, sr = torchaudio.load("./drums.wav")
f2, sr = torchaudio.load("./guitar.wav")
f3, sr = torchaudio.load("./other.wav")

min_len = min(f1.shape[1], min(f2.shape[1], f3.shape[1]))
waveform1 = f1[:, :min_len]
waveform2 = f2[:, :min_len]
waveform3 = f3[:, :min_len]


f4 = waveform1+waveform2+waveform3
torchaudio.save("acc_multi.wav", f4, sr)
