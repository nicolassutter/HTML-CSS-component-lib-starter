const _fs = require('fs-extra')
const fs = require('fs')
const promises = fs.promises

const ejs = require('ejs')
const recursive = require("recursive-readdir")

const source = 'components'
const destination = 'dist/components'
 
const copy = () => {
  return new Promise((resolve, reject) => {
    /**
     * Copies the files if in production
     */
    if (process.env.NODE_ENV === 'production') {
      _fs.copy(source, destination, (err) => {
        if (err){
            console.log('An error occured while copying the folder.')
            reject(err)
        }
    
        resolve('Copy completed!')
      })
    } else {
      resolve('Copy not needed')
    }
  })
}

/**
 * @returns {Promise.<string[]>}
 */
const get_all_files = () => {
  return new Promise((resolve, reject) => {
    recursive('./dist/components', (err, files) => {
      if (err) return reject(err)
      
      resolve(files)
    })
  })
}

const create_dir = () => promises.mkdir('dist')
const remove_dir = () => promises.rmdir('dist', { recursive: true })
const get_html = (path) => ejs.renderFile(path)
const write_file = (file, content) => promises.writeFile(file, content)
const delete_file = (path) => promises.unlink(path)

const render_files = async () => {
  if (process.env.NODE_ENV === 'production') {
    const files = await get_all_files()
    const history = []

    for await (const file of files) {
      const [path] = file.split('.')
      const newName = path + '.html'

      const render = await get_html(file)
      await write_file(newName, render)
      await delete_file(file)
      history.push(file)
    }

    return history
  }

  return 'No need to render'
}

/**
 * Removes the dist folder, creates it again, then copies the files
 */
module.exports = () => {
  return remove_dir()
    .then(() => create_dir())
    .then(() => copy())
    .then(() => render_files())
    .then(() => 'done')
}