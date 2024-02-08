import {useState, useEffect } from 'react';
import React from 'react'
import { SingleSelect, SingleSelectOption  } from '@dhis2-ui/select'


const SideNavigation = props => {


    const selectedDataElement = props.loadedProject.dataElements.find(dataElement => dataElement.id === props.selectedDataElementId);

    // const initialSelectedSideNavigation = props.loadedProject.dataElements[0].sideNavigation === 'Default' ? null : props.loadedProject.dataElements[0].sideNavigation;
    const initialSelectedSideNavigation = selectedDataElement.sideNavigation === 'Default' ? null : selectedDataElement.sideNavigation;
    console.log(initialSelectedSideNavigation)
    console.log(props.selectedDataElementId)

    const [selectedSideNavigation, setSelectSideNavigation] = useState(initialSelectedSideNavigation);


    useEffect(() => {

        if (props.editMode){
            props.setSelectSideNavigation(selectedSideNavigation)
            console.log('selectedSideNavigation loaded')

        }
        
    }, [selectedSideNavigation]);
    
    const handleSideNavigationSelectionChange = (event) => {

        const selectedValue = event && event.selected !== undefined ? event.selected : event;

        setSelectSideNavigation(selectedValue)
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


