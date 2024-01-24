import {useDataQuery} from '@dhis2/app-runtime';
import {Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle} from '@dhis2/ui';
import React, {useEffect, useState} from 'react';

const cartesianProduct = (arrays) =>
    arrays.reduce((acc, array) => acc.flatMap((x) => array.map((y) => x.concat(y))), [[]]);


const generateAllCombinations = (levels) => cartesianProduct(levels);

const getCombo = (allCombinations, index) => {
    if (index < 0 || index >= allCombinations.length) {
        return null; // Invalid index
    }

    return allCombinations[index];
};

const GenerateForm = (props) => {
    console.log('Props', props)
    /**generate Template */
    const query = {
        dataElements: {
            resource: 'dataElements',
            params: ({dataElements}) => ({
                fields: ['id,name,valueType,categoryCombo[categories[id,name, categoryOptions[id,name]],categoryOptionCombos[id,name,categoryOptions[id,name]]'],
                filter: `id:in:[${dataElements}]`,
                paging: false
            }),
        },
    }

    const [dataElements, setDataElements] = useState([]);

    const {data} = useDataQuery(query, {variables: {dataElements: props.loadedProject.dataElements.map(de => de.id).join(',')}});

    useEffect(() => {
        if (data && data.dataElements) {
            setDataElements(data.dataElements.dataElements);
        }
    }, [data]);
    const handleGenerateHTMLTemplate = () => {
        let template = `
        <!-- Start Custom DHIS 2 Form -->
        <style type="text/css">
            .smaller_font {
                font-size: 11px;
            }

            .INFOLINK_Form {
                    font-family: Arial, Helvetica, sans-serif;
                    width 100%;
                    font-size: 13px;
                    text-align: left;
                    border: 1px solid #cccccc;
            }
            
            .INFOLINK_Form_Container {
                    clear: both;
                    line-height: 140%;
                    display: flex;
                    border-bottom: 1px solid #cccccc;
            }
            
            .INFOLINK_Form_Priority_Container_Outer {
                    width: 100%;
                    background: white;
                    overflow: hidden;
                    position: relative;
                    border-bottom: 1px solid #cccccc;
            }
            
            .INFOLINK_Form_Priority_Container_Inner {
                    width: 100%;
                    position: relative;
                    right: 82%;
                    display: flex;
            }
            
            .INFOLINK_Form_Priority {
                    float: left;
                    /**width:18%**/
                    width: 0%;
                    position: relative;
                    left: 82%;
                    overflow: hidden;
                    min-height: 26px;
                    align-items: stretch;
            }
            
            .INFOLINK_Form_Priority_text {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translateX(-50%) translateY(-50%);
                    color: white;
                    font-size: 16px;
                    white-space: nowrap;
            }
            
            .INFOLINK_Form_Priority_textTier {
                    position: relative;
                    top: 10%;
                    color: black;
                    font-size: 14px;
                    font-weight: normal;
            }
            
            .INFOLINK_Form_Priority_textTierHeader {
                    position: relative;
                    top: 10%;
                    color: Red;
                    font-size: 15px;
                    font-weight: bold;
            }
            
            .INFOLINK_Form_Description {
                    float: left;
                    width: 82%;
                    position: relative;
                    left: 82%;
                    overflow: hidden;
                    text-align: left;
                    padding: 4px 8px 4px 8px;
                    color: black;
                    font-weight: bold;
            }
            
            .INFOLINK_Form_Description_No_Priority {
                    text-align: left;
                    padding: 4px 8px 4px 8px;
                    color: black;
                    font-weight: bold;
            }
            
            .INFOLINK_reporting_legend {
                    text-align: right;
                    display: block;
                    margin: 10
            }
            
            .INFOLINK_Form_Title {
                    background-color: #1f497d;
                    color: #ffffff;
                    font-size: 20;
                    padding: 4px 8px 4px 8px;
                    cursor: pointer;
                    border: none;
            }
            
            .INFOLINK_Form_Title_Quarterly {
                    background-color: #64AB23;
                    color: #ffffff;
            }
            
            .INFOLINK_Form_Title_Quarterly:hover {
                    background-color: #7AD12B;
                    text-decoration: none;
            }
            
            .INFOLINK_quarterly_square {
                    font-size: 26px;
                    color: #64AB23;
            }
            
            .INFOLINK_Form_Title_Semiannually {
                    background-color: #DF8500;
                    color: #ffffff;
            }
            
            .INFOLINK_Form_Title_Semiannually:hover {
                    background-color: #FF9800;
                    text-decoration: none;
            }
            
            .INFOLINK_semiannually_square {
                    font-size: 26px;
                    color: #DF8500;
            }
            
            .INFOLINK_Form_Title_Annually {
                    background-color: #68468F;
                    color: #ffffff;
            }
            
            .INFOLINK_Form_Title_Annually:hover {
                    background-color: #8F60C4;
                    text-decoration: none;
            }
            
            .INFOLINK_annually_square {
                    font-size: 26px;
                    color: #68468F;
            }
            
            .INFOLINK_Form_Title::after {
                    content: "-  Collapse";
                    left: 84%;
                    position: absolute;
                    color: white;
            }
            
            .INFOLINK_Form_Title.expanded {
                    background-size: 18px;
            }
            
            .INFOLINK_Form_Title.expanded::after {
                    content: "+  Expand";
                    left: 84%;
                    position: absolute;
            }
            
            .INFOLINK_Form_ShowHide {
                    background-size: 18px;
                    padding: 8px;
                    cursor: pointer;
            }
            
            .INFOLINK_Form_ShowHide::after {
                    content: "- Collapse All";
                    left: 1%;
                    position: absolute;
                    color: #2e6e9e;
                    font-size: 14px;
                    font-weight: bold;
            }
            
            .INFOLINK_Form_ShowHide.expanded {
                    background-size: 18px;
            }
            
            .INFOLINK_Form_ShowHide.expanded::after {
                    content: "+ Expand All";
                    left: 1%;
                    position: absolute;
            }
            
            .INFOLINK_Form_Collapse {
                    clear: both;
                    line-height: 140%;
                    display: block;
                    border-bottom: 1px solid #cccccc;
            }
            
            .INFOLINK_Form_Priority_conditional {
                    color: #ffffff;
                    background-color: #66a5f4;
            }
            
            .INFOLINK_Form_Priority_optional {
                    color: #ffffff;
                    background-color: #66a5f4;
            }
            
            .INFOLINK_Form_Priority_required {
                    color: #ffffff;
                    /**background-color: #66a5f4;**/
            }
            
            .INFOLINK_Form_Priority_auto_calculate {
                    color: #ffffff;
                    background-color: #66a5f4;
            }
            
            .INFOLINK_Form_Priority_dreams_only {
                    color: #ffffff;
                    background-color: #66a5f4;
            }
            
            .INFOLINK_lvl_one {
                    border-right: 5px double rgb(92, 156, 204);
                    background-color: rgba(130, 180, 255, 1);
            }
            
            .INFOLINK_lvl_two {
                    border-right: 4px dotted rgb(92, 156, 204);
                    background-color: rgba(180, 180, 160, .66);
            }
            
            .INFOLINK_Form_Empty {
                    display: inline;
                    padding: 8px 2px 8px 2px;
                    float: left;
                    width: 44px;
                    text-align: center;
            }
            
            .INFOLINK_Form_Empty_half {
                    width: 22px;
                    float: left;
                    display: inline;
                    padding: 8px 1px 8px 1px;
                    text-align: center;
            }
            
            .INFOLINK_Form_Empty_double {
                    width: 88px;
                    float: left;
                    display: inline;
                    padding: 8px 16px 8px 16px;
                    text-align: center;
            }
            
            .bold {
                    color: #0874AA;
                    font-weight: bold;
            }
            
            .INFOLINK_Form_EntryName,
            .INFOLINK_Form_EntryName_b {
                    float: left;
                    min-width: 140;
                    max-width: 140;
                    display: inline;
                    padding: 8px;
                    text-align: right;
            }
            
            .INFOLINK_Form_EntryName_Wide,
            .INFOLINK_Form_EntryName_Wide_b {
                    float: left;
                    min-width: 220;
                    max-width: 220;
                    display: inline;
                    padding: 8px;
                    text-align: right;
            }
            
            .INFOLINK_Form_EntryName_extraWide,
            .INFOLINK_Form_EntryName__extraWide_b {
                    float: left;
                    min-width: 300;
                    max-width: 300;
                    display: inline;
                    padding: 8px;
                    text-align: right;
            }
            
            .INFOLINK_Form_EntryName_Thin,
            .INFOLINK_Form_EntryName_Thin_b {
                    float: left;
                    min-width: 70;
                    max-width: 70;
                    display: inline;
                    padding: 8px;
                    text-align: right;
            }
            
            .INFOLINK_Form_EntryName_b,
            .INFOLINK_Form_EntryName_Wide_b,
            .INFOLINK_Form_EntryName_Thin_b {
                    font-weight: bold;
            }
            
            .INFOLINK_Form_EntryField {
                    display: inline;
                    padding: 8px 2px 8px 2px;
                    float: left;
                    width: 44px;
                    text-align: center;
            }
            
            .INFOLINK_Form_EntryFieldTier {
                    display: inline;
                    padding: 8px 2px 8px 2px;
                    float: left;
                    width: 88px;
                    text-align: center;
            }
            
            .INFOLINK_Form_OptionSet {
                    display: inline;
                    padding: 8px 8px 8px 8px;
                    width: 132px;
                    float: left;
                    text-align: left;
            }
            
            .INFOLINK_Form_Narrative {
                    display: inline;
                    padding: 8px 4px 8px 4px;
                    min-width: 580;
                    max-width: 840;
                    float: left;
                    text-align: left;
            }
            
            .INFOLINK_Form_EntryField_wide {
                    padding: 8px 8px 8px 8px;
                    width: 66px;
            }
            
            .INFOLINK_Form_EntryField_150x_wide {
                    padding: 8px 3px 8px 3px;
                    width: 66px;
            }
            
            .INFOLINK_Form_EntryField_2x_wide {
                    padding: 8px 4px 8px 4px;
                    width: 88px;
            }
            
            .INFOLINK_Form_EntryField_3x_wide {
                    padding: 8px 6px 8px 6px;
                    width: 132px;
            }
            
            .INFOLINK_Form_EntryField_4x_wide {
                    padding: 8px 8px 8px 8px;
                    width: 176px;
            }
            
            .INFOLINK_Form_EntryField_6x_wide {
                    padding: 8px 12px 8px 12px;
                    width: 264px;
            }
            
            .INFOLINK_Form_EntryField_input {
                    width: 40;
                    height: 22px;
                    padding: 2px !important;
                    text-align: center;
            }
            
            .INFOLINK_Form_EntryField_narrative {
                    min-width: 580;
                    max-width: 840;
                    height: 90;
                    padding: 2px !important;
            }
            
            .INFOLINK_Form_SubRange_Container {
                    background-color: #D6E0F5;
            }
            
            .ui-widget {
                    border: none;
            }
            
            .ui-widget.ui-widget-content {
                    border: none;
            }
            
            .ui-corner-all,
            .ui-corner-bottom,
            .ui-corner-right,
            .ui-corner-br,
            .ui-corner-left {
                    border-bottom-right-radius: 0;
                    border-bottom-left-radius: 0;
                    border-top-right-radius: 0;
                    border-top-left-radius: 0;
            }
            
            .ui-widget-header {
                    border: 1px solid #4297d7;
                    background: #5c9ccc;
                    margin-top: 2px;
            }
            
            .ui-state-default,
            .ui-widget-content .ui-state-default,
            .ui-widget-header .ui-state-default {
                    border: 1px solid #c5dbec;
                    background: #ffffff;
            }
            
            .ui-tabs-vertical {
                    position: relative;
                    /* position: relative prevents IE scroll bug (element with position: relative inside container with overflow: auto appear as "fixed") */
                    /*padding: 4px;*/
            }
            
            .ui-tabs-vertical .ui-tabs-nav li {
                    list-style: none;
                    float: left;
                    position: relative;
                    top: 0;
                    margin: 0 4px 0 0;
                    border-bottom-width: 0;
                    padding: 0;
            }
            
            .ui-tabs-vertical .ui-tabs-nav .ui-tabs-anchor {
                    float: left;
                    padding: 4px 8px 4px 8px;
                    text-decoration: none;
            }
            
            .ui-tabs-vertical .ui-tabs-nav li.ui-tabs-active {
                    padding-bottom: 1px;
            }
            
            .ui-tabs-vertical .ui-tabs-nav li.ui-tabs-active .ui-tabs-anchor,
            .ui-tabs-vertical .ui-tabs-nav li.ui-state-disabled .ui-tabs-anchor,
            .ui-tabs-vertical .ui-tabs-nav li.ui-tabs-loading .ui-tabs-anchor {
                    cursor: text;
            }
            
            .ui-tabs-collapsible .ui-tabs-nav li.ui-tabs-active .ui-tabs-anchor {
                    cursor: pointer;
            }
            
            .ui-tabs-vertical .ui-tabs-panel {
                    display: block;
                    border-width: 0;
                    padding: 16px 20;
                    background: none;
            }
            
            /***Customize********/
            
            .ui-tabs-vertical {
                    width: 100%;
                    min-width: 200;
            }
            
            .ui-tabs-vertical .ui-tabs-nav {
                    padding: 2px 2px 0 2px;
                    float: left;
                    width: 20%;
                    min-width: 10em;
            }
            
            .ui-tabs-vertical .ui-tabs-nav li {
                    clear: left;
                    width: 100%;
                    border-bottom-width: 1px !important;
                    border-right-width: 0 !important;
                    margin: 0 -1px .2em 0;
            }
            
            .ui-tabs-vertical .ui-tabs-nav li a {
                    display: block;
            }
            
            .ui-tabs-vertical .ui-tabs-nav li.ui-tabs-active {
                    padding-bottom: 0;
                    background: #e8f3fc;
            }
            
            .ui-tabs-vertical .ui-tabs-panel {
                    padding: 1em !important;
                    float: right;
            }
            
            /***Customize********/
            
            .ui-tabs .ui-tabs-nav {
                    padding: .2em .2em 0;
                    width: 100%;
                    max-width: 120em;
            }
            
            .ui-tabs .ui-tabs-nav li {
                    clear: none;
                    width: auto;
                    list-style: none;
                    float: left;
                    position: relative;
                    top: 0;
                    margin: 1px .2em 0 0;
                    border-bottom-width: 0;
                    padding: 0;
            }
            
            .ui-tabs-vertical .ui-tabs-panel {
                    padding: 0em !important;
                    float: left;
                    width: 78%;
                    min-width: 800;
            }
            
            .ui-tabs .ui-tabs-panel {
                    padding: .2em !important;
                    float: left;
                    width: 98%;
            }
            
            .ui-tabs-anchor {
                    width: 100%;
            }
            
            .ui-tabs-vertical .ui-tabs-nav .ui-tabs-anchor {
                    box-sizing: border-box;
            }
            
            .ui-state-active a,
            .ui-state-active a:link,
            .ui-state-active a:visited {
                    color: #900;
            }
            
            .input_total {
                    padding: 5px 2px 2px 2px;
                    height: 19px;
                    border: 1px solid #aaa;
                    background: #ddd;
                    width: 40;
                    display: inline-block;
                    font-size: 12px;
            }
            
            .word_subtotal {
                    font-size: 80%;
            }
            
            /*NO ENTRY*/
            
            .ic_title_disabled {
                    opacity: 0.4;
            }
            
            .muex_disabled,
            .ic_disabled {
                    background-color: #888888;
                    background: repeating-linear-gradient(38deg, #999999, #999999 4px, #B0B0B0 4px, #B0B0B0 8px);
            }
            
            .muex_conflict,
            .ic_conflict {
                    background: #f88 !important;
                    background: repeating-linear-gradient(38deg, #FF6666, #FF6666 4px, #FF3333 4px, #FF3333 8px);
                    border: 1px solid #f66 !important;
            }
        </style>
        <script>
            'use strict';
            $(function () {
                    $('.INFOLINK_Form_Title').click(function (e) {
                            var SH = this.SH ^= 1; // "Simple toggler"
                            $(this).toggleClass("expanded")
                                    .next(".INFOLINK_Form_Collapse").slideToggle();
                    });
                    $('.INFOLINK_Form_ShowHide').click(function (e) {
                            var SH = this.SH ^= 1; // "Simple toggler"
                            //$(this).text(SH ? 'Expand All' : 'Collapse All')
                            $(this).toggleClass("expanded");
                            if (SH)
                                    $(this).parent().find(".INFOLINK_Form_Title").addClass('expanded')
                                            .next(".INFOLINK_Form_Collapse").slideUp();
                            else
                                    $(this).parent().find(".INFOLINK_Form_Title", this.parent).removeClass('expanded')
                                            .next(".INFOLINK_Form_Collapse").slideDown();
                    });
            });
            'use strict';
            /**
             * CERULEAN: Make conditional areas expandable
             * @author: Greg Wilson <gwilson@baosystems.com>
             * @requires: jQuery
             */
            var cerulean = {};
            cerulean.toggle = function (div, display) {
                    var element = $(div).parent().parent().parent();
                    if (display === undefined) {
                            element.siblings().toggle();
                            $(div).children().toggle();
                    } else {
                            element.siblings().toggle(display);
                            $(div).children().first().toggle(display);
                            $(div).children().last().toggle(!display);
                    }
            };
            /**
             * On-load check for what should be hidden
             */
            cerulean.load = function () {
                    //remove old buttons
                    $('.cerulean').remove();
                    //add the buttons
                    var buttons = $('<div class="cerulean" style="float:right;color:red"><span><i class="fa fa-minus-square-o" aria-hidden="true"></i> Collapse</span><span><i class="fa fa-plus-square-o" aria-hidden="true"></i> Expand</span>').appendTo(".INFOLINK_Form_Priority_conditional > .INFOLINK_Form_Description").click(function () {
                            cerulean.toggle(this);
                    });
                    //set up initial state
                    buttons.each(function () {
                            cerulean.toggle(this, false);
                    });
            };
            (function () {
                    var dataSetToRunFor;
                    var firstRun = true;
                    dhis2.util.on(dhis2.de.event.dataValuesLoaded, function (event, ds) {
                            if (dataSetToRunFor && dataSetToRunFor !== ds) {
                            } else {
                                    if (firstRun) {
                                            firstRun = false;
                                            dataSetToRunFor = ds;
                                            $('.INFOLINK_Form_EntryField').find('.entryfield').addClass('INFOLINK_Form_EntryField_input');
                                            $('.INFOLINK_Form_EntryFieldTier').find('.entryfield').addClass('INFOLINK_Form_EntryField_input');
                                            $('.INFOLINK_Form_OptionSet').find('.entryoptionset').addClass('INFOLINK_Form_EntryField_optionset');
                                            $('.INFOLINK_Form_Narrative').find('.entryarea').addClass('INFOLINK_Form_EntryField_narrative');
                                            $('.entryfield').each(function (index) {
                                                    if ($(this).css('background-color') != 'rgb(255, 255, 255)' && !$(this).hasClass('disabled')) {
                                                            $(this).css('background-color', 'rgb(255, 255, 255)');
                                                    }
                                            });
                                    }
                            }
                    });
                    dhis2.util.on(dhis2.de.event.formReady, function (event, ds) {
                            cerulean.load();
                            //Form ready extra js to run
                            //#formReady#
                    });
            })();
        </script`;

        //Build category option combo map
        /*const categoryOptions = [];
        for (let i = 0; i < props.loadedProject.dictfileredVerticalCatComboLevel0.length; i++) {
            categoryOptions.push(props.loadedProject.dictfileredVerticalCatComboLevel0[i].id);
        }
        for (let i = 0; i < props.loadedProject.dictfileredVerticalCatComboLevel1.length; i++) {
            categoryOptions.push(props.loadedProject.dictfileredVerticalCatComboLevel1[i].id);
        }
        for (let i = 0; i < props.loadedProject.dictfileredHorizontalCatComboLevel0.length; i++) {
            categoryOptions.push(props.loadedProject.dictfileredHorizontalCatComboLevel0[i].id);
        }
        for (let i = 0; i < props.loadedProject.dictfileredHorizontalCatComboLevel1.length; i++) {
            categoryOptions.push(props.loadedProject.dictfileredHorizontalCatComboLevel1[i].id);
        }

        const combos = generateAllCombinations(categoryOptions);*/
        const idMap = new Map();
        for (let i = 0; i < dataElements.length; i++) {
            dataElements[i].categoryCombo.categoryOptionCombos.forEach(coc => {
                const combi = JSON.stringify(coc.categoryOptions.map(co => co.id).sort());
                idMap.set(combi, {name: coc.name, id: coc.id})
            })
        }

        const data = props.loadedProject.dataElements[0];

        //First vertical level Navigation
        template += `
        <div class="ui-tabs-vertical ui-helper-clearfix ui-widget ui-widget-content ui-corner-all" id="INFOLINK_Tabs_vertical">
            <ul class="ui-helper-hidden">`;
        for (let i = 0; i < data.HorizontalLevel0.metadata.length; i++) {
            template += `<li class="ui-corner-left"><a href="#INFOLINK_Tabs_vertical_${i}">${data.HorizontalLevel0.metadata[i].name}</a></li>`;
        }
        template += '</ul>';
        for (let i = 0; i < data.HorizontalLevel0.metadata.length; i++) {
            //Second vertical level Navigation
            template += `
                <div id="INFOLINK_Tabs_vertical_${i}">
                    <div id="INFOLINK_Tabs_h_${i}">
                        <ul class="ui-helper-hidden">`;
            for (let j = 0; j < data.HorizontalLevel1.metadata.length; j++) {
                template += `<li><a href="#INFOLINK_Form_${j}">${data.HorizontalLevel1.metadata[j].name}</a></li>`;
            }
            template += '</ul>';
            for (let j = 0; j < data.HorizontalLevel1.metadata.length; j++) {
                template += `
                    <div id="INFOLINK_Form_${j}">
                        <p class="INFOLINK_Form_ShowHide">&nbsp;</p>
                            <div class="INFOLINK_Form">
                `;
                template += `
                    <div class="INFOLINK_Form">
                        <div class="INFOLINK_Form_Collapse">`;

                //Data Elements
                for (let k = 0; k < props.loadedProject.dataElements.length; k++) {
                    const dataElement =  props.loadedProject.dataElements[k];
                    template += `
                        <div class="si_JPFY6dsd">
                            <div>
                                <div class="INFOLINK_Form_Priority_Container_Outer">
                                    <div class="INFOLINK_Form_Priority_Container_Inner INFOLINK_Form_Priority_required">
                                        <div class="INFOLINK_Form_Priority">&nbsp;</div>
                                        <div class="INFOLINK_Form_Description">${dataElement.name}&nbsp;</div>
                                    </div>
                                </div>

                                <div class="INFOLINK_Form_Container">
                                    <div class="INFOLINK_Form_Empty" style="padding-bottom:0;">&nbsp;</div>
                                </div>
                    `;
                    for (let l = 0; l < data.verticalLevel1.metadata.length; l++) {
                        template += `
                        <div class="INFOLINK_Form_Container">
                            <div class="INFOLINK_Form_EntryName">${data.verticalLevel1.metadata[l].name}</div>
                        </div>`;
                    }
                    for (let l = 0; l < data.verticalLevel2.metadata.length; l++) {
                        template += `
                             <div class="INFOLINK_Form_Empty" style="padding-bottom:0;">&nbsp;<br />${data.verticalLevel2.metadata[l].name}</div>
                            `;
                    }
                    template += `
                        </div>
                        <div class="si_JPFY6dsd"><!-- expandable starts -->
                            <div>
                    `;
                    for (let l = 0; l < data.verticalLevel1.metadata.length; l++) {
                        template += `
                            <div class="INFOLINK_Form_Container">
                                    <div class="INFOLINK_Form_Empty" style="padding-bottom:0;">&nbsp;<br />${data.verticalLevel1.metadata[l].name}</div>
                                    <div class="INFOLINK_Form_Container">
                            `;

                        for (let m = 0; m < data.verticalLevel2.metadata.length; m++) {
                            const coc = idMap.get(JSON.stringify([data.HorizontalLevel0.metadata[i].id, data.HorizontalLevel1.metadata[j].id, data.verticalLevel1.metadata[l].id, data.verticalLevel2.metadata[m].id].sort()));
                            template += `<div class="INFOLINK_Form_EntryField"><input id="${dataElement.id}-${coc?.id}-val" name="entryfield" title="${dataElement.name} ${coc?.name}" value="[ ${dataElement.name} ${coc?.name} ]" /></div>`
                        }

                        template += `</div>`;
                    }
                }
                template += `
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            }
        }


        template += `<!--main ends-->
                <script type="text/javascript">
                    $("#INFOLINK_Tabs_vertical").tabs().removeClass("ui-tabs").find("ul").removeClass("ui-helper-hidden");
                    $("#INFOLINK_Tabs_vertical li").removeClass("ui-corner-top");
                    $("[id ^= INFOLINK_Tabs_h]").tabs().find("ul").removeClass("ui-helper-hidden");
                </script><!--1st--><!-- End Custom DHIS 2 Form -->

                <p>&nbsp;</p>
        `;

        // Create a Blob containing the HTML content
        const blob = new Blob([template], {type: 'text/html'});

        // Create a download link
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);


        // Set the download attribute with the desired file name
        link.download = 'hello_world_template.html';

        // Append the link to the document
        document.body.appendChild(link);

        // Trigger a click on the link to start the download
        link.click();

        // Remove the link from the document
        document.body.removeChild(link);
        handleCloseModal();
    };

    const handleCloseModal = () => {
        props.setShowGenerateForm(false)

    };

    return (
        <Modal>
            <ModalTitle>
                Generate Form

            </ModalTitle>
            <ModalContent>
                <p>This might take some time. Please do not navigate away from the page after clicking to proceed</p>

            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={() => handleCloseModal()}>Close</Button>
                    <Button onClick={handleGenerateHTMLTemplate}>Proceed</Button>

                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
}


export default GenerateForm;