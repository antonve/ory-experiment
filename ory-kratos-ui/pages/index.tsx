import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

const Home: NextPage = () => (
  <div>
    <Link href="/login"><a>Log in</a></Link><br />
    <Link href="/register"><a>Register</a></Link>
  </div>
)

export default Home
