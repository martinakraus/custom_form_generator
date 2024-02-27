import { useDataQuery } from '@dhis2/app-runtime'
import { SingleSelect, SingleSelectOption  } from '@dhis2-ui/select'
import { config, 
  exclusionRuleFilter,   
  conditionLevels,
  exclusionLevels, } from '../consts'
import React, { useState, useEffect } from 'react';
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button } from '@dhis2/ui';
import { Input } from '@dhis2-ui/input'
import classes from '../App.module.css'
import {alignLevelsReverse} from '../utils'






const ExclusionRuleComponent = (props) => {
  const [componentID, setComponentID] = useState("");
  const [loadedExclusion, setLoadedExclusion] = useState(false);

  const ExclusionQuery = {
    dataStore: {
        resource: `dataStore/${config.dataStoreConditions}?${exclusionRuleFilter}&filter=key:eq:${props.selectedExclusion}`,
    }
  };
  
  const { loading, error, data } = useDataQuery(ExclusionQuery);

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
      if (props.editExclusionMode) {
        if(!loadedExclusion){
          const selectedExclusion = data.dataStore?.entries || [];        
          setComponentID(selectedExclusion[0].id)  
          props.setConditionName(selectedExclusion[0].name)
          props.setCondition(selectedExclusion[0].condition)
          props.setSelectedConditionLevel(alignLevelsReverse(selectedExclusion[0].conditionLevel))
          props.setExclusion(selectedExclusion[0].exclusion)
          props.setSelectedExclusionLevel(alignLevelsReverse(selectedExclusion[0].exclusionLevel))
          setLoadedExclusion(true)
        }
          // console.log(data)
      }
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

            <Input
                  name="condition"
                  placeholder="Condition"
                  value={props.condition}
                  onChange={({ value }) => props.setCondition(value)}
                  className={classes.inputField}
              />

            <select id="conditionLevel" value={props.selectedConditionLevel} onChange={props.handleConditionLevelChange} className={classes.selectField}>
                        <option value="">Select Condition Level</option>
                        {conditionLevels.map(level => (
                            <option key={level} value={level}>{level}</option>
                        ))}
                    </select>

            <Input
                  name="exclude"
                  placeholder="Exclude"
                  value={props.exclude}
                  onChange={({ value }) => props.setExclusion(value)}
                  className={classes.inputField}
              />

             <select id="conditionLevel" value={props.selectedExclusionLevel} onChange={props.handleExclusionLevelChange} className={classes.selectField}>
                        <option value="">Select Exclusion Level</option>
                        {exclusionLevels.map(level => (
                            <option key={level} value={level}>{level}</option>
                        ))}
                    </select>


        </div>
        </ModalContent>
        <ModalActions>
            <ButtonStrip>
            <Button onClick={props.handleCloseExclusionModal}>Cancel</Button>
            {/* Add save changes logic here */}
            <Button primary onClick={() => props.handleCreateExclusion(props.editExclusionMode ? 'update' : 'new', componentID)}>
            {props.editExclusionMode ? 'Update Exclusion' : 'Create Exclusion'}
            
            

            </Button>
            </ButtonStrip>
        </ModalActions>
        </Modal>
  );
};

export default ExclusionRuleComponent;
