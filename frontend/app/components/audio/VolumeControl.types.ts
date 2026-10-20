export interface VolumeControlProps {
  volume: number
  isMuted: boolean
  onToggleMute: () => void
  onSetVolume: (volume: number) => void
}
