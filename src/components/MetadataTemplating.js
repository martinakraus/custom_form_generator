import { useDataQuery } from '@dhis2/app-runtime'
import { SingleSelect, SingleSelectOption  } from '@dhis2-ui/select'
import { config, TemplateFilter } from '../consts'
import React, { useState, useEffect } from 'react';
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button } from '@dhis2/ui';
import classes from '../App.module.css'


    // Define your data store query
const TemplateQuery = {
      dataStore: {
        resource: `dataStore/${config.dataStoreTemplates}?${TemplateFilter}`,
      },
}


const MetadataTemplating = (props) => {

   
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [disabled, setDisable] = useState(true);


    {/* useDataQuery(query) loader */}
    const { loading: loading, error: error, data: data } = useDataQuery(TemplateQuery);
    console.log('This place')
    console.log(data)

    
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

    const handleTemplateChange = (event) => {

        const selectedValue = event && event.selected !== undefined ? event.selected : event;
        console.log(selectedValue)
        setSelectedTemplate(selectedValue)
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
              <Button primary  onClick={() => console.log('Button clicked')}>
                Load Template
              </Button>

            </ButtonStrip>
          </ModalActions>
    </Modal>
  );
};

export default MetadataTemplating;
