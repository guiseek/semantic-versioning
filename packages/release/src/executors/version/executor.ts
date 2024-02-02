import { releaseVersion } from 'nx/release';
import { VersionExecutorSchema } from './schema';

export default async function runExecutor(options: VersionExecutorSchema) {
  try {
    await releaseVersion(options);

    return { success: true };
  } catch (err) {
    throw new Error(`Version Error: ${err}`);
  }
}
