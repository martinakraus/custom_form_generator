import { useDataQuery, useAlert } from '@dhis2/app-runtime'
import { SingleSelect, SingleSelectOption  } from '@dhis2-ui/select'
import React, { useState, useEffect } from 'react';
import AppGetDEList from '../AppGetDEList'
import HorizontalCategory from './HorizontalCategory'
import HorizontalCategoryLevel1 from './HorizontalCategoryLevel1'
import VerticalCategoryLevel1 from './VerticalCategoryLevel1'
import VerticalCategoryLevel2 from './VerticalCategoryLevel2'
import VerticalCategoryLevel3 from './VerticalCategoryLevel3'
import VerticalCategoryLevel4 from './VerticalCategoryLevel4'
import HorizontalTransfer from './HorizontalTransfer'
import HorizontalTransferLevel1 from './HorizontalTransferLevel1';
import VerticalTransferLevel1 from './VerticalTransferLevel1';
import VerticalTransferLevel2 from './VerticalTransferLevel2';
import VerticalTransferLevel3 from './VerticalTransferLevel3';
import VerticalTransferLevel4 from './VerticalTransferLevel4';
import ExclusionRuleComponent from './ExclusionRuleComponent';
import MetadataTemplating from './MetadataTemplating';
import GenerateForm from './GenerateForm';
import TooltipComponent from './TooltipComponent'
import { Input } from '@dhis2-ui/input'
import { IconEdit16, IconDelete16, IconAddCircle24} from '@dhis2/ui-icons'; 
import { generateRandomId, modifiedDate,  alignLevels, customImage, updateDataStore} from '../utils';
import SideNavigation from './SideNavigationSelection';
import FormComponentSelection from './FormComponentSelection';
import {transformData} from '../utils'


import { IconInfo16 } from '@dhis2/ui-icons'; 
import level3Guide from '../images/level3.png'
import level4Guide from '../images/level4.png'
import level5Guide from '../images/level5.png'
import level6Guide from '../images/level6.png'

import { 
    Modal, 
    ModalTitle, 
    ModalContent, 
    ModalActions, 
    ButtonStrip, 
    Button,
    InputField,
} from '@dhis2/ui';

import {
    Table,
    TableHead,
    TableRowHead,
    TableCellHead,
    TableBody,
    TableRow,
    TableCell,
  } from '@dhis2/ui';


import { TabBar , Tab} from '@dhis2-ui/tab'
import classes from '../App.module.css'
import { Divider } from '@dhis2-ui/divider'

import { config, 
    sideNavigationFilter, 
    formComponentFilter, 
    TemplateFilter, 
    exclusionRuleMore,
    conditionLevels,
    exclusionLevels,
    labelNameFilter} from '../consts'
import LabelComponent from './LabelComponent';

  

