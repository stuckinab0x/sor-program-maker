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
  box-shadow: 1px 1px 10px 0px rgba(0, 0, 0, 0.3);

  &:active {
    cursor: grabbing;
  }

  >  h1 {
    color: white;
    margin: 0;
    ${ mixins.textShadow }
    pointer-events: none;
    text-align: center;
  }

  &::after {
    opacity: ${ props => props.$validDrop ? '1' : '0' };
    content: '';
    position: absolute;
    left: -20px;
    top: 36px;
    border: solid 5px transparent;
    border-left-color: ${ props => props.$dragOver ? 'orange' : props.theme.colors.bgInner1 };
    border-top-width: 14px;
    border-bottom-width: 14px;
    border-right-width: 8px;
    border-left-width: 16px;
    pointer-events: none;
  }
`;

export default DragTile;
