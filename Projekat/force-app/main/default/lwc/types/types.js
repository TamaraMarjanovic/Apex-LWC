import { LightningElement, api, wire, track } from 'lwc';
import IMG1 from '@salesforce/resourceUrl/img1';
import IMG2 from '@salesforce/resourceUrl/img2';
import IMG3 from '@salesforce/resourceUrl/img3';
import IMG4 from '@salesforce/resourceUrl/img4';
import IMG5 from '@salesforce/resourceUrl/img5';
import IMG6 from '@salesforce/resourceUrl/img6';
import IMG7 from '@salesforce/resourceUrl/img7';
import IMG8 from '@salesforce/resourceUrl/img8';
import IMG9 from '@salesforce/resourceUrl/img9';
import IMG10 from '@salesforce/resourceUrl/img10';
import IMG11 from '@salesforce/resourceUrl/img11';
import IMG12 from '@salesforce/resourceUrl/img12';
import IMG13 from '@salesforce/resourceUrl/img13';
import IMG14 from '@salesforce/resourceUrl/img14';
import IMG15 from '@salesforce/resourceUrl/img15';
import IMG16 from '@salesforce/resourceUrl/img16';
import IMG17 from '@salesforce/resourceUrl/img17';
import IMG18 from '@salesforce/resourceUrl/img18';
import IMG19 from '@salesforce/resourceUrl/img19';
import IMG20 from '@salesforce/resourceUrl/img20';
import IMG21 from '@salesforce/resourceUrl/img21';
import IMG22 from '@salesforce/resourceUrl/img22';
import IMG23 from '@salesforce/resourceUrl/img23';
import IMG24 from '@salesforce/resourceUrl/img24';
import IMG25 from '@salesforce/resourceUrl/img25';

export default class Types extends LightningElement {

    @track
    show=false;
    @track
    name;
    @track 
    list=false;
    @track 
    items=[];
    @track
    listOfNames;

    types=[
        {Id:1, Name:'TV, Audio, Video', Image: IMG1},
        {Id:2, Name:'Foto oprema', Image: IMG2},
        {Id:3, Name:'Bela Tehnika', Image: IMG3},
        {Id:4, Name:'Kuca i stan', Image: IMG4},
        {Id:5, Name:'Mobilni i fiksni telefoni', Image: IMG5},
        {Id:6, Name:'Laptop i tablet racunari', Image: IMG6},
        {Id:7, Name:'Racunari i komponente', Image: IMG7},
        {Id:8, Name:'PC periferije, Monitori', Image: IMG8},
        {Id:9, Name:'Stampaci, Office', Image: IMG9},
        {Id:10, Name:'Mreze, Sigurnosna oprema', Image: IMG10},
        {Id:11, Name:'Alati i basta', Image: IMG11},
        {Id:12, Name:'Auto-Moto oprema', Image: IMG12},
        {Id:13, Name:'Gaming, Igrice, Konzole', Image: IMG13},
        {Id:14, Name:'Lepota, zdravlje i moda', Image: IMG14},
        {Id:15, Name:'Sportska oprema i fitnes', Image: IMG15}
    ]

