import { FC, useState, useCallback, useEffect } from 'react';
import styled, { css } from 'styled-components';
import GridColumn from '../../models/grid-column';
import * as XLSX from 'xlsx';
import mixins from '../../styles/mixins';

interface ChooseSpreadSheetProps {
  setFileName: (name: string) => void;
  setParsedSheet: (sheet: GridColumn[]) => void;
  next: () => void;
 }

const ChooseSpreadsheet: FC<ChooseSpreadSheetProps> = ({ setFileName, setParsedSheet, next }) => {
  const [fileInput, setFileInput] = useState('');
  const [files, setFiles] = useState<FileList | null>();
  const [sheetOptions, setSheetOptions] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [error, setError] = useState(false);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFileInput(event.target.value);
    setFiles(event.target.files);
    setError(false);
    setSelectedSheet('');
  }, []);

  useEffect(() => {
    if (!files || files.length === 0)
      return;

    const getSheets = async () => {
      const buffer = await files[0].arrayBuffer();
      setSheetOptions(XLSX.read(buffer, {}).SheetNames)
    }
    getSheets();
  }, [files]);

  useEffect(() => {
    if (!files || files.length === 0 || !selectedSheet)
      return;
    const getBuffer = async () => {
      try {
        setFileName(files[0].name);
        const buffer = await files[0].arrayBuffer();
        const sheet = XLSX.read(buffer, { cellFormula: false }).Sheets[selectedSheet];
        
        const cellNames = Object.keys(sheet).filter(x => x !== '!ref');
        
        const cols = cellNames.map(x => x[0]).filter((x, i, self) => i === self.indexOf(x)).sort();
        const rowsDepth = Math.max(...cellNames.map(x => Number(x.slice(1))).filter((x, i, self) => i === self.indexOf(x)));

        
        const emptyGrid: GridColumn[] = cols.map(x => ({ col: x, cells: Array.from(Array(rowsDepth).keys()).map(number => ({ row: number })) }));

        const grid = emptyGrid.map(x => {
          x.cells.forEach(cell => {
            const cellName = `${ x.col }${ cell.row }`;
            if (sheet[cellName]?.w)
              cell.value = sheet[cellName]?.w
            else {
              cell.value = undefined;
              cell.willRemove = true;
            }
          })
          return x;
        });

        if (grid.length) {
          setParsedSheet(grid);
          next();
        } else {
          setError(true)
        }
      } catch (error) {
        setError(true);
      }
    }
    getBuffer();
  }, [files, selectedSheet, setFileName, setParsedSheet, next]);

  return (
  <ViewMain $dim={ !!files && files.length !== 0 }>
    <h1>
      Select a spreadsheet file to begin
    </h1>
    <input 
        type='file'
        accept='.xlsx'
        value={ fileInput }
        onChange={ event => handleInputChange(event) }
      />
      <LoadIcons className='material-symbols-outlined'>done</LoadIcons>
      { sheetOptions.length > 0 && (<>
        <h1>
          Which sheet has your casting?
        </h1>
        <SheetsList>
          {sheetOptions.map(x => <li key={x} onClick={ () => { setSelectedSheet(x); setError(false) } }>{x}</li>)}
        </SheetsList>
      </>) }
      { error && <h1>Whoops, something broke :&#40;<br />Try another file or sheet</h1> }
  </ViewMain>
)
}

const buttonStyle = css`
  background-color: orange;
  border: none;
  color: white;
  font-weight: bold;
  font-size: 1.4rem;
  padding: 6px 8px;
  margin-right: 10px;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 1px 1px 8px 2px rgba(0, 0, 0, 0.3);
  ${ mixins.textShadow }
  pointer-events: initial;
`

interface ViewStyleProps {
  $dim: boolean;
}

const ViewMain = styled.div<ViewStyleProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;

  > h1 {
    margin: 0;

    &:first-child {
      ${ props => props.$dim && 'opacity: 0.3;' }
    }
  }

  input {
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
    padding: 10px;
    background-color: ${ props => props.theme.colors.bgInner1 };
    border-radius: 8px;
    margin: 10px;
    font-size: 1.2rem;
    pointer-events: none;
    user-select: none;

    &::file-selector-button {
      ${ buttonStyle }
    }
  }
`;

const LoadIcons = styled.span`
  position: fixed;
  opacity: 0;
  pointer-events: none;
`;

const SheetsList = styled.ul`
  width: 100%;
  list-style: none;

  > li {
    ${ buttonStyle }
    max-width: max-content;
    cursor: pointer;
    margin: 8px 0;
  }
`;

export default ChooseSpreadsheet;
