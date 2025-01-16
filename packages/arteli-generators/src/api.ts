import type { ComponentSpecs } from './processComponent'
import fs from 'node:fs/promises'
import { ESLint } from 'eslint'
import ts from 'typescript'
import { ID_AST } from './Id.ast'
import { processComponent } from './processComponent'
import { cleanRef, sortKeys, toPascalCase } from './utils'

type AppConfig = {
  swaggerPath: string
  outputPath: string
  ignoreNamespaces?: string[]
}

const apps: Record<string, AppConfig> = {
  core: {
    swaggerPath: 'specs/core.swagger.json',
    outputPath: '../../src/api/types.generated.ts'
  },
  idp: {
    swaggerPath: 'specs/idp.swagger.json',
    outputPath: '../../idp/api/types.generated.ts',
    ignoreNamespaces: ['Tenants.Resources', 'Arteli.Framework']
  }
}

const readSwaggerApi = async (path: string) => {
  return JSON.parse(await fs.readFile(path, 'utf-8'))
}

function toCode(nodes: ts.NodeArray<ts.Node>) {
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })
  const resultFile = ts.createSourceFile('./temp.ts', '', ts.ScriptTarget.Latest, false, ts.ScriptKind.TSX)

  return printer.printList(ts.ListFormat.MultiLine, nodes, resultFile)
}

const IdCode = toCode(ID_AST as unknown as ts.NodeArray<ts.Node>)

const generateApi = async ({ swaggerPath, outputPath, ignoreNamespaces }: AppConfig) => {
  const swagger = await readSwaggerApi(swaggerPath)
  const eslint = new ESLint({ fix: true })

  const allowedSchemas = Object.fromEntries(
    Object.entries(swagger.components.schemas).filter(
      ([component]) => !ignoreNamespaces?.some((namespace) => component.startsWith(namespace))
    )
  ) as Record<string, ComponentSpecs>

  const flagEnums = Object.fromEntries(
    Object.entries(allowedSchemas).flatMap(([componentName, componentSpecs]) =>
      Object.entries(componentSpecs?.properties ?? {})
        .filter(([, property]) => property?.type === 'integer' && property?.format === 'flags-enum')
        .map(([propertyName, property]) => [`${componentName}${toPascalCase(propertyName)}`, property])
    )
  )

  const idsDict = Object.fromEntries(
    Object.entries(allowedSchemas).flatMap(([componentName, componentSpecs]) =>
      Object.entries(componentSpecs?.properties ?? {})
        .filter(
          ([propertyName, property]) =>
            propertyName === 'id' && property?.type === 'string' && property?.format?.startsWith('id-')
        )
        .map(([, property]) => [property.format, cleanRef(componentName)])
    )
  )

  const schemas = sortKeys({ ...flagEnums, ...allowedSchemas })

  const code = Object.entries(schemas)
    .filter(([component]) => !ignoreNamespaces?.some((namespace) => component.startsWith(namespace)))
    .map(([component, spec]) => processComponent(component, spec as ComponentSpecs, idsDict))
    .map((_) => {
      if (_ === undefined) return ''

      return toCode(_ as unknown as ts.NodeArray<ts.Node>)
    })
    .concat(IdCode)
    .join('\n')

  const results = await eslint.lintText(code, { filePath: outputPath })

  if (results.some((result) => result.errorCount > 0)) {
    const [{ messages }] = results

    console.dir(messages, { depth: null })
  }

  await ESLint.outputFixes(results)
}

const main = async () => {
  for (const app in apps) {
    console.log(`\n\nGenerating API for ${app}\n`)
    await generateApi(apps[app])
  }
}

main()
