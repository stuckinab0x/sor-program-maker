import { FC } from 'react';
import styled from 'styled-components';
import View from '../models/view';

interface UnderNavProps {
  view: View;
  restart: () => void;
  viewBack: () => void;
}

const UnderNav: FC<UnderNavProps> = ({ view, restart, viewBack }) => (
  <UnderNavMain>
    <div>
      { view !== 'Welcome' &&
        <>
          <Button onClick={ restart }>
            <h2>Start Over</h2>
          </Button>
          <Button onClick={ viewBack }>
            <h2>Go Back</h2>
          </Button>
        </>
      }
    </div>
  </UnderNavMain>
)

const UnderNavMain = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  > div {
    display: flex;
    align-items: center;
    height: 60px;
    margin: 10px;
    width: 90vw;

    h1, h2 {
      margin: 0;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }

    > h1 {
      font-size: 1.6rem;
      color: orange;
    }
  }
`;

const Button = styled.div`
  display: flex;
  top: 80px;
  background-color: ${ props => props.theme.colors.bgInner1 };
  border-radius: 4px;
  box-shadow: 1px 1px 10px 0px rgba(0, 0, 0, 0.3);
  margin: 0px 10px;
  padding: 2px 8px;
  cursor: pointer;

  &:first-of-type {
    background-color: orange;
    margin-right: 20px;
  }

  > h2 {
    color: white;
  }
`;

export default UnderNav;
