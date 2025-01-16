import ts from 'typescript'

const _ = ts.factory
const SyntaxKind = ts.SyntaxKind

export const ID_AST = [
  _.createTypeAliasDeclaration(
    [_.createToken(SyntaxKind.ExportKeyword)],
    _.createIdentifier('Id'),
    [
      _.createTypeParameterDeclaration(
        undefined,
        _.createIdentifier('T'),
        _.createKeywordTypeNode(SyntaxKind.StringKeyword),
        undefined
      )
    ],
    _.createIntersectionTypeNode([
      _.createKeywordTypeNode(SyntaxKind.StringKeyword),
      _.createTypeLiteralNode([
        _.createPropertySignature(
          [_.createToken(SyntaxKind.ReadonlyKeyword)],
          _.createIdentifier('__brand'),
          undefined,
          _.createTypeReferenceNode(_.createIdentifier('T'), undefined)
        )
      ])
    ])
  )
]
