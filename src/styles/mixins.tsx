import { css } from 'styled-components';

const mixins = {
  textShadowLight: css`
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
  `,
  textShadow: css`
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
  `
}

export default mixins;
