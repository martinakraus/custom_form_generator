import { useDataQuery } from '@dhis2/app-runtime'
import { SingleSelect, SingleSelectOption  } from '@dhis2-ui/select'
import { config, TemplateFilter, TemplateNoFilter } from '../consts'
import React, { useState, useEffect } from 'react';
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button } from '@dhis2/ui';
import classes from '../App.module.css'






const MetadataTemplating = (props) => {

      // Define your data store query
const TemplateQuery = {
  dataStore: {
    resource: `dataStore/${config.dataStoreTemplates}?${TemplateFilter}&filter=projectID:eq:${props.loadedProjectid}`,
  },
}

  const PROJECT_DATA_QUERY = {
    dataStore: {
        resource: `dataStore/${config.dataStoreTemplates}?${TemplateNoFilter}&filter=projectID:eq:${props.loadedProjectid}&filter=catCombo:eq:${props.fileredHorizontalCatCombo0[0]?.id}`,
    }
  };
   
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  {/* useDataQuery(query) loader */}
  const { loading: loading, error: error, data: data } = useDataQuery(TemplateQuery);
  const { loading: loading1, error: error1, data: data1 } = useDataQuery(PROJECT_DATA_QUERY);
    
  // Query to fetch data elements and their category information
  const query = {
    dataElement: {
      resource: 'dataElements',
      id: props.selectedDataElementId,
      params: {
        fields: 'id,categoryCombo[id]',
      },
    },
  };
  if (error1){
    console.log('******** error1 1*******')
    console.log(error1)
  }
  if (loading1){
    console.log('******** loading1 1*******')
    console.log(loading1)
  }
  if (data1){
    console.log('******** data 1*******')
    console.log(data1)
  }

    const handleTemplateChange = (event) => {

        const selectedValue = event && event.selected !== undefined ? event.selected : event;

        console.log(selectedValue)
        setSelectedTemplate(selectedValue)
    }
    const loadTemplate = (template) => {

      if (props.filteredHorizontalCatCombo0 && props.filteredHorizontalCatCombo0.length > 0 && props.filteredHorizontalCatCombo0[0].hasOwnProperty('id')) {
          // props.filteredHorizontalCatCombo0[0].id exists
          // {data?.dataStore?.entries
          //   .filter(({ projectID }) => projectID === props.loadedProjectid)
          //   .map(({ key, name }) => (              ))}
          console.log("props.filteredHorizontalCatCombo0[0].id exists");
      
      
      } 

    }
    

    const handleCloseModal = () => {
      props.setShowModalMetadataTemplate(false)      

    };

    {/*  useDataQuery(query) exceptions */}
    
    if (error ) {
        return <span>ERROR: {error?.message }</span>;
    }

    if (loading) {
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
              .filter(({ projectID }) => projectID === props.loadedProjectid)
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
              <Button primary  onClick={() => loadTemplate()}>
                Load Template
              </Button>

            </ButtonStrip>
          </ModalActions>
    </Modal>
  );
};

export default MetadataTemplating;
