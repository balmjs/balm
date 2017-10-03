class End extends Task {
  constructor() {
    super('end');
  }
  get fn() {
    return (fn = BalmJS.noop) => {
      fn();
    };
  }
}

export default End;
