import {VersionExecutorSchema, type ReleaseProject} from './schema'
import {releaseVersion} from 'nx/release'
import {
  determineBump,
  getFirstRelease,
  getCurrentVersion,
} from '../../lib/version'

export default async function runExecutor(options: VersionExecutorSchema) {
  try {
    const {tag, version} = await getCurrentVersion()

    if (!tag || !version) {
      options.firstRelease = true
      options.specifier = await getFirstRelease()
    } else {
      options.specifier = await determineBump(tag, version)
    }

    const released = await releaseVersion(options)

    const {workspaceVersion, projectsVersionData} = released

    const table: ReleaseProject[] = []

    {
      const name = 'workspace'
      const version = `${workspaceVersion}`

      table.push({name, version})
    }

    for (const [name, {newVersion}] of Object.entries(projectsVersionData)) {
      table.push({name, version: newVersion})
    }

    console.table(table)

    return {success: true}
  } catch (err) {
    throw new Error(`version 😥 ${err}`)
  }
}
