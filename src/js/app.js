const formAddTasks = document.querySelector('.add-form');

formAddTasks.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('submit');

  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() { // событие изменение статуса запроса
    console.log(xhr.readyState) // readyState определяет состояние запроса 
      // 0 - объект создан, метод open() еще не вызывался
      // 1 - метод open() был вызван
      // 2 - метод send() был вызван, доступны заголовки и статус
      // 3 - загрузка responseText содержит частичные данные
      // 4 - операция полностью завершена
    if (xhr.readyState !== 4) return;
    console.log('ответ на запрос', xhr.responseText); // ответ на запрос 
    // (не забыть про CORS, на сервере установить заголовки)
  };

  xhr.open('GET', 'http://localhost:9000'); // создаем запрос GET на наш сервер
  xhr.send(); // отправка запроса
});