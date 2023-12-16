sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/suite/ui/commons/library',
    "sap/ui/model/json/JSONModel",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("tripmanagement.tripmanagement.controller.Fermate", {
            onInit: function () {             
               
            },
            onSalva: function () {             
                var via = this.getView().byId("via").getValue();
                var citta = this.getView().byId("citta").getValue();
                var civico= this.getView().byId("civico").getValue();
                var cap = this.getView().byId("cap").getValue();
                if( via == "" || citta == "" || civico == ""  || cap == ""){ 
                    sap.m.MessageToast.show("Compilare tutti i campi");
                    return;
                }
                var oAddEmpData = {} ; 
                  oAddEmpData.Via = via;
                  oAddEmpData.Citta = citta;
                  oAddEmpData.Civico = civico;
                  oAddEmpData.Cap= cap;
                this.getView().getModel().create("/FermataSet",oAddEmpData,{
                    method:"POST",    
                    success:function (data){
                        if( data.Id == "KO"){ 
                            sap.m.MessageToast.show("Fermata esiste,modificare!");                            
                        }else{
                        sap.m.MessageToast.show("Fermata salvata");
                    }
                    },
                    error: function (data){
                        sap.m.MessageToast.show("Errore in salvataggio");
                    },
                    });
            },
            onValueHelpRequest: function (oEvent) {  
              
                this.fermataDialog = new sap.m.SelectDialog({
                    title: 'Search fermata',
                    search: function (oEvent) {
                      var sValue = oEvent.getParameter("value");
                      var oFilter = new sap.ui.model.Filter({
                        path: "Via",
                        operator: sap.ui.model.FilterOperator.Contains,
                        value1: sValue,
                        and: false
                      });
                      var oBinding = oEvent.getSource().getBinding("items");
                      oBinding.filter(new sap.ui.model.Filter({
                        //filters: [oFilter, oFilter2],
                        filters: [oFilter],
                        and: true
                      }));
                    },
                    confirm: function (oEvent) {
                      var v = oEvent.getParameter("selectedContexts");
                      oEvent.getSource().getBinding("items").filter([]);
                      this.getView().byId("via").setValue(v[0].getObject().Via);
                      this.getView().byId("citta").setValue(v[0].getObject().Citta);
                      this.getView().byId("id_fermata").setValue(v[0].getObject().Id);
                    }.bind(this)
                  });
                  var sURI = "/sap/opu/odata/sap/ZTRIPMANAGEMENT_SRV";
                  var oDataModel = new sap.ui.model.odata.ODataModel(sURI, true);
                  var serviceUrl = "/FermataSet";
                  oDataModel.read(serviceUrl, {
                    success: function (oCompleteEntry, response) {
                        var oResults = oCompleteEntry.results;
                        /* do something */
                        var json = new sap.ui.model.json.JSONModel(oCompleteEntry);                      
                       
                        this.fermataDialog.setModel(json);
                        this.fermataDialog.bindAggregation('items', {
                            path: '/results',
                            template: new sap.m.StandardListItem({
                              title: '{Via}-{Civico}',
                              description: '{Citta}-{Cap}'
                            })
                          });
                    }.bind(this),
                    error: function (oError) {
                        /* do something */
                    }
                });
                
                this.fermataDialog.open();          
               
            }
        
        });
    });
