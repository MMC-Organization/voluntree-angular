import { Component, inject, signal, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { LocationService, ViaCepResponse } from '../../../core/services/location'
import { ActivityService } from '../../../core/services/activity'
import { ActivityDetail } from '../../../core/models/activity.model'
import { Activity } from "../../../shared/components/activity/activity/activity";



@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, Activity],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class SearchComponent {
  private locationService = inject(LocationService)
  private activityService = inject(ActivityService)

  cepInput = signal('')
  userAddress = signal<ViaCepResponse | null>(null)
  loading = signal(false)
  errorMsg = signal('')
  activities = signal<ActivityDetail[]>([])
  filteredActivities = computed<ActivityDetail[]>(() => {
    const address = this.userAddress()
    const activities = this.activities()

    if (!address) return activities

    return activities.filter((act) => act.city === address.localidade)
  })

  constructor() {
    this.activityService.getAllActivities().then(({ data, error }) => {
      if (error) {
        this.errorMsg.set(error.message)
      }

      this.activities.set(data as ActivityDetail[])
    })
  }

  searchCep() {
    const cep = this.cepInput()
    if (!cep) return
    if (cep.length < 8) {
      this.errorMsg.set('CEP inválido (digite 8 números)')
      return
    }

    this.loading.set(true)
    this.errorMsg.set('')
    this.locationService.getAddressByCep(cep).subscribe({
      next: (res) => {
        if (res.erro) {
          this.errorMsg.set('CEP não encontrado!')
          this.userAddress.set(null)
        } else {
          this.userAddress.set(res)
        }
        this.loading.set(false)
      },
      error: () => {
        this.errorMsg.set('Erro ao buscar CEP. Verifique sua internet.')
        this.loading.set(false)
      },
    })
  }

  clearSearch() {
    this.cepInput.set('')
    this.userAddress.set(null)
    this.errorMsg.set('')
  }

  //viewDetails(activityId: string) {
  // console.log('ID clicado:', activityId);
  //alert(`V ${activityId}.\n(A tela de detalhes ainda será construída)`);
  //arthur isso eh pra depois n apaga
  // this.router.navigate(['/atividade', activityId]);
  // }

}
