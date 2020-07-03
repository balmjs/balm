const reTypeOf = /(?:^\[object\s(.*?)\]$)/;

function getType(obj: unknown): string {
  return Object.prototype.toString
    .call(obj)
    .replace(reTypeOf, '$1')
    .toLowerCase();
}

export default getType;
