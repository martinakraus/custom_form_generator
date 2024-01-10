import React, { useState, useEffect } from 'react';
import { SingleSelect, SingleSelectOption } from '@dhis2-ui/select';
import classes from '../App.module.css'

const VerticalCategoryLevel0 = (props) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [horizontalCategories, setHorizontalCategories] = useState([]);

  useEffect(() => {
    // Filter out the selected horizontal category - Level 2
    const filteredCategories = props.fileredVerticalCatComboLevel0 || [];

    setHorizontalCategories(filteredCategories);
   // Reset selected category when data changes
    setSelectedCategory(null);

  }, [props.fileredVerticalCatComboLevel0]);

  const handleHorizontalCategoryChange = (selected) => {
    setSelectedCategory(selected)
    const updatedCategories = horizontalCategories.filter(category => category.id !== selected);
    props.setfileredVerticalCatComboLevel1(updatedCategories)
    props.setSelectedVerticalCategoryIDLevel0(selected)
    props.setVerticalcategoryOptionsLevel0([])
    props.setHorinzontalcategoryOptionsLevel1([])
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

export default VerticalCategoryLevel0;
