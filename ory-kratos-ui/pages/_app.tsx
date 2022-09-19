import App, { AppContext, AppProps } from 'next/app'
import Link from 'next/link'
import ory from '../src/ory'
import { Atom, Provider } from 'jotai'
import { sessionAtom, useSession } from '../src/session'
import { Session } from '@ory/client'
import { useRouter } from 'next/router'

interface Props {
  initialState: {
    session: Session | undefined
  }
}

const createInitialValues = () => {
  const initialValues: (readonly [Atom<unknown>, unknown])[] = []
  const get = () => initialValues
  const set = function <Value>(anAtom: Atom<Value>, value: Value) {
    initialValues.push([anAtom, value])
  }
  return { get, set }
}

const MyApp = ({ Component, pageProps }: AppProps<Props>) => {
  const { initialState } = pageProps
  const { get: getInitialValues, set: setInitialValues } = createInitialValues()

  setInitialValues(sessionAtom, initialState.session)

  return (
    <Provider initialValues={getInitialValues()}>
      <div>
        <Header />
        <hr />
        <Component {...pageProps} />
      </div>
    </Provider>
  )
}

const Header = () => {
  const [session] = useSession()
  const router = useRouter()

  if (session) {
    const logOut = async () => {
      try {
        const { data } = await ory.createSelfServiceLogoutFlowUrlForBrowsers()
        router.replace(data.logout_url)
      } catch (err) {
        // TODO
        console.error(err)
      }
    }

    return (
      <>
        <Link href="/">
          <a>Home</a>
        </Link>
        <br />
        <Link href="/private">
          <a>Protected page</a>
        </Link>
        <br />
        <Link href="/settings">
          <a>Settings</a>
        </Link>
        <br />
        <a href="#" onClick={logOut}>
          Log out
        </a>
      </>
    )
  }

  return (
    <>
      <Link href="/">
        <a>Home</a>
      </Link>
      <br />
      <Link href="/login">
        <a>Log in</a>
      </Link>
      <br />
      <Link href="/register">
        <a>Register</a>
      </Link>
    </>
  )
}

MyApp.getInitialProps = async (ctx: AppContext) => {
  const props = await App.getInitialProps(ctx)
  props.pageProps.initialState = { session: undefined }

  const cookie = ctx.ctx.req?.headers.cookie
  if (cookie) {
    try {
      const { data: session } = await ory.toSession(undefined, cookie)
      props.pageProps.initialState.session = session
    } catch (err) {}
  }

  return props
}

export default MyApp
