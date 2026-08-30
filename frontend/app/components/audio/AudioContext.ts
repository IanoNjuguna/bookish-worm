import { createContext } from 'react'
import type { AudioContextType } from './AudioPlayer.types'

export const AudioContext = createContext<AudioContextType | null>(null)
