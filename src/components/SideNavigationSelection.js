import {useState, useEffect } from 'react';
import React from 'react'
import { SingleSelect, SingleSelectOption  } from '@dhis2-ui/select'
import PropTypes from 'prop-types';



const SideNavigation = props => {


    const [selectedSideNavigation, setSelectedSideNavigation] = useState('');
    const [disabled, setDisable] = useState(true);

    useEffect(() => {
        if (props.selectedDataElementId.length > 0) {
            const selectedDataElement = props.loadedProject.dataElements.find(dataElement => dataElement.id === props.selectedDataElementId);
            if (selectedDataElement !== undefined){                
                const initialSelectedSideNavigation = selectedDataElement.sideNavigation === 'Default' ? "" : selectedDataElement.sideNavigation;
                setSelectedSideNavigation(initialSelectedSideNavigation);
            }else{
                setSelectedSideNavigation("");
            }
            setDisable(false)
        } else {

            setSelectedSideNavigation("");
        }
    }, [props.selectedDataElementId, props.loadedProject.dataElements, props.savingDataElement]);


    useEffect(() => {

        if (props.editMode){
            props.setSelectSideNavigation(selectedSideNavigation)
            // console.log('selectedSideNavigation loaded')

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


SideNavigation.propTypes = {
    SideNavigationQueryData: PropTypes.object.isRequired,
    loadedProject: PropTypes.object.isRequired,
    setSelectSideNavigation: PropTypes.func.isRequired,
    selectedDataElementId: PropTypes.string,
    editMode: PropTypes.bool.isRequired,
    savingDataElement: PropTypes.bool.isRequired
};


export default SideNavigation


