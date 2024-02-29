import { useDataQuery} from '@dhis2/app-runtime'
import { SingleSelect, SingleSelectOption  } from '@dhis2-ui/select'
import { Transfer } from '@dhis2-ui/transfer';

import { config, 
  exclusionRuleFilter,   
  conditionLevels,
  exclusionLevels, } from '../consts'
import React, { useState, useEffect } from 'react';
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button } from '@dhis2/ui';
import { Input } from '@dhis2-ui/input'
import classes from '../App.module.css'
import {alignLevelsReverse} from '../utils'




// Query to fetch data elements and their category information
const CatQuery = { 
  categoryCombo: {
    resource: 'categoryCombos',
    params: ({categoryCombo})=>({
      fields: 'id,name,categories[id,name,categoryOptions[id,name]]',
      filter: `id:eq:${categoryCombo}`,
    }),
  },
};

const ExclusionRuleComponent = (props) => {

  const [componentID, setComponentID] = useState("");
  const [dataElementList, setDataElementList] = useState(props.loadedProjectDataElements);
  const [comboList, setComboList] = useState(props.loadedProjectCombos);
  const [categoryList, setCategoryList] = useState([]);
  const [showDataElement, setShowDataElement] = useState(false);
  const [showCatCombo, setShowCatCombo] = useState(false);
  const [reloadExclusion, setReloadExclusion] = useState(false);
  const [loadingTransfer, setLoadingTransfer] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [processingCategory, setProcessingCategory] = useState("xxxxx");
  

  const ExclusionQuery = {
    dataStore: {
        resource: `dataStore/${config.dataStoreConditions}?${exclusionRuleFilter}&filter=key:eq:${props.selectedExclusion}`,
    }
  };


  
  const { loading, error, data, refetch } = useDataQuery(ExclusionQuery);
  const { loading:catLoading, data:catData, refetch:catRefetch} = useDataQuery(CatQuery, {variables: {categoryCombo: processingCategory}
  });


  useEffect(() =>{
    catRefetch({categoryCombo: processingCategory})
    const extracted = catData?.categoryCombo?.categoryCombos[0]?.categories || [];

    if (extracted.length > 1){
      setCategoryList(extracted)
      console.log('extracted: ',extracted)
    }       

  },[processingCategory, catRefetch])


  useEffect(() =>{
    setLoadingTransfer(true)
    const filteredArray = categoryList.filter(
      (element) => element.id === props.categoryExclusion
    );


    const catOptions = filteredArray[0]?.categoryOptions?.map(option => ({
      value: option.id,
      label: option.name,
    })) || [];

    setCategoryOptions(catOptions)

    setLoadingTransfer(false)
   

  },[props.categoryExclusion])
  
  useEffect(() =>{
    const filteredOptions = categoryOptions.filter(option => selectedKeys.includes(option.value)).map(({ value, label }) => ({ id:value, name:label }));;
    props.setExclusion(filteredOptions)

  },[selectedKeys])


  useEffect(() =>{
    setDataElementList(props.loadedProjectDataElements)
    refetch()
  },[props.loadedProjectDataElements, reloadExclusion, refetch])

  useEffect(() =>{
    setComboList(props.loadedProjectCombos)
    refetch()
  },[props.loadedProjectCombos, reloadExclusion, refetch])
  

  useEffect(()=>{
    setReloadExclusion((prev) => !prev)
    if (data){
      if (props.selectedExclusion !== 'xxxxx'){
        const selectedExclusion = data.dataStore?.entries || [];        
        setComponentID(selectedExclusion[0].id)  
        props.setConditionName(selectedExclusion[0]?.name || [])
        let conditionLoading = selectedExclusion[0]?.condition || []
        props.setCondition(conditionLoading)
        props.setSelectedConditionLevel(alignLevelsReverse(selectedExclusion[0].conditionLevel))
        props.setExclusion(selectedExclusion[0]?.exclusion || [])
        props.setSelectedExclusionMetadataOption(selectedExclusion[0]?.metadata || '')
        let metadataLoading = selectedExclusion[0]?.metadata || ''
        if  (metadataLoading=== "DataElement"){
            setShowCatCombo(false)
            setShowDataElement(true)        
        }else if(metadataLoading === "CategoryOption"){  
            setShowCatCombo(true)
            setShowDataElement(false)  
        }
        props.setSelectedExclusionLevel(alignLevelsReverse(selectedExclusion[0].exclusionLevel))
        props.setAssociatedExclusionDataElement(selectedExclusion[0]?.associatedExclusionDataElement || '')
        console.log('props.selectedExclusion: ',selectedExclusion)
        console.log('Condition: ', conditionLoading)
        let categoryExclusionLoading = selectedExclusion[0]?.categoryExclusion || []
        props.setCategoryExclusion(categoryExclusionLoading)
        setProcessingCategory(conditionLoading);
        catRefetch({categoryCombo: conditionLoading})
        let optionsLoading = selectedExclusion[0]?.exclusion || []

        // Now, allCategoryOptions contains all the category options
        const options = optionsLoading?.map(option => ({
          value: option.id,
          label: option.name,
        })) || [];
        setSelectedKeys(options.map(option => option.value)); // Set all options to the right by default

      }
    }  
  },[data])
  
  const handleSelectedCategory = (event) =>{
    setProcessingCategory(event.target.value);
    const categories = event.target.value
    catRefetch({categoryCombo: categories})
  }

    // Function to handle the change of the selected category
    const handleVerticalTransferChange = (selected) => {

      setSelectedKeys(selected);
  
    }

  if (error) {
      // if (error.status === 409) {
      //     return <span>Conflict: There was a conflict in the data retrieval process.</span>;
      // }
      // return <span>ERROR: {error?.message}</span>;
  }
  
  if (loading) {
      return <span>Loading...</span>;
  }

  if (catLoading) {
    return <span>Loading...</span>;
  }


  return (
    <Modal>
    <ModalTitle>Create an Exclusion Rule</ModalTitle>
    <ModalContent>
        {/* Add content for Exclusion Rule */}
        <div>

        <Input
                  name="conditionName"
                  placeholder="Condition Name"
                  value={props.conditionName}
                  onChange={({ value }) => props.setConditionName(value)}
                  className={classes.inputField}
              />
              <div className={classes.inputField}>
                  <label>
                    <input
                        type="radio"
                        value=" DataElement"
                        checked={props.selectedExclusionMetadataOption === "DataElement"}
                        onChange={() => {
                          props.setSelectedExclusionMetadataOption("DataElement")
                          setShowCatCombo(false)
                          setShowDataElement(true)
                      
                        }}
                    />
                    &nbsp;Data Element
                  </label>
                  <label style={{ marginLeft: '10px' }}>
                    <input
                        type="radio"
                        value=" CategoryOption"
                        checked={props.selectedExclusionMetadataOption === "CategoryOption"}
                        onChange={() => {
                          props.setSelectedExclusionMetadataOption("CategoryOption")
                          setShowCatCombo(true)
                          setShowDataElement(false)
                        
                        }}
                    />
                    &nbsp;Category Option
                  </label>
            </div>
            {showDataElement &&  (<select id="condition" value={props.condition} onChange={props.handleSelectedExclusion} className={classes.selectField}>
                        <option value="">Select Data Element </option>
                        {dataElementList.map(de => (
                            <option key={de.id} value={de.name}>{de.name}</option>
                        ))}
                    </select>)}

            {showCatCombo && (<select id="condition" 
            value={props.condition} 
            onChange={(event) => {     
              props.handleSelectedExclusion(event);          
              handleSelectedCategory(event); }}  
              className={classes.selectField}>
                <option value="">Select Category Combo</option>
                {comboList.map(catCombo => (
                    <option key={catCombo.id} value={catCombo.id}>{catCombo.name}</option>
                ))}
            </select>)}
            {showCatCombo && (<select id="conditionLevel" value={props.selectedConditionLevel} onChange={props.handleConditionLevelChange} className={classes.selectField}>
                <option value="">Select Condition Level</option>
                {conditionLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                ))}
            </select>)} 

            {showCatCombo && (<select id="categoryExclusion" 
                value={categoryList.some(category => category.id === props.categoryExclusion) ? props.categoryExclusion : null}  
                onChange={(event) => {
                props.handleSelectedExclusionCategory(event);
                // handleSelectedCategory(event); 
                }} 
                className={classes.selectField}>
                  <option value="">Select Category</option>
                  {categoryList.map(categoryExclusion => (
                      <option key={categoryExclusion.id} value={categoryExclusion.id}>{categoryExclusion.name}</option>
                  ))}
                    </select>)
            }

            {showCatCombo &&(<div>
                <Transfer
                  filterable
                  filterablePicked
                  loading={loadingTransfer}
                  enableOrderChange
                  options={categoryOptions}
                  selected={selectedKeys}
                  onChange={({ selected }) => {
                    handleVerticalTransferChange(selected);
                    // Add your logic to handle selected options
                  }}
                  className={classes.inputField}
                  // selectedEmptyComponent={<p style={{textAlign: 'center'}}>You have not selected anything yet<br /></p>}
                />
              </div>)    
            }           




            {showCatCombo && (<select id="conditionLevel" value={props.selectedExclusionLevel} onChange={props.handleExclusionLevelChange} className={classes.selectField}>
                        <option value="">Select Exclusion Level</option>
                        {exclusionLevels.map(level => (
                            <option key={level} value={level}>{level}</option>
                        ))}
            </select>)} 

            {showCatCombo &&  (<select id="associatedExclusionDataElement" value={props.associatedExclusionDataElement} onChange={props.handleSelectedAssociatedElementExclusion} className={classes.selectField}>
                        <option value="">Select Associated Data Element </option>
                        {dataElementList.map(de => (
                            <option key={de.id} value={de.name}>{de.name}</option>
                        ))}
                    </select>)}


        </div>
        </ModalContent>
        <ModalActions>
            <ButtonStrip>
            <Button onClick={props.handleCloseExclusionModal}>Cancel</Button>
            {/* Add save changes logic here */}
            <Button primary onClick={() => {
              props.handleCreateExclusion(props.editExclusionMode ? 'update' : 'new', componentID)
              setReloadExclusion((prev) => !prev)
          }}>
            {props.editExclusionMode ? 'Update Exclusion' : 'Create Exclusion'}
            
            

            </Button>
            </ButtonStrip>
        </ModalActions>
        </Modal>
  );
};

export default ExclusionRuleComponent;
