export interface Stream {
  id: string;
  platform: 'twitch' | 'youtube';
  channelName: string;
  title?: string;
  isLive?: boolean;
}

export interface Layout {
  id: string;
  name: string;
  rows: number;
  columns: number;
}

export interface StreamPosition {
  streamId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}