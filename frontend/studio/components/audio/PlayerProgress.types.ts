export interface PlayerProgressProps {
  currentTime: number
  duration: number
  onSeek: (time: number) => void
  variant?: 'desktop' | 'mobile'
}
