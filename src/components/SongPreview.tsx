import { FC } from 'react';
import styled from 'styled-components';
import SongPreviewData from '../models/song-preview';
import mixins from '../styles/mixins';

interface SongPreviewProps {
  song: SongPreviewData;
}

const SongPreview: FC<SongPreviewProps> = ({ song: { name, cast } }) => (
  <PreviewMain>
    <h2><u>{ name }</u></h2>
    { cast.map(x => <h2 key={ x }>{ x }</h2>)}
  </PreviewMain>
)

const PreviewMain = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px 0px;

  > h2 {
    margin: 0;
    ${ mixins.textShadowLight }

    &:first-of-type {
      text-decoration: underline;
    }
  }
`;

export default SongPreview;
