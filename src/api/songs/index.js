const SongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'songs',
  verion: '1.0.2',
  register: async (server, { service, validator }) => {
    const songsHandler = new SongsHandler(service, validator);
    server.route(routes(songsHandler));
  },
};
