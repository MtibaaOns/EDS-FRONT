import {Component, OnInit, ViewChild } from '@angular/core';
import { Intervention } from '../intervention.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { InterventionService } from '../intervention.service';
import { NgToastService } from 'ng-angular-popup';
import { PieceRechange } from '../../PieceRechange/piece-rechange.model';

@Component({
  selector: 'app-liste-intervention-client',
  templateUrl: './liste-intervention-client.component.html',
  styleUrl: './liste-intervention-client.component.css'
})
export class ListeInterventionClientComponent implements OnInit {
  public dataSource!: MatTableDataSource<Intervention>;
  public interventions!: Intervention[];
  pieceRechanges: PieceRechange[] = [];

  displayedColumns: string[] = [
    'code',
    'dateDeb',
    'dateFin',
    'duree',
    'observation',
    'cloturer',
    'montantHT',
    'facturer',
    'cause',
    'technicien',
    'client',
    'pieceRechange',
    
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private interventionService: InterventionService,
    private route: Router,
    private toastService: NgToastService
  ) {}

  ngOnInit(): void {

      // @ts-ignore
    this.getInterventionsByClient(this.nom);

  }
  nom = localStorage.getItem('nom')

  getInterventionsByClient(nom: string) {

    this.interventionService.getInterventionsByClient(nom)
      .subscribe({
        next: (res) => {
          this.interventions = res;
          this.dataSource = new MatTableDataSource(this.interventions);
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

