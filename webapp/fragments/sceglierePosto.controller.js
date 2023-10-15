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

	return Controller.extend("tripmanagement.tripmanagement.fragments.sceglierePosto", {
 
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