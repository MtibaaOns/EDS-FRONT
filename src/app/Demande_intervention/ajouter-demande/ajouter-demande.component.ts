import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';
import { Demande } from '../dem_interv.model';
import { DemIntervService } from '../dem-interv.service';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../assets/environments/environment';
import { Observable } from 'rxjs';
import { Utilisateur } from '../../parametrages/utilisateur/utilisateur';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

@Component({
  selector: 'app-ajouter-demande',
  templateUrl: './ajouter-demande.component.html',
  styleUrls: ['./ajouter-demande.component.css']
})
export class AjouterDemandeComponent implements OnInit {
  role!: string;
  clientId!: number;
  clients!: Utilisateur[];
  private apiServerUrl = environment.apiBaseUrl;
  prioriteOptions: string[] = ["Haute", "Moyenne", "Basse"];
  campaignOne = new FormGroup({
    start: new FormControl(new Date(year, month, 13)),
    end: new FormControl(new Date(year, month, 16)),
  });
  campaignTwo = new FormGroup({
    start: new FormControl(new Date(year, month, 15)),
    end: new FormControl(new Date(year, month, 19)),
  });
  demandeForm!: FormGroup;
  public demandeIdUpdate!: number;
  public isUpdateActive: boolean = false;
  lastCodeNumber: number = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    private _fb: FormBuilder,
    private demandeService: DemIntervService,
    private toastService: NgToastService,
    private activateactiveroute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    
    this.demandeForm = this._fb.group({
      code: ['', Validators.required],
      client: ['', Validators.required],
      dateDeb: ['', [Validators.required, this.validateDateRange.bind(this)]],
      dateFin: ['', [Validators.required, this.validateDateRange.bind(this)]],
      titre: ['', Validators.required],
      priorite: ['', Validators.required],
      description: ['', Validators.required],
      clientId:['']
    });

    this.activateactiveroute.params.subscribe(val => {
      this.demandeIdUpdate = val['numDem'];
      if (this.demandeIdUpdate) {
        this.isUpdateActive = true;
        this.demandeService.getDemandeBynumDem(this.demandeIdUpdate).subscribe({
          next: (demande) => {
            this.fillFormToUpdate(demande);
          },
          error: (err) => {
            console.log(err);
          }
        });
      } else {
        this.generateCode(); // Appel de la méthode generateCode()
      }
    });
    this.demandeForm.setValidators(this.validateDateRange.bind(this));
    this.getUtilisateursByRole('CLIENT').subscribe(clients => {
      this.clients = clients;
    });
    
  }

  onFormSubmit() {
    if (this.demandeForm.invalid) {
      this.toastService.error({ detail: 'Erreur', summary: 'Veuillez remplir le formulaire de nouveau', duration: 3000 });
    } else {
      // Générer le code de l'intervention
      this.generateCode();
  
      const clientId = localStorage.getItem('clientId');
      const demande: Demande = {
        numDem: 0, // Ajoutez la propriété numDem avec une valeur par défaut
        code: this.demandeForm.value.code,
        client: this.demandeForm.value.client,
        titre: this.demandeForm.value.titre,
        priorite: this.demandeForm.value.priorite,
        dateDeb: this.demandeForm.value.dateDeb,
        dateFin: this.demandeForm.value.dateFin,
        description: this.demandeForm.value.description,
        clientId: parseInt(clientId!)
      };
  
      if (this.isUpdateActive) {
        this.modifier();
      } else {
        this.demandeService.addDemande(demande).subscribe({
          next: (res: any) => {
            this.toastService.success({ detail: "Succès", summary: "Demande ajoutée", duration: 3000 });
            this.router.navigate(['liste_demande']); // Redirigez vers la liste des demandes
            this.demandeForm.reset();
          },
          error: (error: any) => {
            console.error(error);
          }
        });
      }
    }
  }

  modifier() {
    const demande = this.demandeForm.value;
    const numDem = this.demandeIdUpdate;
    const { client, titre, priorite, dateDeb, dateFin, description } = demande;

    this.demandeService.updateDemande(demande, numDem, client, titre, priorite, dateDeb, dateFin, description)
      .subscribe(res => {
        this.toastService.success({ detail: 'SUCCESS', summary: 'Les détails du demande ont été mis à jour avec succès', duration: 3000 });
        this.router.navigate(['liste_demande']);
        this.demandeForm.reset();
      });
  }

  fillFormToUpdate(demande: Demande) {
    this.demandeForm.patchValue({
      code: demande.code,
      client: demande.client,
      titre: demande.titre,
      priorite: demande.priorite,
      dateDeb: demande.dateDeb,
      dateFin: demande.dateFin,
      description: demande.description,
    });
  }

  date = new FormControl(new Date());
  serializedDate = new FormControl(new Date().toISOString());
  generateCode(): void {
    this.demandeService.getAllDemandes().subscribe((demandes) => {
      const lastContrat = demandes[demandes.length - 1];
      const lastCode = lastContrat ? lastContrat.code : 'dem-00';
      const lastNumber = parseInt(lastCode.split('-')[1]);
      this.lastCodeNumber = lastNumber;
      const newCode = `dem-${(this.lastCodeNumber + 1).toString().padStart(2, '0')}`;
      this.demandeForm.patchValue({ code: newCode });
    });
  }
  getUtilisateursByRole(role: string): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.apiServerUrl}/Utilisateur/role/${role}`);
  }

  // Validation personnalisée pour la date de début et de fin
  validateDateRange(control: AbstractControl): { [key: string]: boolean } | null {
    const startDate = control.get('dateDeb')?.value;
    const endDate = control.get('dateFin')?.value;

    if (startDate && endDate) {
      const startDateTime = new Date(startDate).getTime();
      const endDateTime = new Date(endDate).getTime();

      if (startDateTime > endDateTime) {
        control.get('dateDeb')?.setErrors({ 'dateRangeError': true });
        control.get('dateFin')?.setErrors({ 'dateRangeError': true });
        return { 'dateRangeError': true };
      } else if (startDateTime === endDateTime) {
        control.get('dateDeb')?.setErrors({ 'dateEqualityError': true });
        control.get('dateFin')?.setErrors({ 'dateEqualityError': true });
        return { 'dateEqualityError': true };
      } else {
        control.get('dateDeb')?.setErrors(null);
        control.get('dateFin')?.setErrors(null);
      }
    }

    return null;
  }
}