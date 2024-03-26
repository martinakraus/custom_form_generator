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



const AppGetDEList = props => {

    const [disabled, setDisable] = useState(false)
    const [dataElemntID, setDataElement] = useState('xxxxx')
    const [updateCombos, setUpdateCombos] = useState(false)
    
    const {loading: loading, error: error, data: data, refetch: refetch } = useDataQuery(dataSets, {variables: {dataSet: props.selectedDataSet}})
    const {loading: catLoading, error: cateEerror, data: catData, refetch: catRefetch } = useDataQuery(catComboQuery, {variables: {id: dataElemntID}})

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
            // console.log('OveridingCategory: ', dataSetElement.categoryCombo.id)
            break; // Stop the loop since we found the desired dataSetElement
          }else{
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
                            {dataElements.map(({ dataElement }) => (
                            <SingleSelectOption
                                label={dataElement.displayName}
                                key={dataElement.id}
                                value={dataElement.id}
                            />
                            ))}
                        </SingleSelect>



       </div>
      
    )
}

AppGetDEList.propTypes = {
  selectedDataSet: PropTypes.string.isRequired,
  setSelectedDataElementId: PropTypes.func.isRequired,
  selectedDataElement: PropTypes.string.isRequired,
  selectedDataElementId: PropTypes.string.isRequired,
  setSelectedDataElement: PropTypes.func.isRequired,
  editMode: PropTypes.bool.isRequired,
  setSelectSideNavigation: PropTypes.func.isRequired,
  setSelectFormComponents: PropTypes.func.isRequired,
  loadedProject: PropTypes.object.isRequired,
  setOveridingCategory: PropTypes.func.isRequired,
  isHorizontalCategoryExpanded0: PropTypes.bool.isRequired,
};

export default AppGetDEList