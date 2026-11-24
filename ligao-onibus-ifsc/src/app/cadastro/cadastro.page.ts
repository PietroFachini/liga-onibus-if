import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  IonCard,
  IonContent,
  IonButton,
  IonLabel,
  IonItem,
  IonCardContent,
  IonInput,
} from '@ionic/angular';

import { AuthService } from '../services/authService';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonContent,
    IonInput,
    IonButton,
    IonItem,
    IonLabel,
    IonCard,
    IonCardContent,
  ],
})
export class CadastroPage {
  email = '';
  senha = '';
  mensagemErro = '';

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  async cadastrar() {
    this.mensagemErro = '';

    if (!this.email || !this.senha) {
      this.mensagemErro = 'Preencha e-mail e senha.';
      return;
    }

    try {
      await this.auth.cadastrar(this.email, this.senha);
      await this.router.navigate(['/home']);
    } catch (e: any) {
      this.mensagemErro = this.auth.traduzirErro(e.code);
      this.senha = '';
    }
  }
}
