import { useDataQuery } from '@dhis2/app-runtime'
import { SingleSelect, SingleSelectOption  } from '@dhis2-ui/select'
import React, { useState, useEffect } from 'react';
import AppGetDEList from '../AppGetDEList'
import HorizontalCategory from './HorizontalCategory'
import HorizontalCategoryLevel1 from './HorizontalCategoryLevel1'
import VerticalCategoryLevel1 from './VerticalCategoryLevel1'
import VerticalCategoryLevel2 from './VerticalCategoryLevel2'
import VerticalCategoryLevel3 from './VerticalCategoryLevel3'
import HorizontalTransfer from './HorizontalTransfer'
import HorizontalTransferLevel1 from './HorizontalTransferLevel1';
import VerticalTransferLevel1 from './VerticalTransferLevel1';
import VerticalTransferLevel2 from './VerticalTransferLevel2';
import VerticalTransferLevel3 from './VerticalTransferLevel3';
import MetadataTemplating from './MetadataTemplating';
import GenerateForm from './GenerateForm';
import TooltipComponent from './TooltipComponent'
import { Input } from '@dhis2-ui/input'
import { IconEdit16, IconDelete16, IconAddCircle24} from '@dhis2/ui-icons';
import { modifiedDate } from '../utils';
import SideNavigation from './SideNavigationSelection';
import FormComponentSelection from './FormComponentSelection';




import { 
    Modal, 
    ModalTitle, 
    ModalContent, 
    ModalActions, 
    ButtonStrip, 
    Button
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
    exclusionRuleFilter,
    conditionLevels,
    exclusionLevels} from '../consts'
import { generateRandomId } from '../utils';

  

