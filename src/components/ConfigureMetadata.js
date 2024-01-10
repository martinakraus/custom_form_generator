import { useDataQuery } from '@dhis2/app-runtime'
import { SingleSelect, SingleSelectOption  } from '@dhis2-ui/select'
import React, { useState, useEffect } from 'react';
import AppGetDEList from '../AppGetDEList'
import HorizontalCategory from './HorizontalCategory'
import VerticalCategoryLevel0 from './VerticalCategoryLevel0'
import VerticalCategoryLevel1 from './VerticalCategoryLevel1'
import HorizontalTransfer from './HorizontalTransfer'
import VerticalTransferLevel0 from './VerticalTransferLevel0';
import VerticalTransferLevel1 from './VerticalTransferLevel1';
import MetadateTemplating from './MetadateTemplating';
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button } from '@dhis2/ui';
import classes from '../App.module.css'
import { Divider } from '@dhis2-ui/divider'
import { config } from '../consts'
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

const ConfigureMetadata = (props) => {

    const [selectedDataSet,setselectedDataSet] = useState(props.selectedDataSet);
    const [selectedDataSetName,setselectedDataSetName] = useState([]);
    const [selectedDataElementId, setSelectedDataElementId] = useState(null);
    const [selectedDataElement, setSelectedDataElement] = useState(null);
    // New state for template name
    const [templateName, setTemplateName] = useState('');
    const [showModalMetadataTemplate, setShowModalMetadataTemplate] = useState(false);
    const [showTemplateNameModal , setShowTemplateNameModal] = useState(false);


  
    // Constants for Horizontal Variables
    const [fileredHorizontalCatCombo, setfileredHorizontalCatCombo] = useState([]); //done
    const [dictfileredHorizontalCatCombo, setdictfileredHorizontalCatCombo] = useState([]); //done
    const [selectedHorizontalCategoryID, setSelectedHorizontalCategoryID] = useState(null); //done
    const [isHorizontalCategoryExpanded, setIsHorizontalCategoryExpanded] = useState(false); //done

    // Constants for Vertical Categories (Level 0 Inner)
    const [dictfileredVerticalCatComboLevel0, setdictfileredVerticalCatComboLevel0] = useState([]);
    const [selectedVerticalCategoryIDLevel0, setSelectedVerticalCategoryIDLevel0] = useState(null);
    const [isVerticalCategoryExpandedLevel0, setIsVerticalCategoryExpandedLevel0] = useState(false);
    const [verticalCategoryOptionsLevel0, setVerticalcategoryOptionsLevel0] = useState([]);
    const [fileredVerticalCatComboLevel0, setfileredVerticalCatComboLevel0] = useState([]);

    // Constants for Vertical Categories (Level 1 Outer)
    const [selectedVerticalCategoryIDLevel1, setSelectedVerticalCategoryIDLevel1] = useState(null);
    const [dictfileredVerticalCatComboLevel1, setdictfileredVerticalCatComboLevel1] = useState([]);
    const [isVerticalCategoryExpandedlevel1, setIsVerticalCategoryExpandedlevel1] = useState(false);
    const [horinzontalCategoryOptionsLevel1, setHorinzontalcategoryOptionsLevel1] = useState([]);
    const [fileredVerticalCatComboLevel1, setfileredVerticalCatComboLevel1] = useState([]);

    const [isDataSetsExpanded, setIsDataSetsExpanded] = useState(false);
    const [isDataElementExpanded, setIsDataElementExpanded] = useState(false);


   
    // State to hold the category options




    {/* useDataQuery(query) loader */}
    const { loading: loading1, error: error1, data: data1 } = useDataQuery(query);

    const handleDataSetChange = event => {
        setselectedDataSet(event.selected);
        setSelectedDataElement('');
        setSelectedDataElementId('');
        setfileredVerticalCatComboLevel0([]);
        setfileredHorizontalCatCombo([]);
        {data1.dataSets.dataSets.filter(dataSets => dataSets.id.includes(event.selected)).map(
        ({ id, displayName }) => (                    
            setselectedDataSetName({displayName})                   
                                    )
        )}
    }

    /** Prepare data to Update DHIS2 Object */
    const handleSaveToConfiguration = async (action, templateName = '') => {
        if (selectedDataElementId !== null 
            && selectedDataElement !== null) {

                const projectData = {
                    "dataElements":[        
                        {
                        "id":selectedDataElementId, 
                        "name":selectedDataElement,
                        "Horizontal": 
                            dictfileredHorizontalCatCombo
                        ,
                        "verticalLevel0": 
                            dictfileredVerticalCatComboLevel0
                        ,
                        "verticalLevel1": 
                            dictfileredVerticalCatComboLevel1
                        ,
                        }
                    ]
                }
                console.log(props.selectedProject);
                // Merge the objects using the spread operator
                const mergedObject = {
                    ...props.selectedProject,
                    ...projectData
                };
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
                            "Horizontal": 
                                    dictfileredHorizontalCatCombo
                                ,
                                "verticalLevel0": 
                                    dictfileredVerticalCatComboLevel0
                                ,
                                "verticalLevel1": 
                                    dictfileredVerticalCatComboLevel1
                                ,                    
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
                                
                    // Close the modal or perform any other actions upon success
                    handleCloseModal();
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


    {/*  useDataQuery(query) exceptions */}
    
    if (error1 ) {
        return <span>ERROR: {error1?.message }</span>;
    }

    if (loading1) {
        return <span>Loading...</span>;
    }

    // if (data1) {
      
    //         console.log("DataSets list downloaded")

    // }
  return (
    <Modal fluid>
      <ModalTitle>
        Category Options and Navigations

        </ModalTitle>
          <ModalContent>
    
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

                        <div className={classes.mainSection}>
                            <div className={classes.fullpanel}>
                                <Divider />
                            </div>
                        </div>
                        {/* Select HorizontalCategory */}

                        <button className={classes.collapsible} onClick={() => setIsHorizontalCategoryExpanded((prev) => !prev)}>
                            {isHorizontalCategoryExpanded ? '-' : '+'} Horizontal Category
                        </button>
                        <div className={classes.baseMargin}>
                            <div className={`${classes.content} ${isHorizontalCategoryExpanded ? classes.active : ''}`}>
                                <h3></h3>
                                {(function() {
                                    if (typeof selectedDataElementId === 'string' && selectedDataElementId.length > 0) {
                                    return <HorizontalCategory
                                                selectedDataElementId={selectedDataElementId}
                                                setfileredVerticalCatComboLevel0={setfileredVerticalCatComboLevel0}
                                                setfileredVerticalCatComboLevel1={setfileredVerticalCatComboLevel1}
                                                setSelectedHorizontalCategoryID={setSelectedHorizontalCategoryID}
                                                setfileredHorizontalCatCombo={setfileredHorizontalCatCombo}
                                                setSelectedVerticalCategoryIDLevel0={setSelectedVerticalCategoryIDLevel0}
                                                setSelectedVerticalCategoryIDLevel1={setSelectedVerticalCategoryIDLevel1}
                                                setVerticalcategoryOptionsLevel0={setVerticalcategoryOptionsLevel0}
                                                setHorinzontalcategoryOptionsLevel1={setHorinzontalcategoryOptionsLevel1} 

                                            />;
                                    }
                                })()}

                                <div className={classes.transferContainer}>
                                    <HorizontalTransfer 
                                    selectedHorizontalCategoryID={selectedHorizontalCategoryID}
                                    fileredHorizontalCatCombo={fileredHorizontalCatCombo}
                                    setdictfileredHorizontalCatCombo={setdictfileredHorizontalCatCombo}
                                    
                                    />
                                </div>
                            </div>


                        </div>


                        <div className={classes.mainSection}>
                            <div className={classes.fullpanel}>
                                <Divider />
                            </div>
                        </div>
                        {/* Select VerticalCategoryLevel0 */}
                        <button className={classes.collapsible} onClick={() => setIsVerticalCategoryExpandedLevel0((prev) => !prev)}>
                            {isVerticalCategoryExpandedLevel0 ? '-' : '+'} Vertical Category (Inner)
                        </button>
                        <div className={classes.baseMargin}>
                            <div className={`${classes.content} ${isVerticalCategoryExpandedLevel0 ? classes.active : ''}`}>
                                <h3></h3>
                                {fileredVerticalCatComboLevel0.length > 0 && (
                                    <VerticalCategoryLevel0 
                                    fileredVerticalCatComboLevel0={fileredVerticalCatComboLevel0} 
                                    setSelectedVerticalCategoryIDLevel0={setSelectedVerticalCategoryIDLevel0}
                                    setVerticalcategoryOptionsLevel0={setVerticalcategoryOptionsLevel0}
                                    setfileredVerticalCatComboLevel1={setfileredVerticalCatComboLevel1}
                                    fileredVerticalCatComboLevel1={fileredVerticalCatComboLevel1}
                                    setHorinzontalcategoryOptionsLevel1={setHorinzontalcategoryOptionsLevel1}

                                    />
                                )}
                                {typeof selectedVerticalCategoryIDLevel0 === 'string' && selectedVerticalCategoryIDLevel0.length >0 && (
                                <div className={classes.transferContainer}>
                                    <VerticalTransferLevel0 
                                        fileredVerticalCatComboLevel0={fileredVerticalCatComboLevel0}     
                                        selectedVerticalCategoryIDLevel0={selectedVerticalCategoryIDLevel0}
                                        setVerticalcategoryOptionsLevel0={setVerticalcategoryOptionsLevel0}
                                        verticalCategoryOptionsLevel0={verticalCategoryOptionsLevel0}
                                        setdictfileredVerticalCatComboLevel0={setdictfileredVerticalCatComboLevel0}                   
                                    />
                                </div> 

                                )}                             
                            </div>
                        </div>

                        {/* Select HorizontalCategoryLevel1 */}
                        <button className={classes.collapsible} onClick={() => setIsVerticalCategoryExpandedlevel1((prev) => !prev)}>
                            {isVerticalCategoryExpandedlevel1 ? '-' : '+'} Vertical Category (Outer)
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
                                    setSelectedVerticalCategoryIDLevel1={setSelectedVerticalCategoryIDLevel1}
                                    setHorinzontalcategoryOptionsLevel1={setHorinzontalcategoryOptionsLevel1}
                                    />
                                )}
                                {typeof selectedVerticalCategoryIDLevel1 === 'string' && selectedVerticalCategoryIDLevel1.length >0 && (
                                <div className={classes.transferContainer}>
                                    <VerticalTransferLevel1
                                        fileredVerticalCatComboLevel1={fileredVerticalCatComboLevel1}     
                                        selectedVerticalCategoryIDLevel1={selectedVerticalCategoryIDLevel1}
                                        setHorinzontalcategoryOptionsLevel1={setHorinzontalcategoryOptionsLevel1}
                                        horinzontalCategoryOptionsLevel1={horinzontalCategoryOptionsLevel1}
                                        setdictfileredVerticalCatComboLevel1={setdictfileredVerticalCatComboLevel1}                   
                                    />
                                </div> 

                                )}                             
                            </div>
                        </div>
                  </div>
          </ModalContent>
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
            </ButtonStrip>
            
          </ModalActions>
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
    </Modal>

    
  );
};

export default ConfigureMetadata;
