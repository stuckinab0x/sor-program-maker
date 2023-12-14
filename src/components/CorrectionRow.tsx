import { FC, useState, useCallback } from 'react';
import styled from 'styled-components';
import Button from '../styles/Button';
import mixins from '../styles/mixins';

interface CorrectionRowProps {
  originalText: string;
  updateValue: (value: string, remove?: boolean) => void;
  editingAny: boolean;
  setEditingAny: (editing: boolean) => void;
  removeable?: boolean;
}

const CorrectionRow: FC<CorrectionRowProps> = ({ originalText, updateValue, editingAny, setEditingAny, removeable }) => {
  const [input, setInput] = useState(originalText);
  const [showInput, setShowInput] = useState(false);
  const [remove, setRemove] = useState(false);

  const handleConfirm = useCallback(() => {
    if (!remove && input === '') {
      setInput(originalText);
      setShowInput(false);
      setEditingAny(false);
      return;
    }
    updateValue(input === originalText ? '' : input, remove);
    setShowInput(false);
    setEditingAny(false);
  }, [updateValue, input, originalText, setEditingAny, remove]);

  const handleRemoveToggle = useCallback(() => {
    updateValue(input === originalText ? '' : input, !remove);
    setRemove(!remove);
  }, [remove, input, updateValue, originalText]);

  const handleRevert = useCallback(() => {
    updateValue('', false);
    setInput(originalText)
    setRemove(false);
  }, [updateValue, originalText]);

  const handleClickStart = useCallback(() => {
    if (editingAny)
      return;
    setShowInput(true);
    setEditingAny(true);
  }, [editingAny, setEditingAny]);

  return (
    <RowMain>
      { removeable && !remove && input === originalText && !showInput && <TrashCan onClick={ handleRemoveToggle } className='material-symbols-outlined'>delete</TrashCan> }
      { (remove || input !== originalText) && !showInput && <TrashCan onClick={ handleRevert } className='material-symbols-outlined'>undo</TrashCan> }
      <CorrectionButton $notOrange onClick={ handleClickStart } $disabled={ editingAny } $removed={ remove } $corrected={ input !== originalText && !showInput }>
        <h2>{ originalText }</h2>
      </CorrectionButton>
      { (showInput || input !== originalText || remove) && <Icon className='material-symbols-outlined'>arrow_forward</Icon> }
        { showInput &&
          <Input type='text' value={ input } placeholder='enter a new name' onChange={ event => setInput(event.currentTarget.value) } />
        }
        { showInput && <CheckMark className='material-symbols-outlined' onClick={ handleConfirm }>done</CheckMark> }
        { !showInput && input !== originalText && !remove && <h2>{ input }</h2> }
        { !showInput && remove && <RedTrash className='material-symbols-outlined'>delete</RedTrash> }
    </RowMain>
  )
}

const RowMain = styled.div`
  display: flex;
  align-items: center;

  h2 {
    margin: 0;
    ${ mixins.textShadow }
  }
`;

interface ButtonStyleProps {
  $removed: boolean;
  $corrected: boolean;
}

const CorrectionButton = styled(Button)<ButtonStyleProps>`
  margin: 4px;
  ${ props => props.$removed && `background-color: ${ props.theme.colors.lightRed };` }
  ${ props => props.$corrected && `background-color: ${ props.theme.colors.lightGreen };` }
`;

const Icon = styled.span`
  margin: 0px 10px;
  font-size: 2rem;
`;

const TrashCan = styled(Icon)`
  cursor: pointer;
`;

const CheckMark = styled(Icon)`
  color: ${ props => props.theme.colors.lightGreen };
  cursor: pointer;
  font-size: 2.5rem;
`;

const RedTrash = styled(Icon)`
  color: ${ props => props.theme.colors.lightRed };
  font-size: 2.5rem;
`;

const Input = styled.input`
  font-size: 1.5rem;
`;

export default CorrectionRow;