const ConfigureMetadata = (props) => {

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
        resource: `dataStore/${config.dataStoreSideNavigations}?${sideNavigationFilter}`,
        },
    }

    // Define your data store query
    const FormComponentQuery = {
        dataStore: {
        resource: `dataStore/${config.dataStoreFormComponents}?${formComponentFilter}`,
        },
    }

    // Define your data store query
    const TemplateQuery = {
        dataStore: {
        resource: `dataStore/${config.dataStoreTemplates}?${TemplateFilter}`,
        },
    }

    // Define your data store query
    const ConditionQuery = {
        dataStore: {
        resource: `dataStore/${config.dataStoreConditions}?${exclusionRuleFilter}`,
        },
    }
    
    // To hold pre-loaded data from dataStore
    const [loadedProject, setLoadedProject] = useState(props.selectedProject || []);

    // for data control
    const [isAferProjectSave, AferProjectSave] = useState(false);

    // saving dataelement state
    const [savingDataElement, setSavingDataElementState] = useState(false);

    // dataElement refresh button
    const [refreshing, setRefreshing] = useState(true);

    // Saving data to dataStore
    const [mergedObject, setmergedObject] = useState([])

    // State control variables
    const [selectedDataSet,setselectedDataSet] = useState(props.selectedDataSet);
    const [selectedDataSetName,setselectedDataSetName] = useState([]);
    const [selectedDataElementId, setSelectedDataElementId] = useState(null);
    const [selectedDataElement, setSelectedDataElement] = useState(null);
    const [selectedDataElementsDict, setSelectedDataElementsDict] = useState(null);
    
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


    // New state for template name
    const [templateName, setTemplateName] = useState('');
    const [showModalMetadataTemplate, setShowModalMetadataTemplate] = useState(false);
    const [showTemplateNameModal , setShowTemplateNameModal] = useState(false);

    // For Exclusion Rules
    const [showExclusionComponents, setExclusionComponents] = useState(false);
    const [condition, setCondition] = useState('');
    const [conditionName, setConditionName] = useState('');
    const [exclude, setExclusion] = useState('');
    const [existingConditionName, setExistingConditionName] = useState(false);
    const [selectedConditionLevel, setSelectedConditionLevel] = useState(""); // State to store the selected level
    const [selectedExclusionLevel, setSelectedExclusionLevel] = useState(""); // State to store the selected level





    // To hold exclusion data from dataStore
    const [loadedRules, setLoadedRules] = useState([]);

    // reloading and state does not matter
    const [reloadExclusions, setReloadExclusions] = useState(false);

  
    // Constants for Horizontal Categories (Level 2 Inner)
    const [fileredHorizontalCatCombo0, setfileredHorizontalCatCombo0] = useState([]);
    const [dictfileredHorizontalCatCombo0, setdictfileredHorizontalCatCombo0] = useState([]); 
    const [selectedHorizontalCategoryID0, setSelectedHorizontalCategoryID0] = useState(null); 
    const [selectedHorizontalCategoryName0, setSelectedHorizontalCategoryName0] = useState(null); 
    const [isHorizontalCategoryExpanded0, setIsHorizontalCategoryExpanded0] = useState(false); 

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


    // Constants for Vertical Categories (Level 2 Outer)
    const [selectedVerticalCategoryIDLevel3, setSelectedVerticalCategoryIDLevel3] = useState(null);
    const [selectedVerticalCategoryNameLevel3, setSelectedVerticalCategoryNameLevel3] = useState(null);
    const [dictfileredVerticalCatComboLevel3, setdictfileredVerticalCatComboLevel3] = useState([]);
    const [isVerticalCategoryExpandedlevel3, setIsVerticalCategoryExpandedlevel3] = useState(false);
    const [VerticalCategoryOptionsLevel3, setVerticalCategoryOptionsLevel3] = useState([]);
    const [fileredVerticalCatComboLevel3, setfileredVerticalCatComboLevel3] = useState([]);

    const [isDataSetsExpanded, setIsDataSetsExpanded] = useState(false);
    const [isDataElementExpanded, setIsDataElementExpanded] = useState(false);
   
    
    const [selectedSideNavigation,setSelectSideNavigation] = useState(null);
    const [selectedFormComponents,setSelectFormComponents] = useState(loadedProject.formComponent);

    {/* useDataQuery(query) loader */}
    const { loading: loading1, error: error1, data: data1 } = useDataQuery(query);
    const { loading: loadingAfterSave, error: ErrorAfterSave, data: dataAfterSave, refetch} = useDataQuery(dataStoreQuery);     
    const { data: SideNavigationQueryData, refetch:SideNavigationQueryrefetch } = useDataQuery(SideNavigationQuery); // Use separate hook for dataStoreQuery
    const { data: FormComponentQueryData, refetch:FormComponentQueryrefetch } = useDataQuery(FormComponentQuery); // Use separate hook for dataStoreQuery
    const { data: TemaplateQueryData, refetch:TemaplateQueryrefetch } = useDataQuery(TemplateQuery); // Use separate hook for dataStoreQuery
    const { data: ConditionsQueryData, refetch:ConditionsQueryDataRefetch } = useDataQuery(ConditionQuery); // Use separate hook for dataStoreQuery

