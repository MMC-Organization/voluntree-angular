export interface ActivityCreation {
  name: string
  description?: string
  spots: number
  cep: string
  number?: string | null
  activityDate: string
  organizationId?: string | number
}

export interface Activity {
  id: number | string
  name: string
  description?: string
  spots: number
  cep: string
  number?: string | null
  activityDate: string
  date?: string
  organizationId?: number | string
  organizationName?: string
  organizationCompanyName?: string
  canceled?: boolean
}

export interface ActivityDetail extends Activity {
  city?: string
  state?: string
}
