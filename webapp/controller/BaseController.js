/*global history */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function (Controller, History) {
	"use strict";

	return Controller.extend("tripmanagement.tripmanagement.BaseController", {
		/**
		 * Convenience method for accessing the router in every controller of the application.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},

		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */

		getModel: function (sName) {
			return this.getView().getModel(sName);
		},
		byId: function (sId) {
			return this.getView().byId(sId);
		},
		getViewModel: function () {
			return this.getView().getModel("viewModel");
		},
		refreshViewModel: function () {
			return this.getView().getModel("viewModel").refresh(true);
		},
		refreshModel: function () {
			return this.getView().getModel().refresh(true);
		},
		getViewProperty: function (sPath) {
			return this.getView().getModel("viewModel").getProperty(sPath);
		},
		getProperty: function (sPath) {
			return this.getView().getModel().getProperty(sPath);
		},
		setViewProperty: function (sPath, oValue) {
			var ret;
			ret = this.getView().getModel("viewModel").setProperty(sPath, oValue);
			this.refreshViewModel();
			return ret;
		},
		setProperty: function (sPath, oValue) {
			var ret;
			ret = this.getView().getModel().setProperty(sPath, oValue);
			return ret;
		},
		setBusy: function (tf) {
			if (!tf) {
				this.setViewProperty("/busy", false);
				sap.ui.core.BusyIndicator.hide();
			} else {
				this.setViewProperty("/busy", true);
				sap.ui.core.BusyIndicator.show(0);
			}
		},
		createKey: function (sPath, oArguments) {
			oArguments = (typeof oArguments !== 'undefined') ? oArguments : {};
			return this.getModel().createKey(sPath, oArguments);
		},
		read: function (sEntitySet, oKey, oUrlParameters) {
			oKey = (typeof oKey !== 'undefined') ? oKey : {};
			oUrlParameters = (typeof oUrlParameters !== 'undefined') ? oUrlParameters : {};
			var sKey = this.createKey(sEntitySet, oKey);
			var promise = jQuery.Deferred();
			this.getModel().read("/" + sKey, {
				urlParameters: oUrlParameters,
				success: function (oData, oResponse) {
					console.log(oData);
					promise.resolve(oData);
				},
				error: function (oError) {
					promise.reject({});
				}
			});
			return promise;
		},
		navTo: function (sRoute, oArguments, bCancel) {
			bCancel = (typeof bCancel !== 'undefined') ? bCancel : true;
			oArguments = (typeof oArguments !== 'undefined') ? oArguments : {};
			this.getRouter().navTo(sRoute, oArguments, bCancel);
		},
		navToExternal: function (sSemanticObject, sAction, oParams, sAppStateKey) {
			sAction = (typeof sAction !== 'undefined') ? sAction : "display";
			oParams = (typeof oParams !== 'undefined') ? oParams : {};
			sAppStateKey = (typeof sAppStateKey !== 'undefined') ? sAppStateKey : "";
			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
				target: {
					semanticObject: sSemanticObject,
					action: sAction
				},
				params: oParams,
				appStateKey: sAppStateKey
			})) || "";

			oCrossAppNavigator.toExternal({
				target: {
					shellHash: hash
				}
			});
		},
		saveAppState: function (oArguments) {
			var oHashChanger = sap.ui.core.routing.HashChanger.getInstance();
			var sHash = oHashChanger.getHash();
			var sAppStateKey,
				sStateHash;
			if (sHash.indexOf('sap-iapp-state=') > -1) {
				sAppStateKey = /(?:sap-iapp-state=)([^&=]+)/.exec(sHash)[1];
				sStateHash = "?" + "sap-iapp-state=" + sAppStateKey;
				sHash = sHash.replace(sStateHash, '');
				oHashChanger.replaceHash(sHash);
			}

			var oAppState = sap.ushell.Container.getService("CrossApplicationNavigation").createEmptyAppState(this.getOwnerComponent());
			oAppState.setData(oArguments);
			oAppState.save();

			sHash = oHashChanger.getHash();
			sStateHash = "?" + "sap-iapp-state=" + oAppState.getKey();
			sHash = sHash + sStateHash;
			oHashChanger.replaceHash(sHash);

			return oAppState.getKey();
		},

		loadAppState: function () {
			var promise = jQuery.Deferred();
			var oHashChanger = sap.ui.core.routing.HashChanger.getInstance();
			var sHash = oHashChanger.getHash();
			if (sHash.indexOf('sap-iapp-state=') === -1) {
				setTimeout(function(){
					promise.resolve(undefined);
				}, 200);
			} else {
				var sAppStateKey = /(?:sap-iapp-state=)([^&=]+)/.exec(sHash)[1];
				var sStateHash = "?" + "sap-iapp-state=" + sAppStateKey;
				sHash = sHash.replace(sStateHash, '');
				oHashChanger.replaceHash(sHash);

				sap.ushell.Container.getService("CrossApplicationNavigation").getAppState(this.getOwnerComponent(), sAppStateKey).done(function (
					oSavedAppState) {
					// console.log(oSavedAppState.getData());
					promise.resolve(oSavedAppState.getData());
				});
			}
			return promise;
		},

		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Convenience method for getting the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Event handler for navigating back.
		 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the master route.
		 * @public
		 */
		onNavBack: function () {
			var sPreviousHash = History.getInstance().getPreviousHash(),
				oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

			if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
				history.go(-1);
			} else {
				oCrossAppNavigator.toExternal({
					target: {
						shellHash: "#Shell-home"
					}
				});
			}
		},
		
		_goTo: function (oEvent, sName) {
			this.getOwnerComponent().getRouter().navTo("RouteTrip", { DataPartenza: dateStr, OraPartenza: timeStr });
			//define the router
			// var oRouter = this.getRouter();

			// var sId = oEvent.getParameters().id;

			// var nLength = 18;
			// var nSNameLength = sName.length;
			// var nSIdLength = sId.length;

			// var sDestination = sId.substr(nLength + nSNameLength, nSIdLength - nLength);

			// oRouter.navTo(sDestination);
		}

	});

});