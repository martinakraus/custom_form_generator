import { useDataQuery, useDataMutation } from '@dhis2/app-runtime'
import React, { useState, useEffect } from 'react';
import ConfigureMetadata from './ConfigureMetadata'
import TooltipComponent from './TooltipComponent'


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

const LoadProjects = ({ engine, setShowModalLoadProjects, showModalLoadProjects, reloadProjects, setReloadProjects }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const [selectedDataSet,setselectedDataSet] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfigureProject, setShowModalConfigureProject] = useState(false);
  const [filterText, setFilterText] = useState('');
  
    // Define your data store query
  const dataStoreQuery = {
      dataStore: {
        resource: `dataStore/${config.dataStoreName}?${ProjectsFiltersMore}`,
      },
  }

   
    // Fetch the projects using useDataQuery
  const { loading, error, data, refetch } = useDataQuery(dataStoreQuery);
  if (data) {
      // console.log(data);
      // console.log('Data exist');
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
    setShowEditModal(true);
  };


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
  const handleDeleteProject = async (projectName, KeyID) => {

    try {
      await engine.mutate({
        resource: `dataStore/${config.dataStoreName}/${KeyID}`,
        type: 'delete',
      });
      console.log(`Project "${projectName}" deleted successfully.`);
      handleCloseModal(); // Close the modal after successful deletion
      refetch(); // Refetch data after deletion
    } catch (error) {
      console.error('Error deleting project:', error);
    }

    setSelectedProject(null);
    setShowDeleteModal(false)
    
    console.log('Deleting project:', KeyID);


  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    setShowEditModal(false);
    setShowDeleteModal(false);
  };

  return (
    <div className={classes.tableContainer}>
      <InputField
        className={classes.filterInput}
        inputWidth={'20vw'}
        label="Filter by - Project Name, ID or DataSet"
        name="filter"
        value={filterText}
        onChange={(e) => handleFilterChange(e.value)}
      />
      
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
                    buttonMode="primary"
                    />
                  {/* <Button primary onClick={() => handleConfigureProject(project)}
                        className={`${classes.buttonRight} ${classes.iconButton}`}>
                        
                        <IconEdit16 className={classes.icon} />
                        
                        </Button> */}
                  <TooltipComponent 
                    IconType={IconTextHeading16} 
                    btnFunc={handleEditProject}
                    project={project}
                    dynamicText="Rename"
                    buttonMode="secondary"

                    />
                  {/* <Button secondary onClick={() => handleEditProject(project)}
                        className={`${classes.buttonRight} ${classes.renamebutton}`} 
                        >
                        <IconTextHeading16 className={classes.icon} />
                  </Button> */}

                  <TooltipComponent 
                      IconType={IconDelete16} 
                      btnFunc={handleDeleteProjectConfirmation}
                      project={project}
                      dynamicText="Delete Project"
                      buttonMode="destructive"

                    />
                  {/* <Button style={{ color: 'red', borderColor: 'red' }}
                                    className={`${classes.buttonRight} ${classes.iconButton}`}
                                    destructive onClick={() => handleDeleteProjectConfirmation(project)}>

                                    <IconDelete16 className={classes.icon} />
                                    </Button> */}
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
            <div>{selectedProject ? `Editing: ${selectedProject.projectName}` : null}</div>
          </ModalContent>
          <ModalActions>
            <ButtonStrip>
              <Button onClick={handleCloseModal}>Cancel</Button>
              {/* Add save changes logic here */}
              <Button primary>Save Changes</Button>
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
          </ModalContent>
          <ModalActions>
            <ButtonStrip>
              <Button onClick={handleCloseModal}>Cancel</Button>
              {/* Add save changes logic here */}
              <Button destructive onClick={() =>
                    handleDeleteProject(
                      selectedProject ? selectedProject.projectName : '',
                      selectedProject ? selectedProject.key : ''
                    )
                  }
                  primary>Delete Project
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
