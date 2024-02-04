import WindowEdit from './WindowEdit';
import WindowController from './WindowController';

const conteiner = document.querySelector('.conteiner');
const port = 9000;

const edit = new WindowEdit(conteiner);
const controller = new WindowController(edit, port);
controller.init();
