import pc from 'picocolors';

export enum LogLevel {
  Debug = 0,
  Info = 1,
  Warn = 2,
  Error = 3,
  Silent = 4
}

class Logger {
  level: LogLevel = LogLevel.Info;

  private formatTag(tag?: string): string {
    return tag ? pc.cyan(`[${tag}]`) : pc.bgBlue(pc.black(' BalmJS '));
  }

  private timestamp(): string {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return pc.gray(`[${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}]`);
  }

  debug(tag: string, message: any, ...args: any[]): void {
    if (this.level <= LogLevel.Debug) {
      console.log(this.timestamp(), this.formatTag(tag), pc.magenta('※'), message, ...args);
    }
  }

  info(tag: string, message: any, ...args: any[]): void {
    if (this.level <= LogLevel.Info) {
      console.log(this.timestamp(), this.formatTag(tag), pc.blue('ℹ'), message, ...args);
    }
  }

  success(tag: string, message: any, ...args: any[]): void {
    if (this.level <= LogLevel.Info) {
      console.log(this.timestamp(), this.formatTag(tag), pc.green('✔'), pc.green(message), ...args);
    }
  }

  warn(tag: string, message: any, ...args: any[]): void {
    if (this.level <= LogLevel.Warn) {
      console.warn(this.timestamp(), this.formatTag(tag), pc.yellow('⚠'), pc.yellow(message), ...args);
    }
  }

  error(tag: string, message: any, ...args: any[]): void {
    if (this.level <= LogLevel.Error) {
      console.error(this.timestamp(), this.formatTag(tag), pc.red('✖'), pc.red(message), ...args);
    }
  }

  time(label: string): () => void {
    const start = performance.now();
    return () => {
      const duration = (performance.now() - start).toFixed(2);
      this.info('time', `${label} completed in ${pc.bold(duration + 'ms')}`);
    };
  }
}

export const logger = new Logger();
