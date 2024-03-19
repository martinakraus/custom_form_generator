import React, { useState, useEffect } from 'react';
import { SingleSelect, SingleSelectOption } from '@dhis2-ui/select';
import classes from '../App.module.css'
import PropTypes from 'prop-types';

const VerticalCategoryLevel2 = (props) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [horizontalCategories, setHorizontalCategories] = useState([]);
  const filteredCategories = props.fileredVerticalCatComboLevel2 || [];
  const [disabled, setDisabled] = useState(false)


  useEffect(() => {

    setHorizontalCategories(filteredCategories);

    // if(updatedDataElementsLevel1.length > 0 && selectedCategory === null){
        if(props.selectedDirectClickTabDE === 0
          ){
            const updatedDataElementsLevel1 = props.loadedProject.dataElements.filter(
              (element) => element.id === props.selectedDataElementId
            ) || [];
            if (updatedDataElementsLevel1[0].verticalLevel2.id !== null  || updatedDataElementsLevel1[0].verticalLevel2.id !== ""){
                const VerticalCategoryObject = filteredCategories.filter(
                (element) => element.id === updatedDataElementsLevel1[0]?.verticalLevel2?.id
                ) || [];
                const savedCategory = VerticalCategoryObject[0]?.id
                if (savedCategory){
                  setDisabled(true)
                  const SelectedCategories = filteredCategories.filter(category => category.id === savedCategory);
                  const notSelectedCategories = filteredCategories.filter(category => category.id !== savedCategory);
                  props.setfileredVerticalCatComboLevel3(notSelectedCategories)
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
    const notSelectedCategories = filteredCategories.filter(category => category.id !== selected);

    props.setfileredVerticalCatComboLevel3(notSelectedCategories)
    props.setSelectedVerticalCategoryNameLevel2(SelectedCategories[0].name || '')
    props.setVerticalCategoryOptionsLevel2([])



  }

  return (
    <div className={classes.baseMargin}>
      <SingleSelect
        filterable
        noMatchText="No categories found"
        placeholder="Select category"
        selected={horizontalCategories.some(category => category.id === selectedCategory) ? selectedCategory : ""}
        value={horizontalCategories.some(category => category.id === selectedCategory) ? selectedCategory : ""}
        onChange={({ selected }) => handleHorizontalCategoryChange(selected)}
        disabled={disabled}
      >
        {horizontalCategories.map(category => (
          <SingleSelectOption key={category.id} label={category.name} value={category.id} />
        ))}
      </SingleSelect>
    </div>
  );
};


VerticalCategoryLevel2.propTypes = {
  fileredVerticalCatComboLevel2: PropTypes.array.isRequired, // Adjust as per your requirements
  setSelectedVerticalCategoryNameLevel2: PropTypes.func.isRequired,
  setSelectedVerticalCategoryIDLevel2: PropTypes.func.isRequired,
  setVerticalCategoryOptionsLevel2: PropTypes.func.isRequired,
  selectedVerticalCategoryIDLevel1: PropTypes.string.isRequired, // Adjust as per your requirements
  loadedProject: PropTypes.object.isRequired, // Adjust as per your requirements
  selectedDataElementId: PropTypes.string.isRequired, // Adjust as per your requirements
  isVerticalCategoryExpandedlevel2: PropTypes.bool.isRequired,
  selectedDirectClickTabDE: PropTypes.number.isRequired, // Adjust as per your requirements
  setfileredVerticalCatComboLevel3: PropTypes.func.isRequired,
};
export default VerticalCategoryLevel2;

