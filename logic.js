//Task Class: task data, properties and logic
class Task {
    constructor(number, task, description, status, dateStarted, dateEnded) {
        this.number = number;
        this.task = task;
        this.description = description;
        this.status = status;
        this.dateStarted = dateStarted;
        this.dateEnded = dateEnded;
    }
}

//UI Class: handles UI stuff
class UI {
    static displayTasks() {

        const tasks = Store.getTasks();
        tasks.forEach((task) => UI.addTaskToList(task));
    }

   static addTaskToList(task) {
        const list = document.querySelector('#task-list');
        const row = document.createElement('tr');

        // append a new row that holds data to HTML 
        row.innerHTML = `
            <td class="task-number">${task.number}</td>
            <td>${task.task}</td>
            <td>${task.description}</td>
            <td>${task.status}</td>
            <td>${task.dateStarted}</td>
            <td>${task.dateEnded}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">x</a><td>
        `;
        list.appendChild(row);
    }

    // delete a task from the list
    static deleteTask(element) {
        if(element.classList.contains('delete')) {
            element.parentElement.parentElement.remove();
        }
    }

    // display error or success message inside a bootstrap alert element
    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#tasks-table');
        container.insertBefore(div, form);

        //hide alert after 1.5 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 1500);
    }

    // clear input fields after submitting the form
    static clearFields() {
        document.querySelector('#task').value = '';
        document.querySelector('#description').value = '';
        document.querySelector('#status').value = '';
        document.querySelector('#date-started').value = '';
        document.querySelector('#date-ended').value = '';
    }
}

//Store class: handles local storage
class Store {
   static getTasks() {
        let tasks;

        // if local storage holds no value for this key, set tasks to empty array
        if(localStorage.getItem('tasks') === null){
            tasks = [];
        } else {
            // turn local storage data into an array
            tasks = JSON.parse(localStorage.getItem('tasks'));

            //assign an ordinal number to each task in an array
            tasks.forEach((task, index) => {
                task.number = index + 1;
            });
        }
        return tasks;
    }

   static addTask(task) {
        const tasks = Store.getTasks();

        // push a new task to an array of tasks
        tasks.push(task);

        // turn an array to a string because local storage accepts strings only
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

   static removeTask(number) {
        const tasks = Store.getTasks();

        // loop through tasks and remove the one whose number property matches the number we passed in
        // splice the array at the index of the task that has corresponding number property 
        tasks.forEach((task, index) => {
            if(task.number === number) {
                tasks.splice(index, 1);
            }
        });

        // reload to set task ordinal numbers correctly 
        window.location.reload();

        // turn an array to a string because local storage accepts strings only
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

//Event: display tasks
document.addEventListener('DOMContentLoaded', UI.displayTasks);

//Event: add a new task
document.querySelector('#task-list-form').addEventListener('submit', (e) => {

    // prevent actual submit behaviour
    e.preventDefault();

    // set new task number
    const number = Store.getTasks().length + 1;

    // collect form inputs
    const task = document.querySelector('#task').value;
    const description = document.querySelector('#description').value;
    const status = document.querySelector('#status').value;
    const dateStarted = document.querySelector('#date-started').value;
    const dateEnded = document.querySelector('#date-ended').value;

    // validate form inputs
    if(task === '' || description === '' || status === '' || dateStarted === '' || dateEnded === '') {
        
        // show error message
        UI.showAlert('Please fill in all fields.', 'danger');

    }  else {

        // instantiate task
        const taskItem = new Task(number, task, description, status, dateStarted, dateEnded);

        // add task to the UI
        UI.addTaskToList(taskItem);

        // add task to local storage
        Store.addTask(taskItem);

        // show success message
        UI.showAlert('Task added successfully.', 'success');

        // clear fields
        UI.clearFields();
    }
});

//Event: remove a task
document.querySelector('#task-list').addEventListener('click', (e) => {

    // delete the task row from the UI
    UI.deleteTask(e.target);

    // show success message
    UI.showAlert('Task removed.', 'warning');

    // get the target task number
    let num = e.target.parentElement.parentElement.querySelector('.task-number').innerHTML;

    // remove the task from local storage
    Store.removeTask(parseInt(num));
});