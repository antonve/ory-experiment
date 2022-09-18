const base = '/kratos'

async function initLoginFlow() {
  const res = await fetch(`${base}/self-service/login/browser`, {
    headers: { Accept: 'application/json' },
  })

  return await res.json()
}

async function initRegistrationFlow() {
  const res = await fetch(`${base}/self-service/registration/browser`, {
    headers: { Accept: 'application/json' },
  })

  return await res.json()
}

async function submitRegistrationFlow(
  flow: any,
  payload: any,
  csrfToken: string,
) {
  const res = await fetch(flow.ui.action, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      ...payload,
      method: 'password',
      csrf_token: csrfToken,
    }),
  })

  return await res.json()
}

export { initLoginFlow, initRegistrationFlow, submitRegistrationFlow }
