import { atom, useAtom } from 'jotai'
import { Session } from '@ory/client'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const sessionAtom = atom(undefined as undefined | Session)

export const useSession = () => {
  return useAtom(sessionAtom)
}

// Used to prevent access to a page when a user is not authenticated
export const useProtectedRoute = (fallback: string = '/') => {
  const [session] = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session) {
      router.replace(fallback)
    }
  }, [session])
}

// Used to prevent access to a page when a user is authenticated
export const useAnonymouseRoute = (fallback: string = '/') => {
  const [session] = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.replace(fallback)
    }
  }, [session])
}
