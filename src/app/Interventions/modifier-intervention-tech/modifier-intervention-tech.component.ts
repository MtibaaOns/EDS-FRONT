import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { InterventionService } from '../intervention.service';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';
import { Intervention } from '../intervention.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../assets/environments/environment';
import { Observable, map } from 'rxjs';
import { Cause } from '../../Cause/cause.model';
import { Utilisateur } from '../../parametrages/utilisateur/utilisateur';
import { PieceRechange } from '../../PieceRechange/piece-rechange.model';
import { IntervPieceService } from '../../IntervPiece/interv-piece.service';
import { IntervPiece } from '../../IntervPiece/IntervPiece.model';

@Component({
  selector: 'app-modifier-intervention-tech',
  templateUrl: './modifier-intervention-tech.component.html',
  styleUrl: './modifier-intervention-tech.component.css'
})
export class ModifierInterventionTechComponent implements OnInit {
  dureeOptions: string[] = ['30 minutes', '1 heure', '2 heures', '3 heures', '4 heures', '5 heures', '6 heures', '7 heures', '8 heures', '9 heures', '10 heures', '11 heures', '12 heures', '13 heures', '14 heures', '15 heures', '16 heures', '17 heures', '18 heures', '19 heures', '20 heures', '21 heures', '22 heures', '23 heures', '24 heures'];
  interventionTechForm!: FormGroup;
  public interventionIdUpdate!: number;
  public isUpdateActive: boolean = true;

  constructor(
    private _fb: FormBuilder,
    private interventionService: InterventionService,
    private toastService: NgToastService,
    private activateactiveroute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.interventionTechForm = this._fb.group({
      duree: ['', Validators.required],
      cloturer: [false, Validators.required]
    });

    this.activateactiveroute.params.subscribe(val => {
      this.interventionIdUpdate = val['id'];
      if (this.interventionIdUpdate) {
        this.isUpdateActive = true;
        this.interventionService.getInterventionById(this.interventionIdUpdate).subscribe({
          next: (intervention) => {
            this.fillFormToUpdate(intervention);
          },
          error: (err) => {
            console.log(err);
          }
        });
      }
    });
  }

  modifier() {
    if (this.interventionTechForm.invalid) {
      this.toastService.error({ detail: 'Erreur', summary: 'Veuillez remplir le formulaire correctement', duration: 3000 });
    } else {
      const intervention = this.interventionTechForm.value;
      const id = this.interventionIdUpdate;
      const { duree, cloturer } = intervention;

      this.interventionService.updateInterventiontech(intervention, id, duree, cloturer).subscribe({
        next: (res) => {
          this.toastService.success({ detail: 'Succès', summary: 'Intervention modifiée avec succès', duration: 3000 });
          this.router.navigate(['/dashboard/liste_interventionstech']);
          this.interventionTechForm.reset();
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }

  fillFormToUpdate(intervention: any) {
    this.interventionTechForm.patchValue({
      duree: intervention.duree,
      cloturer: intervention.cloturer
    });
  }
}
