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

  createActivity(activity: ActivityCreation) {
    return this.supabase.from('activity').insert({
      ...activity,
      organizationId: undefined,
      organization_id: activity.organizationId,
    })
  }
}
