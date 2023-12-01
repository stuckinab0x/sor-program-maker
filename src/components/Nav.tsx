import { FC } from 'react';
import styled from 'styled-components';

const Nav: FC = () => (
  <NavMain>
    <h1>SOR Program Maker</h1>
  </NavMain>
)

const NavMain = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 30px;
  padding: 10px 20px 15px;
  background-color: ${ props => props.theme.colors.bgNav };
  box-shadow: 0px 2px 10px 2px rgba(0, 0, 0, 0.5);

  h1 {
    font-size: 1.6rem;
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    color: orange;
  }
`;

export default Nav;
