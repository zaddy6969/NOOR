"use client";

import { useMediaPlayer } from "../media/MediaProvider";

type Props = {
  slug: string;
  title: string;
  performer: string;
  channel: string;
  spotifyId: string;
  youtubeId: string;
};

export default function NaatMediaButtons({ slug, title, performer, channel, spotifyId, youtubeId }: Props) {
  const { play } = useMediaPlayer();
  return (
    <div className="naat-detail-media-buttons">
      <button type="button" onClick={() => play({ kind: "spotify", id: `spotify-${slug}`, title, subtitle: `${performer} · Spotify`, spotifyId })}><span aria-hidden="true">▶</span><strong>Listen audio</strong><small>Audio-only player</small></button>
      <button type="button" onClick={() => play({ kind: "video", id: `video-${slug}`, title, subtitle: `${performer} · ${channel}`, youtubeId })}><span aria-hidden="true">▣</span><strong>Play video</strong><small>{channel}</small></button>
    </div>
  );
}