const ConfigureMetadata = (props) => {
    const { show } = useAlert(
        ({ msg }) => msg,
        ({ type }) => ({ [type]: true })
      )
    /*  Query Parameters**/
    const query = {
        dataSets: {
            resource: 'dataSets',
            params: {
                fields: ['id', 'displayName'],
            },
        },
    
        dataElements: {
            resource: 'dataElements',
            params: {
            fields: ['id', 'displayName'],
            },
        },   
    }

    // Define your data store query
    const dataStoreQuery = {
            dataStore: {
            resource: `dataStore/${config.dataStoreName}/${props.selectedProject.key}`
        }
    }

    // Define your data store query
    const SideNavigationQuery = {
        dataStore: {
        resource: `dataStore/${config.dataStoreSideNavigations}?${sideNavigationFilter}&paging=false`,
        },
    }

    // Define your data store query
    const FormComponentQuery = {
        dataStore: {
        resource: `dataStore/${config.dataStoreFormComponents}?${formComponentFilter}&paging=false`,
        },
    }

    // Define your data store query
    const TemplateQuery = {
        dataStore: {
        resource: `dataStore/${config.dataStoreTemplates}?${TemplateFilter}&paging=false`,
        },
    }

    // Define your data store query
    const ConditionQuery = {
        dataStore: {
        resource: `dataStore/${config.dataStoreConditions}?${exclusionRuleMore}&paging=false`,
        },
    }
    

    const LabelQuery = {
        dataStore: {
            resource: `dataStore/${config.dataStoreLabelName}?${labelNameFilter}&paging=false`,
            },

    }


    // To hold pre-loaded data from dataStore
    const [loadedProject, setLoadedProject] = useState(props.selectedProject || []);
    const [dataElements, setDataElements] = useState(props.selectedProject.dataElements || []);
    const [filterText, setFilterText] = useState('');

    // for help guide
    const [showGuide, setShowGuide] = useState(false);
    const [updateDataElementCatLenght, setUpdateDataElementCatLenght] = useState(false);
    const [dataElementCatLenght, setDataElementCatLenght] = useState(0);





    const toggleGuide = () => {
    
      setShowGuide(!showGuide);
      setUpdateDataElementCatLenght(!updateDataElementCatLenght)
    };

    // for data control
    const [isAferProjectSave, AferProjectSave] = useState(false);

    // saving dataelement state
    const [savingDataElement, setSavingDataElementState] = useState(false);

    // dataElement refresh button
    const [refreshing, setRefreshing] = useState(true);

    // Saving data to dataStore
    const [mergedObject, setmergedObject] = useState([])


    // State control variables
    const [selectedDataSet,setselectedDataSet] = useState(props.selectedDataSet || "");
    const [selectedDataSetName,setselectedDataSetName] = useState([]);
    const [selectedDataElementId, setSelectedDataElementId] = useState('');
    const [overidingCategory, setOveridingCategory] = useState('xxxxx');
    const [selectedDataElement, setSelectedDataElement] = useState('');
    const [selectedDataElementsDict, setSelectedDataElementsDict] = useState(null);
    const [saveNow, setSaveNow] = useState(false);
    const [AddorEditModeActive, setAddorEditMode] = useState(false);
    const [loadedCombos, setLoadedCombos] = useState(null)
    const [loadedCombosName, setloadedCombosName] = useState('')


    
    // State to hold tabs state
    const [selectedTab, setSelectedTab] = useState('dataElemenents-table');
    const [selectedDirectClickTabDE, setDirectClickTabDE] = useState(0);
    
    // To generate form
    const [showGenerateForm, setShowGenerateForm] = useState(false);

    // To Side Nagivation
    const [showSideNavigationForm, setSideNavigationForm] = useState(false);
    const [sideNavigationName, setSideNavigationName] = useState('');
    const [existingSideNavigation, setExistingSideNavigation] = useState(false);


    // To form Components
    const [showFormComponents, setFormComponents] = useState(false);
    const [formComponentName, setFormComponentName] = useState('');
    const [existingFormComponent, setExistingFormComponent] = useState(false);

    // Edit mode
    const [editMode, setEditMode] = useState(false);
    const [editExclusionMode, setEditExclusionMode] = useState(false);
    const [selectedExclusion, setSelectedExclusion] = useState("");
    const [selectedExclusionEditInit, setSelectedExclusionEditInit] = useState("");
    const [selectedLabel, setSelectedLabel] = useState("");
    const [editLabelMode, setEditLabelMode] = useState(false);


    // New state for template name
    const [templateName, setTemplateName] = useState('');
    const [showModalMetadataTemplate, setShowModalMetadataTemplate] = useState(false);
    const [showTemplateNameModal , setShowTemplateNameModal] = useState(false);

    // For Exclusion Rules
    const [showExclusionComponents, setExclusionComponents] = useState(false);
    const [conditionDE, setConditionDE] = useState('');
    const [conditionDEIDName, setConditionDEIDName] = useState([{"id": ""}]);

    const [conditionCoC, setConditionCoC] = useState('');
    const [conditionCoCIDName, setConditionCoCIDName] = useState([]);
    const [conditionCOIDName, setConditionCOIDName] = useState([]);
    const [conditionCOIDName2, setConditionCOIDName2] = useState([]);
    const [categoryExclusion, setCategoryExclusion] = useState('');
    const [categoryExclusion2, setCategoryExclusion2] = useState('');
    const [categoryExclusionToProcess, setCategoryExclusionToProcess] = useState([]);
    const [conditionName, setConditionName] = useState('');
    const [exclude, setExclusion] = useState([]);
    const [exclude2, setExclusion2] = useState([]);
    const [excludeToProcess, setExclusionToProcess] = useState([]);
    const [existingConditionName, setExistingConditionName] = useState(false);
    const [selectedExclusionMetadataOption, setSelectedExclusionMetadataOption] = useState("");
    const [selectedConditionLevel, setSelectedConditionLevel] = useState(""); // State to store the selected level
    const [selectedExclusionLevel, setSelectedExclusionLevel] = useState(""); // State to store the selected level
    

       // For Label Rules
    const [showLabelComponents, setLabelComponents] = useState(false);
    const [selectedMetadataOption, setSelectedMetadataOption] = useState("");
	const [metadataName, setMetadataName] = useState('');
    const [metadataName2, setMetadataName2] = useState('');
    const [metadataName3, setMetadataName3] = useState('');
	const [labelName, setLabelName] = useState('');
    const [labelDEIDName, setLabelDEIDName] = useState('');
    const [labelCategoryIDName, setLabelCategoryIDName] = useState('');
    const [labelCategoryIDName2, setLabelCategoryIDName2] = useState('');
    const [labelCategoryIDName3, setLabelCategoryIDName3] = useState('');
    const [reloadLabels, setReloadLabels] = useState(false);
    const [existingMetadataName, setExistingMetadataName] = useState(false);
    const [loadedLabels, setLoadedLabels] = useState([]);
    const [labelComboIDName, setLabelComboIDName] = useState([]);
    const [labelOptionIDName, setLabelOptionIDName] = useState([]);
    const [labelOptionIDName2, setLabelOptionIDName2] = useState([]);
    const [labelOptionIDName3, setLabelOptionIDName3] = useState([]);
    
    
    // To hold exclusion data from dataStore
    const [loadedRules, setLoadedRules] = useState([]);

    // reloading and state does not matter
    const [reloadExclusions, setReloadExclusions] = useState(false);

  
    // Constants for Horizontal Categories (Level 1 Inner)
    const [fileredHorizontalCatCombo0, setfileredHorizontalCatCombo0] = useState([]);
    const [dictfileredHorizontalCatCombo0, setdictfileredHorizontalCatCombo0] = useState([]); 
    const [selectedHorizontalCategoryID0, setSelectedHorizontalCategoryID0] = useState(null); 
    const [selectedHorizontalCategoryName0, setSelectedHorizontalCategoryName0] = useState(null); 
    const [isHorizontalCategoryExpanded0, setIsHorizontalCategoryExpanded0] = useState(false);
    const [categoryChecker, setCategoryChecker] = useState([]); 

    // Constants for Horizontal Categories (Level 2 Outer)
    const [dictfileredHorizontalCatComboLevel1, setdictfileredHorizontalCatComboLevel1] = useState([]);
    const [selectedHorizontalCategoryIDLevel1, setSelectedHorizontalCategoryIDLevel1] = useState(null);
    const [selectedHorizontalCategoryNameLevel1, setSelectedHorizontalCategoryNameLevel1] = useState(null);
    const [isHorizontalCategoryExpandedLevel1, setIsHorizontalCategoryExpandedLevel1] = useState(false);
    const [HorizontalCategoryOptionsLevel1, setHorizontalcategoryOptionsLevel1] = useState([]);
    const [fileredHorizontalCatComboLevel1, setfileredHorizontalCatComboLevel1] = useState([]);

    // Constants for Vertical Categories (Level 1 Inner)
    const [selectedVerticalCategoryIDLevel1, setSelectedVerticalCategoryIDLevel1] = useState(null);
    const [selectedVerticalCategoryNameLevel1, setSelectedVerticalCategoryNameLevel1] = useState(null);
    const [dictfileredVerticalCatComboLevel1, setdictfileredVerticalCatComboLevel1] = useState([]);
    const [isVerticalCategoryExpandedlevel1, setIsVerticalCategoryExpandedlevel1] = useState(false);
    const [verticalCategoryOptionsLevel1, setVerticalCategoryOptionsLevel1] = useState([]);
    const [fileredVerticalCatComboLevel1, setfileredVerticalCatComboLevel1] = useState([]);

    // Constants for Vertical Categories (Level 2 Outer)
    const [selectedVerticalCategoryIDLevel2, setSelectedVerticalCategoryIDLevel2] = useState(null);
    const [selectedVerticalCategoryNameLevel2, setSelectedVerticalCategoryNameLevel2] = useState(null);
    const [dictfileredVerticalCatComboLevel2, setdictfileredVerticalCatComboLevel2] = useState([]);
    const [isVerticalCategoryExpandedlevel2, setIsVerticalCategoryExpandedlevel2] = useState(false);
    const [VerticalCategoryOptionsLevel2, setVerticalCategoryOptionsLevel2] = useState([]);
    const [fileredVerticalCatComboLevel2, setfileredVerticalCatComboLevel2] = useState([]);



    // Constants for Vertical Categories (Level 3 Outer)
    const [selectedVerticalCategoryIDLevel3, setSelectedVerticalCategoryIDLevel3] = useState(null);
    const [selectedVerticalCategoryNameLevel3, setSelectedVerticalCategoryNameLevel3] = useState(null);
    const [dictfileredVerticalCatComboLevel3, setdictfileredVerticalCatComboLevel3] = useState([]);
    const [isVerticalCategoryExpandedlevel3, setIsVerticalCategoryExpandedlevel3] = useState(false);
    const [VerticalCategoryOptionsLevel3, setVerticalCategoryOptionsLevel3] = useState([]);
    const [fileredVerticalCatComboLevel3, setfileredVerticalCatComboLevel3] = useState([]);


    // Constants for Vertical Categories (Level 4 Outer)
    const [selectedVerticalCategoryIDLevel4, setSelectedVerticalCategoryIDLevel4] = useState(null);
    const [selectedVerticalCategoryNameLevel4, setSelectedVerticalCategoryNameLevel4] = useState(null);
    const [dictfileredVerticalCatComboLevel4, setdictfileredVerticalCatComboLevel4] = useState([]);
    const [isVerticalCategoryExpandedlevel4, setIsVerticalCategoryExpandedlevel4] = useState(false);
    const [VerticalCategoryOptionsLevel4, setVerticalCategoryOptionsLevel4] = useState([]);
    const [fileredVerticalCatComboLevel4, setfileredVerticalCatComboLevel4] = useState([]);




    const [isDataSetsExpanded, setIsDataSetsExpanded] = useState(false);
    const [isDataElementExpanded, setIsDataElementExpanded] = useState(false);
   
    
    const [selectedSideNavigation,setSelectSideNavigation] = useState(null);
    const [selectedFormComponents,setSelectFormComponents] = useState(loadedProject.formComponent);

    

    const [categoryComboNameID,setCategoryComboNameID] = useState("");


    {/* useDataQuery(query) loader */}
    const { loading: loading1, error: error1, data: data1 } = useDataQuery(query);
    const { loading: loadingAfterSave, error: ErrorAfterSave, data: dataAfterSave, refetch} = useDataQuery(dataStoreQuery);     
    const { data: SideNavigationQueryData, refetch:SideNavigationQueryrefetch } = useDataQuery(SideNavigationQuery); // Use separate hook for dataStoreQuery
    const { data: FormComponentQueryData, refetch:FormComponentQueryrefetch } = useDataQuery(FormComponentQuery); // Use separate hook for dataStoreQuery
    const { data: TemaplateQueryData, refetch:TemaplateQueryrefetch } = useDataQuery(TemplateQuery); // Use separate hook for dataStoreQuery
    const { data: ConditionsQueryData, refetch:ConditionsQueryDataRefetch } = useDataQuery(ConditionQuery); // Use separate hook for dataStoreQuery
    const { data: LabelQueryData, refetch:LabelQueryDataRefetch } = useDataQuery(LabelQuery); // Use separate hook for dataStoreQuery

    const [sideNavigationList, setSideNavigationList] = useState([]);
    const [FormComponentList, setFormComponentList] = useState([])
    const [TemplateList, setTemplateList] = useState([])
    const [LabelsList, setLabelsListList] = useState([])



    useEffect(()=>{

        if (SideNavigationQueryData?.dataStore) {
            if (typeof SideNavigationQueryData.dataStore.entries === 'function') {
              let newSeideNavigations = Object.entries(SideNavigationQueryData.dataStore);
              setSideNavigationList(transformData(newSeideNavigations))
            } else {
              let newSeideNavigations = SideNavigationQueryData?.dataStore?.entries || [];
              setSideNavigationList(newSeideNavigations)
            }
        }

    },[])

    // useEffect(()=>{

    //     if (LabelQueryData?.dataStore) {
    //         if (typeof LabelQueryData.dataStore.entries === 'function') {
    //           let newLabels = Object.entries(LabelQueryData.dataStore);
    //           setLabelsListList(transformData(newLabels))
    //         } else {
    //           let newLabels = LabelQueryData?.dataStore?.entries || [];
    //           setLabelsListList(newLabels)
    //         }
    //     }

    // },[])


    useEffect(()=>{

        if (TemaplateQueryData?.dataStore) {
            if (typeof TemaplateQueryData.dataStore.entries === 'function') {
              let newTemplates = Object.entries(TemaplateQueryData.dataStore);
              setTemplateList(transformData(newTemplates))
            } else {
              let newTemplates = TemaplateQueryData?.dataStore?.entries || [];
              setTemplateList(newTemplates)
            }
        }

    },[TemaplateQueryData])

    useEffect(()=>{

        if (FormComponentQueryData?.dataStore) {
            if (typeof FormComponentQueryData.dataStore.entries === 'function') {
              let newSeideNavigations = Object.entries(FormComponentQueryData.dataStore);
              setFormComponentList(transformData(newSeideNavigations))
            } else {
              let newSeideNavigations = FormComponentQueryData?.dataStore?.entries || [];
              setFormComponentList(newSeideNavigations)
            }
        }

    },[])

    useEffect(() => {
        ConditionsQueryDataRefetch();
        if (ConditionsQueryData) {

            if (ConditionsQueryData?.dataStore) {
                if (typeof ConditionsQueryData.dataStore.entries === 'function') {
                  let newConditions = Object.entries(ConditionsQueryData.dataStore);
                  setLoadedRules(transformData(newConditions).filter(entry => entry.projectID === loadedProject.id) || [])
                } else {
                  let newConditions = ConditionsQueryData?.dataStore?.entries || [];
                  setLoadedRules(newConditions.filter(entry => entry.projectID === loadedProject.id) || [])
                }
            }

            // console.log("ConditionsQueryData: ", ConditionsQueryData)
            // console.log("ConditionsQueryData Lenght ", ConditionsQueryData.length)
          // setProjects(data.dataStore ? [data.dataStore] : []);
    
              // Check if entries property exists in data.dataStore
            // if (ConditionsQueryData.length > 0 && ConditionsQueryData !== undefined){
            // let newExclusion = ConditionsQueryData.dataStore?.entries.filter(entry => entry.projectID === loadedProject.id) || [];
            // setLoadedRules(newExclusion);
            // newExclusion = []
            // }
        }
      }, [ConditionsQueryData, reloadExclusions, ]);

      useEffect(() => {
        LabelQueryDataRefetch();
        if (LabelQueryData) {
          // setProjects(data.dataStore ? [data.dataStore] : []);
    
              // Check if entries property exists in data.dataStore
            //   console.log('LabelQueryData: ', LabelQueryData)

            if (LabelQueryData?.dataStore) {
                if (typeof LabelQueryData.dataStore.entries === 'function') {
                  let newLabels = Object.entries(LabelQueryData.dataStore);
                  setLoadedLabels(transformData(newLabels))
                } else {
                  let newLabels = LabelQueryData?.dataStore?.entries || [];
                  setLoadedLabels(newLabels)
                }
            }
            // if (LabelQueryData.length > 0 && LabelQueryData !== undefined){
            // let newLabels = LabelQueryData.dataStore?.entries.filter(entry => entry.projectID === loadedProject.id) || [];
            // // console.log('newLabels: ', newLabels)
            // setLoadedLabels(newLabels);
            // newLabels = []
            // }
        }
      }, [LabelQueryData, reloadLabels, ]);

    useEffect(() => {
        refetch();
    }, [isAferProjectSave, refetch, refreshing]);

    useEffect(() => {
        if (dataAfterSave) {

            const newProjects = dataAfterSave?.dataStore || [];
            setDataElements(newProjects?.dataElements || [])
            setLoadedProject(newProjects)
            // setSelectSideNavigation(newProjects.sideNavigation)
            // setSelectFormComponents(newProjects.formComponent)
        }        
    }, [dataAfterSave, isAferProjectSave]);

    // if (ErrorAfterSave){

    //     console.log(ErrorAfterSave)
    // }

    const handleDataSetChange = event => {
        setselectedDataSet(event.selected);
        setSelectedDataElement('');
        setSelectedDataElementId('');
        setfileredHorizontalCatComboLevel1([]);
        setfileredHorizontalCatCombo0([]);
        {data1.dataSets.dataSets.filter(dataSets => dataSets.id.includes(event.selected)).map(
        ({ id, displayName }) => (                    
            setselectedDataSetName({displayName})                   
                                    )
        )}
    }

    useEffect(() => {  
        if(!editMode){
            clearConstants()
        }  
    }, [editMode, savingDataElement]);

 /***
 * 
 * 
 * 
 */
    const clearConstants = () =>{
        
        setSelectedDataElement('');
        setSelectedDataElementId('');
        handleDataElementChange()
        setEditMode(false)
        setSelectedDataElementsDict(null)
        setSelectSideNavigation(null);
        setSelectFormComponents(null);
        setloadedCombosName('')

        /**  New entries* */

        setfileredHorizontalCatCombo0([]);
        setdictfileredHorizontalCatCombo0([]); 
        setSelectedHorizontalCategoryID0(null); 
        setSelectedHorizontalCategoryName0(null); 
        setIsHorizontalCategoryExpanded0(false); 
    
        setdictfileredHorizontalCatComboLevel1([]);
        setSelectedHorizontalCategoryIDLevel1(null);
        setIsHorizontalCategoryExpandedLevel1(false);
        setHorizontalcategoryOptionsLevel1([]);
        setfileredHorizontalCatComboLevel1([]);
    
        // Constants for Vertical Categories (Level 1 Outer)
        setSelectedVerticalCategoryIDLevel1(null);
        setSelectedVerticalCategoryNameLevel1(null);
        setdictfileredVerticalCatComboLevel1([]);
        setIsVerticalCategoryExpandedlevel1(false);
        setVerticalCategoryOptionsLevel1([]);
        setfileredVerticalCatComboLevel1([]);
        
        // Constants for Vertical Categories (Level 2 Outer)
        setSelectedVerticalCategoryIDLevel2(null);
        setSelectedVerticalCategoryNameLevel2(null);
        setdictfileredVerticalCatComboLevel2([]);
        setIsVerticalCategoryExpandedlevel2(false);
        setVerticalCategoryOptionsLevel2([]);
        setfileredVerticalCatComboLevel2([]);

        // Constants for Vertical Categories (Level 3 Outer)
        setSelectedVerticalCategoryIDLevel3(null);
        setSelectedVerticalCategoryNameLevel3(null);
        setdictfileredVerticalCatComboLevel3([]);
        setIsVerticalCategoryExpandedlevel3(false);
        setVerticalCategoryOptionsLevel3([]);
        setfileredVerticalCatComboLevel3([]);


        // Constants for Vertical Categories (Level 3 Outer)
        setSelectedVerticalCategoryIDLevel4(null);
        setSelectedVerticalCategoryNameLevel4(null);
        setdictfileredVerticalCatComboLevel4([]);
        setIsVerticalCategoryExpandedlevel4(false);
        setVerticalCategoryOptionsLevel4([]);
        setfileredVerticalCatComboLevel4([]);

        setSelectSideNavigation(null);
        setSelectFormComponents(null);
        setCategoryComboNameID('');
        setDataElementCatLenght(0)

    }

    const handleDataElementChange = () => {

        setfileredHorizontalCatCombo0([]);
        setdictfileredHorizontalCatCombo0([]); 
        setSelectedHorizontalCategoryID0(null); 
        setSelectedHorizontalCategoryName0(null); 
        setIsHorizontalCategoryExpanded0(false); 
    
        setdictfileredHorizontalCatComboLevel1([]);
        setSelectedHorizontalCategoryIDLevel1(null);
        setIsHorizontalCategoryExpandedLevel1(false);
        setHorizontalcategoryOptionsLevel1([]);
        setfileredHorizontalCatComboLevel1([]);
    
        // Constants for Vertical Categories (Level 1 Outer)
        setSelectedVerticalCategoryIDLevel1(null);
        setSelectedVerticalCategoryNameLevel1(null);
        setdictfileredVerticalCatComboLevel1([]);
        setIsVerticalCategoryExpandedlevel1(false);
        setVerticalCategoryOptionsLevel1([]);
        setfileredVerticalCatComboLevel1([]);
        
        // Constants for Vertical Categories (Level 2 Outer)
        setSelectedVerticalCategoryIDLevel2(null);
        setSelectedVerticalCategoryNameLevel2(null);
        setdictfileredVerticalCatComboLevel2([]);
        setIsVerticalCategoryExpandedlevel2(false);
        setVerticalCategoryOptionsLevel2([]);
        setfileredVerticalCatComboLevel2([]);

        
        // Constants for Vertical Categories (Level 3 Outer)
        setSelectedVerticalCategoryIDLevel3(null);
        setSelectedVerticalCategoryNameLevel3(null);
        setdictfileredVerticalCatComboLevel3([]);
        setIsVerticalCategoryExpandedlevel3(false);
        setVerticalCategoryOptionsLevel3([]);
        setfileredVerticalCatComboLevel3([]);


        // Constants for Vertical Categories (Level 4 Outer)
        setSelectedVerticalCategoryIDLevel4(null);
        setSelectedVerticalCategoryNameLevel4(null);
        setdictfileredVerticalCatComboLevel4([]);
        setIsVerticalCategoryExpandedlevel4(false);
        setVerticalCategoryOptionsLevel4([]);
        setfileredVerticalCatComboLevel4([]);

        setSelectSideNavigation(null);
        setSelectFormComponents(null);
      


    }

    useEffect(() => {

        handleDataElementChange()

    }, [selectedDataElementId]);

    useEffect(() => {
        
        // Constants for Horizontal Categories (Outer)

        setSelectedHorizontalCategoryIDLevel1(null);
        setSelectedHorizontalCategoryNameLevel1(null)
        setdictfileredHorizontalCatComboLevel1([]);
        setIsHorizontalCategoryExpandedLevel1(false);
        setHorizontalcategoryOptionsLevel1([]);


        // setfileredHorizontalCatComboLevel1([]);
    
        // Constants for Vertical Categories (Level 1 Inner)
        setSelectedVerticalCategoryIDLevel1(null);
        setSelectedVerticalCategoryNameLevel1(null);
        setdictfileredVerticalCatComboLevel1([]);
        setIsVerticalCategoryExpandedlevel1(false);
        setVerticalCategoryOptionsLevel1([]);
        setfileredVerticalCatComboLevel1([]);
        
        // Constants for Vertical Categories (Level 2 Outer)
        setSelectedVerticalCategoryIDLevel2(null);
        setSelectedVerticalCategoryNameLevel2(null);
        setdictfileredVerticalCatComboLevel2([]);
        setIsVerticalCategoryExpandedlevel2(false);
        setVerticalCategoryOptionsLevel2([]);
        setfileredVerticalCatComboLevel2([]);
        // setEditMode(false)

        // Constants for Vertical Categories (Level 3 Outer)
        setSelectedVerticalCategoryIDLevel3(null);
        setSelectedVerticalCategoryNameLevel3(null);
        setdictfileredVerticalCatComboLevel3([]);
        setIsVerticalCategoryExpandedlevel3(false);
        setVerticalCategoryOptionsLevel3([]);
        setfileredVerticalCatComboLevel3([]);

        // Constants for Vertical Categories (Level 4 Outer)
        setSelectedVerticalCategoryIDLevel4(null);
        setSelectedVerticalCategoryNameLevel4(null);
        setdictfileredVerticalCatComboLevel4([]);
        setIsVerticalCategoryExpandedlevel4(false);
        setVerticalCategoryOptionsLevel4([]);
        setfileredVerticalCatComboLevel4([]);

    },[selectedHorizontalCategoryID0])

    useEffect(() => {
        // Constants for Vertical Categories (Level 1 Outer)
        setSelectedVerticalCategoryIDLevel1(null);
        setSelectedVerticalCategoryNameLevel1(null);
        setdictfileredVerticalCatComboLevel1([]);
        setIsVerticalCategoryExpandedlevel1(false);
        setVerticalCategoryOptionsLevel1([]);
        //setfileredVerticalCatComboLevel1([]);
        
        // Constants for Vertical Categories (Level 1 Outer)
        setSelectedVerticalCategoryIDLevel2(null);
        setSelectedVerticalCategoryNameLevel2(null);
        setdictfileredVerticalCatComboLevel2([]);
        setIsVerticalCategoryExpandedlevel2(false);
        setVerticalCategoryOptionsLevel2([]);
        setfileredVerticalCatComboLevel2([]);

        
        // Constants for Vertical Categories (Level 3 Outer)
        setSelectedVerticalCategoryIDLevel3(null);
        setSelectedVerticalCategoryNameLevel3(null);
        setdictfileredVerticalCatComboLevel3([]);
        setIsVerticalCategoryExpandedlevel3(false);
        setVerticalCategoryOptionsLevel3([]);
        setfileredVerticalCatComboLevel3([]);



        // Constants for Vertical Categories (Level 3 Outer)
        setSelectedVerticalCategoryIDLevel4(null);
        setSelectedVerticalCategoryNameLevel4(null);
        setdictfileredVerticalCatComboLevel4([]);
        setIsVerticalCategoryExpandedlevel4(false);
        setVerticalCategoryOptionsLevel4([]);
        setfileredVerticalCatComboLevel4([]);
    },[selectedHorizontalCategoryIDLevel1])

    useEffect(() => {

        // Constants for Vertical Categories (Level 1 Outer)
                setSelectedVerticalCategoryIDLevel2(null);
                setSelectedVerticalCategoryNameLevel2(null);
                setdictfileredVerticalCatComboLevel2([]);
                setIsVerticalCategoryExpandedlevel2(false);
                setVerticalCategoryOptionsLevel2([]);
                //setfileredVerticalCatComboLevel2([]); //

                
        // Constants for Vertical Categories (Level 3 Outer)
                setSelectedVerticalCategoryIDLevel3(null);
                setSelectedVerticalCategoryNameLevel3(null);
                setdictfileredVerticalCatComboLevel3([]);
                setIsVerticalCategoryExpandedlevel3(false);
                setVerticalCategoryOptionsLevel3([]);
                setfileredVerticalCatComboLevel3([]);

        // Constants for Vertical Categories (Level 4 Outer)
                setSelectedVerticalCategoryIDLevel4(null);
                setSelectedVerticalCategoryNameLevel4(null);
                setdictfileredVerticalCatComboLevel4([]);
                setIsVerticalCategoryExpandedlevel4(false);
                setVerticalCategoryOptionsLevel4([]);
                setfileredVerticalCatComboLevel4([]);

    },[selectedVerticalCategoryIDLevel1])

    useEffect(() => {
        // Constants for Vertical Categories (Level 3 Outer)
        // setSelectedVerticalCategoryIDLevel3(null);
        // setSelectedVerticalCategoryNameLevel3(null);
        // setdictfileredVerticalCatComboLevel3([]);
        // setIsVerticalCategoryExpandedlevel3(false);
        // setVerticalCategoryOptionsLevel3([]);
        // setfileredVerticalCatComboLevel3([]);

        // Constants for Vertical Categories (Level 4 Outer)
        // setSelectedVerticalCategoryIDLevel4(null);
        // setSelectedVerticalCategoryNameLevel4(null);
        // setdictfileredVerticalCatComboLevel4([]);
        // setIsVerticalCategoryExpandedlevel4(false);
        // setVerticalCategoryOptionsLevel4([]);
        // setfileredVerticalCatComboLevel4([]);

        },[selectedVerticalCategoryIDLevel2])


        useEffect(() => {
    
            // Constants for Vertical Categories (Level 4 Outer)
            // setSelectedVerticalCategoryIDLevel4(null);
            // setSelectedVerticalCategoryNameLevel4(null);
            // setdictfileredVerticalCatComboLevel4([]);
            // setIsVerticalCategoryExpandedlevel4(false);
            // setVerticalCategoryOptionsLevel4([]);
            // setfileredVerticalCatComboLevel4([]);
    
            },[selectedVerticalCategoryIDLevel3])

    useEffect(() => {
        if (SideNavigationQueryData?.dataStore) {
              // Now you can safely access dataStoreData.dataStore


              if (SideNavigationQueryData?.dataStore?.entries){
    

    
                const navigationExists = (navigationToCheck) => {
                    const sideNavigationNameArray = SideNavigationQueryData.dataStore?.entries || [];
                    try {
                        return sideNavigationNameArray.some(navigation => 
                            navigation.sideNavName.toLowerCase() === navigationToCheck.toLowerCase() &&
                            navigation.projectID.toLowerCase() === loadedProject.id.toLowerCase()
                        );
                    
                    } catch (error) {
                        return false; // or handle the error as needed
                    }                    
                };
                
                setExistingSideNavigation(navigationExists(sideNavigationName))
                // console.log(existingProject);
              }
    
            } else {
              // Handle the case where dataStoreData or dataStoreData.dataStore is undefined
              console.error('Data structure does not match the expected format');
            }
    }, [sideNavigationName]);

    useEffect(() => {
            if (FormComponentQueryData?.dataStore) {   
    
                  if (FormComponentQueryData?.dataStore?.entries){
        

                    const formComponentExists = (FormComponentToCheck) => {
                        const formComponentNameArray = FormComponentQueryData.dataStore?.entries || [];
                        try {
                            return formComponentNameArray.some(form_component => 
                                form_component.formComponentName.toLowerCase() === FormComponentToCheck.toLowerCase() &&
                                form_component.projectID.toLowerCase() === loadedProject.id.toLowerCase()
                            );
                        
                        } catch (error) {
                            return false; // or handle the error as needed
                        }  
                    };
                    setExistingFormComponent(formComponentExists(formComponentName))
                  }
        
                } else {
                  console.error('Data structure does not match the expected format');
                }
    }, [formComponentName]);


    useEffect(() => {
        if (ConditionsQueryData?.dataStore) {   
    
            if (ConditionsQueryData?.dataStore?.entries){
  

              const conditionExists = (conditionNameToCheck) => {
                  const conditionNameArray = ConditionsQueryData.dataStore?.entries || [];
                  


                  try {
                    return conditionNameArray.some(condition => 
                        condition.name.toLowerCase() === conditionNameToCheck.toLowerCase() &&
                        condition.projectID.toLowerCase() === loadedProject.id.toLowerCase()
                      );
                
                } catch (error) {
                    return false; // or handle the error as needed
                } 
              };
              setExistingConditionName(conditionExists(conditionName))
            }
  
          } else {
            console.error('Data structure does not match the expected format');
          }

    },[conditionName]);

    useEffect(() => {
        if (LabelQueryData?.dataStore) {   
    
            if (LabelQueryData?.dataStore?.entries){
  

              const labelExists = (labelNameToCheck) => {

                if (labelNameToCheck === undefined){
                    return false
                }else{
                  const metadataNameArray = LabelQueryData.dataStore?.entries || [];
                try {
                    return metadataNameArray.some(label => 
                        label.name.toLowerCase() === labelNameToCheck.toLowerCase() &&
                        label.projectID.toLowerCase() === loadedProject.id.toLowerCase()
                      );
                
                } catch (error) {
                    return false; // or handle the error as needed
                } 
                }
              };
              setExistingMetadataName(labelExists(metadataName))
            }
  
          } else {
            console.error('Data structure does not match the expected format');
          }

    },[metadataName]);


    // Function to toggle the state
    const toggleSavingDataElementState = () => {
                // Set the state to true
        clearConstants()
        setSavingDataElementState(true);
        setSavingDataElementState(currentState => !currentState); // Negate the current state
    };

    // const updateDataStore = async (postObject, store, key) =>{

    //     try {
    //         await props.engine.mutate({
    //           resource: `dataStore/${store}/${key}`,
    //           type: 'update',
    //           data: postObject,
    //         });

    //       } catch (error) {
    //         // Handle error (log, show alert, etc.)
    //         console.error('Error updating object:', error);
    //       }
    // }

    /** Prepare data to Update DHIS2 Object */
    const handleSaveToConfiguration = async (action, templateName = '') => {
        if (action === 'save-order'){

            if (updateDataStore(props.engine, {
                ...loadedProject,
                dataElements: [...dataElements],
            }, config.dataStoreName, loadedProject.key)){

                show({ msg: `Data Elements Re-ordered Successfully.`, type: 'success' })
            }


            toggleSavingDataElementState()

            AferProjectSave((prev) => !prev);
    
    
            openDataElementList()

            setDirectClickTabDE(1);
            setSaveNow(false)
        }else{

            if (selectedDataElementId !== null 
                && selectedDataElement !== null
                && selectedHorizontalCategoryID0 !== null) {
                                
                
                    const projectData = {
                        "dataElements":[        
                            {
                            "id":selectedDataElementId, 
                            "name":selectedDataElement,
                            "overidingCategory":overidingCategory,
                            "sideNavigation": selectedSideNavigation || 'Default',
                            "formComponent":selectedFormComponents || 'Default',
                            "HorizontalLevel0": {                                
                                    "id":selectedHorizontalCategoryID0, 
                                    "name":selectedHorizontalCategoryName0,
                                    "metadata":dictfileredHorizontalCatCombo0                            
                                },
                            "HorizontalLevel1": {                                
                                "id":selectedHorizontalCategoryIDLevel1, 
                                "name":selectedHorizontalCategoryNameLevel1,
                                "metadata":dictfileredHorizontalCatComboLevel1                        
                            },
                            "verticalLevel1": {                                
                                "id":selectedVerticalCategoryIDLevel1, 
                                "name":selectedVerticalCategoryNameLevel1,
                                "metadata":dictfileredVerticalCatComboLevel1                        
                            },
                            "verticalLevel2": {                                
                                "id":selectedVerticalCategoryIDLevel2, 
                                "name":selectedVerticalCategoryNameLevel2,
                                "metadata":dictfileredVerticalCatComboLevel2                        
                            },
                            "verticalLevel3": {                                
                                "id":selectedVerticalCategoryIDLevel3, 
                                "name":selectedVerticalCategoryNameLevel3,
                                "metadata":dictfileredVerticalCatComboLevel3                        
                            },
                            "verticalLevel4": {                                
                                "id":selectedVerticalCategoryIDLevel4, 
                                "name":selectedVerticalCategoryNameLevel4,
                                "metadata":dictfileredVerticalCatComboLevel4                        
                            },
                            }
                        ]
                    }
    
                    // Check if 'modifiedDate' exists in loadedProject
                    if (!loadedProject.hasOwnProperty('modifiedDate')) {
                        // If it doesn't exist, add it to the object
                        loadedProject.modifiedDate = modifiedDate();
                    } else {
                        // If it exists, update its value
                        loadedProject.modifiedDate = modifiedDate();
                    }
    
                    // Check if 'catCombos' exists in loadedProject
                    if (!loadedProject.hasOwnProperty('catCombos')) {
                        // If it doesn't exist, add it to the object
                        loadedProject.catCombos = [];
                    }
    
                    const catComboExistIndex = loadedProject.catCombos.findIndex(element => element.id === categoryComboNameID.id);
    
                    if (catComboExistIndex !== -1){
    
                        console.log(categoryComboNameID.id+' Combo already exist')
                    }else{
                        const categoryCombo = { id: categoryComboNameID.id, name: categoryComboNameID.name };
                        loadedProject.catCombos.push(categoryCombo);
    
                    }
                        
                    
    
                    
                    // Find the index of the dataElement with the matching id in loadedProject.dataElements
                    const indexToUpdate = dataElements.findIndex(element => element.id === selectedDataElementId);
    
                    // If the index is found, replace the object at that index with the corresponding object from projectData.dataElements
                    if (indexToUpdate !== -1) {
                        const updatedDataElements = [...dataElements];
                        updatedDataElements[indexToUpdate] = projectData.dataElements.find(element => element.id === selectedDataElementId);
    
                        if (updateDataStore(props.engine, {
                            ...loadedProject,
                            ...projectData,
                            dataElements: updatedDataElements,
                        }, config.dataStoreName, loadedProject.key)){
    
                            show({ msg: `Data Element  "${selectedDataElementId}" updated successfully.`, type: 'success' })
                        }
                    } else {
    
                        if(updateDataStore(props.engine, {
                            ...loadedProject,
                            ...projectData,
                            dataElements: [...dataElements, ...projectData.dataElements],
                        }, config.dataStoreName, loadedProject.key)){
    
                            show({ msg: `Data Element  "${selectedDataElementId}" added successfully.`, type: 'success' })
                        }
    
                    }
                    toggleSavingDataElementState()
    
                    if (action === 'saveTemplate'){    
                        const Templateid = generateRandomId();  
                                // Remove spaces from projectName
                        const trimmedTemplateName = templateName.replace(/\s+/g, '');
                        // console.log('catCombo: ', categoryComboNameID)
                        const TemplateData =  {
                            "id":Templateid,
                            "key": trimmedTemplateName+'-'+Templateid,
                            "name":templateName,
                            "overidingCategory":overidingCategory,
                            "projectID":loadedProject.id,
                            "catCombo":categoryComboNameID,
                            "modifiedDate":modifiedDate(),
                            "sideNavigation": selectedSideNavigation || 'Default',
                            "formComponent":selectedFormComponents || 'Default',                    
                            "HorizontalLevel0": {                                
                                "id":selectedHorizontalCategoryID0, 
                                "name":selectedHorizontalCategoryName0,
                                "metadata":dictfileredHorizontalCatCombo0
                            },
                            "HorizontalLevel1": {                                
                                    "id":selectedHorizontalCategoryIDLevel1, 
                                    "name":selectedHorizontalCategoryNameLevel1,
                                    "metadata":dictfileredHorizontalCatComboLevel1 
                            }, 
                            "verticalLevel1": {                                
                                "id":selectedVerticalCategoryIDLevel1, 
                                "name":selectedVerticalCategoryNameLevel1,
                                "metadata":dictfileredVerticalCatComboLevel1                        
                            },
                            "verticalLevel2": {                                
                                "id":selectedVerticalCategoryIDLevel2, 
                                "name":selectedVerticalCategoryNameLevel2,
                                "metadata":dictfileredVerticalCatComboLevel2                        
                            },
                            "verticalLevel3": {                                
                                "id":selectedVerticalCategoryIDLevel3, 
                                "name":selectedVerticalCategoryNameLevel3,
                                "metadata":dictfileredVerticalCatComboLevel3                        
                            },
                            "verticalLevel4": {                                
                                "id":selectedVerticalCategoryIDLevel4, 
                                "name":selectedVerticalCategoryNameLevel4,
                                "metadata":dictfileredVerticalCatComboLevel4                        
                            },
                        }
            
                        try {
                            await props.engine.mutate({
                              resource: `dataStore/${config.dataStoreTemplates}/${trimmedTemplateName}-${Templateid}`,
                              type: 'create',
                              data: TemplateData,
                            });
                            //update project saving state
                            toggleSavingDataElementState()
    
                          } catch (error) {
                            // Handle error (log, show alert, etc.)
                            console.error('Error saving Template:', error);
    
                          }      
                    TemaplateQueryrefetch()
                    }
                    AferProjectSave((prev) => !prev);
    
                    setDataElementCatLenght(0)
                    openDataElementList()
    
                    setDirectClickTabDE(1);
                                    
                        // Close the modal or perform any other actions upon success
                        //handleCloseModal();
            }else{
    
                console.log('No record was saved. No DataElement Selected')
    
            }


        } // if not save-order

        // Activate refresh button
        setRefreshing(false);
        //update project saving state
        toggleSavingDataElementState()
    }

    const handleDataElementRefreshClick = () => {
        // Activate refresh button
        AferProjectSave((prev) => !prev);


        openDataElementList()

        setDirectClickTabDE(1);
        setRefreshing(false);
        //update project saving state
        toggleSavingDataElementState()

    };


    
    const handleExclusionRuleRefreshClick = () => {


        ConditionsQueryDataRefetch()
    };
    
    const handleLabelRefreshClick = () => {


        LabelQueryDataRefetch()
    };


    const handleTemplateRefreshClick = () => {


        TemaplateQueryrefetch()
    };
    

    const handleNavigatioFormComponentRefreshClick = () => {


        SideNavigationQueryrefetch()
        FormComponentQueryrefetch()
    };
    
    // Function to update template name
    const GenerateHTMLHandler  = () => {
            refetch() 
            setShowGenerateForm(true)
    };

    // Function to update template name
    const handleTemplateNameChange = (event) => {
            setTemplateName(event.target.value);
    };



    // Function to update Exclusion level
    const handleExclusionLevelChange = (event) => {

        setSelectedExclusionLevel(event.target.value);
    };

    // Function to update Exclusion Data Element
    const handleSelectedExclusionDE = (event) => {
        const selectedValue = event.target.value;

        // Split the selected value using the separator "val:-"
        const parts = selectedValue.split('-val:-');
        
        // The first part should be the catCombo.id
        const deId = parts[0];


        const deName = parts[1];

        setConditionDE(selectedValue);
        setConditionDEIDName([{id:deId, name:deName}])
    };

    const handleSelectedExclusionCoC = (event) => {
        const selectedValue = event.target.value;

        // Split the selected value using the separator "val:-"
        const parts = selectedValue.split('-val:-');
        
        // The first part should be the catCombo.id
        const catComboId = parts[0];


        const catComboName = parts[1];

        setConditionCoC(selectedValue);
        setConditionCoCIDName([{id:catComboId, name:catComboName}])
    };

    

    

    // Function to update Exclusion Data Element
    const handleSelectedExclusionCategory = (event) => {
        const selectedValue = event.target.value;

        // Split the selected value using the separator "val:-"
        const parts = selectedValue.split('-val:-');
        
        // The first part should be the catCombo.id
        const catComboId = parts[0];
        // The first part should be the catCombo.id

        const catComboName = parts[1];
        setConditionCOIDName([{id:catComboId, name:catComboName}])

        setCategoryExclusion(catComboId);

    };

        // Function to update Exclusion Data Element
        const handleSelectedExclusionCategory2 = (event) => {
            const selectedValue = event.target.value;
    
            // Split the selected value using the separator "val:-"
            const parts = selectedValue.split('-val:-');
            
            // The first part should be the catCombo.id
            const catComboId = parts[0];
            // The first part should be the catCombo.id
    
            const catComboName = parts[1];
            setConditionCOIDName2([{id:catComboId, name:catComboName}])
    
            setCategoryExclusion2(catComboId);
    
        };
    
        // Function to update Exclusion Data Element
        const handleSelectedExclusionCategoryToProcess = (event) => {
            const selectedValue = event.target.value;

            // Split the selected value using the separator "val:-"
            const parts = selectedValue.split('-val:-');
            
            // The first part should be the catCombo.id
            const optionID = parts[0];
            // The first part should be the catCombo.id
    
            const optionName = parts[1];


            setCategoryExclusionToProcess([{id:optionID, name:optionName}]);
            // console.log('Selected Exclusion', event.target.value)
        };

    // Function to update condition level
    const handleConditionLevelChange = (event) => {

        setSelectedConditionLevel(event.target.value);
    };


    // Function to reset template name and close the modal
    const handleCloseTemplateNameModal = () => {
        setTemplateName('');
        setShowTemplateNameModal(false);
    };

    // Function to create Side Navigation and close the modal
    const handleCloseSideandFormNavigationModal = () => {
        setSideNavigationName('');
        setFormComponentName('');
        setSideNavigationForm(false);
        setFormComponents(false);

    }; 

    //
    // Function to reset template name and close the modal
    const handleCloseExclusionModal = () => {
        setExclusionComponents(false);
        setExclusion([]);
        setExclusion2([]);
        setConditionDE('');
        setConditionCoC('');
        setCategoryExclusion('');
        setCategoryExclusion2('');
        setCategoryExclusionToProcess('');
        setConditionName('');
        setEditExclusionMode(false);
        setSelectedExclusion('');
        setSelectedExclusionMetadataOption('');
        setConditionCoCIDName([]);
        setConditionCOIDName([]);
        setConditionCOIDName2([]);
        setConditionDEIDName([{"id": ""}]);

    };

    const handleCreateExclusion = async (action, updatingID='') => {
                    // Remove spaces from const
        const trimmedconditionName= conditionName.replace(/\s+/g, '');
        console.log(excludeToProcess)

        if (selectedExclusionMetadataOption === "CategoryOption"){
            if (!trimmedconditionName.trim() 
            || !exclude[0]
            || !conditionCOIDName[0] 
            || !categoryExclusionToProcess
            || !excludeToProcess[0]
            
            ) {
                console.log('Please enter all rule parameters: CategoryOption');
                return;
            }      

        }
        if (selectedExclusionMetadataOption === "DataElement"){
            if (!trimmedconditionName.trim() 
                || !conditionCOIDName[0] 
                || !conditionCoCIDName
                || !exclude[0]) {
                console.log('Please enter all rule parameters');
                return;
            }      

        }

        if (selectedExclusionMetadataOption === ""){
                console.log('Please enter all rule parameters');
                return;            

        }

        if (action === "new"){

            console.log(action, ' Rule Object')
            const componentsID = generateRandomId();  
        


            if (existingConditionName){
                console.log('Rule Name is not Unique');
                return;
            }
    
            // Maximum length for the trimmed string is 15
            const trimmedName = trimmedconditionName.substring(0, 15);
            let conditionData;
            if (selectedExclusionMetadataOption === 'DataElement') {
                conditionData =  {            
                    id:componentsID,
                    metadata: selectedExclusionMetadataOption,
                    // categoryExclusion:categoryExclusion,
                    name:conditionName,
                    conditionDE:conditionDEIDName,
                    category:conditionCOIDName,
                    category2:conditionCOIDName2,
                    conditionCoC:conditionCoCIDName,
                    conditionCategoryOption:exclude,
                    conditionCategoryOption2:exclude2,
                    projectID: loadedProject.id,
                    key: `${trimmedName}-${componentsID}`,     
            
                };
            }else{

                conditionData =  {            
                    id:componentsID,
                    metadata: selectedExclusionMetadataOption,
                    name:conditionName,
                    conditionDE:conditionDEIDName,
                    category:conditionCOIDName,
                    category2:conditionCOIDName2,
                    conditionCoC:conditionCoCIDName,
                    // conditionLevel:alignLevels(selectedConditionLevel),
                    // categoryExclusion:categoryExclusion,
                    conditionCategoryOption:exclude,
                    conditionCategoryOption2:exclude2,
                    categoryExclusionToProcess:categoryExclusionToProcess,
                    categoryExclusionOptionToProcess:excludeToProcess,
                    // exclusionLevel:alignLevels(selectedExclusionLevel),
                    projectID: loadedProject.id,
                    key: `${trimmedName}-${componentsID}`,     
            
                };
            }
    
            try {
                await props.engine.mutate({
                  resource: `dataStore/${config.dataStoreConditions}/${trimmedName}-${componentsID}`,
                  type: 'create',
                  data: conditionData,
                });
            
                // Close the modal or perform any other actions upon success
                show({ msg: 'Exclusion :' +trimmedName+ ' Created', type: 'success' })
    
              } catch (error) {
                // Handle error (log, show alert, etc.)
                console.error('Error saving Excludion Rule:', error);
              }

        }
        if (action === "update"){
            console.log(action, ' Rule Object')

            let conditionData;
            if (selectedExclusionMetadataOption === 'DataElement') {
                conditionData =  {            
                    id:updatingID,
                    metadata: selectedExclusionMetadataOption,
                    // categoryExclusion:categoryExclusion,
                    name:conditionName,
                    category:conditionCOIDName,
                    category2:conditionCOIDName2,
                    conditionDE:conditionDEIDName,
                    conditionCoC:conditionCoCIDName,
                    conditionCategoryOption:exclude,
                    conditionCategoryOption2:exclude2,
                    projectID: loadedProject.id,
                    key: selectedExclusion 
            
                };
            }else{

                conditionData =  {            
                    id:updatingID, 
                    metadata: selectedExclusionMetadataOption,
                    name:conditionName,
                    category:conditionCOIDName,
                    category2:conditionCOIDName2,
                    conditionDE:conditionDEIDName,
                    conditionCoC:conditionCoCIDName,
                    // conditionLevel:alignLevels(selectedConditionLevel),
                    // categoryExclusion:categoryExclusion,
                    conditionCategoryOption:exclude,
                    conditionCategoryOption2:exclude2,
                    categoryExclusionToProcess:categoryExclusionToProcess,
                    categoryExclusionOptionToProcess:excludeToProcess,
                    // exclusionLevel:alignLevels(selectedExclusionLevel),
                    projectID: loadedProject.id,
                    key: selectedExclusion 

                
            
                };
            }
            updateDataStore(props.engine, conditionData, config.dataStoreConditions, selectedExclusion)
            

            // id:componentsID, 
            // projectID: loadedProject.id,
            // key: `${trimmedName}-${componentsID}`,    

        }
          handleCloseExclusionModal();

          ConditionsQueryDataRefetch()
          setReloadExclusions((prev) => !prev); 
    
    }

    const handleEditExclusions = (key) => {
        setEditExclusionMode(true)
        setSelectedExclusionEditInit(key)
        const initparts = key.split('-val:-');
        setSelectedExclusion(initparts[0])
        setExclusionComponents(true)
    }
    const handleCloseLabelModal =() =>{
        setLabelComponents(false);
        setSelectedMetadataOption('');
        setMetadataName('');
        setMetadataName2('');
        setMetadataName3('');
        setLabelName('');
        setEditLabelMode(false)
        setSelectedLabel('')
        setLabelDEIDName([])
        setLabelComboIDName([])
        setLabelCategoryIDName([])
        setLabelCategoryIDName2([])
        setLabelCategoryIDName3([])
        setLabelOptionIDName([])
        setLabelOptionIDName2([])
        setLabelOptionIDName3([])
    }


    const handleEditLabel = (key) =>{
        setEditLabelMode(true)
        setLabelComponents(true)
        setSelectedLabel(key)

    }
    const handleCreateLabel = async (action, updatingID) => {
        if (action === 'new'){


            const componentsID = generateRandomId();  
        
            // Remove spaces from const
            const trimmedLabelName= labelName.replace(/\s+/g, '');
            if (!trimmedLabelName.trim() || !metadataName  || !selectedMetadataOption) {
                console.log('Please enter all label parameters');
                return;
            }
            // if (existingMetadataName){
            //     console.log('Metadata name is not Unique');
            //     return;
            // }
            // Maximum length for the trimmed string is 15
            const trimmedName = trimmedLabelName.substring(0, 15);
    
            const labelData =  {            
                id:componentsID, 
                name:metadataName,
                labelDEIDName:labelDEIDName,
                labelComboIDName:labelComboIDName,
                labelCategoryIDName:labelCategoryIDName,
                labelOptionIDName:labelOptionIDName,
                labelInclusionCategoryIDName2:labelCategoryIDName2,
                labelInclusionOptionIDName2:labelOptionIDName2,
                labelInclusionCategoryIDName3:labelCategoryIDName3,
                labelInclusionOptionIDName3:labelOptionIDName3,
                labelName:labelName,
                metadataType:selectedMetadataOption,
                projectID: loadedProject.id,
                key: `${trimmedName}-${componentsID}`,           
        
            }

            console.log('labelData: ', labelData)
            try {
                await props.engine.mutate({
                  resource: `dataStore/${config.dataStoreLabelName}/${trimmedName}-${componentsID}`,
                  type: 'create',
                  data: labelData,
                });
            

    
              } catch (error) {
                // Handle error (log, show alert, etc.)
                console.error('Error saving label:', error);
              }




            
        }
        if (action === 'update'){
            const labelData =  {            
                id:updatingID, 
                name:metadataName,
                labelDEIDName:labelDEIDName,
                labelComboIDName:labelComboIDName,
                labelOptionIDName:labelOptionIDName,
                labelCategoryIDName:labelCategoryIDName,
                labelInclusionCategoryIDName2:labelCategoryIDName2,
                labelInclusionOptionIDName2:labelOptionIDName2,
                labelInclusionCategoryIDName3:labelCategoryIDName3,
                labelInclusionOptionIDName3:labelOptionIDName3,
                labelName:labelName,
                metadataType:selectedMetadataOption,
                projectID: loadedProject.id,
                key: selectedLabel,           
        
            }

            updateDataStore(props.engine, labelData, config.dataStoreLabelName, selectedLabel)
        }



        // Close the modal or perform any other actions upon success
          handleCloseLabelModal();
          LabelQueryDataRefetch()
          setReloadLabels((prev) => !prev); 
    



    }
   
    // Function to create Side Navigation
    const handleCreateSideNavigation = async () => {

        const dataSetName = selectedDataSetName ? true : false;


        const componentsID = generateRandomId();  
        
        // Remove spaces from const
        const trimmedSideNavigationName= sideNavigationName.replace(/\s+/g, '');
        if (!trimmedSideNavigationName.trim() || !dataSetName) {
            console.log('Please enter a Navigation name or select dataSet');
            return;
        }

        if (existingSideNavigation){
            console.log('Side navigation Name is not Unique');
            return;
        }

        const SideNavigationData =  {            
                    id:componentsID, 
                    sideNavName:sideNavigationName,                    
                    projectID: loadedProject.id,
                    key: `${trimmedSideNavigationName}-${loadedProject.id}`,           
            
        }

        try {
            await props.engine.mutate({
              resource: `dataStore/${config.dataStoreSideNavigations}/${trimmedSideNavigationName}-${loadedProject.id}`,
              type: 'create',
              data: SideNavigationData,
            });
            show({ msg: 'Side Navigation Created :' +sideNavigationName, type: 'success' })
            // Close the modal or perform any other actions upon success
            handleCloseSideandFormNavigationModal();


          } catch (error) {
            // Handle error (log, show alert, etc.)
            console.error('Error saving side navigation:', error);
          }
          SideNavigationQueryrefetch()

    }

    // Function to Form Component
    const handleCreateFormComponent = async () => {


        const dataSetName = selectedDataSetName ? true : false;


        const componentsID = generateRandomId();  
        
        // Remove spaces from const
        const trimmedFormComponentName= formComponentName.replace(/\s+/g, '');
        if (!trimmedFormComponentName.trim() || !dataSetName) {
            console.log('Please enter a Navigation name or select dataSet');
            return;
        }

        if (existingFormComponent){
            console.log('Form Component Name is not Unique');
            return;
        }

        const formComponentData =  {            
                    id:componentsID, 
                    formComponentName:formComponentName,                    
                    projectID: loadedProject.id,
                    key: `${trimmedFormComponentName}-${loadedProject.id}`,           
            
        }

        try {
            await props.engine.mutate({
              resource: `dataStore/${config.dataStoreFormComponents}/${trimmedFormComponentName}-${loadedProject.id}`,
              type: 'create',
              data: formComponentData,
            });
        
            // Close the modal or perform any other actions upon success
            show({ msg: `Form Component  "${formComponentName}" created successfully.`, type: 'success' })
            handleCloseSideandFormNavigationModal();

          } catch (error) {
            // Handle error (log, show alert, etc.)
            console.error('Error saving side navigation:', error);
          }
          FormComponentQueryrefetch()

    }

    // Function to handle "Save and Make Template" button click
    const handleSaveTemplate = () => {
            // Open the modal for entering the template name
        setShowTemplateNameModal(true);
    };

    const handleCloseModal = () => {

        setSelectedDataElementsDict(null);
        props.setShowModalConfigureProject(false);
        setDirectClickTabDE(0);
        setEditMode(false);
        setCategoryComboNameID(''); 
        setDataElementCatLenght(0);     

    };
    
    const handleDeleteSideNavigation = async (KeyID) => {

        try {
          await props.engine.mutate({
            resource: `dataStore/${config.dataStoreSideNavigations}/${KeyID}`,
            type: 'delete',
          });
        show({ msg: `Side Navigation  "${KeyID}" deleted successfully.`, type: 'success' })

        //   handleCloseModal(); // Close the modal after successful deletion

        } catch (error) {
          console.error('Error deleting navigation:', error);
        }
        SideNavigationQueryrefetch(); // Refetch data after deletion
        // setSelectedProject(null);
        // setShowDeleteModal(false)
        
        console.log('Deleting navigation::', KeyID);
    
    
      };

    const handleDeleteFormComponent = async (KeyID) =>{
        try {
            await props.engine.mutate({
              resource: `dataStore/${config.dataStoreFormComponents}/${KeyID}`,
              type: 'delete',
            });

            show({ msg: `Form Component  "${KeyID}" deleted successfully.`, type: 'success' })
          //   handleCloseModal(); // Close the modal after successful deletion
  
          } catch (error) {
            console.error('Error deleting navigation:', error);
          }
          FormComponentQueryrefetch(); // Refetch data after deletion
          // setSelectedProject(null);
          // setShowDeleteModal(false)
          
          console.log('Deleting navigation::', KeyID);
      

    }

    const handleDeleteTemplate = async (KeyID) => {

        try {
            await props.engine.mutate({
              resource: `dataStore/${config.dataStoreTemplates}/${KeyID}`,
              type: 'delete',
            });
            show({ msg: `Template  "${KeyID}" deleted successfully.`, type: 'success' })
          //   handleCloseModal(); // Close the modal after successful deletion
  
          } catch (error) {
            console.error('Error deleting Template:', error);
          }
          TemaplateQueryrefetch(); // Refetch data after deletion
          // setSelectedProject(null);
          // setShowDeleteModal(false)
          
          console.log('Deleting Template::', KeyID);

    }

    const handleDeleteExclusion = async (KeyID) => {

        try {
            await props.engine.mutate({
              resource: `dataStore/${config.dataStoreConditions}/${KeyID}`,
              type: 'delete',
            });
            show({ msg: `Exclusion  "${KeyID}" deleted successfully.`, type: 'success' })
          //   handleCloseModal(); // Close the modal after successful deletion
  
          } catch (error) {
            console.error('Error deleting Exclusion:', error);
          }
          ConditionsQueryDataRefetch(); // Refetch data after deletion
          // setSelectedProject(null);
          // setShowDeleteModal(false)
          
          console.log('Deleting Exclusion::', KeyID);

    }

  

    const handleDeleteLabel = async (KeyID) => {

        try {
            await props.engine.mutate({
              resource: `dataStore/${config.dataStoreLabelName}/${KeyID}`,
              type: 'delete',
            });
            show({ msg: `Label  "${KeyID}" deleted successfully.`, type: 'success' })
          //   handleCloseModal(); // Close the modal after successful deletion
  
          } catch (error) {
            console.error('Error deleting label:', error);
          }
          LabelQueryDataRefetch(); // Refetch data after deletion
          // setSelectedProject(null);
          // setShowDeleteModal(false)
          


    }


    const handleRemoveDataElementConfirmation = async (dataElement) => {

        // Filter out the dataElement with the specified ID
        const updatedDataElements = loadedProject.dataElements.filter(
            (element) => element.id !== dataElement.id
        );

   
        // Update the state with the new dataElements array
        const modifiedbject = {
            ...loadedProject,
            dataElements: updatedDataElements,
        };

        try {
            await props.engine.mutate({
              resource: `dataStore/${config.dataStoreName}/${modifiedbject.key}`,
              type: 'update',
              data: modifiedbject,
            });
            show({ msg: `dataElement  "${modifiedbject.key}" deleted successfully.`, type: 'success' })


          } catch (error) {
            // Handle error (log, show alert, etc.)
            show({ msg: `dataElement  "${modifiedbject.key}" deleting failed.`, type: 'critical' })
          }
        AferProjectSave((prev) => !prev);
            
    }

    const handleEditDataElement = (dataElement) => {
        // testing
        setloadedCombosName('')

        setfileredHorizontalCatComboLevel1([])
        // the selected dataElement with the specified ID
        const updatedDataElements = loadedProject.dataElements.filter(
            (element) => element.id === dataElement.id
        );
        setSelectedDataElementsDict(updatedDataElements)
        setSelectedDataElement(dataElement.name)
        setSelectedDataElementId(dataElement.id)
        setSelectedTab('dataElemenent-configuration')
        setIsDataElementExpanded(true)
        setDirectClickTabDE(0);
        setEditMode(true)




    }

    const openDataElementList = () =>{
        clearConstants()
        setSelectedTab('dataElemenents-table')        
        setEditMode(false)
        setSelectSideNavigation(null);
        setSelectFormComponents(null);
        setDataElementCatLenght(0);

    }
    const newDataElementLaunch = () =>{

        setSelectedTab('dataElemenent-configuration');
        setDataElementCatLenght(0)
        setEditMode(false)
        setDirectClickTabDE(1);
        setSelectSideNavigation(null);
        setSelectFormComponents(null);
        // setSelectedDataElementId(null);


    }

    const moveUp = (index) => {

        if (index > 0) {
            const newDataElements = [...dataElements];
            const rowItem = newDataElements[index];
            const rowItemReplaced = newDataElements[index-1];
            newDataElements[index - 1] = rowItem;
            newDataElements[index] = rowItemReplaced;
            setDataElements(newDataElements)
            setSaveNow(true)

        }
    };

    const moveDown = (index) => {
        if (index < dataElements.length - 1) {
            const newDataElements = [...dataElements];
            const rowItem = newDataElements[index];
            const rowItemReplaced = newDataElements[index + 1];
            newDataElements[index + 1] = rowItem;
            newDataElements[index] = rowItemReplaced;
            setDataElements(newDataElements)
            setSaveNow(true)

        }
    };
  
    const handleFilterChange = (value) => {
        setFilterText(value);
      };


    const filteredDataElements = filterText
    ? dataElements.filter(
        (de) =>
          de.name.toLowerCase().includes(filterText.toLowerCase()) 
      )
    : dataElements;


    if (error1 ) {
        return <span>ERROR: {error1?.message }</span>;
    }

    if (loading1) {
        return <span>Loading...</span>;
    }
    


  return (
    <Modal fluid onClose={handleCloseModal}>
      <ModalTitle>
      {`Category Options and Navigations - ${loadedProject.projectName}`}

        </ModalTitle>
          <ModalContent>
          <TabBar>

          <Tab
            label="Existing Data Elements"
            selected={selectedTab === 'dataElemenents-table'}
            onClick={() => {
                openDataElementList()
                setAddorEditMode(false)
                setloadedCombosName('')
            }}
            disabled={saveNow}
          >
            Existing Data Elements
          </Tab>
          <Tab
            label="Configure Form Components"
            selected={selectedTab === 'form-components'}
            onClick={() => {
                setSelectedTab('form-components');
                setEditMode(false)
                setDirectClickTabDE(0);
                setSelectSideNavigation(null);
                setSelectFormComponents(null);
              }}
              disabled={saveNow}
          >
            Configure Form Components
          </Tab>
          <Tab
            label="Configure Data Elements"
            selected={selectedTab === 'dataElemenent-configuration'}
            onClick={() => {
                setAddorEditMode(false)
                setloadedCombosName('')
                newDataElementLaunch()
              }}
              disabled={saveNow}
          >
            Configure Data Elements
          </Tab>

          <Tab
            label="Templates"
            selected={selectedTab === 'template-configuration'}
            onClick={() => {
                setSelectedTab('template-configuration');
                setEditMode(false)
                setDirectClickTabDE(0);
                setSelectSideNavigation(null);
                setSelectFormComponents(null);
              }}
              disabled={saveNow}
          >
            CoC Templates
          </Tab>
          <Tab
            label="Exclusion Rules"
            selected={selectedTab === 'exclusion-rules'}
            onClick={() => {
                setSelectedTab('exclusion-rules');
                setEditMode(false)
                setDirectClickTabDE(0);
                setSelectSideNavigation(null);
                setSelectFormComponents(null);
              }}
              disabled={saveNow}
          >
            Exclusion Rules
          </Tab>
          <Tab
            label="Labels"
            selected={selectedTab === 'Labels'}
            onClick={() => {
                setSelectedTab('Labels');
                setEditMode(false)
                setDirectClickTabDE(0);
                setSelectSideNavigation(null);
                setSelectFormComponents(null);
              }}
              disabled={saveNow}
          >
            &nbsp;&nbsp;Labels&nbsp;&nbsp;
          </Tab>
        </TabBar>

        {selectedTab === 'dataElemenents-table' && (
        <div className={classes.tableContainer_dataElements}>
          <div className={`${classes.mainSection} ${classes.customSelectpanel}`}>
          {/* <button onClick={handleRefresh} disabled={refreshing}>
                <IconSync24 className={classes.icon} />
            </button> */}

                {!saveNow && (
                
                
                
                <div className={classes.customImageContainer} onClick={handleDataElementRefreshClick}>
                    {customImage('sync', 'large')}

                </div>
                
                
                
                
                )}
                    <div>
                    <InputField
                            className={classes.filterInput}
                            inputWidth={'20vw'}
                            // label="Filter by - DataElement Name Name, ID or DataSet"
                            name="filter"
                            placeholder="Filter by - DataElement Name"
                            value={filterText}
                            onChange={(e) => handleFilterChange(e.value)}
                        />
                    </div>
                  <Table className={classes.dataTable}>

                    <TableHead>
                    <TableRowHead>

                        <TableCellHead>Data Elements

                        {!saveNow && (<span className={classes.iconAdd}  onClick={() => newDataElementLaunch()}>
                          
                                <IconAddCircle24 />

                                </span>)}

                        </TableCellHead>
                        <TableCellHead>Actions</TableCellHead>
                    </TableRowHead>
                    </TableHead>
                    <TableBody>
                        {filteredDataElements && filteredDataElements.length > 0 ? (
                            filteredDataElements.map((dataElementObj, index) => (
                            <TableRow className={classes.customTableRow} key={dataElementObj.id}>
                                <TableCell className={classes.customTableCell}>{dataElementObj.name}</TableCell>
                                <TableCell className={`${classes.customTableCell}`}>

                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <TooltipComponent 
                                        IconType={IconEdit16} 
                                        btnFunc={handleEditDataElement}
                                        project={dataElementObj}
                                        dynamicText="Edit"
                                        buttonMode="secondary"
                                        disabled={saveNow}

                                    />


                                    {(<div className={classes.customImageContainer} onClick={() => moveDown(index)}>
                                        {customImage('arrowdown', 'small')}
                                    </div>)}
                                    {(<div className={classes.customImageContainer} onClick={() => moveUp(index)}>
                                        {customImage('arrowup', 'small')}
                                    </div>)}
                                    <TooltipComponent 
                                        IconType={IconDelete16} 
                                        btnFunc={handleRemoveDataElementConfirmation}
                                        project={dataElementObj}
                                        dynamicText="Delete"
                                        buttonMode="destructive"
                                        disabled={saveNow}
                                        customIcon={true}

                                    />
                                </div>
                                </TableCell>
                            </TableRow>
                            ))
                        ) : (
                            <TableRow>
                            <TableCell colSpan="2">No data elements to display</TableCell>
                            </TableRow>
                        )}
                        </TableBody>
                </Table>
          </div>
                    </div>
        )}

{selectedTab === 'form-components' && (
            <div className={classes.tableContainer_dataElements}>
                <div className={`${classes.mainSection} ${classes.customSelectpanel}`}>
                <div className={classes.customImageContainer} onClick={handleNavigatioFormComponentRefreshClick}>
                    {customImage('sync', 'large')}
                </div>
                    <Table className={classes.dataTable}>
                        <TableHead>
                        <TableRowHead>
                            <TableCellHead className={classes.customTableCellHead}>
                                Side Navigation
                                <span className={classes.iconAdd} onClick={() => setSideNavigationForm(true)}>
                                <IconAddCircle24 />

                                </span>
                                </TableCellHead>

                            <TableCellHead>Actions</TableCellHead>
                        </TableRowHead>
                        </TableHead>
                        <TableBody>
                        {Array.isArray(sideNavigationList || []) &&
                            sideNavigationList.map((navigation) => (
                                // Check if navigation.dataSet is equal to selectedDataSet
                                navigation.projectID === loadedProject.id && (
                                    <TableRow key={navigation.sideNavName} className={classes.customTableRow}>
                                        <TableCell className={classes.customTableCell}>{navigation.sideNavName}</TableCell>
                                        <TableCell className={`${classes.customTableCell}`}>


                                        <TooltipComponent 
                                        IconType={IconDelete16} 
                                        btnFunc={handleDeleteSideNavigation}
                                        project={navigation.key}
                                        dynamicText="Delete"
                                        buttonMode="destructive"
                                        customIcon={true}/>

                                        </TableCell>
                                    </TableRow>
                                )

                            ))}
                            </TableBody>
                    </Table>
                </div>
                <div className={`${classes.mainSection} ${classes.customSelectpanel}`}>

                    <Table className={classes.dataTable}>
                        <TableHead>
                        <TableRowHead>
                            <TableCellHead className={classes.customTableCellHead}>
                                Form Components
                                
                                <span className={classes.iconAdd}  onClick={() => setFormComponents(true)}>
                                <IconAddCircle24 />

                                </span>
                                
                                </TableCellHead>
                            <TableCellHead>Actions</TableCellHead>
                        </TableRowHead>
                        </TableHead>
                        <TableBody>
                        {Array.isArray(FormComponentList || []) &&
                            FormComponentList.map((form_component) => (
                                // Check if navigation.dataSet is equal to selectedDataSet
                                form_component.projectID === loadedProject.id && (
                                <TableRow key={form_component.key} className={classes.customTableRow}>
                                    <TableCell className={classes.customTableCell}>{form_component.formComponentName}</TableCell>
                                    <TableCell className={`${classes.customTableCell}`}>
                                        
                                    <TooltipComponent 
                                        IconType={IconDelete16} 
                                        btnFunc={handleDeleteFormComponent}
                                        project={form_component.key}
                                        dynamicText="Delete"
                                        buttonMode="destructive"
                                        customIcon={true}/>


                                    </TableCell>
                                </TableRow>
                            )
                        ))}
                            </TableBody>
                    </Table>
                </div>
            </div>
            
            
        )}
        
        {selectedTab === 'dataElemenent-configuration' && (

        <div className={classes.tableContainer_dataElements}>
                  <div className={`${classes.mainSection} ${classes.customSelectpanel}`}>

                    
                  <button className={classes.collapsible} onClick={() => setIsDataSetsExpanded((prev) => !prev)}>
                      {isDataSetsExpanded ? '-' : '+'} DataSets
                  </button>
                  <div className={classes.content + (isDataSetsExpanded ? ` ${classes.active}` : '')}>
                      <h3></h3>
                      <div className={classes.baseMargin}>
                          {/* Use a conditional render to show/hide based on isDivExpanded */}
                          <SingleSelect
                              className="select"
                              filterable
                              noMatchText="No match found"
                              placeholder="Select dataSet"
                              selected={selectedDataSet}
                              value={selectedDataSet}
                              onChange={handleDataSetChange}
                              disabled
                              
                          >
                              {data1.dataSets.dataSets.map(({ id, displayName }) => (
                              <SingleSelectOption key={id}  label={displayName} value={id} />
                              ))}
                          </SingleSelect>

                      </div>
                  </div>


              
                  <div className={classes.mainSection}>
                      <div className={classes.fullpanel}>
                          <Divider />
                      </div>
                  </div>

                  {(selectedDataElementId.length > 0) && (<div className={classes.customImageContainer}  style={{ cursor: 'pointer' }}
                        onMouseEnter={toggleGuide}
                        onMouseLeave={toggleGuide}>
                                    {/* {showGuide && ( )}*/}
                      <div>
                      <IconInfo16 alt="Guide" />
                       
                      </div>
                
                    </div>)}

                    <div style={{ position: 'relative', display: 'inline-block', fontSize: '0.7rem' }}>

                        {showGuide && (
                        <div className={classes.guideContent}
                    
                        >{dataElementCatLenght} Levels
                            	{(dataElementCatLenght === 3) && (<img src={level3Guide} alt="Guide" />)}
                                {(dataElementCatLenght === 4) && (<img src={level4Guide} alt="Guide" />)}
                                {(dataElementCatLenght === 5) && (<img src={level5Guide} alt="Guide" />)}
                                {(dataElementCatLenght === 6) && (<img src={level6Guide} alt="Guide" />)}
                        </div>
                        )}
                    </div>
                  {/* Select DataElement */}
                  <button className={classes.collapsible} onClick={() => 
                          {
                              setIsDataElementExpanded((prev) => !prev);
                          
                          }                   
                  
                  }>
                      {isDataElementExpanded ? '-' : '+'} DataElements
                  </button>
                  <div className={classes.baseMargin}>
                      <div className={`${classes.content} ${isDataElementExpanded ? classes.active : ''}`}>

                          <h3></h3>
                          {(function() {
                              if (typeof selectedDataSet === 'string' && selectedDataSet.length > 0) {
                              return <AppGetDEList
                              selectedDataSet={selectedDataSet} 
                              setSelectedDataElementId={setSelectedDataElementId}
                              selectedDataElement={selectedDataElement}
                              selectedDataElementId={selectedDataElementId}
                              setSelectedDataElement={setSelectedDataElement}
                              editMode={editMode}
                              setSelectSideNavigation={setSelectSideNavigation}
                              setSelectFormComponents={setSelectFormComponents}
                              loadedProject={loadedProject}
                              setOveridingCategory={setOveridingCategory}
                              overidingCategory={overidingCategory}
                              isHorizontalCategoryExpanded0={isHorizontalCategoryExpanded0}
                              loadedCombos={loadedCombos}
                              setLoadedCombos={setLoadedCombos}
                              setDataElementCatLenght={setDataElementCatLenght}
                              loadedCombosName={loadedCombosName}
                              setloadedCombosName={setloadedCombosName}
                              updateDataElementCatLenght={updateDataElementCatLenght}
                              AddorEditModeActive={AddorEditModeActive}
                              setAddorEditMode={setAddorEditMode}

                                      />;
                              }
                          })()}
                      </div>
                  </div>
                  
                  {!editMode &&(<div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                  <Button 
                        className={classes.loadTemplateButton} 
                        onClick={() => setShowModalMetadataTemplate(true)}
                        disabled={selectedDataElementId.length <= 0}
                    >
                        Load DataElement CoC Template
                    </Button>
                  </div>
                   )}
                  {showModalMetadataTemplate && 
                      (<MetadataTemplating 
                          engine={props.engine}
                          handleDataElementRefreshClick={handleDataElementRefreshClick}
                          showModalMetadataTemplate={showModalMetadataTemplate}
                          setShowModalMetadataTemplate={setShowModalMetadataTemplate}
                          loadedProject={loadedProject}
                          selectedDataElementId={selectedDataElementId}
                          selectedDataElement={selectedDataElement}
                          fileredHorizontalCatCombo0={fileredHorizontalCatCombo0}
                          loadedCombos={loadedCombos}/>                    
                  )}
                <div className={classes.baseMargin} style={{ display: 'flex' }}>

                        {/* Left content */}
                        <div style={{ flex: 1, width: '50%' }}>
                            <SideNavigation
                            SideNavigationQueryData={SideNavigationQueryData}
                            loadedProject={loadedProject}
                            setSelectSideNavigation={setSelectSideNavigation}
                            selectedDataElementId={selectedDataElementId}
                            editMode={editMode}
                            savingDataElement={savingDataElement}
                            
                            />
                        </div>


                        {/* Right content */}
                        <div style={{ flex: 1, width: '50%' }}>

                            <FormComponentSelection
                            
                            FormComponentQueryData={FormComponentQueryData}
                            loadedProject={loadedProject}
                            setSelectFormComponents={setSelectFormComponents}
                            selectedDataElementId={selectedDataElementId}
                            editMode={editMode}
                            
                            />

                        </div>

                </div>




                  {/* Select HorizontalCategory */}

                  <button className={classes.collapsible} onClick={() => setIsHorizontalCategoryExpanded0((prev) => !prev)} disabled={selectedDataElementId.length <= 0}
                                   

                        
                  >
                      {isHorizontalCategoryExpanded0 ? '-' : '+'} Level 1
                  </button>

                  <div className={classes.baseMargin}>
                      <div className={`${classes.content} ${isHorizontalCategoryExpanded0 ? classes.active : ''}`}>
                          <h3></h3>
                          {(function() {
                              if (typeof selectedDataElementId === 'string' && selectedDataElementId.length > 0) {
                              return <HorizontalCategory
                                          selectedDataSet={selectedDataSet}
                                          selectedDataElementId={selectedDataElementId}
                                          overidingCategory={overidingCategory}
                                          setfileredHorizontalCatComboLevel1={setfileredHorizontalCatComboLevel1}
                                          setfileredVerticalCatComboLevel1={setfileredVerticalCatComboLevel1}
                                          setSelectedHorizontalCategoryID0={setSelectedHorizontalCategoryID0}
                                          setSelectedHorizontalCategoryName0={setSelectedHorizontalCategoryName0}
                                          setfileredHorizontalCatCombo0={setfileredHorizontalCatCombo0}
                                          setSelectedHorizontalCategoryIDLevel1={setSelectedHorizontalCategoryIDLevel1}
                                          setSelectedVerticalCategoryIDLevel1={setSelectedVerticalCategoryIDLevel1}
                                          setHorizontalcategoryOptionsLevel1={setHorizontalcategoryOptionsLevel1}
                                          setVerticalCategoryOptionsLevel1={setVerticalCategoryOptionsLevel1} 
                                          selectedHorizontalCategoryID0={selectedHorizontalCategoryID0}
                                          loadedProject={loadedProject}
                                          selectedDirectClickTabDE={selectedDirectClickTabDE}
                                          setdictfileredHorizontalCatComboLevel1={setdictfileredHorizontalCatComboLevel1}
                                          editMode={editMode}
                                          fileredHorizontalCatComboLevel1={fileredHorizontalCatComboLevel1}
                                          isHorizontalCategoryExpanded0={isHorizontalCategoryExpanded0}
                                          setfileredVerticalCatComboLevel2={setfileredVerticalCatComboLevel2}
                                          setVerticalCategoryOptionsLevel2={setVerticalCategoryOptionsLevel2}
                                          setSelectedVerticalCategoryIDLevel2={setSelectedVerticalCategoryIDLevel2}
                                          setCategoryComboNameID={setCategoryComboNameID}
                                          setCategoryChecker={setCategoryChecker}
                                          setDataElementCatLenght={setDataElementCatLenght}

                                          

                                      />;
                              }
                          })()}
                          {selectedHorizontalCategoryID0 !== null && (
                          <div className={classes.transferContainer}>
                              <HorizontalTransfer 
                              fileredHorizontalCatCombo0={fileredHorizontalCatCombo0}
                              setdictfileredHorizontalCatCombo0={setdictfileredHorizontalCatCombo0}
                              loadedProject={loadedProject}
                              selectedDataElementId={selectedDataElementId}
                              editMode={editMode}
                              isHorizontalCategoryExpanded0={isHorizontalCategoryExpanded0}
                              
                              />
                          </div>
                          )}
                      </div>


                  </div>



                  {/* Select Horizontal Category and Transfer Level 1 */}
                  <button className={classes.collapsible} onClick={() => setIsHorizontalCategoryExpandedLevel1((prev) => !prev)} disabled={selectedDataElementId.length <= 0}>
                      {isHorizontalCategoryExpandedLevel1 ? '-' : '+'} Level 2
                  </button>
                  <div className={classes.baseMargin}>
                      <div className={`${classes.content} ${isHorizontalCategoryExpandedLevel1 ? classes.active : ''}`}>
                          <h3></h3>

                          {fileredHorizontalCatCombo0.length > 0 && (
                            
                              <HorizontalCategoryLevel1 

                                    fileredHorizontalCatComboLevel1={fileredHorizontalCatComboLevel1} 
                                    setSelectedHorizontalCategoryNameLevel1={setSelectedHorizontalCategoryNameLevel1}
                                    setSelectedHorizontalCategoryIDLevel1={setSelectedHorizontalCategoryIDLevel1}
                                    setHorizontalcategoryOptionsLevel1={setHorizontalcategoryOptionsLevel1}
                                    setfileredVerticalCatComboLevel1={setfileredVerticalCatComboLevel1}
                                    fileredVerticalCatComboLevel1={fileredVerticalCatComboLevel1}
                                    setVerticalCategoryOptionsLevel1={setVerticalCategoryOptionsLevel1}
                                    setdictfileredVerticalCatComboLevel1={setdictfileredVerticalCatComboLevel1}
                                    isHorizontalCategoryExpandedLevel1={isHorizontalCategoryExpandedLevel1}
                                    loadedProject={loadedProject}
                                    selectedDataElementId={selectedDataElementId}
                                    fileredHorizontalCatCombo0={fileredHorizontalCatCombo0}
                                    editMode={editMode}
                                    
                              />
                          )}
                          {typeof selectedHorizontalCategoryIDLevel1 === 'string' && selectedHorizontalCategoryIDLevel1.length >0 && (
                          <div className={classes.transferContainer}>
                              <HorizontalTransferLevel1 
                                  fileredHorizontalCatComboLevel1={fileredHorizontalCatComboLevel1}     
                                  selectedHorizontalCategoryIDLevel1={selectedHorizontalCategoryIDLevel1}
                                  setHorizontalcategoryOptionsLevel1={setHorizontalcategoryOptionsLevel1}
                                  HorizontalCategoryOptionsLevel1={HorizontalCategoryOptionsLevel1}
                                  setdictfileredHorizontalCatComboLevel1={setdictfileredHorizontalCatComboLevel1}                                 
                                  loadedProject={loadedProject}
                                  selectedDataElementId={selectedDataElementId}
                                  editMode={editMode}
                              />
                          </div> 

                          )}                             
                      </div>
                  </div>
                  <button className={classes.collapsible} onClick={() => setIsVerticalCategoryExpandedlevel1((prev) => !prev)} disabled={selectedDataElementId.length <= 0}>
                      {isVerticalCategoryExpandedlevel1 ? '-' : '+'} Level 3
                  </button>
                  <div className={classes.baseMargin}>
                      <div className={`${classes.content} ${isVerticalCategoryExpandedlevel1 ? classes.active : ''}`}>
                          <h3></h3>

                          {fileredVerticalCatComboLevel1.length > 0 && (
                              <VerticalCategoryLevel1
                              fileredVerticalCatComboLevel1={fileredVerticalCatComboLevel1}
                              setfileredVerticalCatComboLevel2={setfileredVerticalCatComboLevel2} 
                              setSelectedVerticalCategoryNameLevel1={setSelectedVerticalCategoryNameLevel1}
                              setSelectedVerticalCategoryIDLevel1={setSelectedVerticalCategoryIDLevel1}
                              setVerticalCategoryOptionsLevel1={setVerticalCategoryOptionsLevel1}
                              setdictfileredVerticalCatComboLevel2={setdictfileredVerticalCatComboLevel2}
                              loadedProject={loadedProject}
                              editMode={editMode}
                              selectedDataElementId={selectedDataElementId}
                              isVerticalCategoryExpandedlevel1={isVerticalCategoryExpandedlevel1}
                              
                              />
                          )}
                          {typeof selectedVerticalCategoryIDLevel1 === 'string' && selectedVerticalCategoryIDLevel1.length >0 && (
                          <div className={classes.transferContainer}>
                              <VerticalTransferLevel1
                                  fileredVerticalCatComboLevel1={fileredVerticalCatComboLevel1}     
                                  selectedVerticalCategoryIDLevel1={selectedVerticalCategoryIDLevel1}
                                  setVerticalCategoryOptionsLevel1={setVerticalCategoryOptionsLevel1}
                                  verticalCategoryOptionsLevel1={verticalCategoryOptionsLevel1}
                                  setdictfileredVerticalCatComboLevel1={setdictfileredVerticalCatComboLevel1}
                                  loadedProject={loadedProject}
                                  selectedDataElementId={selectedDataElementId}
                                  editMode={editMode}
                                                     
                              />
                          </div> 

                          )}                             
                      </div>
                  </div>
                  {/* {(categoryChecker[0] === 'notExist') && (editMode) && (<button onClick={() => setCategoryChecker1((prev) => !prev)}>
                      {isCategoryChecker1 ? '-' : '+'} 
                  </button>)} */}

                <button className={classes.collapsible} onClick={() => setIsVerticalCategoryExpandedlevel2((prev) => !prev)} disabled={selectedDataElementId.length <= 0}>
                      {isVerticalCategoryExpandedlevel2 ? '-' : '+'} Level 4
                  </button>
                {isVerticalCategoryExpandedlevel2 && (<div className={classes.baseMargin}>
                        <div className={`${classes.content} ${isVerticalCategoryExpandedlevel2 ? classes.active : ''}`}>
                            <h3></h3>

                            {fileredVerticalCatComboLevel2.length > 0 && (
                                <VerticalCategoryLevel2
                                fileredVerticalCatComboLevel2={fileredVerticalCatComboLevel2} 
                                setSelectedVerticalCategoryNameLevel2={setSelectedVerticalCategoryNameLevel2}
                                setSelectedVerticalCategoryIDLevel2={setSelectedVerticalCategoryIDLevel2}
                                setVerticalCategoryOptionsLevel2={setVerticalCategoryOptionsLevel2}
                                selectedVerticalCategoryIDLevel1={selectedVerticalCategoryIDLevel1}
                                loadedProject={loadedProject}
                                selectedDataElementId={selectedDataElementId}
                                isVerticalCategoryExpandedlevel2={isVerticalCategoryExpandedlevel2}
                                selectedDirectClickTabDE={selectedDirectClickTabDE}
                                setfileredVerticalCatComboLevel3={setfileredVerticalCatComboLevel3}

                                />
                            )}

                            {typeof selectedVerticalCategoryIDLevel2 === 'string' && selectedVerticalCategoryIDLevel2.length >0 && isVerticalCategoryExpandedlevel2 && (
                            <div className={classes.transferContainer}>
                                <VerticalTransferLevel2
                                    fileredVerticalCatComboLevel2={fileredVerticalCatComboLevel2}     
                                    selectedVerticalCategoryIDLevel2={selectedVerticalCategoryIDLevel2}
                                    setVerticalCategoryOptionsLevel2={setVerticalCategoryOptionsLevel2}
                                    VerticalCategoryOptionsLevel2={VerticalCategoryOptionsLevel2}
                                    setdictfileredVerticalCatComboLevel2={setdictfileredVerticalCatComboLevel2}
                                    loadedProject={loadedProject}
                                    selectedDataElementId={selectedDataElementId}
                                    editMode={editMode}                   
                                />
                            </div> 

                            )}                             
                        </div>
                  </div>
                  )}
                 {/* <h3></h3>
                  {(categoryChecker[1] === 'notExist') && (editMode) && (<Button onClick={() => setCategoryChecker2((prev) => !prev)}>
                      {isCategoryChecker2 ? '-' : '+'} 
                  </Button>)} */}
	
                        <h3></h3>

                    <button className={classes.collapsible} onClick={() => setIsVerticalCategoryExpandedlevel3((prev) => !prev)} disabled={selectedDataElementId.length <= 0}>
                      {isVerticalCategoryExpandedlevel3 ? '-' : '+'} Level 5
                  </button>




                {isVerticalCategoryExpandedlevel3 && (
                  <div className={classes.baseMargin}>
                      <div className={`${classes.content} ${isVerticalCategoryExpandedlevel3 ? classes.active : ''}`}>
                      <h3></h3>
                          {fileredVerticalCatComboLevel3.length > 0 && (
                              <VerticalCategoryLevel3
                              fileredVerticalCatComboLevel3={fileredVerticalCatComboLevel3} 
                              setSelectedVerticalCategoryNameLevel3={setSelectedVerticalCategoryNameLevel3}
                              setSelectedVerticalCategoryIDLevel3={setSelectedVerticalCategoryIDLevel3}
                              setVerticalCategoryOptionsLevel3={setVerticalCategoryOptionsLevel3}
                              selectedVerticalCategoryIDLevel2={selectedVerticalCategoryIDLevel2}
                              loadedProject={loadedProject}
                              selectedDataElementId={selectedDataElementId}
                              isVerticalCategoryExpandedlevel3={isVerticalCategoryExpandedlevel3}
                              selectedDirectClickTabDE={selectedDirectClickTabDE}
                              setfileredVerticalCatComboLevel4={setfileredVerticalCatComboLevel4}
                              fileredVerticalCatComboLevel4={fileredVerticalCatComboLevel4}                           
                 
                  

                              />
                        )}

                        {typeof selectedVerticalCategoryIDLevel3 === 'string' && selectedVerticalCategoryIDLevel3.length >0 && isVerticalCategoryExpandedlevel3 && (
                            <div className={classes.transferContainer}>
                                <VerticalTransferLevel3                          
                                    VerticalCategoryOptionsLevel3={VerticalCategoryOptionsLevel3}
                                    fileredVerticalCatComboLevel3={fileredVerticalCatComboLevel3}
                                    selectedDataElementId={selectedDataElementId}
                                    loadedProject={loadedProject}
                                    isVerticalCategoryExpandedlevel3={isVerticalCategoryExpandedlevel3}
                                    setdictfileredVerticalCatComboLevel3={setdictfileredVerticalCatComboLevel3}
                                    selectedDirectClickTabDE={selectedDirectClickTabDE}
                                    selectedVerticalCategoryIDLevel3={selectedVerticalCategoryIDLevel3}
                                    editMode={editMode}
                                    setVerticalCategoryOptionsLevel3={setVerticalCategoryOptionsLevel3}
                                />

                        </div> 

                        )}       
                      </div>
                  </div>
                  )}

                    <h3></h3>

                    <button className={classes.collapsible} onClick={() => setIsVerticalCategoryExpandedlevel4((prev) => !prev)} disabled={selectedDataElementId.length <= 0}>
                    {isVerticalCategoryExpandedlevel4 ? '-' : '+'} Level 6
                    </button>


                {isVerticalCategoryExpandedlevel4 && (
                  <div className={classes.baseMargin}>
                      <div className={`${classes.content} ${isVerticalCategoryExpandedlevel4 ? classes.active : ''}`}>
                      <h3>{isVerticalCategoryExpandedlevel4}</h3>
                          {fileredVerticalCatComboLevel4.length > 0 && (
                              <VerticalCategoryLevel4
                              fileredVerticalCatComboLevel4={fileredVerticalCatComboLevel4} 
                              setSelectedVerticalCategoryNameLevel4={setSelectedVerticalCategoryNameLevel4}
                              setSelectedVerticalCategoryIDLevel4={setSelectedVerticalCategoryIDLevel4}
                              setVerticalCategoryOptionsLevel4={setVerticalCategoryOptionsLevel4}
                              selectedVerticalCategoryIDLevel3={selectedVerticalCategoryIDLevel3}
                              loadedProject={loadedProject}
                              selectedDataElementId={selectedDataElementId}
                              isVerticalCategoryExpandedlevel3={isVerticalCategoryExpandedlevel4}
                              selectedDirectClickTabDE={selectedDirectClickTabDE}
                              setfileredVerticalCatComboLevel4={setfileredVerticalCatComboLevel4}
                              isVerticalCategoryExpandedlevel4={isVerticalCategoryExpandedlevel4}
                 
                  

                              />
                          )}

                        {typeof selectedVerticalCategoryIDLevel4 === 'string' && selectedVerticalCategoryIDLevel4.length >0 && isVerticalCategoryExpandedlevel4 && (
                            <div className={classes.transferContainer}>
                                <VerticalTransferLevel4                          
                                    VerticalCategoryOptionsLevel4={VerticalCategoryOptionsLevel4}
                                    fileredVerticalCatComboLevel3={fileredVerticalCatComboLevel3}
                                    fileredVerticalCatComboLevel4={fileredVerticalCatComboLevel4}
                                    selectedDataElementId={selectedDataElementId}
                                    loadedProject={loadedProject}
                                    isVerticalCategoryExpandedlevel4={isVerticalCategoryExpandedlevel4}
                                    setdictfileredVerticalCatComboLevel4={setdictfileredVerticalCatComboLevel4}
                                    selectedDirectClickTabDE={selectedDirectClickTabDE}
                                    selectedVerticalCategoryIDLevel4={selectedVerticalCategoryIDLevel4}
                                    editMode={editMode}
                                    setVerticalCategoryOptionsLevel4={setVerticalCategoryOptionsLevel4}
                                />

                        </div> 

                        )}       
                      </div>
                  </div>
                  )}




            </div>
        
        
        </div>
        
        )}
    

        {selectedTab === 'template-configuration' && (
        <div className={classes.tableContainer_dataElements}>
        <div className={`${classes.mainSection} ${classes.customSelectpanel}`}>
                <div className={classes.customImageContainer} onClick={handleTemplateRefreshClick}>
                    {customImage('sync', 'large')}
                </div>
                <Table className={classes.dataTable}>
                        <TableHead>
                        <TableRowHead>
                            <TableCellHead className={classes.customTableCellHead}>
                                Template
                            </TableCellHead>
                            <TableCellHead>Actions</TableCellHead>
                        </TableRowHead>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(TemplateList || []) &&
                            TemplateList.map((template) => (
                                // Check if navigation.dataSet is equal to selectedDataSet
                                template.projectID === loadedProject.id && (
                                    <TableRow key={template.key} className={classes.customTableRow}>
                                        <TableCell className={classes.customTableCell}>{template.name}<br/>{template.catCombo.name}</TableCell>
                                        <TableCell className={`${classes.customTableCell}`}>


                                        <TooltipComponent 
                                        IconType={IconDelete16} 
                                        btnFunc={handleDeleteTemplate}
                                        project={template.key}
                                        dynamicText="Delete"
                                        buttonMode="destructive"
                                        customIcon={true}/>

                                        </TableCell>
                                    </TableRow>
                                )

                            ))}
                        </TableBody>
            </Table>
        </div>
        </div>
        )}

        {selectedTab === 'exclusion-rules' && (
            <div className={classes.tableContainer_dataElements}>
            <div className={`${classes.mainSection} ${classes.customSelectpanel}`}>
                <div className={classes.customImageContainer} onClick={handleExclusionRuleRefreshClick}>
                    {customImage('sync', 'large')}
                </div>
                    <Table className={classes.dataTable}>
                            <TableHead>
                            <TableRowHead>
                                <TableCellHead className={classes.customTableCellHead}>
                                    Exclusion Rules
                                    <span className={classes.iconAdd}  onClick={() => {setExclusionComponents(true)
                                        setSelectedExclusion('xxxxx')                                    
                                    }}>
                                    <IconAddCircle24 />

                                    </span>
                                </TableCellHead>
                                <TableCellHead>Actions</TableCellHead>
                            </TableRowHead>
                            </TableHead>
                            <TableBody>
                            {Array.isArray(loadedRules || []) &&
                                loadedRules.map((exclusion) => (
                                    // Check if navigation.dataSet is equal to selectedDataSet
                                    exclusion.projectID === loadedProject.id && (
                                        <TableRow key={exclusion.key} className={classes.customTableRow}>
                                            <TableCell className={classes.customTableCell}>{exclusion.name}</TableCell>
                                            <TableCell className={`${classes.customTableCell}`}>

                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <TooltipComponent 
                                                IconType={IconEdit16} 
                                                btnFunc={handleEditExclusions}
                                                project={`${exclusion.key}-val:-${exclusion.conditionCoC[0].id}`}
                                                dynamicText="Edit"
                                                buttonMode="secondary"

                                                />
                                                <TooltipComponent 
                                                IconType={IconDelete16} 
                                                btnFunc={handleDeleteExclusion}
                                                project={exclusion.key}
                                                dynamicText="Delete"
                                                buttonMode="destructive"
                                                customIcon={true}/>
                                            </div>
                                            </TableCell>
                                        </TableRow>
                                    )

                                ))}
                            </TableBody>
                </Table>
            </div>
            </div>
        )}

        {selectedTab === 'Labels' && (
            <div className={classes.tableContainer_dataElements}>
            <div className={`${classes.mainSection} ${classes.customSelectpanel}`}>
                <div className={classes.customImageContainer} onClick={handleLabelRefreshClick}>
                    {customImage('sync', 'large')}
                </div>

                    <Table className={classes.dataTable}>
                            <TableHead>
                            <TableRowHead>
                                <TableCellHead className={classes.customTableCellHead}>
                                        Labels
                                    <span className={classes.iconAdd}  onClick={() => setLabelComponents(true)}>
                                    <IconAddCircle24 />

                                    </span>
                                </TableCellHead>

                                <TableCellHead>Actions</TableCellHead>
                            </TableRowHead>
                            </TableHead>
                            <TableBody>
                            {Array.isArray(loadedLabels || []) &&
                                loadedLabels.map((label) => (
                                    // Check if navigation.dataSet is equal to selectedDataSet
                                    label.projectID === loadedProject.id && (
                                        <TableRow key={label.key} className={classes.customTableRow}>
                                            <TableCell className={classes.customTableCell}>
                                            {label.labelName}<br/>
                                            {label.name}</TableCell>

                                            <TableCell className={`${classes.customTableCell}`}>

                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <TooltipComponent 
                                                IconType={IconEdit16} 
                                                btnFunc={handleEditLabel}
                                                project={label.key}
                                                dynamicText="Edit"
                                                buttonMode="secondary"

                                            />
                                                <TooltipComponent 
                                                IconType={IconDelete16} 
                                                btnFunc={handleDeleteLabel}
                                                project={label.key}
                                                dynamicText="Delete"
                                                buttonMode="destructive"
                                                customIcon={true}/>
                                            </div>
                                            </TableCell>
                                        </TableRow>
                                    )

                                ))}
                            </TableBody>
                </Table>
            </div>
            </div>
        )}
        </ModalContent>
            {(selectedTab !== 'dataElemenent-configuration') && (
                        

                        <ModalActions>                    

                            <div className={classes.baseMargin}>
                                <ButtonStrip>
                                <Button onClick={() => handleCloseModal()}>Close</Button>

                                <Button
                            primary
                            onClick={() => handleSaveToConfiguration('save-order')}
                            disabled={!saveNow}
                            >
                            Save
                            </Button>

                                <Button 
                                    onClick={loadedProject.dataElements.length > 0 ? GenerateHTMLHandler : undefined}
                                    disabled={(loadedProject.dataElements.length <= 0) || saveNow}
                                >
                                    Generate DataEntry Form
                                </Button>
                                </ButtonStrip>
                            </div>

                        </ModalActions>


            )}
          {selectedTab === 'dataElemenent-configuration' && (
            

                    <ModalActions>                    

                        <div className={classes.baseMargin}>
                            <ButtonStrip>
                            <Button onClick={() => handleCloseModal()}>Close</Button>
                            <Button
                                    primary
                                    onClick={() => handleSaveToConfiguration('save')}
                                    disabled={
                                        (() => {
                                            switch (dataElementCatLenght) {
                                                case 0:
                                                    return true;
                                                case 1:
                                                    return isHorizontalCategoryExpanded0 === false;
                                                case 2:
                                                    return isHorizontalCategoryExpandedLevel1 === false;
                                                case 3:
                                                    return isVerticalCategoryExpandedlevel1 === false;
                                                case 4:
                                                    return isVerticalCategoryExpandedlevel2 === false;
                                                case 5:
                                                    return isVerticalCategoryExpandedlevel3 === false;
                                                case 6:
                                                        return isVerticalCategoryExpandedlevel4 === false;
                                                default:
                                                    return true;
                                            }
                                        })()
                                    }
                                >

                                    Save
                                </Button>


                            <Button primary  onClick={() => handleSaveTemplate()}
                            
                            
                            disabled={
                                (() => {
                                    switch (dataElementCatLenght) {
                                        case 0:
                                            return true;
                                        case 1:
                                            return isHorizontalCategoryExpanded0 === false;
                                        case 2:
                                            return isHorizontalCategoryExpandedLevel1 === false;
                                        case 3:
                                            return isVerticalCategoryExpandedlevel1 === false;
                                        case 4:
                                            return isVerticalCategoryExpandedlevel2 === false;
                                        case 5:
                                            return isVerticalCategoryExpandedlevel3 === false;
                                        case 6:
                                                return isVerticalCategoryExpandedlevel4 === false;
                                        default:
                                            return true;
                                    }
                                })()
                            }
                            >
                                Save and Make CoC Template
                            </Button>
                            <Button 
                                    onClick={loadedProject.dataElements.length > 0 ? GenerateHTMLHandler : undefined}
                                    disabled={(loadedProject.dataElements.length <= 0) || saveNow }
                                >
                                    Generate DataEntry Form
                                </Button>
                            </ButtonStrip>
                        </div>

                    </ModalActions>


          )}




            {/* Modal for entering the template name */}
            {showTemplateNameModal && (
                <Modal>
                    <ModalTitle>Enter Template Name</ModalTitle>
                    <ModalContent>
                        <input
                            type="text"
                            placeholder="Template Name"
                            value={templateName}
                            onChange={handleTemplateNameChange}
                        />
                    </ModalContent>
                    <ModalActions>
                        <ButtonStrip>
                            <Button onClick={handleCloseTemplateNameModal}>Cancel</Button>
                            <Button
                                primary
                                onClick={() => {
                                    handleSaveToConfiguration('saveTemplate', templateName);
                                    handleCloseTemplateNameModal();
                                }}
                            >
                                Save CoC Template
                            </Button>


                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
            


            {/* Modal for Exclusion Rules */}
            {showExclusionComponents && (

                <ExclusionRuleComponent
                    loadedProjectCombos={loadedProject.catCombos}
                    loadedProjectDataElements={loadedProject.dataElements.map(({ id, name }) => ({ id, name }))}
                    editExclusionMode={editExclusionMode}
                    conditionName={conditionName}
                    setConditionName={setConditionName}
                    conditionDE={conditionDE}
                    conditionCoC={conditionCoC}
                    setConditionCoC={setConditionCoC}
                    setConditionDE={setConditionDE}
                    selectedConditionLevel={selectedConditionLevel}
                    handleConditionLevelChange={handleConditionLevelChange}
                    exclude={exclude}
                    setExclusion={setExclusion}
                    setExclusion2={setExclusion2}
                    selectedExclusionLevel={selectedExclusionLevel}
                    handleExclusionLevelChange={handleExclusionLevelChange}
                    exclusionLevels={exclusionLevels}
                    handleCloseExclusionModal={handleCloseExclusionModal}
                    handleCreateExclusion={handleCreateExclusion}
                    selectedExclusion={selectedExclusion}
                    setSelectedConditionLevel={setSelectedConditionLevel}
                    setSelectedExclusionLevel={setSelectedExclusionLevel}
                    setSelectedExclusionMetadataOption={setSelectedExclusionMetadataOption}
                    selectedExclusionMetadataOption={selectedExclusionMetadataOption}
                    handleSelectedExclusionCoC={handleSelectedExclusionCoC}
                    handleSelectedExclusionDE={handleSelectedExclusionDE}
                    setCategoryExclusion={setCategoryExclusion}
                    setCategoryExclusion2={setCategoryExclusion2}
                    categoryExclusion={categoryExclusion}
                    setCategoryExclusionToProcess={setCategoryExclusionToProcess}
                    // categoryExclusionToProcess={categoryExclusionToProcess}
                    excludeToProcess={excludeToProcess}
                    setExclusionToProcess={setExclusionToProcess}
                    handleSelectedExclusionCategory={handleSelectedExclusionCategory}
                    handleSelectedExclusionCategoryToProcess={handleSelectedExclusionCategoryToProcess}
                    setConditionCOIDName={setConditionCOIDName}
                    setConditionCOIDName2={setConditionCOIDName2}
                    setConditionCoCIDName={setConditionCoCIDName}
                    setConditionDEIDName={setConditionDEIDName}
                    selectedExclusionEditInit={selectedExclusionEditInit}
                    handleSelectedExclusionCategory2={handleSelectedExclusionCategory2}

                />

            )}


            {/* Modal for Form Name */}
            {showLabelComponents && (
                
                <LabelComponent 
                    loadedProjectCombos={loadedProject.catCombos}
                    loadedProjectDataElements={loadedProject.dataElements.map(({ id, name }) => ({ id, name }))}
                    selectedLabel={selectedLabel}
                    editLabelMode={editLabelMode}                
                    selectedMetadataOption={selectedMetadataOption}
                    setSelectedMetadataOption={setSelectedMetadataOption}
                    conditionLevels={conditionLevels}
                    metadataName={metadataName}
                    setMetadataName={setMetadataName}
                    setMetadataName2={setMetadataName2}
                    setMetadataName3={setMetadataName3}
                    labelName={labelName}
                    setLabelName={setLabelName}
                    handleCloseLabelModal={handleCloseLabelModal}
                    handleCreateLabel={handleCreateLabel}
                    setLabelDEIDName={setLabelDEIDName}
                    setLabelComboIDName={setLabelComboIDName}
                    setLabelCategoryIDName={setLabelCategoryIDName}
                    setLabelCategoryIDName2={setLabelCategoryIDName2}
                    setLabelCategoryIDName3={setLabelCategoryIDName3}
                    setLabelOptionIDName={setLabelOptionIDName}       
                    setLabelOptionIDName2={setLabelOptionIDName2}
                    setLabelOptionIDName3={setLabelOptionIDName3}                
                
                />
            )}
            {/* Modal for Creating Side Navigation */}
            {showSideNavigationForm && (
                <Modal>
                <ModalTitle>Create Side Navigation</ModalTitle>
                <ModalContent>
                    {/* Add content for Side Navigation */}
                    <div>

                        <Input
                              name="SideNavigation"
                              placeholder="Create Side Navigation"
                              value={sideNavigationName}
                              onChange={({ value }) => setSideNavigationName(value)}
                          />

                    </div>
                </ModalContent>
                <ModalActions>
                    <ButtonStrip>
                    <Button onClick={handleCloseSideandFormNavigationModal}>Cancel</Button>
                    {/* Add save changes logic here */}
                    <Button primary onClick={handleCreateSideNavigation}>Create Side Navigation
                    
                    

                    </Button>
                    </ButtonStrip>
                </ModalActions>
                </Modal>
            )}

            {/* Modal for Creating form Component */}
            {showFormComponents && (
                <Modal>
                <ModalTitle>Create Form Components</ModalTitle>
                <ModalContent>
                    {/* Add content for Form Component */}
                    <div>

                        <Input
                              name="FormComponent"
                              placeholder="Create Form Component"
                              value={formComponentName}
                              onChange={({ value }) => setFormComponentName(value)}
                          />

                    </div>
                </ModalContent>
                <ModalActions>
                    <ButtonStrip>
                    <Button onClick={handleCloseSideandFormNavigationModal}>Cancel</Button>
                    {/* Add save changes logic here */}
                    <Button primary onClick={handleCreateFormComponent}>
                        Create Form Component                 
                    

                    </Button>
                    </ButtonStrip>
                </ModalActions>
                </Modal>
            )}
            
            {/* Modal for generating Custom Form */}
            {showGenerateForm && 
                (<GenerateForm 
                    engine={props.engine}
                    loadedProject={loadedProject}
                    setShowGenerateForm={setShowGenerateForm}
                    loadedRules={loadedRules}
                    loadedLabels={loadedLabels}
                    showGenerateForm={showGenerateForm}
                    />                    
            )}
    </Modal>

    
  );
};

export default ConfigureMetadata;
