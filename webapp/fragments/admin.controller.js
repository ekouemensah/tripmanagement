sap.ui.define([	
	 "tripmanagement/tripmanagement/controller/BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/Device",	
	'jquery.sap.global',
	'sap/m/Link',
	'sap/m/Label',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/m/Text'

], function (BaseController,Controller, JSONModel, MessageToast, Device, formatter, Formatters, Utils, jQuery, Link, Label, Filter, FilterOperator,
	Text) {
	"use strict";

	return BaseController.extend("tripmanagement.tripmanagement.fragments.admin", {
 
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
		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		navTo: function (sRoute, oArguments, bCancel) {
			bCancel = (typeof bCancel !== 'undefined') ? bCancel : true;
			oArguments = (typeof oArguments !== 'undefined') ? oArguments : {};
			this.getRouter().navTo(sRoute, oArguments, bCancel);
		},
		handleBtTratte: function (oEvent) {
		//  this.getOwnerComponent().getRouter().navTo("RouteTratte");
		this._goTo(oEvent, "name",this);		
		// var oRouter = this.getView().getModel("data").getProperty("/router");
		var dialog = oEvent.getSource().getParent().getParent().getParent();
		dialog.close();
	    },
		// _goTo: function(oEvent, sName,self) {
		// 	var oRouter = self.getRouter();
		// }

		
	});
});