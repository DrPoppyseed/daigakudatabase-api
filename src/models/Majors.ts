export type Major = {
  uuid: string
  opeid: string
  opeid6: string
  name_en: string
  name_jp: string
  url: string
  majors: MajorItem[]
  programsPerCredLev: ProgramsPerCredLev
}

export type MajorItem = {
  majorCIP: string
  majorTitle: string
  majorDesc: string
  majorTitleJap: string
  majorDescJap: string
  programsPerCredLevInDept: ProgramsPerCredLev
  programs: MajorsProgram[]
}

export type ProgramsPerCredLev = {
  1: number
  2: number
  3: number
  4: number
  5: number
  6: number
  7: number
  8: number
}

export type MajorsProgram = {
  code: string
  codeFull: string
  credLev: string
  credDesc: string
  credDescJap: string
  graduates: string
  medianIncome1: string
  medianIncome2: string
  nameJap: string
  descJap: string
}
