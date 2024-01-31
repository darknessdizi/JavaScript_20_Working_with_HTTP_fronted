export default class WindowController {
  // static cache = null;

  constructor(editor) {
    this.editor = editor;
  }

  init() {
    this.editor.init();
    this.editor.addFormListeners(this.onSubmitForm.bind(this));
    this.editor.addClickTasksListeners(this.onClickTasks.bind(this))
    this.getTasksFromServer();
  }

  getTasksFromServer() {
    const self = this;
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() { // событие изменение статуса запроса
      console.log(xhr.readyState) // readyState определяет состояние запроса 
        // 0 - объект создан, метод open() еще не вызывался
        // 1 - метод open() был вызван
        // 2 - метод send() был вызван, доступны заголовки и статус
        // 3 - загрузка responseText содержит частичные данные
        // 4 - операция полностью завершена
      if (xhr.readyState !== 4) return; 
      if (xhr.status >= 200 && xhr.status < 300) { // получен ответ
        const data = JSON.parse(xhr.responseText);
        for (const obj of data.tasks) {
          console.log('obj', obj);
          self.editor.addTask(obj);
        }
      }
    };

    xhr.open('GET', 'http://localhost:9090'); // создаем запрос GET на наш сервер
    xhr.send(); // отправка запроса
  }

  onSubmitForm() {
    // Callback - нажали кнопку добавить тикет
    console.log('Нажали кнопку');
  }

  onClickTasks(event) {
    // Callback - нажали поле задачи
    const nameClass = event.target.classList.value;
    const parent = event.target.closest('.content-task');
    if (nameClass.includes('task-status')) {
      event.target.classList.toggle('done');
      // далее менять статус на сервере
      return;
    }

    if (nameClass.includes('task-delete')) {
      // Удалить задачу
      console.log('Удалить задачу', parent);
      parent.remove();
      // Далее удалить задачу на сервере
      return;
    }


    if (nameClass.includes('task-edit')) {
      // Открыть окно редактирования
      console.log('Открыть окно редактирования');
      return;
    }

    const description = parent.querySelector('.task-description');
    description.classList.toggle('hidden');
    if (description.textContent === '') {
      description.textContent = 'Нет данных';
    }
  }
}