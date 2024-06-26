import { Injectable } from '@angular/core';
import { Intervention } from './intervention.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../assets/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InterventionService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  public getAllInterventions(): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(`${this.apiServerUrl}/Interventions/all`);
  }

  public getInterventionById(id: number): Observable<Intervention> {
    return this.http.get<Intervention>(`${this.apiServerUrl}/Interventions/find/${id}`);
  }
  public getInterventionByIdUser(id: number): Observable<Intervention> {
    return this.http.get<Intervention>(`${this.apiServerUrl}/Interventions/findByUser/${id}`);
  }
  public addIntervention(intervention: Intervention): Observable<Intervention> {
    return this.http.post<Intervention>(`${this.apiServerUrl}/Interventions/add`, intervention);
  }

  public updateIntervention(intervention: Intervention, id: number, dateDeb: string, dateFin: string, duree: string, observation: string, cloturer: boolean, montantHT: number, facturer: boolean, cause: string,technicien:string,client:string,pieceRechange:string): Observable<Intervention> {
    return this.http.put<Intervention>(`${this.apiServerUrl}/Interventions/update/${id}?dateDeb=${dateDeb}&dateFin=${dateFin}&duree=${duree}&observation=${observation}&cloturer=${cloturer}&montantHT=${montantHT}&facturer=${facturer}&cause=${cause}&technicien=${technicien}&client=${client}&pieceRechange=${pieceRechange}`, intervention);
  }

  
 

  public updateInterventiontech(intervention: Intervention, id: number, duree: string, cloturer: boolean): Observable<Intervention> {
    return this.http.put<Intervention>(`${this.apiServerUrl}/Interventions/updatetech/${id}?duree=${duree}&cloturer=${cloturer}`, intervention);
  }

  public deleteIntervention(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/Interventions/delete/${id}`);
  }

  getInterventionsByTechnician(technician: string): Observable<Intervention[]> {
    const url = `${this.apiServerUrl}/Interventions/technician/${technician}`;
    console.log('URL de la requête:', url); // Affiche l'URL de la requête dans la console
    return this.http.get<Intervention[]>(url);
  }

  getInterventionsByClient(client: string): Observable<Intervention[]> {
    const url = `${this.apiServerUrl}/Interventions/client/${client}`;
    console.log('URL de la requête:', url); // Affiche l'URL de la requête dans la console
    return this.http.get<Intervention[]>(url);
  }
  public getInterventionsForToday(): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(`${this.apiServerUrl}/Interventions/today`);
  }
  
}
