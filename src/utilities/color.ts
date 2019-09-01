import ansiColors from 'ansi-colors';

const COLOR = {
  PREFIX: 'bg',
  SUFFIX: 'Bright'
};

interface ColorStyle {
  modifier?: string;
  color: string;
  background?: boolean;
  bright?: boolean;
  symbol?: string;
}

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

  let colors = ansiColors as any;
  let render = colorStyle.modifier
    ? colors[colorStyle.modifier][fn]
    : colors[fn];

  let symbols = ansiColors.symbols as any;
  let icon =
    colorStyle.symbol && symbols[colorStyle.symbol]
      ? symbols[colorStyle.symbol]
      : '';

  return {
    icon,
    render
  };
}

function color(str: string, colorStyle?: ColorStyle) {
  let result = style(colorStyle);
  return result.render(`${result.icon} ${str}`);
}

export default color;