if (ConditionsQueryData){
console.log(ConditionsQueryData)

}

    // useEffect(() => {
    //     ConditionsQueryDataRefetch();
    // }, [reloadExclusions, ConditionsQueryDataRefetch]);


    useEffect(() => {
        ConditionsQueryDataRefetch();
        if (ConditionsQueryData) {
          // setProjects(data.dataStore ? [data.dataStore] : []);
    
              // Check if entries property exists in data.dataStore
            const newExclusion = ConditionsQueryData.dataStore?.entries.filter(entry => entry.projectID === loadedProject.id) || [];
            setLoadedRules(newExclusion);
        }
      }, [ConditionsQueryData, reloadExclusions, ]);



    useEffect(() => {
        refetch();
    }, [isAferProjectSave, refetch, refreshing]);

    useEffect(() => {
        if (dataAfterSave) {

            const newProjects = dataAfterSave?.dataStore || [];
            setLoadedProject(newProjects)
            // setSelectSideNavigation(newProjects.sideNavigation)
            // setSelectFormComponents(newProjects.formComponent)
        }        
    }, [dataAfterSave, isAferProjectSave]);

    if (ErrorAfterSave){

        console.log(ErrorAfterSave)
    }

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
            

            console.log('Processing: clearConstants() ' + savingDataElement)
        }  
    }, [editMode, savingDataElement]);

    const clearConstants = () =>{
        
        setSelectedDataElement('');
        setSelectedDataElementId('');
        handleDataElementChange()
        setEditMode(false)
        setSelectedDataElementsDict(null)
        setSelectSideNavigation(null);
        setSelectFormComponents(null);

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

        setSelectSideNavigation(null);
        setSelectFormComponents(null);

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

    },[selectedHorizontalCategoryIDLevel1])


    useEffect(() => {

                // Constants for Vertical Categories (Level 1 Outer)
                setSelectedVerticalCategoryIDLevel2(null);
                setSelectedVerticalCategoryNameLevel2(null);
                setdictfileredVerticalCatComboLevel2([]);
                setIsVerticalCategoryExpandedlevel2(false);
                setVerticalCategoryOptionsLevel2([]);
                //setfileredVerticalCatComboLevel2([]);

                
        // Constants for Vertical Categories (Level 3 Outer)
                setSelectedVerticalCategoryIDLevel3(null);
                setSelectedVerticalCategoryNameLevel3(null);
                setdictfileredVerticalCatComboLevel3([]);
                setIsVerticalCategoryExpandedlevel3(false);
                setVerticalCategoryOptionsLevel3([]);
                setfileredVerticalCatComboLevel3([]);

    },[selectedVerticalCategoryIDLevel1])


    useEffect(() => {
        // Constants for Vertical Categories (Level 3 Outer)
        setSelectedVerticalCategoryIDLevel3(null);
        setSelectedVerticalCategoryNameLevel3(null);
        setdictfileredVerticalCatComboLevel3([]);
        setIsVerticalCategoryExpandedlevel3(false);
        setVerticalCategoryOptionsLevel3([]);
        // setfileredVerticalCatComboLevel3([]);

        },[selectedVerticalCategoryIDLevel2])




    useEffect(() => {
        if (SideNavigationQueryData?.dataStore) {
              // Now you can safely access dataStoreData.dataStore


              if (SideNavigationQueryData?.dataStore?.entries){
    

    
                const navigationExists = (navigationToCheck) => {
                    const sideNavigationNameArray = SideNavigationQueryData.dataStore?.entries || [];
                    
                    return sideNavigationNameArray.some(navigation => 
                        navigation.sideNavName.toLowerCase() === navigationToCheck.toLowerCase() &&
                        navigation.projectID.toLowerCase() === loadedProject.id.toLowerCase()
                    );
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
                        
                        return formComponentNameArray.some(form_component => 
                            form_component.formComponentName.toLowerCase() === FormComponentToCheck.toLowerCase() &&
                            form_component.projectID.toLowerCase() === loadedProject.id.toLowerCase()
                        );
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
                  
                  return conditionNameArray.some(condition => 
                    condition.name.toLowerCase() === conditionNameToCheck.replace(/\s+/g, '').toLowerCase() &&
                    condition.projectID.toLowerCase() === loadedProject.id.toLowerCase()
                  );
              };
              setExistingConditionName(conditionExists(conditionName))
            }
  
          } else {
            console.error('Data structure does not match the expected format');
          }

    },[conditionName]);

    // Function to toggle the state
    const toggleSavingDataElementState = () => {
                // Set the state to true
        setSavingDataElementState(true);
        setSavingDataElementState(currentState => !currentState); // Negate the current state
    };

    const updateDataStore = async (postObject) =>{

        try {
            await props.engine.mutate({
              resource: `dataStore/${config.dataStoreName}/${postObject.key}`,
              type: 'update',
              data: postObject,
            });


          } catch (error) {
            // Handle error (log, show alert, etc.)
            console.error('Error updating project:', error);
          }

        //update project saving state
        toggleSavingDataElementState()

    }
    /** Prepare data to Update DHIS2 Object */
    const handleSaveToConfiguration = async (action, templateName = '') => {
        if (selectedDataElementId !== null 
            && selectedDataElement !== null
            && selectedHorizontalCategoryID0 !== null) {
                            
                // console.log('Configuation dictfileredHorizontalCatCombo0')
                // console.log(dictfileredHorizontalCatCombo0)
                // console.log('Configuation dictfileredHorizontalCatComboLevel1')
                // console.log(dictfileredHorizontalCatComboLevel1)
                // console.log('Configuation dictfileredVerticalCatComboLevel1')
                // console.log(dictfileredVerticalCatComboLevel1)
                // console.log('Configuation dictfileredVerticalCatComboLevel2')
                // console.log(dictfileredVerticalCatComboLevel2)
                // console.log('Configuation selectedSideNavigation')
                // console.log(selectedSideNavigation)
                // console.log('Configuation selectedFormComponents')
                // console.log(selectedFormComponents)               
                const projectData = {
                    "dataElements":[        
                        {
                        "id":selectedDataElementId, 
                        "name":selectedDataElement,
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

                
                // Find the index of the dataElement with the matching id in loadedProject.dataElements
                const indexToUpdate = loadedProject.dataElements.findIndex(element => element.id === selectedDataElementId);

                // If the index is found, replace the object at that index with the corresponding object from projectData.dataElements
                if (indexToUpdate !== -1) {
                    const updatedDataElements = [...loadedProject.dataElements];
                    updatedDataElements[indexToUpdate] = projectData.dataElements.find(element => element.id === selectedDataElementId);

                    updateDataStore({
                        ...loadedProject,
                        ...projectData,
                        dataElements: updatedDataElements,
                    })
                } else {

                    updateDataStore({
                        ...loadedProject,
                        ...projectData,
                        dataElements: [...loadedProject.dataElements, ...projectData.dataElements],
                    })

                }

                if (action === 'saveTemplate'){    
                    const Templateid = generateRandomId();  
                            // Remove spaces from projectName
                    const trimmedTemplateName = templateName.replace(/\s+/g, '');
       
                    const TemplateData =  {
                        "id":Templateid,
                        "key": templateName+'-'+Templateid,
                        "name":templateName,
                        "projectID":loadedProject.id,
                        "catCombo":fileredHorizontalCatCombo0[0].id,
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
                        }
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


                openDataElementList()

                setDirectClickTabDE(1);
                                
                    // Close the modal or perform any other actions upon success
                    //handleCloseModal();
        }else{

            console.log('No record was saved. No DataElement Selected')

        }
        // Activate refresh button
        setRefreshing(false);
        //update project saving state
        toggleSavingDataElementState()
    }

    // Function to update template name
    const GenerateHTMLHandler  = () => {
            refetch() 
            setShowGenerateForm(true)
    };

    // Function to update template name
    const handleTemplateNameChange = (event) => {
            setTemplateName(event.target.value);
    };
    ["Horizontal Level 1", "Horizontal Level 2", "Vertical Level 1", "Vertical Level 2", "Vertical Level 3"];

    function alignLevels(level){
        if (level === "Horizontal Level 1"){return 'HorizontalLevel0'}
        else if(level === "Horizontal Level 2"){return 'HorizontalLevel1'}
        else if(level === "Vertical Level 1"){return 'verticalLevel1'}
        else if(level === "Vertical Level 2"){return 'verticalLevel2'}
        else if(level === "Vertical Level 3"){return 'verticalLevel3'}
        else {return ''}
    }
    // Function to update Exclusion level
    const handleExclusionLevelChange = (event) => {

        setSelectedExclusionLevel(event.target.value);
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
        setExclusion('');
        setCondition('');
        setConditionName('');
    };

    const handleCreateExclusion = async () => {

        const componentsID = generateRandomId();  
        
        // Remove spaces from const
        const trimmedconditionName= conditionName.replace(/\s+/g, '');
        if (!trimmedconditionName.trim() || !condition || !exclude) {
            console.log('Please enter all rule parameters');
            return;
        }

        if (existingConditionName){
            console.log('Rule Name is not Unique');
            return;
        }

        const conditionData =  {            
            id:componentsID, 
            name:trimmedconditionName,
            condition:condition,
            conditionLevel:alignLevels(selectedConditionLevel),
            exclusion:exclude,
            exclusionLevel:alignLevels(selectedExclusionLevel),
            projectID: loadedProject.id,
            key: `${trimmedconditionName}-${loadedProject.id}`,           
    
        }

        try {
            await props.engine.mutate({
              resource: `dataStore/${config.dataStoreConditions}/${trimmedconditionName}-${loadedProject.id}`,
              type: 'create',
              data: conditionData,
            });
        
            // Close the modal or perform any other actions upon success
            handleCloseExclusionModal();

          } catch (error) {
            // Handle error (log, show alert, etc.)
            console.error('Error saving Excludion Rule:', error);
          }
          ConditionsQueryDataRefetch()
          setReloadExclusions((prev) => !prev); 
    
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
                    sideNavName:trimmedSideNavigationName,                    
                    projectID: loadedProject.id,
                    key: `${trimmedSideNavigationName}-${loadedProject.id}`,           
            
        }

        try {
            await props.engine.mutate({
              resource: `dataStore/${config.dataStoreSideNavigations}/${trimmedSideNavigationName}-${loadedProject.id}`,
              type: 'create',
              data: SideNavigationData,
            });
        
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
                    formComponentName:trimmedFormComponentName,                    
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
        console.log('Checking Closing')
        setSelectedDataElementsDict(null)
        props.setShowModalConfigureProject(false)
        setDirectClickTabDE(0);
        setEditMode(false)      

    };


    
    const handleDeleteSideNavigation = async (KeyID) => {

        try {
          await props.engine.mutate({
            resource: `dataStore/${config.dataStoreSideNavigations}/${KeyID}`,
            type: 'delete',
          });
          console.log(`Side Navigation  "${sideNavigationName}" deleted successfully.`);
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
            console.log(`Form Component  "${sideNavigationName}" deleted successfully.`);
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
            console.log(`Template  "${KeyID}" deleted successfully.`);
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
            console.log(`Exclusion  "${KeyID}" deleted successfully.`);
          //   handleCloseModal(); // Close the modal after successful deletion
  
          } catch (error) {
            console.error('Error deleting Exclusion:', error);
          }
          ConditionsQueryDataRefetch(); // Refetch data after deletion
          // setSelectedProject(null);
          // setShowDeleteModal(false)
          
          console.log('Deleting Exclusion::', KeyID);

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
        console.log(modifiedbject)
        console.log(modifiedbject.key)
        try {
            await props.engine.mutate({
              resource: `dataStore/${config.dataStoreName}/${modifiedbject.key}`,
              type: 'update',
              data: modifiedbject,
            });


          } catch (error) {
            // Handle error (log, show alert, etc.)
            console.error('Error updating project:', error);
          }
        AferProjectSave((prev) => !prev);
            
    }

    const handleEditDataElement = (dataElement) => {
        // testing
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

        setSelectedTab('dataElemenents-table')        
        setEditMode(false)
        setSelectSideNavigation(null);
        setSelectFormComponents(null);

    }
    const newDataElementLaunch = () =>{

        setSelectedTab('dataElemenent-configuration');
        setEditMode(false)
        setDirectClickTabDE(1);
        setSelectSideNavigation(null);
        setSelectFormComponents(null);
        // setSelectedDataElementId(null);


    }
    const handleEditTemplate = (template) => {

        console.log('Handle Edit Template Btn Clicked')
    }

    const handleEditExclusions = (template) => {

        console.log('Handle Exclusion Btn Clicked')
    }
    {/*  useDataQuery(query) exceptions */}
    
    if (error1 ) {
        return <span>ERROR: {error1?.message }</span>;
    }

    if (loading1) {
        return <span>Loading...</span>;
    }
    


  return (
    <Modal fluid onClose={handleCloseModal}>
      <ModalTitle>
        Category Options and Navigations

        </ModalTitle>
          <ModalContent>
          <TabBar>

          <Tab
            label="Existing Data Elements"
            selected={selectedTab === 'dataElemenents-table'}
            onClick={() => {
                openDataElementList()
            }}
          >
            Existing Data Elements
          </Tab>
          <Tab
            label="Configure Data Elements"
            selected={selectedTab === 'dataElemenent-configuration'}
            onClick={() => {
                newDataElementLaunch()


              }}
          >
            Configure Data Elements
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
          >
            Configure Form Components
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
          >
            Templates
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
          >
            Exclusion Rules
          </Tab>
        </TabBar>

        {selectedTab === 'dataElemenents-table' && (
        <div className={classes.tableContainer_dataElements}>
          <div className={`${classes.mainSection} ${classes.customSelectpanel}`}>
          {/* <button onClick={handleRefresh} disabled={refreshing}>
                <IconSync24 className={classes.icon} />
            </button> */}
                  <Table className={classes.dataTable}>
                    <TableHead>
                    <TableRowHead>
                        <TableCellHead>Data Elements

                        <span className={classes.iconAdd}  onClick={() => newDataElementLaunch()}>
                          
                                <IconAddCircle24 />

                                </span>

                        </TableCellHead>
                        <TableCellHead>Actions</TableCellHead>
                    </TableRowHead>
                    </TableHead>
                    <TableBody>
                        {loadedProject.dataElements && loadedProject.dataElements.length > 0 ? (
                            loadedProject.dataElements.map((dataElement) => (
                            <TableRow className={classes.customTableRow} key={dataElement.id}>
                                <TableCell className={classes.customTableCell}>{dataElement.name}</TableCell>
                                <TableCell className={`${classes.customTableCell}`}>
                                {/* <button
                                    className={`${classes.buttonRight} ${classes.iconButton}`}
                                    onClick={() => handleEditDataElement(dataElement)}
                                    >
                                    <IconEdit16 className={classes.icon} />
                                    
                                    </button> */}
                                    <TooltipComponent 
                                        IconType={IconEdit16} 
                                        btnFunc={handleEditDataElement}
                                        project={dataElement}
                                        dynamicText="Edit"
                                        buttonMode="secondary"

                                    />
                                    <TooltipComponent 
                                        IconType={IconDelete16} 
                                        btnFunc={handleRemoveDataElementConfirmation}
                                        project={dataElement}
                                        dynamicText="Delete"
                                        buttonMode="destructive"

                                    />

                                    {/* <button style={{ color: 'red', borderColor: 'red' }}
                                    className={`${classes.buttonRight} ${classes.iconButton}`}
                                    onClick={() => handleRemoveDataElementConfirmation(dataElement)}
                                    >
                                    <IconDelete16 className={classes.icon} />
                                    
                                    </button> */}
                                </TableCell>
                            </TableRow>
                            ))
                        ) : (
                            <TableRow>
                            <TableCell colSpan={2}>No data elements to display</TableCell>
                            </TableRow>
                        )}
                        </TableBody>
                </Table>
          </div>
                    </div>
        )}

        {selectedTab === 'dataElemenent-configuration' && (
                  <div className={`${classes.mainSection} ${classes.customSelectpanel}`}>
                        <div className={classes.baseMargin}>
                            <div style={{ display: 'flex' }}>
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
                </div>
                    
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
                              <SingleSelectOption label={displayName} value={id} />
                              ))}
                          </SingleSelect>

                      </div>
                  </div>


              
                  <div className={classes.mainSection}>
                      <div className={classes.fullpanel}>
                          <Divider />
                      </div>
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
                                      />;
                              }
                          })()}
                      </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                  <Button 
                        className={classes.loadTemplateButton} 
                        onClick={() => setShowModalMetadataTemplate(true)}
                        disabled={selectedDataElementId.length <= 0}
                    >
                        Load Template
                    </Button>
                  </div>
                  {showModalMetadataTemplate && 
                      (<MetadataTemplating 
                          showModalMetadataTemplate={showModalMetadataTemplate}
                          setShowModalMetadataTemplate={setShowModalMetadataTemplate}
                          loadedProjectid={loadedProject.id}
                          selectedDataElementId={selectedDataElementId}
                          fileredHorizontalCatCombo0={fileredHorizontalCatCombo0}/>                    
                  )}

                  {/* Select HorizontalCategory */}

                  <button className={classes.collapsible} onClick={() => setIsHorizontalCategoryExpanded0((prev) => !prev)}>
                      {isHorizontalCategoryExpanded0 ? '-' : '+'} Horizontal Category (Inner)
                  </button>
                  <div className={classes.baseMargin}>
                      <div className={`${classes.content} ${isHorizontalCategoryExpanded0 ? classes.active : ''}`}>
                          <h3></h3>
                          {(function() {
                              if (typeof selectedDataElementId === 'string' && selectedDataElementId.length > 0) {
                              return <HorizontalCategory
                                          selectedDataSet={selectedDataSet}
                                          selectedDataElementId={selectedDataElementId}
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
                  <button className={classes.collapsible} onClick={() => setIsHorizontalCategoryExpandedLevel1((prev) => !prev)}>
                      {isHorizontalCategoryExpandedLevel1 ? '-' : '+'} Horizontal Category (Outer)
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
                  <button className={classes.collapsible} onClick={() => setIsVerticalCategoryExpandedlevel1((prev) => !prev)}>
                      {isVerticalCategoryExpandedlevel1 ? '-' : '+'} Vertical Category 1 (Inner)
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


                <button className={classes.collapsible} onClick={() => setIsVerticalCategoryExpandedlevel2((prev) => !prev)}>
                      {isVerticalCategoryExpandedlevel2 ? '-' : '+'} Vertical Category 2 (Outer)
                  </button>
                    <div className={classes.baseMargin}>
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

	

                  <button className={classes.collapsible} onClick={() => setIsVerticalCategoryExpandedlevel3((prev) => !prev)}>
                      {isVerticalCategoryExpandedlevel3 ? '-' : '+'} Vertical Category 3 (Outer)
                  </button>
                  <div className={classes.baseMargin}>
                      <div className={`${classes.content} ${isVerticalCategoryExpandedlevel3 ? classes.active : ''}`}>
                          <h3>{fileredVerticalCatComboLevel3.length}</h3>

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

                              />
                          )}

                            
                      </div>
                  </div>
            </div>
        )}
    
        {selectedTab === 'form-components' && (
            <div className={classes.tableContainer_dataElements}>
                <div className={`${classes.mainSection} ${classes.customSelectpanel}`}>
                    {/* <button onClick={handleRefresh} disabled={refreshing}>
                        <IconSync24 className={classes.icon} />
                    </button> */}
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
                        {Array.isArray(SideNavigationQueryData?.dataStore?.entries || []) &&
                            SideNavigationQueryData?.dataStore?.entries.map((navigation) => (
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
                                        buttonMode="destructive"/>

                                        </TableCell>
                                    </TableRow>
                                )

                            ))}
                            </TableBody>
                    </Table>
                </div>
                <div className={`${classes.mainSection} ${classes.customSelectpanel}`}>
                    {/* <button onClick={handleRefresh} disabled={refreshing}>
                        <IconSync24 className={classes.icon} />
                    </button> */}
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
                        {Array.isArray(FormComponentQueryData?.dataStore?.entries || []) &&
                            FormComponentQueryData?.dataStore?.entries.map((form_component) => (
                                // Check if navigation.dataSet is equal to selectedDataSet
                                form_component.projectID === loadedProject.id && (
                                <TableRow className={classes.customTableRow}>
                                    <TableCell className={classes.customTableCell}>{form_component.formComponentName}</TableCell>
                                    <TableCell className={`${classes.customTableCell}`}>
                                        
                                    <TooltipComponent 
                                        IconType={IconDelete16} 
                                        btnFunc={handleDeleteFormComponent}
                                        project={form_component.key}
                                        dynamicText="Delete"
                                        buttonMode="destructive"/>


                                    </TableCell>
                                </TableRow>
                            )
                        ))}
                            </TableBody>
                    </Table>
                </div>
            </div>
            
            
        )}
        {selectedTab === 'template-configuration' && (

        <div className={`${classes.mainSection} ${classes.customSelectpanel}`}>

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
                        {Array.isArray(TemaplateQueryData?.dataStore?.entries || []) &&
                            TemaplateQueryData?.dataStore?.entries.map((template) => (
                                // Check if navigation.dataSet is equal to selectedDataSet
                                template.projectID === loadedProject.id && (
                                    <TableRow key={template.key} className={classes.customTableRow}>
                                        <TableCell className={classes.customTableCell}>{template.name}</TableCell>
                                        <TableCell className={`${classes.customTableCell}`}>

                                        <TooltipComponent 
                                        IconType={IconEdit16} 
                                        btnFunc={handleEditTemplate}
                                        project={template.key}
                                        dynamicText="Edit"
                                        buttonMode="secondary"

                                    />
                                        <TooltipComponent 
                                        IconType={IconDelete16} 
                                        btnFunc={handleDeleteTemplate}
                                        project={template.key}
                                        dynamicText="Delete"
                                        buttonMode="destructive"/>

                                        </TableCell>
                                    </TableRow>
                                )

                            ))}
                        </TableBody>
            </Table>
        </div>

        )}

        {selectedTab === 'exclusion-rules' && (

        <div className={`${classes.mainSection} ${classes.customSelectpanel}`}>

                <Table className={classes.dataTable}>
                        <TableHead>
                        <TableRowHead>
                            <TableCellHead className={classes.customTableCellHead}>
                                Exclusion Rules
                                <span className={classes.iconAdd}  onClick={() => setExclusionComponents(true)}>
                                <IconAddCircle24 />

                                </span>
                            </TableCellHead>
                            <TableCellHead>Actions</TableCellHead>
                        </TableRowHead>
                        </TableHead>
                        <TableBody>
                        {Array.isArray(ConditionsQueryData?.dataStore?.entries || []) &&
                            ConditionsQueryData?.dataStore?.entries.map((exclusion) => (
                                // Check if navigation.dataSet is equal to selectedDataSet
                                exclusion.projectID === loadedProject.id && (
                                    <TableRow key={exclusion.key} className={classes.customTableRow}>
                                        <TableCell className={classes.customTableCell}>{exclusion.name}</TableCell>
                                        <TableCell className={`${classes.customTableCell}`}>

                                        <TooltipComponent 
                                        IconType={IconEdit16} 
                                        btnFunc={handleEditExclusions}
                                        project={exclusion.key}
                                        dynamicText="Edit"
                                        buttonMode="secondary"

                                    />
                                        <TooltipComponent 
                                        IconType={IconDelete16} 
                                        btnFunc={handleDeleteExclusion}
                                        project={exclusion.key}
                                        dynamicText="Delete"
                                        buttonMode="destructive"/>

                                        </TableCell>
                                    </TableRow>
                                )

                            ))}
                        </TableBody>
            </Table>
        </div>

        )}

        </ModalContent>
            {(selectedTab !== 'dataElemenent-configuration') && (
                        

                        <ModalActions>                    

                            <div className={classes.baseMargin}>
                                <ButtonStrip>
                                <Button onClick={() => handleCloseModal()}>Close</Button>

                                <Button 
                                    onClick={loadedProject.dataElements.length > 0 ? GenerateHTMLHandler : undefined}
                                    disabled={loadedProject.dataElements.length <= 0}
                                >
                                    Generate HTML Template
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
                            <Button primary  
                            onClick={() => handleSaveToConfiguration('save')}
                            >
                                Save
                            </Button>
                            <Button primary  onClick={() => handleSaveTemplate()}>
                                Save and Make Template
                            </Button>
                            <Button 
                                    onClick={loadedProject.dataElements.length > 0 ? GenerateHTMLHandler : undefined}
                                    disabled={loadedProject.dataElements.length <= 0}
                                >
                                    Generate HTML Template
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
                                Save Template
                            </Button>


                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
            


            {/* Modal for Exclusion Rules */}
            {showExclusionComponents && (
                <Modal>
                <ModalTitle>Create an Exclusion Rule</ModalTitle>
                <ModalContent>
                    {/* Add content for Exclusion Rule */}
                    <div>

                    <Input
                              name="conditionName"
                              placeholder="Condition Name"
                              value={conditionName}
                              onChange={({ value }) => setConditionName(value)}
                              className={classes.inputField}
                          />

                        <Input
                              name="condition"
                              placeholder="Condition"
                              value={condition}
                              onChange={({ value }) => setCondition(value)}
                              className={classes.inputField}
                          />

                        <select id="conditionLevel" value={selectedConditionLevel} onChange={handleConditionLevelChange} className={classes.selectField}>
                                    <option value="">Select Condition Level</option>
                                    {conditionLevels.map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>

                        <Input
                              name="exclude"
                              placeholder="Exclude"
                              value={exclude}
                              onChange={({ value }) => setExclusion(value)}
                              className={classes.inputField}
                          />

                         <select id="conditionLevel" value={selectedExclusionLevel} onChange={handleExclusionLevelChange} className={classes.selectField}>
                                    <option value="">Select Exclusion Level</option>
                                    {exclusionLevels.map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>


                    </div>
                </ModalContent>
                <ModalActions>
                    <ButtonStrip>
                    <Button onClick={handleCloseExclusionModal}>Cancel</Button>
                    {/* Add save changes logic here */}
                    <Button primary onClick={handleCreateExclusion}>Create Exclusion
                    
                    

                    </Button>
                    </ButtonStrip>
                </ModalActions>
                </Modal>
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
                    />                    
            )}
    </Modal>

    
  );
};

export default ConfigureMetadata;
