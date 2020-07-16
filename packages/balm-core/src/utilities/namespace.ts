const NAMESPACE = 'balm';

function toNamespace(taskName: string | string[]): string | string[] {
  let result: string | string[] = 'unknown';

  if (BalmJS.utils.isArray(taskName)) {
    result = (taskName as string[]).map(
      (name: string) => `${NAMESPACE}:${name}`
    );
  } else {
    result = `${NAMESPACE}:${taskName as string}`;
  }

  return result;
}

export default toNamespace;
