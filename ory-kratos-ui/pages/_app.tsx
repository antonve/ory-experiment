import App, { AppContext, AppProps } from 'next/app'
import Link from 'next/link'
import ory from '../src/ory'

const MyApp = ({ Component, pageProps }: AppProps) => (
  <div>
    <Link href="/login">
      <a>Log in</a>
    </Link>
    <br />
    <Link href="/register">
      <a>Register</a>
    </Link>
    <hr />
    <Component {...pageProps} />
  </div>
)

MyApp.getInitialProps = async (ctx: AppContext) => {
  // TODO: Refactor
  const props = await App.getInitialProps(ctx)

  const cookie = ctx.ctx.req?.headers.cookie
  if (cookie) {
    try {
      const { data: session } = await ory.toSession(undefined, cookie)
      return { ...props, session }
    } catch (err) {}
  }

  return { ...props }
}

export default MyApp
