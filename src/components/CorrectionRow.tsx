import { FC, useState, useCallback } from 'react';
import styled from 'styled-components';
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
      <Button onClick={ handleClickStart } $disabled={ editingAny }>
        <h2>{ originalText }</h2>
      </Button>
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
    color: white;
    margin: 0;
    ${ mixins.textShadow }
  }
`;

interface ButtonStyleProps {
  $disabled: boolean;
}

const Button = styled.div<ButtonStyleProps>`
  background-color: orange;
  margin: 4px;
  padding: 4px 10px;
  border-radius: 6px;
  ${ props => !props.$disabled && 'cursor: pointer;' }
  ${ props => props.$disabled && 'opacity: 0.5;' }
`;

const Icon = styled.span`
  color: white;
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
  font-size: 3rem;
`;

const Input = styled.input`
  font-size: 1.5rem;
`;

export default CorrectionRow;
