import {VersionExecutorSchema} from './schema'
import {releaseVersion} from 'nx/release'
import {
  determineBump,
  getFirstRelease,
  getCurrentVersion,
  showReleasedTable,
  getReleasedProjects,
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

    const {workspace, projects} = getReleasedProjects(released)

    showReleasedTable(projects, workspace)

    return {success: projects.length}
  } catch (err) {
    throw new Error(`version 😥 ${err}`)
  }
}
