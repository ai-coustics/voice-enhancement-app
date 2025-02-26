const preset = {
  theme: {
    colors: {
      transparent: 'transparent',

      // Graytones
      white: 'hsl(0, 0%, 100%)',
      snow: 'hsl(30, 33%, 98%)',
      sleet: 'hsl(30, 27%, 95%)',
      cloud: 'hsl(0, 0%, 85%)',
      sand: 'hsl(30, 8%, 72%)', // disabled text
      clay: 'hsl(30, 10%, 55%)', // disabled backgrounds
      mineshaft: 'hsl(0, 0%, 31%)',
      black: 'hsl(0, 0%, 0%)',

      // Accents, pink
      'misty-rose': 'hsl(3, 100%, 92%)',
      rose: 'hsl(3, 100%, 85%)',
      salmon: 'hsl(1, 100%, 79%)',
      flamingo: 'hsl(1, 77%, 70%)',

      // Accents, blue
      'royal-blue': 'hsl(228, 100%, 62%)',
      cobalt: 'hsl(219, 100%, 38%)',

      // Status colors
      'info-blue': {
        fg: 'hsl(219, 60%, 39%)',
        bg: 'hsl(228, 60%, 93%)',
      },
      'success-green': {
        fg: 'hsl(110, 50%, 40%)',
        bg: 'hsl(110, 55%, 89%)',
      },
      'warning-orange': {
        fg: 'hsl(26, 90%, 47%)',
        bg: 'hsl(26, 80%, 88%)',
      },
      'error-red': {
        fg: 'hsl(0, 75%, 40%)',
        bg: 'hsl(0, 65%, 89%)',
      },
    },
    fontFamily: {
      body: ['Inter', 'sans-serif'],
      display: ['Inter', 'sans-serif'],
    },
    fontSize: {
      xs: [
        '11px',
        {
          lineHeight: '14px',
          letterSpacing: '0em',
        },
      ],
      sm: [
        '12px',
        {
          lineHeight: '16px',
          letterSpacing: '0em',
        },
      ],
      base: '14px', // what 1 rem maps to
      lg: [
        '16px',
        {
          lineHeight: '22px',
          letterSpacing: '0em',
        },
      ],
      xl: [
        '20px',
        {
          lineHeight: '28px',
          letterSpacing: '-0.015em',
        },
      ],
      '2xl': [
        '24px',
        {
          lineHeight: '32px',
          letterSpacing: '-0.02em',
        },
      ],
      '3xl': [
        '32px',
        {
          lineHeight: '40px',
          letterSpacing: '-0.02em',
        },
      ],
    },
  }
};

export default preset;