import { css } from 'styled-components';

const mixins = {
  textShadowLight: css`
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
  `,
  textShadow: css`
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
  `,
  boxShadow: css`
    box-shadow: 1px 1px 10px 0px rgba(0, 0, 0, 0.5);
  `,
  boxShadowLight: css`
    box-shadow: 1px 1px 10px 0px rgba(0, 0, 0, 0.3);
  `,
  dragDropArrow: css`
    content: '';
    position: absolute;
    left: -20px;
    top: 36px;
    border: solid 5px transparent;
    border-top-width: 14px;
    border-bottom-width: 14px;
    border-right-width: 8px;
    border-left-width: 16px;
    pointer-events: none;
  `,
}

export default mixins;
