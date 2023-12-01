import { FC, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import htmlToRtf from 'html-to-rtf';
import SongPreviewData from '../../models/song-preview';
import SongPreview from '../SongPreview';
import mixins from '../../styles/mixins';

interface OutputProps {
  fileName: string;
  songs: SongPreviewData[];
}

const Output: FC<OutputProps> = ({ fileName, songs }) => {
  // const [textValue, setTextValue] = useState('');
  const [ready, setReady] = useState(false);

  const output = useRef<HTMLDivElement>(null);

  // const text = useMemo(() => {
  //   const textSongs = songs.map(x => {
  //     const castings = x.cast.map(casting => `${ casting }\n`);
  //     return [`${ x.name }\n`, ...castings];
  //   });
  //   return textSongs.join('\n').replaceAll(',', '');
  // }, [songs]);

  const download = useMemo(() => {
    if (!ready || !output.current)
      return;
    return new Blob([htmlToRtf.convertHtmlToRtf(output.current?.innerHTML)], { type: 'text/plain' })
  }, [output, ready]);

  // useEffect(() => setTextValue(text), [text]);

  useEffect(() => { setTimeout(() => setReady(true), 300) }, [])

  return (
    <OutputMain>
      <h1>Save</h1>
      <h3>
        Double check for random little things, e.g. "live version" in a song title.
        <br />
        You can always change these in the text file after saving.
      </h3>
      <Outputs>
        <div>
          <Button $disabled={ !download }>
            <a href={ download && URL.createObjectURL(download) } download={ `${ fileName } - Program.rtf` }>{ download ? 'Download .rtf text' : 'Loading...' }</a>
          </Button>
          <Songs ref={ output }>{ songs.map(x => <SongPreview key={ x.name } song={ x } />) }</Songs>
        </div>
      </Outputs>
    </OutputMain>
  )
}
const OutputMain = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;

  > h1, h3 {
    color: white;
    ${ mixins.textShadowLight }
    margin: 0;
    text-align: center;
  }

  > h1 {
    margin-bottom: 20px;
  }
`;

const Outputs = styled.div`
  display: flex;

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

// const TextArea = styled.textarea`
//   min-width: 300px;
//   margin: 20px;
//   font-size: 1rem;
//   font-family: 'Arial';
// `;

const Songs = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${ props => props.theme.colors.bgInner1 };
  padding: 6px 15px;
  border-radius: 8px;
  margin: 10px;
  box-shadow: 1px 1px 10px 0px rgba(0, 0, 0, 0.5);

  > div:first-child {
    margin-top: 0;
  }
`;

interface ButtonProps {
  $disabled: boolean;
}

const Button = styled.div<ButtonProps>`
  background-color: orange;
  border-radius: 6px;
  width: max-content;
  padding: 6px 8px;
  cursor: pointer;
  margin-top: 10px;
  ${ props => props.$disabled && 'pointer-events: none; opacity: 0.5;' }

  > h3, h2 {
    ${ mixins.textShadow }
  }

  > a {
    color: white;
    margin: 0;
    text-decoration: none;
    font-size: 1.5rem;
    font-weight: bold;
    ${ mixins.textShadow }
  }
`;

export default Output;