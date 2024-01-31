export default class WindowEdit {
  constructor(conteiner) {
    this.conteiner = conteiner;
    this.conteinerTasks = null;
    this.formListeners = [];
  }

  bindListeners() {
    // Добавляем обработчики событий для элементов
    const form = this.conteiner.querySelector('.add-form');
    form.addEventListener('submit', (event) => this.onSubmitForm(event));

    this.conteinerTasks = this.conteiner.querySelector('.conteiner-tasks');
  }

  addTask(obj) {
    const content = WindowEdit.addTagHTML(this.conteinerTasks, 'content-task');
    const task = WindowEdit.addTagHTML(content, 'task');
    const status = WindowEdit.addTagHTML(task, 'task-status');
    if (obj.status === 'true') {
      status.classList.add('done');
    }
    const name = WindowEdit.addTagHTML(task, 'task-name');
    name.textContent = obj.name;
    const created = WindowEdit.addTagHTML(task, 'task-created');
    created.textContent = obj.created;
    const blockControll = WindowEdit.addTagHTML(task, 'task-controll');
    const edit = WindowEdit.addTagHTML(blockControll, 'task-edit');
    const cross = WindowEdit.addTagHTML(blockControll, 'task-delete');
    const description = WindowEdit.addTagHTML(content, 'task-description');
    description.textContent = obj.description;
  }

  onSubmitForm(event) {
    // Событие Submit для формы
    event.preventDefault();
    console.log('submit');
    this.formListeners.forEach((o) => o.call(null));
  }

  addFormListeners(callback) {
    // Сохраняет callback отправки формы
    this.formListeners.push(callback);
  }

  static addTagHTML(parent, className = null, type = 'div') {
    // Создает заданный тег и добавляет его в parent
    const div = document.createElement(type);
    div.classList.add(className);
    parent.append(div);
    return div;
  }
}