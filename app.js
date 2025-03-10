const apiUrl = 'https://jsonplaceholder.typicode.com/todos';

document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();
    document.getElementById('task-form').addEventListener('submit', addTask);
});

// Obtém todas as tarefas e exibe na lista
function fetchTasks() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const taskList = document.getElementById('tasks');
            taskList.innerHTML = '';
            data.forEach(task => addTaskToList(task, taskList));
        })
        
}

// Adiciona tarefa na lista do DOM
function addTaskToList(task, taskList) {
    const li = document.createElement('li');
    li.dataset.id = task.id;
    li.innerHTML = `
        <strong>${task.title}</strong>
        <div class="task-status">
            <span class="${task.completed ? 'concluida' : 'pendente'}">
                ${task.completed ? 'Concluída' : 'Pendente'}
            </span>
            <button class="edit" onclick="editTask(${task.id})">Editar</button>
            <button class="delete" onclick="deleteTask(${task.id})">Excluir</button>
        </div>
    `;
    taskList.appendChild(li);
}

// Adiciona uma nova tarefa
function addTask(event) {
    event.preventDefault();

    const title = document.getElementById('task-title').value;
    const userId = parseInt(document.getElementById('user-id').value);
    const completed = document.getElementById('task-completed').checked;

    const newTask = { title, userId, completed };

    fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
    })
    .then(response => response.json())
    .then(task => {
        task.id = Math.floor(Math.random() * 1000); // Garante um ID único localmente
        addTaskToList(task, document.getElementById('tasks'));
        alert('Tarefa adicionada com sucesso!');
    })
    
}

// Edita uma tarefa existente
function editTask(taskId) {
    const title = prompt('Digite o novo título da tarefa:');
    if (!title) return;

    const updatedTask = { title, completed: false };

    fetch(`${apiUrl}/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask)
    })
    .then(response => response.json())
    .then(() => {
        document.querySelectorAll('li').forEach(li => {
            if (parseInt(li.dataset.id) === taskId) {
                li.querySelector('strong').textContent = title;
            }
        });
        alert('Tarefa editada com sucesso!');
    })
    
}

// Exclui uma tarefa
function deleteTask(taskId) {
    fetch(`${apiUrl}/${taskId}`, { method: 'DELETE' })
    .then(() => {
        document.querySelectorAll('li').forEach(li => {
            if (parseInt(li.dataset.id) === taskId) {
                li.remove();
            }
        });
        alert('Tarefa excluída com sucesso!');
    })
    
}