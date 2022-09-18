import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { initRegistrationFlow, submitRegistrationFlow } from '../api'
import Flow from '../ui/Flow'

const Register: NextPage = () => {
  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      'traits.email': 'test@example.com',
      password: 'fogewgewgwefewewfewgewgewdsf',
      'traits.display_namename': 'John Smith',
    },
  })

  const [flow, setFlow] = useState(undefined)

  useEffect(() => {
    initRegistrationFlow().then(res => setFlow(res))
  }, [])

  return (
    <div>
      <h1>Register</h1>

      <Flow flow={flow} method="password" />
    </div>
  )
}

export default Register
