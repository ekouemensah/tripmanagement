sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/suite/ui/commons/library',
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("tripmanagement.tripmanagement.controller.Viaggi", {
            onInit: function () {             
                // Get the current time
                var oCurrentDate = new Date();
                var sCurrentTime = oCurrentDate.getHours() + ":" + oCurrentDate.getMinutes();

                // Get the TimePicker control by its ID
                var oTimePicker = this.getView().byId("OraPartenza1");
                var oDatePicker = this.getView().byId("DataPartenza1");

                // Set the TimePicker value with the current time
                oTimePicker.setValue(sCurrentTime);
                const yyyy = oCurrentDate.getFullYear();
                let mm = oCurrentDate.getMonth() + 1; // Months start at 0!
                let dd = oCurrentDate.getDate();
                const formattedToday = dd + '.' + mm + '.' + yyyy;
                oDatePicker.setValue(formattedToday);

                var oTimePicker2 = this.getView().byId("OraPartenza2");
                var oDatePicker2 = this.getView().byId("DataPartenza2");
                oCurrentDate.setDate(oCurrentDate.getDate() + 7); 
                oTimePicker2.setValue(sCurrentTime);
                let mm2 = oCurrentDate.getMonth() + 1; // Months start at 0!             
                let dd2 = oCurrentDate.getDate();
                const formattedToday2 = dd2 + '.' + mm2 + '.' + yyyy;
                oDatePicker2.setValue(formattedToday2);
                

                var data = new Date();               
                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyyMMdd" });
                var date = new Date(data);
                var dateStr = dateFormat.format(date);

                var data2 = data.setDate(data.getDate() + 7); 
                var date2 = new Date(data2);
                var dateStr2 = dateFormat.format(date2);

                var sURI = "/sap/opu/odata/sap/ZTRIPMANAGEMENT_SRV";
                var oDataModel = new sap.ui.model.odata.ODataModel(sURI, true);
                var serviceUrl = "/SchedulazioneSet?$filter=" + "DataPartenza ge '" + dateStr + "'" +
				"and DataPartenza le'" + dateStr2 + "'";
                var that = this;
                oDataModel.read(serviceUrl, {
                    success: function (oCompleteEntry, response) {
                        var oResults = oCompleteEntry.results;
                        /* do something */
                        var json = new sap.ui.model.json.JSONModel(oCompleteEntry);
                        var oItem = new sap.m.ColumnListItem({
                            cells: [new sap.m.Button({
                               // id: "Viaggio" + "{ViaggiId}",
                                icon: "sap-icon://delete",
                                type: "Reject",
                                press: [that.remove, that]
                            }), new sap.m.Text({
                                text: "{DataPartenza}",                              
                               }),
                               new sap.m.Text({
                                text: "{OraPartenza}",                              
                               }),
                               new sap.m.Text({
                                text: "{Bus}",                              
                               }),
                               new sap.m.Text({
                                text: "{Partenza}",                              
                               }),
                               new sap.m.Text({
                                text: "{Arrivo}",                              
                               }),
                               new sap.m.Text({
                                text: "{ViaggiId}",  
                                visible: false                            
                               }),
                            ]
                        });
                        var oTable = this.getView().byId("tableId1");
                        oTable.setModel(json);
                        oTable.bindAggregation("items", { path: "/results", template: oItem });                        
                    }.bind(this),
                    error: function (oError) {
                        /* do something */
                    }
                });
            },
            onValueHelpRequest: function (oEvent) {
                var id = oEvent.mParameters.id;
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
                        if (id == "application-tripmanagementtripmanagement-display-component---Viaggi--partenza"
                        || id == "container-tripmanagement.tripmanagement---Viaggi--partenza") {
                            // this.getView().byId("partenza").setValue(v[0].getObject().Via + " " + v[0].getObject().Citta);
                            this.getView().byId("partenza").setValue(v[0].getObject().Citta);
                            this.getView().byId("id_partenza").setValue(v[0].getObject().Id);
                        }
                        if (id == "application-tripmanagementtripmanagement-display-component---Viaggi--arrivo"
                        || id == "container-tripmanagement.tripmanagement---Viaggi--arrivo") {
                            this.getView().byId("arrivo").setValue(v[0].getObject().Citta);
                            this.getView().byId("id_arrivo").setValue(v[0].getObject().Id);
                        }                       


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

            },
            onValueHelpRequestPartenza: function (oEvent) {

                if( (this.getView().byId("partenza").getValue()).length == 0 ){ 
                    sap.m.MessageToast.show("Scegliere una partenza");
                    return;
                }
                
                var id = oEvent.mParameters.id;
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
                        if (id == "application-tripmanagementtripmanagement-display-component---Viaggi--arrivo"
                        || id == "container-tripmanagement.tripmanagement---Viaggi--arrivo") {
                            this.getView().byId("arrivo").setValue(v[0].getObject().Citta);
                            this.getView().byId("id_arrivo").setValue(v[0].getObject().Id);
                        }                       


                    }.bind(this)
                });
                var sURI = "/sap/opu/odata/sap/ZTRIPMANAGEMENT_SRV";
                var oDataModel = new sap.ui.model.odata.ODataModel(sURI, true);
                var serviceUrl = "/FermataSet?$filter=" + "Id eq'" + this.getView().byId("id_partenza").getValue() + "'";;
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

            },
            onValueHelpRequestBus: function (oEvent) {  
                var that = this.byId('bus'); 
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
                      this.getView().byId("bus").setValue(v[0].getObject().Targa);
                    //   this.getView().byId("numPosti").setValue(v[0].getObject().NumeroPosti);
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
               
            },
            onAdd: function (oEvent) {
                var partenza = this.getView().byId("id_partenza").getValue();
                var arrivo = this.getView().byId("id_arrivo").getValue();
                var bus= this.getView().byId("bus").getValue();
                var data = this.getView().byId("DataPartenza1").getDateValue();               
                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" });
                var date = new Date(data);
                var dateStr = dateFormat.format(date);
                var ora = this.getView().byId("OraPartenza1").getDateValue();               
                var timeFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "HH:mm:ss" });
                var time = new Date(ora);
                var timeStr = timeFormat.format(time);
                if( partenza == "" || arrivo == "" || bus == ""  || data == ""  || data == "ora"){ 
                    sap.m.MessageToast.show("Compilare tutti i campi");
                    return;
                }

                // var dateToday = new Date(oCurrentDate);
                var dateToday = new Date();
                var dateTodayStr = dateFormat.format(dateToday);

               

                //non puoi schedulare viaggio nel passato
                if (dateStr < dateTodayStr) {
                    sap.m.MessageToast.show("Data nel passato");
                    return;
                }
                
                var oAddEmpData = {} ; 
                oAddEmpData.Partenza = partenza;
                oAddEmpData.Arrivo = arrivo;
                oAddEmpData.Bus = bus;
                oAddEmpData.DataPartenza= dateStr;
                oAddEmpData.OraPartenza= timeStr;
                 //to add a new row
                 var that = this;
                 this.getView().getModel().create("/TripSet",oAddEmpData,{
                    method:"POST",    
                    success:function (data){
                       
                        if( data.ViaggiId == "KO"){ 
                            sap.m.MessageToast.show("Bus già assegnato!");                            
                        }else{
                        //     // var json = new sap.ui.model.json.JSONModel(data);
                        //     var oItem = new sap.m.ColumnListItem({
                        //         cells: [new sap.m.Button({
                        //            // id: "Viaggio" + "{ViaggiId}",
                        //             icon: "sap-icon://delete",
                        //             type: "Reject",
                        //             press: [that.remove, that]
                        //         }), new sap.m.Text({
                        //             text: "{DataPartenza}",                              
                        //            }),
                        //            new sap.m.Text({
                        //             text: "{OraPartenza}",                              
                        //            }),
                        //            new sap.m.Text({
                        //             text: "{Bus}",                              
                        //            }),
                        //            new sap.m.Text({
                        //             text: "{Partenza}",                              
                        //            }),
                        //            new sap.m.Text({
                        //             text: "{Arrivo}",                              
                        //            }),
                        //            new sap.m.Text({
                        //             text: "{ViaggiId}",  
                        //             visible: false                            
                        //            }),
                        //         ]
                        //     });
                        //     var json = new sap.ui.model.json.JSONModel();
                        //     json.setData({
                        //         modelData: {
                        //             viaggi: [
                        //                 data,
                        //             ]
                        //         }
                        //     });
                        //     var oTable = that.getView().byId("tableId1");
                        //     oTable.setModel(json);
                        //      oTable.bindAggregation("items", { path: "/modelData/viaggi", template: oItem });
                        // //    oTable.addItem(oItem);
                        var data = new Date();               
                        var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyyMMdd" });
                        var date = new Date(data);
                        var dateStr = dateFormat.format(date);
        
                        var data2 = data.setDate(data.getDate() + 7); 
                        var date2 = new Date(data2);
                        var dateStr2 = dateFormat.format(date2);
        
                        var sURI = "/sap/opu/odata/sap/ZTRIPMANAGEMENT_SRV";
                        var oDataModel = new sap.ui.model.odata.ODataModel(sURI, true);
                        var serviceUrl = "/SchedulazioneSet?$filter=" + "DataPartenza ge '" + dateStr + "'" +
                        "and DataPartenza le'" + dateStr2 + "'";
                        // var that = that;
                        oDataModel.read(serviceUrl, {
                            success: function (oCompleteEntry, response) {
                                var oResults = oCompleteEntry.results;
                                /* do something */
                                var json = new sap.ui.model.json.JSONModel(oCompleteEntry);
                                var oItem = new sap.m.ColumnListItem({
                                    cells: [new sap.m.Button({
                                       // id: "Viaggio" + "{ViaggiId}",
                                        icon: "sap-icon://delete",
                                        type: "Reject",
                                        press: [that.remove, that]
                                    }), new sap.m.Text({
                                        text: "{DataPartenza}",                              
                                       }),
                                       new sap.m.Text({
                                        text: "{OraPartenza}",                              
                                       }),
                                       new sap.m.Text({
                                        text: "{Bus}",                              
                                       }),
                                       new sap.m.Text({
                                        text: "{Partenza}",                              
                                       }),
                                       new sap.m.Text({
                                        text: "{Arrivo}",                              
                                       }),
                                       new sap.m.Text({
                                        text: "{ViaggiId}",  
                                        visible: false                            
                                       }),
                                    ]
                                });
                                var oTable = that.getView().byId("tableId1");
                                oTable.setModel(json);
                                oTable.bindAggregation("items", { path: "/results", template: oItem });                        
                            }.bind(this),
                            error: function (oError) {
                                /* do something */
                            }
                        });
                    }
                    },
                    error: function (data){
                        sap.m.MessageToast.show("Errore in creazione viaggio");
                    },
                    }).bind(that);
                    
                },
                remove: function (oEvent) {
                    var oTable = this.getView().byId("tableId1");
                    var oButton = oEvent.getSource();
                    var oRow = oButton.getParent();
                    var oContext = oRow.getBindingContext(); // Get the binding context of the row
                    var oModel = oContext.getModel(); // Get the model of the context
                    var oData = oModel.getProperty(oContext.getPath()); // Get the data of the context
                var sURI = "/sap/opu/odata/sap/ZTRIPMANAGEMENT_SRV";
                var oDataModel = new sap.ui.model.odata.ODataModel(sURI, true);
                oDataModel.callFunction("/DeleteViaggio", "POST",
                    {
                        ViaggioId: oData.ViaggiId,
                        
                    }, null,
                    function (oDataClose, responseClose) {
                        var ret = oDataClose.Return;
                        if (ret == "OK") {
                            oTable.removeItem(oEvent.getSource().getParent());
                        }else{
                        sap.m.MessageToast.show(ret, {
                            duration: 5000
                        })
                    }
                    },
                    function (oError) {

                    });
                },
                deleteRow: function (oEvent) {
                    var oTable = this.getView().byId("tableId1");
                    oTable.removeItem(oEvent.getParameter("listItem"));
                },
                onList: function (oEvent) {
                    var partenza = this.getView().byId("id_partenza").getValue();
                var arrivo = this.getView().byId("id_arrivo").getValue();
                var bus= this.getView().byId("bus").getValue();
                
                       var data = this.getView().byId("DataPartenza1").getDateValue();                                 
                        var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyyMMdd" });
                        var date = new Date(data);
                        var dateStr = dateFormat.format(date);
        
                        var data2 = this.getView().byId("DataPartenza2").getDateValue();
                        var date2 = new Date(data2);
                        var dateStr2 = dateFormat.format(date2);
        
                        var sURI = "/sap/opu/odata/sap/ZTRIPMANAGEMENT_SRV";
                        var oDataModel = new sap.ui.model.odata.ODataModel(sURI, true);
                        
                        var serviceUrl = "/SchedulazioneSet?$filter=" + "DataPartenza ge '" + dateStr + "'" +
                        "and DataPartenza le'" + dateStr2 + "'" ;
                        if(bus != "") {
                            serviceUrl = "/SchedulazioneSet?$filter=" + "DataPartenza ge '" + dateStr + "'" +
                            "and DataPartenza le'" + dateStr2 + "'" +
                            "and Bus eq'" + bus + "'";
                        }
                         var that = this;
                        oDataModel.read(serviceUrl, {
                            success: function (oCompleteEntry, response) {
                                var oResults = oCompleteEntry.results;
                                /* do something */
                                var json = new sap.ui.model.json.JSONModel(oCompleteEntry);
                                var oItem = new sap.m.ColumnListItem({
                                    cells: [new sap.m.Button({
                                       // id: "Viaggio" + "{ViaggiId}",
                                        icon: "sap-icon://delete",
                                        type: "Reject",
                                        press: [that.remove, that]
                                    }), new sap.m.Text({
                                        text: "{DataPartenza}",                              
                                       }),
                                       new sap.m.Text({
                                        text: "{OraPartenza}",                              
                                       }),
                                       new sap.m.Text({
                                        text: "{Bus}",                              
                                       }),
                                       new sap.m.Text({
                                        text: "{Partenza}",                              
                                       }),
                                       new sap.m.Text({
                                        text: "{Arrivo}",                              
                                       }),
                                       new sap.m.Text({
                                        text: "{ViaggiId}",  
                                        visible: false                            
                                       }),
                                    ]
                                });
                                var oTable = that.getView().byId("tableId1");
                                oTable.setModel(json);
                                oTable.bindAggregation("items", { path: "/results", template: oItem });                        
                            }.bind(this),
                            error: function (oError) {
                                /* do something */
                            }
                        });
                },
           
            
        });
    });
