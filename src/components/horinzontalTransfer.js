import React, { useState, useEffect } from 'react';
import { Transfer } from '@dhis2-ui/transfer';

const HorizontalTransfer = (props) => {
  // State to hold the category options
  const [categoryOptions, setCategoryOptions] = useState([]);
  // state for whether the next page's options are being loaded
  const [loading, setLoading] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState([]);

  useEffect(() => {
    setLoading(true)
    const filteredCategories = props.fileredHorizonatlCatCombo || [];

    // Extract horizontal category selected
    const selectCategory = filteredCategories.filter(category => category.id === props.selectedHorizontalCategoryID) || [];

    // Extract categoryOptions from each object
    const categoryOptionsArray = selectCategory.map(category => category.categoryOptions) || [];
    
    // Flatten the array of arrays into a single array
    const allCategoryOptions = [].concat(...categoryOptionsArray);

    console.log('++++++++  horinzontalCategoryOptions  +++++++++')
   if (props.selectedHorizontalCategoryID !== undefined 
    && props.selectedHorizontalCategoryID !== null 
    && props.selectedHorizontalCategoryID !== '') {

        const options = allCategoryOptions?.map(option => ({
            value: option.id,
            label: option.name,
          })) || [];
        
        props.setHorinzontalcategoryOptions(options)
        setSelectedKeys(options.map(option => option.value)); // Set all options to the right by default
    } else {
        props.setHorinzontalcategoryOptions([]);
    }
    console.log(selectedKeys)
    // setCategoryOptions(options);
    setLoading(false)
  }, [props.fileredHorizonatlCatCombo, props.selectedHorizontalCategoryID]);

  return (
    <div>
      {/* Render the Transfer component with category options */}
      <Transfer
        filterable
        filterablePicked
        loading={loading}        
        enableOrderChange
        options={props.horinzontalCategoryOptions}
        selected={selectedKeys}
        onChange={({ selected }) => {
            setSelectedKeys(selected);
            console.log('Selected options:', selected);
            // Add your logic to handle selected options
          }}
        // selectedEmptyComponent={<p style={{textAlign: 'center'}}>You have not selected anything yet<br /></p>}
      />
    </div>
  );
};

export default HorizontalTransfer;