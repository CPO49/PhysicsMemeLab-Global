from pathlib import Path
from PIL import Image, ImageChops

source = Path('public/assets/final/landing/landing_logo_meme_physics_lab_67.png')
target = Path('public/assets/final/landing_logo_meme_physics_lab_67_tight.png')
margin = 16

image = Image.open(source).convert('RGBA')
alpha = image.getchannel('A')
bounds = alpha.getbbox()
if bounds is None:
    raise SystemExit('No visible pixels found in source logo')
left, top, right, bottom = bounds
left, top = max(0, left - margin), max(0, top - margin)
right, bottom = min(image.width, right + margin), min(image.height, bottom + margin)
target.parent.mkdir(parents=True, exist_ok=True)
image.crop((left, top, right, bottom)).save(target)
print(f'{source}: {image.size} -> {target}: {(right - left, bottom - top)}; bounds={bounds}')
