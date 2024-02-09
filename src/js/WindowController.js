export default class WindowController {
  constructor(editor, port) {
    this.editor = editor;
    this.urlServer = `http://localhost:${port}`;
    this.buffer = null;
    // this.request = new XMLHttpRequest();
  }

  init() {
    this.editor.init();
    this.editor.addFormListeners(this.onSubmitForm.bind(this));
    this.editor.addClickTasksListeners(this.onClickTasks.bind(this));
    this.editor.addNewTaskListeners(this.onAddNewTasks.bind(this));
    this.editor.addDeleteTaskListeners(this.onDeleteTasks.bind(this));
    this.editor.addEditTaskListeners(this.onEditTasks.bind(this));
    this.getTasksFromServer();
  }

  _addZero(number) {
    // делает число двухзначным
    let result = number;
    if (result < 10) {
      result = `0${result}`;
    }
    return result;
  }

  getNewFormatDate(timestamp) {
    // возвращает новый формат даты и времени
    let start = new Date(timestamp);
    const year = String(start.getFullYear()).slice(2);
    const month = this._addZero(start.getMonth());
    const date = this._addZero(start.getDate());
    const hours = this._addZero(start.getHours());
    const minutes = this._addZero(start.getMinutes());
    const time = `${date}.${month}.${year} ${hours}:${minutes}`
    return time;
  }

  getTasksFromServer() {
    // запрос на получение всех задач с сервера
    const xhr = new XMLHttpRequest();
    const method = 'method=allTickets';

    xhr.addEventListener('load', this.responseAllTask.bind(this, xhr));

    xhr.open('GET', `${this.urlServer}?${method}`);
    xhr.send();
  }

  responseAllTask(xhr) {
    // Обработка ответа от сервера при получении всех задач 
    if (xhr.status >= 200 && xhr.status < 300) { // получен ответ
      const data = JSON.parse(xhr.responseText);
      for (const obj of data) {
        obj.created = this.getNewFormatDate(obj.created);
        this.editor.addTask(obj);
      }
    }
  }

  onSubmitForm() {
    // Callback - нажали кнопку добавить тикет
    const btn = this.editor.createPopupNewTask();
  }

  onAddNewTasks(event) {
    // Callback - нажали "ОК" в popup добавления новой задачи
    // Запрос на добавление новой задачи
    const popup = event.target.closest('.popup-window');
    let name = popup.querySelector('.popup-description-input').value;
    name = `name=${name}`;
    let description = popup.querySelector('.popup-description-textarea').value;
    description = `description=${description}`;
    const body = `${name}&${description}`

    const xhr = new XMLHttpRequest();
    const method = 'method=createTicket';

    xhr.addEventListener('load', this.responseNewTask.bind(this, xhr));

    xhr.open('POST', `${this.urlServer}?${method}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(body);
  }

  responseNewTask(xhr) {
    // Обработка ответа от сервера при добавлении новой задачи 
    if (xhr.status >= 200 && xhr.status < 300) { // получен ответ
      const obj = JSON.parse(xhr.responseText);
      obj.created = this.getNewFormatDate(obj.created);
      this.editor.addTask(obj);
      this.editor.popup.remove();
      this.editor.popup = null;
    }
  }

  onClickTasks(event) {
    // Callback - нажали на поле задачи
    const nameClass = event.target.classList.value;
    const parent = event.target.closest('.content-task');
    const description = parent.querySelector('.task-description');
    const self = this;
    const xhr = new XMLHttpRequest();
    const id = parent.getAttribute('id');
    let method = `method=ticketById&id=${id}`;

    if (nameClass.includes('task-status')) {
      // изменить статус задачи
      event.target.classList.toggle('done');
      if (event.target.classList.value.includes('done')) {
        method = `method=changeStatus&id=${id}&status=true`;
      } else {
        method = `method=changeStatus&id=${id}&status=false`;
      }
    }

    if (nameClass.includes('task-delete')) {
      // Удалить задачу
      this.editor.drawPopupDeleteTask(id);
      return;
    }

    if (nameClass.includes('task-edit')) {
      // Открыть окно редактирования
      console.log('Открыть окно редактирования');
      this.showValueTask(event);
      return;
    }

    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return; 
      if (xhr.status >= 200 && xhr.status < 300) { // получен ответ
        if (xhr.responseText === 'Ok') return;
        if (description) {
          description.remove(); // удаляет описание задачи
          // description.classList.toggle('hidden'); // скрывает описание задачи
          return;
        }
        const obj = JSON.parse(xhr.responseText);
        self.editor.addDescriptionTask(parent, obj.description);
      }
    };

    xhr.open('GET', `${this.urlServer}?${method}`);
    xhr.send();
  }

  showValueTask(event) {
    console.log('Показать задачу', event.target);
    const parent = event.target.closest('.content-task');
    const id = parent.getAttribute('id');
    const self = this;
    const xhr = new XMLHttpRequest();
    const method = `method=ticketById&id=${id}`;

    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return; 
      if (xhr.status >= 200 && xhr.status < 300) { // получен ответ
        self.buffer = JSON.parse(xhr.responseText);
        console.log('Показать obj', self.buffer);
        self.editor.createPopupEditTask();
        const name = self.editor.popup.querySelector('.popup-description-input');
        name.value = self.buffer.name;
        const description = self.editor.popup.querySelector('.popup-description-textarea');
        description.value = self.buffer.description;
      }
    };

    xhr.open('GET', `${this.urlServer}?${method}`);
    xhr.send();
  }

  onEditTasks(event) {
    // Callback - нажали кнопку "ОК" в окне редактирования задачи
    console.log('Редактируем задачу', this.buffer)
    const xhr = new XMLHttpRequest();
    const method = `method=editTask&id=${this.buffer.id}`;

    const popup = event.target.closest('.popup-window');
    let name = popup.querySelector('.popup-description-input').value;
    name = `name=${name}`;
    let description = popup.querySelector('.popup-description-textarea').value;
    description = `description=${description}`;
    const status = `status=${this.buffer.status}`;
    const body = `${name}&${description}&${status}`

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) { // получен ответ
        const data = JSON.parse(xhr.responseText);
        this.editor.popup.remove();
        this.editor.popup = null;
        const array = Array.from(this.editor.conteinerTasks.children);
        array.forEach((item) => {
          item.remove();
        });
        for (const obj of data) {
          obj.created = this.getNewFormatDate(obj.created);
          this.editor.addTask(obj);
        }
      }
    });

    xhr.open('POST', `${this.urlServer}?${method}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(body);
  }

  onDeleteTasks(event, id) {
    // Callback - нажали кнопку "ОК" в окне удаления задачи
    const parent = document.getElementById(id);
    const self = this;
    const xhr = new XMLHttpRequest();
    let method = `method=deleteTicket&id=${id}`;

    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return; 
      if (xhr.status >= 200 && xhr.status < 300) { // получен ответ
        console.log('На сервере данные удалены');
        parent.remove();
        self.editor.popup.remove();
        self.editor.popup = null;
        console.log(JSON.parse(xhr.responseText));
      }
    };

    xhr.open('GET', `${this.urlServer}?${method}`);
    xhr.send();
  }
}
