import React, { useState, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import { SingleSelect, SingleSelectOption } from '@dhis2-ui/select';
import classes from '../App.module.css'
import { queryCatCombo } from '../utils';

const HorizontalCategory = (props) => {
  // State to hold the categories
  const [categories, setCategories] = useState([]);
  // State to hold the selected category
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dataElemntID, setDataElement] = useState(props.selectedDataElementId)
  const [disabled, setDisabled] = useState(false)


    // Query to fetch data elements and their category information
    const query = {
      dataElement: {
        resource: 'dataElements',
        id: props.selectedDataElementId,
        params: {
          fields: 'id,dataSetElements,categoryCombo[name,id,categories[id,name, categoryOptions[id,name]]]',
        },
      },

      categoryCombo: {
        resource: 'categoryCombos',
        params: ({categoryCombo})=>({
          fields: 'id,name,categories[id,name,categoryOptions[id,name]]',
          filter: `id:eq:${categoryCombo}`,
        }),
      },

    };

        // Query to fetch data elements and their category information
    const DataQuery = {
      dataElement: {
        resource: 'dataElements',
        id: ({ id }) => id,
        params: {
          fields: 'id,dataSetElements,categoryCombo[name,id,categories[id,name, categoryOptions[id,name]]]',
        },
      },
    };
    




  const { data: catData, refetch:catRefresh } = useDataQuery(DataQuery, {variables: {id: props.selectedDataElementId}})
  const { loading, error, data, refetch } = useDataQuery(query, {variables: {
    dataElementID: props.selectedDataElementId,                                                                            
    categoryCombo: props.overidingCategory}
  });
  // if (catData){

  //   console.log(catData)
  // }
  useEffect(() => {
    catRefresh({id: props.selectedDataElementId})    
    // console.log('catData: ',catData)
    // console.log('data: ',data)  
    setDataElement(props.selectedDataElementId)
  },[catRefresh])

  useEffect(() => {
    catRefresh({id: props.selectedDataElementId}) 
    loader()
  },[props.isHorizontalCategoryExpanded0,props.selectedDataElementId, dataElemntID, catRefresh])



  

  // Function to handle the change of the selected category
  const handleVerticalCategoryChange = (selected) => {
    // Set the selected category in the state
    setSelectedCategory(selected);
    props.setSelectedHorizontalCategoryID0(selected);
    // categories not selected
    const updatedCategories = categories.filter(category => category.id !== selected);

    // Add logic to get the array of the select category
    const selectedCategory1 = categories.filter(category => category.id === selected);
    // console.log(updatedCategories)

    // Update the state with the filtered categories
    props.setfileredHorizontalCatComboLevel1([]);
    props.setHorizontalcategoryOptionsLevel1([]);
    props.setSelectedHorizontalCategoryIDLevel1([]);
    props.setfileredHorizontalCatComboLevel1(updatedCategories);
    props.setfileredHorizontalCatCombo0(selectedCategory1);
    props.setSelectedHorizontalCategoryName0(selectedCategory1[0].name)


    props.setdictfileredHorizontalCatComboLevel1([])

    // Update the state with the filtered categories Vertical 1
    // props.setfileredVerticalCatComboLevel1([]);
    props.setVerticalCategoryOptionsLevel1([]);
    props.setSelectedVerticalCategoryIDLevel1([]);

     // Update the state with the filtered categories Vertical 2
     props.setfileredVerticalCatComboLevel2([]);
     props.setVerticalCategoryOptionsLevel2([]);
     props.setSelectedVerticalCategoryIDLevel2([]);  

  };

  // implement componet core logic
  const loader = () => {
    setDataElement(props.selectedDataElementId)   
    setCategories([]); 
      if (data){
          // the selected dataElement with the specified ID
          if (props.loadedProject.dataElements){
            const updatedDataElements = props.loadedProject.dataElements.filter(
                  (element) => element.id === props.selectedDataElementId
              );   


            let categories1 = []
            // console.log('*** overidingCategory ***')
            // console.log(props.overidingCategory)
            // console.log('catData: ',catData)
            // console.log('data: ',data)  
            if (data && data?.categoryCombo?.categoryCombos[0]){
              categories1 = data?.categoryCombo?.categoryCombos[0]?.categories || [];
              props.setCategoryComboNameID({ id: data?.categoryCombo?.categoryCombos[0]?.id ?? '', name: data?.categoryCombo?.categoryCombos[0]?.name ?? '' });
              setCategories(categories1);
              
            }
            else{
              const { categoryCombo } = catData?.dataElement;
              categories1 = categoryCombo?.categories || [];
              props.setCategoryComboNameID({ id: categoryCombo?.id ?? '', name: categoryCombo?.name ?? '' })
              setCategories(categories1);
            }
            
            
            if (props.editMode){    
            const HorizontalCategoryObject = categories1.filter(
              (element) => element.id === updatedDataElements[0].HorizontalLevel0.id
            ) || [];
    
            const savedCategory = HorizontalCategoryObject[0].id
            props.setSelectedHorizontalCategoryID0(savedCategory);
            const updatedCategories = categories1.filter(category => category.id !== savedCategory);
            // Add logic to get the array of the select category
            const selectedCategory1 = categories1.filter(category => category.id === savedCategory);
            // console.log(updatedCategories)
            if (savedCategory !== null || savedCategory !== '')
            {
              setDisabled(true)
            }

            setSelectedCategory(savedCategory);
            // Use the state updater function to ensure you have the latest state
            props.setfileredHorizontalCatComboLevel1([])
            props.setfileredHorizontalCatComboLevel1(updatedCategories);
            props.setfileredHorizontalCatCombo0(selectedCategory1);
            props.setSelectedHorizontalCategoryName0(selectedCategory1[0].name)
        }    
      }
    }
  }





  useEffect(() => {
    setDataElement(props.selectedDataElementId)

    if (props.selectedDataElementId) {
      // console.log('DataElement Changed refetched:' ,props.selectedDataElementId)

      refetch({dataElementID: dataElemntID, categoryCombo: props.overidingCategory});
    
    }
    // console.log(data)

  },[props.selectedDataElementId, refetch])

  useEffect(() => {

    setDataElement(props.selectedDataElementId)
    // refetch({dataElementID: dataElemntID,  categoryCombo: props.overidingCategory});
    // loader()
  
  }, [props.selectedDataElementId, refetch]);
  

  
   



  
  // Effect to refetch data when the selectedDataElementId changes
  useEffect(() => {
    
    refetch({dataElementID: props.selectedDataElementId,  categoryCombo: props.overidingCategory});

    if (!props.editMode){ 

      setSelectedCategory(null);
    }

  }, [props.selectedDataElementId, props.overidingCategory]);

  // Render the component

  if (error) {
    console.log(error)
    return <span>ERROR: {error.message}</span>
  }

  if (loading) {
      return <span>Loading...</span>
  }
  return (
    <div className={classes.baseMargin}>
      {/* Render the SingleSelect component with category options */}
      <SingleSelect
        filterable
        noMatchText="No categories found"
        placeholder="Select category"
        selected={categories.some(category => category.id === selectedCategory) ? selectedCategory : null}
        value={categories.some(category => category.id === selectedCategory) ? selectedCategory : null}
        onChange={({ selected }) => handleVerticalCategoryChange(selected)}
        disabled={disabled}

      >
        {categories.map(category => (
          <SingleSelectOption key={category.id} label={category.name} value={category.id} />
        ))}


      </SingleSelect>
    </div>
  );
};

export default HorizontalCategory;

