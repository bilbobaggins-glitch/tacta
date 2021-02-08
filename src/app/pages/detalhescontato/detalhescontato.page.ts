import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Contato } from 'src/app/model/contato';
import { ContatosService } from 'src/app/services/contatos.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-detalhescontato',
  templateUrl: './detalhescontato.page.html',
  styleUrls: ['./detalhescontato.page.scss'],
})
export class DetalhescontatoPage implements OnInit {
  private contato : Contato = {};
  private imgURL : any;

  constructor(private contatosService: ContatosService,
              private activatedRoute: ActivatedRoute,
              private loadingCtrl: LoadingController) {

    let contatoId = this.activatedRoute.snapshot.params['id'];
    if(contatoId != undefined){
      this.contato = this.contatosService.getById(contatoId);
    }
  }

  ngOnInit() {
  }

  uploadFile(event){
    let fileReader = new FileReader();

    this.contato.fotoDownloadURL = null;
    this.contato.foto = event.target.files[0];
    fileReader.readAsDataURL(this.contato.foto); 
    fileReader.onload = () => { 
      this.imgURL = fileReader.result;
    }
  }

  async contatoAtualizar(){
    let loading = await this.loadingCtrl.create({ message: 'Salvando... '});
    loading.present();
    await this.contatosService.cadastrarAtualizar(this.contato);
    await this.contatosService.inicializar();
    await this.sleep(1000 * 3);
    loading.dismiss();
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
