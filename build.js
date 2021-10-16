const fs = require('fs')
const promises = fs.promises

const config = require('./config/config')

const beautify_html = require('js-beautify').html

const ejs = require('ejs')
const recursive = require("recursive-readdir")

const destination = './dist/components'

/**
 * @returns {Promise.<string[]>}
 */
const get_all_files = (path) => {
  return new Promise((resolve, reject) => {
    recursive(path || destination, (err, files) => {
      if (err) return reject(err)
      
      resolve(files)
    })
  })
}

/**
 * Créé le dossier dist et dist/components
 */
const create_dir = async () => {
  await promises.mkdir('dist')
  return promises.mkdir(destination)
}

/**
 * Supprimme le dossier dist
 */
const remove_dir = () => promises.rmdir('dist', { recursive: true })

/**
 * Récupère le HTML depuis ejs, non beautify
 */
const get_html = (path) => ejs.renderFile(path, { rmWhitespace: true })

/**
 * Écrit le fichier spécifié avec le contenu donné
 * 
 * @param {String} file - Chemin vers le fichier
 * @param {String} content - Contenu du fichier
 */
const write_file = (file, content) => promises.writeFile(file, content)

/**
 * Génère tout le contenu HTML de chaque composant
 * @returns {Array.<{ path: string, content: string }>} Tableau d'objets contenant le chemin d'écriture + le contenu
 */
const render_files = async () => {
  const test = await get_all_files('./components')

  /** On n'inclus que les composants eux mêmes et pas leurs parties */
  const comps = test.filter(name => !name.includes('/parts/'))

  const files = []

  for await (const file of comps) {
    const [path] = file.split('.')
    const newName = `./dist/${path}.html`

    const text = await get_html(file)
    const content = text.trim()

    const final_html = beautify_html(content, config.html)

    files.push({ path: newName, content: final_html })
  }

  return files
}

/**
 * Va écrire tous les fichiers .html à générer
 * @param {Array.<{ path: string, content: string }>} files - Tableau d'objets contenant le chemin d'écriture + le contenu
 */
const write_files = async (files) => {
  if (process.env.NODE_ENV === 'production') {
    for await (const file of files) {
      const { path, content } = file

      await write_file(path, content)
    }

    return 'done'
  }

  return 'No need to write'
}

/**
 * Removes the dist folder, gets the content, writes the files, done.
 */
module.exports = () => {
  return remove_dir()
    .then(() => create_dir())
    .then(() => render_files())
    .then((files) => write_files(files))
    .then(() => 'done')
}