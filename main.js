window.addEventListener('load', () => {
    const form = document.querySelector("#new-task-form");
    const input = document.querySelector("#new-task-input");
    const list_element = document.querySelector("#tasks");

    loadTasks();

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const task = input.value;

        if (!task) {
            alert("Please fill out the task");
            return;
        }

        const task_element = createTaskElement(task);
        list_element.appendChild(task_element);

        saveTask(task);

        input.value = "";
    });

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const task_element = createTaskElement(task);
            list_element.appendChild(task_element);
        });
    }

    function saveTask(task) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function updateTask(oldTask, newTask) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.map(task => (task === oldTask ? newTask : task)); 
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function removeTask(task) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(t => t !== task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function createTaskElement(task) {
        const task_element = document.createElement("div");
        task_element.classList.add("task");

        const task_content_element = document.createElement("div");
        task_content_element.classList.add("content");

        task_element.appendChild(task_content_element);

        const task_input_element = document.createElement("input");
        task_input_element.type = "text";
        task_input_element.classList.add("text");
        task_input_element.value = task;
        task_input_element.setAttribute("readonly", "readonly");

        task_content_element.appendChild(task_input_element);

        const task_actions_element = document.createElement("div");
        task_actions_element.classList.add("actions");

        const task_edit_element = document.createElement("button");
        task_edit_element.classList.add("edit");
        task_edit_element.innerHTML = "Edit";

        const task_delete_element = document.createElement("button");
        task_delete_element.classList.add("delete");
        task_delete_element.innerHTML = "Delete";

        task_actions_element.appendChild(task_edit_element);
        task_actions_element.appendChild(task_delete_element);

        task_element.appendChild(task_actions_element);

        task_edit_element.addEventListener('click', () => {
            if(task_edit_element.innerText.toLowerCase() == "edit") {
                task_input_element.removeAttribute("readonly");
                task_input_element.focus();
                task_input_element.setAttribute("data-old-task", task_input_element.value); 
                task_edit_element.innerText = "Save";
            } else {
                const newTask = task_input_element.value;
                const oldTask = task_input_element.getAttribute("data-old-task"); 
                task_input_element.setAttribute("readonly", "readonly");
                task_edit_element.innerText = "Edit";
                updateTask(oldTask, newTask); 
            }
        });
        

        task_delete_element.addEventListener('click', () => {
            list_element.removeChild(task_element);
            removeTask(task);
        });

        return task_element;
    }
});
