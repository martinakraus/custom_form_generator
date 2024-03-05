import { useDataQuery} from '@dhis2/app-runtime'
import { SingleSelect, SingleSelectOption  } from '@dhis2-ui/select'
import { Transfer } from '@dhis2-ui/transfer';
import { Divider } from '@dhis2-ui/divider'


import { Card } from '@dhis2-ui/card'

import { config, 
  exclusionRuleMore,   
  conditionLevels,
  exclusionLevels, } from '../consts'
import React, { useState, useEffect } from 'react';
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button, Box } from '@dhis2/ui';
import { Input } from '@dhis2-ui/input'
import classes from '../App.module.css'
import {alignLevelsReverse, customImage} from '../utils'




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
  const [loadingTransferToProcess, setLoadingTransferToProcess] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [categoryExclusion, setCategoryExclusion] = useState('');
  const [categoryExclusionToProcess, setCategoryExclusionToProcess] = useState('');
  const [processingCategoryToProcess, setProcessingCategoryToProcess] = useState('');
  const [loader, setLoader]= useState(false);
  const [onEditload, setOnEditLoader]= useState(false);


  const [selectedKeys, setSelectedKeys] = useState([]);
  const [categoryOptionsToProcess, setCategoryOptionsToProcess] = useState([]);
  const [selectedKeysToProcess, setSelectedKeysToProcess] = useState([]);


  const initparts = props.selectedExclusion.split('-val:-');

  // The first part should be the catCombo.id
  const initKeyID = initparts[0];
  const initCoCID = initparts[1];



  // const [processingCategory, setProcessingCategory] = useState(initCoCID !== undefined ? initCoCID : props.loadedProjectCombos[0].id);
  const [processingCategory, setProcessingCategory] = useState(initCoCID);

  // console.log('initCoCIDs: ',initCoCID)
  // console.log('props.loadedProjectCombos: ',props.loadedProjectCombos[0].id)
  

  const ExclusionQuery = {
    dataStore: {
        resource: `dataStore/${config.dataStoreConditions}?${exclusionRuleMore}&filter=key:eq:${initKeyID}`,
    }
  };


  
  const { loading, error, data, refetch } = useDataQuery(ExclusionQuery);
  const { loading:catLoading, data:catData, refetch:catRefetch} = useDataQuery(CatQuery, {variables: {categoryCombo: processingCategory}
  });


  useEffect(() =>{

    console.log('processingCategory: ', processingCategory)
    catRefetch({categoryCombo: processingCategory})

    const extracted = catData?.categoryCombo?.categoryCombos[0]?.categories || [];
    console.log('extracted: ',extracted)

    if (extracted.length > 1){
      setCategoryList(extracted)
      // console.log('extracted: ',extracted)
    }       

  },[processingCategory, catRefetch, loader])


  const handleCustomImageClick = () => {
    setLoader(true);
    console.log('processingCategory: ', processingCategory)
    catRefetch({categoryCombo: processingCategory})

    const extracted = catData?.categoryCombo?.categoryCombos[0]?.categories || [];
    console.log('extracted: ',extracted)

    if (extracted.length > 1){
      setCategoryList(extracted)
      // console.log('extracted: ',extracted)
    }   
    // catRefetch({categoryCombo: processingCategoryToProcess})
};


  useEffect(() =>{
    setLoadingTransfer(true)

    const filteredArray = categoryList.filter(
      (element) => element.id === categoryExclusion
    );


    const catOptions = filteredArray[0]?.categoryOptions?.map(option => ({
      value: option.id,
      label: option.name,
    })) || [];

    setCategoryOptions(catOptions)

    setLoadingTransfer(false)
   

  },[categoryExclusion, categoryList, loader])


 // to exclude
  useEffect(() =>{

    setLoadingTransferToProcess(true)
    const filteredArray = categoryList.filter(
      (element) => element.id === processingCategoryToProcess
    );

    // console.log('filteredArray: ', filteredArray)

    const catOptions = filteredArray[0]?.categoryOptions?.map(option => ({
      value: option.id,
      label: option.name,
    })) || [];

    setCategoryOptionsToProcess(catOptions)

    setLoadingTransferToProcess(false)
   

  },[processingCategoryToProcess, categoryList, loader])
  
  useEffect(() =>{
    if (onEditload){
    const filteredOptions = categoryOptions.filter(option => selectedKeys.includes(option.value)).map(({ value, label }) => ({ id:value, name:label }));;
    props.setExclusion(filteredOptions)
    }

  },[selectedKeys])

  // to exclude
  useEffect(() =>{
    if (onEditload){
    const filteredOptions = categoryOptionsToProcess.filter(option => selectedKeysToProcess.includes(option.value)).map(({ value, label }) => ({ id:value, name:label }));;
    props.setExclusionToProcess(filteredOptions)
    }

  },[selectedKeysToProcess])

  useEffect(() =>{
    setDataElementList(props.loadedProjectDataElements)
    refetch()
  },[props.loadedProjectDataElements, reloadExclusion, refetch])

  useEffect(() =>{
    // if (props.loadedProjectCombos === undefined){

    // }else{
    //   setComboList(props.loadedProjectCombos)

    // }
    setComboList(props.loadedProjectCombos)
    refetch()
  },[props.loadedProjectCombos, reloadExclusion, refetch])
  

  // on load
  useEffect(()=>{
    setReloadExclusion((prev) => !prev)
    if (data){
      if (props.selectedExclusion !== 'xxxxx'){

        const selectedExclusion = data.dataStore?.entries || [];       
        setComponentID(selectedExclusion[0].id)  
        props.setConditionName(selectedExclusion[0]?.name || [])
        let conditionLoadingDE = selectedExclusion[0]?.conditionDE[0] || []
        props.setConditionDE(`${conditionLoadingDE.id}-val:-${conditionLoadingDE.name}`)
        props.setConditionDEIDName(selectedExclusion[0]?.conditionDE || [])
        // props.setSelectedConditionLevel(alignLevelsReverse(selectedExclusion[0].conditionLevel))

        props.setSelectedExclusionMetadataOption(selectedExclusion[0]?.metadata || '') // update onload
   
        let conditionLoadingCoC = selectedExclusion[0]?.conditionCoC[0] || []
        props.setConditionCoCIDName(selectedExclusion[0]?.conditionCoC || [])
        props.setConditionCoC(`${conditionLoadingCoC.id}-val:-${conditionLoadingCoC.name}`)


        props.setExclusion(selectedExclusion[0]?.conditionCategoryOption || [])
        let metadataLoading = selectedExclusion[0]?.metadata || ''
        if  (metadataLoading=== "DataElement"){
            setShowCatCombo(false)
            setShowDataElement(true)        
        }else if(metadataLoading === "CategoryOption"){  
            setShowCatCombo(true)
            setShowDataElement(false)  
        }

        // props.setSelectedExclusionLevel(alignLevelsReverse(selectedExclusion[0].exclusionLevel))
        let categoryExclusionLoading = selectedExclusion[0]?.category[0] || []
        props.setConditionCOIDName(selectedExclusion[0]?.category || [])
        props.setCategoryExclusion(`${categoryExclusionLoading.id}-val:-${categoryExclusionLoading.name}`)
        setCategoryExclusion(categoryExclusionLoading.id)
        // for the category options
        let categoryListLoading = selectedExclusion[0]?.conditionCategoryOption || []

        // for the exclusion options
        let categoryExclusionOptionToProcessLoading = selectedExclusion[0]?.categoryExclusionOptionToProcess || []
        props.setExclusionToProcess(selectedExclusion[0]?.categoryExclusionOptionToProcess || [])
        // Now, allCategoryOptions contains all the category options
        const optionsCategory = categoryExclusionOptionToProcessLoading?.map(option => ({
          value: option.id,
          label: option.name,
        })) || [];

        setSelectedKeysToProcess(optionsCategory.map(option => option.value))
        
        if(metadataLoading === "CategoryOption"){ 

          let categoryExclusionToProcessLoading = selectedExclusion[0]?.categoryExclusionToProcess[0] || []
          console.log('Reached here')
          props.setCategoryExclusionToProcess(selectedExclusion[0]?.categoryExclusionToProcess || [])
          setCategoryExclusionToProcess(`${categoryExclusionToProcessLoading.id}-val:-${categoryExclusionToProcessLoading.name}`)
          setProcessingCategoryToProcess(categoryExclusionToProcessLoading.id) // Id to get option List

        }

        
        setProcessingCategory(conditionLoadingCoC.id);
        catRefetch({categoryCombo: conditionLoadingCoC.id})



      
        // Now, allCategoryOptions contains all the category options
        const optionsExclusion = categoryListLoading?.map(option => ({
          value: option.id,
          label: option.name,
        })) || [];

        setSelectedKeys(optionsExclusion.map(option => option.value)); // Set all options to the right by default


      }
    }
    // setOnEditLoader(true)  
  },[data])

  // if (props.exclude){

  //   console.log('props.exclude: ', props.exclude)

  // }

  const handleSelectedCategory = (event) =>{
    const selectedValue = event.target.value;

    // Split the selected value using the separator "val:-"
    const parts = selectedValue.split('-val:-');
    
    // The first part should be the catCombo.id
    const catComboId = parts[0];
  
    // Now you have the catCombo.id, you can set it in state or perform any other operations
    setProcessingCategory(catComboId);

    catRefetch({categoryCombo: catComboId})
  }

  

  const handleSelectedExclusionCategory = (event) =>{
    const selectedValue = event.target.value;

    // Split the selected value using the separator "val:-"
    const parts = selectedValue.split('-val:-');
    
    // The first part should be the catCombo.id
    const catComboId = parts[0];
    props.setCategoryExclusion(selectedValue)
    setCategoryExclusion(catComboId)
  

  }


  

  const handleSelectedCategoryToProcess = (event) =>{
    const selectedValue = event.target.value;

    // Split the selected value using the separator "val:-"
    const parts = selectedValue.split('-val:-');
    
    // The first part should be the catCombo.id
    const optionId = parts[0];
    setProcessingCategoryToProcess(optionId)
    setCategoryExclusionToProcess(selectedValue)
  

  }
    // Function to handle the change of the selected category
    const handleVerticalTransferCoCChange = (selected) => {
      setOnEditLoader(true);

      setSelectedKeys(selected);
  
    }
    

    // Function to handle the change of the selected category
    const handleVerticalTransferExclusionhange = (selected) => {
      setOnEditLoader(true);

      setSelectedKeysToProcess(selected);
  
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
            {(showCatCombo || showDataElement) && (<select id="conditionDE" value={props.conditionDE} onChange={props.handleSelectedExclusionDE} className={classes.selectField}>
                        <option value="">Select Data Element </option>
                        {dataElementList.map(de => (
                            <option key={`${de.id}-val:-${de.name}`} value={`${de.id}-val:-${de.name}`}>{de.name}</option>
                        ))}
                    </select>)}

                    {(showCatCombo || showDataElement) && (<select id="conditionCoC" 
            value={props.conditionCoC} 
            onChange={(event) => {     
              props.handleSelectedExclusionCoC(event);          
              handleSelectedCategory(event); }}  
              className={classes.selectField}>
                <option value="">Select Category Combo</option>
                {comboList.map(catCombo => (
                    <option key={`${catCombo.id}-val:-${catCombo.name}`} value={`${catCombo.id}-val:-${catCombo.name}`}>{catCombo.name}</option>
                ))}
            </select>)}


            {(showCatCombo || showDataElement) && (<Divider/>)}

      {(<div className={classes.customImageContainer} onClick={handleCustomImageClick}>
        {customImage('sync', 'large')}
      </div>)}

            {loader && (showCatCombo || showDataElement) && (<div>
              Conditions
            </div>)}
            {loader && (showCatCombo || showDataElement) && (<Box min-height="358px" min-width="358px">
            <Card className={classes.cardboxExclusion}>
              <select id="categoryExclusion" 
              value={props.categoryExclusion}  
              onChange={(event) => {
              props.handleSelectedExclusionCategory(event);
              handleSelectedExclusionCategory(event); 
              }} 
              className={classes.selectField}>
                <option value="">Select Category Condition</option>
                {categoryList.map(categoryExclusion => (
                    <option key={`${categoryExclusion.id}-val:-${categoryExclusion.name}`} value={`${categoryExclusion.id}-val:-${categoryExclusion.name}`}>{categoryExclusion.name}</option>
                ))}
                  </select>
            <div>
              <Transfer
                filterable
                filterablePicked
                loading={loadingTransfer}
                enableOrderChange
                options={categoryOptions}
                selected={selectedKeys}
                onChange={({ selected }) => {
                  handleVerticalTransferCoCChange(selected);
                  // Add your logic to handle selected options
                }}
                className={classes.inputField}
                // selectedEmptyComponent={<p style={{textAlign: 'center'}}>You have not selected anything yet<br /></p>}
              />
            </div>  
    
            </Card> 
</Box>)}

  
{loader && showCatCombo && (<Divider/>)}                   

{loader && showCatCombo && (

<div>
        Exclusion
    </div>



)}  

{loader && showCatCombo && (

<Box min-height="358px" min-width="358px">
<Card className={classes.cardboxExclusion}>
      {loader && showCatCombo && (<select id="categoryExclusionToProcess" 
            value={categoryExclusionToProcess}
            onChange={(event) => {
            props.handleSelectedExclusionCategoryToProcess(event);
            handleSelectedCategoryToProcess(event); 
            }} 
            className={classes.selectField}>
              <option value="">Select Category Exclusion</option>
              {categoryList.map(categoryExclusion => (
                  <option key={`${categoryExclusion.id}-val:-${categoryExclusion.name}`} value={`${categoryExclusion.id}-val:-${categoryExclusion.name}`}>{categoryExclusion.name}</option>
              ))}
                </select>)
        }

        {loader && showCatCombo &&(<div>
            <Transfer
              filterable
              filterablePicked
              loading={loadingTransferToProcess}
              enableOrderChange
              options={categoryOptionsToProcess}
              selected={selectedKeysToProcess}
              onChange={({ selected }) => {
                handleVerticalTransferExclusionhange(selected);
                // Add your logic to handle selected options
              }}
              className={classes.inputField}
              // selectedEmptyComponent={<p style={{textAlign: 'center'}}>You have not selected anything yet<br /></p>}
            />
          </div>)    
        }   
</Card>
</Box>



)} 

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
