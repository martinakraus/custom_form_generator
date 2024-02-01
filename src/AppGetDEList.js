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
    const [disabled, setDisable] = useState(false)
    const { loading: loading, error: error, data: data, refetch: refetch } = useDataQuery(dataSets, {variables: {dataSet: props.selectedDataSet}})

    useEffect(() => {

        refetch({dataSet: props.selectedDataSet})
        // setdataElementList(data.targetedEntity.dataSets[0]?.dataSetElements || []);
        // console.log('Use Effect Running Once')
        if (props.editMode){
          setDisable(!!props.selectedDataElementId);
          console.log('******** Loaded Project **********')
          props.setSelectFormComponents(props.loadedProject.dataElements[0].formComponent)
          props.setSelectSideNavigation(props.loadedProject.dataElements[0].sideNavigation)
        }
        // console.log(props.selectedDataElementId)
        
    }, [props.selectedDataSet, props.selectedDataElementId]);


    const handleDataElementChange = (selected) => {


        props.setSelectedDataElementId(selected);

        // Find the record with the matching id
        const selectedDataElement = dataElements.find(dataElement => dataElement.dataElement.id === selected);
          
        //Selected data element
        // Check if selectedDataElement has a value, and set disabled accordingly

        if (props.editMode){
          setDisable(!!selectedDataElement);
        }
        
        if (selectedDataElement) {         
          props.setSelectedDataElement(selectedDataElement.dataElement.displayName);

        } else {

          props.setSelectedDataElement('');
        }

        // {dataElementSelection.map(({ dataElement }) => (
        //   // setdataElementList(dataElement.displayName)
        //   console.log(dataElement.displayName)
        //   const updatedCategories = categories.filter(category => category.id !== selected);

        //   ))}

        // {dataElementSelection.filter(dataElement => dataElement.id.includes(selected)).map(
        //   ({ id, displayName }) => (                    
        //       // setselectedDataSetName({displayName})
        //       setdataElementList(displayName)
        //       // props.setSelectedDataElement(selected);
        //                               )
        //   )
        // }

        // {data.dataSets.dataSetElements.filter(dataElement => dataElement.id.includes(selected)).map(
        //   ({ id, displayName }) => (                    
        //       // setselectedDataSetName({displayName})
        //       props.setSelectedDataElement(displayName)
        //       // props.setSelectedDataElement(selected);
        //                               )
        //   )}

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


    const dataElements = data.targetedEntity.dataSets[0]?.dataSetElements || [];

    return (
      
        <div className={classes.baseMargin}>
                    <SingleSelect
                            className="select"
                            filterable
                            noMatchText="No match found"
                            placeholder="Select DataElement"
                            selected={props.selectedDataElementId}
                            value={props.selectedDataElementId}
                            // onChange={handleDataElementChange}
                            onChange={({ selected }) => handleDataElementChange(selected)}
                            disabled={disabled}
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