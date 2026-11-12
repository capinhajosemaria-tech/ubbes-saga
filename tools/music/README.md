# Music composer

The game's music is composed by rules (one function per piece in `compose.js`) and played with recorded
instruments from **VSCO-2 Community Edition** (public domain, https://github.com/sgossner/VSCO-2-CE).
The rendered pieces are `source/music/*.mp3` (copied to `music/` by `tools/release.sh`).

To change a piece:
1. Get the samples: clone VSCO-2 CE (SFZ branch) to `/home/claude/vsco` and run `python3 prep_samples.py`
   (writes trimmed, tuned samples and `manifest.json` to `/home/claude/samp/lib`).
2. Edit the piece in `compose.js` (tempo, mode, progression, instruments, grooves, melody seeds).
3. Render: `render.py` serves `/home/claude` and renders in headless Chrome to WAV (paths inside assume
   `compose.js` and `render.html` sit in `/home/claude/music/`), then encode:
   `ffmpeg -i s1.wav -af "highpass=f=28,loudnorm=I=-18:TP=-1.5:LRA=11" -b:a 96k source/music/s1.mp3`
   (season pieces at -18 LUFS, special pieces at -16).
