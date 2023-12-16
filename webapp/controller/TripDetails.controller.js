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

        return Controller.extend("tripmanagement.tripmanagement.controller.TripDetails", {
            onInit: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteTripDetails").attachPatternMatched(this._onRouteMatched, this);

            },
            _onRouteMatched: function (oEvent) {
                var viaggioId = oEvent.getParameter("arguments").ViaggioID;
                this.byId("viaggioId").setValue(viaggioId);
                this.byId("itinerario").destroyItems();
                var itinerari = oEvent.getParameter("arguments").Itinerari;
                this.byId("itinerarioIniziale").setValue(itinerari);
                var prezzo = oEvent.getParameter("arguments").Prezzo;
                this.byId("prezzo").setText(prezzo + " Euro");
                this.byId("prezzoIniziale").setValue(prezzo);
                var posto = oEvent.getParameter("arguments").Posto;
                this.byId("postoAssegnato").setText(posto);
                this.byId("postoIniziale").setValue(posto);
                const myArray = itinerari.split(" ");
                var timelineItems = [];
                var i;
                for (i = 0; i < myArray.length; i++) {
                    if (myArray[i] !== '') {
                        timelineItems.push({ title: myArray[i] });
                    }
                }
                var oData = {
                    timelineItems
                };
                var oModel = new sap.ui.model.json.JSONModel(oData);
                this.getView().setModel(oModel);
                var oTimeline = new sap.suite.ui.commons.Timeline({
                    alignment: "Right",
                    enableDoubleSided: false,
                    axisOrientation: "Vertical",
                    width: "300px",
                    enableBusyIndicator: true,
                    enableScroll: false,
                    showFilterBar: false,
                    groupBy: "",
                    showIcons: true,
                    sortOldestFirst: false
                });
                oTimeline.bindAggregation("content", {
                    path: "/timelineItems",
                    template: new sap.suite.ui.commons.TimelineItem({
                        title: "{title}",
                        dateTime: "{date}"
                    })
                });
                this.byId("itinerario").addItem(oTimeline);

            },
            onSceglierePosto: function () {
                if (!this.SceglierePosto || this.SceglierePosto == null) {
                    this.SceglierePosto = sap.ui.xmlfragment("tripmanagement.tripmanagement.fragments.sceglierePosto", sap.ui.controller(
                        "tripmanagement.tripmanagement.fragments.sceglierePosto"));
                    this.getView().addDependent(this.SceglierePosto);
                }
                this.SceglierePosto.open();
            },
            onAnnullarePosto: function () {
                this.byId("postoAssegnato").setText(this.byId("postoIniziale").getValue());
                this.byId("prezzo").setText(this.byId("prezzoIniziale").getValue() + " Euro");
            },
            onPagare: function () {
                var cliente = "";
                if (this.byId("GroupA").getSelectedIndex() == 0) {
                    if (this.byId("nome").getValue() == "" || this.byId("cognome").getValue() == "" || this.byId("abbonamento_carta").getValue() == "") {
                        sap.m.MessageToast.show("Inserire nome, cognome e coordinate bancarie");
                        return;
                    }
                }
                if (this.byId("GroupA").getSelectedIndex() == 1) {
                    if (this.byId("abbonamento_carta").getValue() == "") {
                        sap.m.MessageToast.show("Inserire numero abbonamento");
                        return;
                    }
                    var sURI = "/sap/opu/odata/sap/ZTRIPMANAGEMENT_SRV";
                    var oDataModel = new sap.ui.model.odata.ODataModel(sURI, true);
                    oDataModel.callFunction("/CheckAbbonamento", "POST",
                        {
                            AbbonamentoId: this.byId("abbonamento_carta").getValue(),
                            ViaggioId: this.byId("viaggioId").getValue(),

                        }, null,
                        function (oDataClose, responseClose) {
                            var ret = oDataClose.Return;
                            if (ret.substring(0, 2) == "KO") {
                                sap.m.MessageToast.show(ret, {
                                    duration: 5000
                                })
                                return;
                            } else {
                                cliente = ret;
                            }

                        },
                        function (oError) {
                            sap.m.MessageToast.show(oError);
                            return;
                        });
                }
                if (this.byId("GroupA").getSelectedIndex() == 1 && cliente == "") {
                    return;
                }   
                 var sURI = "/sap/opu/odata/sap/ZTRIPMANAGEMENT_SRV";
                var oDataModel = new sap.ui.model.odata.ODataModel(sURI, true);
                oDataModel.callFunction("/Prenotare", "POST",
                    {
                        ClienteId: cliente,
                        Itinerario: this.byId("itinerarioIniziale").getValue(),
                        Posto: this.byId("postoAssegnato").getText(),
                        ViaggioId: this.byId("viaggioId").getValue(),
                        Prezzo: this.byId("prezzo").getText(),
                    }, null,
                    function (oDataClose, responseClose) {
                        var ret = oDataClose.Return;

                        sap.m.MessageToast.show(ret, {
                            duration: 5000
                        })
                    },
                    function (oError) {

                    });
                if (!this.Pagare || this.Pagare == null) {
                    this.Pagare = sap.ui.xmlfragment("tripmanagement.tripmanagement.fragments.biglietto", sap.ui.controller(
                        "tripmanagement.tripmanagement.fragments.biglietto"));
                    this.getView().addDependent(this.Pagare);
                }
                this.Pagare.open();
            }

        });
    });
