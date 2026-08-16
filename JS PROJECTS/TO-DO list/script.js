const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const totalTasksElement = document.getElementById("totalTasks");
const completedTasksElement = document.getElementById("completedTasks");
const remainingTasksElement = document.getElementById("remainingTasks");

const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

// ---- State: every task is an object { text, completed } ----
let tasks = loadTasks();

function loadTasks() {
    try {
        const saved = localStorage.getItem("tasks");
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateCounters() {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const remaining = total - completed;

    totalTasksElement.innerText = total;
    completedTasksElement.innerText = completed;
    remainingTasksElement.innerText = remaining;

    progressText.innerText = `${completed} of ${total} tasks completed`;

    const percentage = total > 0 ? (completed / total) * 100 : 0;
    progressFill.style.width = `${percentage}%`;
}

function createTaskElement(task) {
    const taskBar = document.createElement("div");
    taskBar.classList.add("task");

    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.checked = task.completed;

    const taskContent = document.createElement("span");
    taskContent.textContent = task.text;
    if (task.completed) {
        taskContent.classList.add("completed");
    }

    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.classList.add("edit-btn");

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.classList.add("delete-btn");

    // Complete Task
    checkBox.addEventListener("change", () => {
        task.completed = checkBox.checked;
        taskContent.classList.toggle("completed");
        saveTasks();
        updateCounters();
    });

    // Edit Task
    editBtn.addEventListener("click", () => {
        let newTask = prompt("Edit Task", taskContent.innerText);
        if (newTask === null) {
            return;
        }
        newTask = newTask.trim();
        if (newTask.length === 0) {
            alert("Task cannot be empty.");
            return;
        }
        task.text = newTask;
        taskContent.innerText = newTask;
        saveTasks();
    });

    // Delete Task
    deleteBtn.addEventListener("click", () => {
        tasks = tasks.filter((t) => t !== task);
        taskBar.remove();
        saveTasks();
        updateCounters();
    });

    taskBar.append(checkBox);
    taskBar.append(taskContent);
    taskBar.append(editBtn);
    taskBar.append(deleteBtn);

    return taskBar;
}

function addTask() {
    const taskValue = taskInput.value.trim();

    if (taskValue.length === 0) {
        alert("Enter a task.");
        return;
    }

    tasks.push({ text: taskValue, completed: false });
    taskList.append(createTaskElement(tasks[tasks.length - 1]));

    saveTasks();
    updateCounters();

    taskInput.value = "";
    taskInput.focus();
}

function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task) => {
        taskList.append(createTaskElement(task));
    });
    updateCounters();
}

addTaskBtn.addEventListener("click", addTask);

// Add task by pressing Enter
taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        addTask();
    }
});

renderTasks();
