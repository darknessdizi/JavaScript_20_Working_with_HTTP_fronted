const subscribeWidget = document.querySelector('.subscribe');
const subscribeForm = subscribeWidget.querySelector('.subscribe-form');
const nameInput = subscribeWidget.querySelector('.name');
const phoneInput = subscribeWidget.querySelector('.phone');
const unsubscribeBtn = subscribeWidget.querySelector('.unsubscribe-btn');
console.log('****2', subscribeWidget)

subscribeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('Событие submit');

  const body = Array.from(subscribeForm.elements)
    .filter(({ name }) => name) // отфильтровываем поля где есть имя
    .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`) // делаем пару ключ значение
    // encodeURIComponent производит URL кодирование символов отличных от латиницы
    .join('&'); // склеиваем пары с помощью амперсантов

  const xhr = new XMLHttpRequest(); // Создали класс XMLHttpRequest (для запросов)

  // событие надо подключать до xhr.send()
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

  // xhr.open('GET', 'http://localhost:9000'); // создаем запрос GET на наш сервер
  // xhr.send(); // отправка запроса

  xhr.open('POST', 'http://localhost:9000'); // создаем запрос POST на наш сервер

  // Необходимо объявить как будут закодированы данные при передаче 
  // (чтобы на выходе получить объект в теле, а не строку)
  // Самый простой способ кодировать данные:
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); // для POST запроса

  xhr.send(body); // отправка запроса с телом запроса
});

unsubscribeBtn.addEventListener('click', (e) => { // Нажали кнопку отменить
  e.preventDefault();

  const body = Array.from(subscribeForm.elements)
    .filter(({ name }) => name)
    .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
    .join('&');

  // Второй способ кодировать данные при отправке формы через FormData
  // const body = new FormData(subscribeForm); 

  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if (xhr.readyState !== 4) return;
  };

  // сервер не парсит тело запроса при методе delete 
  // (поэтому тело добавляем в URL)
  xhr.open('DELETE', 'http://localhost:9000?' + body); 
  // Будет два запроса (один из них type preflight метод OPTIONS - браузер спрашивает у сервера
  // разрешен ли метод DELETE)

  // Самый простой способ кодировать данные:
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  // При использовании кодирования FormData, устанавливать заголовок не нужно !!!
  // На сервере при FormData надо добавить пункт multipart: true при обработке тела запроса

  xhr.send(body); // При DELETE нет смысла отправлять тело, оно будет пустым 
  // xhr.send(); // При DELETE нет смысла отправлять тело, оно будет пустым 
});



const uploadForm = document.querySelector('.upload-form');
console.log('****1', uploadForm)
// const previewImage = document.querySelector('.preview-image');
const previewImage = document.createElement('img');
previewImage.style.width = '300px';

uploadForm.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('Отправка файла');

  const body = new FormData(uploadForm); // кодируем данные

  const xhr = new XMLHttpRequest();
  
  xhr.onreadystatechange = function() {
    if (xhr.readyState !== 4) return;
    
    console.log('Ответ с файлом', xhr.responseText);
    uploadForm.append(previewImage);
    previewImage.src = 'http://localhost:9000' + xhr.responseText;
  }
  
  xhr.open('POST', 'http://localhost:9000/upload');
  // Потребуется пакет uuid для генерации URL ID для наших файлов
  // Так как два разных пользователя могут загрузить 
  // два разных файла с одинаковым именем
  
  xhr.send(body);
});
