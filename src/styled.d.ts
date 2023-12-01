import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    name: string;
    colors: {
      bgMain: string;
      bgNav: string;
      bgInner1: string;
      lightGreen: string;
      lightRed: string;
    }
  }
}
