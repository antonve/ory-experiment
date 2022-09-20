import { SelfServiceRegistrationFlow } from '@ory/client'
import type { NextPage, GetServerSideProps } from 'next'
import { useState } from 'react'
import Flow from '../ui/Flow'
import ory from '../src/ory'
import axios from 'axios'
import { useSession } from '../src/session'

interface Props {
  initialFlow: SelfServiceRegistrationFlow
}

const Register: NextPage<Props> = ({ initialFlow }) => {
  const [flow, setFlow] = useState(initialFlow)
  const [_, setSession] = useSession()

  const onSubmit = async (data: any) => {
    if (flow === undefined) {
      console.error('no registration flow available to use')
      return
    }

    try {
      console.log(data)
      const res = await ory.submitSelfServiceRegistrationFlow(flow.id, data)
      console.log('finished', res)
      setSession(res.data.session)
    } catch (err) {
      if (
        axios.isAxiosError(err) &&
        err.response?.data &&
        err.response.status === 400
      ) {
        // TODO: figure out types
        setFlow(err.response.data as SelfServiceRegistrationFlow)
      }
    }
  }

  return (
    <div>
      <h1>Create account</h1>
      <Flow flow={flow} method="password" onSubmit={onSubmit} />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  try {
    const { data: initialFlow, headers } =
      await ory.initializeSelfServiceRegistrationFlowForBrowsers()

    // Proxy cookies
    if (headers['set-cookie']) {
      ctx.res.setHeader('set-cookie', headers['set-cookie'])
    }

    return { props: { initialFlow } }
  } catch (err) {
    return {
      redirect: {
        statusCode: 500,
        destination: '/error',
      },
      props: {},
    }
  }
}

export default Register
