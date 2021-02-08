import { Observable } from 'rxjs';

export interface Contato {
    id?: string;

    nome?: string;
    telefone?: string;
    email?: string;

    // fotoDownloadURL?: Observable<string | null>;
    fotoDownloadURL?: any;
    fotoPath?: string;
    foto?: any;
}
