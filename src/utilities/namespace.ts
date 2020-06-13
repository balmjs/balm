const NAMESPACE = 'balm';

function toNamespace(taskName: string | string[]): string | string[] {
  let result: string | string[] = 'unknown';

  if (BalmJS.utils.isString(taskName)) {
    result = `${NAMESPACE}:${taskName}`;
  } else if (BalmJS.utils.isArray(taskName)) {
    result = (taskName as string[]).map(
      (name: string) => `${NAMESPACE}:${name}`
    );
  } else {
    BalmJS.logger.error(
      'task namespace',
      `The task '${taskName}' must be a string or array`
    );
  }

  return result;
}

export default toNamespace;
