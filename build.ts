import fs from 'fs'
import config from './config/config'
import beautify from 'js-beautify'
import ejs from 'ejs'
import recursive from 'recursive-readdir'
import chalk from 'chalk'

const promises = fs.promises
const beautify_html = beautify.html

const destination = './dist/components'

const get_all_files = (path: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    recursive(path || destination, (err, files) => {
      if (err) {
        return reject(err)
      }

      resolve(files)
    })
  })
}

/**
 * Supprimme le dossier dist
 * On retourne toujours une promise
 */
const remove_dir = async () => {
  const exists = fs.existsSync('dist/components')

  if (exists) {
    return promises.rm('dist/components', { recursive: true })
  }
}

/**
 * Récupère le HTML depuis ejs, non beautify
 */
const get_html = (path: string) => ejs.renderFile(path, { rmWhitespace: true })

/**
 * Écrit le fichier spécifié avec le contenu donné
 *
 * @param {String} file - Chemin vers le fichier
 * @param {String} content - Contenu du fichier
 */
const write_file = (file: string, content: string) => promises.writeFile(file, content)

/**
 * Génère tout le contenu HTML de chaque composant + créé tous le dossiers nécéssaires
 *
 * @returns {Array.<{ path: string, content: string }>} Tableau d'objets contenant le chemin d'écriture du fichier + le contenu
 */
const process_files = async () => {
  const test = await get_all_files('./components')

  /** On n'inclus que les composants eux mêmes et pas leurs parties */
  const comps = test
    .filter(name => !name.includes('/parts/'))
    .map(component => {
      /**
       * On récupère le dossier dans lequel on écrira le fichier
       */
      const [parent_directory] = component.split('.ejs')
      const path = parent_directory.split('/').slice(0, -1).join('/')

      return { component, path }
    })

  const files = []

  for await (const { component: file, path: folder } of comps) {
    /**
     * On tente la création du dossier contenant le fichier
     */
    try {
      await promises.mkdir(`./dist/${folder}`, { recursive: true })
    } catch (error) {
      console.log(chalk.yellow(error))
    }

    const [path] = file.split('.')
    const newName = `./dist/${path}.html`

    const text = await get_html(file)
    const content = text.trim()

    const final_html = beautify_html(content, config.html)

    files.push({ path: newName, content: final_html })
  }

  return files
}

type Files = { path: string, content: string }[]

/**
 * Va écrire tous les fichiers .html à générer
 * @param files - Tableau d'objets contenant le chemin d'écriture + le contenu
 */
const write_files = async (files: Files) => {
  for await (const file of files) {
    const { path, content } = file

    await write_file(path, content)
  }

  return 'done'
}

/**
 * Removes the dist folder, gets the content, writes the files, done.
 */
const build = () => {
  return remove_dir()
    .then(() => process_files())
    .then((files: Files) => write_files(files))
    .then(() => 'done')
    .catch(() => console.log(chalk.red.bold('Une erreur de build est survenue')))
}

build()

export default build
