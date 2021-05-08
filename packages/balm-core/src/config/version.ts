const balmCorePkg: {
  version: string;
} = JSON.parse(
  node.fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8')
);

export default balmCorePkg.version;
