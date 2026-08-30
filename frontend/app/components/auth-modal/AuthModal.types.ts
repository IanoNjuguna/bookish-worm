export interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (token: string) => void
}
