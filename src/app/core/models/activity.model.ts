export interface ActivityCreation {
  name: string
  description: string
  cep: string
  number: string | null
  date: string
  spots: number
  organizationId: string
}

export interface Activity extends ActivityCreation {
  id: string
}

export interface ActivityDetail extends Activity {
  city: string
  state: string
}
