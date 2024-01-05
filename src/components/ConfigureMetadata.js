import { useDataQuery } from '@dhis2/app-runtime'
import { SingleSelect, SingleSelectOption  } from '@dhis2-ui/select'
import React, { useState, useEffect } from 'react';
import { Transfer } from '@dhis2-ui/transfer';
import AppGetDEList from '../AppGetDEList'
import VerticalCategory from './verticalCategory'
import HorizontalCategory from './horizontalCategory'
import VerticalTransfer from './verticalTransfer'
import HorizontalTransfer from './horinzontalTransfer';
import MetadateTemplating from './MetadateTemplating';
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button } from '@dhis2/ui';
import classes from '../App.module.css'
import { Divider } from '@dhis2-ui/divider'

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
  const [fileredHorizonatlCatCombo, setfileredHorizonatlCatCombo] = useState([]);
  const [fileredVerticalCatCombo, setfileredVerticalCatCombo] = useState([]);
  const [selectedVerticalCategoryID, setSelectedVerticalCategoryID] = useState(null);
  const [selectedHorizontalCategoryID, setSelectedHorizontalCategoryID] = useState(null);
  const [isDataSetsExpanded, setIsDataSetsExpanded] = useState(false);
  const [isDataElementExpanded, setIsDataElementExpanded] = useState(false);
  const [isVerticalCategoryExpanded, setIsVerticalCategoryExpanded] = useState(false);
  const [isHorizontalCategoryExpanded, setIsHorizontalCategoryExpanded] = useState(false);
  const [showModalMetadataTemplate, setShowModalMetadataTemplate] = useState(false);
   
  // State to hold the category options
  const [horinzontalCategoryOptions, setHorinzontalcategoryOptions] = useState([]);


    {/* useDataQuery(query) loader */}
    const { loading: loading1, error: error1, data: data1 } = useDataQuery(query);

    const handleDataSetChange = event => {
        setselectedDataSet(event.selected);
        setSelectedDataElement('');
        setSelectedDataElementId('');
        setfileredHorizonatlCatCombo([]);
        setfileredVerticalCatCombo([]);
        {data1.dataSets.dataSets.filter(dataSets => dataSets.id.includes(event.selected)).map(
        ({ id, displayName }) => (                    
            setselectedDataSetName({displayName})                   
                                    )
        )}
    }

    const handleAddToConfiguration = event =>{

    }

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
                                    // Set isDataSetsExpanded to false when clicking the data elements button
                                    // setIsDataSetsExpanded(false);
                                
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
                        {/* Select VerticalCategory */}

                        <button className={classes.collapsible} onClick={() => setIsVerticalCategoryExpanded((prev) => !prev)}>
                            {isVerticalCategoryExpanded ? '-' : '+'} Vertical Category
                        </button>
                        <div className={classes.baseMargin}>
                            <div className={`${classes.content} ${isVerticalCategoryExpanded ? classes.active : ''}`}>
                                <h3></h3>
                                {(function() {
                                    if (typeof selectedDataElementId === 'string' && selectedDataElementId.length > 0) {
                                    return <VerticalCategory
                                                selectedDataElementId={selectedDataElementId}
                                                setfileredHorizonatlCatCombo={setfileredHorizonatlCatCombo}
                                                setSelectedVerticalCategoryID={setSelectedVerticalCategoryID}
                                                setfileredVerticalCatCombo={setfileredVerticalCatCombo}
                                                setSelectedHorizontalCategoryID={setSelectedHorizontalCategoryID}
                                                setHorinzontalcategoryOptions={setHorinzontalcategoryOptions}

                                            />;
                                    }
                                })()}

                                <div className={classes.transferContainer}>
                                    <VerticalTransfer 
                                    selectedVerticalCategoryID={selectedVerticalCategoryID}
                                    fileredVerticalCatCombo={fileredVerticalCatCombo}
                                    
                                    />
                                </div>
                            </div>


                        </div>


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
                                {fileredHorizonatlCatCombo.length > 0 && (
                                    <HorizontalCategory 
                                    fileredHorizonatlCatCombo={fileredHorizonatlCatCombo} 
                                    setSelectedHorizontalCategoryID={setSelectedHorizontalCategoryID}
                                    setHorinzontalcategoryOptions={setHorinzontalcategoryOptions}
                                    />
                                )}
                                {typeof selectedHorizontalCategoryID === 'string' && selectedHorizontalCategoryID.length >0 && (
                                <div className={classes.transferContainer}>
                                    <HorizontalTransfer 
                                        fileredHorizonatlCatCombo={fileredHorizonatlCatCombo}     
                                        selectedHorizontalCategoryID={selectedHorizontalCategoryID}
                                        setHorinzontalcategoryOptions={setHorinzontalcategoryOptions}
                                        horinzontalCategoryOptions={horinzontalCategoryOptions}                   
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
              <Button primary  onClick={() => console.log('Button clicked')}>
                Save
              </Button>
              <Button primary  onClick={() => console.log('Button clicked')}>
                Save and Make Template
              </Button>
            </ButtonStrip>
          </ModalActions>
    </Modal>
  );
};

export default ConfigureMetadata;
