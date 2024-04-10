import React, { useState, useEffect } from 'react';
import { SingleSelect, SingleSelectOption } from '@dhis2-ui/select'
import classes from '../App.module.css'
import PropTypes from 'prop-types'
import { IconInfo16 } from '@dhis2/ui-icons'; 


import level5Guide from '../images/level5.png'


const VerticalCategoryLevel3 = (props) => {

const [selectedCategory, setSelectedCategory] = useState("");
const [horizontalCategories, setHorizontalCategories] = useState([]);
const filteredCategories = props.fileredVerticalCatComboLevel3 || [];
const [disabled, setDisabled] = useState(false)

const [showGuide, setShowGuide] = useState(false);

const toggleGuide = () => {
  setShowGuide(!showGuide);
};

useEffect(() => {

  setHorizontalCategories(filteredCategories);


  if(props.selectedDirectClickTabDE === 0
    ){
      const updatedDataElementsLevel1 = props.loadedProject.dataElements.filter(
        (element) => element.id === props.selectedDataElementId
      ) || [];
      if (updatedDataElementsLevel1[0]?.verticalLevel3?.id !== null || updatedDataElementsLevel1[0]?.verticalLevel3?.id !== ""){
          const VerticalCategoryObject = filteredCategories.filter(
          (element) => element.id === updatedDataElementsLevel1[0]?.verticalLevel3?.id
          ) || [];
          const savedCategory = VerticalCategoryObject[0]?.id
          if (savedCategory){
            setDisabled(true)
            const SelectedCategories = filteredCategories.filter(category => category.id === savedCategory);
            const notSelectedCategories = filteredCategories.filter(category => category.id !== savedCategory);
            props.setfileredVerticalCatComboLevel4(notSelectedCategories)
            props.setSelectedVerticalCategoryIDLevel3(savedCategory)
            props.setSelectedVerticalCategoryNameLevel3(SelectedCategories[0].name || '')
            setSelectedCategory(savedCategory)

          }

      }
    }

  }, [props.fileredVerticalCatComboLevel3, props.isVerticalCategoryExpandedlevel3]);


  const handleVerticalCategoryChange = (selected) => {
    setSelectedCategory(selected)
    props.setSelectedVerticalCategoryIDLevel3(selected)
    const SelectedCategories = filteredCategories.filter(category => category.id === selected);
    const notSelectedCategories = filteredCategories.filter(category => category.id !== selected);
    props.setfileredVerticalCatComboLevel4(notSelectedCategories)
    props.setSelectedVerticalCategoryNameLevel3(SelectedCategories[0].name || '')
    props.setVerticalCategoryOptionsLevel3([])
    
  }

  return (
    <div className={classes.baseMargin}>
                  {(props.selectedDataElementId.length > 0) && (<div className={classes.customImageContainer}  style={{ cursor: 'pointer' }}
                        onMouseEnter={toggleGuide}
                        onMouseLeave={toggleGuide}>
                                    {/* {showGuide && ( )}*/}
                      <div>
                      <IconInfo16 alt="Guide" />
                       
                      </div>
                
            </div>)}

            <div style={{ position: 'relative', display: 'inline-block' }}>

                {showGuide && (
                  <div className={classes.guideContent}
                  >
                      <img src={level5Guide} alt="Guide" />
                  </div>
                )}
            </div>
      <SingleSelect
        filterable
        noMatchText="No categories found"
        placeholder="Select category"
        selected={horizontalCategories.some(category => category.id === selectedCategory) ? selectedCategory : ""}
        value={horizontalCategories.some(category => category.id === selectedCategory) ? selectedCategory : ""}
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

VerticalCategoryLevel3.propTypes = {
  fileredVerticalCatComboLevel3: PropTypes.array.isRequired,
  setSelectedVerticalCategoryNameLevel3: PropTypes.func.isRequired,
  setSelectedVerticalCategoryIDLevel3: PropTypes.func.isRequired,
  setVerticalCategoryOptionsLevel3: PropTypes.func.isRequired,
  selectedVerticalCategoryIDLevel2: PropTypes.string.isRequired,
  loadedProject: PropTypes.object.isRequired,
  selectedDataElementId: PropTypes.string.isRequired,
  isVerticalCategoryExpandedlevel3: PropTypes.bool.isRequired,
  selectedDirectClickTabDE: PropTypes.number.isRequired,
};

export default VerticalCategoryLevel3;