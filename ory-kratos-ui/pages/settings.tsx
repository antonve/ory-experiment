import {
  SelfServiceRegistrationFlow,
  SelfServiceSettingsFlow,
} from '@ory/client'
import type { NextPage, GetServerSideProps } from 'next'
import { useEffect, useState } from 'react'
import Flow from '../ui/Flow'
import ory from '../src/ory'
import axios from 'axios'
import { useSession } from '../src/session'

interface Props {
  initialFlow: SelfServiceSettingsFlow
}

const Settings: NextPage<Props> = () => {
  const [flow, setFlow] = useState(
    undefined as SelfServiceSettingsFlow | undefined,
  )
  const [_, setSession] = useSession()

  useEffect(() => {
    ory.initializeSelfServiceSettingsFlowForBrowsers().then(({ data }) => {
      console.log(data)
      setFlow(data)
    })
  }, [])

  if (!flow) {
    return null
  }

  const onSubmit = async (data: any) => {
    if (flow === undefined) {
      console.error('no settings flow available to use')
      return
    }

    try {
      console.log(data)
      const res = await ory.submitSelfServiceSettingsFlow(flow.id, data)
      console.log('finished', res)
      const session = await ory.toSession()
      setSession(session.data)
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
      <h2>Profile</h2>
      <Flow flow={flow} method="profile" onSubmit={onSubmit} />
      <h2>Password</h2>
      <Flow flow={flow} method="password" onSubmit={onSubmit} />
    </div>
  )
}

export default Settings
