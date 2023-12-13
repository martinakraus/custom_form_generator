import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button } from '@dhis2/ui'
import React, { useState, useRef  } from 'react';
import { Input } from '@dhis2-ui/input'
import classes from '../App.module.css'
import { config } from '../consts'
import { generateRandomId } from '../utils';


const CreateProject = (props) => {
    const [projectName, setProjectName] = useState('');
    const handleCreateProject = async () => {

        if (!projectName.trim()) {
            console.log('Please enter a project name.');
            return;
          }
      
          // Remove spaces from projectName
        const trimmedProjectName = projectName.replace(/\s+/g, '');

        const id = generateRandomId();

        const projectData = {
          projectName: projectName,
          id: id,
          keyID: `${trimmedProjectName}-${id}`
        };
        console.log(projectData);
      
        try {
          await props.engine.mutate({
            resource: `dataStore/${config.dataStoreName}/${trimmedProjectName}-${id}`,
            type: 'create',
            data: projectData,
          });
      
          // Close the modal or perform any other actions upon success
          handleCloseModal();
          props.setReloadProjects((prev) => !prev);
        } catch (error) {
          // Handle error (log, show alert, etc.)
          console.error('Error saving project:', error);
        }
      };

    const handleCloseModal = () => {
        props.setShowModalCreateProject(false);
    };

    return (
        <Modal>
            <ModalTitle>Create New Project</ModalTitle>
            <ModalContent>
                <div className={`${classes.mainSection}`}>
                        <div className={classes.baseMargin}>        
                        <Input
                            name="ProjectName"
                            placeholder="Create Project"
                            value={projectName}
                            onChange={({ value }) => setProjectName(value)}
            />
                        </div>

                </div>
                </ModalContent>
                <ModalActions>
                <ButtonStrip end>
                    <Button onClick={handleCloseModal}>Cancel</Button>
                    <Button primary onClick={handleCreateProject}>
                        Create Project
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
};

export default CreateProject;
