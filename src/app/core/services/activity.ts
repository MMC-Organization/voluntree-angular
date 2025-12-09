import { Injectable, inject } from '@angular/core'
import { Supabase } from './database/supabase'
import { ActivityCreation, ActivityDetail } from '../models/activity.model'
import { LocationService } from './location'
import { firstValueFrom } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private supabase = inject(Supabase).client
  private locationService = inject(LocationService)

  async getAllActivities() {
    const { data, error } = await this.supabase.from('activity').select('*')
    
    if (error || !data) {
      return {error}
    }

     const detailedActivities: ActivityDetail[] = await Promise.all(data.map(async activity => {
        const address = await firstValueFrom(this.locationService.getAddressByCep(activity.cep))

        return {...activity, city: address.localidade, state: address.uf}
      })
     )
    
    return {data: detailedActivities}
  }

  async getActivitiesByOrganization(organizationId: string) {
    const { data, error } = await this.supabase
      .from('activity')
      .select('*')
      .eq('organization_id', organizationId)
    
    if (error || !data) {
      return { error }
    }

    const detailedActivities: ActivityDetail[] = await Promise.all(
      data.map(async activity => {
        const address = await firstValueFrom(this.locationService.getAddressByCep(activity.cep))
        return { ...activity, city: address.localidade, state: address.uf }
      })
    )
    
    return { data: detailedActivities }
  }

  createActivity(activity: ActivityCreation) {
    return this.supabase.from('activity').insert({
      ...activity,
      organizationId: undefined,
      organization_id: activity.organizationId,
    })
  }

  // 
  async signupToActivity(activityId: string | number, volunteerId: string) {
    const activityIdNumeric = typeof activityId === 'string' ? Number(activityId) : activityId

    if (Number.isNaN(activityIdNumeric)) {
      return { error: { message: 'ID da atividade inválido.' } }
    }
    const { data: existing, error: selErr } = await this.supabase
      .from('signup')
      .select('volunteer_id')
      .eq('activity_id', activityIdNumeric)
      .eq('volunteer_id', volunteerId)
      .maybeSingle()

    if (selErr) {
      return { error: selErr }
    }

    if (existing) {
      return { error: { message: 'Você já está inscrito nessa atividade.' } }
    }

    //inscri naa signup
    const insert = await this.supabase.from('signup').insert({
      volunteer_id: volunteerId,
      activity_id: activityIdNumeric,
    })

    return insert
  }
}