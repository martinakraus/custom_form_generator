import { useDataQuery } from '@dhis2/app-runtime'
import {useState, useEffect } from 'react';
import React from 'react'
import classes from './App.module.css'
import { SingleSelect, SingleSelectOption, SingleSelectField  } from '@dhis2-ui/select'

const dataSets = {
    targetedEntity: {
      resource: 'dataSets',
      params: ({dataSet})=>({
        fields: 'id,name,dataSetElements(dataElement(id,displayName))',
        paging: 'false',
        filter: `id:eq:${dataSet}`,
      }),
    },
  }

const AppGetDEList = props => {
    const [selectedDataElement, setSelectedDataElement] = useState(null);

    const { loading: loading, error: error, data: data, refetch: refetch } = useDataQuery(dataSets, {variables: {dataSet: props.selectedDataSet}})


    useEffect(() => {
        refetch({dataSet: props.selectedDataSet})
        console.log('Use Effect Running Once')
    }, [props.selectedDataSet]);

    const handleDataElementChange = (event) => {
        setSelectedDataElement(event.selected);
      };

    if (error) {
        return <span>ERROR: {error.message}</span>
    }

    if (loading) {
        return <span>Loading...</span>
    }

    if (data) {
    //    console.log(data.targetedEntity.dataSets);

    }

    const handlegetDisplaynameChange = event => {}
    const dataElements = data.targetedEntity.dataSets[0]?.dataSetElements || [];

    return (
      
        <div className={classes.baseMargin}>
                    <SingleSelect
                            className="select"
                            filterable
                            noMatchText="No match found"
                            placeholder="Select DataElement"
                            selected={selectedDataElement}
                            value={selectedDataElement}
                            onChange={handleDataElementChange}
                        >
                            {dataElements.map(({ dataElement }) => (
                            <SingleSelectOption
                                label={dataElement.displayName}
                                key={dataElement.id}
                                value={dataElement.id}
                            />
                            ))}
                        </SingleSelect>



       </div>
      
    )
}

export default AppGetDEList