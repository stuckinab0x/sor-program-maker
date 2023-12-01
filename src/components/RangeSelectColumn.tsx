import { FC } from 'react';
import GridColumn from '../models/grid-column';
import styled from 'styled-components';
import CellBasic from '../styles/CellBasic';

interface Cell {
  col: string;
  row: number;
}

interface RangeSelectColumnProps {
  column: GridColumn;
  pointer: boolean;
  setCell: (col: string, row: number) => void;
  selectedLeft: Cell | null;
  selectedRight: Cell | null;
}

const RangeSelectColumn: FC<RangeSelectColumnProps> = ({ column, setCell, selectedLeft, selectedRight, pointer }) => (
  <ColumnMain>
    { column.cells.map(x => <Cell 
        key={ x.row }
        onClick={ () => setCell(column.col, x.row) }
        $selected={ (selectedLeft?.col === column.col && selectedLeft.row === x.row) || (selectedRight?.col === column.col && selectedRight.row === x.row) }
        $pointer={ pointer }
      >
        <p>{ x.value }</p>
      </Cell>) }
  </ColumnMain>
)

const ColumnMain = styled.div`
  display: flex;
  flex-direction: column;
  margin: 4px;
`;

interface CellStyleProps {
  $selected?: boolean;
  $pointer: boolean;
}

const Cell = styled(CellBasic)<CellStyleProps>`
  ${ props => props.$selected && 'background-color: orange;' }
  ${ props => props.$pointer && 'cursor: pointer;' }
`;

export default RangeSelectColumn;
