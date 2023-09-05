import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { BehaviorSubject } from 'rxjs';
import { PessoaUsuaria } from '../types/type';
import jwt_decode from 'jwt-decode'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userSubject = new BehaviorSubject<PessoaUsuaria | null>(null);

  constructor(private token: TokenService) {
    if (this.token.possuiToken()) {
      this.decodificarJWT();
    }
  }

  decodificarJWT() {
    const token = this.token.retornarToken();
    const user = jwt_decode(token) as PessoaUsuaria;
    this.userSubject.next(user);
  }

  retornarUser() {
    return this.userSubject.asObservable();
  }

  salvarToken(token: string) {
    this.token.salvarToken(token);
    this.decodificarJWT();
  }

  logout() {
    this.token.excluirToken();
    this.userSubject.next(null);
  }

  estaLogado() {
    return this.token.possuiToken();
  }
}
