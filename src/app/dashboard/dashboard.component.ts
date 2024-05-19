import { Component, OnInit } from '@angular/core';
import { Contrat } from '../Contrat/contrat.model';
import { ContratService } from '../Contrat/contrat.service';
import { Facture } from '../Facture/facture.model';
import { FactureService } from '../Facture/facture.service';
import { Intervention } from '../Interventions/intervention.model';
import { InterventionService } from '../Interventions/intervention.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
role :string | null = localStorage.getItem('role');
  contrats: Contrat[] = [];
  interventions : Intervention[]=[]
  factures : Facture[]=[]
  s: number = 0;
  nb: number = 0;
  satisfaction: number = 50; // Ajouter une propriété pour le pourcentage de satisfaction

  constructor(private contratService: ContratService, private factureService: FactureService, private interventionService : InterventionService,private router: Router) { }
  isActive: boolean = false;
  ngOnInit() {
    this.checkRoute(); // Appel de la méthode checkRoute pour mettre à jour isActive
    this.getAllContrats();
    this.getAllInterventions();
    this.getAllFactures();
  }
  checkRoute() {
    this.isActive = this.router.url === '/dashboard';
  }

  getAllContrats() {
    this.contratService.getContratsForToday()
      .subscribe({
        next: (res) => {
          this.contrats = res;
          this.nb = this.contrats.length;
          console.log(this.nb);
          this.s = this.contrats.reduce((total, element) => total + Number(element.mtForfaitaire), 0);
          console.log(this.s);
        },
        error: (err) => {
          console.log(err);
        }
      });
  }
  nbf:number=0;

  getAllFactures() {
    this.factureService.getFacturesForToday()
      .subscribe({
        next: (res) => {
          this.factures = res;
          this.nbf=this.factures.length;
          console.log("nb de factures aujourd'hui :",this.nbf);

        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  nbi:number=0;
  getAllInterventions() {

    this.interventionService.getInterventionsForToday()
      .subscribe({
        next: (res) => {
          this.interventions = res;
          this.nbi=this.interventions.length;
          console.log("nb d'intervention aujourd'hui : ",this.nbi);

        },
        error: (err) => {
          console.log(err);
        }
      });
  }


  getSatisfactionEmoji(): string {
    if (this.satisfaction >= 80) {
      return '😃'; // Very satisfied
    } else if (this.satisfaction >= 60) {
      return '🙂'; // Satisfied
    } else if (this.satisfaction >= 40) {
      return '😐'; // Neutral
    } else if (this.satisfaction >= 20) {
      return '🙁'; // Unsatisfied
    } else {
      return '😢'; // Very unsatisfied
    }
  }
}
