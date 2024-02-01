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



    // if(updatedDataElementsLevel1.length > 0 && selectedCategory === null){
        if(props.selectedDirectClickTabDE === 0
          ){
            const updatedDataElementsLevel1 = props.loadedProject.dataElements.filter(
              (element) => element.id === props.selectedDataElementId
            ) || [];
            if (updatedDataElementsLevel1[0].verticalLevel2.id !== null){
                const VerticalCategoryObject = filteredCategories.filter(
                (element) => element.id === updatedDataElementsLevel1[0]?.verticalLevel2?.id
                ) || [];
                const savedCategory = VerticalCategoryObject[0]?.id
                if (savedCategory){

                  const SelectedCategories = filteredCategories.filter(category => category.id === savedCategory);
                  console.log(savedCategory);
                  props.setSelectedVerticalCategoryIDLevel2(savedCategory)
                  props.setSelectedVerticalCategoryNameLevel2(SelectedCategories[0].name || '')
                  setSelectedCategory(savedCategory)

                }

            }
          }
    // }
   // Reset selected category when data changes
    // suspended setSelectedCategory(null);
  }, [props.isVerticalCategoryExpandedlevel2]); //props.fileredVerticalCatComboLevel1, props.selectedVerticalCategoryIDLevel1, 

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

export default VerticalCategoryLevel2;