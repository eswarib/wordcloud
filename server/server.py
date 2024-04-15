# server.py

from flask import Flask, request, send_file
from flask_cors import CORS
from wordcloud import WordCloud
import base64
import io

from PIL import Image, ImageFont, ImageDraw
# Create a new image with a white background
image = Image.new("RGB", (500, 500), "white")

font = ImageFont.truetype("fonts/HappySwirly-KVB7l.ttf", size=12)
draw = ImageDraw.Draw(image)
text_size = draw.textlength("Your text here", font=font)

app = Flask(__name__)
CORS(app)

@app.route('/generate_wordcloud', methods=['POST'])
def generate_wordcloud():
    print(request.json)
    text = request.json['text']

  # Specify the path to a TrueType font file
    font_path = "fonts/Helvetica.ttf"
    
    # Create WordCloud with TrueType font specified
    wordcloud = WordCloud(font_path=font_path).generate(text)
    
    # Convert the word cloud image to a base64-encoded string
    img_data = io.BytesIO()
    wordcloud.to_image().save(img_data, format='PNG')
    img_data.seek(0)
    img_base64 = base64.b64encode(img_data.read()).decode()

    #return {'wordcloud': img_base64}
    return img_base64
    

if __name__ == '__main__':
    app.run(debug=True)

