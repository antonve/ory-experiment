import type { NextPage } from 'next'
import { useForm } from 'react-hook-form'

const Login: NextPage = () => {
  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      email: 'test@example.com',
      password: 'foobar',
    },
  })

  const onSubmit = (data: any) => console.log(data, formState)

  return (
    <div>
      <h1>Log in</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label style={{ display: 'block' }} htmlFor="email">
          Email
        </label>
        <input id="email" {...register('email', { required: true })} />

        <label style={{ display: 'block' }} htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          {...register('password', { required: true })}
        />

        <br />

        <input type="submit" />
      </form>
    </div>
  )
}

export default Login
