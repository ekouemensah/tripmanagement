sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/Device",
	'jquery.sap.global',
	'sap/m/Link',
	'sap/m/Label',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/m/Text'

], function (Controller, JSONModel, MessageToast, Device, formatter, Formatters, Utils, jQuery, Link, Label, Filter, FilterOperator,
	Text) {
	"use strict";
	var goEvent = "";
	return Controller.extend("tripmanagement.tripmanagement.fragments.sceglierePosto", {

		formatter: formatter,
		formatters: Formatters,
		
		handleBtReset: function (oEvent) {
			var posto =	oEvent.getSource().getParent().byId("postoIniziale").getValue();
			oEvent.getSource().getParent().byId("postoAssegnato").setText(posto);	
			var prezzo =	oEvent.getSource().getParent().byId("prezzoIniziale").getValue();					
			oEvent.getSource().getParent().byId("prezzo").setText(prezzo + " Euro");	
			var dialog = oEvent.getSource().getParent();
			try {
				this.opener.getController().handleBtClose(oEvent);
				return;
			} catch (err) {
				
			}
			
			dialog.close();
		},
		handleBtClose: function (oEvent) {
			// var that = this.opener.getController();
			var dialog = oEvent.getSource().getParent();
			try {
				this.opener.getController().handleBtClose(oEvent);
				return;
			} catch (err) {
				//console.log('handleBtCloseManualWeighingDialog nao implementado');
			}
			// that.setViewProperty("/Weigh", parseFloat(that.getViewProperty("/ManualWeigh")));
			dialog.close();
		},
		handlebeforeOpen: function (oEvent) {
			var viaggioId = oEvent.getSource().getParent().byId("viaggioId").getValue();
			 goEvent = oEvent;
			var sURI = "/sap/opu/odata/sap/ZTRIPMANAGEMENT_SRV";
			var oDataModel = new sap.ui.model.odata.ODataModel(sURI, true);
			var serviceUrl = "/PostiLIberiSet?$filter=" + "ViaggioId eq '" + viaggioId + "'";
			oDataModel.read(serviceUrl, {
				success: function (data) {
					var json = new sap.ui.model.json.JSONModel(data);
					if (sap.ui.getCore().byId("Vbox1")) {
						sap.ui.getCore().byId("Vbox1").removeAllItems();
					}
					if (sap.ui.getCore().byId("Vbox2")) {
						sap.ui.getCore().byId("Vbox2").removeAllItems();
					}
					if (sap.ui.getCore().byId("Vbox3")) {
						sap.ui.getCore().byId("Vbox3").removeAllItems();
					}
					var i;
					for (i = 0; i < data.results.length; i++) {
						var oButton = new sap.m.Button({
							// id: "Posto" + (i),
							type :data.results[i].Type,
							text: data.results[i].NumeroPosti,
							enabled: data.results[i].Occupato,
							press: function () {
								goEvent.getSource().getParent().byId("postoAssegnato").setText(this.mProperties.text);	
							var prezzo =	goEvent.getSource().getParent().byId("prezzoIniziale").getValue();
							prezzo = parseInt(prezzo) + 5;
							goEvent.getSource().getParent().byId("prezzo").setText(prezzo + " Euro");							
							}
						});
						if (data.results.length <= 50) {
							if (i <= 24) {
								sap.ui.getCore().byId("Vbox1").addItem(oButton);
							} else {
								sap.ui.getCore().byId("Vbox2").addItem(oButton);
							}
						}
						if (data.results.length > 50) {
							if (i <= 19) {
								sap.ui.getCore().byId("Vbox1").addItem(oButton);
							}
							if (i > 19 && i <= 39) {
								sap.ui.getCore().byId("Vbox2").addItem(oButton);
							}
							if (i > 39) {
								sap.ui.getCore().byId("Vbox3").addItem(oButton);
							}
						}
					}

				},
				error: function (Error) {
					sap.m.MessageToast.show(Error);
				}
			});
		}




		// handleBtClosemissedPack: function (oEvent) {
		// 	var that = this.opener.getController();
		// 	var dialog = oEvent.getSource().getParent();
		// 	try {
		// 		this.opener.getController().handleBtClosemissedPack(oEvent);
		// 		return;
		// 	} catch (err) {
		// 		//console.log('handleBtCloseManualWeighingDialog nao implementado');
		// 	}
		// 	// that.setViewProperty("/Weigh", parseFloat(that.getViewProperty("/ManualWeigh")));
		// 	dialog.close();
		// },
	});
});