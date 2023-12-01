import { FC, useState, useCallback } from 'react';
import styled from 'styled-components';
import CorrectionRow from '../CorrectionRow';
import mixins from '../../styles/mixins';
import Correction from '../../models/correction';

interface FixStudentNamesProps {
  studentNames: string[];
  next: (corrections: Correction[]) => void;
}

const FixStudentNames: FC<FixStudentNamesProps> = ({ studentNames, next }) => {
  const [corrections, setCorrections] = useState<Correction[]>(studentNames.map(x => ({ original: x, updated: '' })));
  const [editingAny, setEditingAny] = useState(false);

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
      <p>
        Here you can:<br/>
        - Fix typos in names<br />
        - Trim off director's notes about a part e.g. { '"(Ac)"' } or { '"Piano."' }<br />
        - Remove unwanted notes/placeholders, like "shaker" { '(or leave them if names can be added later.)' }
        <br />
        <br />
        Click an entry to edit it, or click the trash to add it to the remove list.
        <br />
        <br />
        Names only appear more than once when there are differences.<br />
        Just make sure that they appear the way you want for each case below.
        <br />
        <br />
        Don't forget that you can also make any of these edits manually later.
      </p>
      <Buttons>{ studentNames.sort().map((x, i) =>
        <CorrectionRow key={ x } removeable originalText={ x } updateValue={ (value: string, remove?: boolean) => updateInput(value, i, remove) } editingAny={ editingAny } setEditingAny={ setEditingAny } />) }
      </Buttons>
      <NextButton $disabled={ editingAny } onClick={ () => next(corrections.filter(x => x.updated.length || x.remove)) }>
        <h1>Next</h1>
      </NextButton>
    </ViewMain>
  )
}

const ViewMain = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;

  h1, p {
    color: white;
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
`;

export default FixStudentNames;
