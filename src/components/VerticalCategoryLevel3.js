import React, { useState, useEffect } from 'react';
import { SingleSelect, SingleSelectOption } from '@dhis2-ui/select';
import classes from '../App.module.css'

const VerticalCategoryLevel3 = (props) => {

const [selectedCategory, setSelectedCategory] = useState(null);
const [horizontalCategories, setHorizontalCategories] = useState([]);
const filteredCategories = props.fileredVerticalCatComboLevel3 || [];
const [disabled, setDisabled] = useState(false)



useEffect(() => {

  }, [props.fileredVerticalCatComboLevel3, props.isVerticalCategoryExpandedlevel3]);


  const handleVerticalCategoryChange = (selected) => {
    setSelectedCategory(selected)
    props.setSelectedVerticalCategoryIDLevel3(selected)
    const SelectedCategories = filteredCategories.filter(category => category.id === selected);
    props.setSelectedVerticalCategoryNameLevel3(SelectedCategories[0].name || '')
    props.setVerticalCategoryOptionsLevel3([])
  }

  return (
    <div className={classes.baseMargin}>
      <SingleSelect
        filterable
        noMatchText="No categories found"
        placeholder="Select category"
        selected={horizontalCategories.some(category => category.id === selectedCategory) ? selectedCategory : null}
        value={horizontalCategories.some(category => category.id === selectedCategory) ? selectedCategory : null}
        onChange={({ selected }) => handleVerticalCategoryChange(selected)}
        disabled={disabled}
      >
        {horizontalCategories.map(category => (
          <SingleSelectOption key={category.id} label={category.name} value={category.id} />
        ))}
      </SingleSelect>
    </div>
  );
};

export default VerticalCategoryLevel3;