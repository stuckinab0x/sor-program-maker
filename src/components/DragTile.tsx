import { FC, useState } from 'react';
import styled from 'styled-components';
import mixins from '../styles/mixins';
import OrderCorrection from '../models/order-correction';

interface DragTileProps {
  correctionInfo: OrderCorrection;
  currentDragging: OrderCorrection | null;
  handleDrop: (target: number) => void;
  setAsCurrent: () => void;
  clearCurrent: () => void;
}

const DragTile: FC<DragTileProps> = ({ correctionInfo: { name, order }, currentDragging, handleDrop, setAsCurrent, clearCurrent }) => {
  const [hover, setHover] = useState(false);

  return (
    <TileMain
      draggable
      $dragOver={ hover && currentDragging?.name !== name && currentDragging?.order !== order + 1 }
      $validDrop={ !!currentDragging && currentDragging?.order !== order && currentDragging?.order !== order +1 }
      onDrop={ ()=> { handleDrop(order + 1); setHover(false) } }
      onDrag={ setAsCurrent }
      onDragEnd={ clearCurrent }
      onDragOver={ event => event.preventDefault() }
      onDragEnter={ () => setHover(true) }
      onDragLeave={ () => setHover(false) }
    >
      <h1>{ name }</h1>
    </TileMain>
  )
}

interface TileProps {
  $dragOver: boolean;
  $validDrop: boolean;
}

const TileMain = styled.div<TileProps>`
  background-color: ${ props => props.theme.colors.bgInner1 };
  margin: 4px;
  padding: 2px 10px;
  border-radius: 4px;
  position: relative;
  z-index: 50;
  cursor: grab;
  ${ mixins.boxShadow }

  &:active {
    cursor: grabbing;
  }

  >  h1 {
    margin: 0;
    ${ mixins.textShadow }
    pointer-events: none;
    text-align: center;
  }

  &::after {
    opacity: ${ props => props.$validDrop ? '1' : '0' };
    ${ mixins.dragDropArrow }
    border-left-color: ${ props => props.$dragOver ? 'orange' : props.theme.colors.bgInner1 };
  }
`;

export default DragTile;
