import { FC, useState, useCallback } from 'react';
import styled from 'styled-components';
import CorrectionRow from '../CorrectionRow';
import mixins from '../../styles/mixins';
import Correction from '../../models/correction';
import Button from '../../styles/Button';
import Divider from '../../styles/Divider';
import { useMaker } from '../../contexts/maker-context';

interface FixInstrumentNamesProps {
  instrumentNames: string[];
}

const FixInstrumentNames: FC<FixInstrumentNamesProps> = ({ instrumentNames }) => {
  const [corrections, setCorrections] = useState<Correction[]>(instrumentNames.map(x => ({ original: x, updated: '' })));
  const [editingAny, setEditingAny] = useState(false);

  const { setCorrectedInstruments, setView } = useMaker();

  const updateInput = useCallback((value: string, index: number) => {
    setCorrections(oldState => {
      const newCorrections: Correction[] = [...oldState];
      newCorrections.splice(index, 1, { original: newCorrections[index].original, updated: value });
      return newCorrections;
    })
  }, []);

  const handleNextClick = useCallback(() => {
    setCorrectedInstruments(corrections.filter(x => x.updated.length));
    setView('Instruments Order');
  }, [setCorrectedInstruments, corrections, setView]);

  return (
    <ViewMain>
      <h1>Instrument Names</h1>
      <Divider />
      <h3>
        Click an instrument to change how it's written,
        <br />
        e.g. if you need to change "Gtr1" to "Guitar 1"
      </h3>
      <Buttons>{ instrumentNames.map((x, i) =>
        <CorrectionRow key={ x } originalText={ x } updateValue={ (value: string) => updateInput(value, i) } editingAny={ editingAny } setEditingAny={ setEditingAny } />) }
      </Buttons>
      <Divider />
      <Button $nextStyle $disabled={ editingAny } onClick={ handleNextClick }>
        <h1>Next</h1>
      </Button>
    </ViewMain>
  )
}

const ViewMain = styled.div`
  h1, h3 {
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

export default FixInstrumentNames;
