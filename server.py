from flask import Flask, request, jsonify, redirect, url_for, render_template_string
import sqlite3
import logging

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize database
def init_db():
    with sqlite3.connect('selfie.db') as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS selfies (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                image BLOB NOT NULL
            )
        ''')
        conn.commit()

init_db()

# Login required decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth = request.authorization
        if not auth or auth.username != 'Cr3cka' or auth.password != 'Cr3cka786':
            return jsonify({"status": "error", "message": "Authentication failed"}), 401
        return f(*args, **kwargs)
    return decorated_function

@app.route('/admin')
@login_required
def admin():
    with sqlite3.connect('selfie.db') as conn:
        selfies = conn.execute('SELECT id, image FROM selfies').fetchall()
    return render_template_string('''
        <h2>Admin Panel - Selfies</h2>
        <a href="{{ url_for('logout') }}">Logout</a>
        <ul>
        {% for selfie in selfies %}
            <li><img src="data:image/png;base64,{{ selfie[1] }}" alt="Selfie {{ selfie[0] }}" width="200"></li>
        {% endfor %}
        </ul>
    ''', selfies=selfies)

@app.route('/logout')
@login_required
def logout():
    return redirect(url_for('admin'))

@app.route('/send-selfie', methods=['POST'])
def send_selfie():
    data_url = request.json['image']

    with sqlite3.connect('selfie.db') as conn:
        conn.execute('''
            INSERT INTO selfies (image)
            VALUES (?)
        ''', (data_url,))
        conn.commit()

    return jsonify({"status": "success", "message": "Selfie stored!"})

if __name__ == '__main__':
    app.run(debug=True)
