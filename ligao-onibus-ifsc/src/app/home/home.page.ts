import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonCard,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton
} from '@ionic/angular';
import { RotaService } from '../services/rotaService';
import { AuthService } from '../services/authService';
import { Router } from '@angular/router';
import { Rota } from '../models/rota';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCardContent,
    IonButton
  ],
})
export class HomePage {
  rotas: Rota[] = [];
  carregando = false;
  mensagemErro = '';

  constructor(
    public auth: AuthService,
    private rotaService: RotaService,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
  ) {}

  async ionViewWillEnter() {
    const usuario = await this.auth.esperarUsuario();
    if (!usuario) {
      this.router.navigate(['/login']);
      return;
    }
    await this.carregar();
  }

  async carregar() {
    this.carregando = true;
    this.mensagemErro = '';

    try {
      this.rotas = await this.rotaService.listar();
    } catch (erro) {
      console.error('Erro ao carregar rotas do Firestore:', erro);
      this.mensagemErro = 'Não foi possível carregar as rotas. Tente novamente.';
    } finally {
      this.carregando = false;
      this.changeDetector.markForCheck();
    }
  }

  descreverStatus(rota: Rota): string {
    if (rota.concluida) {
      return 'Rota concluída';
    }

    if (rota.atrasado) {
      if (rota.tempo === undefined) {
        return 'Atrasado (tempo não informado)';
      }

      const unidade = rota.tempo === 1 ? 'minuto' : 'minutos';
      return `Atrasado em ${rota.tempo} ${unidade}`;
    }

    return 'No horário';
  }

  irParaAtraso(): void {
    this.router.navigate(['/atraso']);
  }
}
