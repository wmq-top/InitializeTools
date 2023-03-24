import { fileURLToPath } from "node:url"
import prompts from "prompts"
import type { NpmUserAns, ProjectConfig } from './type'
import { npmPrompt, InitializeNpmPackage } from './promptForNpm'
import { projectPrompt, InitializeProject } from './promptForVuePro'
import { red, lightGreen, blue, lightRed, yellow, reset } from 'kolorist'
import { exit } from "node:process"

const cwd = process.cwd()

const projectTypeList = [
  { name: 'npmPackage', display: 'npmPackage', color: lightRed },
  { name: 'vsCodePlugin', display: 'vsCodePlugin', color: blue },
  { name: 'vitePlugin', display: 'vitePlugin', color: lightGreen },
  { name: 'vue3Vite', display: 'vue3Vite', color: yellow }
]

async function init() {
  let projectTypeChoice: prompts.Answers<'projectType'>

  try {
    projectTypeChoice = await prompts([{
      'type': 'select',
      name: 'projectType',
      message: reset('please select the project type you want to create'),
      initial: 0,
      choices: projectTypeList.map((item) => {
        const projectTypeColor = item.color
        return {
          title: projectTypeColor(item.display || item.name),
          value: item
        }
      })
    }])
  } catch (cancelled: any) {
    console.log(cancelled.message)
    return
  }

  const projectType = projectTypeChoice.projectType.name

  if (projectType === 'npmPackage') {
    let result: prompts.Answers<NpmUserAns>
    try {
      result = await prompts(npmPrompt, {
        onCancel: () => { throw new Error(red('OP cancel')) }
      })
    } catch (cancelled: any) {
      console.log(cancelled.message)
      return
    }
    InitializeNpmPackage(result, cwd, fileURLToPath(import.meta.url))
  } else if (projectType === 'vsCodePlugin') {
    console.log(red('developing···'))
    exit(1)
  } else if (projectType === 'vitePlugin') {
    console.log(red('developing···'))
    exit(1)
  } else if (projectType === 'vue3Vite') {
    let result: prompts.Answers<ProjectConfig>
    try {
      result = await prompts(projectPrompt, {
        onCancel: () => { throw new Error(red('OP cancel')) }
      })
    } catch (cancelled: any) {
      console.log(cancelled.message)
      return
    }
    InitializeProject(result, cwd, fileURLToPath(import.meta.url))
  }
}

init().catch((e: Error) => {
  console.log(e)
})