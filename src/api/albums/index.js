const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  verion: '1.0.2',
  register: async (server, { albumService, songService, validator }) => {
    const albumsHandler = new AlbumsHandler(albumService, songService, validator);
    server.route(routes(albumsHandler));
  },
};
