const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const { mapDBSongToModel } = require("../../utils/song");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = `song-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO songs VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id",
      values: [id, title, year, genre, performer, duration, albumId],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Lagu gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getSongs(titl, perf) {
    let query = {};
    if (titl != null && perf == null) {
      query = {
        text: "SELECT id,title,performer FROM songs WHERE lower(title) like $1",
        values: [`%${titl.toLowerCase()}%`],
      };
    } else if (titl == null && perf != null) {
      query = {
        text: "SELECT id,title,performer FROM songs WHERE lower(performer) like $1",
        values: [`%${perf.toLowerCase()}%`],
      };
    } else if (titl != null && perf != null) {
      query = {
        text: "SELECT id,title,performer FROM songs WHERE lower(title) like $1 AND lower(performer) like $2",
        values: [`%${titl.toLowerCase()}%`, `%${perf.toLowerCase()}%`],
      };
    } else {
      query = {
        text: "SELECT id,title,performer FROM songs",
      };
    }

    const result = await this._pool.query(query);
    return result.rows.map(mapDBSongToModel);
  }

  async getSongById(id) {
    const query = {
      text: "SELECT * FROM songs WHERE id=$1",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Lagu tidak ditemukan");
    }

    return result.rows.map(mapDBSongToModel)[0];
  }

  async getSongByAlbumId(id) {
    const query = {
      text: "SELECT id,title,performer FROM songs WHERE albumId=$1",
      values: [id],
    };
    const result = await this._pool.query(query);
    return result.rows.map(mapDBSongToModel);
  }

  async editSongById(id, { title, year, genre, performer, duration, albumId }) {
    const query = {
      text: "UPDATE songs SET title=$1, year=$2, genre=$3, performer=$4, duration=$5, albumId=$6 WHERE id=$7 RETURNING id",
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui lagu, Id tidak ditemukan");
    }

    return result.rows.map(mapDBSongToModel);
  }

  async deleteSongById(id) {
    const query = {
      text: "DELETE FROM songs WHERE id=$1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Gagal menghapus lagu, Id tidak ditemukan");
    }
  }
}

module.exports = SongsService;
