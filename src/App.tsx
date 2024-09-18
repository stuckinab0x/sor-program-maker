import { FC } from 'react'
import { createGlobalStyle, ThemeProvider } from 'styled-components'

import theme from './styles/theme';
import Container from './components/Container';
import MakerProvider from './contexts/maker-context';

const GlobalStyle = createGlobalStyle`
  html, body {
    color: white;
    background-color: ${ props => props.theme.colors.bgMain };
    margin: 0;
    display: flex;
    height: 100vh;
    flex-direction: column;
    font-family: 'Segoe UI';
  }

  #root {
    display: flex;
    flex: 1;
    flex-direction: column;
  }
`;

const App: FC = () => (
  <>
    <ThemeProvider theme={ theme }>
      <GlobalStyle />
      <MakerProvider>
        <Container />
      </MakerProvider>
    </ThemeProvider>
  </>
);

export default App;

