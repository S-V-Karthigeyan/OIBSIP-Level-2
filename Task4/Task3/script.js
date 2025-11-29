let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;

const newTaskInput = document.getElementById("new-task-input");
const addTaskButton = document.getElementById("add-task-button");
const pendingList = document.getElementById("pending-tasks-list");
const completedList = document.getElementById("completed-tasks-list");

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function formatDateTime(date) {
  return new Date(date).toLocaleString();
}

function createTask(text) {
  return {
    id: nextId++,
    text,
    status: "pending",
    createdAt: new Date(),
    completedAt: null
  };
}

function renderTasks() {
  pendingList.innerHTML = "";
  completedList.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    if (task.status === "completed") li.classList.add("completed");

    const mainDiv = document.createElement("div");
    mainDiv.className = "task-main";

    const titleSpan = document.createElement("span");
    titleSpan.className = "task-title";
    titleSpan.textContent = task.text;

    const metaSpan = document.createElement("span");
    metaSpan.className = "task-meta";
    let metaText = "Created: " + formatDateTime(task.createdAt);
    if (task.completedAt) metaText += " • Completed: " + formatDateTime(task.completedAt);
    metaSpan.textContent = metaText;

    mainDiv.appendChild(titleSpan);
    mainDiv.appendChild(metaSpan);

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "task-actions";

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = task.status === "pending" ? "Complete" : "Pending";
    toggleBtn.addEventListener("click", () => toggleTaskStatus(task.id));

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => editTask(task.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    actionsDiv.appendChild(toggleBtn);
    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);

    li.appendChild(mainDiv);
    li.appendChild(actionsDiv);

    if (task.status === "pending") pendingList.appendChild(li);
    else completedList.appendChild(li);
  });

  saveTasks(); 
}

function addTask() {
  const text = newTaskInput.value.trim();
  if (!text) return;
  const task = createTask(text);
  tasks.push(task);
  newTaskInput.value = "";
  renderTasks();
}

function toggleTaskStatus(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  if (task.status === "pending") {
    task.status = "completed";
    task.completedAt = new Date();
  } else {
    task.status = "pending";
    task.completedAt = null;
  }
  renderTasks();
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  const newText = prompt("Edit task:", task.text);
  if (newText === null) return;

  const trimmed = newText.trim();
  if (!trimmed) return;

  task.text = trimmed;
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
}

addTaskButton.addEventListener("click", addTask);
newTaskInput.addEventListener("keyup", event => {
  if (event.key === "Enter") addTask();
});

renderTasks();
