import {
  LightningElement,
  track,
  api,
  wire
} from 'lwc';
import { refreshApex } from '@salesforce/apex';
import companylogo from '@salesforce/resourceUrl/Rajesh';
import cartlogo from '@salesforce/resourceUrl/AddCart';
import refreshlogo from '@salesforce/resourceUrl/Refresh1';
import tyrelogo from '@salesforce/resourceUrl/Tyre_logo';
import productlist from '@salesforce/apex/CreateOrderPageHandler.prodlist';
import productlistDIS from '@salesforce/apex/CreateOrderPageHandler.prodlistdiscount';
import CreateCartforNormal from '@salesforce/apex/CreateOrderPageHandler.CreateCartforNormal';
import CreateCartforDiscount from '@salesforce/apex/CreateOrderPageHandler.CreateCartforDiscount';
import getcart from '@salesforce/apex/CreateOrderPageHandler.getcart';
import deletecartpro from '@salesforce/apex/CreateOrderPageHandler.deletecartmethod';
import updatefinalqty from '@salesforce/apex/CreateOrderPageHandler.UpdatefinalQuantity';
import createorder from '@salesforce/apex/CreateOrderPageHandler.CreateOrder';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class NewOrderComponent extends LightningElement {

  comapny_logo = companylogo;
  cart_logo = cartlogo;
  refresh_logo = refreshlogo;
  Tyre_logo=tyrelogo;


  @api products=[];
  @track originaldataAll;
  @track originaldataDis;
  @api productsdata;
  @api DiscountProduct;
  @track selectedValue;
  @track isAllProdcuct;
   @track inputValue;
   @track productvalueforsearch;

   //for cart
   @api Cartproducts=[];
   @track isopencart=false;
   @track wiredcart=[];
    cartsize;
    totalamount=0;

   @wire(getcart ) apexMethod;
   @wire(deletecartpro ) apexMethod;

   @wire(getcart) cartList(result) {
    this.wiredcart = result;
    //alert(JSON.stringify(this.wiredcart));

    if (result.data) {
      this.Cartproducts = result.data;
      if(result.data.length >0){
        this.cartsize=result.data.length;
       // alert(JSON.stringify(this.Cartproducts));
       let sum=0;
        for(let i=0;i<this.Cartproducts.length;i++){
         // alert(totalamount);
         sum+=this.Cartproducts[i].Final_Price__c;
        }
        //alert(sum);
        this.totalamount=sum;
      }
      else{
        this.cartsize='';
        this.totalamount=0;
      }
      //cartdatanew=this.Cartproducts;
      //alert(this.totalamount);
      this.error = undefined;
    } else if (result.error) {
      this.error = result.error;
      this.Cartproducts = [];
      //alert('else'+this.Cartproducts);
    }
  }

  connectedCallback() {
    this.selectedValue = 'All';
    this.isAllProdcuct=true;
  }
  get options() {
    return [{
        label: 'All Products',
        value: 'All'
      },
      {
        label: 'Discount Products',
        value: 'Discount'
      }
    ];
  }


  @wire(productlist)
  wiredAccounts({ error, data }) {
    if (data) {
     
      this.products = data;
      this.productsdata=data;
      this.originaldataAll=data;
      
    } else if (error) {
      
      console.log('Error retrieving accounts:', error);
    }
  }
  @wire(productlistDIS)
  wiredAccounts1({ error, data }) {
    if (data) {
      this.DiscountProduct = data;
      this.originaldataDis=data;   
    } else if (error) {
      console.log('Error retrieving accounts:', error);
    }
  } 


//   @wire(getcart)
// imperativeWiring(result) {
//     this.wiredContactResult = result;
//     if(result.data) {
//         this.Cartproducts = result.data;
//     }
// }

  

  handleRadioChange(event) {
    this.selectedValue = event.target.value;
    this.selectedValue = event.detail.value;
    //alert(this.selectedValue)
    if(this.selectedValue=='All'){
      this.isAllProdcuct=true;
      this.products=this.productsdata;
      this.originaldata=this.productsdata;
    }
    else{
      this.isAllProdcuct=false;
      this.products=this.DiscountProduct;
      this.originaldata=this.DiscountProduct;
    }
  }
  handlenamechange(event){
    this.inputValue=event.target.value;
  }
  createcart(event) {
   var productdatanew=this.products;
   const index = event.target.dataset.index;
   const itemname=productdatanew[index].Item_Master__r.Name;
   const quantiy=this.inputValue;
   const tyresize=productdatanew[index].Item_Master__r.Tyre_Size__c;
   const unitprice=productdatanew[index].Unit_Price__c;
   const variant=productdatanew[index].Variant__c;
   if(this.inputValue){
   if(this.isAllProdcuct==true){
   CreateCartforNormal({ ProductName: itemname,Tyresize: tyresize,UnitPrice:unitprice,Quantity:quantiy})
      .then(result => {
       const toastEvent = new ShowToastEvent({
        message: 'Product Added to Cart !!!',
        variant: 'success',
      });
      this.dispatchEvent(toastEvent);
      refreshApex(this.wiredcart);
      // alert(this.cartsize);
      // this.noofcart=this.cartsize+1;
      // //this.inputValue='';
      })
      .catch(error => {
      });
    }
    else{
      CreateCartforDiscount({ ProductName: itemname,Tyresize: tyresize,UnitPrice:unitprice,Quantity:quantiy,Variant:variant})
      .then(result => {
       const toastEvent = new ShowToastEvent({
        message: 'Product Added to Cart !!!',
        variant: 'success',
      });
      this.dispatchEvent(toastEvent);
      refreshApex(this.wiredcart);
      })
      .catch(error => {      
      });
    }   
  }
  else{
    const toastEvent = new ShowToastEvent({
      message: 'Please enter some Quantity !!!',
      variant: 'error',
    });
    this.dispatchEvent(toastEvent);
  }
}
searchproduct(event){
  const searchvalue=event.target.value.toLowerCase();
  if(searchvalue){
      this.productvalueforsearch=this.products;
      if(this.productvalueforsearch){
        let searchRecords = [];
        for(let record of this.productvalueforsearch){
          if(record.Item_Master__r.Name.toLowerCase().includes(searchvalue)){
            searchRecords.push(record);
          }
        }
        this.products = searchRecords;        
      }
  }
  else{
    if(this.isAllProdcuct==true){
    this.products=this.originaldataAll;
    }
    else{
      this.products=this.originaldataDis;
    }
  }
}
// for cart
Cart(event){
  //alert("enter");
  this.isopencart=true;
  //this.getaddtocart();
  refreshApex(this.wiredcart);
 
  }

closeModal(event){
  this.isopencart=false;
}
deletecart(event){
  const index = event.target.dataset.index;
  var cartdata=this.Cartproducts;
  //alert();
  const cartid=cartdata[index].Id;
 
  
    deletecartpro({cartID:cartid})
      .then(result => {
       const toastEvent = new ShowToastEvent({
        message: 'Product remove from Cart !!!',
        variant: 'success',
      });
      this.dispatchEvent(toastEvent);
      //this.getaddtocart(event);
      refreshApex(this.wiredcart);
     // this.inputValue='';
      
      })
      .catch(error => {
      });
      
  //alert(cartdata[index].Id);
}
// getaddtocart(){
//   alert('hi');
//   getcart().then(result => {
//     this.Cartproducts=result
//     alert(JSON.stringify(this.Cartproducts));
    
//     }) .catch();
    
// }
refresh(event){
  //alert('hi');
  location.reload();
}
finalqunat(event){
 // alert('enter');
  const index = event.target.dataset.index;
  var cartdata=this.Cartproducts;
  const cartid=cartdata[index].Id;
  //alert();
  const cartqty=cartdata[index].Quantity__c;
  this.finalqty=event.target.value;
  if(cartqty < this.finalqty){
    const toastEvent = new ShowToastEvent({
      message: 'Final Quantity cannot be greater than entered Quantity !!!',
      variant: 'error',
    });
    this.dispatchEvent(toastEvent);
    refreshApex(this.wiredcart);
    //this.finalqty=cartqty;
  }
  
  else{
    updatefinalqty({ FQty: this.finalqty,Cartid: cartid})
      .then(result => {
       const toastEvent = new ShowToastEvent({
        message: 'Quantity is updated !!!',
        variant: 'success',
      });
      this.dispatchEvent(toastEvent);
      refreshApex(this.wiredcart);
      })
      .catch(error => {
      });
  }
 // alert(cartid);
}
submitDetails(event){
  var cartdata=this.Cartproducts;
  var newcartdata=[];
  //alert(JSON.stringify(cartdata));
  for(var i=0;i<cartdata.length;i++){
    if(cartdata[i].Final_Quantity__c>0){
      newcartdata.push(cartdata[i]);
    }
  }
  if(newcartdata.length>0){
    createorder
    createorder({ cartlist:newcartdata})
      .then(result => {
       const toastEvent = new ShowToastEvent({
        message: 'Order Placed Successfully',
        variant: 'success',
      });
      this.dispatchEvent(toastEvent);
      refreshApex(this.wiredcart);
      })
      .catch(error => {
      });
  }
}

 
}