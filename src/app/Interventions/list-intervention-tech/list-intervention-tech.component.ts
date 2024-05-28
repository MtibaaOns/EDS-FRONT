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
import { Utilisateur } from '../../parametrages/utilisateur/utilisateur';


@Component({
  selector: 'app-list-intervention-tech',
  templateUrl: './list-intervention-tech.component.html',
  styleUrl: './list-intervention-tech.component.css'
})
export class ListInterventionTechComponent implements OnInit {
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
    
    'actions',
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
    this.getInterventionsByTechnician(this.nom);

  }
  nom = localStorage.getItem('nom')

  getInterventionsByTechnician(nom: string) {

    this.interventionService.getInterventionsByTechnician(nom)
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
  

  modifier(id: number) {
    this.route.navigate(['dashboard','modifier-intervention-tech', id]);
  }
}
