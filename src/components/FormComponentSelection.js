import {useState, useEffect } from 'react';
import React from 'react'
import { SingleSelect, SingleSelectOption  } from '@dhis2-ui/select'


const FormComponentSelection = props => {
    const initialSelectedformComponent= props.loadedProject.dataElements[0].formComponent === 'Default' ? null : props.loadedProject.dataElements[0].formComponent;
    const [selectedFormComponents,setSelectFormComponents] = useState(initialSelectedformComponent);

    useEffect(() => {

        if (props.editMode){
            props.setSelectFormComponents(selectedFormComponents)

        }
        
    }, [selectedFormComponents]);

    const handleFormSelectionSelectionChange = (event) => {
        const selectedValue = event && event.selected !== undefined ? event.selected : event;

        setSelectFormComponents(selectedValue)
        props.setSelectFormComponents(event)

    }


    return (
      
        <div style={{ marginLeft:'10px' }}>
        <span>Form Component</span>

            <SingleSelect
                filterable
                noMatchText="No match found"
                placeholder="Select Form Component"
                selected={selectedFormComponents}
                value={selectedFormComponents}
                onChange={({ selected }) => handleFormSelectionSelectionChange(selected)}
                
            >
                {props.FormComponentQueryData.dataStore?.entries
                .filter(({ projectID }) => projectID === props.loadedProject.id)
                .map(({ key, formComponentName }) => (
                <SingleSelectOption label={formComponentName} 
                key={key}
                value={formComponentName} />
                ))}
            </SingleSelect>
        </div>
      
    )

}


export default FormComponentSelection
