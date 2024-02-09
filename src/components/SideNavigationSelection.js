import {useState, useEffect } from 'react';
import React from 'react'
import { SingleSelect, SingleSelectOption  } from '@dhis2-ui/select'


const SideNavigation = props => {

    const [selectedSideNavigation, setSelectedSideNavigation] = useState(null);
    const [disabled, setDisable] = useState(true);

    useEffect(() => {
        if (props.selectedDataElementId.length > 0) {
            const selectedDataElement = props.loadedProject.dataElements.find(dataElement => dataElement.id === props.selectedDataElementId);
            if (selectedDataElement !== undefined){                
                const initialSelectedSideNavigation = selectedDataElement.sideNavigation === 'Default' ? null : selectedDataElement.sideNavigation;
                setSelectedSideNavigation(initialSelectedSideNavigation);
            }else{
                setSelectedSideNavigation(null);
            }
            setDisable(false)
        } else {

            setSelectedSideNavigation(null);
        }
    }, [props.selectedDataElementId, props.loadedProject.dataElements]);


    useEffect(() => {

        if (props.editMode){
            props.setSelectSideNavigation(selectedSideNavigation)
            console.log('selectedSideNavigation loaded')

        }
        
    }, [selectedSideNavigation]);
    
    const handleSideNavigationSelectionChange = (event) => {

        const selectedValue = event && event.selected !== undefined ? event.selected : event;

        setSelectedSideNavigation(selectedValue)
        props.setSelectSideNavigation(event)


    }

    return (
      
        <div style={{ marginRight:'10px'  }}>
                <span>Side Navigation</span>

                <SingleSelect
                    filterable
                    noMatchText="No match found"
                    placeholder="Select Side Navigation"
                    selected={selectedSideNavigation}
                    value={selectedSideNavigation}
                    onChange={({ selected }) => handleSideNavigationSelectionChange(selected)}
                    disabled={disabled}
                >
                    {props.SideNavigationQueryData?.dataStore?.entries
                    .filter(({ projectID }) => projectID === props.loadedProject.id)
                    .map(({ key, sideNavName }) => (
                    <SingleSelectOption 
                    label={sideNavName} 
                    key={key}
                    value={sideNavName}
                            />
                    ))}
                </SingleSelect>

        </div>
      
    )

}


export default SideNavigation


