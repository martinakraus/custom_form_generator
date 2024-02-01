import React, { useState, useEffect } from 'react';
import { SingleSelect, SingleSelectOption } from '@dhis2-ui/select';
import classes from '../App.module.css'

const VerticalCategoryLevel1 = (props) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [horizontalCategories, setHorizontalCategories] = useState([]);
  const filteredCategories = props.fileredVerticalCatComboLevel1 || [];

  useEffect(() => {
    // Filter out the selected vertical category
    // console.log(filteredCategories)
    setHorizontalCategories(filteredCategories);
    if (props.editMode){
      const updatedDataElementsLevel1 = props.loadedProject.dataElements.filter(
        (element) => element.id === props.selectedDataElementId
      );
      const VerticalCategoryObject = filteredCategories.filter(
      (element) => element.id === updatedDataElementsLevel1[0]?.verticalLevel1?.id
      ) || [];

      const savedCategory = VerticalCategoryObject[0]?.id
      if (savedCategory){
        const notSelectedCategories = filteredCategories.filter(category => category.id !== savedCategory);
        props.setfileredVerticalCatComboLevel2(notSelectedCategories)

        const SelectedCategories = filteredCategories.filter(category => category.id === savedCategory);
        props.setSelectedVerticalCategoryNameLevel1(SelectedCategories[0].name)
        props.setSelectedVerticalCategoryIDLevel1(savedCategory)
        setSelectedCategory(savedCategory)
      }
    }
   // Reset selected category when data changes
    // suspended setSelectedCategory(null);
  }, [props.fileredVerticalCatComboLevel1, props.isVerticalCategoryExpandedlevel1]);

  const handleHorizontalCategoryChange = (selected) => {
    setSelectedCategory(selected)
    props.setSelectedVerticalCategoryIDLevel1(selected)
    const notSelectedCategories = filteredCategories.filter(category => category.id !== selected);
    props.setfileredVerticalCatComboLevel2(notSelectedCategories)
    const SelectedCategories = filteredCategories.filter(category => category.id === selected);
    props.setSelectedVerticalCategoryNameLevel1(SelectedCategories[0].name)
    props.setVerticalCategoryOptionsLevel1([])
    props.setdictfileredVerticalCatComboLevel2([])
  }

  return (
    <div className={classes.baseMargin}>
      <SingleSelect
        filterable
        noMatchText="No categories found"
        placeholder="Select category"
        selected={horizontalCategories.some(category => category.id === selectedCategory) ? selectedCategory : null}
        value={horizontalCategories.some(category => category.id === selectedCategory) ? selectedCategory : null}
        onChange={({ selected }) => handleHorizontalCategoryChange(selected)}
      >
        {horizontalCategories.map(category => (
          <SingleSelectOption key={category.id} label={category.name} value={category.id} />
        ))}
      </SingleSelect>
    </div>
  );
};

export default VerticalCategoryLevel1;
