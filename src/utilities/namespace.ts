const NAMESPACE = 'balm';

function toNamespace(taskName: any): string | string[] {
  let result: string | [] = 'unknown';

  if (BalmJS.utils.isString(taskName)) {
    result = `${NAMESPACE}:${taskName}`;
  } else if (BalmJS.utils.isArray(taskName)) {
    result = taskName.map((name: string) => `${NAMESPACE}:${name}`);
  } else {
    BalmJS.logger.error(
      'Task Namespace',
      `The task '${taskName}' must be a string or array`
    );
  }

  return result;
}

export { toNamespace };
