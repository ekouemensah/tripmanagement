sap.ui.define([
    "sap/ui/core/mvc/Controller"
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
                var oTimePicker = this.getView().byId("timePicker");

                // Set the TimePicker value with the current time
                oTimePicker.setValue(sCurrentTime);
            }
        });
    });
