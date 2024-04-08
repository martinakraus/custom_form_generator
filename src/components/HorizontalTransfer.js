import React, { useState, useEffect } from 'react';
import { Transfer } from '@dhis2-ui/transfer';
import PropTypes from 'prop-types';


const HorizontalTransfer = (props) => {
  // State to hold the category options
  const [categoryOptions, setCategoryOptions] = useState([]);
  // state for whether the next page's options are being loaded
  const [loading, setLoading] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [filerteredCategoryOptionsSelected, setfilerteredCategoryOptionsSelected] = useState([]);
  const filteredCategories = props.fileredHorizontalCatCombo0 || [];
  const [runTwice, setRunTwice] = useState(0); // Track how many times the effect has run


  // console.log('Init fileredHorizontalCatCombo0')
  // console.log(props.fileredHorizontalCatCombo0)



  
  // Function to handle the change of the selected category
  const handleVerticalTransferChange = (selected) => {

    setSelectedKeys(selected);
    // Create a new array with only necessary properties for the remaining records
    const filteredOptionsSelected = filerteredCategoryOptionsSelected
        .filter(category => selected.includes(category.value))
        .map(({ value, label }) => ({ id:value, name:label }));


    
    const options_init_reordered = selected.map(id => filteredOptionsSelected.find(option => option.id === id));
    props.setdictfileredHorizontalCatCombo0(options_init_reordered)

  }

  useEffect(() => {
        setLoading(true)
        // Extract categoryOptions from each object
        const categoryOptionsArray = filteredCategories.map(category => category.categoryOptions);

        // Flatten the array of arrays into a single array
        const allCategoryOptions = [].concat(...categoryOptionsArray);

        // Now, allCategoryOptions contains all the category options
        const options = allCategoryOptions?.map(option => ({
            value: option.id,
            label: option.name,
            selected: true, // Set all options to the right by default
          })) || [];

        setfilerteredCategoryOptionsSelected(options);


                  // Now, allCategoryOptions contains all the category options
        const options_init = allCategoryOptions?.map(option => ({
          id: option.id,
          name: option.name,

        })) || [];





        if (props.editMode){
          const updatedDataElementsLevel1 = props.loadedProject.dataElements.filter(
            (element) => element.id === props.selectedDataElementId
          );

          const metadata = updatedDataElementsLevel1[0]?.HorizontalLevel0?.metadata?.map(option => ({
              value: option.id,
              label: option.name,
              selected: true, // Set all options to the right by default
            })) || [];

            setSelectedKeys(metadata.map(option => option.value)); // Set all options to the right by default
            
            handleVerticalTransferChange(metadata.map(option => option.value))
       
        }else{

            setSelectedKeys(options.map(option => option.value)); // Set all options to the right by default
            props.setdictfileredHorizontalCatCombo0(options_init);
        }
        // setCategoryOptions(options);
        setCategoryOptions(options); 
        // props.setdictfileredHorizontalCatCombo0(options_init);
        // console.log(options.map(option => option.value))
        setLoading(false)

        // Increment the counter for the number of times the effect has run. This is to handle control
        if (runTwice <= 2){

          setRunTwice(runTwice + 1);

        }
        
  }, [props.fileredHorizontalCatCombo0, runTwice]);


  return (
    <div>
      {/* Render the Transfer component with category options */}
      <Transfer
        filterable
        filterablePicked
        loading={loading}
        enableOrderChange
        options={categoryOptions}
        selected={selectedKeys}
        onChange={({ selected }) => {
          handleVerticalTransferChange(selected);
          // Add your logic to handle selected options
        }}
        // selectedEmptyComponent={<p style={{textAlign: 'center'}}>You have not selected anything yet<br /></p>}
      />
    </div>
  );
};
HorizontalTransfer.propTypes = {
  fileredHorizontalCatCombo0: PropTypes.array.isRequired,
  setdictfileredHorizontalCatCombo0: PropTypes.func.isRequired,
  loadedProject: PropTypes.object.isRequired,
  selectedDataElementId: PropTypes.string, 
  editMode: PropTypes.bool.isRequired,
  isHorizontalCategoryExpanded0: PropTypes.bool.isRequired
};

export default HorizontalTransfer;
