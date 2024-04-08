import React, { useState, useEffect } from 'react';
import { Transfer } from '@dhis2-ui/transfer';
import PropTypes from 'prop-types';

const HorizontalTransferLevel1 = (props) => {
  // State to hold the category options
  const [categoryOptions, setCategoryOptions] = useState([]);
  // state for whether the next page's options are being loaded
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

    props.setdictfileredHorizontalCatComboLevel1(options_init_reordered)


  }


  useEffect(() => {
    setLoading(true)
    const filteredCategories = props.fileredHorizontalCatComboLevel1 || [];

    // Extract horizontal category selected
    const selectCategory = filteredCategories.filter(category => category.id === props.selectedHorizontalCategoryIDLevel1) || [];

    // Extract categoryOptions from each object
    const categoryOptionsArray = selectCategory.map(category => category.categoryOptions) || [];
    
    // Flatten the array of arrays into a single array
    const allCategoryOptions = [].concat(...categoryOptionsArray);


   if (props.selectedHorizontalCategoryIDLevel1 !== undefined 
    && props.selectedHorizontalCategoryIDLevel1 !== null 
    && props.selectedHorizontalCategoryIDLevel1 !== '') {

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
          const metadata = updatedDataElementsLevel1[0]?.HorizontalLevel1?.metadata?.map(option => ({
              value: option.id,
              label: option.name,
              selected: true, // Set all options to the right by default
            })) || [];

            setSelectedKeys(metadata.map(option => option.value)); // Set all options to the right by default
            handleHorizontalTransferChange(metadata.map(option => option.value))
        }else{

            setSelectedKeys(options.map(option => option.value)); // Set all options to the right by default
            props.setdictfileredHorizontalCatComboLevel1(options_init);
        }        
        props.setHorizontalcategoryOptionsLevel1(options)
        setfilerteredCategoryOptionsSelected(options);
        // props.setdictfileredHorizontalCatComboLevel1(options_init);

        // setSelectedKeys(options.map(option => option.value)); // Set all options to the right by default
    } else {
        props.setHorizontalcategoryOptionsLevel1([]);
    }
    // console.log(selectedKeys)
    // setCategoryOptions(options);
    setLoading(false)
    // Increment the counter for the number of times the effect has run. This is to handle control
    if (runTwice <= 2){

      setRunTwice(runTwice + 1);

    }
  }, [props.fileredHorizontalCatComboLevel1, props.selectedHorizontalCategoryIDLevel1, runTwice]);

  return (
    <div>
      {/* Render the Transfer component with category options */}
      <Transfer
        filterable
        filterablePicked
        loading={loading}        
        enableOrderChange
        options={props.HorizontalCategoryOptionsLevel1}
        selected={selectedKeys}
        onChange={({ selected }) => {
          handleHorizontalTransferChange(selected);
          }}
        // selectedEmptyComponent={<p style={{textAlign: 'center'}}>You have not selected anything yet<br /></p>}
      />
    </div>
  );
};


HorizontalTransferLevel1.propTypes = {
  fileredHorizontalCatComboLevel1: PropTypes.array.isRequired,
  selectedHorizontalCategoryIDLevel1: PropTypes.string, // Adjust as per your requirements
  setHorizontalcategoryOptionsLevel1: PropTypes.func.isRequired,
  HorizontalCategoryOptionsLevel1: PropTypes.array.isRequired,
  setdictfileredHorizontalCatComboLevel1: PropTypes.func.isRequired,
  loadedProject: PropTypes.object.isRequired,
  selectedDataElementId: PropTypes.string, // Adjust as per your requirements
  editMode: PropTypes.bool.isRequired
};
export default HorizontalTransferLevel1;