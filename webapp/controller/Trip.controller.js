sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("tripmanagement.tripmanagement.controller.Trip", {
            onInit: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteTrip").attachPatternMatched(this._onRouteMatched, this);
                // var aFilters = [];
                // var data = this.getParameter("arguments");
                // aFilters.push(new sap.ui.model.Filter("Partenza", sap.ui.model.FilterOperator.EQ, "ROMA"));
                // aFilters.push(new sap.ui.model.Filter("Arrivo", sap.ui.model.FilterOperator.EQ, "MILANO"));
                // aFilters.push(new sap.ui.model.Filter("DataPartenza", sap.ui.model.FilterOperator.EQ, ""));
                // aFilters.push(new sap.ui.model.Filter("OraPartenza", sap.ui.model.FilterOperator.EQ, ""));
                // var oFilter = new sap.ui.model.Filter({
                //     filters: aFilters,
                //     and: true
                // });
                // // this.setViewProperty("/tbBusy", true);
                // this.byId("tbTrip").setBusy(true);
                // this.byId("tbTrip").bindRows({
                //     path: '/TripSet',
                //     filters: [oFilter]
                // });
            },
            _onRouteMatched: function (oEvent) {
                var Arr = [];
                // Google Chart API....
                var baseURL = "http://chart.apis.google.com/chart?cht=qr&chs=250x250&chl=";
                Arr.push({
                    key: "Name",
                    value: "Ekoue"
                   });
                   Arr.push({
                    key: "Surname",
                    value: "MENSAH"
                   });
                 var  allString = escape(JSON.stringify(Arr));
                   var url = baseURL + allString;
                   // setting final URL to image,which I have taken in view....
                //    this.byId("imgId").setSrc(url);

                var aFilters = [];
                // var data = this.getParameter("arguments");
                aFilters.push(new sap.ui.model.Filter("Partenza", sap.ui.model.FilterOperator.EQ, "ROMA"));
                aFilters.push(new sap.ui.model.Filter("Arrivo", sap.ui.model.FilterOperator.EQ, "MILANO"));
                aFilters.push(new sap.ui.model.Filter("DataPartenza", sap.ui.model.FilterOperator.EQ, oEvent.getParameter("arguments").DataPartenza));
                aFilters.push(new sap.ui.model.Filter("OraPartenza", sap.ui.model.FilterOperator.EQ, oEvent.getParameter("arguments").OraPartenza));
                var oFilter = new sap.ui.model.Filter({
                    filters: aFilters,
                    and: true
                });
                // this.setViewProperty("/tbBusy", true);
                this.byId("tbTrip").setBusy(true);
                this.byId("tbTrip").bindRows({
                    path: '/TripSet',
                    filters: [oFilter]
                });

            },
            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            },
            navTo: function (sRoute, oArguments, bCancel) {
                bCancel = (typeof bCancel !== 'undefined') ? bCancel : true;
                oArguments = (typeof oArguments !== 'undefined') ? oArguments : {};
                this.getRouter().navTo(sRoute, oArguments, bCancel);
            },
            getModel: function (sName) {
                return this.getView().getModel(sName);
            },
            onNavigatePress: function (oEvent) {
                var sPath = oEvent.getParameter("row").getBindingContext().getPath();
                var viaggioID = this.byId('tbTrip').getModel().getProperty(sPath).Id;
                this.getOwnerComponent().getRouter().navTo("RouteTripDetails", { ViaggioID: viaggioID});
            }
        });
    });
