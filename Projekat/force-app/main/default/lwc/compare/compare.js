import { LightningElement, api, wire, track } from 'lwc';

export default class Compare extends LightningElement {
    
    @api
    num;
    @api
    listac;
    
    
    connectedCallback() {   
        setTimeout(() => {
            if(this.template.querySelector('.content1')!=null)
            this.template.querySelector('.content1').style.gridTemplateColumns= 'repeat('+this.num+',minmax(300px,'+ 100/this.num +'%))';
        }, 20);
    }  

    handleBack(){
        this.dispatchEvent(new CustomEvent("goback"));
    }
}