import server from './src/server';
import env from './src/config/env.config';

server.listen(env.PORT, () => console.log(`Server listening on port ${env.PORT}`));
