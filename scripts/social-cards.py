from PIL import Image,ImageDraw,ImageFont,ImageOps
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
regular='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';bold='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
def font(n,b=False):return ImageFont.truetype(bold if b else regular,n)
def card(app=False):
 im=Image.new('RGB',(1200,630),'#261638');d=ImageDraw.Draw(im)
 d.ellipse((750,-290,1500,460),fill='#35204e');d.ellipse((-250,400,680,1300),fill='#302044')
 mark=Image.open(ROOT/'public/favicon.png').convert('RGBA').resize((82,82),Image.Resampling.LANCZOS);im.paste(mark,(62,55),mark)
 d.text((166,58),'AMARAVATHI',font=font(30,True),fill='white');d.text((169,99),'T R A V E L S',font=font(15),fill='#c8afe8')
 if not app:
  photo=ImageOps.fit(Image.open(ROOT/'public/images/chennai-traveller.jpg').convert('RGB'),(468,470),centering=(.5,.5));mask=Image.new('L',photo.size,0);ImageDraw.Draw(mask).rounded_rectangle((0,0,467,469),radius=30,fill=255);im.paste(photo,(670,80),mask)
  d.text((62,192),'Your Chennai.',font=font(49,True),fill='white');d.text((62,255),'Your journey.',font=font(49,True),fill='#c9a9ff')
  d.text((65,342),'Car & van rentals | Corporate travel',font=font(23),fill='#e3d2ef');d.text((65,385),'Local. Outstation. Airport transfers.',font=font(22),fill='#bfa4d2')
  d.rounded_rectangle((63,455,382,512),radius=12,fill='#c9adff');d.text((86,470),'Get a rental quote',font=font(23,True),fill='#2b1b3d')
  d.text((65,562),'amaravathitravels.com',font=font(23),fill='#e3cffa')
 else:
  d.rounded_rectangle((855,90,1090,515),radius=36,fill='#c3a3ed');d.rounded_rectangle((868,103,1077,502),radius=27,fill='#302044');d.rounded_rectangle((931,118,1014,129),radius=5,fill='#c3a3ed')
  m=mark.resize((112,112),Image.Resampling.LANCZOS);im.paste(m,(917,203),m);d.text((913,341),'ANDROID',font=font(20,True),fill='#dac4ef');d.text((918,377),'Coming soon',font=font(15),fill='#b499cd')
  d.text((62,192),'The Android app.',font=font(48,True),fill='white');d.text((62,255),'Help, in one place.',font=font(45,True),fill='#c9a9ff')
  d.text((65,350),'App information | Support | Privacy',font=font(24),fill='#e3d2ef');d.text((65,400),'Official download link coming soon.',font=font(22),fill='#bfa4d2')
  d.text((65,562),'app.amaravathitravels.com',font=font(23),fill='#e3cffa')
 out=ROOT/'public/images'/('app-social-preview.jpg' if app else 'social-preview.jpg');im.save(out,quality=88,optimize=True);print(out.name,out.stat().st_size)
card();card(True)
