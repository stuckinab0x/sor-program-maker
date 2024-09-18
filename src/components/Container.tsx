import { FC } from 'react';
import styled from 'styled-components';
import Nav from './Nav';
import UnderNav from './UnderNav';

import CurrentView from './CurrentView';

const Container: FC = () => (
  <>
    <Nav />
      <UnderNav />
      <Main>
        <CurrentView />
      </Main>
  </>
);


const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default Container;
