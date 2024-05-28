import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Demande } from '../dem_interv.model';
import { DemIntervService } from '../dem-interv.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-liste-demande',
  templateUrl: './liste-demande.component.html',
  styleUrls: ['./liste-demande.component.css']
})
export class ListeDemandeComponent implements OnInit {
  public dataSource!: MatTableDataSource<Demande>;
  public demandes!: Demande[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['code', 'client', 'titre', 'priorite', 'dateDeb', 'dateFin', 'description', 'actions'];

  constructor(
    private demandeService: DemIntervService,
    private router: Router,
    private toastService: NgToastService
  ) { }

  ngOnInit() {
    this.getAllDemandes();
  }

  getAllDemandes() {
    const role = localStorage.getItem('role');
    if (role === 'ADMIN') {
      this.demandeService.getAllDemandes()
        .subscribe({
          next: (res) => {
            this.demandes = res;
            this.dataSource = new MatTableDataSource(this.demandes);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          },
          error: (err) => {
            console.log(err);
          }
        });
    } else {
      const clientId = localStorage.getItem('clientId');
      this.demandeService.getDemandesByClientId(parseInt(clientId!))
        .subscribe({
          next: (res) => {
            this.demandes = res;
            this.dataSource = new MatTableDataSource(this.demandes);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          },
          error: (err) => {
            console.log(err);
          }
        });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  modifier(numDem: number) {
    this.router.navigate(['dashboard','update_demande', numDem]);
  }

  OndeleteDemande(numDem: number): void {
    if (confirm("Voulez-vous vraiment supprimer cette demande ?")) {
      this.demandeService.deleteDemande(numDem).subscribe({
        next: () => {
          this.toastService.success({ detail: "Demande supprimée avec succès", summary: "Succès", duration: 3000 });
          this.getAllDemandes();
        },
        error: (error: HttpErrorResponse) => {
          this.toastService.error({ detail: error.message, summary: "Erreur", duration: 3000 });
        }
      });
    }
  }

}