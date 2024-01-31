class Ticket {

  static countId = 0;

  constructor(name, status) {
    Ticket.countId += 1;
    this.id = Ticket.countId; // идентификатор (уникальный в пределах системы)
    this.name = name; // краткое описание
    this.status = status; // boolean - сделано или нет
    this.created = Date.now(); // дата создания (timestamp)
  }
}

module.exports = {
  Ticket
};
