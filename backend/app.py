from flask import Flask, jsonify, request, render_template, abort
import json

app = Flask(__name__)
# Configuración para servir archivos estáticos (CSS/JS) y templates (HTML)
# Por defecto, Flask ya busca en las carpetas 'static' y 'templates'
# pero si están en subcarpetas, hay que especificarlo.
# En este caso, como las carpetas frontend/static y frontend/templates
# están separadas del backend, se debe usar la configuración de `static_folder` y `template_folder`

app.static_folder = '../frontend/static'
app.template_folder = '../frontend/templates'


# Nombre del archivo JSON para la base de datos simulada
DB_FILE = 'db.json'


# --- Funciones para manejar la "base de datos" (archivo JSON) ---
def load_tasks():
    """Carga las tareas desde el archivo JSON."""
    try:
        with open(DB_FILE, 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def save_tasks(tasks):
    """Guarda las tareas en el archivo JSON."""
    with open(DB_FILE, 'w') as f:
        json.dump(tasks, f, indent=4)

# --- Endpoints de la API REST ---
@app.route('/')
def serve_frontend():
    """Sirve el archivo HTML principal para el frontend."""
    return render_template('index.html')

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    """Devuelve todas las tareas."""
    tasks = load_tasks()
    return jsonify(tasks)

@app.route('/api/tasks', methods=['POST'])
def create_task():
    """Crea una nueva tarea."""
    if not request.json or 'title' not in request.json:
        abort(400)  # Bad Request si no se envía JSON o falta el 'title'
    tasks = load_tasks()
    new_id = max([t['id'] for t in tasks]) + 1 if tasks else 1
    new_task = {
        'id': new_id,
        'title': request.json['title'],
        'completed': False
    }
    tasks.append(new_task)
    save_tasks(tasks)
    return jsonify(new_task), 201  # 201: Created

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Elimina una tarea por su ID."""
    tasks = load_tasks()
    task = [t for t in tasks if t['id'] == task_id]
    if not task:
        abort(404)  # Not Found si no se encuentra la tarea
    tasks.remove(task[0])
    save_tasks(tasks)
    return jsonify({'result': True})

# --- Ejecución del servidor ---
if __name__ == '__main__':
    app.run(debug=True)