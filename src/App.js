import { useDataQuery } from '@dhis2/app-runtime'
import {useState } from 'react';
import React from 'react'
import classes from './App.module.css'
import { SingleSelect, SingleSelectOption  } from '@dhis2-ui/select'
import { Divider } from '@dhis2-ui/divider'
import { useDataEngine } from '@dhis2/app-runtime';
import AppGetDEList from './AppGetDEList'
import VerticalCategory from './components/verticalCategory'
import HorizontalCategory from './components/horizontalCategory'
import VerticalTransfer from './components/verticalTransfer'
import CreateProject from './components/CreateProject'
import LoadProjects from './components/LoadProjects'
import { generateRandomId } from './utils';

import { DataTable, DataTableRow , DataTableColumnHeader, DataTableCell, TableHead, TableBody   } from '@dhis2-ui/table'

import {
    Box,
    Button
} from '@dhis2/ui'
import HorizontalTransfer from './components/horinzontalTransfer';

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


/** header constant ***/
const header = (
    <div className={classes.headerContainer}>
        <h1>Custom Form Generator</h1>

    </div>

    );
const MyApp = () => {

    const engine = useDataEngine();
    {/* declare variable and event methods */}
    const [selectedDataSet,setselectedDataSet] = useState([]);
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
    const [isLoadProject, setLoadProject] = useState(false);
    const [isCreateroject, setCreateProject] = useState(false);
    const [showModalCreateProject, setShowModalCreateProject] = useState(false);
    const [showModalLoadProjects, setShowModalLoadProjects] = useState(false);
    // reloading and state does not matter
    const [reloadProjects, setReloadProjects] = useState(false);
 
      // State to hold the category options
    const [horinzontalCategoryOptions, setHorinzontalcategoryOptions] = useState([]);



    const [projectId, setProjectId] = useState(generateRandomId());
      

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

    {/*  useDataQuery(query) exceptions */}
    
    if (error1 ) {
        return <span>ERROR: {error1?.message }</span>;
    }

    if (loading1) {
        return <span>Loading...</span>;
    }

    if (data1) {
      
            console.log("DataSets list downloaded")

    }
    return (

        <div className={classes.pageDiv}>
                {/* Header */}
                { header }
            <p>
                This application is used to create custom dhis2 forms automatically to align DATIM design pattern
            </p>

        
            {/* Divider */}
            <div className={classes.mainSection}>
                <div className={classes.fullpanel}>
                    <Divider />
                </div>
            </div>
            {/* * load or create new project* */}

            <div className={classes.mainSection}>
                <div className={classes.baseMargin}>
                    <div className={classes.flexContainer}>
                        <Box height="100px" width="100px" className={`${classes.cardbox}`}

                        >
                                <div className={classes.cardContent}                                        
                                        onClick={() => {
                                            setShowModalLoadProjects(true);
                                            setReloadProjects((prev) => !prev);                                            
                                            console.log('Log button Clicked')
                                        }}
                                        
                                        >
                                    All Projects
                                </div>
                        </Box>
                    <div className={classes.spaceInBetween}></div>
                        <Box height="100px" width="100px" className={classes.cardbox} >
                            <div className={classes.cardContent} onClick={() => setShowModalCreateProject(true)}>Create Project</div>
                        </Box>
                    </div>
                </div>
            </div>

            {/* Modal for loading projects */}
            {showModalLoadProjects && 
                (<LoadProjects engine={engine} 
                    setShowModalLoadProjects={setShowModalLoadProjects} 
                    showModalLoadProjects={showModalLoadProjects}
                    reloadProjects={reloadProjects}/>                    
            )}

            {/* Modal for creating a new project */}
            {showModalCreateProject && 
                (<CreateProject 
                    engine={engine} 
                    setShowModalCreateProject={setShowModalCreateProject} 
                    setShowModalLoadProjects={setShowModalLoadProjects}
                    setReloadProjects={setReloadProjects} 
                    />                    
            )}

            {/* Select DataSet */}
            <div className={`${classes.mainSection} ${classes.hideMetadataSelection}`}>
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
                {/* Button to add data elements to the configuration */}
                <div className={classes.buttonContainer}>
                        <Button onClick={() => handleAddToConfiguration()}>Add to Configuration</Button>
                </div>

            </div>
    </div>
    )
}

export default MyApp