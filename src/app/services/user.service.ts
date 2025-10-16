import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';

interface UserRegisterPayload {
  nome: string,
  email: string,
  senha: string,
  enderecos?: [{
    rua: string,
    numero: number,
    complemento: string,
    cidade: string,
    estado: string,
    cep: string
  }],
  telefones?: [{
    numero: string,
    ddd: string
  }]
}

export interface UserResponse {
  nome: string,
  email: string,
  enderecos: {
    id: number,
    rua: string,
    numero: number,
    complemento: string,
    cidade: string,
    estado: string,
    cep: string
  }[] | null,
  telefones: {
    id: number,
    numero: string,
    ddd: string
  }[] | null
}

export interface UserLoginPayload {
  email: string,
  senha: string,
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8083';

  private jwtHelper = new JwtHelperService;

  private _user = signal<UserResponse | null>(null);
  readonly user = this._user.asReadonly();

  constructor(private http: HttpClient, private authService: AuthService) {
    const usuarioSalvo = this.authService.getUser();
    if (usuarioSalvo) {
      this.setUser(usuarioSalvo)
    }
  }

  register(body: UserRegisterPayload): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/usuario`, body)
  }

  login(body: UserLoginPayload): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/usuario/login`, body, { responseType: 'text' as 'json' })
  }


  getUserByEmail(token: string): Observable<UserResponse> {
    const email = this.getEmailFromToken(token);
    if (!email) throw new Error('Token Inválido');
    const headers = new HttpHeaders({ Authorization: `${token}` })
    return this.http.get<UserResponse>(`${this.apiUrl}/usuario?email=${email}`, { headers })
  }

  getEmailFromToken(token: string): string | null {
    try {
      const decoded = this.jwtHelper.decodeToken(token)
      return decoded?.sub || null
    } catch (error) {
      return null
    }
  }

  getEnderecoByCep(cep: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuario/endereco/${cep}`)
  }

  saveEndereco(body: {
    rua: string,
    numero: number,
    complemento: string,
    cidade: string,
    estado: string,
    cep: string
  }, token: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `${token}` })

    return this.http.post<UserResponse>(`${this.apiUrl}/usuario/endereco`, body, { headers }).pipe(
      switchMap(() => this.getUserByEmail(token)),
      tap(user => {
        this.setUser(user)
        this.authService.saveUser(user)
      })
    )
  }

  updateEndereco(id: number, body: {
    rua: string,
    numero: number,
    complemento: string,
    cidade: string,
    estado: string,
    cep: string
  }, token: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `${token}` })

    return this.http.put<UserResponse>(`${this.apiUrl}/usuario/endereco?id=${id}`, body, { headers }).pipe(
      switchMap(() => this.getUserByEmail(token)),
      tap(user => {
        this.setUser(user)
        this.authService.saveUser(user)
      })
    )
  }

  saveTelefone(body: { numero: string, ddd: string }, token: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `${token}` })

    return this.http.post<UserResponse>(`${this.apiUrl}/usuario/telefone`, body, { headers }).pipe(
      switchMap(() => this.getUserByEmail(token)),
      tap(user => {
        this.setUser(user)
        this.authService.saveUser(user)
      })
    )
  }

  updateTelefone(id: number, body: {
    numero: string,
    ddd: string
  }, token: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `${token}` })

    return this.http.put<UserResponse>(`${this.apiUrl}/usuario/telefone?id=${id}`, body, { headers }).pipe(
      switchMap(() => this.getUserByEmail(token)),
      tap(user => {
        this.setUser(user)
        this.authService.saveUser(user)
      })
    )
  }

  getUser(): UserResponse | null {
    return this.user()
  }

  setUser(data: UserResponse | null): void {
    this._user.set(data)
  }
}
