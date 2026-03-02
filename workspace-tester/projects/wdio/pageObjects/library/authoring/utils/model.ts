export enum UnitType {
    TEXT = 'TEXT',
    RICHTEXT = 'RICHTEXT',
    HTML = 'HTML',
    IMAGE = 'IMAGE',
    SHAPE = 'SHAPE',
}

export enum ExpressionType {
    AE = 'AE',
    AQ = 'AQ',
}

export enum FunctionName {
    IN_LIST = 'IN_LIST',
    NOT_IN_LIST = 'NOT_IN_LIST',
}

export type UnitInfo = {
    type: UnitType,
    nodeKey: string,
}

export type DossierInfo = {
    projectId: string,
    dossierId: string,
    dossierName?: string,
    pageKey?: string,
    filterKey?: string,
}