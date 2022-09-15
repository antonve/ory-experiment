import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { initRegistrationFlow, submitRegistrationFlow } from '../api'

const Register: NextPage = () => {
  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      'traits.email': 'test@example.com',
      password: 'foobar',
      'traits.display_namename': 'John Smith',
    },
  })

  const [flow, setFlow] = useState(undefined)

  useEffect(() => {
    initRegistrationFlow().then(res => setFlow(res))
  }, [])

  const onSubmit = (data: any) => {
    if (flow === undefined) {
      console.error('no registration flow available to use')
      return
    }

    console.log(flow, data)

    submitRegistrationFlow(flow, data).then(res =>
      console.log('submitted', res),
    )
  }

  return (
    <div>
      <h1>Register</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label style={{ display: 'block' }} htmlFor="email">
          Email
        </label>
        <input id="email" {...register('traits.email', { required: true })} />

        <label style={{ display: 'block' }} htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          {...register('password', { required: true })}
        />

        <label style={{ display: 'block' }} htmlFor="displayName">
          Display name
        </label>
        <input
          id="displayName"
          {...register('traits.display_namename', { required: true })}
        />

        <br />

        <input type="submit" disabled={formState.isSubmitting} />
      </form>
    </div>
  )
}

export default Register
