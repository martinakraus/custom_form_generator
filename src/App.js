import { useDataQuery } from '@dhis2/app-runtime'
import {useState, useEffect } from 'react';
import React from 'react'
import classes from './App.module.css'
import { SingleSelect, SingleSelectOption, SingleSelectField  } from '@dhis2-ui/select'
import { Divider } from '@dhis2-ui/divider'
import AppGetDEList from './AppGetDEList'


import { DataTable, DataTableRow , DataTableColumnHeader, DataTableCell, TableHead, TableBody   } from '@dhis2-ui/table'

import {
    Button,
} from '@dhis2/ui'

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


    {/* useDataQuery(query) loader */}
    const { loading: loading1, error: error1, data: data1 } = useDataQuery(query);

    const handleDataSetChange = event => {

              setselectedDataSet(event.selected);

              {data1.dataSets.dataSets.filter(dataSets => dataSets.id.includes(event.selected)).map(
                ({ id, displayName }) => (                    
                    setselectedDataSetName({displayName})                   
                                         )
                )}               

    };
 

    {/*  useDataQuery(query) exceptions */}
    
    if (error1 ) {
        return <span>ERROR: {error1?.message }</span>;
    }

    if (loading1) {
        return <span>Loading...</span>;
    }

    if (data1) {
      


    }
  

    {/*  useDataQuery(query) exceptions */}

    {/****
        if (error2) {
            return <span>ERROR: {error.message}</span>
        }

        if (loading2) {
            return <span>Loading...</span>
        }

        if (data2) {
            {console.log(data2)}

        }
	*****/}

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
                               <div className={classes.leftpanel}>
                                       <div className={classes.baseMargin}>
                                                                               <SingleSelect className="select"
                                                                                                        filterable
                                                                                                        noMatchText="No match found"
                                                                                                        placeholder="Select dataSet"
                                                                                                        selected={selectedDataSet}
                                                                                                        value={selectedDataSet}
                                                                                                        onChange={handleDataSetChange}
                                                                                                        >
                                                                                      {data1.dataSets.dataSets.map(
                                                                                               ({ id, displayName }) => (
                                                                                               <SingleSelectOption label={displayName} value={id}/>
                                                                                                                        )
                                                                                           )}

                                                                               </SingleSelect>

                                        </div>


                            </div>


                               <div className={classes.middlepanel}></div>
                               <div className={classes.leftpanel}>
                                       <div className={classes.baseMargin}>

                                                {(function() {
                                                                                        if (typeof selectedDataSet === 'string' && selectedDataSet.length > 0) {
                                                                                        return <AppGetDEList 
                                                                                                    selectedDataSet={selectedDataSet} 

                                                                                                />;
                                                                                        }
                                                                    })()}

                                        </div>
                                </div>

            </div>

          

        	                        


        </div>
    )
}

export default MyApp