import { useDataQuery, useDataMutation, useAlert } from '@dhis2/app-runtime'
import React, { useState, useEffect } from 'react';
import ConfigureMetadata from './ConfigureMetadata'
import TooltipComponent from './TooltipComponent'
import { Input } from '@dhis2-ui/input'
import {updateDataStore, generateRandomId, createDataStore, customImage} from '../utils'


import {
  Table,
  TableHead,
  TableRowHead,
  TableCellHead,
  TableBody,
  TableRow,
  TableCell,
  InputField,
} from '@dhis2/ui';
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button } from '@dhis2/ui';
import { config, ProjectsFiltersMore } from '../consts'
import { IconEdit16, IconDelete16, IconTextHeading16} from '@dhis2/ui-icons';
import classes from '../App.module.css'
import CleaningServices from './CleaningServices';

const LoadProjects = ({ engine, setShowModalLoadProjects, showModalLoadProjects, reloadProjects, setReloadProjects }) => {
  const { show } = useAlert(
    ({ msg }) => msg,
    ({ type }) => ({ [type]: true })
  )
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  const [selectedDataSet,setselectedDataSet] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [showConfigureProject, setShowModalConfigureProject] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [projectID, setProjectID] = useState('');
  const [cleaner, setCleaner] = useState(false);
  
  
    // Define your data store query
  const dataStoreQuery = {
      dataStore: {
        resource: `dataStore/${config.dataStoreName}?${ProjectsFiltersMore}`,
      },
  }

   
    // Fetch the projects using useDataQuery
  const { loading, error, data, refetch } = useDataQuery(dataStoreQuery);
  if (data) {
      console.log(data);
      console.log('Data exist');
      // setProjects(data.dataStore ? [data.dataStore] : []);
  }
  useEffect(() => {
    refetch();

  }, [reloadProjects, refetch]);


  useEffect(() => {
    if (data) {
      // setProjects(data.dataStore ? [data.dataStore] : []);

          // Check if entries property exists in data.dataStore
        const newProjects = data.dataStore?.entries || [];
        setProjects(newProjects);
    }
  }, [data, reloadProjects, ]);

  const handleFilterChange = (value) => {
    setFilterText(value);
  };

  const filteredProjects = filterText
    ? projects.filter(
        (project) =>
          project.projectName.toLowerCase().includes(filterText.toLowerCase()) ||
          project.id.toLowerCase().includes(filterText.toLowerCase()) ||
          project.dataSet.name.toLowerCase().includes(filterText.toLowerCase())
      )
    : projects;


  const handleEditProject = (project) => {
    setSelectedProject(project);
    setProjectName(project ? project.projectName : null)
    setShowEditModal(true);
  };

  const handleCopyProjectConfirmation = (project) => {
    setSelectedProject(project);
    setShowCopyModal(true)

  }

  const handleCopyProject = (project) => {
    
    setSelectedProject(project); 
       
    project.id=generateRandomId()
    project.projectName = project.projectName+'_Copy'
    const lastIndex = project.projectName.lastIndexOf("-");
    const removeID = project.projectName.substring(0, lastIndex);
    project.key = removeID+generateRandomId()


   
    createDataStore (engine, project, config.dataStoreName, project.key)
    show({ msg: 'Project Copy Created :' +project.projectName, type: 'success' })
    setReloadProjects((prev) => !prev);

    handleCloseModal()
  }

  const handleRenaming = () =>{


    if (!selectedProject.hasOwnProperty('projectName')) {
      // If it doesn't exist, add it to the object
      selectedProject.projectName = projectName;
    } else {
      // If it exists, update its value
      selectedProject.projectName = projectName;
    }
    
    updateDataStore (engine, selectedProject, config.dataStoreName, selectedProject.key)
    show({ msg: 'Project Renamed:' +selectedProject.projectName, type: 'success' })
    setReloadProjects((prev) => !prev);

    handleCloseModal()

  }

  const handleDeleteProjectConfirmation = async (project) => {
    // Implement delete project logic here
    setSelectedProject(project);

    setShowDeleteModal(true)
  };
  const handleConfigureProject = async (project) =>{
    // Implement configure project logic here
    setSelectedProject(project);


    console.log(project.key);
    setselectedDataSet(project.dataSet.id);
    // console.log(data);

    setShowModalConfigureProject(true);


  }
  const handleDeleteProject = async (projectName, KeyID, projectID) => {
    console.log('projectID:',projectID)
    setProjectID(projectID)
    setCleaner(true)

    // try {
    //   await engine.mutate({
    //     resource: `dataStore/${config.dataStoreName}/${KeyID}`,
    //     type: 'delete',
    //   });
    //   show({ msg: 'Project deleted successfully:' +projectName, type: 'success' })
    //   setReloadProjects((prev) => !prev);
    //   handleCloseModal(); // Close the modal after successful deletion
    //   refetch(); // Refetch data after deletion
    // } catch (error) {
    //   console.error('Error deleting project:', error);
    // }
    // setProjectID(projectID)

    // setSelectedProject(null);
    // setShowDeleteModal(false)
    
    console.log('Deleting project:', KeyID);


  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setProjectName('')
    setShowCopyModal(false)
  };

  const handleCustomImageClick = () => {
    // Handle the click event for the custom image
    refetch();
    setReloadProjects((prev) => !prev);
  };

  return (
    <div className={classes.tableContainer_dataElements}>
      <InputField
        className={classes.filterInput}
        inputWidth={'20vw'}
        label="Filter by - Project Name, ID or DataSet"
        name="filter"
        value={filterText}
        onChange={(e) => handleFilterChange(e.value)}
      />

    <div className={classes.customImageContainer} onClick={handleCustomImageClick}>
        {customImage('sync', 'large')}
      </div>


      
      <Table className={classes.dataTable}>
        <TableHead>
          <TableRowHead>
            <TableCellHead>Project Name</TableCellHead>
            <TableCellHead>Project Unique ID</TableCellHead>
            <TableCellHead>DataSet</TableCellHead>
            <TableCellHead>Date modified</TableCellHead>
            <TableCellHead>Actions</TableCellHead>
          </TableRowHead>
        </TableHead>
        <TableBody>
        {Array.isArray(filteredProjects) &&
            filteredProjects.map((project) => (
              <TableRow className={classes.customTableRow} key={project.key}>
                <TableCell className={classes.customTableCell}>{project.projectName}</TableCell>
                <TableCell className={classes.customTableCell}>{project.id}</TableCell>
                <TableCell className={classes.customTableCell}>{project.dataSet.name}-{project.dataSet.id}</TableCell>
                <TableCell className={classes.customTableCell}>{project.modifiedDate}</TableCell>
                <TableCell className={`${classes.customTableCell}`}>
                  <TooltipComponent 
                    IconType={IconEdit16} 
                    btnFunc={handleConfigureProject}
                    project={project}
                    dynamicText="Configure"
                    buttonMode="secondary"
                    customIcon={true}
                    />
                  <TooltipComponent 
                    IconType={IconTextHeading16} 
                    btnFunc={handleEditProject}
                    project={project}
                    dynamicText="Rename"
                    buttonMode="secondary"
                    customIcon={true}

                    />

                  <TooltipComponent 
                    IconType={IconTextHeading16} 
                    btnFunc={handleCopyProjectConfirmation}
                    project={project}
                    dynamicText="Copy"
                    buttonMode="secondary"
                    customIcon={true}

                    />
                  

                  <TooltipComponent 
                      IconType={IconDelete16} 
                      btnFunc={handleDeleteProjectConfirmation}
                      project={project}
                      dynamicText="Delete"
                      buttonMode="destructive"
                      customIcon={true}

                    />

              </TableCell>
              </TableRow>
        ))}

        </TableBody>
      </Table>

      {showEditModal && (
        <Modal>
          <ModalTitle>Edit Project</ModalTitle>
          <ModalContent>
            {/* Add content for editing the selected project */}
            <div>            
            
            
            <Input
                              name="renameName"
                              placeholder="Rename Project"
                              value={projectName}
                              onChange={({ value }) => setProjectName(value)}
                              className={classes.inputField}
                          />
            </div>
          </ModalContent>
          <ModalActions>
            <ButtonStrip>
              <Button onClick={handleCloseModal}>Close</Button>
              {/* Add save changes logic here */}
              <Button primary onClick={() => handleRenaming()}>Rename</Button>
            </ButtonStrip>
          </ModalActions>
        </Modal>
      )}

    {showDeleteModal && (
        <Modal>
          <ModalTitle>Delete Project: Comfirmation</ModalTitle>
          <ModalContent>
            {/* Add content for editing the selected project */}
            <div>{selectedProject ? `Are you sure you want to permanently delete: ${selectedProject.projectName}` : null}</div>
            {cleaner && (<CleaningServices projectID={projectID} setCleaner={setCleaner}/>)}
          </ModalContent>
          <ModalActions>
            <ButtonStrip>
              <Button onClick={handleCloseModal}>Cancel</Button>
              {/* Add save changes logic here */}
              <Button destructive onClick={() =>
                    handleDeleteProject(
                      selectedProject ? selectedProject.projectName : '',
                      selectedProject ? selectedProject.key : '',
                      selectedProject ? selectedProject.id : ''
                    )
                  }
                  primary>Delete Project
              </Button>
            </ButtonStrip>
          </ModalActions>
        </Modal>
      )}

        {cleaner && (<CleaningServices projectID={projectID} setCleaner={setCleaner}/>)}

        {showCopyModal && (
          <Modal>
            <ModalTitle>Copy Project: Comfirmation</ModalTitle>
            <ModalContent>
              {/* Add content for editing the selected project */}
              <div>{selectedProject ? `Are you sure you want to create of copy of: ${selectedProject.projectName}` : null}</div>
            </ModalContent>
            <ModalActions>
              <ButtonStrip>
                <Button onClick={handleCloseModal}>Cancel</Button>
                {/* Add save changes logic here */}
                <Button onClick={() =>
                      handleCopyProject(
                        selectedProject 
                      )
                    }
                    primary>Create Project Copy
                </Button>
              </ButtonStrip>
            </ModalActions>
          </Modal>
        )}

            {/* Modal for configuring projects */}
            {/* Offload Memory of data query when leaving this page */}
            {showConfigureProject && 
                (<ConfigureMetadata 
                  engine={engine}
                  setShowModalConfigureProject={setShowModalConfigureProject}
                  selectedProject={selectedProject}
                  selectedDataSet={selectedDataSet}
                  />                    
            )}


    </div>
  );
};

export default LoadProjects;
