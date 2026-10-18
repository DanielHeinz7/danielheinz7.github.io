"""Build responsive WebP copies without changing the source images."""
from io import BytesIO
from pathlib import Path
import json
from PIL import Image, ImageCms, ImageOps

root = Path(__file__).resolve().parents[1]
images = root / 'public/images'
output = images / 'responsive'
output.mkdir(exist_ok=True)
manifest = {}
for source in [images / 'portrait.jpg', *sorted((images / 'papers').glob('*.png'))]:
    with Image.open(source) as opened:
        image = ImageOps.exif_transpose(opened)
        icc = image.info.get('icc_profile')
        if icc:
            srgb = ImageCms.createProfile('sRGB')
            image = ImageCms.profileToProfile(image, ImageCms.ImageCmsProfile(BytesIO(icc)), srgb, outputMode='RGB')
            icc = ImageCms.ImageCmsProfile(srgb).tobytes()
        else:
            image = image.convert('RGB')
        portrait = source.name == 'portrait.jpg'
        sizes = [160, 280, 560, 840] if portrait else [160, 320, 640, 960]
        variants = []
        for width in sizes:
            if width > image.width:
                continue
            height = round(image.height * width / image.width)
            variant = image.resize((width, height), Image.Resampling.LANCZOS)
            target = output / f'{source.stem}-{width}.webp'
            options = {'method': 6, 'quality': 85} if portrait else {'method': 6, 'lossless': True}
            if icc:
                options['icc_profile'] = icc
            variant.save(target, 'WEBP', **options)
            variants.append({'src': '/images/responsive/' + target.name, 'width': width})
        manifest[source.name] = {'width': image.width, 'height': image.height, 'sources': variants}
(root / 'src/data/image-variants.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(f'Built responsive copies for {len(manifest)} images.')
