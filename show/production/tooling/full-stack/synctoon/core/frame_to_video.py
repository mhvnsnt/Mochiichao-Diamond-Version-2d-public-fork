import argparse
import json
import os
from datetime import datetime
from os.path import isfile, join

import cv2
import numpy as np

# Initialize parser
parser = argparse.ArgumentParser()

# Adding optional argument
parser.add_argument("-n", "--name", help="name of video")

# Load the frame data from JSON
frame_data = open("./frameCreationInfo.json")
frame_data = json.load(frame_data)


def convert_frames_to_video(pathIn, pathOut, fps):
    """
    Optimized OpenCV method with better codec and settings
    """
    try:
        # Load the first image to get video dimensions
        first_frame_key = frame_data["frame_key"]["0"]
        first_frame_path = pathIn + first_frame_key + ".png"
        img = cv2.imread(first_frame_path)

        if img is None:
            print(f"Error: Unable to read the image {first_frame_path}")
            return False

        height, width, layers = img.shape
        size = (width, height)

        # Use H.264 codec for better compression and quality
        fourcc = cv2.VideoWriter_fourcc(*"mp4v")  # or 'H264' if available
        out = cv2.VideoWriter(pathOut, fourcc, fps, size)

        if not out.isOpened():
            print("Error: VideoWriter could not be opened")
            return False

        # Process frames in order using frame_data
        total_frames = len(frame_data["frame_key"])
        print(f"Creating video with {total_frames} frames...")

        for counter in range(total_frames):
            filename = pathIn + frame_data["frame_key"][str(counter)] + ".png"
            img = cv2.imread(filename)

            if img is None:
                print(f"Error: Unable to read the image {filename}")
                continue

            if counter % 100 == 0:  # Progress indicator every 100 frames
                print(
                    f"Processing frame {counter}/{total_frames} ({(counter/total_frames)*100:.1f}%)"
                )

            out.write(img)

        out.release()
        print(f"Video successfully saved to {pathOut}")
        return True

    except Exception as e:
        print(f"OpenCV method failed: {e}")
        return False


def main():
    # Define the input folder containing the frames
    pathIn = "./video_frames/"

    # Read arguments from command line
    args = parser.parse_args()

    if args.name:
        pathOut = f"./videos/{args.name}.mp4"
        name = args.name
    else:
        today = datetime.now()
        pathOut = f"./videos/{str(today)}.mp4"
        name = today

    print(f"Creating video with file name: {name}")

    # Set frames per second (FPS) for the video
    fps = 24.0

    # Convert the frames to a video
    convert_frames_to_video(pathIn, pathOut, fps)


if __name__ == "__main__":
    main()
