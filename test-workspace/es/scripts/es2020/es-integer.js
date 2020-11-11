const previouslyMaxSafeInteger = 9007199254740991n;

const alsoHuge = BigInt(9007199254740991);
// ↪ 9007199254740991n

const hugeString = BigInt('9007199254740991');
// ↪ 9007199254740991n

const hugeHex = BigInt('0x1fffffffffffff');
// ↪ 9007199254740991n

const hugeBin = BigInt(
  '0b11111111111111111111111111111111111111111111111111111'
);
// ↪ 9007199254740991n

console.log('---');
