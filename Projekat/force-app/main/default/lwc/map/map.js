import { LightningElement, api, wire, track } from 'lwc';
import getAllLocations from "@salesforce/apex/Manager.getAllLocations";
import getAllLocationsForProduct from "@salesforce/apex/Manager.getAllLocationsForProduct";

export default class Map extends LightningElement {

    @track
    show=false;
    @track
    mapMarkers;
    @track
    selectedMarkerValue = '';
    @api
    idP;
    @api
    pr;
    @track
    hasmarkers=false;

    connectedCallback() {   
        this.refresh();
    }

    refresh(){
        if(this.pr){
            getAllLocationsForProduct({idP:this.idP}).then(result =>{
                console.log(result);
                this.mapMarkers = JSON.parse(result);
                if(result!='[]')
                    this.hasmarkers=true;
                else
                    this.hasmarkers=false;
                this.show=true;
            }).catch(error=>{
                console.log(error);
            });
        }
        else {
            getAllLocations().then(result =>{
                console.log(result);
                this.mapMarkers = JSON.parse(result);
                if(result!='[]')
                    this.hasmarkers=true;
                else
                    this.hasmarkers=false;
                this.show=true;
            }).catch(error=>{
                console.log(error);
            });
        }
    }


    handleMarkerSelect(event) {
        this.selectedMarkerValue = event.target.selectedMarkerValue;
    }
}