import { Component, Inject, OnInit } from '@angular/core';
import { Societe } from '../../parametrages/societe/societe';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { UtilisateurService } from '../../parametrages/utilisateur/utilisateur.service';
import { AuthService } from '../../login/auth.service';
import { Utilisateur } from '../../parametrages/utilisateur/utilisateur';
import { TypeUser } from '../../login/model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../assets/environments/environment';
@Component({
  selector: 'app-ajouter-client',
  templateUrl: './ajouter-client.component.html',
  styleUrls: ['./ajouter-client.component.css'] // Changed 'styleUrl' to 'styleUrls'
})
export class AjouterClientComponent implements OnInit  {
  hide = true;
  societes!: Societe[];
  private apiServerUrl = environment.apiBaseUrl;
  cliForm!: FormGroup;

  public clientIdUpdate!:number;
  public isUpdateActive: boolean = false;
  constructor(
    private http: HttpClient,
    private router: Router,
    private _fb: FormBuilder,
    private authService:AuthService,
    private clientService: UtilisateurService,
    private toastService: NgToastService,
    private activatedRoute: ActivatedRoute,
   
   
  ){}
  ngOnInit(): void {
    this.cliForm = this._fb.group({
     
      nom: [''],
      prenom: [''],
     adresse: [''],
      email: [''],
      tel:[''],
      role:[TypeUser.CLIENT],
      login: ['', Validators.required],
      password: ['', Validators.required],
      raisonSocial:[''],
      mf: [''],
      specialite: null
    });
  
    this.getRaisonsSociales().subscribe(societes => {
      this.societes = societes;
    });
 
    this.activatedRoute.params.subscribe(val => {
      this.clientIdUpdate = val['id'];
      if (this.clientIdUpdate) {
        this.isUpdateActive = true;
        this.clientService.getUtilisateurById(this.clientIdUpdate).subscribe({
          next: (client) => {
            this.fillFormToUpdate(client);
          },
          error: (err) => {
            console.log(err);
          }
        });
      }
    });
    this.getRaisonsSociales().subscribe(societes => {
      this.societes = societes;
    });
    if (this.cliForm) {
      this.cliForm.get('raisonSocial')?.valueChanges.subscribe(val => {
        if (val) {
          const societe = this.societes.find(s => s.raisonSocial === val);
          if (societe) {
            this.cliForm.get('mf')?.setValue(societe.mf);
          }
        }
      });
    }
  }
  onFormSubmit() {
    this.authService.register(this.cliForm.value).subscribe(
      res => {
        this.toastService.success({detail:"Success",summary:"client ajouté",duration:3000});
        this.router.navigate(['dashboard','liste_client']);
        this.cliForm.reset();
      },
      
    );
  }
  modifier() {
    const client = this.cliForm.value;
    const id = this.clientIdUpdate;
    const {  nom,prenom,adresse,tel,role,email,password,login,mf,raisonSocial,specialite } = client;
  
    this.clientService.updateUtilisateur(client, id, nom,prenom,adresse,tel,role,email,password,raisonSocial,specialite)
      .subscribe(res => {
        this.toastService.success({ detail: 'SUCCESS', summary: 'Les détails du client ont été mis à jour avec succès', duration: 3000 });
        this.router.navigate(['dashboard','liste_client']);
        this.cliForm.reset();
      });
  }
  fillFormToUpdate(client: Utilisateur) {
  
      this.cliForm.setValue({
        nom: client.nom,
        prenom: client.prenom,
        adresse: client.adresse,
        email: client.email,
        tel: client.tel,
        role: client.role,
        login: client.login,
        password: client.password,
        raisonSocial: client.raisonSocial,
        mf: client.mf,
        specialite: client.specialite
      });
    
  }
  getRaisonsSociales(): Observable<Societe[]> {
    return this.http.get<Societe[]>(this.apiServerUrl + '/Sociétés/all');
  }
  }