(()=>{"use strict";class t{constructor(t){this.conteiner=t,this.conteinerTasks=null,this.formListeners=[],this.tasksListeners=[],this.newTaskListeners=[],this.deleteTaskListeners=[],this.editTaskListeners=[],this.popup=null}init(){this.conteiner.querySelector(".add-form").addEventListener("submit",(t=>this.onSubmitForm(t))),this.conteinerTasks=this.conteiner.querySelector(".conteiner-tasks"),this.conteinerTasks.addEventListener("click",(t=>this.onClickTasks(t)))}addTask(e){const s=t.addTagHTML(this.conteinerTasks,"content-task");s.setAttribute("id",e.id);const a=t.addTagHTML(s,"task"),o=t.addTagHTML(a,"task-status");"true"===e.status&&o.classList.add("done");t.addTagHTML(a,"task-name").textContent=e.name;t.addTagHTML(a,"task-created").textContent=e.created;const i=t.addTagHTML(a,"task-controll");t.addTagHTML(i,"task-edit"),t.addTagHTML(i,"task-delete")}static addDescriptionTask(e,s){const a=t.addTagHTML(e,"task-description"),o=t.addTagHTML(a,"task-description-text","pre");o.textContent=s||"Нету данных"}createPopupNewTask(){this.drawPopup().addEventListener("click",(t=>this.onAddNewTasks(t)))}createPopupEditTask(){this.drawPopup().addEventListener("click",(t=>this.onEditTasks(t)))}drawPopup(){this.popup=t.addTagHTML(this.conteiner,"background-popup");const e=t.addTagHTML(this.popup,"popup-window","form");e.setAttribute("novalidate","");t.addTagHTML(e,"popup-title").textContent="Добавить тикет";t.addTagHTML(e,"popup-description").textContent="Краткое описание";const s=t.addTagHTML(e,"popup-description-input","input");s.setAttribute("required",""),s.focus();t.addTagHTML(e,"popup-description-full").textContent="Подробное описание",t.addTagHTML(e,"popup-description-textarea","textarea");const a=t.addTagHTML(e,"popup-buttons"),o=t.addTagHTML(a,"popup-button-cancel","button");o.textContent="Отмена",o.type="Reset";const i=t.addTagHTML(a,"popup-button-ok","button");return i.textContent="Ок",i.type="Submit",o.addEventListener("click",(()=>{this.popup.remove(),this.popup=null})),i}drawPopupDeleteTask(e){this.popup=t.addTagHTML(this.conteiner,"background-popup");const s=t.addTagHTML(this.popup,"popup-window","form");t.addTagHTML(s,"popup-title").textContent="Удалить тикет";t.addTagHTML(s,"popup-description").textContent="Вы уверены, что хотите удалить тикет? Это действие необратимо.";const a=t.addTagHTML(s,"popup-buttons"),o=t.addTagHTML(a,"popup-button-cancel","button");o.textContent="Отмена",o.type="Reset";const i=t.addTagHTML(a,"popup-button-ok","button");i.textContent="Ок",i.type="Submit",o.addEventListener("click",(()=>{this.popup.remove(),this.popup=null})),i.addEventListener("click",(t=>this.onDeleteTasks(t,e)))}onSubmitForm(t){t.preventDefault(),console.log("submit"),this.formListeners.forEach((t=>t.call(null)))}addFormListeners(t){this.formListeners.push(t)}onClickTasks(t){t.preventDefault(),this.tasksListeners.forEach((e=>e.call(null,t)))}addClickTasksListeners(t){this.tasksListeners.push(t)}onAddNewTasks(t){t.preventDefault();t.target.closest(".popup-window").checkValidity()&&this.newTaskListeners.forEach((e=>e.call(null,t)))}addNewTaskListeners(t){this.newTaskListeners.push(t)}onEditTasks(t){t.preventDefault();t.target.closest(".popup-window").checkValidity()&&this.editTaskListeners.forEach((e=>e.call(null,t)))}addEditTaskListeners(t){this.editTaskListeners.push(t)}onDeleteTasks(t,e){t.preventDefault(),this.deleteTaskListeners.forEach((s=>s.call(null,t,e)))}addDeleteTaskListeners(t){this.deleteTaskListeners.push(t)}static addTagHTML(t,e=null,s="div"){const a=document.createElement(s);return a.classList.add(e),t.append(a),a}}class e{constructor(t,e){this.editor=t,this.urlServer=`http://localhost:${e}`,this.buffer=null}init(){this.editor.init(),this.editor.addFormListeners(this.onSubmitForm.bind(this)),this.editor.addClickTasksListeners(this.onClickTasks.bind(this)),this.editor.addNewTaskListeners(this.onAddNewTasks.bind(this)),this.editor.addDeleteTaskListeners(this.onDeleteTasks.bind(this)),this.editor.addEditTaskListeners(this.onEditTasks.bind(this)),this.getTasksFromServer()}static _addZero(t){let e=t;return e<10&&(e=`0${e}`),e}static getNewFormatDate(t){const s=new Date(t),a=String(s.getFullYear()).slice(2),o=e._addZero(s.getMonth());return`${e._addZero(s.getDate())}.${o}.${a} ${e._addZero(s.getHours())}:${e._addZero(s.getMinutes())}`}getTasksFromServer(){const t=new XMLHttpRequest;t.addEventListener("load",this.responseAllTask.bind(this,t)),t.open("GET",`${this.urlServer}?method=allTickets`),t.send()}responseAllTask(t){if(t.status>=200&&t.status<300){const s=JSON.parse(t.responseText);for(const t of s)t.created=e.getNewFormatDate(t.created),this.editor.addTask(t)}}onSubmitForm(){this.editor.createPopupNewTask()}onAddNewTasks(t){const e=t.target.closest(".popup-window");let s=e.querySelector(".popup-description-input").value;s=`name=${s}`;let a=e.querySelector(".popup-description-textarea").value;a=`description=${a}`;const o=`${s}&${a}`,i=new XMLHttpRequest;i.addEventListener("load",this.responseNewTask.bind(this,i)),i.open("POST",`${this.urlServer}?method=createTicket`),i.setRequestHeader("Content-type","application/x-www-form-urlencoded"),i.send(o)}responseNewTask(t){if(t.status>=200&&t.status<300){const s=JSON.parse(t.responseText);s.created=e.getNewFormatDate(s.created),this.editor.addTask(s),this.editor.popup.remove(),this.editor.popup=null}}onClickTasks(t){const e=t.target.classList.value,s=t.target.closest(".content-task"),a=s.querySelector(".task-description"),o=this,i=new XMLHttpRequest,n=s.getAttribute("id");let r=`method=ticketById&id=${n}`;i.onreadystatechange=()=>{if(4===i.readyState&&i.status>=200&&i.status<300){if("Ok"===i.responseText)return;if(a)return void a.remove();const t=JSON.parse(i.responseText);o.editor.constructor.addDescriptionTask(s,t.description)}},e.includes("task-delete")?this.editor.drawPopupDeleteTask(n):e.includes("task-edit")?this.showDescriptionTask(t):(e.includes("task-status")?(t.target.classList.toggle("done"),r=t.target.classList.value.includes("done")?`method=changeStatus&id=${n}&status=true`:`method=changeStatus&id=${n}&status=false`,i.open("PATCH",`${this.urlServer}?${r}`)):i.open("GET",`${this.urlServer}?${r}`),i.send())}showDescriptionTask(t){const e=t.target.closest(".content-task").getAttribute("id"),s=this,a=new XMLHttpRequest,o=`method=ticketById&id=${e}`;a.onreadystatechange=()=>{if(4===a.readyState&&a.status>=200&&a.status<300){s.buffer=JSON.parse(a.responseText),s.editor.createPopupEditTask();s.editor.popup.querySelector(".popup-description-input").value=s.buffer.name;s.editor.popup.querySelector(".popup-description-textarea").value=s.buffer.description}},a.open("GET",`${this.urlServer}?${o}`),a.send()}onEditTasks(t){const s=new XMLHttpRequest,a=`method=editTask&id=${this.buffer.id}`,o=t.target.closest(".popup-window");let i=o.querySelector(".popup-description-input").value;i=`name=${i}`;let n=o.querySelector(".popup-description-textarea").value;n=`description=${n}`;const r=`${i}&${n}&${`status=${this.buffer.status}`}`;s.addEventListener("load",(()=>{if(s.status>=200&&s.status<300){const t=JSON.parse(s.responseText);this.editor.popup.remove(),this.editor.popup=null;Array.from(this.editor.conteinerTasks.children).forEach((t=>{t.remove()}));for(const s of t)s.created=e.getNewFormatDate(s.created),this.editor.addTask(s)}})),s.open("PUT",`${this.urlServer}?${a}`),s.setRequestHeader("Content-type","application/x-www-form-urlencoded"),s.send(r)}onDeleteTasks(t,e){const s=document.getElementById(e),a=this,o=new XMLHttpRequest,i=`method=deleteTicket&id=${e}`;o.onreadystatechange=()=>{4===o.readyState&&o.status>=200&&o.status<300&&(console.log("На сервере данные удалены"),s.remove(),a.editor.popup.remove(),a.editor.popup=null,console.log(JSON.parse(o.responseText)))},o.open("DELETE",`${this.urlServer}?${i}`),o.send()}}const s=document.querySelector(".conteiner"),a=new t(s);new e(a,9e3).init()})();