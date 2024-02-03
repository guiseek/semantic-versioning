export interface ReleaseProject {
  name: string
  version: string
}

export interface ReleaseProjectResult {
  workspace: string | null
  projects: ReleaseProject[]
}
