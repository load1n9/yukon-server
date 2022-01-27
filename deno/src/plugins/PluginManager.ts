import * as fs from "https://deno.land/std@0.122.0/fs/mod.ts"
import * as path from "https://deno.land/std@0.122.0/path/mod.ts";;

const __dirname = new URL('.', import.meta.url).pathname;

export class PluginManager {
    public plugins: any = {};
    public events: any = {};
    public dir= `${__dirname}/plugins`
    constructor(handler: any) {
        this.loadPlugins(handler)
    }

    loadPlugins(handler: any) {
        fs.readdirSync(this.dir).forEach((plugin: any) => {
            let pluginImport;
            eval(`import pluginImport from '${path.join(this.dir, plugin)}'`)
            let pluginObject = new pluginImport(handler)

            this.plugins[plugin.toLowerCase()] = pluginObject

            this.loadEvents(pluginObject)
        })
    }

    loadEvents(plugin: any) {
        for (let event in plugin.events) {
            this.events[event] = plugin.events[event].bind(plugin)
        }
    }

    getEvent(event: any, args: any, user: any) {
        try {
            this.events[event](args, user)
        } catch(error) {
            console.error(`[PluginManager] Event (${event}) not handled: ${error}`)
        }
    }

}
