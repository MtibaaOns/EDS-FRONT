import { Injectable } from '@angular/core';
import { Demande } from './dem_interv.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../assets/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DemIntervService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getAllDemandes() {
    return this.http.get<Demande[]>(`${this.apiServerUrl}/Demandes/all`);
  }

  public getDemandeBynumDem(numDem: number): Observable<Demande> {
    return this.http.get<Demande>(`${this.apiServerUrl}/Demandes/find/${numDem}`);
  }

  public addDemande(demande: Demande): Observable<Demande> {
    return this.http.post<Demande>(`${this.apiServerUrl}/Demandes/add`, demande);
  }

  public updateDemande(demande: Demande, numDem: number, client: string, titre: string, priorite: string, dateDeb: string, dateFin: string, description: string): Observable<Demande> {
    return this.http.put<Demande>(`${this.apiServerUrl}/Demandes/update/${numDem}?client=${client}&titre=${titre}&priorite=${priorite}&dateFin=${dateFin}&dateDeb=${dateDeb}&description=${description}`, demande);
  }
  public deleteDemande(numDem: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/Demandes/delete/${numDem}`);
  }
  public getDemandesByClientId(clientId: number): Observable<Demande[]> {
    return this.http.get<Demande[]>(`${this.apiServerUrl}/Demandes/client/${clientId}`);
  }
  getAllClients(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiServerUrl}/Demandes/clients`);
  }
}