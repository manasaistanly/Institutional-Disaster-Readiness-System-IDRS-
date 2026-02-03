# Audio File Instructions

Please add an alarm sound file to this directory with the name `alarm.mp3`.

## Where to get free alarm sounds:
1. **Pixabay**: https://pixabay.com/sound-effects/search/alarm/
2. **Freesound**: https://freesound.org/
3. **Mixkit** (download locally): https://mixkit.co/free-sound-effects/alarm/

## Recommended sounds:
- Emergency siren
- Alarm beep
- Alert tone

After downloading:
1. Rename the file to `alarm.mp3`
2. Place it in this `public` folder
3. The AlertBanner component will load it from `/alarm.mp3`

## Alternative: Use a CDN
If you prefer using a CDN instead, update the audio src in AlertBanner.jsx to a reliable CDN URL like:
- `https://cdn.freesound.org/...` (after downloading and finding a direct link)
- Or any other reliable audio CDN
