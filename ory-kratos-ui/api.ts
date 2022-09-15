const base = '/kratos'

async function initLogin() {
  const res = await fetch(`${base}/self-service/login/browser`, {
    headers: { Accept: 'application/json' },
  })

  return await res.json()
}

export { initLogin }
