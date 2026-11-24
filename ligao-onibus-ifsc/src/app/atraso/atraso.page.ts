import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/authService';
import { RotaService } from '../services/rotaService';
import { Rota } from '../models/rota';

@Component({
  selector: 'app-atraso',
  templateUrl: './atraso.page.html',
  styleUrls: ['./atraso.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonTitle,
    IonToolbar,
  ],
})
export class AtrasoPage implements OnInit {
  rotas: Rota[] = [];
  carregando = false;
  salvando = false;
  mensagemErro = '';
  mensagemSucesso = '';
  rotaSelecionadaId: string | null = null;
  tempoAtraso: number | null = null;

  constructor(
    private auth: AuthService,
    private rotaService: RotaService,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
  ) {}

  async ngOnInit() {
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

  selecionarRota(rota: Rota) {
    this.rotaSelecionadaId =
      this.rotaSelecionadaId === rota.id ? null : rota.id;
    this.tempoAtraso = null;
    this.mensagemErro = '';
    this.mensagemSucesso = '';
  }

  async registrarAtraso(rota: Rota) {
    const tempo = Number(this.tempoAtraso);
    if (!Number.isInteger(tempo) || tempo <= 0) {
      this.mensagemErro = 'Informe o atraso em minutos usando um número inteiro maior que zero.';
      return;
    }

    this.salvando = true;
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    try {
      await this.rotaService.registrarAtraso(rota.id, tempo);
      this.rotas = this.rotas.map((item) =>
        item.id === rota.id ? { ...item, atrasado: true, tempo } : item,
      );
      this.rotaSelecionadaId = null;
      const unidade = tempo === 1 ? 'minuto' : 'minutos';
      this.mensagemSucesso = `Atraso de ${tempo} ${unidade} registrado para ${rota.rota}.`;
      await this.router.navigate(['/home']);
    } catch (erro) {
      console.error('Erro ao registrar atraso no Firestore:', erro);
      this.mensagemErro =
        'Não foi possível registrar o atraso. Verifique as permissões de atualização no Firestore.';
    } finally {
      this.salvando = false;
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
}
