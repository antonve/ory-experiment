import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { initRegistrationFlow, submitRegistrationFlow } from '../api'
import Flow, { SelfServiceFlow } from '../ui/Flow'

const Register: NextPage = () => {
  const [flow, setFlow] = useState(undefined)

  useEffect(() => {
    initRegistrationFlow().then(res => setFlow(res))
  }, [])

  return (
    <div>
      <h1>Register</h1>
      <Flow
        flow={flow}
        method="password"
        setFlow={(flow: any) => setFlow(flow)}
      />
    </div>
  )
}

export default Register
