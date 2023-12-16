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

	return Controller.extend("tripmanagement.tripmanagement.fragments.login", {

		formatter: formatter,
		formatters: Formatters,

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
		handleBtOk: function (oEvent) {
			if (sap.ui.getCore().byId("username").getValue() == "" ||
			sap.ui.getCore().byId("password").getValue() == "" ) {
			sap.m.MessageToast.show("Entrare utente e password");
			return;
		   }
		   var sURI = "/sap/opu/odata/sap/ZTRIPMANAGEMENT_SRV";
			var oDataModel = new sap.ui.model.odata.ODataModel(sURI, true);
			oDataModel.callFunction("/CheckLogin", "POST",
				{
					User: sap.ui.getCore().byId("username").getValue(),
					Password: sap.ui.getCore().byId("password").getValue(),
					
				}, null,
				function (oDataClose, responseClose) {
					var ret = oDataClose.Return;
					if (ret == "OK"){
						oEvent.getSource().getParent().getParent().byId("bus").setVisible(true);
						oEvent.getSource().getParent().getParent().byId("fermate").setVisible(true);
						oEvent.getSource().getParent().getParent().byId("tratte").setVisible(true);
						oEvent.getSource().getParent().getParent().byId("viaggi").setVisible(true);
						oEvent.getSource().getParent().getParent().byId("statistica").setVisible(true);
					}else{
					sap.m.MessageToast.show("Utente non autorizzato", {
						duration: 5000
					})
				}
				},
				function (oError) {
					sap.m.MessageToast.show("Utente non autorizzato", {
						duration: 5000
					})
				});
			var dialog = oEvent.getSource().getParent();
			try {
				this.opener.getController().handleBtClose(oEvent);
				return;
			} catch (err) {

			}

			dialog.close();
			// if (!this.admin || this.admin == null) {
			// 	this.admin = sap.ui.xmlfragment("tripmanagement.tripmanagement.fragments.admin", sap.ui.controller(
			// 		"tripmanagement.tripmanagement.fragments.admin"),this);
			// 	// this.getView().addDependent(this.admin);
			// }
			// this.admin.open();
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