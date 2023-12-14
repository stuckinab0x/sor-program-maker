import { FC, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import htmlToRtf from 'html-to-rtf';
import SongPreviewData from '../../models/song-preview';
import SongPreview from '../SongPreview';
import mixins from '../../styles/mixins';
import Button from '../../styles/Button';
import Divider from '../../styles/Divider';

interface OutputProps {
  fileName: string;
  songs: SongPreviewData[];
}

const Output: FC<OutputProps> = ({ fileName, songs }) => {
  const [ready, setReady] = useState(false);

  const output = useRef<HTMLDivElement>(null);

  const download = useMemo(() => {
    if (!ready || !output.current)
      return;
    return new Blob([htmlToRtf.convertHtmlToRtf(output.current?.innerHTML)], { type: 'text/plain' })
  }, [output, ready]);

  useEffect(() => { setTimeout(() => setReady(true), 300) }, [])

  return (
    <OutputMain>
      <h1>Save</h1>
      <Divider />
      <h3>
        Double check for random little things, e.g. "live version" in a song title.
        <br />
        You can always change these in the text file after saving.
      </h3>
      <Outputs>
        <div>
          <DownloadButton $disabled={ !download }>
            <a href={ download && URL.createObjectURL(download) } download={ `${ fileName } - Program.rtf` }>{ download ? 'Download .rtf text' : 'Loading...' }</a>
          </DownloadButton>
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
    ${ mixins.textShadowLight }
    margin: 0;
    text-align: center;
  }

  > h3 {
    font-style: italic;
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

const Songs = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${ props => props.theme.colors.bgInner1 };
  padding: 6px 15px;
  border-radius: 8px;
  margin: 10px;
  ${ mixins.boxShadow }

  > div:first-child {
    margin-top: 0;
  }
`;

const DownloadButton = styled(Button)`
  padding: 6px 8px;
  margin-top: 10px;
  ${ props => props.$disabled && 'pointer-events: none; opacity: 0.5;' }

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
