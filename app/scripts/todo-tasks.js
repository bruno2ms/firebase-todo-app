var TodoApp = window.TodoApp;

TodoApp.prototype.todoTasksInit = function () {
  this.loadTodoTasks();

  var $container = document.getElementById('todo-tasks');
  this.container = $container;
  this.tasks = $container.querySelector('.tasks');
  this.emptyList = $container.querySelector('.empty');

  this.newItemBtn = $container.querySelector('.new-item');
  this.newItemForm = $container.querySelector('.new-item-form');
  this.newItemInput = $container.querySelector('.new-item-input');

  this.newItemForm.addEventListener('submit', this.saveTodoTask.bind(this));

  this.auth.onAuthStateChanged(this.loadTodoTasks.bind(this));
};

TodoApp.prototype.cleanList = function () {
  if (this.tasks) {
    var lis = this.tasks.querySelectorAll('li'),
      len = lis.length - 1;
    for (; len >= 0; len--) {
      lis[len].parentNode.removeChild(lis[len]);
    }
  }
};

TodoApp.prototype.loadTodoTasks = function () {
  this.cleanList();
  if (this.auth.currentUser) {
    var currentUser = this.auth.currentUser;

    this.ref.todoTasks = this.loadReference('todo-tasks/' + currentUser.uid);

    this.ref.todoTasks.on('child_added', this.displayTodoTask.bind(this));
    this.ref.todoTasks.on('child_changed', this.displayTodoTask.bind(this));
    this.ref.todoTasks.on('value', this.displayTodoTaskList.bind(this));
  }
};

TodoApp.prototype.displayTodoTaskList = function (data) {
  if (Object.keys(data.val()).length) {
    this.tasks.removeAttribute('hidden');
    this.newItemForm.removeAttribute('hidden');
    this.emptyList.setAttribute('hidden', 'true');
  } else {
    this.tasks.setAttribute('hidden', 'true');
    this.newItemForm.setAttribute('hidden', 'true');
    this.emptyList.removeAttribute('hidden');
  }
};

TodoApp.prototype.displayTodoTask = function (data) {
  var value = data.val(),
      li = document.createElement('li');

  li.setAttribute('id', data.key);
  li.innerHTML = `<label><input type="checkbox" name="${data.key}" ${data.complete ? 'checked="checked"' : ''}> ${value.text} ${data.complete}</label>`;
  li.querySelector('input').addEventListener('change', this.updateTask.bind(this));
  this.tasks.appendChild(li);
};

TodoApp.prototype.updateTask = function (e) {
  e.preventDefault();

  var target = e.target,
    task = target.name;

  TodoApp.ref.todoTasks.child(task).update({complete: target.value});
};

TodoApp.prototype.saveTodoTask = function (e) {
  e.preventDefault();

  if (this.newItemInput.value && this.checkSign()) {
    this.ref.todoTasks.push({
      text: this.newItemInput.value
    }).then(function(response) {
      this.newItemInput.value = '';
    }.bind(this)).catch(function(error) {
      console.error('Error', error);
    });
  }
};
