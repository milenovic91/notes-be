import DBService from './DBService';

class NotesService extends DBService {
  async getAll(username, page = 0, limit = 20) {
    let [notes,] = await this.executeQuery(`select * from notes where user='${username}' limit ${limit} offset ${page * limit}`);
    let [count,] = await this.executeQuery(`select count(*) as cnt from notes`);
    return {
      entries: notes,
      totalPages: Math.ceil(count[0].cnt / limit)
    };
  }

  async getById(username, id) {
    let [note,] = await this.executeQuery(`select * from notes where id = ${id} and user = '${username}'`);
    return note.length > 0 ? note[0] : null;
  }

  async create(username, {text}) {
    let [okPacket,] = await this.executeQuery(`insert into notes (text, completed, user) values ('${text}', ${0}, ''${username}'')`);
    return this.getById(okPacket.insertId);
  }

  async update(username, {id, text, completed}) {
    let payload = {};
    if (typeof id === 'undefined') {
      throw new Error('id is required');
    }
    if (typeof text !== 'undefined') {
      payload.text = text;
    }
    if (typeof completed !== 'undefined') {
      payload.completed = Number(!!completed); // maps values to 0 or 1
    }
    let keys = Object.keys(payload);
    if (keys.length > 0) {
      let values = keys.map(key => {
        let value = payload[key];
        return typeof value === 'string' ?
          `${key}='${value}'` :
          `${key}=${value}`;
      }).join(',');
      await this.executeQuery(`update notes set ${values} where id = ${id} and user = '${username}'`);
      return this.getById(id);
    }
  }

  async delete(username, id) {
    await this.executeQuery(`delete from notes where id = ${id} and user = '${username}'`);
  }
}

export default new NotesService();
