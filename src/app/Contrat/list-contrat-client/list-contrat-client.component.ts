import { Component, OnInit, ViewChild } from '@angular/core';
import { Contrat } from '../contrat.model';
import { HttpErrorResponse } from '@angular/common/http';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
import { ContratService } from '../contrat.service';
import { NgToastService } from 'ng-angular-popup';


@Component({
  selector: 'app-list-contrat-client',
  templateUrl: './list-contrat-client.component.html',
  styleUrl: './list-contrat-client.component.css'
})
export class ListContratClientComponent implements OnInit{
  public dataSource!: MatTableDataSource<Contrat>
  public contrats!: Contrat[];


  displayedColumns: string[] = ['code', 'dateDebut', 'dateFin', 'nbInterMois', 'nbInterAnnee', 'mtForfaitaire','client'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private contratService : ContratService, private route: Router, private toastService: NgToastService) { }

  ngOnInit() {
      // @ts-ignore
  this.getContratsByClient(this.nom)
  }
  nom = localStorage.getItem('nom')
  getContratsByClient(nom: string) {
    this.contratService.getContratsByClient(nom)
      .subscribe({
        next: (res) => {
          this.contrats = res;
          this.dataSource = new MatTableDataSource(this.contrats);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (err) => {
          console.log(err);
        }
      })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

 





}

