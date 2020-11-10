const materials = ['Hydrogen', 'Helium', 'Lithium', 'Beryllium'];

console.log(materials.map(material => material.length));
// expected output: Array [8, 6, 7, 9]

// Lexical this
var bob = {
  _name: 'Bob',
  _friends: [],
  printFriends() {
    this._friends.forEach(f => console.log(this._name + ' knows ' + f));
  }
};

bob.printFriends();

console.log('---');
