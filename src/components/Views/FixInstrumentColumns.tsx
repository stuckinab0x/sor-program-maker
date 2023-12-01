import { FC, useState, useCallback } from 'react';
import styled from 'styled-components';
import CorrectionRow from '../CorrectionRow';
import mixins from '../../styles/mixins';
import Correction from '../../models/correction';

interface FixInstrumentColumnsProps {
  instrumentNames: string[];
  next: (corrections: Correction[]) => void;
}

const FixInstrumentColumns: FC<FixInstrumentColumnsProps> = ({ instrumentNames, next }) => {
  const [corrections, setCorrections] = useState<Correction[]>(instrumentNames.map(x => ({ original: x, updated: '' })));
  const [editingAny, setEditingAny] = useState(false);

  const updateInput = useCallback((value: string, index: number) => {
    setCorrections(oldState => {
      const newCorrections: Correction[] = [...oldState];
      newCorrections.splice(index, 1, { original: newCorrections[index].original, updated: value });
      return newCorrections;
    })
  }, []);

  return (
    <ViewMain>
      <h1>Instrument Names</h1>
      <h3>
        Click an instrument to change how it's written,
        <br />
        e.g. if you need to change "Gtr1" to "Guitar 1"
      </h3>
      <Buttons>{ instrumentNames.map((x, i) =>
        <CorrectionRow key={ x } originalText={ x } updateValue={ (value: string) => updateInput(value, i) } editingAny={ editingAny } setEditingAny={ setEditingAny } />) }
      </Buttons>
      <NextButton $disabled={ editingAny } onClick={ () => next(corrections.filter(x => x.updated.length)) }>
        <h1>Next</h1>
      </NextButton>
    </ViewMain>
  )
}

const ViewMain = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;

  h1, h3 {
    color: white;
    margin: 0;
    ${ mixins.textShadow }
  }

  h3 {
    font-style: italic;
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 30px;
`;

interface NextButtonProps {
  $disabled: boolean;
}

const NextButton = styled.div<NextButtonProps>`
  display: flex;
  background-color: orange;
  padding: 4px 20px;
  border: none;
  border-radius: 8px;
  margin: 20px 0px;
  max-width: max-content;
  ${ props => !props.$disabled && 'cursor: pointer;' }
  ${ props => props.$disabled && 'opacity: 0.5;' }
  box-shadow: 1px 1px 10px 0px rgba(0, 0, 0, 0.3);
`;

export default FixInstrumentColumns;
