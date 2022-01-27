import { Database } from './database/Database.ts';
import { DataHandler } from './handlers/DataHandler.ts';
import { LoginHandler } from './handlers/LoginHandler.ts';
import { Server } from './server/Server.ts';

import config from '../config/config.json'


class World extends Server {

    constructor(id: string) {
        const users = {}
        const db = new Database(config.database)

        let handler = (id == 'Login') ? LoginHandler : DataHandler
        handler = new handler(id, users, db, config)
        super(id, users, db, handler, config);
    }

}

const args = process.argv.slice(2)

for (let world of args) {
    if (world in config.worlds) {
        new World(world);
    }
}
