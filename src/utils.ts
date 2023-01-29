import fs from 'node:fs'
import path from 'node:path'
import type { NpmUserAns, ViteConfig } from './type'

function isValidVersion(input: string | undefined): boolean {
  if (!input) return true
  const rgx = /^[1-9][0-9]*\.[0-9]+\.[0-9]+$/
  return rgx.test(input)
}

function isValidPackageName(projectName: string): boolean {
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
    projectName,
  )
}

function entryCheck(input: string): boolean {
  if (!input) return true
  const rgx = /^[a-zA-Z][a-zA-Z\-_0-9]+\.js$/
  return rgx.test(input)
}

function copy(src: string, dest: string): void {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    copyDir(src, dest)
  } else {
    fs.copyFileSync(src, dest)
  }
}

function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true })
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    const destFile = path.resolve(destDir, file)
    copy(srcFile, destFile)
  }
}

function buildPackageJsonFile(pkg: any, userConfig: Record<NpmUserAns, string>) {
  pkg.name = userConfig.packageName
  pkg.version = userConfig.version
  pkg.main = userConfig.entryPoint
  pkg.description = userConfig.description
  const binCommand = `create-${userConfig.packageName}`
  pkg.bin = { [binCommand]: userConfig.entryPoint }
  pkg.repository.url = userConfig.gitRegistry
  pkg.author = userConfig.author
  pkg.license = userConfig.license
  pkg.scripts.pr = `npm run build && node ${userConfig.entryPoint}`
}

function buildViteJsonFile(pkg: any, userConfig: Record<ViteConfig, string>) {
  pkg.name = userConfig.packageName
  pkg.repository.url = userConfig.gitRegistry
}

export { isValidVersion, isValidPackageName, entryCheck, copy, copyDir, buildPackageJsonFile, buildViteJsonFile }