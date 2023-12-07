from flask import Flask, render_template, request, jsonify
from werkzeug.utils import secure_filename
import pandas as pd
import numpy as np
import os
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, MaxPooling2D, Dropout, Conv2D, Flatten, Activation, LeakyReLU
from PIL import Image


app = Flask(__name__)
app.static_folder = 'static'

app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
app.config['UPLOAD_EXTENSIONS'] = ['.jpg', '.JPG']
app.config['UPLOAD_PATH'] = './static/img/upload/'

action_model = tf.keras.models.load_model("model/Model_cnn (2).h5")

NUM_CLASSES = 7
tomato_classes = ['Tomato Leaf Bacterial Spot', 'Tomato Leaf Early Blight', 'Tomato Leaf Health',
                  'Tomato Leaf Late Blight', 'Tomato Leaf Mosaic Virus', 'Tomato Leaf Septoria', 'Tomato Leaf Yellow Virus']


@app.route('/')
def index():
    return render_template("index.html")

# routing API


@app.route("/api/Deteksi", methods=['POST'])
def apiDeteksi():
    # Set nilai default untuk hasil prediksi dan gambar yang diprediksi
    hasil_prediksi = '(none)'
    gambar_prediksi = '(none)'

    # Get File Gambar yg telah diupload pengguna
    uploaded_file = request.files['file']
    filename = secure_filename(uploaded_file.filename)

    # Periksa apakah ada file ya dipilih untuk diupload.
    if filename != '':
        # Set/mendapatkan extension dan path dari file yg diupload
        file_ext = os.path.splitext(filename)[1]
        gambar_prediksi = './static/img/upload/' + filename

        # Simpan Gambar
        uploaded_file.save(os.path.join(app.config['UPLOAD_PATH'], filename))

        # Memuat Gambar
        test_image = Image.open(gambar_prediksi)

        # Periksa apakah extension tale ya upload sesuai
        if file_ext in app.config['UPLOAD_EXTENSIONS']:
            # Mengubah Ukuran Gambar
            test_image_resized = test_image.resize((200, 200))

            # Konversi Gambar ke Array
            image_array = np.array(test_image_resized)
            test_image_x = (image_array / 255) - 0.5
            test_image_x = np.array([image_array])

            # Prediksi Gambar
            y_pred_test_single = action_model.predict(test_image_x)
            y_pred_test_classes_single = np.argmax(y_pred_test_single, axis=1)

            hasil_prediksi = tomato_classes[y_pred_test_classes_single[0]]

            # Return hasil prediksi dengan format JSON
            return jsonify({
                "prediksi": hasil_prediksi,
                "gambar_prediksi": gambar_prediksi
            })
        else:
            # Return hasil prediksi dengan format JSON
            gambar_prediksi = '(none)'
            return jsonify({
                "prediksi": hasil_prediksi,
                "gambar_prediksi": gambar_prediksi
            })


@app.route('/artikel')
def artikel():
    return render_template("artikel.html")


@app.route('/artikel2')
def artikel2():
    return render_template("artikel2.html")


@app.route('/artikel3')
def artikel3():
    return render_template("artikel3.html")


@app.route('/artikel1')
def artikel1():
    return render_template("artikel1.html")


if __name__ == '__main__':
    app.run(debug=True)
