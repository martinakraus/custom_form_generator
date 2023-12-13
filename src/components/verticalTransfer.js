import React, { useState, useEffect } from 'react';
import { Transfer } from '@dhis2-ui/transfer';

const VerticalTransfer = (props) => {
  // State to hold the category options
  const [categoryOptions, setCategoryOptions] = useState([]);
  // state for whether the next page's options are being loaded
  const [loading, setLoading] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState([]);

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
        selected: true, // Set all options to the right by default
      })) || [];
    setCategoryOptions(options);
    setSelectedKeys(options.map(option => option.value)); // Set all options to the right by default

    setLoading(false)

  }, [props.fileredVerticalCatCombo]);

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
          setSelectedKeys(selected);
          console.log('Selected options:', selected);
          // Add your logic to handle selected options
        }}
        // selectedEmptyComponent={<p style={{textAlign: 'center'}}>You have not selected anything yet<br /></p>}
      />
    </div>
  );
};

export default VerticalTransfer;
