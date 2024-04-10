import React, { useState, useEffect } from 'react';
import { SingleSelect, SingleSelectOption } from '@dhis2-ui/select';
import classes from '../App.module.css'
import PropTypes from 'prop-types';
import { IconInfo16 } from '@dhis2/ui-icons'; 
import level3Guide from '../images/level3.png'


const VerticalCategoryLevel1 = (props) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [horizontalCategories, setHorizontalCategories] = useState([]);
  const filteredCategories = props.fileredVerticalCatComboLevel1 || [];
  const [disabled, setDisabled] = useState(false)

  const [showGuide, setShowGuide] = useState(false);

  const toggleGuide = () => {
    setShowGuide(!showGuide);
  };

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
        setDisabled(true)
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
                      <img src={level3Guide} alt="Guide" />
                  </div>
                )}
            </div>
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

VerticalCategoryLevel1.propTypes = {
  fileredVerticalCatComboLevel1: PropTypes.array.isRequired, // Adjust as per your requirements
  setfileredVerticalCatComboLevel2: PropTypes.func.isRequired,
  setSelectedVerticalCategoryNameLevel1: PropTypes.func.isRequired,
  setSelectedVerticalCategoryIDLevel1: PropTypes.func.isRequired,
  setVerticalCategoryOptionsLevel1: PropTypes.func.isRequired,
  setdictfileredVerticalCatComboLevel2: PropTypes.func.isRequired,
  loadedProject: PropTypes.object.isRequired, // Adjust as per your requirements
  editMode: PropTypes.bool.isRequired,
  selectedDataElementId: PropTypes.string.isRequired, // Adjust as per your requirements
  isVerticalCategoryExpandedlevel1: PropTypes.bool.isRequired
};

export default VerticalCategoryLevel1;
