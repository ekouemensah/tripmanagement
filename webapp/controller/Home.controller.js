sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("tripmanagement.tripmanagement.controller.Home", {
            onInit: function () {
                // Get the current time
                var oCurrentDate = new Date();
                var sCurrentTime = oCurrentDate.getHours() + ":" + oCurrentDate.getMinutes();

                // Get the TimePicker control by its ID
                var oTimePicker = this.getView().byId("OraPartenza");

                // Set the TimePicker value with the current time
                oTimePicker.setValue(sCurrentTime);
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
                var start_date = this.byId("DataPartenza").getDateValue();
                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyyMMdd" });
                var date = new Date(start_date);
                var dateStr = dateFormat.format(date);

                var start_time = this.byId("OraPartenza").getDateValue();
                var timeFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "hhmmss" });
                var time = new Date(start_time);
                var timeStr = timeFormat.format(time);
                this.getOwnerComponent().getRouter().navTo("RouteTrip", { DataPartenza: dateStr, OraPartenza: timeStr });

            }
        });
    });
