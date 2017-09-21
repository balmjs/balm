class End extends BalmJS.Task {
  constructor() {
    super('end');
  }
  get recipe() {
    return true;
  }
  get fn() {
    return (fn = BalmJS.noop) => {
      fn();
    };
  }
}

export default End;
