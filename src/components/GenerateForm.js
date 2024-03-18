import {useAlert, useDataQuery} from '@dhis2/app-runtime';
import {Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle} from '@dhis2/ui';
import React, {useEffect, useState} from 'react';
import { CircularLoader } from '@dhis2-ui/loader'


const cartesianProduct = (arrays) =>
    arrays.reduce((acc, array) => acc.flatMap((x) => array.map((y) => x.concat(y))), [[]]);


const generateAllCombinations = (levels) => cartesianProduct(levels);

const getCombo = (allCombinations, index) => {
    if (index < 0 || index >= allCombinations.length) {
        return null; // Invalid index
    }

    return allCombinations[index];
};

const formatDatElement = (labels, de) => {
    return labels.find(l => l.metadataType === 'DataElement' && l.labelDEIDName[0].id === de.id)?.labelName || de.name
}

const formatOption = (labels, dataElement, option, level1, level2, level3, level4) => {
    const label = labels.find(l => {
        const matched = l.metadataType === 'CategoryOption' && l.labelOptionIDName[0].id === option.id;
        const dataElements = (l.labelDEIDName || []).filter(de => de.id);
        if (!dataElements.length) {
            return matched;
        }
        return matched && dataElements[0].id === dataElement
    });

    if (!label) {
        return option.name;
    }

    const dataElements = (label.labelDEIDName || []).filter(de => de.id);
    const de = dataElements.length && dataElements[0] || undefined;
    const inclusion1 = (label.labelInclusionOptionIDName2 || []).filter(l => l.id);
    const inclusion2 = (label.labelInclusionOptionIDName3 || []).filter(l => l.id);


    if (!de && !inclusion1.length) {
        return label.labelName
    }

    if (de && !inclusion1.length) {
        return dataElement === de.id ? label.labelName : option.name
    }
    const levels = [level1, level2, level3, level4];
    if ((dataElement === de?.id) || !de) {
        if (!inclusion2.length) {
            return levels.some(l => label.labelInclusionOptionIDName2.map(i => i.id).includes(l)) ? label.labelName : option.name
        }
        if (inclusion.length) {
            return levels.some(l => label.labelInclusionOptionIDName2.map(i => i.id).includes(l)) &&
            levels.some(l => label.labelInclusionOptionIDName3.map(i => i.id).includes(l)) ? label.labelName : option.name
        }
    }
    return option.name;
}

const skipOption = (rules, dataElement, value, level1, level2, level3, level4) => {
    let skip = false;
    for (let ri = 0; ri < rules.length; ri++) {
        const rule = rules[ri];
        if (rule.categoryExclusionOptionToProcess) {
            const exclusions = rule.categoryExclusionOptionToProcess.map(e => e.id);
            const dataElements = rule.conditionDE?.filter(de => de.id?.length).map(de => de.id) || [];

            if (exclusions.includes(value) && ((dataElements.length && dataElements.includes(dataElement)) || !dataElements.length)) {
                const conditions1 = rule.conditionCategoryOption.map(c => c.id) || [];
                const conditions2 = (rule.conditionCategoryOption2 || []).map(c => c.id);
                const levels = [level1, level2, level3, level4];
                if (conditions1.length && !conditions2.length) {
                    skip = conditions1.some(c => c && levels.includes(c))
                }
                if (conditions1.length && conditions2.length) {
                    skip = conditions1.some(c => c && levels.includes(c)) && conditions2.some(c => c && levels.includes(c))
                }
                if (skip) {
                    return skip;
                }
            }
        }
    }
    return skip;
}

const skipDE = (rules, value, level1) => {
    for (let ri = 0; ri < rules.length; ri++) {
        const rule = rules[ri];
        if (!rule.categoryExclusionOptionToProcess) {
            const conditions = rule.conditionCategoryOption.map(c => c.id) || [];
            return (rule.conditionDE?.map(de => de.id) || []).includes(value) && conditions.some(c => c === level1);
        }
    }
    return false;
}

