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

	return Controller.extend("tripmanagement.tripmanagement.fragments.abbonamenti", {

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
			var viaggi = "";
			var km = "";
			if ( sap.ui.getCore().byId("rbg2").getSelectedIndex() == 0) {
				if (sap.ui.getCore().byId("nome").getValue() == "" ||
				sap.ui.getCore().byId("cognome").getValue() == "" ||
				sap.ui.getCore().byId("email").getValue() == "" ||
				sap.ui.getCore().byId("choice").getSelectedItem() == null) {
				sap.m.MessageToast.show("Compilare : nome, cognome,email e numero km");
				return;
			}
			km = sap.ui.getCore().byId("choice").getSelectedItem().mProperties.key;
			}
			if ( sap.ui.getCore().byId("rbg2").getSelectedIndex() == 1) {
			if (sap.ui.getCore().byId("Da").getValue() == "" ||
				sap.ui.getCore().byId("A").getValue() == "" ||
				sap.ui.getCore().byId("nome").getValue() == "" ||
				sap.ui.getCore().byId("cognome").getValue() == "" ||
				sap.ui.getCore().byId("email").getValue() == "" ||
				sap.ui.getCore().byId("choice").getSelectedItem() == null) {
				sap.m.MessageToast.show("Compilare tutti i campi");
				return;
			}
			 viaggi = sap.ui.getCore().byId("choice").getSelectedItem().mProperties.key;
		}

			// sap.ui.getCore().byId("rbg2").getSelectedIndex() = 0 --> km
			//sap.ui.getCore().byId("rbg2").getSelectedIndex() = 1 --> viaggi
			//sap.ui.getCore().byId("choice").getSelectedItem().mProperties.key
			
			var sURI = "/sap/opu/odata/sap/ZTRIPMANAGEMENT_SRV";
			var oDataModel = new sap.ui.model.odata.ODataModel(sURI, true);
			oDataModel.callFunction("/InserireAbbonamento", "POST",
				{
					Cognome: sap.ui.getCore().byId("cognome").getValue(),
					Email: sap.ui.getCore().byId("email").getValue(),
					Fine: sap.ui.getCore().byId("A_Id").getValue(),
					Inizio: sap.ui.getCore().byId("Da_Id").getValue(),
					Km: km,
					Nome: sap.ui.getCore().byId("nome").getValue(),
					NumeroViaggi: viaggi,
				}, null,
				function (oDataClose, responseClose) {
					var ret = oDataClose.Return;
					sap.ui.getCore().byId("abbonamento").setText(ret)
					sap.m.MessageToast.show("Abbonamento numero: " + ret, {
						duration: 5000
					})
				},
				function (oError) {

				});
			var dialog = oEvent.getSource().getParent();
			try {
				this.opener.getController().handleBtClose(oEvent);
				return;
			} catch (err) {

			}

			//dialog.close();
			// if (!this.admin || this.admin == null) {
			// 	this.admin = sap.ui.xmlfragment("tripmanagement.tripmanagement.fragments.admin", sap.ui.controller(
			// 		"tripmanagement.tripmanagement.fragments.admin"),this);
			// 	// this.getView().addDependent(this.admin);
			// }
			// this.admin.open();
		},
		onValueHelpRequestPartenza: function (oEvent) {

			if ((sap.ui.getCore().byId("Da").getValue()).length == 0) {
				sap.m.MessageToast.show("Scegliere una partenza");
				return;
			}

			var id = oEvent.mParameters.id;
			this.fermataDialog = new sap.m.SelectDialog({
				title: 'Search fermata',
				search: function (oEvent) {
					var sValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter({
						path: "Via",
						operator: sap.ui.model.FilterOperator.Contains,
						value1: sValue,
						and: false
					});
					var oBinding = oEvent.getSource().getBinding("items");
					oBinding.filter(new sap.ui.model.Filter({
						//filters: [oFilter, oFilter2],
						filters: [oFilter],
						and: true
					}));
				},
				confirm: function (oEvent) {
					var v = oEvent.getParameter("selectedContexts");
					oEvent.getSource().getBinding("items").filter([]);
					if (id == "A") {
						sap.ui.getCore().byId("A").setValue(v[0].getObject().Citta);
						sap.ui.getCore().byId("A_Id").setValue(v[0].getObject().Id);
					}


				}.bind(this)
			});
			var sURI = "/sap/opu/odata/sap/ZTRIPMANAGEMENT_SRV";
			var oDataModel = new sap.ui.model.odata.ODataModel(sURI, true);
			var serviceUrl = "/FermataSet?$filter=" + "Id eq'" + sap.ui.getCore().byId("Da_Id").getValue() + "'";;
			oDataModel.read(serviceUrl, {
				success: function (oCompleteEntry, response) {
					var oResults = oCompleteEntry.results;
					/* do something */
					var json = new sap.ui.model.json.JSONModel(oCompleteEntry);

					this.fermataDialog.setModel(json);
					this.fermataDialog.bindAggregation('items', {
						path: '/results',
						template: new sap.m.StandardListItem({
							title: '{Via}-{Civico}',
							description: '{Citta}-{Cap}'
						})
					});
				}.bind(this),
				error: function (oError) {
					/* do something */
				}
			});

			this.fermataDialog.open();

		},
		onValueHelpRequest: function (oEvent) {
			var id = oEvent.mParameters.id;
			this.fermataDialog = new sap.m.SelectDialog({
				title: 'Search fermata',
				search: function (oEvent) {
					var sValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter({
						path: "Via",
						operator: sap.ui.model.FilterOperator.Contains,
						value1: sValue,
						and: false
					});
					var oBinding = oEvent.getSource().getBinding("items");
					oBinding.filter(new sap.ui.model.Filter({
						//filters: [oFilter, oFilter2],
						filters: [oFilter],
						and: true
					}));
				},
				confirm: function (oEvent) {
					var v = oEvent.getParameter("selectedContexts");
					oEvent.getSource().getBinding("items").filter([]);
					if (id == "Da") {
						// this.getView().byId("partenza").setValue(v[0].getObject().Via + " " + v[0].getObject().Citta);
						sap.ui.getCore().byId("Da").setValue(v[0].getObject().Citta);
						sap.ui.getCore().byId("Da_Id").setValue(v[0].getObject().Id);
					}
					// if (id == "application-tripmanagementtripmanagement-display-component---Viaggi--arrivo"
					// 	|| id == "container-tripmanagement.tripmanagement---Viaggi--arrivo") {
					// 	this.getView().byId("arrivo").setValue(v[0].getObject().Citta);
					// 	this.getView().byId("id_arrivo").setValue(v[0].getObject().Id);
					// }


				}.bind(this)
			});
			var sURI = "/sap/opu/odata/sap/ZTRIPMANAGEMENT_SRV";
			var oDataModel = new sap.ui.model.odata.ODataModel(sURI, true);
			var serviceUrl = "/FermataSet";
			oDataModel.read(serviceUrl, {
				success: function (oCompleteEntry, response) {
					var oResults = oCompleteEntry.results;
					/* do something */
					var json = new sap.ui.model.json.JSONModel(oCompleteEntry);

					this.fermataDialog.setModel(json);
					this.fermataDialog.bindAggregation('items', {
						path: '/results',
						template: new sap.m.StandardListItem({
							title: '{Via}-{Civico}',
							description: '{Citta}-{Cap}'
						})
					});
				}.bind(this),
				error: function (oError) {
					/* do something */
				}
			});

			this.fermataDialog.open();

		},



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