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
        var gv_fermata = 0;
        return Controller.extend("tripmanagement.tripmanagement.controller.Tratte", {
            onInit: function () {

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
                        if (id == "application-tripmanagementtripmanagement-display-component---Tratte--partenza"
                          || id == "container-tripmanagement.tripmanagement---Tratte--partenza" ) {
                            this.getView().byId("partenza").setValue(v[0].getObject().Via + " " + v[0].getObject().Citta);
                            this.getView().byId("id_partenza").setValue(v[0].getObject().Id);
                        }
                        if (id == "application-tripmanagementtripmanagement-display-component---Tratte--arrivo"
                        || id == "container-tripmanagement.tripmanagement---Tratte--arrivo") {
                            this.getView().byId("arrivo").setValue(v[0].getObject().Via + " " + v[0].getObject().Citta);
                            this.getView().byId("id_arrivo").setValue(v[0].getObject().Id);
                        }
                        if (id.substring(0, 7) == "fermata") {
                            sap.ui.getCore().byId("fermata" + gv_fermata).setValue(v[0].getObject().Via + " " + v[0].getObject().Citta);
                            sap.ui.getCore().byId("id_fermata" + gv_fermata).setValue(v[0].getObject().Id);
                        }

                        if ((this.getView().byId("id_partenza").getValue() != "")
                            && (this.getView().byId("id_arrivo").getValue() != "")
                        && (this.getView().byId("tableId1").getItems().length == 0)) {
                            var that = this;
                            var sURI = "/sap/opu/odata/sap/ZTRIPMANAGEMENT_SRV";
                            var oDataModel = new sap.ui.model.odata.ODataModel(sURI, true);
                            oDataModel.read("/TrattaSet(InizioFermata='" + that.getView().byId("id_partenza").getValue() + "',FineFermata='" + that.getView().byId("id_arrivo").getValue() + "')", {
                                method: "GET",
                                success: function (data) {
                                    that.getView().byId("costo").setValue(parseInt(data.Costo));
                                    that.getView().byId("km").setValue(parseInt(data.Km));
                                    //Get itinerario
                                    var serviceUrl = "/ItinerarioSet?$filter=" + "InizioFermata eq '" + that.getView().byId("id_partenza").getValue() + "'" +
                                        "and FineFermata eq'" + that.getView().byId("id_arrivo").getValue() + "'";
                                    // oDataModel.read("/ItinerarioSet(InizioFermata='" + that.getView().byId("id_partenza").getValue() + "',FineFermata='" + that.getView().byId("id_arrivo").getValue()+ "')", {
                                    //     method: "POST",
                                    oDataModel.read(serviceUrl, {
                                        success: function (data) {
                                            var json = new sap.ui.model.json.JSONModel(data);
                                            var oItem = new sap.m.ColumnListItem({
                                                cells: [new sap.m.Button({
                                                    icon: "sap-icon://delete",
                                                    type: "Reject",
                                                    press: [that.remove, that]
                                                }), new sap.m.Input({
                                                    // id: "fermata" + gv_fermata,
                                                    value: "{Via} - {Citta}",
                                                    showValueHelp: true,
                                                    showSuggestion: true,
                                                    valueHelpRequest: [that.onValueHelpRequest, that] //".onValueHelpRequest"

                                                }),
                                                new sap.m.Input({
                                                    // id: "id_fermata" + gv_fermata,
                                                    value: "{FermataId}",
                                                    visible: false

                                                }),]
                                            });

                                            var oTable = that.getView().byId("tableId1");
                                            oTable.setModel(json);
                                            oTable.bindAggregation("items", { path: "/results", template: oItem });
                                        },
                                        error: function (Error) {
                                            sap.m.MessageToast.show(Error);
                                        }
                                    });

                                },
                                error: function (Error) {
                                    sap.m.MessageToast.show(Error);
                                }
                            });
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
            onAdd: function (oEvent) {
                gv_fermata = gv_fermata + 1;                             //to add a new row
                var oItem = new sap.m.ColumnListItem({
                    cells: [new sap.m.Button({
                        icon: "sap-icon://delete",
                        type: "Reject",
                        press: [this.remove, this]
                    }), new sap.m.Input({
                        id: "fermata" + gv_fermata,
                        showValueHelp: true,
                        showSuggestion: true,
                        valueHelpRequest: [this.onValueHelpRequest, this] //".onValueHelpRequest"

                    }),
                    new sap.m.Input({
                        id: "id_fermata" + gv_fermata,
                        visible: false

                    }),]
                });

                var oTable = this.getView().byId("tableId1");
                oTable.addItem(oItem);
            },
            remove: function (oEvent) {
                var oTable = this.getView().byId("tableId1");
                oTable.removeItem(oEvent.getSource().getParent());
            },
            deleteRow: function (oEvent) {
                var oTable = this.getView().byId("tableId1");
                oTable.removeItem(oEvent.getParameter("listItem"));
            },
            onSalva: function () {
                var id_partenza = this.getView().byId("id_partenza").getValue();
                var id_arrivo = this.getView().byId("id_arrivo").getValue();
                var costo = this.getView().byId("costo").getValue();
                var km = this.getView().byId("km").getValue();
                if (id_partenza == "" || id_arrivo == "" || costo == "" || km == "") {
                    sap.m.MessageToast.show("Compilare tutti i campi");
                    return;
                }
                if (id_partenza == id_arrivo) {
                    sap.m.MessageToast.show("Partenza coincide con arrivo");
                    return;
                }
                var oAddEmpData = {};
                oAddEmpData.InizioFermata = id_partenza;
                oAddEmpData.FineFermata = id_arrivo;
                oAddEmpData.Costo = costo;
                oAddEmpData.Km = km;
                var that = this;
                this.getView().getModel().create("/TrattaSet", oAddEmpData, {
                    method: "POST",
                    success: function (data) {
                        if (data.InizioFermata == "KO") {
                            sap.m.MessageToast.show("Tratta esiste,modificare!");
                        } else {
                            sap.m.MessageToast.show("Tratta salvata");
                            //Salvare itinerario
                            var oTable = that.getView().byId("tableId1").getItems();
                            for (var i = 0; i < oTable.length; i++) {
                                // console.log("Row " + (i + 1) + " cells: ", oTable[i].getCells());
                                var aRowCells = oTable[i].getCells();
                                for (var j = 0; j < oTable[i].getCells().length; j++) {
                                    // console.log("Row "+(i+1)+" cell "+(j+1)+" value: ", aRowCells[j].getText());
                                    if (j == 2) {
                                        var fermataId = aRowCells[j].getValue();
                                        // console.log(cell);
                                        var oAddEmpData2 = {};
                                        oAddEmpData2.InizioFermata = id_partenza;
                                        oAddEmpData2.FineFermata = id_arrivo;
                                        oAddEmpData2.FermataId = fermataId;
                                        oAddEmpData2.Sequenza = (i + 1).toString();
                                        that.getView().getModel().create("/ItinerarioSet", oAddEmpData2, {
                                            method: "POST",
                                            success: function (data) {

                                            },
                                            error: function (data) {
                                                sap.m.MessageToast.show("Errore in salvataggio itinerario");
                                            },
                                        });
                                    }
                                }
                            }
                        }
                    },
                    error: function (data) {
                        sap.m.MessageToast.show("Errore in salvataggio");
                    },
                });


            },
            onModifica: function () {
                var that = this;
                var sURI = "/sap/opu/odata/sap/ZTRIPMANAGEMENT_SRV";
                var oDataModel = new sap.ui.model.odata.ODataModel(sURI, true);
                oDataModel.remove("/TrattaSet(InizioFermata='" + that.getView().byId("id_partenza").getValue() + "',FineFermata='" + that.getView().byId("id_arrivo").getValue() + "')", {
                    method: "DELETE",
                    success: function (data) {   
                        sap.m.MessageToast.show("Tratta salvata");                   
                        //Salvare itinerario
                        var oTable = that.getView().byId("tableId1").getItems();
                        for (var i = 0; i < oTable.length; i++) {
                            // console.log("Row " + (i + 1) + " cells: ", oTable[i].getCells());
                            var aRowCells = oTable[i].getCells();
                            for (var j = 0; j < oTable[i].getCells().length; j++) {
                                // console.log("Row "+(i+1)+" cell "+(j+1)+" value: ", aRowCells[j].getText());
                                if (j == 2) {
                                    var fermataId = aRowCells[j].getValue();
                                    // console.log(cell);
                                    var oAddEmpData2 = {};
                                    oAddEmpData2.InizioFermata = that.getView().byId("id_partenza").getValue();
                                    oAddEmpData2.FineFermata = that.getView().byId("id_arrivo").getValue();
                                    oAddEmpData2.FermataId = fermataId;
                                    oAddEmpData2.Sequenza = (i + 1).toString();
                                    that.getView().getModel().create("/ItinerarioSet", oAddEmpData2, {
                                        method: "POST",
                                        success: function (data) {

                                        },
                                        error: function (data) {
                                            sap.m.MessageToast.show("Errore in salvataggio itinerario");
                                        },
                                    });
                                }
                            }
                        }
                    },
                    error: function (Error) {
                        sap.m.MessageToast.show(Error);
                    }
                });

            }

        });
    });
