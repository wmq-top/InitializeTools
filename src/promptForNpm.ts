import fs from 'node:fs'
import path from 'node:path'
import { defaultNpmConfig } from './defaultConfig'
import type { LanguageChoice, NpmUserAns } from './type'
import prompts, { PromptObject } from 'prompts'
import { blue, green, lightGreen, yellow, reset } from 'kolorist'
import { isValidPackageName, isValidVersion, entryCheck, copy, buildPackageJsonFile } from './utils'

const LanguageChoiceList: LanguageChoice[] = [
  // { name: 'js', display: 'JS', color: green },
  { name: 'ts', display: 'TS', color: blue }
]

const licenseChoiceList = [
  { name: 'ISC', display: 'ISC', color: yellow },
  { name: 'MIT', display: 'MIT', color: lightGreen }
]

export const npmPrompt: PromptObject<string>[] = [
  {
    type: 'text',
    name: 'packageName',
    message: reset('Package name: '),
    initial: defaultNpmConfig.packageName,
    validate: (dir: string) => isValidPackageName(dir) || 'Invalid package.json name'
  },
  {
    type: 'text',
    name: 'version',
    message: reset('version: (1.0.0)'),
    initial: defaultNpmConfig.version,
    validate: (input: string) => isValidVersion(input) || 'Invalid init version'
  },
  {
    type: 'select',
    name: 'language',
    message: reset('language: '),
    initial: 0,
    choices: LanguageChoiceList.map((i) => {
      const languageColor = i.color
      return {
        title: languageColor(i.display || i.name),
        value: i
      }
    })
  },
  {
    type: 'text',
    name: 'description',
    message: reset('description: '),
    initial: defaultNpmConfig.description,
    onState: (state: Record<'value', any>) => {
      return state.value || defaultNpmConfig.packageName
    }
  },
  {
    type: 'text',
    name: 'entryPoint',
    message: reset('entryPoint: '),
    initial: defaultNpmConfig.entryPoint,
    validate: (input: string) => entryCheck(input) || 'Invalid init entryPoint'
  },
  {
    type: 'text',
    name: 'testCommand',
    message: reset('testCommand: '),
    initial: defaultNpmConfig.testCommand,
    onState: (state: Record<'value', string>) => {
      return state.value || defaultNpmConfig.testCommand
    }
  },
  {
    type: 'text',
    name: 'gitRegistry',
    message: reset('gitRegistry: '),
    initial: defaultNpmConfig.gitRegistry,
    onState: (state: Record<'value', string>) => {
      return state.value || defaultNpmConfig.gitRegistry
    }
  },
  {
    type: 'text',
    name: 'author',
    message: reset('author: '),
    initial: defaultNpmConfig.author,
    onState: (state: Record<'value', string>) => {
      return state.value || defaultNpmConfig.author
    }
  },
  {
    type: 'select',
    name: 'license',
    message: reset('license: '),
    initial: 0,
    choices: licenseChoiceList.map((i) => {
      const licenseColor = i.color
      return {
        title: licenseColor(i.display || i.name),
        value: i
      }
    })
  },
]

export function InitializeNpmPackage(result: prompts.Answers<NpmUserAns>, cwd: string, rootPath: string) {
  const userConfig: Record<NpmUserAns, string> = {
    ...result,
    language: result.language.display,
    license: result.license.display
  }

  console.log(userConfig)

  const root = path.join(cwd, userConfig.packageName)
  fs.mkdirSync(root, { recursive: true })
  const templateDir = path.resolve(rootPath, '../..', `npm-package-${userConfig.language.toLocaleLowerCase()}`)

  const write = (file: string, content?: string) => {
    const targetPath = path.join(root, file)
    if (content) {
      fs.writeFileSync(targetPath, content)
    } else {
      copy(path.join(templateDir, file), targetPath)
    }
  }

  const files = fs.readdirSync(templateDir)

  for(const file of files.filter((f: string) => f !== 'package.json')) {
    write(file)
  }
  write(userConfig.entryPoint || defaultNpmConfig.entryPoint, `#!/usr/bin/env node\n\nimport './dist/index.js'`)

  const pkg = JSON.parse(fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8'))

  buildPackageJsonFile(pkg, userConfig)

  write('package.json', JSON.stringify(pkg, null, 2))

  console.log(green(`\nDone. Now run: \n`))

  if(root !== cwd) {
    console.log(` cd ${path.relative(cwd, root)}`),
    console.log(` npm install`)
    console.log(` npm run prev`)
  }
  console.log()
}