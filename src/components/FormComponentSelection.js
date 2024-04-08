import {useState, useEffect } from 'react';
import React from 'react'
import { SingleSelect, SingleSelectOption  } from '@dhis2-ui/select'
import PropTypes from 'prop-types'; // Import PropTypes

const FormComponentSelection = props => {  

    const [selectedFormComponents, setSelectFormComponents] = useState("");
    const [disabled, setDisable] = useState(true);

    useEffect(() => {
        if (props.selectedDataElementId.length > 0) {
            const selectedDataElement = props.loadedProject.dataElements.find(dataElement => dataElement.id === props.selectedDataElementId);
            if (selectedDataElement !== undefined){                
                const initialSelectedformComponent = selectedDataElement.formComponent === 'Default' ? "" : selectedDataElement.formComponent;
                setSelectFormComponents(initialSelectedformComponent);
            }else{
                setSelectFormComponents("");
            }
            setDisable(false)
        } else {
            setSelectFormComponents("");
        }
    }, [props.selectedDataElementId, props.loadedProject.dataElements]);

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
                disabled={disabled}

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



FormComponentSelection.propTypes = {
    FormComponentQueryData: PropTypes.object.isRequired,
    loadedProject: PropTypes.object.isRequired,
    setSelectFormComponents: PropTypes.func.isRequired,
    selectedDataElementId: PropTypes.string,
    editMode: PropTypes.bool.isRequired
};
export default FormComponentSelection
