export type NpmUserAns = 'packageName' | 'language' | 'version' | 'description' | 'entryPoint' | 'testCommand' | 'gitRegistry' | 'author' | 'license'

export type ProjectType = 'npmPackage' | 'vsCodePlugin' | 'vitePlugin'

export type ColorFunc = (str: string | number) => string

export type LanguageChoice = {
  name: 'js' | 'ts'
  display: 'JS' | 'TS'
  color: ColorFunc
}

export type ViteConfig = 'packageName' | 'gitRegistry'