import { LightningElement, track, api, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getstate from '@salesforce/apex/BenificaryAdditionCtrl.getstate';
import getaccount from '@salesforce/apex/BenificaryAdditionCtrl.getcustomer';
import getplant from '@salesforce/apex/BenificaryAdditionCtrl.getplantcode';
import createbeneficiary from '@salesforce/apex/BenificaryAdditionCtrl.addbenificiary';
import { CurrentPageReference } from 'lightning/navigation';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
export default class Dynamicrowcomp extends LightningElement {
    @track createChildval = true;
    @track AccountNameVal = '';
    @api username = '';
    @api sfid = '';
    @api phone = '';
    @track BirthDateVal = '';
    childdata;
    @track nonselectedValueType;
    @track nonselectedValueTypeoperator;
    @track packtypevalue;
    @track customergroupvalue;
    @track fromdate;
    @track todate;
    @track batchnoval;
    @track incotermval;
    @track invoicepaymentuptoval;
    @track reactivationdate;
    @api recordId;

    @track orderName;
    @track productName = '';
    @track birthdate;
    @track orderLineItems = [];
    @track selectedValueList = [];
    @track selectedValueListcust = [];
    @track selectedValueListplant = [];
    @track statedata = []

    //this is for validation of field visibility
    isonboardeddatebetween;
    isArea;
    isreactivationdate;
    isproductcategory;
    iscustomer;
    isisInvoicePaymentupto;
    isgrowthreferenceperiod;
    isstoragelocation;
    isinvoicedatebetween;
    isplantdepot;
    isBatchno;
    isIncoterm;
    ispacktype;
    iscustomergroup;
    isscheme;
    statedata = [];
    customerdata = [];
    plantdata = [];
    @track optionsmul = [];
    @track optionsmulcust = [];
    @track optionsmulplant = [];
    @wire(CurrentPageReference)
    pageRef;
    wiredstateResult;
    @wire(getstate)
    wiredstatess(result) {
        this.wiredstateResult = result;
        if (result.data) {
            this.statedata = result.data;
            this.error = undefined;
        } else if (result.error) {
            this.accounts = undefined;
            this.error = result.error;
        }
    }

    wiredaccResult;
    @wire(getaccount)
    wiredacc(result) {
        this.wiredaccResult = result;
        if (result.data) {
            this.customerdata = result.data;
            //alert(JSON.stringify(this.customerdata));
            this.error = undefined;
        } else if (result.error) {
            this.customerdata = undefined;
            this.error = result.error;
        }
    }
    wireplantResult;
    @wire(getplant)
    wiredplant(result) {
        this.wireplantResult = result;
        if (result.data) {
            this.plantdata = result.data;
            //alert(JSON.stringify(this.customerdata));
            this.error = undefined;
        } else if (result.error) {
            this.plantdata = undefined;
            this.error = result.error;
        }
    }
    renderedCallback() {
        if (!this.retrievedRecordId && this.recordId) {

            this.retrievedRecordId = true; // Escape case from recursion
            // alert('Found recordId: ' + this.recordId);

            // Execute some function or backend controller call that needs the recordId
        }
    }
    connectedCallback() {
        //this.selectedValue = 'All';
        // alert(this.recordId);

        this.createChildval = true;
    }
  

    inputactivationchange(event) {
        this.reactivationdate = event.target.value;
    }
    inputfromdatechange(event) {
        this.fromdate = event.target.value;
    }
    inputtodatechange(event) {
        this.todate = event.target.value;
    }
    inputinvoicepaymentuptochange(event) {
        this.invoicepaymentuptoval = event.target.value;
    }
    inputbatchnochange(event){
        
        this.batchnoval=event.target.value;
        //alert(this.batchnoval);

    }
    inputincotermchange(event){
        this.incotermval=event.target.value;
    }
    addOrderLineItem() {
        //alert(this.isArea);
        //alert(this.nonhandleChangeTypeoperator);
        //alert(this.reactivationdate);
         //alert(this.isBatchno);
         //alert(this.customergroupvalue);
        this.orderLineItems.push({
            criteriatype: this.nonselectedValueType,
            operatorval: this.nonselectedValueTypeoperator,
            value: this.selectedValueList,
            isonboardeddatebetween: this.isonboardeddatebetween,
            areaval: this.isArea,
            fromdate: this.fromdate,
            todate: this.todate,
            isreactivationdate: this.isreactivationdate,
            reactivation_date: this.reactivationdate,
            customer:this.iscustomer,
            customerval:this.selectedValueListcust,
            Invoicepaymentval:this.invoicepaymentuptoval,
            invpayupto:this.isisInvoicePaymentupto,
            plant:this.isplantdepot,
            plantval:this.selectedValueListplant,
            batch:this.isBatchno,
            batchval:this.batchnoval,
            incoterm:this.isIncoterm,
            incoval:this.incotermval,
            pack:this.ispacktype,
            packval:this.packtypevalue,
            customergroupval:this.customergroupvalue,
            customergroup:this.iscustomergroup
           
        })
        //alert(JSON.stringify(this.orderLineItems));
        this.nonselectedValueType = '';
        this.nonselectedValueTypeoperator = '';
        this.nonselectedValueType = '';
        this.reactivationdate = '';
        this.fromdate = '';
        this.todate = '';
        this.invoicepaymentuptoval='';
        this.batchnoval='';
        this.incotermval='';
        this.packtypevalue='';
        this.customergroupvalue='';
        if (this.isArea === true || this.iscustomer===true || this.isplantdepot===true) {
            this.template.querySelector('c-multi-select-pick-list').clearAll();
            this.selectedValueList = [];
            this.selectedValueListcust = [];
            this.selectedValueListplant = [];
        }
        //alert(this.selectedValueList);
        // this.orderLineItems.push({ productName: this.productName, birthdate: this.birthdate, sfid: this.sfid, selectedValueList: this.selectedValueList });
        // alert(JSON.stringify(this.orderLineItems));
        // this.productName = '';
        // this.BirthDateVal = '';
        // this.template.querySelector('c-multi-select-pick-list').clearAll();
    }

    removeOrderLineItem(event) {
        const index = event.target.dataset.index;
        this.orderLineItems.splice(index, 1);
    }
    nonpicklistTypeOptionsoperator = [
        { label: 'Equals to', value: 'Equals to' },
        { label: 'Not Equals to', value: 'Not Equals to' }
    ]
    packtypeoptions = [
        { label: 'Loose', value: 'Loose' },
        { label: 'Packs', value: 'Packs' },
        { label: 'Others', value: 'Others' }
    ]
    customergroupoption = [
        { label: 'Y15', value: 'Y15' },
        { label: 'Y17', value: 'Y17' }
       
    ]


    nonpicklistTypeOptions = [
        { label: 'OnBoarded Date Between', value: 'OnBoarded Date Between' },
        { label: 'Area', value: 'Area' }, { label: 'Reactivation Date', value: 'Reactivation Date' },
         { label: 'Customer', value: 'Customer' },
        // { label: 'Invoice Payment Up to', value: 'Invoice Payment Up to' },
         { label: 'Growth Reference Period', value: 'Growth Reference Period' },
        { label: 'Storage Location', value: 'Storage Location' }, { label: 'Invoice Date Between', value: 'Invoice Date Between' },
        { label: 'Plant/Depot', value: 'Plant/Depot' }, { label: 'Batch No', value: 'Batch No' }, { label: 'Inco Term', value: 'Inco Term' },
        { label: 'Pack Type', value: 'Pack Type' }, { label: 'Customer Group', value: 'Customer Group' }
    ]

    // optionsmul = [{ "attributes": null, "label": "Prospect", "validFor": [], "value": "Prospect" },

    // { "attributes": null, "label": "Prospect1", "validFor": [], "value": "Prospect1" }];
    // createChild(){
    //     this.createChildval=true;
    // }
    handleSelectOptionList(event) {
        console.log(event.detail);
        this.selectedValueList = event.detail;
        console.log(this.selectedValueList);
    }
    handleSelectOptionListcust(event) {
        console.log(event.detail);
        this.selectedValueListcust = event.detail;
        console.log(this.selectedValueList);
    }
    handleSelectOptionListplant(event) {
        console.log(event.detail);
        this.selectedValueListplant = event.detail;
        console.log(this.selectedValueList);
    }

    AccountName(event) {
        this.AccountNameVal = event.target.value;
    }
    nonhandleChangeType(event) {
        this.nonselectedValueType = event.target.value;
        //alert(this.nonselectedValueType);
        if (this.nonselectedValueType === 'OnBoarded Date Between') {
            this.isonboardeddatebetween = true;
        }
        else {
            this.isonboardeddatebetween = false;
        }
        if (this.nonselectedValueType === 'Reactivation Date') {
            this.isreactivationdate = true
        }
        else {
            this.isreactivationdate = false;
        }
        if (this.nonselectedValueType === 'Area') {
            refreshApex(this.wiredstateResult);
            //alert(this.statedata.length);
            //alert(this.optionsmul.length);
            this.optionsmul = [];
            for (let i = 0; i < this.statedata.length; i++) {
                this.optionsmul.push({
                    attributes: null,
                    label: this.statedata[i].State_Code__c,
                    validfor: [],
                    value: this.statedata[i].State_Code__c
                })

            }

            this.isArea = true;
            // alert(this.isArea);
        }
        else {
            this.isArea = false;
        }
        if (this.nonselectedValueType === 'Customer') {
            refreshApex(this.wiredaccResult);
           // alert(JSON.stringify(this.customerdata));
            this.optionsmulcust = [];
            for (let i = 0; i < this.customerdata.length; i++) {
                //alert(this.customerdata[i].Customer_Code__c);
                this.optionsmulcust.push({
                    attributes: null,
                    label: this.customerdata[i].Customer_Code__c,
                    validfor: [],
                    value: this.customerdata[i].Customer_Code__c
                })

            }
            this.iscustomer = true;
        }
        else {
            this.iscustomer = false;
        }
        if (this.nonselectedValueType === 'Invoice Payment Up to') {
            this.isisInvoicePaymentupto = true
        }
        else {
            this.isisInvoicePaymentupto = false;
        }
        if (this.nonselectedValueType === 'Plant/Depot') {
            refreshApex(this.wireplantResult);
           // alert(JSON.stringify(this.customerdata));
            this.optionsmulplant = [];
            for (let i = 0; i < this.plantdata.length; i++) {
                //alert(this.customerdata[i].Customer_Code__c);
                this.optionsmulplant.push({
                    attributes: null,
                    label: this.plantdata[i].Plant_Code__c,
                    validfor: [],
                    value: this.plantdata[i].Plant_Code__c
                })

            }
            this.isplantdepot = true;
        }
        else {
            this.isplantdepot = false;
        }
        if (this.nonselectedValueType === 'Batch No') {
            this.isBatchno = true
        }
        else {
            this.isBatchno = false;
        }
        if (this.nonselectedValueType === 'Inco Term') {
            this.isIncoterm = true
        }
        else {
            this.isIncoterm = false;
        }
        if (this.nonselectedValueType === 'Pack Type') {
            this.ispacktype = true
        }
        else {
            this.ispacktype = false;
        }
        if (this.nonselectedValueType === 'Customer Group') {
            this.iscustomergroup = true
        }
        else {
            this.iscustomergroup = false;
        }

        // alert(this.isonboardeddatebetween);
    }
    nonhandleChangeTypeoperator(event) {
        this.nonselectedValueTypeoperator = event.target.value;
        //alert(this.nonselectedValueTypeoperator);
    }
    nonhandleChangepacktype(event) {
        this.packtypevalue = event.target.value;
       // alert(this.packtypevalue);
    }
    customergroupchange(event){
        this.customergroupvalue=event.target.value;

    }

    handleClick() {
        //alert(this.recordId);
        var mystring = JSON.stringify(this.orderLineItems);
        //alert(mystring);
        createbeneficiary({ benificiarylist: mystring, schemeid: this.recordId })
            .then(result => {
                const evt = new ShowToastEvent({
                    title: 'Benificiary added successfully',
                    message: 'Benificiary added successfully',
                    variant: 'success',
                  });
                  this.dispatchEvent(evt);
                  this.orderLineItems=[];
            })
            .catch(error => {
                console.error('Error:', error);
            });

    }
}