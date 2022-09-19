import { atom, useAtom } from 'jotai'
import { Session } from '@ory/client'

export const sessionAtom = atom(undefined as undefined | Session)

export const useSession = () => {
  return useAtom(sessionAtom)
}