const GenerateForm = (props) => {
    const [dataElements, setDataElements] = useState([]);
    const [categoryCombos, setCategoryCombos] = useState([]);
    const [isPosting, setIsPosting] = useState(false);

    const {show} = useAlert(
        ({msg}) => msg,
        ({type}) => ({[type]: true})
    )

    const successMessage = () => {
        show({msg: `DataEntryForm successfully posted`, type: 'success'})
        console.log('Successfully Posted')
    }

    const errorMessage = (error) => {
        show({msg: `An error occurred`, type: 'critical'})
        console.error(error)
    }

    /**generate Template */
    const query = {
        dataElements: {
            resource: 'dataElements',
            params: ({dataElements}) => ({
                fields: ['id,name,valueType'],
                filter: `id:in:[${dataElements}]`,
                paging: false
            }),
        },
        categoryCombos: {
            resource: 'categoryCombos',
            params: ({categoryCombos}) => ({
                fields: ['categories[id,name],categoryOptionCombos[id,name,categoryOptions[id,name]]'],
                filter: `id:in:[${categoryCombos}]`,
                paging: false
            }),
        },
    }

    const {
        data: data,
        loading: loading
    } = useDataQuery(query, {
        variables: {
            dataElements: props.loadedProject.dataElements.map(de => de.id).join(','),
            categoryCombos: props.loadedProject.catCombos.map(cc => cc.id).join(',')
        }
    });



  
    useEffect(() => {
        if (data && data.dataElements) {
            setDataElements(data.dataElements.dataElements);
        }
        if (data && data.categoryCombos) {
            setCategoryCombos(data.categoryCombos.categoryCombos);
        }
    }, [data]);
    const handleGenerateHTMLTemplate = () => {
        setIsPosting(true)
        console.log('Poating started')
        let template = `
            <!-- Start Custom DHIS 2 Form -->
            <style type="text/css">
            .smaller_font {
                    font-size: 11px;
            }
            
            .INFOLINK_Form {
                    font-family: Arial, Helvetica, sans-serif;
                    width: 100%;
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
                    margin: 10px
            }
            
            .INFOLINK_Form_Title {
                    background-color: #1f497d;
                    color: #ffffff;
                    font-size: 20px;
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
                    min-width: 140px;
                    max-width: 140px;
                    display: inline;
                    padding: 8px;
                    text-align: right;
            }
            
            .INFOLINK_Form_EntryName_Wide,
            .INFOLINK_Form_EntryName_Wide_b {
                    float: left;
                    min-width: 220px;
                    max-width: 220px;
                    display: inline;
                    padding: 8px;
                    text-align: right;
            }
            
            .INFOLINK_Form_EntryName_extraWide,
            .INFOLINK_Form_EntryName__extraWide_b {
                    float: left;
                    min-width: 300px;
                    max-width: 300px;
                    display: inline;
                    padding: 8px;
                    text-align: right;
            }
            
            .INFOLINK_Form_EntryName_Thin,
            .INFOLINK_Form_EntryName_Thin_b {
                    float: left;
                    min-width: 70px;
                    max-width: 70px;
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
                    min-width: 580px;
                    max-width: 840px;
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
                    width: 40px;
                    height: 22px;
                    padding: 2px !important;
                    text-align: center;
            }
            
            .INFOLINK_Form_EntryField_narrative {
                    min-width: 580px;
                    max-width: 840px;
                    height: 90px;
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
                    padding: 16px 20px;
                    background: none;
            }
            
            /***Customize********/
            
            .ui-tabs-vertical {
                    width: 100%;
                    min-width: 200px;
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
                    min-width: 800px;
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
                    width: 40px;
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
        </script>`;

        //Build a dictionary of category option combo index by combo ID with value as stringified sorted array of options
        const idMap = new Map();
        for (let i = 0; i < categoryCombos.length; i++) {
            categoryCombos[i].categoryOptionCombos.forEach(coc => {
                const combi = JSON.stringify(coc.categoryOptions.map(co => co.id).sort());
                idMap.set(combi, {name: coc.name, id: coc.id})
            })
        }
        //Build list of distinct side navigation
        const sideNav = new Set();
        for (let i = 0; i < props.loadedProject.dataElements.length; i++) {
            sideNav.add(props.loadedProject.dataElements[i].sideNavigation);
        }

        //Building Side Navigation
        template += `
            <div class="ui-tabs-vertical ui-helper-clearfix ui-widget ui-widget-content ui-corner-all" id="INFOLINK_Tabs_vertical">
                <ul class="ui-helper-hidden">`;
        Array.from(sideNav).forEach((sn, i) => {
            template += `<li class="ui-corner-left"><a href="#INFOLINK_Tabs_vertical_${i}">${sn}</a></li>`;
        })

        template += '</ul>';

        //Filter data elements according to side navigation
        Array.from(sideNav).forEach((sn, h) => {
            const dataElements = props.loadedProject.dataElements.filter((d) => d.sideNavigation === sn)

            //Get unique Horizontal level 0
            const horizNavs = dataElements.map(de => de.HorizontalLevel0.metadata).flat();
            const uniqueSet = new Set(horizNavs.map(item => item.id));
            const navs = Array.from(uniqueSet).map(id => horizNavs.find(item => item.id === id));

            //Build Horizontal level 0
            template += `
                <div id="INFOLINK_Tabs_vertical_${h}">
                    <div id="INFOLINK_Tabs_h_${h}">
                        <ul class="ui-helper-hidden">`;
            for (let j = 0; j < navs.length; j++) {
                template += `<li><a href="#INFOLINK_Form_${h}_${j}">${formatOption(props.loadedLabels, '', navs[j], '', '', '', '')}</a></li>`;
            }
            template += '</ul>';
            for (let a = 0; a < navs.length; a++) {
                //Filter dataElements that match current Horizontal level 0 and side navigation
                const _dataElements = dataElements.filter(de => de.HorizontalLevel0.metadata.map(md => md.id).includes(navs[a].id))

                //Get unique collapsible (formComponent)
                const groups = new Set();
                _dataElements.forEach(d1 => groups.add(d1.formComponent))


                //Build formComponent
                template += `
                        <div id="INFOLINK_Form_${h}_${a}">
                            <p class="INFOLINK_Form_ShowHide">&nbsp;</p>
                                <div class="INFOLINK_Form">`;
                groups.forEach((group) => {
                    template += `
                            <div class="INFOLINK_Form_Container INFOLINK_Form_Title INFOLINK_Form_Title_Quarterly">${group}</div>
                                <div class="INFOLINK_Form_Collapse">`;

                    //Filter dataElements that match current Horizontal level 0 and side navigation and formComponent
                    const filteredDE = _dataElements.filter(de => de.formComponent === group)

                    for (let k = 0; k < filteredDE.length; k++) {
                        const dataElement = filteredDE[k];
                        const level1 = dataElement.HorizontalLevel0;
                        const level2 = dataElement.HorizontalLevel1;
                        const level3 = dataElement.verticalLevel1;
                        const level4 = dataElement.verticalLevel2;
                        const level5 = dataElement.verticalLevel3;
                        const level6 = dataElement.verticalLevel4;

                        const skip = skipDE(props.loadedRules, dataElement.id, navs[a].id)
                        if (skip) {
                            continue
                        }
                        //Data Elements
                        template += `
                                <div class="si_JPFY6dsd">
                                    <div>
                                        <div class="INFOLINK_Form_Priority_Container_Outer">
                                            <div class="INFOLINK_Form_Priority_Container_Inner INFOLINK_Form_Priority_required">
                                                <div class="INFOLINK_Form_Priority">&nbsp;</div>
                                                <div class="INFOLINK_Form_Description">${formatDatElement(props.loadedLabels, dataElement)}&nbsp;</div>
                                            </div>
                                        </div>
                            `;

                        //Check for availability of at least 3 levels
                        if (level3?.id) {
                            //Check for availability of at least 4 levels
                            if (level4?.id) {
                                //Check for availability of at least 5 levels
                                if (level5?.id) {
                                    if (level6?.id) {
                                        //Build for 6-levels
                                        for (let b = 0; b < level2.metadata.length; b++) {
                                            const skip = skipOption(props.loadedRules, dataElement.id, level2.metadata[b].id, navs[a].id, '', '', '');
                                            if (skip) {
                                                continue
                                            }
                                            //Build input template
                                            template += `
                                                <div class="INFOLINK_Form_Priority_Container_Outer">
                                                    <div class="INFOLINK_Form_Priority_Container_Inner INFOLINK_Form_Priority_required">
                                                        <div class="INFOLINK_Form_Priority">&nbsp;</div>
                                                        <div class="INFOLINK_Form_Description">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;<span style="color:#ff0000;">${formatOption(props.loadedLabels, dataElement.id, level2.metadata[b], navs[a].id, '', '', '')}</span><span style="color:#add8e6;">&nbsp; &nbsp; </span>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</div>
                                                    </div>
                                                </div>
                                            `;
                                            for (let c = 0; c < level3.metadata.length; c++) {
                                                const skip = skipOption(props.loadedRules, dataElement.id, level3.metadata[c].id, navs[a].id, level2.metadata[b].id, '', '')
                                                if (skip) {
                                                    continue
                                                }
                                                for (let d = 0; d < level4.metadata.length; d++) {
                                                    const skip = skipOption(props.loadedRules, dataElement.id, level3.metadata[c].id, navs[a].id, level2.metadata[b].id, level3.metadata[c].id, '')
                                                    if (skip) {
                                                        continue
                                                    }
                                                    template += `
                                                 <div class="INFOLINK_Form_Container">
                                                    <div class="INFOLINK_Form_EntryName bold" style="padding-bottom:0;">${formatOption(props.loadedLabels, dataElement.id, level3.metadata[c], navs[a].id, level2.metadata[b].id, '', '')}: ${formatOption(props.loadedLabels, dataElement.id, level4.metadata[d], navs[a].id, level2.metadata[b].id, level3.metadata[c].id, '')}</div>`
                                                    for (let e = 0; e < level5.metadata.length; e++) {
                                                        const skip = skipOption(props.loadedRules, dataElement.id, level5.metadata[e].id, navs[a].id, level2.metadata[b].id, level3.metadata[c].id, level4.metadata[c].id)
                                                        if (skip) {
                                                            continue
                                                        }
                                                        template += `
                                                    <div class="INFOLINK_Form_Empty" style="padding-bottom:0;">&nbsp;<br>${formatOption(props.loadedLabels, dataElement.id, level5.metadata[e], navs[a].id, level2.metadata[b].id, level3.metadata[c].id, level4.metadata[c].id).replace(' Years', '')}</div>`;
                                                    }
                                                    template += `</div>`;

                                                    for (let f = 0; f < level6.metadata.length; f++) {
                                                        const skip = skipOption(props.loadedRules, dataElement.id, level6.metadata[f].id, navs[a].id, level2.metadata[b].id, level3.metadata[c].id, level4.metadata[d].id)
                                                        if (skip) {
                                                            continue
                                                        }
                                                        template += `
                                                            <div class="INFOLINK_Form_Container">
                                                                <div class="INFOLINK_Form_EntryName" style="padding-bottom:0;">${formatOption(props.loadedLabels, dataElement.id, level6.metadata[f], navs[a].id, level2.metadata[b].id, level3.metadata[c].id, level4.metadata[d].id)}</div>`;
                                                        for (let e = 0; e < level5.metadata.length; e++) {
                                                            const skip = skipOption(props.loadedRules, dataElement.id, level5.metadata[e].id, navs[a].id, level2.metadata[b].id, level3.metadata[c].id, level4.metadata[d].id, '')
                                                            if (skip) {
                                                                continue
                                                            }
                                                            const coc = idMap.get(JSON.stringify([level1.metadata.find(md => md.id === navs[a].id)?.id, level2.metadata[b].id, level3.metadata[c].id, level4.metadata[e].id, level5.metadata[f].id, level6.metadata[f].id].sort()));
                                                            if (coc) {
                                                                template += `<div class="INFOLINK_Form_EntryField"><input id="${dataElement.id}-${coc?.id}-val" name="entryfield" title="${dataElement.name} ${coc?.name}" value="[ ${dataElement.name} ${coc?.name} ]" /></div>`
                                                            }
                                                        }

                                                        template += `</div>`;
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        //Build for 5-levels
                                        for (let b = 0; b < level2.metadata.length; b++) {
                                            const skip = skipOption(props.loadedRules, dataElement.id, level2.metadata[b].id, navs[a].id, '', '', '')
                                            if (skip) {
                                                continue
                                            }
                                            template += `
                                                <div class="INFOLINK_Form_Priority_Container_Outer">
                                                    <div class="INFOLINK_Form_Priority_Container_Inner INFOLINK_Form_Priority_required">
                                                        <div class="INFOLINK_Form_Priority">&nbsp;</div>
                                                        <div class="INFOLINK_Form_Description">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<span style="color:#ff0000;">${formatOption(props.loadedLabels, dataElement.id, level2.metadata[b], navs[a].id, '', '', '')}</span><span style="color:#add8e6;">&nbsp; &nbsp; </span>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</div>
                                                    </div>
                                                </div>
                                            `;
                                            for (let c = 0; c < level3.metadata.length; c++) {
                                                const skip = skipOption(props.loadedRules, dataElement.id, level3.metadata[c].id, navs[a].id, level2.metadata[b].id, '', '')
                                                if (skip) {
                                                    continue
                                                }
                                                template += `
                                                 <div class="INFOLINK_Form_Container">
                                                    <div class="INFOLINK_Form_EntryName bold" style="padding-bottom:0;">${formatOption(props.loadedLabels, dataElement.id, level3.metadata[c], navs[a].id, level2.metadata[b].id, '', '')}</div>`
                                                for (let d = 0; d < level4.metadata.length; d++) {
                                                    const skip = skipOption(props.loadedRules, dataElement.id, level4.metadata[d].id, navs[a].id, level2.metadata[b].id, level3.metadata[c].id, '')
                                                    if (skip) {
                                                        continue
                                                    }
                                                    template += `
                                                    <div class="INFOLINK_Form_Empty" style="padding-bottom:0;">&nbsp;<br>${formatOption(props.loadedLabels, dataElement.id, level4.metadata[d], navs[a].id, level2.metadata[b].id, level3.metadata[c].id, '').replace(' Years', '')}</div>`;
                                                }
                                                template += `</div>`;

                                                for (let e = 0; e < level5.metadata.length; e++) {
                                                    const skip = skipOption(props.loadedRules, dataElement.id, level5.metadata[e].id, navs[a].id, level2.metadata[b].id, level3.metadata[c].id, '')
                                                    if (skip) {
                                                        continue
                                                    }
                                                    template += `
                                                    <div class="INFOLINK_Form_Container">
                                                          <div class="INFOLINK_Form_EntryName" style="padding-bottom:0;">${formatOption(props.loadedLabels, dataElement.id, level5.metadata[e], navs[a].id, level2.metadata[b].id, level3.metadata[c].id, '')}</div>`;
                                                    for (let d = 0; d < level4.metadata.length; d++) {
                                                        const skip = skipOption(props.loadedRules, dataElement.id, level4.metadata[d].id, navs[a].id, level2.metadata[b].id, level3.metadata[c].id, level5.metadata[e].id)
                                                        if (skip) {
                                                            continue
                                                        }
                                                        const coc = idMap.get(JSON.stringify([level1.metadata.find(md => md.id === navs[a].id)?.id, level2.metadata[b].id, level3.metadata[c].id, level4.metadata[d].id, level5.metadata[e].id].sort()));
                                                        if (coc) {
                                                            template += `<div class="INFOLINK_Form_EntryField"><input id="${dataElement.id}-${coc?.id}-val" name="entryfield" title="${dataElement.name} ${coc?.name}" value="[ ${dataElement.name} ${coc?.name} ]" /></div>`
                                                        }
                                                    }

                                                    template += `</div>`;
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    //Build for 4-levels
                                    for (let b = 0; b < level2.metadata.length; b++) {
                                        const skip = skipOption(props.loadedRules, dataElement.id, level2.metadata[b].id, navs[a].id, '', '', '')
                                        if (skip) {
                                            continue
                                        }
                                        //Build input template
                                        template += `
                                        <div class="INFOLINK_Form_Container">
                                            <div class="INFOLINK_Form_EntryName bold" style="padding-bottom:0;">${formatOption(props.loadedLabels, dataElement.id, level2.metadata[b], navs[a].id, '', '', '')}</div>`
                                        for (let c = 0; c < level3.metadata.length; c++) {
                                            const skip = skipOption(props.loadedRules, dataElement.id, level3.metadata[c].id, navs[a].id, level2.metadata[b].id, '', '')
                                            if (skip) {
                                                continue
                                            }
                                            template += `
                                            <div class="INFOLINK_Form_Empty" style="padding-bottom:0;">&nbsp;<br/>${formatOption(props.loadedLabels, dataElement.id, level3.metadata[c], navs[a].id, level2.metadata[b].id, '', '').replace(' Years', '')}</div>`;
                                        }
                                        template += `</div>`;
                                        for (let d = 0; d < level4.metadata.length; d++) {
                                            const skip = skipOption(props.loadedRules, dataElement.id, level4.metadata[d].id, navs[a].id, level2.metadata[b].id, '', '')
                                            if (skip) {
                                                continue
                                            }
                                            template += `
                                            <div class="INFOLINK_Form_Container">
                                                <div class="INFOLINK_Form_EntryName" style="padding-bottom:0;">${formatOption(props.loadedLabels, dataElement.id, level4.metadata[d], navs[a].id, level2.metadata[b].id, '', '')}</div>`;
                                            for (let c = 0; c < level3.metadata.length; c++) {
                                                const skip = skipOption(props.loadedRules, dataElement.id, level3.metadata[c].id, navs[a].id, level2.metadata[b].id, '', '')
                                                if (skip) {
                                                    continue
                                                }
                                                const coc = idMap.get(JSON.stringify([level1.metadata.find(md => md.id === navs[a].id)?.id, level2.metadata[b].id, level3.metadata[c].id, level4.metadata[d].id].sort()));
                                                if (coc) {
                                                    template += `<div class="INFOLINK_Form_EntryField"><input id="${dataElement.id}-${coc?.id}-val" name="entryfield" title="${dataElement.name} ${coc?.name}" value="[ ${dataElement.name} ${coc?.name} ]" /></div>`
                                                }
                                            }

                                            template += `</div>`;
                                        }
                                    }
                                }
                            } else {
                                //Build for 3-levels
                                template += `
                                        <div class="INFOLINK_Form_Container">
                                            <div class="INFOLINK_Form_EntryName" style="padding-bottom:0;">&nbsp;</div>`
                                for (let b = 0; b < level2.metadata.length; b++) {
                                    const skip = skipOption(props.loadedRules, dataElement.id, level2.metadata[b].id, navs[a].id, '', '', '')
                                    if (skip) {
                                        continue
                                    }
                                    template += `
                                        <div class="INFOLINK_Form_Empty" style="padding-bottom:0;">&nbsp;<br>${formatOption(props.loadedLabels, dataElement.id, level2.metadata[b], navs[a].id, '', '', '').replace(' Years', '')}</div>`;
                                }
                                template += `</div>`;

                                for (let c = 0; c < level3.metadata.length; c++) {
                                    const skip = skipOption(props.loadedRules, dataElement.id, level3.metadata[c].id, navs[a].id, '', '', '')
                                    if (skip) {
                                        continue
                                    }
                                    template += `
                                        <div class="INFOLINK_Form_Container">
                                            <div class="INFOLINK_Form_EntryName" style="padding-bottom:0;">${formatOption(props.loadedLabels, dataElement.id, level3.metadata[c], navs[a].id, '', '', '')}</div>`;
                                    for (let b = 0; b < level2.metadata.length; b++) {
                                        const skip = skipOption(props.loadedRules, dataElement.id, level2.metadata[b].id, navs[a].id, '', '', '')
                                        if (skip) {
                                            continue
                                        }
                                        const coc = idMap.get(JSON.stringify([level1.metadata.find(md => md.id === navs[a].id)?.id, level2.metadata[b].id, level3.metadata[c].id].sort()));
                                        if (coc) {
                                            template += `<div class="INFOLINK_Form_EntryField"><input id="${dataElement.id}-${coc?.id}-val" name="entryfield" title="${dataElement.name} ${coc?.name}" value="[ ${dataElement.name} ${coc?.name} ]" /></div>`
                                        }
                                    }

                                    template += `</div>`;
                                }
                            }
                        } else {
                            //Build for 2-level category option combo
                            template += `
                                        <div class="INFOLINK_Form_Container">
                                            <div class="INFOLINK_Form_EntryName bold" style="padding-bottom:0px;">&nbsp;</div>
                                            <div class="INFOLINK_Form_Empty" style="padding-bottom:0px;">&nbsp;</div>
                                            <div class="INFOLINK_Form_Empty" style="padding-bottom:0px;">&nbsp;</div>
                                        </div>`;
                            for (let b = 0; b < level2.metadata.length; b++) {
                                const skip = skipOption(props.loadedRules, dataElement.id, level2.metadata[b].id, navs[a].id, '', '', '')
                                if (skip) {
                                    continue
                                }
                                template += `
                                        <div class="INFOLINK_Form_Container">
                                            <div class="INFOLINK_Form_EntryName" style="padding-bottom:0;">${formatOption(props.loadedLabels, dataElement.id, level2.metadata[b], navs[a].id, '', '', '')}</div>`;
                                const coc = idMap.get(JSON.stringify([level1.metadata.find(md => md.id === navs[a].id)?.id, level2.metadata[b].id].sort()));
                                if (coc) {
                                    template += `<div class="INFOLINK_Form_EntryField"><input id="${dataElement.id}-${coc?.id}-val" name="entryfield" title="${dataElement.name} ${coc?.name}" value="[ ${dataElement.name} ${coc?.name} ]" /></div>`
                                }

                                template += `
                                            <div class="INFOLINK_Form_EntryField">&nbsp;</div>
                                            <div class="INFOLINK_Form_EntryField">&nbsp;</div>
                                            <div class="INFOLINK_Form_EntryField">&nbsp;</div>
                                        </div>`;
                            }
                        }
                        template += `</div></div>`;
                    }
                    template += `</div>`;
                })
                template += '</div></div>'
            }
            template += `</div></div>`;
        })


        template += `<!--main ends-->
                <script type="text/javascript">
                    $("#INFOLINK_Tabs_vertical").tabs().removeClass("ui-tabs").find("ul").removeClass("ui-helper-hidden");
                    $("#INFOLINK_Tabs_vertical li").removeClass("ui-corner-top");
                    $("[id ^= INFOLINK_Tabs_h]").tabs().find("ul").removeClass("ui-helper-hidden");
                </script><!--1st--><!-- End Custom DHIS 2 Form -->

                <p>&nbsp;</p>
        `;

        const updateDataStore = async (postObject) => {

            try {
                await props.engine.mutate({
                    resource: `dataSets/${props.loadedProject.dataSet.id}/form`,
                    type: 'create',
                    data: {
                        htmlCode: postObject
                    },
                });
                successMessage();
                handleCloseModal();
            } catch (error) {
                errorMessage(error)
                console.error('Error updating project:', error);
            }

        }

        updateDataStore(template)

    }

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
                    <Button onClick={handleGenerateHTMLTemplate} disabled={loading}>Proceed</Button>
                </ButtonStrip>

                {loading && (<CircularLoader small/>)}
                {isPosting && (<CircularLoader small/>)}
     
            </ModalActions>
        </Modal>
    );
}


export default GenerateForm;