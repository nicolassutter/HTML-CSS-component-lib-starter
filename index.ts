import express from 'express'
import path from 'path'
import fs from 'fs'
import ejs from 'ejs'

const app = express()
const port = 4001

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
  styles: string | null
}

app.get('*', (req, res) => {
  const find = '/components/'

  const options: TemplateOptions = { component: null, path: null, styles: null }

  if (req.url.startsWith(find)) {
    const [, comp] = req.url.split(find)

    /** Devient ./components/xxx.ejs */
    const component = `.${find + comp}.ejs`

   /** Devient ./dist/css/components/xxx.css */
    const styles = `./dist/css${find + comp}.css`
    
    const comp_exists = fs.existsSync(file(component))
    const styles_exist = fs.existsSync(file(styles))
    
    if (comp_exists && styles_exist) {
      options.component = component
      options.styles = styles
    }

    options.path = component
  }


  res.render(file('index'), options)
})