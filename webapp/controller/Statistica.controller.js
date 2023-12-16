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

        return Controller.extend("tripmanagement.tripmanagement.controller.Statistica", {
            onInit: function () {
                var sURI = "/sap/opu/odata/sap/ZTRIPMANAGEMENT_SRV";
                var oDataModel = new sap.ui.model.odata.ODataModel(sURI, true);
                var serviceUrl = "/PrenotazioniSet";
                // var that = that;
                oDataModel.read(serviceUrl, {
                    success: function (oCompleteEntry, response) {
                        var oResults = oCompleteEntry.results;
                        /* do something */
                        var json = new sap.ui.model.json.JSONModel(oCompleteEntry);
                        // var oItem = new sap.suite.ui.microchart.ColumnMicroChart({
                        //     value: "{Numero}",   
                        //     label:  "{Data}"  ,
                        //     color: "Neutral"                        
                        //        })

                        // var oTable = this.getView().byId("Chart");
                        // oTable.setModel(json);
                        // oTable.bindAggregation("items", { path: "/results", template: oItem });       
                        json.setData(oCompleteEntry);
                        var oMCChart = this.getView().byId("Chart");
                        oMCChart.setModel(json);
                    }.bind(this),
                    error: function (oError) {
                        /* do something */
                    }
                });
            },



        });
    });
