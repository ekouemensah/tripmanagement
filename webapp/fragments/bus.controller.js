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

	return Controller.extend("tripmanagement.tripmanagement.fragments.bus", {

		formatter: formatter,
		formatters: Formatters,

		handleBtClose: function (oEvent) {
			
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
			
		}

		
	});
});