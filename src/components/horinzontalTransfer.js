import React, { useState, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import { Transfer, TransferOption } from '@dhis2-ui/transfer';

const HorizontalTransfer = (props) => {
  // State to hold the category options
  const [categoryOptions, setCategoryOptions] = useState([]);
  // state for whether the next page's options are being loaded
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const filteredCategories = props.fileredHorizonatlCatCombo || [];

    // Extract horizontal category selected
    const selectCategory = filteredCategories.filter(category => category.id === props.selectedHorizontalCategoryID) || [];

    // Extract categoryOptions from each object
    const categoryOptionsArray = selectCategory.map(category => category.categoryOptions) || [];
    
    // Flatten the array of arrays into a single array
    const allCategoryOptions = [].concat(...categoryOptionsArray);

    // Now, allCategoryOptions contains all the category options
    // const options= allCategoryOptions?.map(option => ({
    //     value: option.id,
    //     label: option.name,
    //   })) || [];
    

    console.log('++++++++  horinzontalCategoryOptions  +++++++++')
   if (props.selectedHorizontalCategoryID !== undefined 
    && props.selectedHorizontalCategoryID !== null 
    && props.selectedHorizontalCategoryID !== '') {
        props.setHorinzontalcategoryOptions(allCategoryOptions?.map(option => ({
            value: option.id,
            label: option.name,
          })) || []
        )
    } else {
        props.setHorinzontalcategoryOptions([]);
    }
    // setCategoryOptions(options);
    setLoading(false)
  }, [props.fileredHorizonatlCatCombo, props.selectedHorizontalCategoryID]);

  return (
    <div>
      {/* Render the Transfer component with category options */}
      <Transfer
        filterable
        loading={loading}        
        enableOrderChange
        options={props.horinzontalCategoryOptions}
        onChange={({ selected }) => {
          console.log('Selected options:', selected);
          // Add your logic to handle selected options
        }}
        selectedEmptyComponent={<p style={{textAlign: 'center'}}>You have not selected anything yet<br /></p>}
      />
    </div>
  );
};

export default HorizontalTransfer;