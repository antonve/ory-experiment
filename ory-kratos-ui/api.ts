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

async function submitRegistrationFlow(flow: any, payload: any) {
  const res = await fetch(flow.ui.action, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(payload),
  })

  return await res.json()
}

export { initLoginFlow, initRegistrationFlow, submitRegistrationFlow }
