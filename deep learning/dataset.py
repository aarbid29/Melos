from torch.utils.data import Dataset
import numpy as np
import torch
import os

SKIP = 2158

class DSDDataset(Dataset):

    def __init__(self, spectrograms_path, vocal_only=False, train = True, mask=None, transform=None):
        super().__init__()
        self.spectrogram_path = spectrograms_path
        self.vocal_only = vocal_only
        self.transform = transform
        self.type = "train" if train else "test"
        self.skip = SKIP if train else 0
    
    def __len__(self):
     return len(os.listdir(os.path.join(self.spectrogram_path, self.type)))
    
    def __getitem__(self, index):
        index_path = os.path.join(self.spectrogram_path, self.type, str(index+self.skip) + '.npz')
        data = np.load(index_path)
        feature = data["mix"]

        if self.vocal_only:
            target = {
                "vocals":data["vocals"],
                "accompaniment":data["accompaniment"]
            }
        else:
            target = {
                "vocals":data["vocals"],
                "drums":data["drums"],
                "guitar":data["guitar"],
                "other":data["other"]
            }
        return feature, target
        
        