import { useDataQuery } from '@dhis2/app-runtime'
import { SingleSelect, SingleSelectOption  } from '@dhis2-ui/select'
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button } from '@dhis2/ui'
import React, { useState, useEffect  } from 'react';
import { Input } from '@dhis2-ui/input'
import classes from '../App.module.css'
import { config, ProjectsFilters} from '../consts'
import { generateRandomId } from '../utils';

/*  Query Parameters**/
const query = {
  dataSets: {
      resource: 'dataSets',
      params: {
          fields: ['id', 'displayName'],
      },
  },
}

// Define your data store query
const dataStoreQuery = {
  dataStore: {
    resource: `dataStore/${config.dataStoreName}?${ProjectsFilters}`,
  },
}


const CreateProject = (props) => {
    const [projectName, setProjectName] = useState('');
    const [selectedDataSet,setselectedDataSet] = useState([]);
    const [selectedDataSetName,setselectedDataSetName] = useState([]);
    const [existingProject, setExistingProjects] = useState(false);
    {/* useDataQuery(query) loader */}
    const { loading: loading1, error: error1, data: data1 } = useDataQuery(query);
    const { data: dataStoreData } = useDataQuery(dataStoreQuery); // Use separate hook for dataStoreQuery

    // check for unique project name
    useEffect(() => {
        if (dataStoreData?.dataStore) {
          // Now you can safely access dataStoreData.dataStore
          if (dataStoreData?.dataStore?.entries){

            console.log(dataStoreData.dataStore.entries);
            const projectsArray = dataStoreData.dataStore?.entries || [];
            const projectNameExists = (projectNameToCheck) => {
              return projectsArray.some(project => project.projectName.toLowerCase() === projectNameToCheck.toLowerCase());
            };
            setExistingProjects(projectNameExists(projectName))
            // console.log(existingProject);
          }

        } else {
          // Handle the case where dataStoreData or dataStoreData.dataStore is undefined
          console.error('Data structure does not match the expected format');
        }
    }, [projectName]);
    
    {/*  useDataQuery(query) exceptions */}
    
    if (error1 ) {
        return <span>ERROR: {error1?.message }</span>;
    }

    if (loading1) {
        return <span>Loading...</span>;
    }
    
    const handleDataSetChange = event => {
        setselectedDataSet(event.selected);
        {data1.dataSets.dataSets.filter(dataSets => dataSets.id.includes(event.selected)).map(
          ({ id, displayName }) => (                    
              setselectedDataSetName({displayName})                   
          )
          )}
        // console.log(selectedDataSetName.displayName);
    }

    const handleCreateProject = async () => {
        const dataSetName = selectedDataSetName.displayName ? true : false;

        if (!projectName.trim() || !dataSetName) {
            console.log('Please enter a project name or select dataSet');
            return;
        }

        if (existingProject){
            console.log('Project Name is not Unique');
            return;
        }

        // Remove spaces from projectName
        const trimmedProjectName = projectName.replace(/\s+/g, '');

        const id = generateRandomId();

        const projectData = {
          projectName: projectName,
          id: id,
          dataSet:{id:selectedDataSet, name:selectedDataSetName.displayName},
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
                        <div className={classes.baseMargin}>
                          <SingleSelect
                                        className="select"
                                        filterable
                                        noMatchText="No match found"
                                        placeholder="Select dataSet"
                                        selected={selectedDataSet}
                                        value={selectedDataSet}
                                        onChange={handleDataSetChange}
                                        
                                    >
                                        {data1.dataSets.dataSets.map(({ id, displayName }) => (
                                        <SingleSelectOption label={displayName} value={id} />
                                        ))}
                            </SingleSelect>
                        
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
