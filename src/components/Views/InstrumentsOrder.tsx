import { FC, useMemo, useState, useCallback } from 'react';
import styled from 'styled-components';
import mixins from '../../styles/mixins';
import Correction from '../../models/correction';
import OrderCorrection from '../../models/order-correction';
import DragTile from '../DragTile';

interface InstrumentOrderProps {
  originalNames: string[];
  instrumentNameCorrections: Correction[];
  next: (correctedOrder: OrderCorrection[]) => void;
}

const InstrumentOrder: FC<InstrumentOrderProps> = ({ originalNames, instrumentNameCorrections, next }) => {
  const nameCorrectedOriginalOrder: OrderCorrection[] = useMemo(() =>
    originalNames.map((x, i) => {
      const correction = instrumentNameCorrections.find(correction => correction.original === x);
      return { name: correction?.updated || x, order: i }
    }), [originalNames, instrumentNameCorrections]);

  const [order, setOrder] = useState<OrderCorrection[]>(nameCorrectedOriginalOrder);
  const [currentDragging, setCurrentDragging] = useState<OrderCorrection | null>(null);
  const [hoverTopSlot, setHoverTopSlot] = useState(false);

  const handleDrop = useCallback((target: number) => {
    setOrder(oldState => {
      if (!currentDragging || target === currentDragging.order)
        return oldState;
      const draggedIndex = oldState.findIndex(x => x.name === currentDragging.name);
      if (draggedIndex === -1)
        return oldState;
      const newOrder = [...oldState];
      newOrder.splice(draggedIndex, 1, { name: '$$placeholder', order: draggedIndex });
      newOrder.splice(target, 0, currentDragging);
      return newOrder.filter(x => x.name !== '$$placeholder').map((x, i) => ({ name: x.name, order: i }));
    })
    setCurrentDragging(null);
    setHoverTopSlot(false)
  }, [currentDragging]);

  return (
    <ViewMain>
      <h1>Instrument Order</h1>
      <h3>Click and drag to adjust the order the casting will be shown in</h3>
      <Tiles>
        <TopDrop
          $dragOver={ hoverTopSlot && currentDragging?.order !== 0 }
          $validDrop={ !!currentDragging && currentDragging.order !== 0 }
          onDrop={ () => handleDrop(0) }
          onDragOver={ event => event.preventDefault() }
          onDragEnter={ () => setHoverTopSlot(true) }
          onDragLeave={ () => setHoverTopSlot(false) }
        />
        { order.map(x => 
            <DragTile key={ x.name } currentDragging={ currentDragging } handleDrop={ handleDrop } setAsCurrent={ () => setCurrentDragging(x) } clearCurrent={ () => setCurrentDragging(null) } correctionInfo={ x } />
          )}
      </Tiles>
      <NextButton onClick={ () => next(order) }>
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

interface TopDropProps {
  $dragOver: boolean;
  $validDrop: boolean;
}

const TopDrop = styled.div<TopDropProps>`
  position: absolute;
  display: flex;
  opacity: 1;
  height: 43px;
  width: 120px;
  padding: 2px 10px;
  top: -50px;
  left: 4px;
  z-index: 50;

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
`

const Tiles = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  align-self: center;
  position: relative;
`;

const NextButton = styled.div`
  display: flex;
  background-color: orange;
  padding: 4px 20px;
  border: none;
  border-radius: 8px;
  margin: 20px 0px;
  max-width: max-content;
  cursor: pointer;
  box-shadow: 1px 1px 10px 0px rgba(0, 0, 0, 0.3);
`;


export default InstrumentOrder;
