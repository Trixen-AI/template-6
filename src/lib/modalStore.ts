// Which social modal (x / facebook / telegram) is open. Shared by the modals and their triggers.
let openModal: string | null = null
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

export const modalStore = {
  open(name: string) {
    openModal = name
    emit()
  },
  close() {
    openModal = null
    emit()
  },
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  get: () => openModal,
}
