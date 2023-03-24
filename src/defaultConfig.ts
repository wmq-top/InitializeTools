import type { NpmUserAns, ViteConfig, ProjectConfig } from './type'

export const defaultNpmConfig:Record<NpmUserAns, string> = {
  packageName: 'npm-package-init',
  version: '1.0.0',
  language: 'TS',
  description: '',
  entryPoint: 'index.js',
  testCommand: 'test',
  gitRegistry: '',
  author: '',
  license: ''
}

export const defaultViteConfig: Record<ViteConfig, string> = {
  packageName: 'code-statistic-plugin',
  gitRegistry: ''
}

export const defaultProjectConfig: Record<ProjectConfig, string> = {
  projectName: 'vite-vue3',
  gitRegistry: ''
}