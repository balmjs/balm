const hello = () => import('./main-hello');

(async () => {
  const { greet } = (await hello()).default;

  console.info('[Async]', 'before');

  greet();

  ['c', 'd', 'e', 'f', 'g', 'a', 'b'].forEach(async (item) => {
    console.log(`Loading ${item}`);
    await import(`./async/${item}`);
  });

  console.info('[Async]', 'after');
})();
