/* eslint @typescript-eslint/no-explicit-any: [0, { "ignoreRestArgs": true }] */
const reTypeOf = /(?:^\[object\s(.*?)\]$)/;

function getType(anyVariable: any): string {
  return Object.prototype.toString
    .call(anyVariable)
    .replace(reTypeOf, '$1')
    .toLowerCase();
}

export default getType;
