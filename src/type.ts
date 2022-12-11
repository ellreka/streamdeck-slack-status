export interface Settings {
  apiToken: string
  statusText: string
  statusEmoji: string
  statusExpiration: '0' | '30m' | '1h' | '4h' | 'today' | 'week' | 'custom'
  customExpiration: string
  presence: string
}
