let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let theme = localStorage.getItem("theme") || "light";
let currentStatusFilter = "all";

document.addEventListener("DOMContentLoaded", () => {
  if (theme === "dark") document.body.classList.add("dark");
  renderTasks();
  requestNotificationPermission();
});

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const dueDateInput = document.getElementById("dueDateInput");
  const categoryInput = document.getElementById("categoryInput");

  if (!taskInput.value.trim()) return;

  tasks.push({
    text: taskInput.value,
    dueDate: dueDateInput.value || null,
    category: categoryInput.value,
    completed: false,
  });

  updateLocalStorage();
  renderTasks(currentStatusFilter);

  taskInput.value = "";
  dueDateInput.value = "";
  categoryInput.value = "";
}

function renderTasks(statusFilter = "all") {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  const now = new Date().toISOString().split("T")[0];
  const categoryFilter = document.getElementById("categoryFilter").value;

  tasks.forEach((task, index) => {
    if (statusFilter === "active" && task.completed) return;
    if (statusFilter === "completed" && !task.completed) return;
    if (categoryFilter && task.category !== categoryFilter) return;

    const li = document.createElement("li");
    li.textContent = task.text;

    if (task.category) {
      const span = document.createElement("span");
      span.className = "category-tag";
      span.textContent = task.category;
      li.appendChild(span);
    }

    if (task.dueDate) li.textContent += ` (Due: ${task.dueDate})`;

    li.classList.toggle("completed", task.completed);
    li.classList.toggle("overdue", task.dueDate && !task.completed && task.dueDate < now);

    li.onclick = () => toggleTask(index);
    li.ondblclick = () => editTask(index);
    list.appendChild(li);
  });
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  updateLocalStorage();
  renderTasks(currentStatusFilter);
}

function editTask(index) {
  const newText = prompt("Edit task:", tasks[index].text);
  if (newText !== null) {
    tasks[index].text = newText;
    updateLocalStorage();
    renderTasks(currentStatusFilter);
  }
}

function clearAllTasks() {
  if (confirm("Clear all tasks?")) {
    tasks = [];
    updateLocalStorage();
    renderTasks(currentStatusFilter);
  }
}

function filterTasks(type) {
  currentStatusFilter = type;
  renderTasks(type);
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
  theme = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", theme);
}

function updateLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }
}
