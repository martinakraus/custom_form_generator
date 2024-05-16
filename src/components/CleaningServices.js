import { useDataQuery, useAlert } from '@dhis2/app-runtime'
import React, { useEffect } from 'react';
import {deleteObjects, transformData} from '../utils'
import PropTypes from 'prop-types';


import { config, dataStoreQuery,
    SideNavigationQuery, FormComponentQuery, TemplateQuery, ConditionQuery, LabelQuery, HTMLCodeQuery} from '../consts'

    import { 
        Modal, 
        ModalTitle, 
        ModalContent, 
        ModalActions, 
        ButtonStrip, 
        Button
    } from '@dhis2/ui';



const CleaningServices = (props) => {
    const { show } = useAlert(
        ({ msg }) => msg,
        ({ type }) => ({ [type]: true })
      )


    let projectIds = [];
    let filteredSideNavigations = [];
    let filteredFormComponents = [];
    let  filteredTemaplates = [];
    let filteredConditions = [];
    let filteredLabels = []
    let filteredHtmlCodes = [];

    const { data: ProjectQueryData, refetch:ProjectQueryDataRefetch} = useDataQuery(dataStoreQuery); // Use separate hook for dataStoreQuery
    const { data: SideNavigationQueryData, refetch:SideNavigationQueryDataRefetch} = useDataQuery(SideNavigationQuery); // Use separate hook for dataStoreQuery
    const { data: FormComponentQueryData, refetch:FormComponentQueryDataRefetch } = useDataQuery(FormComponentQuery); // Use separate hook for dataStoreQuery
    const { data: TemaplateQueryData, refetch:TemaplateQueryDataRefetch} = useDataQuery(TemplateQuery); // Use separate hook for dataStoreQuery
    const { data: ConditionsQueryData, refetch:ConditionsQueryDataRefetch} = useDataQuery(ConditionQuery); // Use separate hook for dataStoreQuery
    const { data: LabelQueryData, refetch:LabelQueryDataRefetch} = useDataQuery(LabelQuery); // Use separate hook for dataStoreQuery
    const { data: HTMLCodeQueryData, refetch:HTMLCodeQueryDataRefetch} = useDataQuery(HTMLCodeQuery); // Use separate hook for dataStoreQuery


    useEffect(() =>{

        ProjectQueryDataRefetch()
        SideNavigationQueryDataRefetch()
        FormComponentQueryDataRefetch()
        TemaplateQueryDataRefetch()
        ConditionsQueryDataRefetch()
        LabelQueryDataRefetch()
        HTMLCodeQueryDataRefetch()

        

      },[props.cleanToggle])

    const handleCloseModal = async () =>{
        // Assuming you have an API to query and delete based on a filter
        props.setCleaner(false)


    }



    const handleDeleteUnusedProjectcomponents = async () =>{
        props.setCleanerToggle((prev) => !prev) 
        if (ProjectQueryData?.dataStore) {
            if (typeof ProjectQueryData.dataStore.entries === 'function') {
              const AllObjs = Object.entries(ProjectQueryData.dataStore);
              const Projects = transformData(AllObjs) || [];              
              projectIds = Projects.map(entry => entry.id);              
            } else {
              const Projects = ProjectQueryData?.dataStore?.entries || [];
              projectIds = Projects.map(entry => entry.id);
            }
        }
        if (SideNavigationQueryData?.dataStore) {
            if (typeof SideNavigationQueryData.dataStore.entries === 'function') {
              const AllObjs = Object.entries(SideNavigationQueryData.dataStore);
              const obj = transformData(AllObjs) || [];
              console.log(obj)
              filteredSideNavigations = obj.filter(entry => !projectIds.includes(entry.projectID));
            } else {
              const AllObjs = SideNavigationQueryData?.dataStore?.entries || [];
              filteredSideNavigations = AllObjs.filter(entry => !projectIds.includes(entry.projectID));
            }
        }

        if (FormComponentQueryData?.dataStore) {
            if (typeof FormComponentQueryData.dataStore.entries === 'function') {
              const AllObjs = Object.entries(FormComponentQueryData.dataStore);
              const obj = transformData(AllObjs) || [];
              filteredFormComponents = obj.filter(entry => !projectIds.includes(entry.projectID));
            } else {
              const AllObjs = FormComponentQueryData?.dataStore?.entries || [];
              filteredFormComponents = AllObjs.filter(entry => !projectIds.includes(entry.projectID));
            }
        }

        
        if (TemaplateQueryData?.dataStore) {
            if (typeof TemaplateQueryData.dataStore.entries === 'function') {
              const AllObjs = Object.entries(TemaplateQueryData.dataStore);
              const obj = transformData(AllObjs) || [];
              filteredTemaplates = obj.filter(entry => !projectIds.includes(entry.projectID));
            } else {
              const AllObjs = TemaplateQueryData?.dataStore?.entries || [];
              filteredTemaplates = AllObjs.filter(entry => !projectIds.includes(entry.projectID));
            }
        }

        if (ConditionsQueryData?.dataStore) {
            if (typeof ConditionsQueryData.dataStore.entries === 'function') {
              const AllObjs = Object.entries(ConditionsQueryData.dataStore);
              const obj = transformData(AllObjs) || [];
              filteredConditions = obj.filter(entry => !projectIds.includes(entry.projectID));
            } else {
              const AllObjs = ConditionsQueryData?.dataStore?.entries || [];
              filteredConditions = AllObjs.filter(entry => !projectIds.includes(entry.projectID));
            }
        }

        if (LabelQueryData?.dataStore) {
            if (typeof LabelQueryData.dataStore.entries === 'function') {
              const AllObjs = Object.entries(LabelQueryData.dataStore);
              const obj = transformData(AllObjs) || [];
              filteredLabels = obj.filter(entry => !projectIds.includes(entry.projectID));
            } else {
              const AllObjs = LabelQueryData?.dataStore?.entries || [];
              filteredLabels = AllObjs.filter(entry => !projectIds.includes(entry.projectID));
            }
        }

        if (HTMLCodeQueryData?.dataStore) {
            if (typeof HTMLCodeQueryData.dataStore.entries === 'function') {
              const AllObjs = Object.entries(HTMLCodeQueryData.dataStore);
              const obj = transformData(AllObjs) || [];
              filteredHtmlCodes = obj.filter(entry => !projectIds.includes(entry.projectID));
            } else {
              const AllObjs = HTMLCodeQueryData?.dataStore?.entries || [];
              filteredHtmlCodes = AllObjs.filter(entry => !projectIds.includes(entry.projectID));
            }
        }
        if (filteredHtmlCodes.length > 0){
            filteredHtmlCodes.forEach(HtmlCodes => {

                deleteObjects(props.engine, config.dataStoreHTMLCodes, HtmlCodes.key, 'HtmlCodes')
            });  
        }



        if (filteredSideNavigations.length > 0){
            filteredSideNavigations.forEach(SideNavigations => {

                deleteObjects(props.engine, config.dataStoreSideNavigations, SideNavigations.key, 'Side Navigation')
            });  
        }

        if (filteredFormComponents.length > 0){
            filteredFormComponents.forEach(form => {
                deleteObjects(props.engine, config.dataStoreFormComponents, form.key, 'Form Component')
            });   

        }

        if (filteredTemaplates.length > 0){    
            filteredTemaplates.forEach(template => {
                deleteObjects(props.engine, config.dataStoreTemplates, template.key, 'Template')
            });             

        }

        if (filteredConditions.length > 0){     
            filteredConditions.forEach(condition => {
                deleteObjects(props.engine, config.dataStoreConditions, condition.key, 'Condition')
            });          

        }
        if (filteredLabels.length > 0){ 
            
            filteredLabels.forEach(label => {
                deleteObjects(props.engine, config.dataStoreLabelName, label.key, 'Label')
            });

        }
        handleCloseModal()
        show({ msg: 'Cleaning Successfully Completed:', type: 'success' })

    }


    return (
        <Modal>
        <ModalTitle>Maintenance Comfirmation</ModalTitle>
        <ModalContent>
          <div>Proceed to maintenance task. All isolated items will be removed permanently. This procedure is safe</div>
        </ModalContent>
        <ModalActions>
          <ButtonStrip>
            <Button onClick={handleCloseModal}>Cancel</Button>
            {/* Add save changes logic here */}
            <Button destructive onClick={() =>
                  handleDeleteUnusedProjectcomponents()
                }
                >Clean
            </Button>
          </ButtonStrip>
        </ModalActions>
      </Modal>
    );

}
// Define PropTypes for your component
CleaningServices.propTypes = {
    engine: PropTypes.object.isRequired,
    setCleaner: PropTypes.func.isRequired,
    setCleanerToggle: PropTypes.func.isRequired,
    cleanToggle: PropTypes.bool.isRequired,
};

export default CleaningServices;