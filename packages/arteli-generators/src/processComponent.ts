import ts from 'typescript'
import { cleanRef } from './utils'

const _ = ts.factory
const SyntaxKind = ts.SyntaxKind

export type ComponentSpecs = {
  required: string[]
  type: string
  properties?: Properties
  additionalProperties: boolean
  enum?: string[]
  oneOf: { title: string; enum: [number] }[]
}

type Properties = {
  [key: string]: Property
}

type Property = {
  type: string
  format?: string
  items?: Property
  nullable?: boolean
  oneOf: Property[]
} & { $ref: string }

type LiteralType = 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object' | 'any' | 'null'

type IdsDict = Record<string, string>

const simpleTypeMapping: Record<LiteralType, ts.SyntaxKind> = {
  string: SyntaxKind.StringKeyword,
  number: SyntaxKind.NumberKeyword,
  integer: SyntaxKind.NumberKeyword,
  boolean: SyntaxKind.BooleanKeyword,
  any: SyntaxKind.UnknownKeyword,
  object: SyntaxKind.ObjectKeyword,
  array: SyntaxKind.ArrayType,
  null: SyntaxKind.NullKeyword
}

const resolveType = (
  propertyName: string,
  { type, items, $ref, format, oneOf }: Property,
  idsDict: IdsDict
): ts.TypeNode => {
  if (type === 'array') return _.createArrayTypeNode(resolveType(propertyName, items!, idsDict))

  if (type === 'string' && format?.startsWith('id-')) {
    if (propertyName === 'id' || !idsDict[format]) {
      return _.createUnionTypeNode([
        _.createTypeReferenceNode(_.createIdentifier('Id'), [_.createLiteralTypeNode(_.createStringLiteral(format))]),
        _.createKeywordTypeNode(SyntaxKind.StringKeyword)
      ])
    }

    const componentName = idsDict[format]

    return _.createIndexedAccessTypeNode(
      _.createTypeReferenceNode(_.createIdentifier(componentName), undefined),
      _.createLiteralTypeNode(_.createStringLiteral('id'))
    )
  }

  if (type === undefined && oneOf?.length) {
    return _.createUnionTypeNode(oneOf.map((property) => resolveType(propertyName, property, idsDict)))
  }

  if ($ref) return _.createTypeReferenceNode(_.createIdentifier(cleanRef($ref)), undefined)

  return _.createKeywordTypeNode(simpleTypeMapping[(type ?? 'any') as LiteralType] as ts.KeywordTypeSyntaxKind)
}

const maybeNullable = (type: ts.TypeNode, isNullable: boolean) =>
  isNullable ? _.createUnionTypeNode([type, _.createLiteralTypeNode(_.createNull())]) : type

export const processComponent = (
  component: string,
  { properties, type, enum: _enum, required, oneOf }: ComponentSpecs,
  idsDict: IdsDict
) => {
  console.log('Generating', type, cleanRef(component), component)

  if (type === 'integer' && oneOf?.length) {
    return [
      _.createEnumDeclaration(
        [_.createToken(SyntaxKind.ExportKeyword)],
        _.createIdentifier(cleanRef(component)),
        oneOf.map(({ title, enum: [value] }) =>
          _.createEnumMember(_.createIdentifier(title), _.createNumericLiteral(value))
        )
      )
    ]
  }

  if (type === 'object')
    return [
      _.createTypeAliasDeclaration(
        [_.createToken(SyntaxKind.ExportKeyword)],
        _.createIdentifier(cleanRef(component)),
        undefined,
        _.createTypeLiteralNode(
          Object.entries(properties!).map(([propertyName, property]) =>
            _.createPropertySignature(
              undefined,
              _.createIdentifier(propertyName),
              required && !required.includes(propertyName) ? _.createToken(SyntaxKind.QuestionToken) : undefined,
              maybeNullable(resolveType(propertyName, property, idsDict), !!property?.nullable)
            )
          )
        )
      )
    ]

  if (type === 'string' && _enum && Boolean(_enum?.length)) {
    return [
      _.createTypeAliasDeclaration(
        [_.createToken(SyntaxKind.ExportKeyword)],
        _.createIdentifier(cleanRef(component)),
        undefined,
        _.createUnionTypeNode(_enum.map((value) => _.createLiteralTypeNode(_.createStringLiteral(value))))
      )
    ]
  }
}
