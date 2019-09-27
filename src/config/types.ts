// Scripts
interface ObjectEntry {
  [entryChunkName: string]: string | string[];
}

// Publish
interface TemplateOption {
  input: string;
  output: string;
  options: object;
}

export { ObjectEntry, TemplateOption };
