import { useDataQuery } from '@dhis2/app-runtime'
import { SingleSelect, SingleSelectOption  } from '@dhis2-ui/select'
import React, { useState, useEffect } from 'react';
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button } from '@dhis2/ui';
import classes from '../App.module.css'


/*  Query Parameters**/
const query = {
  dataSets: {
      resource: 'dataSets',
      params: {
          fields: ['id', 'displayName'],
      },
  },


}

const MetadateTemplating = (props) => {

  const [selectedDataSet,setselectedDataSet] = useState(props.selectedDataSet);
  const [selectedDataSetName,setselectedDataSetName] = useState([]);
  const [selectedDataElementId, setSelectedDataElementId] = useState(null);
  const [selectedDataElement, setSelectedDataElement] = useState(null);
  const [fileredHorizonatlCatCombo, setfileredHorizonatlCatCombo] = useState([]);
  const [fileredVerticalCatCombo, setfileredVerticalCatCombo] = useState([]);
  const [selectedVerticalCategoryID, setSelectedVerticalCategoryID] = useState(null);
  const [selectedHorizontalCategoryID, setSelectedHorizontalCategoryID] = useState(null);
  const [isDataSetsExpanded, setIsDataSetsExpanded] = useState(false);
  const [isDataElementExpanded, setIsDataElementExpanded] = useState(false);
  const [isVerticalCategoryExpanded, setIsVerticalCategoryExpanded] = useState(false);
  const [isHorizontalCategoryExpanded, setIsHorizontalCategoryExpanded] = useState(false);
   
  // State to hold the category options
  const [horinzontalCategoryOptions, setHorinzontalcategoryOptions] = useState([]);


    {/* useDataQuery(query) loader */}
    const { loading: loading1, error: error1, data: data1 } = useDataQuery(query);

    const handleDataSetChange = event => {
        setselectedDataSet(event.selected);
        setSelectedDataElement('');
        setSelectedDataElementId('');
        setfileredHorizonatlCatCombo([]);
        setfileredVerticalCatCombo([]);
        {data1.dataSets.dataSets.filter(dataSets => dataSets.id.includes(event.selected)).map(
        ({ id, displayName }) => (                    
            setselectedDataSetName({displayName})                   
                                    )
        )}
    }


    const handleCloseModal = () => {
      props.setShowModalMetadataTemplate(false)      

    };

    {/*  useDataQuery(query) exceptions */}
    
    if (error1 ) {
        return <span>ERROR: {error1?.message }</span>;
    }

    if (loading1) {
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
                selected=''
                value=''
                onChange={({ selected }) => handleVerticalCategoryChange(selected)}

            >

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

export default MetadateTemplating;
