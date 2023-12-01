import styled from 'styled-components';

const CellBasic = styled.div`
  display: flex;
  align-items: center;
  height: 20px;
  width: 120px;
  overflow: hidden;
  background-color: ${ props => props.theme.colors.bgInner1 };
  margin: 4px 0px;
  padding: 4px 6px;
  white-space: nowrap;
  border-radius: 4px;
  box-shadow: 1px 1px 4px 1px rgba(0, 0, 0, 0.2);
  user-select: none;

  > p {
    color: white;
  }
`

export default CellBasic;
