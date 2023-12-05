import { useDataQuery } from '@dhis2/app-runtime'
import {useState, useEffect } from 'react';
import React from 'react'
import classes from './App.module.css'
import { SingleSelect, SingleSelectOption, SingleSelectField  } from '@dhis2-ui/select'
import { Transfer, TransferOption } from '@dhis2-ui/transfer'
import { Divider } from '@dhis2-ui/divider'
import AppGetDEList from './AppGetDEList'
import VerticalCategory from './components/verticalCategory'
import HorizontalCategory from './components/horizontalCategory'
import VerticalTransfer from './components/verticalTransfer'

import { DataTable, DataTableRow , DataTableColumnHeader, DataTableCell, TableHead, TableBody   } from '@dhis2-ui/table'

import {
    Button,
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
        // setIsDataSetsExpanded(false); // Collapse the DataSets section after selection
        // console.log(isDataSetsExpanded);

    }

    // useEffect(() => {
    //     console.log('Filtered Horizontal Cat Combo:', fileredHorizonatlCatCombo);
    //     console.log('Filtered Horizontal lenght', fileredHorizonatlCatCombo.length);
    //   }, [fileredHorizonatlCatCombo]);

    {/*  useDataQuery(query) exceptions */}
    
    if (error1 ) {
        return <span>ERROR: {error1?.message }</span>;
    }

    if (loading1) {
        return <span>Loading...</span>;
    }

    if (data1) {
      


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
        {/* Select DataSet */}
        <div className={classes.mainSection}>
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

        </div>
    </div>
    )
}

export default MyApp