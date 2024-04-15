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
import PropTypes from 'prop-types';
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
  const [categories2, setCategories2] = useState('');
  const [categories3, setCategories3] = useState('');
  const [loader, setLoader]= useState(false);
  const [processingCategory, setProcessingCategory] = useState('');
  const [processingOption, setprocessingOption] = useState('');
  const [processingOption2, setprocessingOption2] = useState('');
  const [processingOption3, setprocessingOption3] = useState('');
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [categoryOptions2, setCategoryOptions2] = useState([]);
  const [categoryOptions3, setCategoryOptions3] = useState([]);
  const [selectedCategoryOption, setSelectedCategoryOption] = useState([]);
  const [selectedCategoryOption2, setSelectedCategoryOption2] = useState([]);
  const [selectedCategoryOption3, setSelectedCategoryOption3] = useState([]);
  const [isInclusionExpanded1, setIsInclusionExpanded1]= useState(false);
  const [isInclusionExpanded2, setIsInclusionExpanded2]= useState(false);

  

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
    // console.log('extracted: ',extracted)

    if (extracted.length > 0){
      setCategoryList(extracted)
      // console.log('extracted: ',extracted)
    }       

  },[processingCategory, catRefetch, loader])

  const handleCustomImageClick = () => {
    setLoader(true);
    // console.log('processingCategory: ', processingCategory)
    catRefetch({categoryCombo: processingCategory})

    const extracted = catData?.categoryCombo?.categoryCombos[0]?.categories || [];
    // console.log('extracted: ',extracted)

    // console.log('selectedCategoryOption2', selectedCategoryOption2)
    // console.log('selectedCategoryOption3', selectedCategoryOption3)

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

      if (props.selectedMetadataOption === "DataElement"){

        props.setMetadataName(deName);
      }
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


      const handleSelectedLabelCategory2 = (event) =>{
        const selectedValue = event.target.value;
    
        // Split the selected value using the separator "val:-"
        const parts = selectedValue.split('-val:-');
        
        // The first part should be the catCombo.id
        const catId = parts[0];
        const catName = parts[1];
        setCategories2(selectedValue)
        props.setLabelCategoryIDName2([{id:catId, name:catName}])
        setprocessingOption2(catId);
    
        }

        const handleSelectedLabelCategory3 = (event) =>{
          const selectedValue = event.target.value;
      
          // Split the selected value using the separator "val:-"
          const parts = selectedValue.split('-val:-');
          
          // The first part should be the catCombo.id
          const catId = parts[0];
          const catName = parts[1];
          setCategories3(selectedValue)
          props.setLabelCategoryIDName3([{id:catId, name:catName}])
          setprocessingOption3(catId);
      
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
  setprocessingOption2('');
  setprocessingOption3('');
  setCategoryOptions([]);
  setSelectedCategoryOption([])
  setSelectedCategoryOption2([])

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

        // console.log(selectedValue)
    
        }
  

        const handleSelectedLabelCategoryOption2 = (event) =>{
          const selectedValue = event.target.value;
  
         // Split the selected value using the separator "val:-"
          const parts = selectedValue.split('-val:-');
          
          // The first part should be the catCombo.id
          const optionId = parts[0];
    
    
          const optionName = parts[1];
          setSelectedCategoryOption2(selectedValue);
          props.setMetadataName2(optionName);
          props.setLabelOptionIDName2([{id:optionId, name:optionName}])

  
      
          }
  

          const handleSelectedLabelCategoryOption3 = (event) =>{
            const selectedValue = event.target.value;
    
           // Split the selected value using the separator "val:-"
            const parts = selectedValue.split('-val:-');
            
            // The first part should be the catCombo.id
            const optionId = parts[0];
      
      
            const optionName = parts[1];
            setSelectedCategoryOption3(selectedValue);
            props.setMetadataName3(optionName);
            props.setLabelOptionIDName3([{id:optionId, name:optionName}])
        

    
        
            }


      useEffect(() =>{
        // console.log('categoryList: ', categoryList)
        // console.log('processingOption: ', processingOption)
    
        const filteredArray = categoryList.filter(
          (element) => element.id === processingOption
        );
    
    
        setCategoryOptions(filteredArray[0]?.categoryOptions || [])
    

       
    
      },[categories, categoryList, loader])


      useEffect(() =>{
        // console.log('categoryList: ', categoryList)
        // console.log('processingOption: ', processingOption)
    
        const filteredArray = categoryList.filter(
          (element) => element.id === processingOption2
        );
    
    
        setCategoryOptions2(filteredArray[0]?.categoryOptions || [])
    

       
    
      },[categories2, categoryList, loader])


      useEffect(() =>{
        // console.log('categoryList: ', categoryList)
        // console.log('processingOption: ', processingOption)
    
        const filteredArray = categoryList.filter(
          (element) => element.id === processingOption3
        );
    
    
        setCategoryOptions3(filteredArray[0]?.categoryOptions || [])
    

       
    
      },[categories3, categoryList, loader])

      useEffect(() =>{

        if (data) {
          if (props.editLabelMode) {
            if(!loadedLabel){
              const selectedLabel = data.dataStore?.entries || [];
              // console.log(selectedLabel)    
              setComponentID(selectedLabel[0].id)  
              props.setSelectedMetadataOption(selectedLabel[0].metadataType)
              let labelLoadingDE = selectedLabel[0]?.labelDEIDName[0] || []
              props.setLabelDEIDName([labelLoadingDE])
              setLabelDE(`${labelLoadingDE.id}-val:-${labelLoadingDE.name}`)   
              if  (selectedLabel[0].metadataType=== "DataElement"){
                setShowCatCombo(false)
                setShowDataElement(true)
         
              }else if(selectedLabel[0].metadataType === "CategoryOption"){  
                  setShowCatCombo(true)
                  setShowDataElement(false)
                  let labelCategoryIDName = selectedLabel[0]?.labelCategoryIDName[0] || []
                  let labelComboIDName = selectedLabel[0]?.labelComboIDName[0] || []
                  let labelOptionIDName = selectedLabel[0]?.labelOptionIDName[0] || []
    
    
                  let labelCategoryIDName2 = selectedLabel[0]?.labelInclusionCategoryIDName2[0] || []
                  let labelOptionIDName2 = selectedLabel[0]?.labelInclusionOptionIDName2[0] || []
    
    
                  let labelCategoryIDName3 = selectedLabel[0]?.labelInclusionCategoryIDName3[0] || []
                  let labelOptionIDName3 = selectedLabel[0]?.labelInclusionOptionIDName3[0] || []
    
                  props.setLabelComboIDName([labelComboIDName])
                  props.setLabelCategoryIDName([labelCategoryIDName])
                  props.setLabelCategoryIDName2([labelCategoryIDName2])
                  props.setLabelCategoryIDName3([labelCategoryIDName3])
                  props.setLabelOptionIDName([labelOptionIDName]) 
                  props.setLabelOptionIDName2([labelOptionIDName2]) 
                  props.setLabelOptionIDName3([labelOptionIDName3]) 
    
    
    
                  setProcessingCategory(labelComboIDName.id);
                  catRefetch({categoryCombo: labelComboIDName.id})
    
    
                  setCatCombo(`${labelComboIDName.id}-val:-${labelComboIDName.name}`)
                  setCategories(`${labelCategoryIDName.id}-val:-${labelCategoryIDName.name}`)
                  setCategories2(`${labelCategoryIDName2.id}-val:-${labelCategoryIDName2.name}`)
                  setCategories3(`${labelCategoryIDName3.id}-val:-${labelCategoryIDName3.name}`)
    
                  setprocessingOption(labelCategoryIDName.id)
                  setprocessingOption2(labelCategoryIDName2.id)
                  setprocessingOption3(labelCategoryIDName3.id)
                  setSelectedCategoryOption(`${labelOptionIDName.id}-val:-${labelOptionIDName.name}`)
                  setSelectedCategoryOption2(`${labelOptionIDName2.id}-val:-${labelOptionIDName2.name}`)
                  setSelectedCategoryOption3(`${labelOptionIDName3.id}-val:-${labelOptionIDName3.name}`)
    
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
      },[data])

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
                        <Divider/>  

                        <select id="labelDE" value={labelDE} onChange={handleSelectedLabelDE} className={classes.selectField}>
                        <option value="">Select Data Element </option>
                        {dataElementList.map(de => (
                            <option key={`${de.id}-val:-${de.name}`} value={`${de.id}-val:-${de.name}`}>{de.name}</option>
                        ))}
                    </select>
                    {loader && showCatCombo && (<Divider/>)}
                    {showCatCombo && (<Box min-height="358px" min-width="358px">

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
                              {(<div className={classes.customImageContainer} onClick={handleCustomImageClick}>
                                  {customImage('sync', 'large')}
                              </div>)}
                              {showCatCombo && (<Divider/> )}
                        
                        
                    </Box>)}

                {loader && showCatCombo && (<Box min-height="358px" min-width="358px">
                  
                  <Card className={classes.cardboxExclusion}>
                                <div>
                                    Target
                                </div>
                                <div>

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
                    
                  {loader && showCatCombo && (<Divider/> )}

                                       
                        <Card className={classes.cardboxExclusion}>

                        <div>
                                Label
                                </div>
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
                                          disabled={props.metadataName.length<1}

                                          
                                      />
                        </Card>

   
        
            {showCatCombo && (<Box min-height="358px" min-width="358px">
            {loader && showCatCombo && (selectedCategoryOption.length > 0) && (<Divider/> )}

            {loader && showCatCombo && (selectedCategoryOption.length > 0) && (<button onClick={() => setIsInclusionExpanded1((prev) => !prev)}>
                      {isInclusionExpanded1 ? '-' : '+'} 
                  </button>)} 
                  &nbsp;
                  {loader && !isInclusionExpanded1 && (selectedCategoryOption.length > 0) ? 'Add Inclusion 1' : ''} 
                  {loader && isInclusionExpanded1 && (selectedCategoryOption.length > 0) ? 'Remove Inclusion 1' : ''} 


                  {isInclusionExpanded1 &&  loader && showCatCombo && (<Divider/> )}

            {loader && isInclusionExpanded1 && (<Card className={classes.cardboxExclusion}>
                <div>
                    Inclusion One
                    </div>
                  <div>

                  <select id="category2" 
                          value={categories2}  
                          onChange={(event) => {
                            handleSelectedLabelCategory2(event); 
                          }} 
                          className={classes.selectField}>
                            <option value="">Select Category</option>
                            {categoryList.map(categories => (
                                <option key={`${categories.id}-val:-${categories.name}`} value={`${categories.id}-val:-${categories.name}`}>{categories.name}</option>
                            ))}
                        </select>
                        <select id="categoryOption2" 
                          value={selectedCategoryOption2}  
                          onChange={(event) => {
                            handleSelectedLabelCategoryOption2(event); 
                          }} 
                          className={classes.selectField}>
                            <option value="">Select Category Option</option>
                            {categoryOptions2.map(catOption => (
                                <option key={`${catOption.id}-val:-${catOption.name}`} value={`${catOption.id}-val:-${catOption.name}`}>{catOption.name}</option>
                            ))}
                        </select>




                  </div>



            </Card>)}


            {loader && showCatCombo && (selectedCategoryOption2.length > 0) && (<Divider/> )}

            {loader && showCatCombo && (selectedCategoryOption2.length > 0) && (<button onClick={() => setIsInclusionExpanded2((prev) => !prev)}>
                      {isInclusionExpanded2 ? '-' : '+'} 
                  </button>)} 
                  &nbsp;
                  {loader && !isInclusionExpanded2 && (selectedCategoryOption2.length > 0) ? 'Add Inclusion 2' : ''} 
                  {loader && isInclusionExpanded2 && (selectedCategoryOption2.length > 0) ? 'Remove Inclusion 2' : ''} 
                  {isInclusionExpanded2 && loader && showCatCombo && (<Divider/> )}
            {loader && isInclusionExpanded2 && (<Card className={classes.cardboxExclusion}>
                <div>
                    Inclusion Two
                    </div>
                  <div>

                  <select id="category3" 
                          value={categories3}  
                          onChange={(event) => {
                            handleSelectedLabelCategory3(event); 
                          }} 
                          className={classes.selectField}>
                            <option value="">Select Category</option>
                            {categoryList.map(categories => (
                                <option key={`${categories.id}-val:-${categories.name}`} value={`${categories.id}-val:-${categories.name}`}>{categories.name}</option>
                            ))}
                        </select>
                        <select id="categoryOption3" 
                          value={selectedCategoryOption3}  
                          onChange={(event) => {
                            handleSelectedLabelCategoryOption3(event); 
                          }} 
                          className={classes.selectField}>
                            <option value="">Select Category Option</option>
                            {categoryOptions3.map(catOption => (
                                <option key={`${catOption.id}-val:-${catOption.name}`} value={`${catOption.id}-val:-${catOption.name}`}>{catOption.name}</option>
                            ))}
                        </select>




                  </div>



            </Card>)}
          </Box>)}



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
                      
                    }}
                    
                    disabled={props.labelName<1}
                    >
                      {props.editLabelMode ? 'Update Label' : 'Set Label'}
                    </Button>
                    </ButtonStrip>
                </ModalActions>
                </Modal>
  );
};

LabelComponent.propTypes = {
  loadedProjectCombos: PropTypes.array.isRequired,
  loadedProjectDataElements: PropTypes.array.isRequired,
  selectedLabel: PropTypes.string, // Adjust as per your requirements
  editLabelMode: PropTypes.bool.isRequired,
  selectedMetadataOption: PropTypes.string, // Adjust as per your requirements
  setSelectedMetadataOption: PropTypes.func.isRequired,
  conditionLevels: PropTypes.array.isRequired,
  metadataName: PropTypes.string, // Adjust as per your requirements
  setMetadataName: PropTypes.func.isRequired,
  setMetadataName2: PropTypes.func.isRequired,
  setMetadataName3: PropTypes.func.isRequired,
  labelName: PropTypes.string, // Adjust as per your requirements
  setLabelName: PropTypes.func.isRequired,
  handleCloseLabelModal: PropTypes.func.isRequired,
  handleCreateLabel: PropTypes.func.isRequired,
  setLabelDEIDName: PropTypes.func.isRequired,
  setLabelComboIDName: PropTypes.func.isRequired,
  setLabelCategoryIDName: PropTypes.func.isRequired,
  setLabelCategoryIDName2: PropTypes.func.isRequired,
  setLabelCategoryIDName3: PropTypes.func.isRequired,
  setLabelOptionIDName: PropTypes.func.isRequired,
  setLabelOptionIDName2: PropTypes.func.isRequired,
  setLabelOptionIDName3: PropTypes.func.isRequired
};

export default LabelComponent;
