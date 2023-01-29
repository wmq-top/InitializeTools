import type { NpmUserAns, ViteConfig } from './type'

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