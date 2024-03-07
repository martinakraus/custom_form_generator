import { useDataQuery, useAlert } from '@dhis2/app-runtime'
import { SingleSelect, SingleSelectOption  } from '@dhis2-ui/select'
import { config, TemplateFilter, TemplateNoFilter } from '../consts'
import React, { useState, useEffect } from 'react';
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button } from '@dhis2/ui';
import { updateDataStore } from '../utils';
import classes from '../App.module.css'



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


const MetadataTemplating = (props) => {
  const { show } = useAlert(
    ({ msg }) => msg,
    ({ type }) => ({ [type]: true })
  )
  const [selectedTemplate, setSelectedTemplate] = useState(null);

      // Define your data store query
const TemplateQuery = {
  dataStore: {
    resource: `dataStore/${config.dataStoreTemplates}?${TemplateFilter}&filter=projectID:eq:${props.loadedProject.id}`,
  },
}

  const dataStoreKeyTemplateData = {
    results: {
      resource: `dataStore/${config.dataStoreTemplates}`,
      type: "dataStore",
      params: ({selectedTemplateKey}) => ({
        fields: 'key,name,overidingCategory,projectID,sideNavigation,formComponent,catCombo,HorizontalLevel0,HorizontalLevel1,verticalLevel1,verticalLevel2',
        filter:`key:eq:${selectedTemplateKey}`
      })
    }
  }

  // fields: 'key,name,overidingCategory,projectID,sideNavigation,formComponent,catCombo,HorizontalLevel0,HorizontalLevel1,verticalLevel1,verticalLevel2',
  //&filter=key:eq:${selectedTemplate}

  // params: ({id}) => ({
  //   id,

  // })


  {/* useDataQuery(query) loader */}
  const { loading: loading, error: error, data: data } = useDataQuery(TemplateQuery);

  const { loading: loading3, error: error3, data: TemplateData, refetch: TemplateDataRefetch} = useDataQuery(dataStoreKeyTemplateData, {variables: {
    selectedTemplateKey: selectedTemplate}
  });
  useEffect(() => {

    TemplateDataRefetch({selectedTemplateKey: selectedTemplate})

  }, [selectedTemplate, TemplateDataRefetch]);



    const handleTemplateChange = (event) => {

        const selectedValue = event && event.selected !== undefined ? event.selected : event;
        TemplateDataRefetch({selectedTemplateKey: selectedValue})

        setSelectedTemplate(selectedValue)
    }
    const applyTemplate = () => {

      TemplateDataRefetch({selectedTemplateKey: selectedTemplate})
      if (TemplateData){

        let templateObject = TemplateData?.results?.entries[0] || [];
        console.log(templateObject)
        templateObject.id = props.selectedDataElementId;
        templateObject.name = props.selectedDataElement;



        // Destructure the object, excluding key and catCombo fields
        const { key, catCombo, ...newData } = templateObject;
        console.log(props.selectedDataElementId)
        console.log(newData)

        const projectData = {
          "dataElements":[        
            newData
          ]
      }

      if(updateDataStore(props.engine, {
          ...props.loadedProject,
          ...projectData,
          dataElements: [...props.loadedProject.dataElements, ...projectData.dataElements],
        }, config.dataStoreName, props.loadedProject.key)){

          show({ msg: `Data Element  "${props.selectedDataElementId}" added successfully.`, type: 'success' })
          handleCloseModal()
      }
  
      }

     

    }
    

    const handleCloseModal = () => {
      props.setShowModalMetadataTemplate(false)
      props.handleDataElementRefreshClick()      

    };

    {/*  useDataQuery(query) exceptions */}
    
    if (error ) {
        return <span>ERROR: {error?.message }</span>;
    }

    if (loading) {
        return <span>Loading...</span>;
    }
    if (error3) {
      return <span>ERROR: {error3?.message }</span>;
    }
    if (loading3) {
      return <span>Loading...</span>;
    }
  return (
    <Modal>
      <ModalTitle>
        Select Template

        </ModalTitle>
          <ModalContent>
    
          <SingleSelect
                filterable
                noMatchText="No categories found"
                placeholder="Select Template"
                selected={selectedTemplate}
                value={selectedTemplate}
                onChange={({ selected }) => handleTemplateChange(selected)}

            >
              {data?.dataStore?.entries
              .filter(({ projectID }) => projectID === props.loadedProject.id)
              .map(({ key, name }) => (
              <SingleSelectOption 
              label={name} 
              key={key}
              value={key}
                      />
              ))}
            </SingleSelect>
          </ModalContent>
          <ModalActions>
            <ButtonStrip>
              <Button onClick={() => handleCloseModal()}>Close</Button>
              <Button primary  onClick={() => applyTemplate()}
              
              disabled={selectedTemplate === null}>
                Apply Template
              </Button>

            </ButtonStrip>
          </ModalActions>
    </Modal>
  );
};

export default MetadataTemplating;
