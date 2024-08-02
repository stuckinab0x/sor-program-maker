import { FC, useState, useCallback } from 'react';
import styled from 'styled-components';
import CorrectionRow from '../CorrectionRow';
import mixins from '../../styles/mixins';
import Correction from '../../models/correction';
import Button from '../../styles/Button';
import Divider from '../../styles/Divider';
import students1 from '../../images/students1.png';
import students2 from '../../images/students2.png';
import students3 from '../../images/students3.png';

interface FixStudentNamesProps {
  studentNames: string[];
  next: (corrections: Correction[]) => void;
}

const FixStudentNames: FC<FixStudentNamesProps> = ({ studentNames, next }) => {
  const [corrections, setCorrections] = useState<Correction[]>(studentNames.map(x => ({ original: x, updated: '' })));
  const [editingAny, setEditingAny] = useState(false);
  const [showExample, setShowExample] = useState(false);

  const updateInput = useCallback((value: string, index: number, remove?: boolean) => {
    setCorrections(oldState => {
      const newCorrections: Correction[] = [...oldState];
      newCorrections.splice(index, 1, { original: newCorrections[index].original, updated: value, remove });
      return newCorrections;
    })
  }, []);

  console.log(corrections);

  return (
    <ViewMain>
      <h1>Student Names</h1>
      <Divider />
      <p>
        Scan for typos and notes leftover from the director that you'd like to remove.<br />
        Click an entry to edit it, or click the trash to add it to the remove list.
        <br />
        <br />
        You could also skip this step and make any edits manually later in the resulting text file.
      </p>
      <HelpButton onClick={ () => setShowExample(!showExample) }>
        <h2>
          { showExample ? 'Okay' : 'How does this work?' }
        </h2>
      </HelpButton>
      <Buttons>{ studentNames.sort().map((x, i) =>
        <CorrectionRow key={ x } removeable originalText={ x } updateValue={ (value: string, remove?: boolean) => updateInput(value, i, remove) } editingAny={ editingAny } setEditingAny={ setEditingAny } />) }
      </Buttons>
      <Divider />
      <Button $nextStyle $disabled={ editingAny } onClick={ () => next(corrections.filter(x => x.updated.length || x.remove)) }>
        <h1>Next</h1>
      </Button>
      { showExample &&
      <Example onClick={ () => setShowExample(false) }>
        <h3>Let's say the director wrote a student's name two different ways.<br/>It'll show up once for every way they wrote it:</h3>
        <img src={ students1 } alt="" />
        <h3>If you were to make the following edit below, "Jonathan Shredman" would be changed to "Jon Shredman" for <i>every time</i> that it was written that way:</h3>
        <img src={ students2 } alt="" />
        <h3>Just make sure the names are written the way you want for each time they appear below.</h3>
        <br/>
        <br />
        <h3>You might also want to remove notes or placeholders that were never filled in with a name:</h3>
        <img src={ students3 } alt="" />
      </Example> }
    </ViewMain>
  )
}

const ViewMain = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;
  position: relative;

  h1, p {
    margin: 0;
    ${ mixins.textShadow }
  }

  p {
    font-style: italic;
    font-size: 1.2rem;
    font-weight: bold;
  }

  span {
    user-select: none;
  }
`;

const HelpButton = styled(Button)`
  max-width: max-content;
  margin-top: 10px;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 30px;
`;

const Example = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: min-content;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: orange 1px solid;
  border-radius: 10px;
  background-color: ${ props => props.theme.colors.bgInner1 };
  ${ mixins.boxShadow }
  cursor: pointer;
  overflow: hidden;
  padding: 20px 0px;
  
  &:hover {
    filter: brightness(0.8);
  }

  > h3 {
    text-align: center;
    min-width: 10%;
    margin: 0 50px;
    ${ mixins.textShadowLight }
  }

  > img {
    object-fit: contain;
    width: auto;
    margin: 10px 0px 30px;
    border-radius: 10px;
    ${ mixins.boxShadowLight }
  }
`;

export default FixStudentNames;
