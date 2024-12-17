from torch.utils.data import Dataset
import numpy as np
import json

class DSDDataset(Dataset):

    def __init__(self, json_path, vocal_only=False, mask=None, transform=None):
        super().__init__()
        self.json_path = json_path
        self.vocal_only = vocal_only
        self.transform = transform
    
    def __getitem__(self, index):
        
        with open(self.json_path, 'r') as f:
            data = json.load(f)
        
        feature = data["train"][index]["mixture"].numpy()

        if self.vocal_only:
            target = data["train"][index]["accompaniment"].numpy()
        else:
            target = {
                "vocals":data["train"][index]["vocals"].numpy(),
                "drums":data["train"][index]["drums"].numpy(),
                "bass":data["train"][index]["bass"].numpy(),
                "other":data["train"][index]["other"].numpy()
            }
        return feature, target
        
        