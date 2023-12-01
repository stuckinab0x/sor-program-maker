import { FC, useState, useEffect, useCallback } from 'react'
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'
import GridColumn from './models/grid-column';
import Nav from './components/Nav';
import View from './models/view';
import ChooseSpreadsheet from './components/Views/ChooseSpreadsheet';
import theme from './styles/theme';
import ChooseRange from './components/Views/ChooseRange';
import FixInstrumentColumns from './components/Views/FixInstrumentColumns';
import FixStudentNames from './components/Views/FixStudentNames';
import Correction from './models/correction';
import SongPreviewData from './models/song-preview';
import Output from './components/Views/Output';
import UnderNav from './components/UnderNav';
import InstrumentOrder from './components/Views/InstrumentsOrder';
import OrderCorrection from './models/order-correction';

const GlobalStyle = createGlobalStyle`
  html, body {
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

const App: FC = () => {
  const [fileName, setFileName] = useState('');
  const [parsedSheet, setParsedSheet] = useState<GridColumn[] | null>(null);
  const [selectedSheet, setSelectedSheet] = useState<GridColumn[] | null>(null);
  const [view, setView] = useState<View>('Welcome');
  const [correctedInstruments, setCorrectedInstruments] = useState<Correction[]>([]);
  const [orderCorrections, setOrderCorrections] = useState<OrderCorrection[]>([]);
  const [correctedStudentNames, setCorrectedStudentNames] = useState<Correction[]>([]);
  const [outputData, setOutputData] = useState<SongPreviewData[]>([]);

  const restart = useCallback(() => {
    setOutputData([]);
    setCorrectedStudentNames([]);
    setCorrectedInstruments([]);
    setSelectedSheet(null);
    setParsedSheet(null);
    setFileName('');
    setView('Welcome');
  }, []);

  const viewBack = useCallback(() => {
    if (view === 'Choose Range') {
      setParsedSheet(null);
      setSelectedSheet(null);
      setFileName('');
      return setView('Welcome');
    }
    else if (view === 'Instrument Columns') {
      setCorrectedInstruments([]);
      return setView('Choose Range');
    }
    else if (view === 'Instruments Order') {
      setOrderCorrections([]);
      return setView('Instrument Columns');
    }
    else if (view === 'Student Names') {
      setCorrectedStudentNames([]);
      return setView('Instruments Order')
    }
      setOutputData([]);
      setView('Student Names');
  }, [view]);

  useEffect(() => {
    if (!selectedSheet || view !== 'Output')
      return;

    const songNames = selectedSheet[0].cells.slice(1).filter(x => x.value);

    const withInstCorrections: GridColumn[] = [...selectedSheet].map(x => {
      const correction = correctedInstruments.find(corr => corr.original === x.cells[0].value);
      const cells = [...x.cells];

      if (correction)
        cells.splice(0, 1, { ...x.cells[0], value: correction.updated });
      return { ...x, cells }
    })

    const withInstOrder: GridColumn[] = [...withInstCorrections]
      .map(x => {
      const order = orderCorrections.find(correction => correction.name === x.cells[0].value)?.order;
      return { gridColumn: x, order: order ? order + 1 : 0 }
      })
      .sort((a, b) => a.order - b.order).map(x => x.gridColumn);

    const data: SongPreviewData[] = songNames.map(song => {
      const songCastings = withInstOrder.flatMap(x => x.cells).filter(x => x.row === song.row);
      const instNamesWithCasting = songCastings.slice(1)
        .map((x, i) => { 
          return {
            instrument: String(withInstOrder[i + 1].cells[0].value) || '',
            student: String(x.value) || '',
            remove: x.willRemove,
          }
        }
        )
        .map(x => {
          const correction = correctedStudentNames.find(correction => x.student === correction.original);
          if (correction && correction.remove)
            x.remove = true;
          else if (correction)
            x.student = correction.updated;
          return x;
        })
        .filter(x => !x.remove)
        .map(x => `${ x.instrument }: ${ x.student }`);

      return { name: String(song.value), cast: instNamesWithCasting };
    });
    setOutputData(data);
  }, [selectedSheet, view, correctedInstruments, orderCorrections, correctedStudentNames]);

  return (
    <>
      <ThemeProvider theme={ theme }>
        <GlobalStyle />
        <Nav />
        <UnderNav view={ view } restart={ restart } viewBack={ viewBack } />
        <Main>
          { view === 'Welcome' &&
            <ChooseSpreadsheet
              setFileName={ setFileName }
              setParsedSheet={ setParsedSheet }
              next={ () => setView('Choose Range') }
            />
          }
          { view === 'Choose Range' && parsedSheet &&
            <ChooseRange
              parsedSheet={ parsedSheet }
              selectedSheet={ selectedSheet }
              setSelectedSheet={ setSelectedSheet }
              setView={ setView }
            />
          }
          { view === 'Instrument Columns' && selectedSheet &&
            <FixInstrumentColumns
              instrumentNames={ selectedSheet.slice(1).map(x => String(x.cells[0].value) || '') }
              next={ (corrections: Correction[]) => { setCorrectedInstruments(corrections); setView('Instruments Order') } } 
            /> }
          { view === 'Instruments Order' && selectedSheet &&
            <InstrumentOrder
              originalNames={ selectedSheet.slice(1).map(x => String(x.cells[0].value) || '') }
              instrumentNameCorrections={ correctedInstruments }
              next={ corrections => { setOrderCorrections(corrections); setView('Student Names') } }
            />
          } 
          { view === 'Student Names' && selectedSheet &&
            <FixStudentNames
              studentNames={ selectedSheet.slice(1).map(x => ({ ...x, cells: x.cells.slice(1) })).flatMap(x => x.cells).filter(x => x.value).map(x => String(x.value).trim()).filter((x, i, self) => i === self.indexOf(x)) }
              next={ (corrections: Correction[]) => { setCorrectedStudentNames(corrections); setView('Output'); } }
            />
          }
          { view === 'Output' && <Output fileName={ fileName } songs={ outputData } /> }
        </Main>
      </ThemeProvider>
    </>
  )
}

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default App;

