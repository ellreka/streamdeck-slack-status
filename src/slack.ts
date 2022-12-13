export const setProfile = async (apiToken: string, body: {}) => {
  const response = await fetch('https://slack.com/api/users.profile.set', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify(body),
  }).then(res => {
    return res.json()
  })
  return response
}

export const setPresence = async (apiToken: string, body: {}) => {
  const response = await fetch('https://slack.com/api/users.setPresence', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify(body),
  }).then(res => {
    return res.json()
  })
  return response
}
