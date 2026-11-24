import { Injectable } from '@angular/core';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { Rota } from '../models/rota';

@Injectable({ providedIn: 'root' })
export class RotaService {

  async listar(): Promise<Rota[]> {
    const snap = await getDocs(collection(db, 'garopaba'));

    return snap.docs
      .map((item) => {
        const dados = item.data();
        const tempo = dados['tempo'];

        return {
          id: item.id,
          atrasado: dados['atrasado'],
          concluida: dados['concluida'],
          horario: dados['horario'],
          rota: dados['rota'],
          ...(typeof tempo === 'number' ? { tempo } : {}),
        };
      })
      .sort((a, b) => (b.tempo ?? 0) - (a.tempo ?? 0));
  }

  async registrarAtraso(id: string, tempo: number): Promise<void> {
    await updateDoc(doc(db, 'garopaba', id), {
      atrasado: true,
      tempo,
    });
  }
}