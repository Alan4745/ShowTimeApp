// types.d.ts

// Para importar archivos JSON
declare module '*.json' {
  const value: any;
  export default value;
}

// React Native Video Controls type fix
declare module 'react-native-video-controls' {
  import { Component } from 'react';
  import { VideoProperties } from 'react-native-video';
  import { StyleProp, ViewStyle } from 'react-native';

  interface VideoPlayerProps extends Omit<VideoProperties, 'source'> {
    source: { uri: string } | number; 
    toggleResizeModeOnFullscreen?: boolean;
    controlTimeout?: number;
    tapAnywhereToPause?: boolean;
    showOnStart?: boolean;
    onBack?: () => void;
    onEnd?: () => void;
    onEnterFullscreen?: () => void;
    onExitFullscreen?: () => void;
    disableFullscreen?: boolean;
    disableBack?: boolean;
    disableVolume?: boolean;
    disableTimer?: boolean;
    seekColor?: string;
    style?: StyleProp<ViewStyle>;
  }

  export default class VideoPlayer extends Component<VideoPlayerProps> {}
}

export type ChatParamList = {
  Chat: {
    name: string;
    avatar: string;
  };
};


