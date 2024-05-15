import { useDataQuery, useAlert } from '@dhis2/app-runtime'
import React, { useState, useEffect } from 'react';
import ConfigureMetadata from './ConfigureMetadata'
import TooltipComponent from './TooltipComponent'
import CreateProject from './CreateProject'
import { Input } from '@dhis2-ui/input'
import {updateDataStore, generateRandomId, createDataStore, customImage} from '../utils'
import { Chip } from '@dhis2-ui/chip'
import PropTypes from 'prop-types';

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
import { config, dataStoreQueryMore, SideNavigationQuery, FormComponentQuery, TemplateQueryMore, ConditionQueryMore, LabelQuery} from '../consts'
import { IconEdit16, IconDelete16, IconTextHeading16, IconAddCircle24, IconAddCircle16} from '@dhis2/ui-icons';

import classes from '../App.module.css'
import CleaningServices from './CleaningServices';


const LoadProjects = ({ engine, reloadProjects, setReloadProjects }) => {
  const { show } = useAlert(
    ({ msg }) => msg,
    ({ type }) => ({ [type]: true })
  )

  const [projects, setProjects] = useState([]);
  // const projects = []
  const [projectName, setProjectName] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [existingProject, setExistingProjects] = useState(false);
  const [showModalCreateProject, setShowModalCreateProject] = useState(false);
  const [showModalLoadProjects, setShowModalLoadProjects] = useState(false);

  const [selectedDataSet,setselectedDataSet] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [showConfigureProject, setShowModalConfigureProject] = useState(false);
  const [filterText, setFilterText] = useState('');

  const [cleaner, setCleaner] = useState(false);
  const [cleanToggle, setCleanerToggle] = useState(false);
  
  

   
    // Fetch the projects using useDataQuery
  const { loading, error, data, refetch } = useDataQuery(dataStoreQueryMore);
  const { data: SideNavigationQueryData, refetch:SideNavigationQueryDataRefetch} = useDataQuery(SideNavigationQuery); 
  const { data: FormComponentQueryData, refetch:FormComponentQueryDataRefetch } = useDataQuery(FormComponentQuery); 
  const { data: TemaplateQueryData, refetch:TemaplateQueryDataRefetch} = useDataQuery(TemplateQueryMore); 
  const { data: ConditionsQueryData, refetch:ConditionsQueryDataRefetch} = useDataQuery(ConditionQueryMore); 
  const { data: LabelQueryData, refetch:LabelQueryDataRefetch} = useDataQuery(LabelQuery); 
  if (data) {
      // console.log(data);
      // console.log('Data exist');
      // setProjects(data.dataStore ? [data.dataStore] : []);
  }


      // check for unique project name
      useEffect(() => {
        if (data?.dataStore) {
          // Now you can safely access dataStoreData.dataStore
          if (data?.dataStore?.entries){

            // console.log(dataStoreData.dataStore.entries);
            const projectsArray = data.dataStore?.entries || [];
            const projectNameExists = (projectNameToCheck) => {

              try {
                return projectsArray.some(project => project.projectName.toLowerCase() === projectNameToCheck.toLowerCase());
              } catch (error) {
                return false; // or handle the error as needed
              }

            };

            setExistingProjects(projectNameExists(projectName))
            // console.log(existingProject);
          }

        } 
    }, [projectName]);


  useEffect(() => {
    refetch();

  }, [reloadProjects, refetch]);


  useEffect(() => {
    if (data) {
      // setProjects(data.dataStore ? [data.dataStore] : []);

          // Check if entries property exists in data.dataStore
        const newProjects = data?.dataStore?.entries || [];
        if (newProjects.length > 0){
          setProjects(newProjects);
        }

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

  const handleCopyProject = async (project) => {
    
    setSelectedProject(project); 

    const init_projectID = project.id
       
    project.id=generateRandomId()
    project.projectName = project.projectName+'_Copy'
    const lastIndex = project.projectName.lastIndexOf("-");
    const removeID = project.projectName.substring(0, lastIndex);
    project.key = removeID+generateRandomId()


    const projectIds = [init_projectID];
    const SideNavigations = SideNavigationQueryData?.dataStore?.entries || [];
    
    const filteredSideNavigations = SideNavigations.filter(entry => projectIds.includes(entry.projectID));

    // console.log('filteredSideNavigations: ', filteredSideNavigations)

    const FormComponents = FormComponentQueryData?.dataStore?.entries || [];
    const filteredFormComponents = FormComponents.filter(entry => projectIds.includes(entry.projectID));
    // console.log('filteredFormComponents: ', filteredFormComponents)
    
    const Templates = TemaplateQueryData?.dataStore?.entries || [];
    const filteredTemaplates = Templates.filter(entry => projectIds.includes(entry.projectID));
    // console.log('filteredTemaplates: ', filteredTemaplates)
    
    const Conditions = ConditionsQueryData?.dataStore?.entries || [];
    const filteredConditions = Conditions.filter(entry => projectIds.includes(entry.projectID));
    // console.log('filteredConditions: ', filteredConditions)
    
    const Labels = LabelQueryData?.dataStore?.entries || [];
    const filteredLabels = Labels.filter(entry => projectIds.includes(entry.projectID));
    // console.log('filteredLabels: ', filteredLabels)

    createDataStore (engine, project, config.dataStoreName, project.key)

    if (filteredSideNavigations.length > 0){
      filteredSideNavigations.forEach(SideNavigations => {
          SideNavigations.projectID = project.id
          const key = `${SideNavigations.sideNavName}-${SideNavigations.projectID}`
          SideNavigations.key=key

          createDataStore (engine, SideNavigations, config.dataStoreSideNavigations, key)
      });  
    }

    if (filteredFormComponents.length > 0){
        filteredFormComponents.forEach(form => {
          form.projectID = project.id
          const key = `${form.formComponentName}-${form.projectID}`
          form.key=key

            createDataStore (engine, form, config.dataStoreFormComponents, key)
        });   

    }

    if (filteredTemaplates.length > 0){    
        filteredTemaplates.forEach(template => {
          template.projectID = project.id
          template.id = generateRandomId();
          const trimmedTemplateName = template.name.replace(/\s+/g, '');
          const key = `${trimmedTemplateName}-${template.id}`
          template.key=key

            createDataStore (engine, template, config.dataStoreTemplates, key)
        });             

    }

    if (filteredConditions.length > 0){     
        filteredConditions.forEach(condition => {
          condition.projectID = project.id
          condition.id = generateRandomId();
          const trimmedConditionName = condition.name.replace(/\s+/g, '');
          const key = `${trimmedConditionName}-${condition.id}`
            condition.key=key

            createDataStore (engine, condition, config.dataStoreConditions, key)
        });          

    }
    if (filteredLabels.length > 0){ 
        
        filteredLabels.forEach(label => {
          label.projectID = project.id
          label.id = generateRandomId();
          // Maximum length for the trimmed string is 15
          // Remove spaces from const
          const trimmedLabelName= label.labelName.replace(/\s+/g, '');
          const trimmedName = trimmedLabelName.substring(0, 15);
          const key = `${trimmedName}-${label.id}`
          label.key=key

            createDataStore (engine, label, config.dataStoreLabelName, key)
        });

    }



    show({ msg: 'Project Copy Created :' +project.projectName, type: 'success' })
    setReloadProjects((prev) => !prev);

    handleCloseModal()
  }

  const handleRenaming = () =>{

    if (existingProject){
      console.log('Project Name is not Unique');
      show({ msg: 'Project Name is not Unique :' +projectName, type: 'warning' })
      return;
  }

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


    // console.log(project.key);
    setselectedDataSet(project.dataSet.id);
    // console.log(data);

    setShowModalConfigureProject(true);


  }
  const handleDeleteProject = async (projectName, KeyID, projectID) => {

    setCleanerToggle((prev) => !prev);
    setCleaner(true)

    try {
      await engine.mutate({
        resource: `dataStore/${config.dataStoreName}/${KeyID}`,
        type: 'delete',
      });
      show({ msg: 'Project deleted successfully:' +projectName, type: 'success' })
      setReloadProjects((prev) => !prev);
      handleCloseModal(); // Close the modal after successful deletion
      refetch(); // Refetch data after deletion
    } catch (error) {
      console.error('Error deleting project:', error);
    }


    setSelectedProject(null);
    setShowDeleteModal(false)
    
    // console.log('Deleting project:', KeyID);


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
    <div style={{ width: '90%' }}>

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <InputField
                  className={classes.filterInput}
                  inputWidth={'20vw'}
                  label="Filter by - Project Name, ID or DataSet"
                  name="filter"
                  value={filterText}
                  onChange={(e) => handleFilterChange(e.value)}
                />
                <Chip
                    className={`${classes.customImageContainer} ${classes.CreateProjectBgColor}`}
                    onClick={() => setShowModalCreateProject(true)}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div>  
                        <span className={classes.iconAddNewProject} style={{ marginTop: '2px' }}>
                          <IconAddCircle16 />
                        </span>
                      </div>
                      <div>
                        <span style={{ color: 'white', marginLeft: '5px' }}>Create Project</span>
                      </div>
                    </div>

  
                </Chip>

                <Chip
                  className={classes.customImageContainer}
                  icon={customImage('sync', 'large')}
                  onClick={handleCustomImageClick}
                  style={{ marginLeft: '10px' }} // Adjust margin as needed
                >
                  Refresh
                </Chip>
                <Chip
                  className={classes.customImageContainer}
                  icon={customImage('cleaning', 'large')}
                  onClick={() => {
                    setCleaner(true);
                  }}
                  style={{ marginLeft: '10px' }} // Adjust margin as needed
                >
                  Cleaner
                </Chip>
              </div>

              <div className={classes.tableContainer_projectList}>
                      <div className={classes.tableHeaderWrapper}>
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
                      </Table>
                      </div>
                      <div className={classes.tableContainer_dataElements}>


                      <div className={classes.tableBodyWrapper}>
                        <Table className={classes.dataTable}>
                        <TableBody>
                        {filteredProjects.length > 0 && Array.isArray(filteredProjects) &&
                            filteredProjects.map((project) => (
                              <TableRow className={classes.customTableRow} key={project?.key || ''}>
                                <TableCell className={classes.customTableCell}>{project?.projectName || ''}</TableCell>
                                <TableCell className={classes.customTableCell}>{project?.id || ''}</TableCell>
                                <TableCell className={classes.customTableCell}>{project?.dataSet?.name || ''}-{project?.dataSet?.id || ''}</TableCell>
                                <TableCell className={classes.customTableCell}>{project?.modifiedDate || ''}</TableCell>
                                <TableCell className={`${classes.customTableCell}`}>

                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <TooltipComponent 
                                    IconType={IconEdit16} 
                                    btnFunc={handleConfigureProject}
                                    project={project}
                                    dynamicText="Edit"
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
                              </div>
                              </TableCell>
                              </TableRow>
                        ))}

                        </TableBody>   
                      
                      </Table>
            </div>


                      </div>


                      
                      {/* <Table className={classes.dataTable}>
                        <TableHead>
                          <TableRowHead>
                            <TableCellHead>Project Name</TableCellHead>
                            <TableCellHead>Project Unique ID</TableCellHead>
                            <TableCellHead>DataSet</TableCellHead>
                            <TableCellHead>Date modified</TableCellHead>
                            <TableCellHead>Actions</TableCellHead>
                          </TableRowHead>
                        </TableHead> */}



   

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
                {/* <CleaningServices engine={engine} projectID={projectID} setCleaner={setCleaner} setCleanerToggle={setCleanerToggle} cleanToggle={cleanToggle}/> */}
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
                      >Delete Project
                  </Button>
                </ButtonStrip>
              </ModalActions>
            </Modal>
          )}

        {cleaner && (

                <CleaningServices engine={engine} setCleaner={setCleaner} setCleanerToggle={setCleanerToggle} cleanToggle={cleanToggle}/>

          )}
                

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

                {/* Modal for creating a new project */}
                  {showModalCreateProject && 
                      (<CreateProject 
                          engine={engine} 
                          setShowModalCreateProject={setShowModalCreateProject} 
                          setShowModalLoadProjects={setShowModalLoadProjects}
                          setReloadProjects={setReloadProjects} 
                          />                    
                  )}


        </div>
    </div>
  );
};


LoadProjects.propTypes = {
  engine: PropTypes.object.isRequired,
  reloadProjects: PropTypes.bool.isRequired,
  setReloadProjects: PropTypes.func.isRequired,
};

export default LoadProjects;
