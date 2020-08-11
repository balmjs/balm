describe('Bootstrap', function() {
  describe('#checkTask()', function() {
    describe('before task', function() {
      before(function() {
        balm.beforeTask = 1024;
      });

      it(
        'expected output: "Task must be a string or function"',
        asyncCase(function() {})
      );
    });

    describe('after task', function() {
      before(function() {
        balm.afterTask = 'unknown';
      });

      it(
        'expected output: "Invalid task name"',
        asyncCase(function() {})
      );
    });
  });

  describe('#go()', function() {
    describe('!function', function() {
      before(function() {
        balm.go('gg');
      });

      it('expected output: "initialization error"', asyncCase(function() {}));
    });
  });

  describe('for the dynamic project', function() {
    const target = 'new-dist';
    before(function() {
      balm.config = {
        inFrontend: false,
        roots: {
          target
        }
      };
    });

    it(
      'expected output: "new-dist"',
      asyncCase(function() {
        expect(balm.config.roots.target).to.equal(target);
      })
    );
  });

  describe('for IE8', function() {
    before(function() {
      balm.config = {
        env: {
          isDev: true
        },
        scripts: {
          ie8: true
        }
      };
    });

    it(
      'useHMR = false',
      asyncCase(function() {})
    );
  });
});
