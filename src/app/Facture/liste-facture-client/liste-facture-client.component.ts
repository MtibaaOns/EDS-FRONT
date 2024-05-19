import {Component, OnInit, ViewChild } from '@angular/core';
import { Facture } from '../facture.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FactureService } from '../facture.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-liste-facture-client',
  templateUrl: './liste-facture-client.component.html',
  styleUrl: './liste-facture-client.component.css'
})
export class ListeFactureClientComponent  implements OnInit {
  public dataSource!: MatTableDataSource<Facture>;
  public factures!: Facture[];


  displayedColumns: string[] = [
    'code',
    'date',
    'client',
    'totalHT',
    'tva',
    'totalTTC',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private factureservice: FactureService,
    private route: Router,
    private toastService: NgToastService
  ) {}

  ngOnInit(): void {

      // @ts-ignore
    this.getFactureByClient(this.nom);

  }
  nom = localStorage.getItem('nom')

  getFactureByClient(nom: string) {

    this.factureservice.getFactureByClient(nom)
      .subscribe({
        next: (res) => {
          this.factures = res;
          this.dataSource = new MatTableDataSource(this.factures);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  /*ngOnInit(): void {
    this.loadInterventionsByTechnician('NomTechnicien');
  }

  loadInterventionsByTechnician(technician: string): void {
    this.interventionService.getInterventionsByTechnician(technician)
      .subscribe(interventions => {
        this.interventions = interventions;
      });
  }*/



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  
}