    handleOnClick(event){
        this.name=event.target.dataset.name;
        console.log(this.name);
        if(this.name=='TV, Audio, Video')
            this.items=[
                {Id:1, Name:'TV', Image: IMG1},
                {Id:2, Name:'Audio', Image: IMG17},
                {Id:3, Name:'Projektori i oprema', Image: IMG18},
                {Id:4, Name:'Digitalni TV tuneri', Image: IMG19},
                {Id:5, Name:'Video', Image: IMG20},
                {Id:6, Name:'Dronovi i oprema', Image: IMG21}
            ]
        if(this.name=='Foto oprema')
            this.items=[
                {Id:1, Name:'Digitalni fotoaparati', Image: IMG22},
                {Id:2, Name:'Objektivi i blicevi', Image: IMG23},
                {Id:3, Name:'Optika', Image: IMG24},
                {Id:4, Name:'Kamere', Image: IMG25},
                {Id:5, Name:'Dodatna foto oprema', Image: IMG3}
            ]
        if(this.name=='Bela Tehnika')
            this.items=[
                {Id:1, Name:'Ves masine', Image: IMG1},
                {Id:2, Name:'Frizideri', Image: IMG2},
                {Id:3, Name:'Sporeti i mikrotalasne', Image: IMG3},
                {Id:4, Name:'Masine za pranje sudova', Image: IMG4},
                {Id:5, Name:'Bojleri', Image: IMG3},
                {Id:6, Name:'Grejanje', Image: IMG3},
                {Id:7, Name:'Mini kuhinje', Image: IMG3},
                {Id:8, Name:'Kuhinjski aspiratori', Image: IMG3},
                {Id:9, Name:'Ugradna tehnika', Image: IMG3},
                {Id:10, Name:'Klima uredjaji', Image: IMG3},
                {Id:11, Name:'Sredstva za ciscenje i zastitu tehnike', Image: IMG3}
            ]
        if(this.name=='Kuca i stan')
            this.items=[
                {Id:1, Name:'Mali kuhinjski aparati', Image: IMG1},
                {Id:2, Name:'Rasveta', Image: IMG2},
                {Id:3, Name:'Odlaganje i ciscenje', Image: IMG3},
                {Id:4, Name:'Mali kucni aparati', Image: IMG4},
                {Id:5, Name:'Posudje i pribor za jelo', Image: IMG3}
            ]
        if(this.name=='Mobilni i fiksni telefoni')
            this.items=[
                {Id:1, Name:'Mobilni telefoni', Image: IMG1},
                {Id:2, Name:'Fiksni telefoni', Image: IMG2},
                {Id:3, Name:'Smart satovi i fitness narukvice', Image: IMG3}
            ]
        if(this.name=='Laptop i tablet racunari')
            this.items=[
                {Id:1, Name:'Laptopovi', Image: IMG1},
                {Id:2, Name:'MacBook', Image: IMG2},
                {Id:3, Name:'Tablet PC & Apple iPad', Image: IMG3},
                {Id:4, Name:'Adapteri, hladnjaci i IT oprema', Image: IMG4},
                {Id:5, Name:'Torbe, rancevi i futrole za laptop', Image: IMG3}
            ]
        if(this.name=='Racunari i komponente')
            this.items=[
                {Id:1, Name:'Desktop racunari', Image: IMG1},
                {Id:2, Name:'ALL in ONE racunari', Image: IMG2},
                {Id:3, Name:'Racunarske komponente', Image: IMG3}
            ]
        if(this.name=='PC periferije, Monitori')
            this.items=[
                {Id:1, Name:'Monitori i oprema', Image: IMG16},
                {Id:2, Name:'UPS i oprema', Image: IMG2},
                {Id:3, Name:'Tastature i misevi', Image: IMG3},
                {Id:4, Name:'USB flash memorije', Image: IMG4},
                {Id:5, Name:'Memorijske kartice', Image: IMG3},
                {Id:6, Name:'Baterije i punjaci', Image: IMG3},
                {Id:7, Name:'Zvucnici i zvucni sistemi', Image: IMG3},
                {Id:8, Name:'Slusalice i mikrofoni', Image: IMG3},
                {Id:9, Name:'Web kamere', Image: IMG3},
                {Id:10, Name:'Citaci memorijskih kartica i hub-ovi', Image: IMG3},
                {Id:11, Name:'Adapteri i kablovi', Image: IMG3}
            ]
        if(this.name=='Stampaci, Office')
            this.items=[
                {Id:1, Name:'Stampaci', Image: IMG1},
                {Id:2, Name:'Skeneri', Image: IMG2},
                {Id:3, Name:'Mediji', Image: IMG3},
                {Id:4, Name:'Kancelarijska oprema i materijal', Image: IMG4}
            ]
        if(this.name=='Mreze, Sigurnosna oprema')
            this.items=[
                {Id:1, Name:'Mrezne kartice', Image: IMG1},
                {Id:2, Name:'Switch', Image: IMG2},
                {Id:3, Name:'Wireless', Image: IMG3},
                {Id:4, Name:'Alarmi i sefovi', Image: IMG3},
                {Id:5, Name:'Video nadzor', Image: IMG3}
            ]
        if(this.name=='Alati i basta')
            this.items=[
                {Id:1, Name:'Alati i radionica', Image: IMG1},
                {Id:2, Name:'Peraci pod pritiskom, Usisivaci/Duvaci', Image: IMG2},
                {Id:3, Name:'Sve za bastu', Image: IMG3}
            ]
        if(this.name=='Auto-Moto oprema')
            this.items=[
                {Id:1, Name:'Akumulatori', Image: IMG1},
                {Id:2, Name:'Auto tehnika', Image: IMG2},
                {Id:3, Name:'Auto oprema ', Image: IMG3},
                {Id:4, Name:'Auto gume', Image: IMG4}
            ]
        if(this.name=='Gaming, Igrice, Konzole')
            this.items=[
                {Id:1, Name:'Konzole i oprema', Image: IMG2},
                {Id:2, Name:'Igrice i Filmovi', Image: IMG3}
            ]
        if(this.name=='Lepota, zdravlje i moda')
            this.items=[
                {Id:1, Name:'Aparati za negu lica i tela', Image: IMG1},
                {Id:2, Name:'Torbe koferi i aksesoari', Image: IMG2},
            ]
        if(this.name=='Sportska oprema i fitnes')
            this.items=[
                {Id:1, Name:'Smart satovi i fitness narukvice', Image: IMG1},
                {Id:2, Name:'Sportska oprema i rekviziti', Image: IMG2},
                {Id:3, Name:'Balans skuteri', Image: IMG3},
                {Id:4, Name:'Bicikli i roleri', Image: IMG4},
                {Id:5, Name:'Kucni fitnes program', Image: IMG3},
                {Id:6, Name:'Bazeni i oprema za vodene sportove', Image: IMG3}
            ]
        this.show=true;
        console.log(this.items.length);
        this.template.querySelector('.items').style.gridTemplateRows= 'repeat('+ this.items.length + ',50px)';
    }

    closeModal(){
        this.show=false;
    }

    view(){
        var l=this.template.querySelectorAll('.checkbox');
        var l1=[];
        for(var i=0; i<l.length; i++)
        {
            if(l[i].checked){
                l1.push(l[i].dataset.name);
            }
        }
        this.listOfNames=l1;
        this.show=false;
        this.list=true;
    }

    handleGoBack(){
        this.show=false;
        this.list=false;
    }
}