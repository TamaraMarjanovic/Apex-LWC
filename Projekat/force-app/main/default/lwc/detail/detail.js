import { api, LightningElement, track, wire } from 'lwc';
import getOneProduct from "@salesforce/apex/Manager.getOneProduct";
import getProducts from "@salesforce/apex/Manager.getProducts";
import buyProducts from "@salesforce/apex/Manager.buyProducts";
import addReview from "@salesforce/apex/Manager.addReview";
import getAllReviews from "@salesforce/apex/Manager.getAllReviews";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Detail extends LightningElement {

    @track
    showCompare=false;
    @api
    list;
    @api
    idDetail;
    @track
    product;
    @track
    error;
    value;
    @track
    show=false;
    @api
    num=2;
    @api
    listac=[];
    @track
    showBuy=false;
    @track
    listaBuy=[];
    @track
    total=0;
    @track 
    showReview=false;
    @track
    comm='';
    @track
    numm='';
    @track
    seeReviews=false;
    @track
    seeMap=false;
    @track
    reviews=[];
    @track
    see=true;
    @track
    see1=true;
    @track
    showImg=true;

    connectedCallback() {   
        this.refresh();
    }

    refresh(){
        getOneProduct({idDetail: this.idDetail}).then(result =>{
            if(result!=['null','null']){
                this.product = JSON.parse(result[0]);
                if(result[1]!='null'){
                    this.comm = JSON.parse(result[1]);
                    this.numm = this.comm;
                    this.comm=this.comm.Comment__c;
                    this.numm=this.numm.Rating__c;
                }
                
                if(this.template.querySelector('.content')!=null)
                    this.template.querySelector('.content').style.gridTemplateRows= 'minmax(40px, 10%) minmax(300px, 80%) minmax(40px, 10%) 0%';
                if(this.template.querySelector('.see')!=null){
                    this.template.querySelector('.see').label= 'See all reviews';
                    this.template.querySelector('.see').title= 'See all reviews';
                }
                if(this.template.querySelector('.see1')!=null){
                    this.template.querySelector('.see1').label= 'Available in stores';
                    this.template.querySelector('.see1').title= 'Available in stores';
                }
                this.see1=true;
                this.see=true;
                this.seeReviews=false;
                this.seeMap=false;
            }
            this.show=true;
        }).catch(error=>{
            console.log(error);
        });
    }

    onBuy(){
        var list=[];
        var p=this.product.Price__c;
        if(p==undefined)
            p=0;
        if(this.product.Quantity__c>0)
            list.push({Id:this.product.Id, Name:this.product.Name, Price:p, Num:1, Quantity:this.product.Quantity__c, Total:p});

        this.total=parseInt(p);
        if(list.length>0){
            this.listaBuy=list;
            this.showBuy=true;
        }
        else{
            const evt = new ShowToastEvent({
                title: 'This product is no longer in stock',
                message: 'This product is no longer in stock',
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

    handleBack(){
        this.dispatchEvent(new CustomEvent("goback"));
    }

    handleGoBack2(){
        this.refresh();
        this.showCompare=false;
    }

    onShowCompare(){
        var k=this.num-1;
        var p=this.product.Price__c;
        if(p==undefined)
            p=0;
        getProducts({idDetail: this.idDetail, num:k, subtype: this.product.Subtype__c, type: this.product.Type__c, price: p}).then(result =>{
            var rez = JSON.parse(result);
            this.listac=[];
            this.listac.push(this.idDetail);
            if(rez.length>=k){
                for(var i=0; i<k; i++)
                    this.listac.push(rez[i].Id);
                this.showCompare=true;
            }
        }).catch(error=>{
            console.log(error);
        });
    }

    onAddReview(){
        this.showReview=true;
        setTimeout(() => {
            if(this.numm=='1' && this.template.querySelector('.one')!=null)
                this.template.querySelector('.one').click();
            else  if(this.numm=='2' && this.template.querySelector('.two')!=null)
                this.template.querySelector('.two').click();
                else  if(this.numm=='3' && this.template.querySelector('.three')!=null)
                    this.template.querySelector('.three').click();
                    else  if(this.numm=='4' && this.template.querySelector('.four')!=null)
                        this.template.querySelector('.four').click();
                        else  if(this.numm=='5' && this.template.querySelector('.five')!=null)
                            this.template.querySelector('.five').click();
        }, 8);
    }

    closeModalReview(){
        this.showReview=false;
    }

    onAddReview1(){
        if(this.numm==''){
            const evt = new ShowToastEvent({title: 'Add a rating', message: 'You did not add rating', variant: 'error', });
            this.dispatchEvent(evt);
        }
        else { 
            addReview({idP: this.idDetail, n:this.product.Name, comment:this.comm, num:this.numm}).then(result =>{
                this.showReview=false;
                var t=false;
                if(this.seeReviews)
                    t=true;
                this.refresh();
                if(t)
                    this.handleAllReviews();
                else
                    this.onShowMap();
                const evt = new ShowToastEvent({title: 'You added a review', message: 'You successfully added a review', variant: 'success', });
                this.dispatchEvent(evt);
            }).catch(error=>{
                console.log(error);
            });
        }
    }

    onChangeRate(event){
        this.numm=event.target.value;
    }
    
    onChangeComm(event){
        this.comm=event.target.value;
    }
    
    handleAllReviews(){
        if(!this.seeReviews) {
            this.seeMap=false;
            if(this.template.querySelector('.see1')!=null){
                this.template.querySelector('.see1').label= 'Available in stores';
                this.template.querySelector('.see1').title= 'Available in stores';
                this.see1=false;
            }
            getAllReviews({idP: this.idDetail}).then(result =>{
                this.reviews=JSON.parse(result);
                this.seeReviews=!this.seeReviews;
                if(this.seeReviews) {
                    if(this.template.querySelector('.content')!=null)
                        this.template.querySelector('.content').style.gridTemplateRows= 'minmax(40px, 10%) 0% minmax(40px, 10%) minmax(300px, 80%)';
                    if(this.template.querySelector('.see')!=null)
                        this.template.querySelector('.see').label= 'Close all reviews';
                    if(this.template.querySelector('.see')!=null)
                        this.template.querySelector('.see').title= 'Close all reviews';
                }
            }).catch(error=>{
                console.log(error);
            });
        }
        else {
            this.seeReviews=!this.seeReviews;
            if(this.template.querySelector('.content')!=null)
                this.template.querySelector('.content').style.gridTemplateRows= 'minmax(40px, 10%) minmax(300px, 80%) minmax(40px, 10%) 0%';
            if(this.template.querySelector('.see')!=null)
                this.template.querySelector('.see').label= 'See all reviews';
            if(this.template.querySelector('.see')!=null)
                this.template.querySelector('.see').title= 'See all reviews';
            this.see1=true;
        }
    }

    onShowMap(){
        if(!this.seeMap) {
            this.seeReviews=false;
            if(this.template.querySelector('.see')!=null){
                this.template.querySelector('.see').label= 'See all reviews';
                this.template.querySelector('.see').title= 'See all reviews';
                this.see=false;
                this.seeReviews=false;
            }
        }
        this.seeMap=!this.seeMap;
        if(this.seeMap) {
            this.showImg=false;
            if(this.template.querySelector('.content')!=null)
                this.template.querySelector('.content').style.gridTemplateRows= 'minmax(40px, 10%) 0% minmax(40px, 10%) minmax(300px, 80%)';
            if(this.template.querySelector('.see1')!=null)
                this.template.querySelector('.see1').label= 'Close map';
            if(this.template.querySelector('.see1')!=null)
                this.template.querySelector('.see1').title= 'Close map';
        }
        else {
            this.showImg=true;
            if(this.template.querySelector('.content')!=null)
                this.template.querySelector('.content').style.gridTemplateRows= 'minmax(40px, 10%) minmax(300px, 80%) minmax(40px, 10%) 0%';
            if(this.template.querySelector('.see1')!=null)
                this.template.querySelector('.see1').label= 'Available in stores';
            if(this.template.querySelector('.see1')!=null)
                this.template.querySelector('.see1').title= 'Available in stores';
            this.see=true;
        }
    }
}