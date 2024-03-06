import { useDataQuery } from '@dhis2/app-runtime'
import { SingleSelect, SingleSelectOption  } from '@dhis2-ui/select'
import { Divider } from '@dhis2-ui/divider'
import { config, 
  labelNameFilter,   
  conditionLevels,
 } from '../consts'
import React, { useState, useEffect } from 'react';
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button, Box } from '@dhis2/ui';
import { Input } from '@dhis2-ui/input'
import classes from '../App.module.css'
import { Card } from '@dhis2-ui/card'

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


const LabelComponent = (props) => {
  const [componentID, setComponentID] = useState("");
  const [loadedLabel, setLoadedLabel] = useState(false);
  const [dataElementList, setDataElementList] = useState(props.loadedProjectDataElements);
  const [comboList, setComboList] = useState(props.loadedProjectCombos);
  const [categoryList, setCategoryList] = useState([]);
  const [showDataElement, setShowDataElement] = useState(false);
  const [showCatCombo, setShowCatCombo] = useState(false);
  const [labelDE, setLabelDE] = useState(false);
  const [catCombo, setCatCombo] = useState('');
  const [categories, setCategories] = useState('');
  const [loader, setLoader]= useState(false);
  const [processingCategory, setProcessingCategory] = useState('');
  const [processingOption, setprocessingOption] = useState('');
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategoryOption, setSelectedCategoryOption] = useState([]);
  

  const LabelQuery = {
    dataStore: {
        resource: `dataStore/${config.dataStoreLabelName}?${labelNameFilter}&filter=key:eq:${props.selectedLabel}`,
    }
  };
  const { loading:catLoading, data:catData, refetch:catRefetch} = useDataQuery(CatQuery, {variables: {categoryCombo: processingCategory}
  });


  const { loading, error, data } = useDataQuery(LabelQuery);


  useEffect(() =>{

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
    // Function to update Exclusion Data Element
  const handleSelectedLabelDE = (event) => {
      const selectedValue = event.target.value;

      // Split the selected value using the separator "val:-"
      const parts = selectedValue.split('-val:-');
      
      // The first part should be the catCombo.id
      const deId = parts[0];


      const deName = parts[1];

      setLabelDE(selectedValue);
      props.setMetadataName(deName);
      props.setLabelDEIDName([{id:deId, name:deName}])
  };


  const handleSelectedLabelCategoryCombo = (event) =>{
    const selectedValue = event.target.value;

    // Split the selected value using the separator "val:-"
    const parts = selectedValue.split('-val:-');
    
    // The first part should be the catCombo.id
    const catComboId = parts[0];
    const catComboName = parts[1];
    setCatCombo(selectedValue)
    props.setLabelComboIDName([{id:catComboId, name:catComboName}])
    setProcessingCategory(catComboId);

    }

    const handleSelectedLabelCategory = (event) =>{
      const selectedValue = event.target.value;
  
      // Split the selected value using the separator "val:-"
      const parts = selectedValue.split('-val:-');
      
      // The first part should be the catCombo.id
      const catId = parts[0];
      const catName = parts[1];
      setCategories(selectedValue)
      props.setLabelCategoryIDName([{id:catId, name:catName}])
      setprocessingOption(catId);
  
      }

const handleCloseLabelModal = () =>{
  setCategoryList([])
  setShowDataElement(false);
  setShowCatCombo(false);
  setLabelDE(false);
  setCatCombo('');
  setCategories('');
  setLoader(false);
  setProcessingCategory('');
  setprocessingOption('');
  setCategoryOptions([]);
  setSelectedCategoryOption([])

}

      const handleSelectedLabelCategoryOption = (event) =>{
        const selectedValue = event.target.value;

       // Split the selected value using the separator "val:-"
        const parts = selectedValue.split('-val:-');
        
        // The first part should be the catCombo.id
        const optionId = parts[0];
  
  
        const optionName = parts[1];
        setSelectedCategoryOption(selectedValue);
        props.setMetadataName(optionName);
        props.setLabelOptionIDName([{id:optionId, name:optionName}])
    
        // // Split the selected value using the separator "val:-"
        // const parts = selectedValue.split('-val:-');
        
        // // The first part should be the catCombo.id
        // const catId = parts[0];
        // const catName = parts[1];
        // setCategories(selectedValue)
        // props.setLabelCategoryIDName([{id:catId, name:catName}])
        // setprocessingOption(catId);

        console.log(selectedValue)
    
        }
  
  
      useEffect(() =>{
        // console.log('categoryList: ', categoryList)
        // console.log('processingOption: ', processingOption)
    
        const filteredArray = categoryList.filter(
          (element) => element.id === processingOption
        );
    
    
        setCategoryOptions(filteredArray[0]?.categoryOptions || [])
    

       
    
      },[categories, categoryList, loader])

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


  if (data) {
      if (props.editLabelMode) {
        if(!loadedLabel){
          const selectedLabel = data.dataStore?.entries || [];
          console.log(selectedLabel)    
          setComponentID(selectedLabel[0].id)  
          props.setSelectedMetadataOption(selectedLabel[0].metadataType)
          if  (selectedLabel[0].metadataType=== "DataElement"){
            setShowCatCombo(false)
            setShowDataElement(true)
            let labelLoadingDE = selectedLabel[0]?.labelDEIDName[0] || []
            props.setLabelDEIDName([labelLoadingDE])
            setLabelDE(`${labelLoadingDE.id}-val:-${labelLoadingDE.name}`)        
          }else if(selectedLabel[0].metadataType === "CategoryOption"){  
              setShowCatCombo(true)
              setShowDataElement(false)
              let labelCategoryIDName = selectedLabel[0]?.labelCategoryIDName[0] || []
              let labelComboIDName = selectedLabel[0]?.labelComboIDName[0] || []
              let labelOptionIDName = selectedLabel[0]?.labelOptionIDName[0] || []

              props.setLabelComboIDName([labelComboIDName])
              props.setLabelCategoryIDName([labelCategoryIDName])
              props.setLabelOptionIDName([labelOptionIDName]) 



              setProcessingCategory(labelComboIDName.id);
              catRefetch({categoryCombo: labelComboIDName.id})


              setCatCombo(`${labelComboIDName.id}-val:-${labelComboIDName.name}`)
              setCategories(`${labelCategoryIDName.id}-val:-${labelCategoryIDName.name}`)

              setprocessingOption(labelCategoryIDName.id)
              setSelectedCategoryOption(`${labelOptionIDName.id}-val:-${labelOptionIDName.name}`)

              // console.log(labelOptionIDName)



          }
        
        props.setMetadataName(selectedLabel[0].name)
        props.setLabelName(selectedLabel[0].labelName)
        setLoadedLabel(true)
        

          //id,key,name,projectID,labelName,metadataType,LabelLevel
        }
          // console.log(data)
      }
  }
  

  return (

<Modal>
                <ModalTitle>Set Labels</ModalTitle>
                <ModalContent>
                    {/* Add content for Label */}
                    <div>
                        <div className={classes.inputField}>
                            <label>
                                    <input
                                        type="radio"
                                        value=" DataElement"
                                        checked={props.selectedMetadataOption === "DataElement"}
                                        onChange={() => {props.setSelectedMetadataOption("DataElement")
                                        
                                          setShowCatCombo(false)
                                          setShowDataElement(true)}
                                      }
                                    />
                                     &nbsp;Data Element
                            </label>
                            <label style={{ marginLeft: '10px' }}>
                                    <input
                                        type="radio"
                                        value=" CategoryOption"
                                        checked={props.selectedMetadataOption === "CategoryOption"}
                                        onChange={() => {props.setSelectedMetadataOption("CategoryOption")
                                        setShowCatCombo(true)
                                        setShowDataElement(false)
                                      }}
                                    />
                                     &nbsp;Category Option
                            </label>
                        </div>
                        {showDataElement && (<Divider/>)}  

                        {showDataElement && (<select id="labelDE" value={labelDE} onChange={handleSelectedLabelDE} className={classes.selectField}>
                        <option value="">Select Data Element </option>
                        {dataElementList.map(de => (
                            <option key={`${de.id}-val:-${de.name}`} value={`${de.id}-val:-${de.name}`}>{de.name}</option>
                        ))}
                    </select>)}
                    {showCatCombo && (<Divider/>)}
                    {showCatCombo && (<Box min-height="358px" min-width="358px">
            <Card className={classes.cardboxExclusion}>
              <select id="categoryCombo" 
                value={catCombo}  
                onChange={(event) => {
                  handleSelectedLabelCategoryCombo(event); 
                }} 
                className={classes.selectField}>
                  <option value="">Select Category Combo</option>
                  {comboList.map(catCombo => (
                      <option key={`${catCombo.id}-val:-${catCombo.name}`} value={`${catCombo.id}-val:-${catCombo.name}`}>{catCombo.name}</option>
                  ))}
              </select>
            <div>
            {(<div className={classes.customImageContainer} onClick={handleCustomImageClick}>
        {customImage('sync', 'large')}
      </div>)}
              <select id="category" 
                value={categories}  
                onChange={(event) => {
                handleSelectedLabelCategory(event); 
                }} 
                className={classes.selectField}>
                  <option value="">Select Category</option>
                  {categoryList.map(categories => (
                      <option key={`${categories.id}-val:-${categories.name}`} value={`${categories.id}-val:-${categories.name}`}>{categories.name}</option>
                  ))}
              </select>
              <select id="categoryOption" 
                value={selectedCategoryOption}  
                onChange={(event) => {
                  handleSelectedLabelCategoryOption(event); 
                }} 
                className={classes.selectField}>
                  <option value="">Select Category Option</option>
                  {categoryOptions.map(catOption => (
                      <option key={`${catOption.id}-val:-${catOption.name}`} value={`${catOption.id}-val:-${catOption.name}`}>{catOption.name}</option>
                  ))}
              </select>
            </div>  
    
            </Card> 
          </Box>)}
<Divider/>
                        <Input
                              name="metadataName"
                              placeholder="Metadata Name"
                              value={props.metadataName}
                              onChange={({ value }) => props.setMetadataName(value)}
                              className={classes.inputField}
                              disabled
                          />

                        <Input
                              name="labelName"
                              placeholder="Label"
                              value={props.labelName}
                              onChange={({ value }) => props.setLabelName(value)}
                              className={classes.inputField}
                              
                          />


                    </div>
                </ModalContent>
                <ModalActions>
                    <ButtonStrip>
                    <Button onClick={() => {
                                    handleCloseLabelModal()
                                    props.handleCloseLabelModal()

                                  
                                  }
                                    
                                    }>Cancel</Button>
                    {/* Add save changes logic here */}
                    <Button primary onClick={() => {
                      
                      props.handleCreateLabel(props.editLabelMode ? 'update' : 'new', componentID)
                      
                        handleCloseLabelModal()
                      
                    }}>
                      {props.editLabelMode ? 'Update Label' : 'Set Label'}
                    </Button>
                    </ButtonStrip>
                </ModalActions>
                </Modal>
  );
};

export default LabelComponent;
