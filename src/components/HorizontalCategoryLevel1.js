import React, { useState, useEffect } from 'react';
import { SingleSelect, SingleSelectOption } from '@dhis2-ui/select';
import classes from '../App.module.css'

const HorizontalCategoryLevel1 = (props) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [horizontalCategories, setHorizontalCategories] = useState([]);

  useEffect(() => {
    // Filter out the selected horizontal category - Level 2
    const filteredCategories = props.fileredHorizontalCatComboLevel1 || [];

    setHorizontalCategories(filteredCategories);
   // Reset selected category when data changes
    setSelectedCategory(null);

  }, [props.fileredHorizontalCatComboLevel1]);

  const handleVerticalLevel0CategoryChange = (selected) => {
    setSelectedCategory(selected)
    const notSelectedCategories = horizontalCategories.filter(category => category.id !== selected);
    const SelectedCategories = horizontalCategories.filter(category => category.id === selected);
    props.setfileredVerticalCatComboLevel1(notSelectedCategories)
    props.setSelectedHorizontalCategoryNameLevel1(SelectedCategories[0].name)
    props.setSelectedHorizontalCategoryIDLevel1(selected)
    props.setHorizontalcategoryOptionsLevel1([])
    props.setVerticalCategoryOptionsLevel1([])
    props.setdictfileredVerticalCatComboLevel1([])
  }

  return (
    <div className={classes.baseMargin}>
      <SingleSelect
        filterable
        noMatchText="No categories found"
        placeholder="Select category"
        selected={selectedCategory}
        value={selectedCategory}
        onChange={({ selected }) => handleVerticalLevel0CategoryChange(selected)}
      >
        {horizontalCategories.map(category => (
          <SingleSelectOption key={category.id} label={category.name} value={category.id} />
        ))}
      </SingleSelect>
    </div>
  );
};

export default HorizontalCategoryLevel1;
