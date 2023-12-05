import React, { useState, useEffect } from 'react';
import { Transfer, TransferOption } from '@dhis2-ui/transfer';

const VerticalTransfer = (props) => {
  // State to hold the category options
  const [categoryOptions, setCategoryOptions] = useState([]);
  // state for whether the next page's options are being loaded
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const filteredCategories = props.fileredVerticalCatCombo || [];

    // Extract categoryOptions from each object
    const categoryOptionsArray = filteredCategories.map(category => category.categoryOptions);

    // Flatten the array of arrays into a single array
    const allCategoryOptions = [].concat(...categoryOptionsArray);

    // Now, allCategoryOptions contains all the category options
    const options = allCategoryOptions?.map(option => ({
        value: option.id,
        label: option.name,
      })) || [];
    setCategoryOptions(options);
    setLoading(false)

  }, [props.fileredVerticalCatCombo]);

  return (
    <div>
      {/* Render the Transfer component with category options */}
      <Transfer
        filterable
        loading={loading}
        enableOrderChange
        options={categoryOptions}
        onChange={({ selected }) => {
          console.log('Selected options:', selected);
          // Add your logic to handle selected options
        }}
        selectedEmptyComponent={<p style={{textAlign: 'center'}}>You have not selected anything yet<br /></p>}
      />
    </div>
  );
};

export default VerticalTransfer;
