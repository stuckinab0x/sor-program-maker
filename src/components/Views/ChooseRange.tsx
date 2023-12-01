import { FC, useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import GridColumn from '../../models/grid-column';
import RangeSelectColumn from '../RangeSelectColumn';
import mixins from '../../styles/mixins';
import View from '../../models/view';
import example from '../../images/picker-example.png';

interface ChooseRangeProps {
  parsedSheet: GridColumn[];
  selectedSheet: GridColumn[] | null;
  setSelectedSheet: (grid: GridColumn[] | null) => void;
  setView: (view: View) => void;
}

interface Cell {
  col: string;
  row: number;
}

const ChooseRange: FC<ChooseRangeProps> = ({ parsedSheet, selectedSheet, setSelectedSheet, setView }) =>  {
  const [currentCorner, setCurrentCorner] = useState<'left' | 'right' | null>(selectedSheet ? null : 'left');
  const [upperLeft, setUpperLeft] = useState<Cell | null>(null);
  const [lowerRight, setLowerRight] = useState<Cell | null>(null);
  const [showError, setShowError] = useState(false);
  const [showExample, setShowExample] = useState(false);

  const handleSet = useCallback((col: string, row: number) => {
    if (!currentCorner || showExample)
      return;
    if (currentCorner === 'left') {
      setUpperLeft({ col, row });
      setCurrentCorner('right');
    } else {
      setLowerRight({ col, row });
      setCurrentCorner(null);
      window.scroll({
        top: 0,
        behavior: 'smooth',
      })
    }
  }, [currentCorner, showExample]);

  const handleReset = useCallback(() => {
    setSelectedSheet(null);
    setUpperLeft(null);
    setLowerRight(null);
    setCurrentCorner('left');
  }, [setSelectedSheet]);

  useEffect(() => {
    if (!upperLeft || !lowerRight)
      return;

    const indexOfFirstCol = parsedSheet.findIndex(x => x.col === upperLeft.col);
    const indexOfLastCol = parsedSheet.findIndex(x => x.col === lowerRight.col);

    if (indexOfFirstCol >= indexOfLastCol || upperLeft.row >= lowerRight.row) {
      handleReset();
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
      return;
    }

    const trimCols = parsedSheet.slice(indexOfFirstCol, indexOfLastCol + 1);
    const newGrid: GridColumn[] = trimCols.map(x => {
      return { col: x.col, cells: [...x.cells.filter(cell => cell.row >= upperLeft.row && cell.row <= lowerRight.row)]}
    })

    setSelectedSheet(newGrid);
    setUpperLeft(null);
    setLowerRight(null);
  }, [upperLeft, lowerRight, parsedSheet, handleReset, setSelectedSheet]);

  return (
    <ViewMain>
      <h1>Casting</h1>
      <h3>Select only the casting itself by clicking on the upper left and lower right corners.</h3>
      <Instructions>
        { !upperLeft && !selectedSheet && <h2>Choose the upper left tile</h2> }
        { upperLeft && !selectedSheet && <h2>Choose the lower right tile</h2> }
        {  !selectedSheet && <Button $orange onClick={ () => setShowExample(!showExample) }>
        <h2>{ showExample ? 'OK' : 'Help' }</h2>
        </Button> }
      </Instructions>
      { selectedSheet && <Divider /> }
      {
        selectedSheet && 
        <InstructionsColumn>
          <h2>Does this look okay?</h2>
          <h3>{ '(the top row should be instrument names, bottom row last song)' }</h3>
          <div>
            <Button $orange onClick={ () => setView('Instrument Columns') }>
              <h2>Yep</h2>
            </Button>
            <Button onClick={ handleReset }>
              <h2>No, start over</h2>
            </Button>
          </div>
        </InstructionsColumn>
      }
      <GridContainer>
        { showError &&
          <Error>
            <h1>
              Whoops, Invalid Selection Range
            </h1>
          </Error>
        }
        { !selectedSheet && parsedSheet.map(x => <RangeSelectColumn key={ x.col } column={ x } setCell={ handleSet } selectedLeft={ upperLeft } selectedRight={ lowerRight } pointer />) }
        {
          selectedSheet && selectedSheet.map(x => <RangeSelectColumn key={ x.col } column={ x } setCell={ handleSet } selectedLeft={ upperLeft } selectedRight={ lowerRight } pointer={ false } />)
        }
        { showExample &&
          <Example onClick={ () => setShowExample(false) }>
            <h2>Pick the tile at the corner between instruments<br />/songs...</h2>
            <img src={ example } alt="" />
            <h2>then pick the last tile of the last song</h2>
          </Example>
        }
      </GridContainer>
    </ViewMain>
  )
}

const ViewMain = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 10px 0px;

  > h1, h2, h3 {
    color: white;
    ${ mixins.textShadowLight }
    margin: 0;
  }

  h3 {
    font-style: italic;
  }

  > h2 {
    margin-top: 10px;
  }
`;

const Instructions = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0px;
  max-width: max-content;

  span {
    color: ${ props => props.theme.colors.lightGreen };
    font-size: 2.5rem;
  }

  > div {
    display: flex;
    align-items: center;
  }
`;

const InstructionsColumn = styled(Instructions)`
  flex-direction: column;
  align-items: start;
`;

const GridContainer = styled.div`
  display: flex;
  position: relative;
`;

interface ButtonStyle {
  $orange?: boolean;
}

const Divider = styled.div`
  height: 1px;
  background-color: white;
  width: 100%;
`;

const Button = styled.div<ButtonStyle>`
  display: flex;
  background-color: ${ props => props.$orange ? 'orange' : props.theme.colors.bgInner1 };
  padding: 6px 10px;
  margin: 10px;
  border-radius: 10px;
  cursor: pointer;
  min-width: 60px;
  justify-content: center;
  align-items: center;
  user-select: none;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);

  > h2 {
    margin: 0;
    color: white;
    ${ mixins.textShadow };
  }
`;

const Error = styled.div`
  background-color: ${ props => props.theme.colors.lightRed };
  box-shadow: 1px 1px 10px 4px rgba(0, 0, 0, 0.5);
  padding: 4px 12px;
  border-radius: 8px;
  position: absolute;
  top: 200px;
  left: 200px;

  > h1 {
    color: white;
    ${ mixins.textShadowLight }
    font-size: 3rem;
  }
`;

const Example = styled.div`
  position: fixed;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  min-width: min-content;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: orange 1px solid;
  border-radius: 10px;
  background-color: #303030;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  
  &:hover {
    filter: brightness(0.8);
  }

  > h2 {
    text-align: center;
    min-width: 10%;
    margin: 0 50px;
  }

  > img {
    object-fit: contain;
    width: auto;
  }
`;


export default ChooseRange;