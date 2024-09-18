import { FC } from 'react';
import styled from 'styled-components';
import Button from '../styles/Button';
import { useMaker } from '../contexts/maker-context';

const UnderNav: FC = () => {
  const { view, restart, viewBack } = useMaker();

  return (
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
}

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
