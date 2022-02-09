import { LightningElement, api, track, wire } from 'lwc';
import getAllProducts from "@salesforce/apex/Manager.getAllProducts";
import buyProducts from "@salesforce/apex/Manager.buyProducts";
import addView from "@salesforce/apex/Manager.addView";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ViewList extends LightningElement {

    @track
    showDetail=false;
    @track
    showCompare=false;
    @track
    lista;
    @track
    error;
    @track
    idDetail;
    @track
    num=3; 
    @track
    listac=[];
    @track
    showBuy=false;
    @track
    listaBuy=[];
    @track
    total=0;
    @track
    asc=false;
    @track
    desc=false;
    @track
    ascnum=false;
    @track
    descnum=false;
    @track
    rating=false;
    @api
    listOfNames;

    connectedCallback() {   
        this.refresh();
    }

    refresh(){
        var s='none';
        if(this.desc)
            s='desc';
        else if(this.asc)
            s='asc';
        else if(this.ascnum)
            s='ascnum';
        else if(this.descnum)
            s='descnum';
        else if(this.rating)
            s='rating';
        
        var p=[];
        var l=this.template.querySelectorAll('.checkboxc');
        for(var i=0; i<l.length; i++)
        {
            if(l[i].checked)
                p.push(l[i].dataset.id);
            l[i].checked=false;
        }
            
        getAllProducts({s:s, listOfSubtypes:this.listOfNames}).then(result =>{
            this.lista = JSON.parse(result);
            this.error = undefined;
            setTimeout(() => {
                if(this.template.querySelector('.items')!=null)
                this.template.querySelector('.items').style.gridTemplateRows= 'repeat('+this.lista.length+',35px)';

                var l1=this.template.querySelectorAll('.checkboxc');
                for(var i=0; i<l1.length; i++)
                {
                    if(p.includes(l1[i].dataset.id)){
                        l1[i].checked=true;
                    }
                }
            }, 8);
        }).catch(error=>{
            console.log(error);
        });
    }

    onBuy(){
        var list=[];
        var l=this.template.querySelectorAll('.checkboxc');
        for(var i=0; i<l.length; i++)
        {
            if(l[i].checked){
                var p=l[i].dataset.price;
                if(p==undefined)
                    p=0;
                list.push({Id:l[i].dataset.id, Name:l[i].dataset.name, Price:p, Num:1, Quantity:l[i].dataset.quantity, Total:p});
                l[i].checked=false;
                this.total=parseInt(this.total)+parseInt(p);
            }
        }
        if(list.length>0){
            this.listaBuy=list;
            this.showBuy=true;
            setTimeout(() => {
                var p=this.listaBuy.length+1;
                this.template.querySelector('.items1').style.gridTemplateRows= 'repeat('+ p + ',100px)';
            }, 20);
        }
        else{
            const evt = new ShowToastEvent({
                title: 'Select some product',
                message: 'You did not select any product',
                variant: 'error',
            });
            this.dispatchEvent(evt);
        }
    }

    closeModalBuy(){
        this.showBuy=false;
        this.listaBuy=[];
    }

    onChangeNum(event){
        var ids=event.target.dataset.id;
        var value=event.target.value;
        var quantity=event.target.dataset.quantity;
        if(parseInt(value)>parseInt(quantity))
            event.target.value=quantity;
        else if(parseInt(value)<1)
            event.target.value=1;
        
        value=event.target.value;
        this.total=0; 
        for(var i=0; i<this.listaBuy.length; i++)
        {
            if(this.listaBuy[i].Id==ids){
                this.listaBuy[i].Num=parseInt(value);
                this.listaBuy[i].Total=parseInt(value)*parseInt(event.target.dataset.price);
            }
            this.total=parseInt(this.total)+parseInt(this.listaBuy[i].Total);
        }
    }

    addToChart(){
        var list=[];
        var list1={};
        for(var i=0; i<this.listaBuy.length; i++)
        {
            list.push(this.listaBuy[i].Id);
            list1[this.listaBuy[i].Id]=parseInt(this.listaBuy[i].Num);
        }


        console.log(list);
        console.log(list1);
        buyProducts({ids: list, num: list1}).then(result =>{
            var mes='Selected product is placed in the cart'
            if(list.length>1)
                mes='Selected products are placed in the cart';
            if(list.length>0){
                    const evt = new ShowToastEvent({
                        title: 'Buying products',
                        message: mes,
                        variant: 'success',
                    });
                    this.dispatchEvent(evt);
            }
            this.showBuy=false;
        }).catch(error=>{
            console.log(error);
        });
    }

    onShowDetail(event){
        this.idDetail=event.target.dataset.id;
        addView({idDetail: this.idDetail});
        this.showDetail=true;
    }

    onShowCompare(){
        var list=[];
        var l=this.template.querySelectorAll('.checkboxc');
        for(var i=0; i<l.length; i++)
        {
            if(l[i].checked){
                list.push(l[i].dataset.id);
                //l[i].checked=false;
            }
        }

        if(list.length==2 || list.length==3 || list.length==4){
            this.num=list.length;
            this.listac=[];
            for(var i=0; i<this.num; i++)
                this.listac.push(list[i]);
            this.showCompare=true;
        }
        else if(list.length==1) {
            var mes='Select more products';
            const evt = new ShowToastEvent({
                title: 'Comparing products',
                message: mes,
                variant: 'error',
            });
            this.dispatchEvent(evt);
        }
        else {
            var mes='Select less products';
            const evt = new ShowToastEvent({
                title: 'Comparing products',
                message: mes,
                variant: 'error',
            });
            this.dispatchEvent(evt);
        }
    }

    handleGoBack2(){
        this.refresh();
        this.showCompare=false;
    }

    handleGoBack(){
        this.refresh();
        this.showDetail=false;
    }

    handleGoBack3(){
        this.dispatchEvent(new CustomEvent("goback"));
    }

    handleOnClickAsc(){
        this.asc=true;
        this.desc=false;
        this.ascnum=false;
        this.descnum=false;
        this.rating=false;
        this.refresh();
    }

    handleOnClickDesc(){
        this.asc=false;
        this.desc=true;
        this.ascnum=false;
        this.descnum=false;
        this.rating=false;
        this.refresh();
    }

    handleOnClickAscNum(){
        this.asc=false;
        this.desc=false;
        this.ascnum=true;
        this.descnum=false;
        this.rating=false;
        this.refresh();
    }

    handleOnClickDescNum(){
        this.asc=false;
        this.desc=false;
        this.ascnum=false;
        this.descnum=true;
        this.rating=false;
        this.refresh();
    }

    handleOnClickRating(){
        this.asc=false;
        this.desc=false;
        this.ascnum=false;
        this.descnum=false;
        this.rating=true;
        this.refresh();
    }
}