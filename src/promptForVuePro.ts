import type { ProjectConfig } from './type'

import fs from 'fs'
import path from 'node:path'
import prompts, { PromptObject } from 'prompts'
import { green, reset } from 'kolorist'
import { defaultProjectConfig } from './defaultConfig'
import { isValidPackageName, copy, isValidRegistry, buildProjectJsonFile } from './utils'

export const projectPrompt: PromptObject<string>[] = [
  {
    type: 'text',
    name: 'projectName',
    message: reset('Package name: '),
    initial: defaultProjectConfig.projectName,
    validate: (dir: string) => isValidPackageName(dir) || 'Invalid package.json name'
  },
  {
    type: 'text',
    name: 'gitRegistry',
    message: reset('gitRegistry: '),
    initial: defaultProjectConfig.gitRegistry,
    validate: (dir: string) => isValidRegistry(dir) || 'Invalid gitRegistry'
  },
]

export function InitializeProject(result: prompts.Answers<ProjectConfig>, cwd: string, rootPath: string) {
  const userConfig: Record<ProjectConfig, string> = {
    ...result,
  }

  console.log(userConfig)

  const root = path.join(cwd, userConfig.projectName)
  fs.mkdirSync(root, { recursive: true })
  const templateDir = path.resolve(rootPath, '../..', `vite-vue3`)

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

  const pkg = JSON.parse(fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8'))

  // effect func
  buildProjectJsonFile(pkg, userConfig)

  write('package.json', JSON.stringify(pkg, null, 2))

  console.log(green(`\nDone. Now run: \n`))

  if(root !== cwd) {
    console.log(` cd ${path.relative(cwd, root)}`),
    console.log(` npm i`)
    console.log(` npm run d`)
  }
  console.log()
}