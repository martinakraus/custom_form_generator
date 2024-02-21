import React, { useState, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import { SingleSelect, SingleSelectOption } from '@dhis2-ui/select';
import classes from '../App.module.css'

const HorizontalCategory = (props) => {
  // State to hold the categories
  const [categories, setCategories] = useState([]);
  // State to hold the selected category
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [OveridingCategory, setOveridingCategory] = useState('b0EfdIXN9Xm');
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

      dataSet: {
        resource: 'dataSets',
        params: ({dataSet})=>({
          fields: 'id,name',
          filter: `id:eq:${dataSet}`,
        }),
      },

      categoryCombo: {
        resource: 'categoryCombos',
        params: ({categoryCombo})=>({
          fields: 'id,name,categories[id,name,categoryOptions[id,name]]',
          filter: `id:eq:${categoryCombo}`,
        }),
      },


    };

    const CatComboQuery = {
      categoryCombo: {
        resource: 'categoryCombos',
      },
    };

    // id: OveridingCategory,
    // params: ({categoryComboID})=>({
    //   fields: 'name,id,categories[id,name,categoryOptions[id,name]]',
    // }),
  const dataSets = {
    dataSet: {
      resource: 'dataSets/zfqH7p6T66Z?fields=id,name,dataSetElements(dataElement(id,displayName,categoryCombo[name,id]))',
      params: {
        paging: 'false',
      },
    },
  }
  // `dataStore/${config.dataStoreTemplates}?${TemplateFilter}&filter=projectID:eq:${props.loadedProjectid}`,

  // id: props.selectedDataElementId,

  // params: ({dataElementID})=>({
  //   fields: 'id,categoryCombo[name,id]',
  //   filter: `id:eq:${dataElementID}`,
  // }),
  // Use the useDataQuery hook to fetch data from the DHIS2 API
  const { loading, error, data, refetch } = useDataQuery(query, {variables: {
                                                                              dataElementID: props.selectedDataElementId, 
                                                                              dataSet: props.selectedDataSet, 
                                                                              categoryCombo: 'b0EfdIXN9Xm'}
                                                                            });
                                                                            
  const { loading2, error2, data2, refetch2 } = useDataQuery(dataSets);
  const { loading3, error3, data3, refetch3 } = useDataQuery(CatComboQuery, {variables: {categoryComboID: 'b0EfdIXN9Xm'}});

  console.log('******* data1 *********')
  console.log(props.selectedDataSet)
  if (data){
      console.log(data)
  }

  console.log('******* data3 b0EfdIXN9Xm Start *********')
  if (error3){

    console.log(error3)
  }
  console.log(OveridingCategory)
      console.log(data3)
  console.log('******* data3 b0EfdIXN9Xm End *********')
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
    props.setfileredVerticalCatComboLevel1([]);
    props.setVerticalCategoryOptionsLevel1([]);
    props.setSelectedVerticalCategoryIDLevel1([]);

     // Update the state with the filtered categories Vertical 2
     props.setfileredVerticalCatComboLevel2([]);
     props.setVerticalCategoryOptionsLevel2([]);
     props.setSelectedVerticalCategoryIDLevel2([]);


   

  };

  // implement componet core logic
  const loader = () => {

    
      if (data){
        // the selected dataElement with the specified ID
        if (props.loadedProject.dataElements){
          const updatedDataElements = props.loadedProject.dataElements.filter(
                (element) => element.id === props.selectedDataElementId
            );
    
          const { categoryCombo } = data.dataElement;
          const { dataSetElements } = data.dataElement;

          const categoryComboIds = dataSetElements
              .filter(element => element.dataSet.id === props.selectedDataSet && element.categoryCombo)
              .map(element => element.categoryCombo.id);

          if (categoryComboIds.length > 0){
            console.log('**** categoryComboIds Start*****')

            console.log(categoryComboIds[0]); // Output: ['b0EfdIXN9Xm']

            console.log('**** categoryComboIds End*****')
          }
          const categories1 = categoryCombo?.categories || [];
          setCategories(categories1);
          if (props.editMode){    
          const HorizontalCategoryObject = categories1.filter(
            (element) => element.id === updatedDataElements[0].HorizontalLevel0.id
          ) || [];
    
          //if (intialselectedCategoryControl === 0){
                    // Update the state with the category data

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
          //}
        }    
      }
    }
  }

    // Effect to process data when it is fetched
  useEffect(() => {
    if (!props.editMode){
      if (data && data.dataElement) {
        // console.log(data)
        const { categoryCombo } = data.dataElement;
        const categories1 = categoryCombo?.categories || [];
        // Update the state with the category data
        setCategories(categories1);

      }
      loader()
    }

  }, [data]);
    
  // Run on expand
  useEffect(() => {

    loader()
    console.log('Processing dataElement ....')


  },[props.isHorizontalCategoryExpanded0, props.selectedDataElementId])


  
  // Effect to refetch data when the selectedDataElementId changes
  useEffect(() => {
    if (props.selectedDataElementId) {
      refetch({dataElementID: props.selectedDataElementId});
    }
    if (!props.editMode){ 

      setSelectedCategory(null);
    }

  }, [props.selectedDataElementId]);

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

