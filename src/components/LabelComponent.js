import { useDataQuery } from '@dhis2/app-runtime'
import { SingleSelect, SingleSelectOption  } from '@dhis2-ui/select'
import { config, 
  labelNameFilter,   
  conditionLevels,
 } from '../consts'
import React, { useState, useEffect } from 'react';
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button } from '@dhis2/ui';
import { Input } from '@dhis2-ui/input'
import classes from '../App.module.css'

import {alignLevelsReverse} from '../utils'


const LabelComponent = (props) => {
  const [componentID, setComponentID] = useState("");
  const [loadedLabel, setLoadedLabel] = useState(false);

  const LabelQuery = {
    dataStore: {
        resource: `dataStore/${config.dataStoreLabelName}?${labelNameFilter}&filter=key:eq:${props.selectedLabel}`,
    }
  };
  
  const { loading, error, data } = useDataQuery(LabelQuery);

  if (error) {
      // if (error.status === 409) {
      //     return <span>Conflict: There was a conflict in the data retrieval process.</span>;
      // }
      // return <span>ERROR: {error?.message}</span>;
  }
  
  if (loading) {
      return <span>Loading...</span>;
  }

  if (data) {
      if (props.editLabelMode) {
        if(!loadedLabel){
          const selectedLabel = data.dataStore?.entries || [];
          console.log(selectedLabel)
          console.log(selectedLabel[0].LabelLevel)        
          setComponentID(selectedLabel[0].id)  
          props.setSelectedMetadataOption(selectedLabel[0].metadataType)
          props.setMetadataName(selectedLabel[0].name)
          props.setSelectedlabelLevel(alignLevelsReverse(selectedLabel[0].LabelLevel))
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
                                        onChange={() => props.setSelectedMetadataOption("DataElement")}
                                    />
                                     &nbsp;Data Element
                            </label>
                            <label style={{ marginLeft: '10px' }}>
                                    <input
                                        type="radio"
                                        value=" CategoryOption"
                                        checked={props.selectedMetadataOption === "CategoryOption"}
                                        onChange={() => props.setSelectedMetadataOption("CategoryOption")}
                                    />
                                     &nbsp;Category Option
                            </label>
                        </div>
                        <select id="metadataLevel" value={props.selectedLabelLevel} onChange={props.handleLabelLevelChange} className={classes.selectField}>
                                    <option value="">Select Level</option>
                                    {conditionLevels.map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                        </select>

                        <Input
                              name="metadataName"
                              placeholder="Metadata Name"
                              value={props.metadataName}
                              onChange={({ value }) => props.setMetadataName(value)}
                              className={classes.inputField}
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
                    <Button onClick={props.handleCloseLabelModal}>Cancel</Button>
                    {/* Add save changes logic here */}
                    <Button primary onClick={() => props.handleCreateLabel(props.editLabelMode ? 'update' : 'new', componentID)}>
                      {props.editLabelMode ? 'Update Label' : 'Set Label'}
                    </Button>
                    </ButtonStrip>
                </ModalActions>
                </Modal>
  );
};

export default LabelComponent;
