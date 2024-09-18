import { FC, createContext, useContext, ReactNode, useMemo, useState, useEffect, useCallback } from 'react';
import GridColumn from '../models/grid-column';
import View from '../models/view';
import Correction from '../models/correction';
import OrderCorrection from '../models/order-correction';
import SongPreviewData from '../models/song-preview';



interface MakerContextProps {
  fileName: string;
  setFileName: (fileName: string) => void;
  parsedSheet: GridColumn[] | null;
  setParsedSheet: (parsedSheet: GridColumn[]) => void;
  selectedSheet: GridColumn[] | null;
  setSelectedSheet: (grid: GridColumn[] | null) => void;
  view: View;
  setView: (view: View) => void;
  correctedInstruments: Correction[];
  setCorrectedInstruments: (corrections: Correction[]) => void;
  orderCorrections: OrderCorrection[];
  setOrderCorrections: (corrections: OrderCorrection[]) => void;
  correctedStudentNames: Correction[];
  setCorrectedStudentNames: (corrections: Correction[]) => void;
  outputData: SongPreviewData[];
  restart: () => void;
  viewBack: () => void;
}

const MakerContext = createContext<MakerContextProps | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useMaker = () => {
  const makerContext = useContext(MakerContext);

  if (!makerContext)
    throw new Error(
      'maker has to be used within <MakerProvider>',
    );

  return makerContext;
};

interface MakerProviderProps {
  children: ReactNode;
}

const MakerProvider: FC<MakerProviderProps> = ({ children }) => {
  const [fileName, setFileName] = useState('');
  const [parsedSheet, setParsedSheet] = useState<GridColumn[] | null>(null);
  const [selectedSheet, setSelectedSheet] = useState<GridColumn[] | null>(null);
  const [view, setView] = useState<View>('Welcome');
  const [correctedInstruments, setCorrectedInstruments] = useState<Correction[]>([]);
  const [orderCorrections, setOrderCorrections] = useState<OrderCorrection[]>([]);
  const [correctedStudentNames, setCorrectedStudentNames] = useState<Correction[]>([]);
  const [outputData, setOutputData] = useState<SongPreviewData[]>([]);

  const restart = useCallback(() => {
    setOutputData([]);
    setCorrectedStudentNames([]);
    setCorrectedInstruments([]);
    setSelectedSheet(null);
    setParsedSheet(null);
    setFileName('');
    setView('Welcome');
  }, []);

  const viewBack = useCallback(() => {
    if (view === 'Choose Range') {
      setParsedSheet(null);
      setSelectedSheet(null);
      setFileName('');
      return setView('Welcome');
    }
    else if (view === 'Instrument Columns') {
      setCorrectedInstruments([]);
      return setView('Choose Range');
    }
    else if (view === 'Instruments Order') {
      setOrderCorrections([]);
      return setView('Instrument Columns');
    }
    else if (view === 'Student Names') {
      setCorrectedStudentNames([]);
      return setView('Instruments Order')
    }
      setOutputData([]);
      setView('Student Names');
  }, [view]);

  useEffect(() => {
    if (!selectedSheet || view !== 'Output')
      return;

    const songNames = selectedSheet[0].cells.slice(1).filter(x => x.value);

    const withInstCorrections: GridColumn[] = [...selectedSheet].map(x => {
      const correction = correctedInstruments.find(corr => corr.original === x.cells[0].value);
      const cells = [...x.cells];

      if (correction)
        cells.splice(0, 1, { ...x.cells[0], value: correction.updated });
      return { ...x, cells }
    })

    const withInstOrder: GridColumn[] = [...withInstCorrections]
      .map(x => {
      const order = orderCorrections.find(correction => correction.name === x.cells[0].value)?.order;
      return { gridColumn: x, order: order ? order + 1 : 0 }
      })
      .sort((a, b) => a.order - b.order).map(x => x.gridColumn);

    const data: SongPreviewData[] = songNames.map(song => {
      const songCastings = withInstOrder.flatMap(x => x.cells).filter(x => x.row === song.row);
      const instNamesWithCasting = songCastings.slice(1)
        .map((x, i) => { 
          return {
            instrument: String(withInstOrder[i + 1].cells[0].value) || '',
            student: String(x.value) || '',
            remove: x.willRemove,
          }
        }
        )
        .map(x => {
          const correction = correctedStudentNames.find(correction => x.student === correction.original);
          if (correction && correction.remove)
            x.remove = true;
          else if (correction)
            x.student = correction.updated;
          return x;
        })
        .filter(x => !x.remove)
        .map(x => `${ x.instrument }: ${ x.student }`);

      return { name: String(song.value), cast: instNamesWithCasting };
    });
    setOutputData(data);
  }, [selectedSheet, view, correctedInstruments, orderCorrections, correctedStudentNames]);

  const context = useMemo(() => ({
    fileName,
    setFileName,
    parsedSheet,
    setParsedSheet,
    selectedSheet,
    setSelectedSheet,
    view,
    setView,
    correctedInstruments,
    setCorrectedInstruments,
    orderCorrections,
    setOrderCorrections,
    correctedStudentNames,
    setCorrectedStudentNames,
    outputData,
    restart,
    viewBack,
  }), [
    fileName,
    setFileName,
    parsedSheet,
    setParsedSheet,
    selectedSheet,
    setSelectedSheet,
    view,
    setView,
    correctedInstruments,
    setCorrectedInstruments,
    orderCorrections,
    setOrderCorrections,
    correctedStudentNames,
    setCorrectedStudentNames,
    outputData,
    restart,
    viewBack,
  ]);

  return (
    <MakerContext.Provider value={ context }>
      { children }
    </MakerContext.Provider>
  );
};

export default MakerProvider;
