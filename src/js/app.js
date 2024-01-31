import WindowEdit from './WindowEdit';
import WindowController from './WindowController';

const conteiner = document.querySelector('.conteiner');

const edit = new WindowEdit(conteiner);
const controller = new WindowController(edit);
controller.init();
