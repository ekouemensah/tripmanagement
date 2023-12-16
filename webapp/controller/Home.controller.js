sap.ui.define([
    "tripmanagement/tripmanagement/controller/BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController) {
        "use strict";

        return BaseController.extend("tripmanagement.tripmanagement.controller.Home", {
            onInit: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.attachRouteMatched(this._onRouteMatched, this);
                // Get the current time
                var oCurrentDate = new Date();
                var sCurrentTime = oCurrentDate.getHours() + ":" + oCurrentDate.getMinutes();

                // Get the TimePicker control by its ID
                var oTimePicker = this.getView().byId("OraPartenza");
                var oDatePicker = this.getView().byId("DataPartenza");

                // Set the TimePicker value with the current time
                oTimePicker.setValue(sCurrentTime);
                const yyyy = oCurrentDate.getFullYear();
                let mm = oCurrentDate.getMonth() + 1; // Months start at 0!
                let dd = oCurrentDate.getDate();
                const formattedToday = dd + '.' + mm + '.' + yyyy;
                oDatePicker.setValue(formattedToday);
                this.getView().byId("DataPartenza").setValue(formattedToday);
            },
            _onRouteMatched: function (oEvent) {
                var sRouteName = oEvent.getParameter("name");
                // Handle route matched logic here
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
                        if (id == "application-tripmanagementtripmanagement-display-component---Home--partenza"
                            || id == "container-tripmanagement.tripmanagement---Home--partenza") {
                            // this.getView().byId("partenza").setValue(v[0].getObject().Via + " " + v[0].getObject().Citta);
                            this.getView().byId("partenza").setValue(v[0].getObject().Citta);
                            this.getView().byId("id_partenza").setValue(v[0].getObject().Id);
                        }
                        if (id == "application-tripmanagementtripmanagement-display-component---Home--arrivo"
                            || id == "container-tripmanagement.tripmanagement---Home--arrivo") {
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

                if ((this.getView().byId("partenza").getValue()).length == 0) {
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
                        if (id == "application-tripmanagementtripmanagement-display-component---Home--arrivo"
                            || id == "container-tripmanagement.tripmanagement---Home--arrivo") {
                            this.getView().byId("arrivo").setValue(v[0].getObject().Citta);
                            this.getView().byId("id_arrivo").setValue(v[0].getObject().Id);
                        }


                    }.bind(this)
                });
                var sURI = "/sap/opu/odata/sap/ZTRIPMANAGEMENT_SRV";
                var oDataModel = new sap.ui.model.odata.ODataModel(sURI, true);
                // var serviceUrl = "/FermataSet?$filter=" + "Id eq'" + this.getView().byId("id_partenza").getValue() + "'";;
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
            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            },
            navTo: function (sRoute, oArguments, bCancel) {
                bCancel = (typeof bCancel !== 'undefined') ? bCancel : true;
                oArguments = (typeof oArguments !== 'undefined') ? oArguments : {};
                this.getRouter().navTo(sRoute, oArguments, bCancel);
            },
            onCercaViaggi: function () {
                // this.getOwnerComponent().getRouter().navTo("RouteTrip");
                // this.getRouter().getTargets().display("Trip");
                var oCurrentDate = new Date();  
                var start_date = this.byId("DataPartenza").getDateValue();
                if (start_date == null) {
                    start_date = oCurrentDate;
                }
                

                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyyMMdd" });
                var date = new Date(start_date);
                var dateStr = dateFormat.format(date);

                var start_time = this.byId("OraPartenza").getDateValue();
                var timeFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "HHmmss" });
                var time = new Date(start_time);
                var timeStr = timeFormat.format(time);
                var partenza = this.byId("id_partenza").getValue();
                var arrivo = this.byId("id_arrivo").getValue();
                if (partenza == "" || arrivo =="") {
                    sap.m.MessageToast.show("Entrare partenza e arrivo");
                    return;
                }
                 

                var dateToday = new Date(oCurrentDate);
                var dateTodayStr = dateFormat.format(dateToday);

                var time = new Date(oCurrentDate);
                var timeTodayStr = timeFormat.format(time);

                //non puoi cercare viaggio nel passato
                if (dateStr < dateTodayStr) {
                    sap.m.MessageToast.show("Data nel passato");
                    return;
                }
                if (dateStr == dateTodayStr) {
                    if (timeStr <  timeTodayStr) {
                        timeTodayStr = timeStr;
                    }
                }
               
                this.getOwnerComponent().getRouter().navTo("RouteTrip", {
                    Partenza: partenza, Arrivo: arrivo,
                    DataPartenza: dateStr, OraPartenza: timeStr
                });

            },
            onBus: function () {

                this.getOwnerComponent().getRouter().navTo("RouteBus");

            },
            onTratte: function () {

                this.getOwnerComponent().getRouter().navTo("RouteTratte");

            },
            onFermate: function () {

                this.getOwnerComponent().getRouter().navTo("RouteFermate");

            },

            onViaggi: function () {

                this.getOwnerComponent().getRouter().navTo("RouteViaggi");

            },
            onStatistica: function () {

                this.getOwnerComponent().getRouter().navTo("RouteStatistica");

            },
            onLogin: function () {
                if (!this.login || this.login == null) {
                    this.login = sap.ui.xmlfragment("tripmanagement.tripmanagement.fragments.login", sap.ui.controller(
                        "tripmanagement.tripmanagement.fragments.login"), this);
                    this.getView().addDependent(this.login);
                }
                this.login.open();
            },
            onAbbonamenti: function () {
                if (!this.abbonamenti || this.abbonamenti == null) {
                    this.abbonamenti = sap.ui.xmlfragment("tripmanagement.tripmanagement.fragments.abbonamenti", sap.ui.controller(
                        "tripmanagement.tripmanagement.fragments.abbonamenti"), this);
                    this.getView().addDependent(this.abbonamenti);
                }
                this.abbonamenti.open();
            },
            onMenu: function () {
                var oController = this;
                var oView = this.getView();
                if (!this.admin || this.admin == null) {
                    this.admin = sap.ui.xmlfragment("tripmanagement.tripmanagement.fragments.admin", sap.ui.controller(
                        "tripmanagement.tripmanagement.fragments.admin"));
                    // this.admin = this.loadFragment({
                    //     name: "tripmanagement.tripmanagement.fragments.admin",
                    //     controller: oController,
                    //     models: oView.getModel(),
                    //     data: {
                    //         router: this._oRouter // Pass the router reference
                    //     }
                    // }).then(function(oFragment) {
                    //     oView.addDependent(oFragment);
                    //     oFragment.open();
                    //  });
                    this.getView().addDependent(this.admin);
                }
                this.admin.open();
            }



        });
    });
