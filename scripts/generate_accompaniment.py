'''
Running this script results in generation of accompaniment in those
Sources of DSD100 dataset where it isn't present. It does it by mixing
all audios except vocals.wav.

'''


import os
import torchaudio

path = ".//DSD100//Sources//train"
elements = ['bass.wav', 'drums.wav', 'other.wav', 'guitar.wav']

for dirpath, dirname, filenames in os.walk(path):
    comps = os.path.normpath(dirpath).split(os.path.sep)  

   
    if comps[-1] != "train" and "accompaniment.wav" not in filenames:
        print(f"Generating for {comps[-1]} \n\n")
        
        mixed = None
        sample_rate = None

        for each in elements:
            file_path = os.path.join(dirpath, each)

            
            if os.path.exists(file_path):
                try:
                    audio, sr = torchaudio.load(file_path)
                    
                    if mixed is None:
                        mixed = audio
                        sample_rate = sr
                    else:
                        
                        min_length = min(mixed.size(1), audio.size(1))
                        mixed = mixed[:, :min_length]
                        audio = audio[:, :min_length]
                        mixed += audio

                except Exception as e:
                    print(f"Error loading {file_path}: {e}")

        if mixed is not None:
            output_path = os.path.join(dirpath, "accompaniment.wav")
            torchaudio.save(output_path, mixed, sample_rate)
            print(f"Saved accompaniment to {output_path}\n")
