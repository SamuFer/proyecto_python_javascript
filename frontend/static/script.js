document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const API_URL = '/api/tasks';

    // Función para obtener y renderizar las tareas
    const fetchTasks = async () => {
        try {
            const response = await fetch(API_URL);
            const tasks = await response.json();
            renderTasks(tasks);
        } catch (error) {
            console.error('Error al obtener las tareas:', error);
        }
    };

    // Función para renderizar las tareas en el DOM
    const renderTasks = (tasks) => {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.setAttribute('data-id', task.id);
            if (task.completada) {
                li.classList.add('completed');
            }

            const taskText = document.createElement('span');
            taskText.textContent = task.tarea;

            // --- BOTÓN PARA CAMBIAR ESTADO ---
            const toggleButton = document.createElement('button');
            toggleButton.textContent = task.completada ? 'Deshacer' : 'Completar';
            toggleButton.classList.add('toggle-btn');
            toggleButton.addEventListener('click', () => toggleTask(task.id, !task.completada));

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.classList.add('delete-btn');
            deleteButton.addEventListener('click', () => deleteTask(task.id));
            
            const taskButtons = document.createElement('div');
            taskButtons.classList.add('task-buttons');
            taskButtons.appendChild(toggleButton);
            taskButtons.appendChild(deleteButton);

            li.appendChild(taskText);
            li.appendChild(taskButtons);
            taskList.appendChild(li);
        });
    };

    // Función para añadir una nueva tarea
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newTask = {
            tarea: taskInput.value
        };

        try {
            await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTask)
            });
            taskInput.value = '';
            fetchTasks();
        } catch (error) {
            console.error('Error al añadir la tarea:', error);
        }
    });


    // --- FUNCIÓN PARA CAMBIAR EL ESTADO (NUEVA) ---
    const toggleTask = async (taskId, newStatus) => {
        try {
            await fetch(`${API_URL}/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ completada: newStatus })
            });
            fetchTasks(); // Vuelve a cargar las tareas para reflejar el cambio
        } catch (error) {
            console.error('Error al actualizar la tarea:', error);
        }
    };


    // Función para eliminar una tarea
    const deleteTask = async (taskId) => {
        try {
            await fetch(`${API_URL}/${taskId}`, {
                method: 'DELETE'
            });
            fetchTasks();
        } catch (error) {
            console.error('Error al eliminar la tarea:', error);
        }
    };

    // Cargar las tareas al iniciar la página
    fetchTasks();
});
