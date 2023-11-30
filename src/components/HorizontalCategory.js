import React, { useState, useEffect } from 'react';
import { SingleSelect, SingleSelectOption } from '@dhis2-ui/select';

const HorizontalCategory = (props) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [horizontalCategories, setHorizontalCategories] = useState([]);

  useEffect(() => {
    // Filter out the selected vertical category
    const filteredCategories = props.fileredHorizonatlCatCombo || [];
    setHorizontalCategories(filteredCategories);
   // Reset selected category when data changes
    setSelectedCategory(null);
  }, [props.fileredHorizonatlCatCombo]);

  return (
    <div>
      <SingleSelect
        filterable
        noMatchText="No categories found"
        placeholder="Select category"
        selected={selectedCategory}
        value={selectedCategory}
        onChange={({ selected }) => setSelectedCategory(selected)}
      >
        {horizontalCategories.map(category => (
          <SingleSelectOption key={category.id} label={category.name} value={category.id} />
        ))}
      </SingleSelect>
    </div>
  );
};

export default HorizontalCategory;
