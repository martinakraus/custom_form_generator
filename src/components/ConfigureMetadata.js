import { useDataQuery } from '@dhis2/app-runtime'
import { SingleSelect, SingleSelectOption  } from '@dhis2-ui/select'
import React, { useState, useEffect } from 'react';
import AppGetDEList from '../AppGetDEList'
import HorizontalCategory from './HorizontalCategory'
import HorizontalCategoryLevel1 from './HorizontalCategoryLevel1'
import VerticalCategoryLevel1 from './VerticalCategoryLevel1'
import VerticalCategoryLevel2 from './VerticalCategoryLevel2'
import HorizontalTransfer from './HorizontalTransfer'
import HorizontalTransferLevel1 from './HorizontalTransferLevel1';
import VerticalTransferLevel1 from './VerticalTransferLevel1';
import VerticalTransferLevel2 from './VerticalTransferLevel2';
import MetadateTemplating from './MetadateTemplating';
import GenerateForm from './GenerateForm';
import { IconEdit16, IconDelete16 } from '@dhis2/ui-icons';



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
import { config, ProjectsFiltersMore} from '../consts'
import { generateRandomId } from '../utils';


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


// const dataStoreQuery = {
//     dataStore: {
//       resource: `dataStore/${config.dataStoreName}?${ProjectsFiltersMore}`,
//       params: ({dataStoreKey})=>({
//         key: `${dataStoreKey}` // This is the variable placeholder
//     }),
// }
// }

  
     

