// Reference `replace-ext@2.0.0`
import path from 'path';

function startsWithSingleDot(fpath: string): boolean {
  const first2chars = fpath.slice(0, 2);
  return first2chars === '.' + path.sep || first2chars === './';
}

function replaceExt(npath: string, ext: string): string {
  if (typeof npath !== 'string') {
    return npath;
  }

  if (npath.length === 0) {
    return npath;
  }

  const nFileName = path.basename(npath, path.extname(npath)) + ext;
  const nFilepath = path.join(path.dirname(npath), nFileName);

  // Because `path.join` removes the head './' from the given path.
  // This removal can cause a problem when passing the result to `require` or
  // `import`.
  if (startsWithSingleDot(npath)) {
    return '.' + path.sep + nFilepath;
  }

  return nFilepath;
}

export default replaceExt;
