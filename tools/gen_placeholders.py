#!/usr/bin/env python3
"""Generate short placeholder tone .wav files for the soundboard.

Standard library only (no external dependencies). Each sound is a brief sine-wave
tone at a distinct pitch with a quick fade-out so it doesn't click. Replace these
files with real audio whenever you like, keeping the same names (or update
sounds.json to point at new names).

Run from the repo root:  python3 tools/gen_placeholders.py
"""

import math
import os
import struct
import wave

SAMPLE_RATE = 44100
DURATION = 0.4  # seconds
AMPLITUDE = 0.5  # 0.0 - 1.0
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "sounds")

# filename -> frequency in Hz
TONES = {
    "cat.wav": 880.0,
    "dog.wav": 220.0,
    "bird.wav": 1320.0,
    "beep.wav": 660.0,
    "boop.wav": 330.0,
    "ding.wav": 1046.5,
    "note-a.wav": 440.0,
    "note-c.wav": 523.25,
    "note-e.wav": 659.25,
}


def write_tone(path, freq):
    frame_count = int(SAMPLE_RATE * DURATION)
    with wave.open(path, "w") as wav:
        wav.setnchannels(1)       # mono
        wav.setsampwidth(2)       # 16-bit
        wav.setframerate(SAMPLE_RATE)
        frames = bytearray()
        for i in range(frame_count):
            # Linear fade-out over the whole clip to avoid an end click.
            fade = 1.0 - (i / frame_count)
            sample = AMPLITUDE * fade * math.sin(2 * math.pi * freq * i / SAMPLE_RATE)
            frames += struct.pack("<h", int(sample * 32767))
        wav.writeframes(bytes(frames))


def main():
    out = os.path.abspath(OUT_DIR)
    os.makedirs(out, exist_ok=True)
    for name, freq in TONES.items():
        path = os.path.join(out, name)
        write_tone(path, freq)
        print(f"wrote {path} ({freq:.1f} Hz)")


if __name__ == "__main__":
    main()
