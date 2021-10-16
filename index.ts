import express from 'express'
import path from 'path'
import fs from 'fs'

/* eslint-disable-next-line */
import ejs from 'ejs'

import config from './config/config'

const app = express()
const port = config.port

app.set('components', path.join(__dirname, 'components'))
app.set('view engine', 'ejs')
app.use(express.static('dist'))

const file = (file: string) => {
  return path.join(__dirname, './', file)
}

app.listen(port, () => {
  console.log(`L'application tourne sur le port: ${port}.`)
})


interface TemplateOptions {
  component: string | null
  path: string | null
  root: string,
  url: string
}

app.get('*', (req, res) => {
  const find = '/components/'
  const { url } = req

  const options: TemplateOptions = { component: null, path: null, root: `http://localhost:${port}`, url }

  if (url.startsWith(find)) {
    const [, comp] = url.split(find)

    /** Devient ./components/xxx.ejs */
    const component = `.${find + comp}.ejs`

    const comp_exists = fs.existsSync(file(component))

    if (comp_exists) {
      options.component = component
    }

    console.log(options.root)

    options.path = component
  }


  res.render(file('index'), options)
})