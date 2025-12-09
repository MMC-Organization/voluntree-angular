import { ComponentFixture, TestBed } from '@angular/core/testing'
import { OngLayout } from './ong-layout'

describe('OngLayout', () => {
  let component: OngLayout
  let fixture: ComponentFixture<OngLayout>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OngLayout],
    }).compileComponents()

    fixture = TestBed.createComponent(OngLayout)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
