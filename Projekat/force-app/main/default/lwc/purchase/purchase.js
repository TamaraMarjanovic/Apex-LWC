import { LightningElement, api, track, wire } from 'lwc';
import getAllPurchases from "@salesforce/apex/Manager.getAllPurchases";
import finalBuy from "@salesforce/apex/Manager.finalBuy";
import empty from "@salesforce/apex/Manager.empty";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Purchase extends LightningElement {

    @track
    lista;
    @track
    error;
    @track 
    total=0;

    connectedCallback() {   
        this.refresh();
    }

    refresh(){
        getAllPurchases({}).then(result =>{
            this.lista = JSON.parse(result);
            this.total=0;
            for(var i=0; i<this.lista.length; i++){
                if(this.lista[i].Price__c!=undefined && this.lista[i].Num__c!=undefined)
                    this.total+=this.lista[i].Price__c*this.lista[i].Num__c;
                if(this.lista[i].LastModifiedDate!=undefined){
                    let myDate = new Date(this.lista[i].LastModifiedDate.toString());
                    this.lista[i].LastModifiedDate=this.formatDate(myDate);;
                }
            }
            setTimeout(() => {
                if(this.template.querySelector('.items')!=null)
                this.template.querySelector('.items').style.gridTemplateRows= 'repeat('+this.lista.length+',35px)';
            },8);
            this.error = undefined;
        }).catch(error=>{
            console.log(error);
        });
    }
    
    monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    formatDate(myDate) {
        var myD=myDate.getDate();
        var t='';
        t = myD < 10 ? '  ' + t : t;
        return `${this.monthNames[myDate.getMonth()]} ${myD}, ${myDate.getFullYear()}, ${t}${this.formatAMPM(myDate)}`;
    }

    formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        hours = hours < 10 ? '  ' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
}