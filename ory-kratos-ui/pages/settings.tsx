import {
  SelfServiceRegistrationFlow,
  SelfServiceSettingsFlow,
} from '@ory/client'
import type { NextPage, GetServerSideProps } from 'next'
import { useState } from 'react'
import Flow from '../ui/Flow'
import ory from '../src/ory'
import axios from 'axios'

interface Props {
  initialFlow: SelfServiceSettingsFlow
}

const Settings: NextPage<Props> = ({ initialFlow }) => {
  const [flow, setFlow] = useState(initialFlow)

  const onSubmit = async (data: any) => {
    if (flow === undefined) {
      console.error('no settings flow available to use')
      return
    }

    try {
      console.log(data)
      const res = await ory.submitSelfServiceSettingsFlow(flow.id, data)
      console.log('finished', res)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data) {
        // TODO: figure out types
        setFlow(err.response.data as SelfServiceSettingsFlow)
      }
    }
  }

  return (
    <div>
      <h1>Settings</h1>
      <Flow flow={flow} method="password" onSubmit={onSubmit} />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  try {
    const { data: initialFlow, headers } =
      await ory.initializeSelfServiceSettingsFlowForBrowsers(undefined, {
        headers: {
          cookie: ctx.req.headers.cookie,
        },
      })

    // Proxy cookies
    if (headers['set-cookie']) {
      ctx.res.setHeader('set-cookie', headers['set-cookie'])
    }

    return { props: { initialFlow } }
  } catch (err) {
    console.error(err)
    return {
      redirect: {
        destination: '/login',
      },
      props: {},
    }
  }
}

export default Settings
