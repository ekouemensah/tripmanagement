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
    function (Controller, Filter, FilterOperator,) {
        "use strict";

        return Controller.extend("tripmanagement.tripmanagement.controller.Bus", {
            onInit: function () {             
                // this.busDialog = new sap.m.SelectDialog({
                //     title: 'Search bus',
                //     search: function (e) {
                //       var sValue = e.getParameter("value");
                //       var oFilter = new sap.ui.model.Filter({
                //         path: "Targa",
                //         operator: sap.ui.model.FilterOperator.Contains,
                //         value1: sValue,
                //         and: false
                //       });
                //       var oBinding = e.getSource().getBinding("items");
                //       oBinding.filter(new sap.ui.model.Filter({
                //         //filters: [oFilter, oFilter2],
                //         filters: [oFilter],
                //         and: true
                //       }));
                //     },
                //     confirm: function (e) {
                //       var v = e.getParameter("selectedContexts");
                //       e.getSource().getBinding("items").filter([]);
                //       this.getView().byId("targa").setValue(v[0].getObject().ValueChar);
                //     }
                //   });
                //   this.busDialog.bindAggregation('items', {
                //     path: '/BusSet',
                //     template: new sap.m.StandardListItem({
                //       title: '{Targa}',
                //       description: '{NumeroPosti}'
                //     })
                //   });
            },
            onSalva: function () {             
                var targa = this.getView().byId("targa").getValue();
                var posti = this.getView().byId("numPosti").getValue();
                if( targa == "" || posti == "" || posti <0 ){ 
                    sap.m.MessageToast.show("Compilare targa e numero posti");
                    return;
                }
                var oAddEmpData = {} ; 
                  oAddEmpData.Targa = targa;
                  oAddEmpData.NumeroPosti = posti;
                this.getView().getModel().create("/BusSet",oAddEmpData,{
                    method:"POST",    
                    success:function (data){
                        if( data.Targa == "KO"){ 
                            sap.m.MessageToast.show("Bus esiste,modificare!");                            
                        }else{
                        sap.m.MessageToast.show("Bus salvato");
                    }
                    },
                    error: function (data){
                        sap.m.MessageToast.show("Errore in salvataggio");
                    },
                    });
            },
            onModifica: function () {   
              var targa = this.getView().byId("targa").getValue();
              var posti = this.getView().byId("numPosti").getValue();
              if( targa == "" || posti == "" || posti <0 ){ 
                  sap.m.MessageToast.show("Compilare targa e numero posti");
                  return;
              }
              var oAddEmpData = {} ; 
              oAddEmpData.Targa = targa;              
              oAddEmpData.NumeroPosti = posti;
            this.getView().getModel().update("/BusSet('" + targa + "')",oAddEmpData,{
                method:"PUT",    
                success:function (data){
                   
                    sap.m.MessageToast.show("Bus salvato");
                
                },
                error: function (data){
                    sap.m.MessageToast.show("Errore in salvataggio");
                },
                });
            },
            onValueHelpRequest: function (oEvent) {  
                var that = this.byId('targa'); 
                this.busDialog = new sap.m.SelectDialog({
                    title: 'Search bus',
                    search: function (oEvent) {
                      var sValue = oEvent.getParameter("value");
                      var oFilter = new sap.ui.model.Filter({
                        path: "Targa",
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
                      this.getView().byId("targa").setValue(v[0].getObject().Targa);
                      this.getView().byId("numPosti").setValue(v[0].getObject().NumeroPosti);
                    }.bind(this)
                  });
                  var sURI = "/sap/opu/odata/sap/ZTRIPMANAGEMENT_SRV";
                  var oDataModel = new sap.ui.model.odata.ODataModel(sURI, true);
                  var serviceUrl = "/BusSet";
                  oDataModel.read(serviceUrl, {
                    success: function (oCompleteEntry, response) {
                        var oResults = oCompleteEntry.results;
                        /* do something */
                        var json = new sap.ui.model.json.JSONModel(oCompleteEntry);                      
                       
                        this.busDialog.setModel(json);
                        this.busDialog.bindAggregation('items', {
                            path: '/results',
                            template: new sap.m.StandardListItem({
                              title: '{Targa}',
                              description: '{NumeroPosti}'
                            })
                          });
                    }.bind(this),
                    error: function (oError) {
                        /* do something */
                    }
                });
                
                this.busDialog.open();          
               
            }
        
        });
    });
