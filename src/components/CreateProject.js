import { useDataQuery, useAlert } from '@dhis2/app-runtime'
import { SingleSelect, SingleSelectOption  } from '@dhis2-ui/select'
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button } from '@dhis2/ui'
import React, { useState, useEffect  } from 'react';
import { Input } from '@dhis2-ui/input'
import classes from '../App.module.css'
import { config, ProjectsFilters} from '../consts'
import { generateRandomId, modifiedDate, createOrUpdateDataStore } from '../utils';
import PropTypes from 'prop-types';

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
  const { show } = useAlert(
    ({ msg }) => msg,
    ({ type }) => ({ [type]: true })
  )
    const [projectName, setProjectName] = useState('');
    const [selectedDataSet,setselectedDataSet] = useState('');
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

            // console.log(dataStoreData.dataStore.entries);
            const projectsArray = dataStoreData.dataStore?.entries || [];
            const projectNameExists = (projectNameToCheck) => {
              return projectsArray.some(project => project.projectName.toLowerCase() === projectNameToCheck.toLowerCase());
            };

            setExistingProjects(projectNameExists(projectName))
            // console.log(existingProject);
          }

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
            show({ msg: 'Project Name is not Unique :' +projectName, type: 'warning' })
            return;
        }

        // Remove spaces from projectName
        const trimmedProjectName = projectName.replace(/\s+/g, '');

        const id = generateRandomId();
        const keyID=`${trimmedProjectName}-${id}`

        const projectData = {
          projectName: projectName,
          id: id,
          dataSet:{id:selectedDataSet, name:selectedDataSetName.displayName},
          key: keyID,
          dataElements:[],
          modifiedDate:modifiedDate(),

        };
        // console.log(projectData);
        
        try {
          createOrUpdateDataStore(props.engine, projectData, config.dataStoreName, keyID, 'create')
      
          // Close the modal or perform any other actions upon success
          handleCloseModal();
          show({ msg: 'Project Created :' +projectData.projectName, type: 'success' })
          props.setReloadProjects((prev) => !prev);
        } catch (error) {
          // Handle error (log, show alert, etc.)
          console.error('Error saving project:', error);
        }
      };
    

    const handleCloseModal = () => {
        setProjectName('')
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
                                        <SingleSelectOption key={id} label={displayName} value={id} />
                                        ))}
                            </SingleSelect>
                        
                        </div>

                </div>
                </ModalContent>
                <ModalActions>
                <ButtonStrip end>
                    <Button onClick={handleCloseModal}>Cancel</Button>
                    <Button 
                      primary 
                      onClick={handleCreateProject}
                      disabled={(projectName.length <= 0) || (selectedDataSet.length <= 0)}
                      >
                        Create Project
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
};

CreateProject.propTypes = {
  engine: PropTypes.object.isRequired,
  setReloadProjects: PropTypes.func.isRequired,
};
export default CreateProject;
