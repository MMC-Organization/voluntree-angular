import { Injectable, inject } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { ActivityCreation, ActivityDetail, Activity } from '../models/activity.model'
import { LocationService } from './location'
import { firstValueFrom } from 'rxjs'
import { environment } from '@/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private http = inject(HttpClient)
  private locationService = inject(LocationService)

  private async fetchCsrfToken(): Promise<string | null> {
    try {
      const res: any = await firstValueFrom(this.http.get(`${environment.apiUrl}/api/auth/csrf`, { withCredentials: true }))
      return res?.token ?? null
    } catch {
      return null
    }
  }

  async getAllActivities(page = 0, size = 100) {
    try {
      const params = new HttpParams().set('page', String(page)).set('size', String(size))
      const res: any = await firstValueFrom(this.http.get<any>(`${environment.apiUrl}/api/activity`, { params, withCredentials: true }))

      const items: Activity[] = res?.content ?? []

      const detailedActivities: ActivityDetail[] = await Promise.all(
        items.map(async (activity) => {
          try {
            const address = await firstValueFrom(this.locationService.getAddressByCep(activity.cep))
            return { ...activity, city: address.localidade, state: address.uf, date: activity.activityDate }
          } catch {
            return { ...activity, date: activity.activityDate }
          }
        })
      )

      return { data: detailedActivities }
    } catch (error: any) {
      return { error }
    }
  }

  async getActivitiesByOrganization(organizationId: string | number) {
    try {
      const res: any = await firstValueFrom(this.http.get<any>(`${environment.apiUrl}/api/activity/organization/${organizationId}`, { withCredentials: true }))
      const items: Activity[] = res?.content ?? []

      const detailedActivities: ActivityDetail[] = await Promise.all(
        items.map(async (activity) => {
          try {
            const address = await firstValueFrom(this.locationService.getAddressByCep(activity.cep))
            return { ...activity, city: address.localidade, state: address.uf, date: activity.activityDate }
          } catch {
            return { ...activity, date: activity.activityDate }
          }
        })
      )

      return { data: detailedActivities }
    } catch (error: any) {
      return { error }
    }
  }

  async createActivity(activity: ActivityCreation) {
    try {
      const token = await this.fetchCsrfToken()
      const headers: any = {}
      if (token) headers['X-CSRF-TOKEN'] = token

      const data = await firstValueFrom(
        this.http.post(`${environment.apiUrl}/api/activity`, activity, { 
          withCredentials: true,
          headers 
        })
      )
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  async signupToActivity(activityId: string | number, _volunteerId?: string) {
    try {
      const res = await firstValueFrom(this.http.post(`${environment.apiUrl}/api/registration/activity/${activityId}`, null, { withCredentials: true }))
      return { data: res }
    } catch (error: any) {
      return { error }
    }
  }

  async getVolunteerActivities(_volunteerId?: string) {
    try {
      const regs: any[] = await firstValueFrom(this.http.get<any[]>(`${environment.apiUrl}/api/registration/my`, { withCredentials: true }))

      const activitiesWithNull = await Promise.all(
        regs.map(async (reg) => {
          try {
            const act: any = await firstValueFrom(
              this.http.get(`${environment.apiUrl}/api/activity/${reg.activityId}`, { withCredentials: true })
            )
            const address = await firstValueFrom(this.locationService.getAddressByCep(act.cep))
            return { ...act, city: address.localidade, state: address.uf, date: act.activityDate } as Activity | null
          } catch {
            return null
          }
        })
      )

      const activities: Activity[] = activitiesWithNull.filter(Boolean) as Activity[]

      const detailedActivities: ActivityDetail[] = activities.map((a) => ({ ...a, date: a.activityDate }))

      return { data: detailedActivities }
    } catch (error: any) {
      return { error }
    }
  }

  async unsubscribeFromActivity(activityId: string | number, _volunteerId?: string) {
    try {
      await firstValueFrom(this.http.delete(`${environment.apiUrl}/api/registration/activity/${activityId}`, { withCredentials: true }))
      return { data: true }
    } catch (error: any) {
      return { error }
    }
  }

  async getUpcomingActivities(page = 0, size = 100) {
    try {
      const params = new HttpParams().set('page', String(page)).set('size', String(size))
      const res: any = await firstValueFrom(this.http.get<any>(`${environment.apiUrl}/api/activity/upcoming`, { params, withCredentials: true }))

      const items: Activity[] = res?.content ?? []

      const detailedActivities: ActivityDetail[] = await Promise.all(
        items.map(async (activity) => {
          try {
            const address = await firstValueFrom(this.locationService.getAddressByCep(activity.cep))
            return { ...activity, city: address.localidade, state: address.uf, date: activity.activityDate }
          } catch {
            return { ...activity, date: activity.activityDate }
          }
        })
      )

      return { data: detailedActivities }
    } catch (error: any) {
      return { error }
    }
  }

  async getMyActivities(page = 0, size = 100) {
    try {
      const params = new HttpParams().set('page', String(page)).set('size', String(size))
      const res: any = await firstValueFrom(this.http.get<any>(`${environment.apiUrl}/api/activity/my-activities`, { params, withCredentials: true }))

      const items: Activity[] = res?.content ?? []

      const detailedActivities: ActivityDetail[] = await Promise.all(
        items.map(async (activity) => {
          try {
            const address = await firstValueFrom(this.locationService.getAddressByCep(activity.cep))
            return { ...activity, city: address.localidade, state: address.uf, date: activity.activityDate }
          } catch {
            return { ...activity, date: activity.activityDate }
          }
        })
      )

      return { data: detailedActivities }
    } catch (error: any) {
      return { error }
    }
  }
}