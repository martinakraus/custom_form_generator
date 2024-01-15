import React, { useState, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import { SingleSelect, SingleSelectOption } from '@dhis2-ui/select';
import classes from '../App.module.css'

const HorizontalCategory = (props) => {
  // State to hold the categories
  const [categories, setCategories] = useState([]);
  // State to hold the selected category
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Query to fetch data elements and their category information
  const query = {
    dataElement: {
      resource: 'dataElements',
      id: props.selectedDataElementId,
      params: {
        fields: 'id,categoryCombo[name,id,categories[id,name, categoryOptions[id,name]]]',
      },
    },
  };

  // Function to handle the change of the selected category
  const handleVerticalCategoryChange = (selected) => {
    // Set the selected category in the state
    setSelectedCategory(selected);
    props.setControlCategories(selected);

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


    console.log('******** Start *************')
    console.log(props.selectedHorizontalCategoryID0)
    console.log('******** End *************')

    // Update the state with the filtered categories
    props.setfileredVerticalCatComboLevel1([]);
    props.setVerticalCategoryOptionsLevel1([]);
    props.setSelectedVerticalCategoryIDLevel1([]);
    props.setdictfileredHorizontalCatComboLevel1([]);


  };

  // Use the useDataQuery hook to fetch data from the DHIS2 API
  const { loading, error, data, refetch } = useDataQuery(query, {
    lazy: true,
  });

  // Effect to refetch data when the selectedDataElementId changes
  useEffect(() => {
    if (props.selectedDataElementId) {
      refetch();
    }
  }, [props.selectedDataElementId, refetch]);

  // Effect to process data when it is fetched
  useEffect(() => {
    if (data && data.dataElement) {
      // Extract category information from the data
      const { categoryCombo } = data.dataElement;
      const categories1 = categoryCombo?.categories || [];
      // Update the state with the category data
      setCategories(categories1);
      props.setControlCategories(null);
      // Reset selected category when data changes
      setSelectedCategory(null);
    }
  }, [data]);

  // Render the component
  return (
    <div className={classes.baseMargin}>
      {/* Render the SingleSelect component with category options */}
      <SingleSelect
        filterable
        noMatchText="No categories found"
        placeholder="Select category"
        selected={props.controlCategories}
        value={props.controlCategories}
        onChange={({ selected }) => handleVerticalCategoryChange(selected)}

      >
        {categories.map(category => (
          <SingleSelectOption key={category.id} label={category.name} value={category.id} />
        ))}
      </SingleSelect>
    </div>
  );
};

export default HorizontalCategory;