const ConfigureMetadata = (props) => {

    // Define your data store query
    const dataStoreQuery = {
            dataStore: {
            resource: `dataStore/${config.dataStoreName}/${props.selectedProject.key}`
        }
    }

    const [loadedProject, setLoadedProject] = useState(props.selectedProject || []);
    const [isAferProjectSave, AferProjectSave] = useState(false);

    const [selectedDataSet,setselectedDataSet] = useState(props.selectedDataSet);
    const [selectedDataSetName,setselectedDataSetName] = useState([]);
    const [selectedDataElementId, setSelectedDataElementId] = useState(null);
    const [selectedDataElement, setSelectedDataElement] = useState(null);
    
    // State to hold tabs state
    const [selectedTab, setSelectedTab] = useState('dataElemenents-table');
    
    // State to hold the categories within H1
    const [controlCategories, setControlCategories] = useState([]);
    const [showGenerateForm, setShowGenerateForm] = useState(false);


    // New state for template name
    const [templateName, setTemplateName] = useState('');
    const [showModalMetadataTemplate, setShowModalMetadataTemplate] = useState(false);
    const [showTemplateNameModal , setShowTemplateNameModal] = useState(false);


  
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

    // Constants for Vertical Categories (Level 1 Outer)
    const [selectedVerticalCategoryIDLevel1, setSelectedVerticalCategoryIDLevel1] = useState(null);
    const [selectedVerticalCategoryNameLevel1, setSelectedVerticalCategoryNameLevel1] = useState(null);
    const [dictfileredVerticalCatComboLevel1, setdictfileredVerticalCatComboLevel1] = useState([]);
    const [isVerticalCategoryExpandedlevel1, setIsVerticalCategoryExpandedlevel1] = useState(false);
    const [verticalCategoryOptionsLevel1, setVerticalCategoryOptionsLevel1] = useState([]);
    const [fileredVerticalCatComboLevel1, setfileredVerticalCatComboLevel1] = useState([]);

        // Constants for Vertical Categories (Level 1 Outer)
    const [selectedVerticalCategoryIDLevel2, setSelectedVerticalCategoryIDLevel2] = useState(null);
    const [selectedVerticalCategoryNameLevel2, setSelectedVerticalCategoryNameLevel2] = useState(null);
    const [dictfileredVerticalCatComboLevel2, setdictfileredVerticalCatComboLevel2] = useState([]);
    const [isVerticalCategoryExpandedlevel2, setIsVerticalCategoryExpandedlevel2] = useState(false);
    const [VerticalCategoryOptionsLevel2, setVerticalCategoryOptionsLevel2] = useState([]);
    const [fileredVerticalCatComboLevel2, setfileredVerticalCatComboLevel2] = useState([]);

    const [isDataSetsExpanded, setIsDataSetsExpanded] = useState(false);
    const [isDataElementExpanded, setIsDataElementExpanded] = useState(false);


   
    // State to hold the category options




    {/* useDataQuery(query) loader */}
    const { loading: loading1, error: error1, data: data1 } = useDataQuery(query);
    const { loading: loadingAfterSave, error: ErrorAfterSave, data: dataAfterSave, refetch} = useDataQuery(dataStoreQuery); 

    useEffect(() => {
        refetch();
    }, [isAferProjectSave, refetch]);

    useEffect(() => {
        if (dataAfterSave) {

            const newProjects = dataAfterSave?.dataStore || [];
            // console.log(newProjects)
            setLoadedProject(newProjects)

            console.log('********* 1 Start *******************')
            console.log(newProjects)
            console.log('********* 1 End *******************')


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

        setControlCategories([]);
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
        
        // Constants for Vertical Categories (Level 1 Outer)
        setSelectedVerticalCategoryIDLevel2(null);
        setSelectedVerticalCategoryNameLevel2(null);
        setdictfileredVerticalCatComboLevel2([]);
        setIsVerticalCategoryExpandedlevel2(false);
        setVerticalCategoryOptionsLevel2([]);
        setfileredVerticalCatComboLevel2([]);


    }, [selectedDataElementId]);

    useEffect(() => {
        
        // Constants for Horizontal Categories (Outer)
        setdictfileredHorizontalCatComboLevel1([]);
        setSelectedHorizontalCategoryIDLevel1(null);
        setIsHorizontalCategoryExpandedLevel1(false);
        setHorizontalcategoryOptionsLevel1([]);
        // setfileredHorizontalCatComboLevel1([]);
    
        // Constants for Vertical Categories (Level 1 Outer)
        setSelectedVerticalCategoryIDLevel1(null);
        setSelectedVerticalCategoryNameLevel1(null);
        setdictfileredVerticalCatComboLevel1([]);
        setIsVerticalCategoryExpandedlevel1(false);
        setVerticalCategoryOptionsLevel1([]);
        setfileredVerticalCatComboLevel1([]);
        
        // Constants for Vertical Categories (Level 1 Outer)
        setSelectedVerticalCategoryIDLevel2(null);
        setSelectedVerticalCategoryNameLevel2(null);
        setdictfileredVerticalCatComboLevel2([]);
        setIsVerticalCategoryExpandedlevel2(false);
        setVerticalCategoryOptionsLevel2([]);
        setfileredVerticalCatComboLevel2([]);


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

    },[selectedHorizontalCategoryIDLevel1])


    useEffect(() => {

                // Constants for Vertical Categories (Level 1 Outer)
                setSelectedVerticalCategoryIDLevel2(null);
                setSelectedVerticalCategoryNameLevel2(null);
                setdictfileredVerticalCatComboLevel2([]);
                setIsVerticalCategoryExpandedlevel2(false);
                setVerticalCategoryOptionsLevel2([]);
                //setfileredVerticalCatComboLevel2([]);

    },[selectedVerticalCategoryIDLevel1])

    
    /** Prepare data to Update DHIS2 Object */
    const handleSaveToConfiguration = async (action, templateName = '') => {
        if (selectedDataElementId !== null 
            && selectedDataElement !== null) {

                const projectData = {
                    "dataElements":[        
                        {
                        "id":selectedDataElementId, 
                        "name":selectedDataElement,
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

                const newDataElements = [...loadedProject.dataElements, ...projectData.dataElements];

                // console.log(props.selectedProject);
                // Merge the objects using the spread operator
                const mergedObject = {
                    ...loadedProject,
                    ...projectData,
                    dataElements: newDataElements,
                };
                console.log('***** to Post ******')
 
                console.log(mergedObject.key)
                console.log(mergedObject)
                try {
                    await props.engine.mutate({
                      resource: `dataStore/${config.dataStoreName}/${mergedObject.key}`,
                      type: 'update',
                      data: mergedObject,
                    });

        
                  } catch (error) {
                    // Handle error (log, show alert, etc.)
                    console.error('Error updating project:', error);
                  }
                if (action === 'saveTemplate'){    
                    const Templateid = generateRandomId();  
                            // Remove spaces from projectName
                    const trimmedTemplateName = templateName.replace(/\s+/g, '');
        
                    const TemplateData =  {
                        
                        "Templates":[  
                                {
                                "id":Templateid, 
                                "name":templateName,                    
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
        
                    try {
                        await props.engine.mutate({
                          resource: `dataStore/${config.dataStoreTemplates}/${trimmedTemplateName}-${Templateid}`,
                          type: 'create',
                          data: TemplateData,
                        });  

                      } catch (error) {
                        // Handle error (log, show alert, etc.)
                        console.error('Error saving Template:', error);
                      }      
        
                }
                AferProjectSave((prev) => !prev);
                                
                    // Close the modal or perform any other actions upon success
                    //handleCloseModal();
        }else{

            console.log('No record was saved. No DataElement Selected')

        }
        

    }

    // Function to update template name
    const handleTemplateNameChange = (event) => {
            setTemplateName(event.target.value);
    };

    // Function to reset template name and close the modal
    const handleCloseTemplateNameModal = () => {
        setTemplateName('');
        setShowTemplateNameModal(false);
    };
    // Function to handle "Save and Make Template" button click
    const handleSaveTemplate = () => {
            // Open the modal for entering the template name
        setShowTemplateNameModal(true);
    };


    const handleCloseModal = () => {
      props.setShowModalConfigureProject(false)      

    };

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


        setSelectedDataElement(dataElement.name)
        setSelectedDataElementId(dataElement.id)
        setSelectedTab('dataElemenent-configuration')
        setIsDataElementExpanded(true)

    }


    {/*  useDataQuery(query) exceptions */}
    
    if (error1 ) {
        return <span>ERROR: {error1?.message }</span>;
    }

    if (loading1) {
        return <span>Loading...</span>;
    }

    if (data1) {
      
            // console.log(props.selectedProject.dataElements)
            // console.log(props.selectedProject.dataElements.length)
            

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
            onClick={() => setSelectedTab('dataElemenents-table')}
          >
            Existing Data Elements
            {/* Your table content goes here */}
            {/* Add your table component or any other content for the 'Table' tab */}
          </Tab>
          <Tab
            label="Configure Data Elements"
            selected={selectedTab === 'dataElemenent-configuration'}
            onClick={() => setSelectedTab('dataElemenent-configuration')}
          >
            Configure Data Elements
            {/* Your existing DataSets content */}
          </Tab>
        </TabBar>

        {selectedTab === 'dataElemenents-table' && (
        <div className={classes.tableContainer_dataElements}>
          <div className={`${classes.mainSection} ${classes.customSelectpanel}`}>
                  <Table className={classes.dataTable}>
                    <TableHead>
                    <TableRowHead>
                        <TableCellHead>Data Elements</TableCellHead>
                        <TableCellHead>Actions</TableCellHead>
                    </TableRowHead>
                    </TableHead>
                    <TableBody>
                        {loadedProject.dataElements && loadedProject.dataElements.length > 0 ? (
                            loadedProject.dataElements.map((dataElement) => (
                            <TableRow className={classes.customTableRow} key={dataElement.id}>
                                <TableCell className={classes.customTableCell}>{dataElement.name}</TableCell>
                                <TableCell className={`${classes.customTableCell}`}>
                                <button
                                    className={`${classes.buttonRight} ${classes.iconButton}`}
                                    onClick={() => handleEditDataElement(dataElement)}
                                    >
                                    <IconEdit16 className={classes.icon} />
                                    
                                    </button>


                                    <button style={{ color: 'red', borderColor: 'red' }}
                                    className={`${classes.buttonRight} ${classes.iconButton}`}
                                    onClick={() => handleRemoveDataElementConfirmation(dataElement)}
                                    >
                                    <IconDelete16 className={classes.icon} />
                                    
                                    </button>
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
                                      />;
                              }
                          })()}
                      </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                  <Button className={classes.loadTemplateButton} onClick={() => setShowModalMetadataTemplate(true)}>
                      Load Template
                  </Button>
                  </div>
                  {showModalMetadataTemplate && 
                      (<MetadateTemplating 
                          showModalMetadataTemplate={showModalMetadataTemplate}
                          setShowModalMetadataTemplate={setShowModalMetadataTemplate}/>                    
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
                                          setControlCategories={setControlCategories}
                                          controlCategories={controlCategories}
                                          setdictfileredHorizontalCatComboLevel1={setdictfileredHorizontalCatComboLevel1}

                                      />;
                              }
                          })()}
                          {selectedHorizontalCategoryID0 !== null && (
                          <div className={classes.transferContainer}>
                              <HorizontalTransfer 
                              fileredHorizontalCatCombo0={fileredHorizontalCatCombo0}
                              setdictfileredHorizontalCatCombo0={setdictfileredHorizontalCatCombo0}
                              
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

                          {fileredHorizontalCatComboLevel1.length > 0 && (
                            
                              <HorizontalCategoryLevel1 
                              fileredHorizontalCatComboLevel1={fileredHorizontalCatComboLevel1} 
                              setSelectedHorizontalCategoryNameLevel1={setSelectedHorizontalCategoryNameLevel1}
                              setSelectedHorizontalCategoryIDLevel1={setSelectedHorizontalCategoryIDLevel1}
                              setHorizontalcategoryOptionsLevel1={setHorizontalcategoryOptionsLevel1}
                              setfileredVerticalCatComboLevel1={setfileredVerticalCatComboLevel1}
                              fileredVerticalCatComboLevel1={fileredVerticalCatComboLevel1}
                              setVerticalCategoryOptionsLevel1={setVerticalCategoryOptionsLevel1}
                              setdictfileredVerticalCatComboLevel1={setdictfileredVerticalCatComboLevel1}

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
                              />
                          </div> 

                          )}                             
                      </div>
                  </div>

                  {/* Select HorizontalCategoryLevel1 */}
                  <button className={classes.collapsible} onClick={() => setIsVerticalCategoryExpandedlevel1((prev) => !prev)}>
                      {isVerticalCategoryExpandedlevel1 ? '-' : '+'} Vertical Category (Inner)
                  </button>
                  <div className={classes.baseMargin}>
                      <div className={`${classes.content} ${isVerticalCategoryExpandedlevel1 ? classes.active : ''}`}>
                          <h3></h3>
                          {/* <HorizontalCategoryLevel1 
                              fileredHorizonatlCatComboLevel1={fileredHorizonatlCatComboLevel1} 
                              setSelectedHorizontalCategoryIDLevel1={setSelectedHorizontalCategoryIDLevel1}
                              setHorinzontalcategoryOptionsLevel1={setHorinzontalcategoryOptionsLevel1}
                              /> */}
                          {fileredVerticalCatComboLevel1.length > 0 && (
                              <VerticalCategoryLevel1
                              fileredVerticalCatComboLevel1={fileredVerticalCatComboLevel1}
                              setfileredVerticalCatComboLevel2={setfileredVerticalCatComboLevel2} 
                              setSelectedVerticalCategoryNameLevel1={setSelectedVerticalCategoryNameLevel1}
                              setSelectedVerticalCategoryIDLevel1={setSelectedVerticalCategoryIDLevel1}
                              setVerticalCategoryOptionsLevel1={setVerticalCategoryOptionsLevel1}
                              setdictfileredVerticalCatComboLevel2={setdictfileredVerticalCatComboLevel2}
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
                                                     
                              />
                          </div> 

                          )}                             
                      </div>
                  </div>


                    {/* Select HorizontalCategoryLevel2 */}
                                    <button className={classes.collapsible} onClick={() => setIsVerticalCategoryExpandedlevel2((prev) => !prev)}>
                      {isVerticalCategoryExpandedlevel2 ? '-' : '+'} Vertical Category (Outer)
                  </button>
                  <div className={classes.baseMargin}>
                      <div className={`${classes.content} ${isVerticalCategoryExpandedlevel2 ? classes.active : ''}`}>
                          <h3></h3>
                          {/* <HorizontalCategoryLevel1 
                              fileredHorizonatlCatComboLevel1={fileredHorizonatlCatComboLevel1} 
                              setSelectedHorizontalCategoryIDLevel1={setSelectedHorizontalCategoryIDLevel1}
                              setHorinzontalcategoryOptionsLevel1={setHorinzontalcategoryOptionsLevel1}
                              /> */}
                          {fileredVerticalCatComboLevel2.length > 0 && (
                              <VerticalCategoryLevel2
                              fileredVerticalCatComboLevel2={fileredVerticalCatComboLevel2} 
                              setSelectedVerticalCategoryNameLevel2={setSelectedVerticalCategoryNameLevel2}
                              setSelectedVerticalCategoryIDLevel2={setSelectedVerticalCategoryIDLevel2}
                              setVerticalCategoryOptionsLevel2={setVerticalCategoryOptionsLevel2}
                              selectedVerticalCategoryIDLevel1={selectedVerticalCategoryIDLevel1}
                              />
                          )}

                          {typeof selectedVerticalCategoryIDLevel2 === 'string' && selectedVerticalCategoryIDLevel2.length >0 && (
                          <div className={classes.transferContainer}>
                              <VerticalTransferLevel2
                                  fileredVerticalCatComboLevel2={fileredVerticalCatComboLevel2}     
                                  selectedVerticalCategoryIDLevel2={selectedVerticalCategoryIDLevel2}
                                  setVerticalCategoryOptionsLevel2={setVerticalCategoryOptionsLevel2}
                                  VerticalCategoryOptionsLevel2={VerticalCategoryOptionsLevel2}
                                  setdictfileredVerticalCatComboLevel2={setdictfileredVerticalCatComboLevel2}                   
                              />
                          </div> 

                          )}                             
                      </div>
                  </div>
            </div>
        )}
    

          </ModalContent>
          {selectedTab === 'dataElemenent-configuration' && (

                    <ModalActions>
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
                    <Button onClick={() => setShowGenerateForm(true)}>Generate HTML Template</Button>
                    </ButtonStrip>


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
                        {/* Modal for creating a new project */}
            {showGenerateForm && 
                (<GenerateForm 
                    engine={props.engine}
                    selectedDataElement={[{name:selectedDataElement, id:selectedDataElementId}]}
                    dictfileredHorizontalCatCombo0={dictfileredHorizontalCatCombo0} 
                    dictfileredHorizontalCatComboLevel1={dictfileredHorizontalCatComboLevel1} 
                    dictfileredVerticalCatComboLevel1={dictfileredVerticalCatComboLevel1}
                    dictfileredVerticalCatComboLevel2={dictfileredVerticalCatComboLevel2} 
                    setShowGenerateForm={setShowGenerateForm}
                    />                    
            )}
    </Modal>

    
  );
};

export default ConfigureMetadata;
