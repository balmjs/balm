// Reference `cli-spinners`
const spinner =
  process.platform === 'win32'
    ? {
        interval: 130,
        frames: ['-', '\\', '|', '/']
      }
    : {
        interval: 80,
        frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
      };

export default spinner;
