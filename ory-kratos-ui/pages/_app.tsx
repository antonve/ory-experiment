import type { AppProps } from 'next/app'
import Link from 'next/link'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Link href="/login"><a>Log in</a></Link><br />
      <Link href="/register"><a>Register</a></Link><hr />
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
