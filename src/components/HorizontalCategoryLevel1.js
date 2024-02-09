import React, { useState, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import { SingleSelect, SingleSelectOption } from '@dhis2-ui/select';
import classes from '../App.module.css'

const HorizontalCategoryLevel1 = (props) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [horizontalCategories, setHorizontalCategories] = useState([]);
  const [HorizontalCategoriesinit, setHorizontalCategoriesinit] = useState(0);

//     // Query to fetch data elements and their category information
//     const query = {
//       dataElement: {
//         resource: 'dataElements',
//         id: props.selectedDataElementId,
//         params: {
//           fields: 'id,categoryCombo[name,id,categories[id,name, categoryOptions[id,name]]]',
//         },
//       },
//     };

//   // Use the useDataQuery hook to fetch data from the DHIS2 API
//   const { loading, error, data, refetch } = useDataQuery(query);
//     // Effect to refetch data when the selectedDataElementId changes
//   useEffect(() => {
//       if (props.fileredHorizontalCatCombo0){
//         if (data && data.dataElement) {
//           console.log(data)
//           const { categoryCombo } = data.dataElement;
//           const categories1 = categoryCombo?.categories || [];
//           // Update the state with the category data
// //          setCategories(categories1);


//         }
//     console.log('********* props.fileredHorizontalCatCombo0 *********')
//     console.log(props.fileredHorizontalCatCombo0)
//       }
//   }, [props.isHorizontalCategoryExpandedLevel1]);

  useEffect(() => {
      if(props.isHorizontalCategoryExpandedLevel1){
        const filteredCategories = props.fileredHorizontalCatComboLevel1 || [];
              setHorizontalCategories(filteredCategories);
              // Clear the array
              const notSelectedCategories = [];

                
              const updatedDataElementsLevel1 = props.loadedProject.dataElements.filter(
                (element) => element.id === props.selectedDataElementId
              );
              const HorizontalCategoryObject = filteredCategories.find(
                (element) => element.id === updatedDataElementsLevel1[0]?.HorizontalLevel1?.id
              );
              const savedCategory = HorizontalCategoryObject?.id

              if (savedCategory) {
                // Populate notSelectedCategories
                notSelectedCategories.push(...filteredCategories.filter(category => category.id !== HorizontalCategoryObject.id));
                // console.log('********* notSelectedCategories *********')
                // console.log(notSelectedCategories)
                // console.log('Effect triggered! 1a');
                setSelectedCategory(HorizontalCategoryObject.id);
                props.setSelectedHorizontalCategoryIDLevel1(HorizontalCategoryObject.id);
                props.setSelectedHorizontalCategoryNameLevel1(HorizontalCategoryObject.name);
              }
              // else{
              //   setSelectedCategory(null);

              // }
              // console.log('Effect triggered! 1b');
              props.setfileredVerticalCatComboLevel1(notSelectedCategories)

              setHorizontalCategoriesinit(1)                            
        
      }
  
  }, [props.isHorizontalCategoryExpandedLevel1]); // 

  // Clear selectCategory if HL0 is changed
  useEffect(() =>{

    setSelectedCategory(null);

  },[props.fileredHorizontalCatCombo0]);


  useEffect(() => {
    // Filter out the selected horizontal category - Level 2
    const filteredCategories = props.fileredHorizontalCatComboLevel1 || [];
    setHorizontalCategories(filteredCategories);
    // console.log('Effect triggered! 2');


  }, [props.fileredHorizontalCatComboLevel1]);

  const handleVerticalLevel0CategoryChange = (selected) => {
    // console.log('Effect triggered! 3');
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
        selected={horizontalCategories.some(category => category.id === selectedCategory) ? selectedCategory : null}
        value={horizontalCategories.some(category => category.id === selectedCategory) ? selectedCategory : null}
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