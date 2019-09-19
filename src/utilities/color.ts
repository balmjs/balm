import ansiColors from 'ansi-colors';
import { ColorStyle } from '../config/types';

const COLOR = {
  PREFIX: 'bg',
  SUFFIX: 'Bright'
};

function style(
  colorStyle: ColorStyle = {
    color: 'white'
  }
): {
  icon: string;
  render: ansiColors.StyleFunction;
} {
  const color: string = colorStyle.color.toLowerCase();
  let fn: string = colorStyle.background
    ? COLOR.PREFIX + color.replace(/^[a-z]/, str => str.toUpperCase())
    : color;

  if (colorStyle.bright) {
    fn += COLOR.SUFFIX;
  }

  const colors: any = ansiColors;
  const render: ansiColors.StyleFunction = colorStyle.modifier
    ? colors[colorStyle.modifier][fn]
    : colors[fn];

  const symbols: any = ansiColors.symbols;
  const icon: string =
    colorStyle.symbol && symbols[colorStyle.symbol]
      ? symbols[colorStyle.symbol] + ' '
      : '';

  return {
    icon,
    render
  };
}

function color(label: string, colorStyle?: ColorStyle): string {
  const result = style(colorStyle);
  return result.render(`${result.icon}${label}`);
}

export default color;
