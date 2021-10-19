import bs from 'browser-sync'
import config from './config/config'

const sync = bs.create()

sync.init({
  proxy: `http://localhost:${config.port}`,
  files: [
    '*.ejs',
    './dist/output.css',
    './dist/output.js'
  ]
})
