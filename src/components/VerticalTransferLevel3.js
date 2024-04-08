
import React, { useState, useEffect } from 'react';
import { Transfer } from '@dhis2-ui/transfer';
import PropTypes from 'prop-types';

const VerticalTransferLevel3 = (props) => {

const [loading, setLoading] = useState(false)
const [selectedKeys, setSelectedKeys] = useState([]);
const [filerteredCategoryOptionsSelected, setfilerteredCategoryOptionsSelected] = useState([]);
const [runTwice, setRunTwice] = useState(0); // Track how many times the effect has run


// Function to handle the change of the selected category
const handleHorizontalTransferChange = (selected) => {

    setSelectedKeys(selected);
        // Create a new array with only necessary properties for the remaining records
    const filteredOptionsSelected = filerteredCategoryOptionsSelected
        .filter(category => selected.includes(category.value))
        .map(({ value, label }) => ({ id:value, name:label }));
    const options_init_reordered = selected.map(id => filteredOptionsSelected.find(option => option.id === id));

    props.setdictfileredVerticalCatComboLevel3(options_init_reordered)

}

useEffect(() => {
    setLoading(true)


    const filteredCategories = props.fileredVerticalCatComboLevel3 || [];

    // Extract horizontal category selected
    const selectCategory = filteredCategories.filter(category => category.id === props.selectedVerticalCategoryIDLevel3) || [];

    // Extract categoryOptions from each object
    const categoryOptionsArray = selectCategory.map(category => category.categoryOptions) || [];
    
    // Flatten the array of arrays into a single array
    const allCategoryOptions = [].concat(...categoryOptionsArray);


   if (props.selectedVerticalCategoryIDLevel3 !== undefined 
    && props.selectedVerticalCategoryIDLevel3 !== null 
    && props.selectedVerticalCategoryIDLevel3 !== '') {

        const options = allCategoryOptions?.map(option => ({
            value: option.id,
            label: option.name,
          })) || [];

                            // Now, allCategoryOptions contains all the category options
        const options_init = allCategoryOptions?.map(option => ({
          id: option.id,
          name: option.name,

        })) || [];


        if (props.editMode){
          const updatedDataElementsLevel1 = props.loadedProject.dataElements.filter(
            (element) => element.id === props.selectedDataElementId
          );
          const metadata = updatedDataElementsLevel1[0]?.verticalLevel3?.metadata?.map(option => ({
              value: option.id,
              label: option.name,
              selected: true, // Set all options to the right by default
            })) || [];
            setSelectedKeys(metadata.map(option => option.value)); // Set all options to the right by default
            handleHorizontalTransferChange(metadata.map(option => option.value))
       
        }else{

          setSelectedKeys(options.map(option => option.value)); // Set all options to the right by default
          props.setdictfileredVerticalCatComboLevel3(options_init); 
        }
        
        props.setVerticalCategoryOptionsLevel3(options)
        setfilerteredCategoryOptionsSelected(options);
        // props.setdictfileredVerticalCatComboLevel2(options_init); 
        // setSelectedKeys(options.map(option => option.value)); // Set all options to the right by default
    } else {
        props.setVerticalCategoryOptionsLevel3([]);
    }
    // console.log(selectedKeys)
    // setCategoryOptions(options);
    setLoading(false)
    if (runTwice <= 2){

      setRunTwice(runTwice + 1);

    }
  }, [props.fileredVerticalCatComboLevel3, props.selectedVerticalCategoryIDLevel3, runTwice]);

return (
    <div>
      {/* Render the Transfer component with category options */}
      <Transfer
        filterable
        filterablePicked
        loading={loading}        
        enableOrderChange
        options={props.VerticalCategoryOptionsLevel3}
        selected={selectedKeys}
        onChange={({ selected }) => {
          handleHorizontalTransferChange(selected);
          }}
        // selectedEmptyComponent={<p style={{textAlign: 'center'}}>You have not selected anything yet<br /></p>}
      />
    </div>
  );
};


VerticalTransferLevel3.propTypes = {
  VerticalCategoryOptionsLevel3: PropTypes.array.isRequired, 
  fileredVerticalCatComboLevel3: PropTypes.array.isRequired, 
  selectedDataElementId: PropTypes.string.isRequired, 
  loadedProject: PropTypes.object.isRequired, 
  isVerticalCategoryExpandedlevel3: PropTypes.bool.isRequired, 
  setdictfileredVerticalCatComboLevel3: PropTypes.func.isRequired,
  selectedDirectClickTabDE: PropTypes.number.isRequired, 
  selectedVerticalCategoryIDLevel3: PropTypes.string.isRequired, 
  editMode: PropTypes.bool.isRequired, 
  setVerticalCategoryOptionsLevel3: PropTypes.func.isRequired,
};

export default VerticalTransferLevel3;