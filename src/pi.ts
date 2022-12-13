import { ACTIONS } from './const'
export let ws: WebSocket | null = null
let uuid = ''

const connectElgatoStreamDeckSocket = (
  inPort: number,
  inPluginUUID: string,
  inRegisterEvent: any,
  inInfo: any,
  inActionInfo: string
) => {
  const actionInfo = JSON.parse(inActionInfo)
  let settings = actionInfo.payload.settings
  console.log({ settings })
  uuid = inPluginUUID
  ws = new WebSocket(`ws://127.0.0.1:${inPort}`)
  ws.addEventListener('open', () => {
    console.log({
      event: inRegisterEvent,
      uuid: inPluginUUID,
    })
    if (ws == null) return
    ws.send(
      JSON.stringify({
        event: inRegisterEvent,
        uuid: inPluginUUID,
      })
    )
    ws.send(
      JSON.stringify({
        event: 'getSettings',
        context: uuid,
      })
    )
  })

  ws.addEventListener('message', ({ data }) => {
    const { event, payload } = JSON.parse(data)

    switch (event) {
      case 'didReceiveGlobalSettings':
        settings = payload.settings
        break
    }
  })

  switch (actionInfo.action) {
    case ACTIONS.CLEAR_STATUS:
      const settingsGroup = document.querySelector<HTMLDivElement>('#settings-group')
      if (settingsGroup != null) {
        settingsGroup.style.display = 'none'
      }
      break
  }

  const apiToken = document.querySelector<HTMLInputElement>('#api-token')
  const statusEmoji = document.querySelector<HTMLInputElement>('#status-emoji')
  const statusText = document.querySelector<HTMLInputElement>('#status-text')
  const statusExpiration = document.querySelector<HTMLInputElement>('#status-expiration')
  const customExpiration = document.querySelector<HTMLInputElement>('#custom-expiration')
  const customExpirationWrapper = document.querySelector<HTMLInputElement>(
    '#custom-expiration-wrapper'
  )
  const presence = document.querySelector<HTMLInputElement>('#presence')
  const howtoButton = document.querySelector<HTMLButtonElement>('#howto-button')
  const getPayload = (value: string, key: string) => {
    const obj = {
      apiToken: apiToken?.value ?? '',
      statusEmoji: statusEmoji?.value ?? '',
      statusText: statusText?.value ?? '',
      statusExpiration: statusExpiration?.value ?? '',
      customExpiration: customExpiration?.value ?? '',
      presence: presence?.value ?? '',
    }
    return {
      ...obj,
      [key]: value,
    }
  }
  if (apiToken != null) {
    apiToken.value = settings?.apiToken ?? ''
    apiToken.addEventListener('change', (event: any) => {
      sendValueToPlugin(getPayload(event.target.value, 'apiToken'))
    })
  }
  if (statusEmoji != null) {
    statusEmoji.value = settings?.statusEmoji ?? ''
    statusEmoji.addEventListener('change', (event: any) => {
      sendValueToPlugin(getPayload(event.target.value, 'statusEmoji'))
    })
  }
  if (statusText != null) {
    statusText.value = settings?.statusText ?? ''
    statusText.addEventListener('change', (event: any) => {
      sendValueToPlugin(getPayload(event.target.value, 'statusText'))
    })
  }
  if (statusExpiration != null) {
    statusExpiration.value = settings?.statusExpiration ?? ''
    statusExpiration.addEventListener('change', (event: any) => {
      sendValueToPlugin(getPayload(event.target.value, 'statusExpiration'))

      if (customExpirationWrapper != null) {
        if (event.target.value === 'custom') {
          customExpirationWrapper.style.display = 'flex'
        } else {
          customExpirationWrapper.style.display = 'none'
        }
      }
    })
  }
  if (customExpirationWrapper != null && statusExpiration != null) {
    if (statusExpiration.value === 'custom') {
      customExpirationWrapper.style.display = 'flex'
    } else {
      customExpirationWrapper.style.display = 'none'
    }
  }
  if (customExpiration != null) {
    customExpiration.value = settings?.customExpiration ?? ''
    customExpiration.addEventListener('change', (event: any) => {
      sendValueToPlugin(getPayload(event.target.value, 'customExpiration'))
    })
  }
  if (presence != null) {
    presence.value = settings?.presence ?? ''
    presence.addEventListener('change', (event: any) => {
      sendValueToPlugin(getPayload(event.target.value, 'presence'))
    })
  }
  if (howtoButton != null) {
    howtoButton.addEventListener('click', () => {
      openUrl('https://github.com/ellreka/streamdeck-slack-status#setup')
    })
  }
}

const sendValueToPlugin = (payload: any) => {
  if (ws == null) return
  ws.send(
    JSON.stringify({
      event: 'setSettings',
      context: uuid,
      payload,
    })
  )
}

const openUrl = (url: string) => {
  if (ws == null) return
  ws.send(
    JSON.stringify({
      event: 'openUrl',
      context: uuid,
      payload: {
        url,
      },
    })
  )
}

;(window as any)['connectElgatoStreamDeckSocket'] = connectElgatoStreamDeckSocket
