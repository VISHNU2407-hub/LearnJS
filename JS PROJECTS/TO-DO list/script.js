const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const totalTasksElement = document.getElementById("totalTasks");
const completedTasksElement = document.getElementById("completedTasks");
const remainingTasksElement = document.getElementById("remainingTasks");

const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

let total = 0;
let completed = 0;
let remaining = 0;

function updateCounters() {

    totalTasksElement.innerText = total;
    completedTasksElement.innerText = completed;
    remainingTasksElement.innerText = remaining;

    progressText.innerText = `${completed} of ${total} tasks completed`;

    let percentage = 0;

    if (total > 0) {
        percentage = (completed / total) * 100;
    }

    progressFill.style.width = `${percentage}%`;
}

function createTask(taskValue) {

    let taskBar = document.createElement("div");
    taskBar.classList.add("task");

    let checkBox = document.createElement("input");
    checkBox.type = "checkbox";

    let taskContent = document.createElement("span");
    taskContent.textContent = taskValue;

    let editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.classList.add("edit-btn");

    let deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.classList.add("delete-btn");

    // Complete Task
    checkBox.addEventListener("change", () => {

        taskContent.classList.toggle("completed");

        if (checkBox.checked) {
            completed++;
        } else {
            completed--;
        }

        remaining = total - completed;
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

        taskContent.innerText = newTask;

    });

    // Delete Task
    deleteBtn.addEventListener("click", () => {

        if (checkBox.checked) {
            completed--;
        }

        total--;
        remaining = total - completed;

        taskBar.remove();

        updateCounters();

    });

    taskBar.append(checkBox);
    taskBar.append(taskContent);
    taskBar.append(editBtn);
    taskBar.append(deleteBtn);

    taskList.append(taskBar);

}

function addTask() {

    const taskValue = taskInput.value.trim();

    if (taskValue.length === 0) {
        alert("Enter a task.");
        return;
    }

    total++;
    remaining = total - completed;

    createTask(taskValue);

    updateCounters();

    taskInput.value = "";
    taskInput.focus();

}

addTaskBtn.addEventListener("click", addTask);

// Add task by pressing Enter
taskInput.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {
        addTask();
    }

});

updateCounters();