import { Injectable, inject } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Supabase } from '../database/supabase';
import { Activity } from '../../core/models/activity.model';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {
  
  private supabase = inject(Supabase).client;

  
  getAllActivities(): Observable<any> {
    return from(
      this.supabase
        .from('activities')
        .select('*')
        .then(res => res.data || [])
    );
  }

  
  createActivity(activity: any): Observable<any> {
    return from(
      this.supabase
        .from('activities')
        .insert(activity)
    );
  }
}