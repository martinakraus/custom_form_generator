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
import {customImage} from '../utils'




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
  const [categoryOptions2, setCategoryOptions2] = useState([]);
  const [categoryExclusion, setCategoryExclusion] = useState('');
  const [categoryExclusion2, setCategoryExclusion2] = useState('');
  const [categoryExclusionToProcess, setCategoryExclusionToProcess] = useState('');
  const [processingCategoryToProcess, setProcessingCategoryToProcess] = useState('');
  const [loader, setLoader]= useState(false);
  const [onEditload, setOnEditLoader]= useState(false);
  const [isCondition2Expanded, setIsCondition2Expanded]= useState(false);



  const [selectedKeys, setSelectedKeys] = useState([]);
  const [selectedKeys2, setSelectedKeys2] = useState([]);
  const [categoryOptionsToProcess, setCategoryOptionsToProcess] = useState([]);
  const [selectedKeysToProcess, setSelectedKeysToProcess] = useState([]);


  const initparts = props.selectedExclusionEditInit.split('-val:-');

  // The first part should be the catCombo.id
  const initKeyID = initparts[0] !== '' ? initparts[0] : 'xxxxx';
  const initCoCID = initparts[1];

console.log(selectedKeys.length > 0)

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

    if (extracted.length > 0){
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

    if (extracted.length > 0){
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

  useEffect(() =>{
    setLoadingTransfer(true)

    const filteredArray = categoryList.filter(
      (element) => element.id === categoryExclusion2
    );


    const catOptions = filteredArray[0]?.categoryOptions?.map(option => ({
      value: option.id,
      label: option.name,
    })) || [];

    setCategoryOptions2(catOptions)

    setLoadingTransfer(false)
   

  },[categoryExclusion2, categoryList, loader])


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

  useEffect(() =>{
    if (onEditload){
    const filteredOptions = categoryOptions2.filter(option => selectedKeys2.includes(option.value)).map(({ value, label }) => ({ id:value, name:label }));;
    props.setExclusion2(filteredOptions)
    }

  },[selectedKeys2])

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
        props.setConditionDEIDName([conditionLoadingDE])
        // props.setSelectedConditionLevel(alignLevelsReverse(selectedExclusion[0].conditionLevel))

        props.setSelectedExclusionMetadataOption(selectedExclusion[0]?.metadata || '') // update onload
   
        let conditionLoadingCoC = selectedExclusion[0]?.conditionCoC[0] || []
        props.setConditionCoCIDName([conditionLoadingCoC])
        props.setConditionCoC(`${conditionLoadingCoC.id}-val:-${conditionLoadingCoC.name}`)


        props.setExclusion(selectedExclusion[0]?.conditionCategoryOption || [])
        props.setExclusion2(selectedExclusion[0]?.conditionCategoryOption2 || [])
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
        let categoryExclusionLoading2 = selectedExclusion[0]?.category2[0] || []
        props.setConditionCOIDName2([categoryExclusionLoading2])
        props.setConditionCOIDName([categoryExclusionLoading])
        props.setCategoryExclusion(`${categoryExclusionLoading.id}-val:-${categoryExclusionLoading.name}`)
        props.setCategoryExclusion2(`${categoryExclusionLoading2.id}-val:-${categoryExclusionLoading2.name}`)
        setCategoryExclusion(categoryExclusionLoading.id)
        setCategoryExclusion2(categoryExclusionLoading2.id)
        // for the category options
        let categoryListLoading = selectedExclusion[0]?.conditionCategoryOption || []
        let categoryListLoading2 = selectedExclusion[0]?.conditionCategoryOption2 || []

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
          props.setCategoryExclusionToProcess(selectedExclusion[0]?.categoryExclusionToProcess || [])
          setCategoryExclusionToProcess(`${categoryExclusionToProcessLoading.id}-val:-${categoryExclusionToProcessLoading.name}`)
          setProcessingCategoryToProcess(categoryExclusionToProcessLoading.id) // Id to get option List

        }

        
        setProcessingCategory(conditionLoadingCoC.id);
        // console.log('Exclusion Edit Mode')
        catRefetch({categoryCombo: conditionLoadingCoC.id})



      
        // Now, allCategoryOptions contains all the category options
        const optionsExclusion = categoryListLoading?.map(option => ({
          value: option.id,
          label: option.name,
        })) || [];
        // Now, allCategoryOptions contains all the category options
        const optionsExclusion2 = categoryListLoading2?.map(option => ({
          value: option.id,
          label: option.name,
        })) || [];
        setSelectedKeys(optionsExclusion.map(option => option.value)); // Set all options to the right by default
        setSelectedKeys2(optionsExclusion2.map(option => option.value));

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
    console.log('Category Changed')

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


  const handleSelectedExclusionCategory2 = (event) =>{
    const selectedValue = event.target.value;

    // Split the selected value using the separator "val:-"
    const parts = selectedValue.split('-val:-');
    
    // The first part should be the catCombo.id
    const catComboId = parts[0];
    props.setCategoryExclusion2(selectedValue)
    setCategoryExclusion2(catComboId)
  

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
        const handleVerticalTransferCoCChange2 = (selected) => {
          setOnEditLoader(true);
    
          setSelectedKeys2(selected);
      
        }
    

    // Function to handle the change of the selected category
    const handleVerticalTransferExclusionhange = (selected) => {
      setOnEditLoader(true);

      setSelectedKeysToProcess(selected);
  
    }


   const handleClearConstants = () =>{
    setDataElementList([])
    setComboList([])
    setCategoryList([])
    setShowDataElement(false)
    setShowCatCombo(false)
    setReloadExclusion(false)
    setLoadingTransfer(false)
    setLoadingTransferToProcess(false)
    setCategoryOptions([])
    setCategoryOptions2([])
    setCategoryExclusion('')
    setCategoryExclusion2('')
    setCategoryExclusionToProcess('')
    setProcessingCategoryToProcess('')
    setLoader(false)
    setOnEditLoader(false)
    setSelectedKeys([])
    setSelectedKeys2([])
    setCategoryOptionsToProcess([])
    setSelectedKeysToProcess([])

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
              Conditions One
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
                <option value="">Select Category Condition One</option>
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
{loader && showCatCombo && (selectedKeys.length > 0) && (<button onClick={() => setIsCondition2Expanded((prev) => !prev)}>
                      {isCondition2Expanded ? '-' : '+'} 
                  </button>)} 
                  &nbsp;
                  
                  {loader && isCondition2Expanded && (selectedKeys.length > 0) ? 'Hide another condition' : ''} 

  
                  {loader && showCatCombo && (<Divider/>)} 
{loader && isCondition2Expanded && (selectedKeys.length > 0) &&(showCatCombo || showDataElement) && (<div>
              Conditions Two
            </div>)}
            {loader && isCondition2Expanded  && (showCatCombo || showDataElement) && (<Box min-height="358px" min-width="358px">
            <Card className={classes.cardboxExclusion}>
              <select id="categoryExclusion" 
              value={props.categoryExclusion2}  
              onChange={(event) => {
              props.handleSelectedExclusionCategory2(event);
              handleSelectedExclusionCategory2(event); 
              }} 
              className={classes.selectField}>
                <option value="">Select Category Condition Two</option>
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
                options={categoryOptions2}
                selected={selectedKeys2}
                onChange={({ selected }) => {
                  handleVerticalTransferCoCChange2(selected);
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
            <Button onClick={()=>{
              
              handleClearConstants()
              props.handleCloseExclusionModal()}}>
                Cancel</Button>
            {/* Add save changes logic here */}
            <Button primary onClick={() => {
              handleClearConstants()
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
