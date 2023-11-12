const SongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'songs',
  verion: '1.0.0',
  register: async (server, { service }) => {
    const songsHandler = new SongsHandler(service);
    server.route(routes(songsHandler));
  },
};
