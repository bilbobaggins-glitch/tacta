import { Injectable } from '@angular/core';
import { Contato } from '../model/contato';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import 'firebase/storage';
import * as firebase from 'firebase/app';
import * as myrxjs from 'rxjs';
import { Events } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ContatosService {
  contatos: Array<Contato> = new Array<Contato>();

  constructor(private angularFirestore: AngularFirestore,
              private angularFireStorage: AngularFireStorage,
              private events: Events){
  }

  getById(id: any): any {
    return this.contatos.find( (contato) => contato.id == id );
  }

  async inicializar(){
    await this.carregarDados();
    await this.fotoGetAll(this.contatos);
    
    return null;
  }

  async carregarDados(): Promise<any> {
    let querySnapshot = await this.angularFirestore.collection<Contato>('Contato').get().toPromise();
    let contatos = Array<Contato>();
    querySnapshot.forEach( (doc) => {
        contatos.push({
          id: doc.id,
          nome: doc.data().nome,
          telefone: doc.data().telefone,
          email: doc.data().email,
          fotoPath: doc.data().fotoPath,
          fotoDownloadURL: null
        });
      }
    );

    this.contatos = contatos;

    let promessaRetorno;
    promessaRetorno = new Promise( (resolve, reject) => 
      resolve(contatos)
    );

    return promessaRetorno;
  }

  async cadastrarAtualizar(contato: Contato){
    let contatoParam = contato;
    contatoParam = await this.cadastrarAtualizarDados(contatoParam);
    contatoParam = await this.cadastrarAtualizarFotoStorage(contatoParam);
    contatoParam = await this.cadastrarAtualizarFotoDados(contatoParam);
    this.inicializar();
  }

  async cadastrarAtualizarDados(contato: Contato): Promise<Contato> {
    let contatoDados = {
      nome: contato.nome,
      email: contato.email,
      telefone: contato.telefone,
    }
    if(contato.id == null){
      contato.id = ( await this.angularFirestore.collection<Contato>('Contato').add(contatoDados) ).id;
    } else {
      await this.angularFirestore.collection<Contato>('Contato').doc(contato.id).update(contatoDados);
    }

    return new Promise( (resolve) => resolve(contato) );
  }

  async cadastrarAtualizarFotoStorage(contato: Contato): Promise<any> {
    if(contato.fotoDownloadURL == null){
      contato.fotoPath = contato.id + ".jpg";
      await this.angularFireStorage.upload(contato.fotoPath, contato.foto);
      contato.fotoDownloadURL = await this.angularFireStorage.ref(contato.fotoPath).getDownloadURL();
    }

    return new Promise( (resolve) => resolve(contato) );
  }

  async cadastrarAtualizarFotoDados(contato: Contato) : Promise<any> {
    this.angularFirestore.collection<Contato>('Contato').doc<Contato>(contato.id).update({
      fotoPath: contato.fotoPath,
    });

    return new Promise( (resolve) => resolve(contato) )
  }

  async fotoGetAll(contatos: Array<Contato>): Promise<any>{
    contatos.forEach( async (contato) => {
      if(contato.fotoPath != undefined)
       contato.fotoDownloadURL = await this.angularFireStorage.ref(contato.fotoPath).getDownloadURL();
      }
    );
    return new Promise( (resolve) => resolve() );
  }
}
