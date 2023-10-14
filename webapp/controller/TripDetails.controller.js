sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/suite/ui/commons/library',
    "sap/ui/model/json/JSONModel",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("tripmanagement.tripmanagement.controller.TripDetails", {
            onInit: function () {
                // var cnURI = "/sap/opu/odata/sap/ZSPORTAL_NOTICE_CRUD01_SRV/";
                // var oNotices = new sap.ui.model.odata.ODataModel(cnURI, false, "jdiaz", "sineti.01");
                // var oONotices = new sap.ui.model.json.JSONModel();
                // oNotices.read("/znoticeSet", undefined, undefined, false,
                //     function(oData, response) {	oONotices.setData(oData);});
                //        this.getOwnerComponent().setModel(oONotices,"notice");
                var oData = {
                    timelineItems: [
                        {
                            title: "ROMA",
                            date: "2023-01-15"
                        },
                        {
                            title: "MILANO",
                            date: "2023-02-20"
                        }
                        // ... more timeline items
                    ]
                };
                // Create a JSON model and set the data
            var oModel = new sap.ui.model.json.JSONModel(oData);
            this.getView().setModel(oModel);
                // var oItem = new sap.suite.ui.commons.TimelineItem({
                //     dateTime:			"Date(1371020400000)" ,
                //     text:				"test" ,
                //  //   userName:	         	{notice>Subhead}",
                //    // userPicture:		"resources/2018-03-13_12-04-04.jpg",
                //     title:				"" ,
                //     icon:				"sap-icon://edit",
                //     // filterValue:		"Filter Value",
                //     userNameClickable:	true
                //             });
                var oTimeline = new sap.suite.ui.commons.Timeline({
                        alignment:				"Right" ,
                    enableDoubleSided:		false ,
                    axisOrientation:		"Vertical", 
                    width:					"300px", 
                    // height:					"270.7421875px",
                    enableBusyIndicator:	true,
                    enableScroll:			false,
                    // forceGrowing:			true,
                    showFilterBar : false,
                    groupBy:				"",
                    // growingThreshold:		2,
                    // showHeaderBar:			true,
                    showIcons:				true,
                    // showSearch:				true,
                    // sort:					true,
                    sortOldestFirst:		false
                            });
                    // oTimeline.bindAggregation("content", {
                    //                 path: "notice>/results",
                    //                 template: oItem
                    //                                     });
                    // oTimeline.setModel(oONotices);
                    // oTimeline.bindAggregation("content", oItem);
                    oTimeline.bindAggregation("content", {
                        path: "/timelineItems",
                        template:  new sap.suite.ui.commons.TimelineItem({
                            title: "{title}",
                            dateTime: "{date}"
                        })
                    });
                    this.byId("itinerario").addItem(oTimeline);
            }
           
        });
    });
