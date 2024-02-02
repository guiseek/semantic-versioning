import {resolveSemverSpecifierFromConventionalCommits} from 'nx/src/command-line/release/utils/resolve-semver-specifier'
import {
  getFirstGitCommit,
  getLatestGitTagForPattern,
} from 'nx/src/command-line/release/utils/git'
import {createProjectGraphAsync} from 'nx/src/devkit-exports'
import {type ReleaseType, inc} from 'semver'
import {type InterpolateData} from './types'

export async function resolveSemverSpecifierFrom(from: string) {
  const graph = await createProjectGraphAsync()
  const projects = Object.keys(graph.nodes)
  return resolveSemverSpecifierFromConventionalCommits(
    from,
    graph,
    projects
  ) as Promise<ReleaseType>
}

export async function getFirstRelease() {
  const commit = await getFirstGitCommit()
  return await resolveSemverSpecifierFrom(commit)
}

export async function getCurrentVersion(
  pattern = '{version}',
  data: InterpolateData = {}
) {
  const latestTag = await getLatestGitTagForPattern(pattern, data)
  const version = latestTag?.extractedVersion
  const tag = latestTag?.tag
  return {version, tag}
}

export async function determineBump(tag: string, version?: string) {
  if (!tag || !version) return
  const releaseType = await resolveSemverSpecifierFrom(tag)
  return bump(version, releaseType)
}

export function bump(version: string, type: ReleaseType, loose = false) {
  return inc(version, type, {loose}) as string | undefined
}
