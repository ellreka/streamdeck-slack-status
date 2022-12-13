import dayjs from 'dayjs'
import { ACTIONS } from './const'
import { setPresence, setProfile } from './slack'
import { Settings } from './type'

export let ws: WebSocket | null = null

const connectElgatoStreamDeckSocket = (
  inPort: number,
  inPluginUUID: string,
  inRegisterEvent: any,
  inInfo: any
) => {
  ws = new WebSocket(`ws://127.0.0.1:${inPort}`)
  ws.addEventListener('open', () => {
    console.log({
      event: inRegisterEvent,
      uuid: inPluginUUID,
    })
    ws?.send(
      JSON.stringify({
        event: inRegisterEvent,
        uuid: inPluginUUID,
      })
    )
  })

  ws.addEventListener('message', async e => {
    const data = JSON.parse(e.data)
    const { event, payload, action } = data
    console.table(payload?.settings)
    switch (event) {
      case 'keyDown':
        switch (action) {
          case ACTIONS.UPDATE_STATUS:
            await changeStatus(payload.settings)
            break
          case ACTIONS.CLEAR_STATUS:
            await clearStatus(payload.settings)
            break
        }
        break
    }
  })
}

const changeStatus = async (settings: Settings) => {
  const {
    statusExpiration,
    statusEmoji,
    statusText,
    apiToken,
    customExpiration,
    presence,
  } = settings
  const getExpiration = () => {
    switch (statusExpiration) {
      case '30m':
        return dayjs().add(30, 'minute').unix()
      case '1h':
        return dayjs().add(1, 'hour').unix()
      case '4h':
        return dayjs().add(4, 'hour').unix()
      case 'today':
        return dayjs().endOf('day').unix()
      case 'week':
        return dayjs().endOf('week').unix()
      case 'custom':
        return dayjs().add(Number(customExpiration), 'minute').unix()
      case '0':
      default:
        return 0
    }
  }

  const dataProfile = {
    profile: {
      status_emoji: statusEmoji,
      status_text: statusText,
      status_expiration: getExpiration(),
    },
  }
  const dataPresence = {
    presence: presence,
  }
  const profileResponse = await setProfile(apiToken, dataProfile)
  console.log(profileResponse)
  if (dataPresence.presence != '0') {
    const presenceResponse = await setPresence(apiToken, dataPresence)
    console.log(presenceResponse)
  }
}

const clearStatus = async (settings: Settings) => {
  const { apiToken } = settings
  const data = {
    profile: {
      status_emoji: '',
      status_text: '',
      status_expiration: 0,
    },
  }
  const response = await setProfile(apiToken, data)
  console.log(response)
}

;(window as any)['connectElgatoStreamDeckSocket'] = connectElgatoStreamDeckSocket
