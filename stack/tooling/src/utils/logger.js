import chalk from 'chalk';

export const logger = {
  info: (msg) => console.log(chalk.blue('ℹ'), msg),

  success: (msg) => console.log(chalk.green('✔'), msg),

  warn: (msg) => console.log(chalk.yellow('⚠'), msg),

  error: (msg) => console.log(chalk.red('✖'), msg),

  title: (msg) =>
    console.log(chalk.bold.cyan(`\n${msg}\n${'─'.repeat(50)}`)),

  blank: () => console.log(),
};
