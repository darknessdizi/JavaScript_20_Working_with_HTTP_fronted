export default class WindowController {
  constructor(editor, port) {
    this.editor = editor;
    this.urlServer = `http://localhost:${port}`;
  }

  init() {
    this.editor.init();
    this.editor.addFormListeners(this.onSubmitForm.bind(this));
    this.editor.addClickTasksListeners(this.onClickTasks.bind(this));
    this.editor.addNewTaskListeners(this.onAddNewTasks.bind(this));
    this.editor.addDeleteTaskListeners(this.onDeleteTasks.bind(this));
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
    // получение всех задач с сервера
    const self = this;
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() { // событие изменение статуса запроса
      if (xhr.readyState !== 4) return; 
      if (xhr.status >= 200 && xhr.status < 300) { // получен ответ
        const data = JSON.parse(xhr.responseText);
        for (const obj of data) {
          obj.created = self.getNewFormatDate(obj.created);
          self.editor.addTask(obj);
        }
      }
    };

    const method = 'method=allTickets';

    xhr.open('GET', `${this.urlServer}?${method}`);
    xhr.send();
  }

  onSubmitForm() {
    // Callback - нажали кнопку добавить тикет
    this.editor.drawPopupNewTask();
  }

  onAddNewTasks(event) {
    // Callback - нажали ОК в popup добавления новой задачи
    const popup = event.target.closest('.popup-window');
    let name = popup.querySelector('.popup-description-input').value;
    name = `name=${name}`;
    let description = popup.querySelector('.popup-description-textarea').value;
    description = `description=${description}`;
    const body = `${name}&${description}`

    const self = this;
    const xhr = new XMLHttpRequest();
    const method = 'method=createTicket';

    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return; 
      if (xhr.status >= 200 && xhr.status < 300) { // получен ответ
        const obj = JSON.parse(xhr.responseText);
        obj.created = self.getNewFormatDate(obj.created);
        self.editor.addTask(obj);
        self.editor.popup.remove();
        self.editor.popup = null;
      }
    };

    xhr.open('POST', `${this.urlServer}?${method}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(body);
  }

  onClickTasks(event) {
    // Callback - нажали поле задачи
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
      // parent.remove();
      // method = `method=deleteTicket&id=${id}`;
    }

    if (nameClass.includes('task-edit')) {
      // Открыть окно редактирования
      console.log('Открыть окно редактирования');
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

  onDeleteTasks(event, id) {
    console.log('target', id);
    const parent = document.getElementById(id);
    console.log('parent', parent);
    parent.remove();
    this.editor.popup.remove();
    this.editor.popup = null;
    // method = `method=deleteTicket&id=${id}`;
  }
}
