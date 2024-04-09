import React, { useState, useEffect } from 'react';
import { SingleSelect, SingleSelectOption } from '@dhis2-ui/select'
import classes from '../App.module.css'
import PropTypes from 'prop-types'
import { IconInfo16 } from '@dhis2/ui-icons'; 

import level6Guide from '../images/level6.png'

const VerticalCategoryLevel4 = (props) => {

const [selectedCategory, setSelectedCategory] = useState("");
const [horizontalCategories, setHorizontalCategories] = useState([]);
const filteredCategories = props.fileredVerticalCatComboLevel4 || [];
const [disabled, setDisabled] = useState(false)
const [showGuide, setShowGuide] = useState(false);

const toggleGuide = () => {
  setShowGuide(!showGuide);
};


// console.log('VC4 props.fileredVerticalCatComboLevel4: ', props.fileredVerticalCatComboLevel4)

useEffect(() => {

  setHorizontalCategories(filteredCategories);
  if(props.selectedDirectClickTabDE === 0
    ){
      const updatedDataElementsLevel1 = props.loadedProject.dataElements.filter(
        (element) => element.id === props.selectedDataElementId
      ) || [];
      if (updatedDataElementsLevel1[0].verticalLevel4?.id !== null || updatedDataElementsLevel1[0].verticalLevel4?.id !== "" || updatedDataElementsLevel1[0].verticalLevel4?.id !== undefined){
          const VerticalCategoryObject = filteredCategories.filter(
          (element) => element.id === updatedDataElementsLevel1[0]?.verticalLevel4?.id
          ) || [];
          const savedCategory = VerticalCategoryObject[0]?.id
          if (savedCategory){
            setDisabled(true)
            const SelectedCategories = filteredCategories.filter(category => category.id === savedCategory);
            // const notSelectedCategories = filteredCategories.filter(category => category.id !== savedCategory);
            // console.log('********* notSelectedCategories *********')
            // console.log(notSelectedCategories)
            // props.setfileredVerticalCatComboLevel3(notSelectedCategories)
            props.setSelectedVerticalCategoryIDLevel4(savedCategory)
            props.setSelectedVerticalCategoryNameLevel4(SelectedCategories[0].name || '')
            setSelectedCategory(savedCategory)

          }

      }
    }

  }, [props.fileredVerticalCatComboLevel4, props.isVerticalCategoryExpandedlevel4]);


  const handleVerticalCategoryChange = (selected) => {
    setSelectedCategory(selected)
    props.setSelectedVerticalCategoryIDLevel4(selected)
    const SelectedCategories = filteredCategories.filter(category => category.id === selected);
    props.setSelectedVerticalCategoryNameLevel4(SelectedCategories[0].name || '')
    props.setVerticalCategoryOptionsLevel4([])


    
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
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      padding: '10px',
                      borderRadius: '4px',
                      zIndex: 999,
                    }}
                  >
                      <img src={level6Guide} alt="Guide" />
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

VerticalCategoryLevel4.propTypes = {
  fileredVerticalCatComboLevel4: PropTypes.array.isRequired,
  setSelectedVerticalCategoryNameLevel4: PropTypes.func.isRequired,
  setSelectedVerticalCategoryIDLevel4: PropTypes.func.isRequired,
  setVerticalCategoryOptionsLevel4: PropTypes.func.isRequired,
  selectedVerticalCategoryIDLevel3: PropTypes.string.isRequired,
  loadedProject: PropTypes.object.isRequired,
  selectedDataElementId: PropTypes.string.isRequired,
  isVerticalCategoryExpandedlevel4: PropTypes.bool.isRequired,
  selectedDirectClickTabDE: PropTypes.number.isRequired,
};

export default VerticalCategoryLevel4;