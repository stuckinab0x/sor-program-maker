import { FC } from 'react';
import { useMaker } from '../contexts/maker-context';
import ChooseSpreadsheet from './Views/ChooseSpreadsheet';
import ChooseRange from './Views/ChooseRange';
import FixInstrumentNames from './Views/FixInstrumentNames';
import Output from './Views/Output';
import InstrumentOrder from './Views/InstrumentOrder';
import FixStudentNames from './Views/FixStudentNames';

const CurrentView: FC = () => {
  const { fileName, outputData, view, parsedSheet, selectedSheet } = useMaker();

  if (view === 'Welcome')
    return <ChooseSpreadsheet />;
  else if (view === 'Output')
    return <Output fileName={ fileName } songs={ outputData } />
  else if (view === 'Choose Range' && parsedSheet)
    return <ChooseRange />;
  else if (!selectedSheet)
    return <h1>{ 'Something broke :(' }</h1>
  else if (view === 'Instrument Columns')
    return <FixInstrumentNames instrumentNames={ selectedSheet.slice(1).map(x => String(x.cells[0].value) || '') } />;
  else if (view === 'Instruments Order')
    return <InstrumentOrder originalNames={ selectedSheet.slice(1).map(x => String(x.cells[0].value) || '') } />
  else if (view === 'Student Names')
    return <FixStudentNames
      studentNames={ selectedSheet.slice(1).map(x => ({ ...x, cells: x.cells.slice(1) })).flatMap(x => x.cells).filter(x => x.value).map(x => String(x.value).trim()).filter((x, i, self) => i === self.indexOf(x)) }
    />
  return <h1>{ 'Something broke :(' }</h1>
}

export default CurrentView;
