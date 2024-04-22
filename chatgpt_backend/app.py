import openai
from flask import Flask, make_response, request, jsonify
from flask_cors import CORS
import os
import PyPDF2

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# openai.api_key = "sk-proj-EDBy6ZtHS3chCbpzQ2LVT3BlbkFJb91yKqt5NGYl49P3ONnf"
openai.api_key = os.getenv('OPENAI_API_KEY')

def _build_cors_preflight_response():
    response = make_response()
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

chat_sessions = {}

def extract_text_from_pdf(file):
    try:
        pdf_reader = PyPDF2.PdfReader(file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() if page.extract_text() else ""
        file.close()
        return text
    except Exception as e:
        print("Error extracting text from PDF:", e)
        return None

@app.route('/upload_pdf', methods=['POST'])
def upload_pdf():
    file = request.files.get('file')
    if not file:
        return jsonify({"error": "No file part in the request"}), 400
    text = extract_text_from_pdf(file)
    if text is None:
        return jsonify({"error": "Failed to extract text from PDF"}), 400
        
    try:
        session_id = os.urandom(24).hex()
        initial_messages = [{"role": "system", "content": "This is a system message to start the chat."},{"role": "user", "content": text}]
        chat_sessions[session_id] = initial_messages
        return jsonify({"session_id": session_id})
    except Exception as e:
        print("Error during API call:", e)
        return jsonify({"error": str(e)}), 400

@app.route('/ask_question', methods=['POST', 'OPTIONS'])
def ask_question():

    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    if not request.is_json:
        return jsonify({"error": "Missing JSON in request"}), 400
    data = request.get_json()
    session_id = data.get('session_id')
    question = data.get('question')
    print(data)
    if not session_id or not question:
        return jsonify({"error": "Missing session_id or question in JSON payload"}), 400   
    chat_history = chat_sessions.get(session_id, [])
    message = {"role": "user", "content": question}
    chat_history.append(message)
   
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=chat_history
        )
        chat_history.append(response.choices[0].message)
        chat_sessions[session_id] = chat_history         
        answer = response.choices[0].message['content']
        return jsonify({"answer": answer})
    except Exception as e:
        error_message = str(e)
        return jsonify({"error": error_message}), 400


@app.route('/get_session', methods=['GET'])
def get_session():
    extracted_file=None
    with open("./Startup_Playbook.pdf", 'rb') as file:
        extracted_file = extract_text_from_pdf(file)    

    try:
        session_id = os.urandom(24).hex()
        initial_messages = [{"role": "system", "content": "This is a system message to start the chat."},{"role": "user", "content": extracted_file}]
        chat_sessions[session_id] = initial_messages
        return jsonify({"session_id": session_id})
    except Exception as e:
        print(f"Error during API call:, {str(e)}")
        return jsonify({"error": str(e)}), 400



if __name__ == '__main__':
    app.run(host='0.0.0.0')
