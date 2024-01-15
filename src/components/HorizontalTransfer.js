import React, { useState, useEffect } from 'react';
import { Transfer } from '@dhis2-ui/transfer';
import classes from '../App.module.css'

const HorizontalTransfer = (props) => {
  // State to hold the category options
  const [categoryOptions, setCategoryOptions] = useState([]);
  // state for whether the next page's options are being loaded
  const [loading, setLoading] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [filerteredCategoryOptionsSelected, setfilerteredCategoryOptionsSelected] = useState([]);
  const filteredCategories = props.fileredHorizontalCatCombo0 || [];



  
  // Function to handle the change of the selected category
  const handleVerticalTransferChange = (selected) => {
    setSelectedKeys(selected);
    // Create a new array with only necessary properties for the remaining records
    const filteredOptionsSelected = filerteredCategoryOptionsSelected
        .filter(category => selected.includes(category.value))
        .map(({ value, label }) => ({ id:value, name:label }));


    console.log('*** filerteredCategoryOptionsSelected Start 2 ******')
    console.log(filteredOptionsSelected)
    props.setdictfileredHorizontalCatCombo0(filteredOptionsSelected)
    console.log('*** filerteredCategoryOptionsSelected End 2 ******')
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
        
                  // Now, allCategoryOptions contains all the category options
        const options_init = allCategoryOptions?.map(option => ({
          id: option.id,
          name: option.name,

        })) || [];
        setCategoryOptions(options);
        setfilerteredCategoryOptionsSelected(options);
        props.setdictfileredHorizontalCatCombo0(options_init);
        setSelectedKeys(options.map(option => option.value)); // Set all options to the right by default
        setLoading(false)

  }, [props.fileredHorizontalCatCombo0]);

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
          console.log('Selected options1:', selected);

          // Add your logic to handle selected options
        }}
        // selectedEmptyComponent={<p style={{textAlign: 'center'}}>You have not selected anything yet<br /></p>}
      />
    </div>
  );
};

export default HorizontalTransfer;
