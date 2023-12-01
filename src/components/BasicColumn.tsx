import { FC } from 'react';
import styled from 'styled-components';
import GridColumn from '../models/grid-column';
import CellBasic from '../styles/CellBasic';

interface BasicColumnProps {
  column: GridColumn;
}

const BasicColumn: FC<BasicColumnProps> = ({ column }) => (
  <ColumnMain>
    { column.cells.map(x =>
      <CellBasic key={ x.row }>
        <p>{ x.value }</p>
      </CellBasic>)
    }
  </ColumnMain>
);

const ColumnMain = styled.div`
  display: flex;
  flex-direction: column;
  margin: 4px;
`;

export default BasicColumn;
