import styled, { css } from 'styled-components';
import mixins from './mixins';

interface ButtonProps {
  $notOrange?: boolean;
  $nextStyle?: boolean;
  $disabled?: boolean;
}

const NextStyle = css<ButtonProps>`
  max-width: max-content;
  padding: 5px 15px;
  margin: 20px 0px;

  ${ props => !props.$disabled && 'cursor: pointer;' }
  ${ props => props.$disabled && 'opacity: 0.5;' }
`

const Button = styled.div<ButtonProps>`
  display: flex;
  background-color: ${ props => props.$notOrange ? props.theme.colors.bgInner1 : 'orange' };
  border-radius: 4px;
  ${ mixins.boxShadowLight }
  margin: 0px 10px;
  padding: 2px 8px;
  cursor: pointer;
  user-select: none;

  > h1, h2 {
    margin: 0;
    ${ mixins.textShadow }
  }

  ${ props => props.$nextStyle && NextStyle }
`;

export default Button;
