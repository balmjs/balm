// No sample yet
const observe = (data, callback) => {
  return new Proxy(data, {
    get(target, key) {
      return Reflect.get(target, key);
    },
    set(target, key, value, proxy) {
      callback(key, value);
      target[key] = value;
      return Reflect.set(target, key, value, proxy);
    }
  });
};

const FooBar = { open: false };
const FooBarObserver = observe(FooBar, (property, value) => {
  property === 'open' && value
    ? console.log('FooBar is open!!!')
    : console.log('keep waiting');
});
console.log(FooBarObserver.open); // false
FooBarObserver.open = true; // FooBar is open!!!
