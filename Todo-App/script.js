// Variables
let todoItems = [];
const todoInput = document.querySelector(".todo-input");
const completedTodosDiv = document.querySelector(".completed-todos");
const uncompletedTodosDiv = document.querySelector(".uncompleted-todos");
const audio = new Audio("sound.mp3");

// Get todo list on first boot
window.addEventListener("load", () => {
  let storageTodoItems = localStorage.getItem("todoItems");
  if (storageTodoItems !== null) {
    todoItems = JSON.parse(storageTodoItems);
  }

  render();
});

// Get the content typed into the input
todoInput.addEventListener("keyup", (e) => {
  let value = e.target.value.replace(/^\s+/, "");
  if (value && e.keyCode === 13) {
    // Enter
    addTodo(value);

    todoInput.value = "";
    todoInput.focus();
  }
});

// Add todo
function addTodo(text) {
  todoItems.push({
    id: Date.now(),
    text,
    completed: false,
  });

  saveAndRender();
}

// Remove todo
function removeTodo(id) {
  todoItems = todoItems.filter((todo) => todo.id !== Number(id));
  saveAndRender();
}

// Mark as completed
function markAsCompleted(id) {
  todoItems = todoItems.filter((todo) => {
    if (todo.id === Number(id)) {
      todo.completed = true;
    }

    return todo;
  });

  audio.play();

  saveAndRender();
}

// Mark as uncompleted
function markAsUncompleted(id) {
  todoItems = todoItems.filter((todo) => {
    if (todo.id === Number(id)) {
      todo.completed = false;
    }

    return todo;
  });
}

// Save in localstorage
function save() {
  localStorage.setItem("todoItems", JSON.stringify(todoItems));
}

// Render
function render() {
  let uncompletedTodos = todoItems.filter((item) => !item.completed);
  let completedTodos = todoItems.filter((item) => item.completed);

  completedTodosDiv.innerHTML = "";
  uncompletedTodosDiv.innerHTML = "";

  if (uncompletedTodos.length > 0) {
    uncompletedTodos.forEach((todo) => {
      uncompletedTodosDiv.append(createTodoElement(todo));
    });
  } else {
    uncompletedTodosDiv.innerHTML = `<div class="empty">No uncompleted mission</div>`;
  }

  if (completedTodos.length > 0) {
    completedTodosDiv.innerHTML = `<div class="completed-title">Completed (${completedTodos.length} / ${todoItems.length})`;

    completedTodos.forEach((todo) => {
      completedTodosDiv.append(createTodoElement(todo));
    });
  }
}

// Save and render
function saveAndRender() {
  save();
  render();
}

// Create todo list item
function createTodoElement(todo) {
  // Create todo list container
  const todoDiv = document.createElement("div");
  todoDiv.setAttribute("data-id", todo.id);
  todoDiv.className = "todo-item";

  // Create todo item text
  const todoTextSpan = document.createElement("span");
  todoTextSpan.innerHTML = todo.text;

  // Checkbox for list
  const todoInputCheckbox = document.createElement("input");
  todoInputCheckbox.type = "checkbox";
  todoInputCheckbox.checked = todo.completed;
  todoInputCheckbox.addEventListener("click", (e) => {
    let id = e.target.closest(".todo-item").dataset.id;
    e.target.checked ? markAsCompleted(id) : markAsUncompleted(id);
  });

  // Delete button for list
  const todoRemoveBtn = document.createElement("a");
  todoRemoveBtn.href = "#";
  todoRemoveBtn.innerHTML = `<svg
  xmlns="http://www.w3.org/2000/svg"
  class="icon icon-tabler icon-tabler-x"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  stroke-width="2"
  stroke="currentColor"
  fill="none"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
  <path d="M18 6l-12 12"></path>
  <path d="M6 6l12 12"></path></svg
>`;

  todoRemoveBtn.onclick = (e) => {
    let id = e.target.closest(".todo-item").dataset.id;
    removeTodo(id);
  };

  todoTextSpan.prepend(todoInputCheckbox);
  todoDiv.appendChild(todoTextSpan);
  todoDiv.appendChild(todoRemoveBtn);

  return todoDiv;
}
