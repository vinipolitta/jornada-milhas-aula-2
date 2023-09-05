import { Component, OnInit } from '@angular/core';
import { PessoaUsuaria } from 'src/app/core/types/type';
import { TokenService } from './../../core/services/token.service';
import { CadastroComponent } from './../cadastro/cadastro.component';
import { CadastroService } from 'src/app/core/services/cadastro.service';
import { FormGroup } from '@angular/forms';
import { FormularioService } from './../../core/services/formulario.service';
import { Route, Router } from '@angular/router';
import { UserService } from './../../core/services/user.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  public titulo = "Ola ";
  public textoBotao = "Atualizar"
  public perfilComponent = true;

  public token = '';
  public nome = '';
  public cadastro!: PessoaUsuaria;
  public form!: FormGroup<any> | null;

  constructor(
    private tokenService: TokenService,
    private cadastroService: CadastroService,
    private formularioService: FormularioService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.token = this.tokenService.retornarToken();
    this.cadastroService.buscarCadastro(this.token).subscribe(cadastro => {
      this.cadastro = cadastro;
      this.nome = this.cadastro.nome;
      this.carregarFormulario()
    });
  }

  carregarFormulario() {
    this.form = this.formularioService.getCadastro();
    this.form?.patchValue({
      nome: this.cadastro.nome,
      nascimento: this.cadastro.nascimento,
      cpf: this.cadastro.cpf,
      telefone: this.cadastro.telefone,
      email: this.cadastro.email,
      genero: this.cadastro.genero,
      senha: this.cadastro.senha,
      cidade: this.cadastro.cidade,
      estado: this.cadastro.estado,
    });
  }

  deslogar() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

  atualizar() {
    const dadosAtualizados = {
      nome: this.form?.value.nome,
      nascimento: this.form?.value.nascimento,
      cpf: this.form?.value.cpf,
      telefone: this.form?.value.telefone,
      email: this.form?.value.email,
      genero: this.form?.value.genero,
      senha: this.form?.value.senha,
      cidade: this.form?.value.cidade,
      estado: this.form?.value.estado,
    }

    this.cadastroService.EditarCadastro(dadosAtualizados, this.token).subscribe({
      next: () => {
        alert('Cadastro atualizado com sucesso');
        this.router.navigate(['/'])

      },
      error: (err) => {
        console.log('Erro ao atualizar cadastro', err.message);
      }
    });
  }
}
