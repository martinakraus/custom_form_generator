import React, { useState, useEffect } from 'react';
import { SingleSelect, SingleSelectOption } from '@dhis2-ui/select';
import classes from '../App.module.css'

const VerticalCategoryLevel2 = (props) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [horizontalCategories, setHorizontalCategories] = useState([]);
  const filteredCategories = props.fileredVerticalCatComboLevel2 || [];

  useEffect(() => {
    // Filter out the selected vertical category

    setHorizontalCategories(filteredCategories);

   // Reset selected category when data changes
    setSelectedCategory(null);
  }, [props.fileredVerticalCatComboLevel1, props.selectedVerticalCategoryIDLevel1]);

  const handleHorizontalCategoryChange = (selected) => {
    setSelectedCategory(selected)
    props.setSelectedVerticalCategoryIDLevel2(selected)
    const SelectedCategories = filteredCategories.filter(category => category.id === selected);
    props.setSelectedVerticalCategoryNameLevel2(SelectedCategories[0].name || '')
    props.setVerticalCategoryOptionsLevel2([])
  }

  return (
    <div className={classes.baseMargin}>
      <SingleSelect
        filterable
        noMatchText="No categories found"
        placeholder="Select category"
        selected={selectedCategory}
        value={selectedCategory}
        onChange={({ selected }) => handleHorizontalCategoryChange(selected)}
      >
        {horizontalCategories.map(category => (
          <SingleSelectOption key={category.id} label={category.name} value={category.id} />
        ))}
      </SingleSelect>
    </div>
  );
};

export default VerticalCategoryLevel2;
