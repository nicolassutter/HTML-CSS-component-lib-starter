const _fs = require('fs-extra')
const fs = require('fs')
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

const create_dir = () => {
  return new Promise((resolve, reject) => {
    fs.mkdir('dist', (err) => {
      if (err){
        reject(err)
      }
  
      resolve('created')
    })
  })
}

const get_html = (path) => {
  return ejs.renderFile(path)
}

const get_all_files = () => {
  return new Promise((resolve, reject) => {
    recursive('./dist/components', (err, files) => {
      if (err) reject(err)
  
      resolve(files)
    })
  })
}

const write_file = (file, content) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, content, (err) => {
      if (err) reject(err)
      
      resolve()
    })
  })
}

const delete_file = (path) => {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (err) => {
      if (err) reject(err)
      
      resolve()
    })
  })
}

const render_files = async () => {
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

/**
 * Removes the dist folder, creates it again, then copies the files
 */
module.exports = () => {
  return new Promise((resolve, reject) => {
    fs.rmdir('dist', { recursive: true } , (err) => {
      create_dir()
        .then(() => copy())
        .then(() => render_files())
        .then(() => resolve('done'))
    })
  })
}