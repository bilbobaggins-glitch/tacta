import { Component, OnInit } from '@angular/core';
import { Contato } from 'src/app/model/contato';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavController, Events, LoadingController } from '@ionic/angular';
import { ContatosService } from '../../services/contatos.service';
import { AngularFireStorage } from '@angular/fire/storage';

import 'firebase/storage';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-inicial',
  templateUrl: './inicial.page.html',
  styleUrls: ['./inicial.page.scss'],
})
export class InicialPage implements OnInit {
  public contatos = new Array<Contato>();
  public contatosFiltrados = new Array<Contato>();

  constructor(private contatosService: ContatosService,
              private loadingCtrl: LoadingController){

    this.inicializar();
    
  }

  async inicializar(){
    let loading = await this.loadingCtrl.create({ message: "Carregando contatos... " });
    loading.present();
    
    await this.contatosService.inicializar();
    this.contatos = this.contatosService.contatos;
    this.contatosFiltrados = this.contatos;

    await this.sleep(1000 * 3);
    loading.dismiss();
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  ionViewDidEnter(){
    this.ionViewDidEnterHandler();
  }

  async ionViewDidEnterHandler(){
    let loading = await this.loadingCtrl.create({ message: "Carregando contatos... " });
    loading.present();

    this.contatos = this.contatosService.contatos;
    this.contatosFiltrados = this.contatos;

    await this.sleep(1000 * 1);
    loading.dismiss();
  }

  ngOnInit() {
  }

  contatosBuscarPorNome(evento){
    const input = evento.target.value;

    if (input && input.trim() != '') {

      this.contatosFiltrados = this.contatos.filter((contatoFiltrado) => {

        return contatoFiltrado.nome.toLowerCase().indexOf(input.toLowerCase()) > -1;

      });

    } else {
      this.contatosFiltrados = this.contatos;
    }
  }
}
