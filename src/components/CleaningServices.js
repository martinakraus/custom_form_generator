import { useDataQuery, useAlert } from '@dhis2/app-runtime'
import React, { useEffect } from 'react';
import {deleteObjects, } from '../utils'
import PropTypes from 'prop-types';

import { config, dataStoreQuery,
    SideNavigationQuery, FormComponentQuery, TemplateQuery, ConditionQuery, LabelQuery} from '../consts'

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




    const { data: ProjectQueryData, refetch:ProjectQueryDataRefetch} = useDataQuery(dataStoreQuery); // Use separate hook for dataStoreQuery
    const { data: SideNavigationQueryData, refetch:SideNavigationQueryDataRefetch} = useDataQuery(SideNavigationQuery); // Use separate hook for dataStoreQuery
    const { data: FormComponentQueryData, refetch:FormComponentQueryDataRefetch } = useDataQuery(FormComponentQuery); // Use separate hook for dataStoreQuery
    const { data: TemaplateQueryData, refetch:TemaplateQueryDataRefetch} = useDataQuery(TemplateQuery); // Use separate hook for dataStoreQuery
    const { data: ConditionsQueryData, refetch:ConditionsQueryDataRefetch} = useDataQuery(ConditionQuery); // Use separate hook for dataStoreQuery
    const { data: LabelQueryData, refetch:LabelQueryDataRefetch} = useDataQuery(LabelQuery); // Use separate hook for dataStoreQuery


    useEffect(() =>{

        ProjectQueryDataRefetch()
        SideNavigationQueryDataRefetch()
        FormComponentQueryDataRefetch()
        TemaplateQueryDataRefetch()
        ConditionsQueryDataRefetch()
        LabelQueryDataRefetch()



      },[props.cleanToggle])

    const handleCloseModal = async () =>{
        // Assuming you have an API to query and delete based on a filter
        props.setCleaner(false)


    }

    const handleDeleteUnusedProjectcomponents = async () =>{
        props.setCleanerToggle((prev) => !prev)
        const Projects = ProjectQueryData.dataStore?.entries || [];
        const projectIds = Projects.map(entry => entry.id);
        const SideNavigations = SideNavigationQueryData?.dataStore?.entries || [];
        
        const filteredSideNavigations = SideNavigations.filter(entry => !projectIds.includes(entry.projectID));

        const FormComponents = FormComponentQueryData?.dataStore?.entries || [];
        const filteredFormComponents = FormComponents.filter(entry => !projectIds.includes(entry.projectID));
        
        const Templates = TemaplateQueryData?.dataStore?.entries || [];
        const filteredTemaplates = Templates.filter(entry => !projectIds.includes(entry.projectID));
        
        const Conditions = ConditionsQueryData?.dataStore?.entries || [];
        const filteredConditions = Conditions.filter(entry => !projectIds.includes(entry.projectID));
        
        const Labels = LabelQueryData?.dataStore?.entries || [];
        const filteredLabels = Labels.filter(entry => !projectIds.includes(entry.projectID));


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
                primary>Clean
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