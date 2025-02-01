import math
from ..utils import process_audio


if __name__ == "__main__":
    
    process_audio(
        file_path="./inferences/tum se hi.mp3",
        model_path="./models/vocal-accompaniment-separation/voicemodelp2.pth",
        output_dir="."
    )
