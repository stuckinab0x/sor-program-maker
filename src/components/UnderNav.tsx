import { FC } from 'react';
import styled from 'styled-components';
import View from '../models/view';
import Button from '../styles/Button';

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
          <Button onClick={ viewBack } $notOrange>
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
  }
`;

export default UnderNav;
