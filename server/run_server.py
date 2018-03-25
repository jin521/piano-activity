import os
from flask import Flask, request, render_template, send_from_directory, jsonify
app = Flask(__name__, static_folder=None)

CLIENT_FOLDER = os.path.abspath('../client/build')

sequence = ['C#', 'D', 'F', 'D#', 'G', 'G#', 'A', 'B', 'Eb', 'Gb', 'A']
current_index = -1

@app.route('/')
def welcome():
    return render_template('welcome.html')

@app.route('/note', methods=['GET', 'POST'])
def note():
    global sequence
    global current_index
    result = None

    if request.method == 'POST':
        notes = request.get_json()
        if sequence[current_index] in notes:
            if current_index == len(sequence) - 1:
                current_index = -1
                result = {'status': True, 'next': False}
            else:
                result = {'status': True, 'next': True}
        else:
            result = {'status': False}
    else:
        current_index = current_index + 1
        result = {'note': sequence[current_index]}

    return jsonify(result)

@app.route('/piano/', methods=['GET'])
def serve_app():
    return send_from_directory(CLIENT_FOLDER, 'index.html')

@app.route('/<path:path>', methods=['GET'])
def serve_static(path):
    print(path)
    return send_from_directory(CLIENT_FOLDER, path)

if __name__ == "__main__":
    app.debug = True
    app.run()
