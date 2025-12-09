import { Component, input } from '@angular/core';
import { ActivityDetail } from '../../../../core/models/activity.model';

@Component({
  selector: 'app-activity',
  imports: [],
  templateUrl: './activity.html',
  styleUrl: './activity.css',
})
export class Activity {
  activity = input.required<ActivityDetail>()
  organization = input.required<boolean>()

  formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }

}
