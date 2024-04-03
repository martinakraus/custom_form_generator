import { useDataQuery } from '@dhis2/app-runtime'
import {useState, useEffect } from 'react';
import React from 'react'
import classes from './App.module.css'
import { SingleSelect, SingleSelectOption  } from '@dhis2-ui/select'
import {customImage} from './utils'
import PropTypes from 'prop-types'

const dataSets = {
    targetedEntity: {
      resource: 'dataSets',
      params: ({dataSet})=>({
        fields: 'id,name,dataSetElements(dataElement(id,displayName))',
        filter: `id:eq:${dataSet}`,
      }),

    },
  }

  const catComboQuery = {
    dataElement: {
      resource: 'dataElements',
      id: ({id})=>(id),
      params: {
        fields: 'id,dataSetElements,categoryCombo[name,id,categories[id,name, categoryOptions[id,name]]]',
      },
    },
  }

    // Query to fetch data elements and their category information
    const query = {
      categoryCombo: {
        resource: 'categoryCombos',
        params: ({categoryCombo})=>({
          fields: 'id,name',
          filter: `id:eq:${categoryCombo}`,
        }),
      },

    };

const AppGetDEList = props => {

    const [disabled, setDisable] = useState(false)
    const [dataElemntID, setDataElement] = useState('xxxxx')
    const [updateCombos, setUpdateCombos] = useState(false)

    const [selectedcategoryCombo, setCategoryCombo] = useState('xxxx')
    
    const {loading: loading, error: error, data: data, refetch: refetch } = useDataQuery(dataSets, {variables: {dataSet: props.selectedDataSet}})
    const {loading: catLoading, error: cateEerror, data: catData, refetch: catRefetch } = useDataQuery(catComboQuery, {variables: {id: dataElemntID}})
    const {loading: selectedCat, error: selectedCatError, data: selectedCatData, refetch: selectedCatRefetch } = useDataQuery(query, {variables: {categoryCombo: selectedcategoryCombo}})
    
    useEffect(() => {
      if(selectedCatData){
        const name = selectedCatData?.categoryCombo?.categoryCombos[0]?.name || ''
        const id = selectedCatData?.categoryCombo?.categoryCombos[0]?.id || ''
        props.setLoadedCombos({id: id, name:name})
      }

    },[selectedCatData])
    
    useEffect(() => {
        setDataElement(props.selectedDataElementId)
        refetch({dataSet: props.selectedDataSet})
        catRefetch({id: dataElemntID})
        if (props.editMode){
          setDisable(!!props.selectedDataElementId);
        }        
    }, [props.selectedDataSet, props.selectedDataElementId,props.isHorizontalCategoryExpanded0, updateCombos]);

    useEffect(() => {
      // console.log('catData: DataElement =>',catData)

      if (catData){
        for (const dataSetElement of catData.dataElement.dataSetElements) {
          if (dataSetElement.dataSet.id === props.selectedDataSet && dataSetElement.categoryCombo) {
            props.setOveridingCategory(dataSetElement.categoryCombo.id)
            // console.log('catData: DataElement =>',catData)
            selectedCatRefetch({categoryCombo: dataSetElement.categoryCombo.id})
            // console.log('OveridingCategory: ', dataSetElement.categoryCombo)
            // console.log('OveridingCategory: ', dataSetElement.categoryCombo.id)
            break; // Stop the loop since we found the desired dataSetElement
          }else{
            const name = catData?.dataElement?.categoryCombo?.name || ''
            const id = catData?.dataElement?.categoryCombo?.id || ''
            props.setLoadedCombos({id: id, name:name})
            // props.setLoadedCombos(catData?.dataElement?.categoryCombo?.name || '')            
            props.setOveridingCategory('xxxxx')

          }
        }        
      }
     
    }, [catData,props.isHorizontalCategoryExpanded0,updateCombos]);


    const handleDataElementChange = (selected) => {
        props.setSelectedDataElementId(selected);
        setDataElement(selected)
        // console.log('props.setSelectedDataElementId updated: ', selected)

        // Find the record with the matching id
        const selectedDataElement = dataElements.find(dataElement => dataElement.dataElement.id === selected);
          
        //Selected data element
        // Check if selectedDataElement has a value, and set disabled accordingly

        if (props.editMode){
          setDisable(!!selectedDataElement);
        }
        
        if (selectedDataElement) {         
          props.setSelectedDataElement(selectedDataElement.dataElement.displayName);

        } else {

          props.setSelectedDataElement('');
        }
      

      };
      const handleCustomImageClick = () => {

          setUpdateCombos((prev) => !prev)

      }
    if (error) {
        return <span>ERROR: {error.message}</span>
    }

    if (loading) {
        return <span>Loading...</span>
    }
    // if (cateEerror){
    //   return <span>ERROR: {cateEerror.message}</span>
    // }
    if(catLoading)
    {
      return <span>Loading...</span>
    }

    const dataElements = data.targetedEntity.dataSets[0]?.dataSetElements || [];
    const excludeIDs = props.loadedProject.dataElements.map(element => element.id);

    return (
 
        <div className={classes.baseMargin}>
          {/* <h1>{dataElemntID} {dataElemntID} - {dataElemntID.length}</h1> */}
                {(props.selectedDataElementId.length > 0) && (<div className={classes.customImageContainer} onClick={handleCustomImageClick}>
                    {customImage('sync', 'large')}
                </div>)}
          
                    <SingleSelect
                            className="select"
                            filterable
                            noMatchText="No match found"
                            placeholder="Select DataElement"
                            selected={props.selectedDataElementId}
                            value={props.selectedDataElementId}
                            // onChange={handleDataElementChange}
                            onChange={({ selected }) => handleDataElementChange(selected)}
                            disabled={disabled}
                        >
                              {props.editMode ? (
                                  // Render all data elements if in edit mode
                                  dataElements.map(({ dataElement }) => (
                                      <SingleSelectOption
                                          label={dataElement.displayName}
                                          key={dataElement.id}
                                          value={dataElement.id}
                                      />
                                  ))
                              ) : (
                                  // Render only filtered data elements if not in edit mode
                                  dataElements
                                      .filter(element => !excludeIDs.includes(element.dataElement.id))
                                      .map(({ dataElement }) => (
                                          <SingleSelectOption
                                              label={dataElement.displayName}
                                              key={dataElement.id}
                                              value={dataElement.id}
                                          />
                                      ))
                              )}

                        </SingleSelect>
                                  <h1></h1>
              <span>{props.loadedCombos.name}</span>

       </div>
      
    )
}

AppGetDEList.propTypes = {
  selectedDataSet: PropTypes.string.isRequired,
  setSelectedDataElementId: PropTypes.func.isRequired,
  selectedDataElement: PropTypes.string.isRequired,
  selectedDataElementId: PropTypes.string.isRequired,
  loadedCombos: PropTypes.object,
  setSelectedDataElement: PropTypes.func.isRequired,
  editMode: PropTypes.bool.isRequired,
  setSelectSideNavigation: PropTypes.func.isRequired,
  setSelectFormComponents: PropTypes.func.isRequired,
  setLoadedCombos: PropTypes.func.isRequired,
  loadedProject: PropTypes.object.isRequired,
  setOveridingCategory: PropTypes.func.isRequired,
  isHorizontalCategoryExpanded0: PropTypes.bool.isRequired,
};

export default AppGetDEList