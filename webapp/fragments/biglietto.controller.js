sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
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

	return Controller.extend("tripmanagement.tripmanagement.fragments.biglietto", {

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

		handlebeforeOpen: function (oEvent) {
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
			var allString = escape(JSON.stringify(Arr));
			var url = baseURL + allString;
			// setting final URL to image,which I have taken in view....
			sap.ui.getCore().byId("imgId").setSrc(url);
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