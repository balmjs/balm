const hello = () => import('./main-hello');

(async () => {
  const { greet } = (await hello()).default;

  console.info('[Async]', 'before');

  greet();

  console.info('[Async]', 'after');

  ['c', 'd', 'e', 'f', 'g', 'a', 'b'].forEach((item) => {
    console.log(`Loading ${item}`);
    import(`./async/${item}`);
  });
})();
