import colors from 'ansi-styles';

const COLOR = {
  PREFIX: 'bg',
  SUFFIX: 'Bright'
};

interface ColorStyle {
  modifier?: string;
  color: string;
  background?: boolean;
  bright?: boolean;
}

function style(style: ColorStyle): string {
  const color: string = style.color.toLowerCase();
  let api: string = style.background
    ? COLOR.PREFIX + color.replace(/^[a-z]/, str => str.toUpperCase())
    : color;

  if (style.bright) {
    api += COLOR.SUFFIX;
  }

  return colors[api].open + 'Hello Woold' + colors[api].close;
}

console.log(
  style({
    color: 'white'
  })
);
console.log(
  style({
    color: 'red',
    bright: true
  })
);
console.log(
  style({
    color: 'green',
    background: true
  })
);
console.log(
  style({
    color: 'blue',
    bright: true,
    background: true
  })
);
