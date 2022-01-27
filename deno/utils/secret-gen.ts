import * as fs from "https://deno.land/std@0.122.0/fs/mod.ts"
import * as path from "https://deno.land/std@0.122.0/path/mod.ts";;
import crypto from 'https://deno.land/std@0.122.0/node/crypto.ts';

const __dirname = new URL('.', import.meta.url).pathname;

import config from `${path.resolve(__dirname, '../config/config.json')}`;


try {
    let secret = crypto.randomBytes(32).toString('hex')
    config.crypto.secret = secret

    fs.writeFileSync(file, JSON.stringify(config, null, 4) + '\n')
    console.log('Secret updated')

} catch (err) {
    console.error(err)
}
