import { useDataQuery } from '@dhis2/app-runtime'
import React, { useState, useEffect } from 'react';

import { config, 
    sideNavigationFilter, 
    formComponentFilter, 
    TemplateFilter, 
    exclusionRuleFilter,
    labelNameFilter} from '../consts'





const CleaningServices = (props) => {
    // Define your data store query
    const [projectID, setProjectID] = useState(props.projectID);
    console.log('Cleaning Services',props.projectID)
    const SideNavigationQuery = {
        dataStore: {
        resource: `dataStore/${config.dataStoreSideNavigations}?${sideNavigationFilter}&filter=projectID:eq:TFDUHVEXT0P`,
        },
    }

    // Define your data store query
    const FormComponentQuery = {
        dataStore: {
        resource: `dataStore/${config.dataStoreFormComponents}?${formComponentFilter}&filter=projectID:eq:${props.projectID}`,
        },
    }

    // Define your data store query
    const TemplateQuery = {
        dataStore: {
        resource: `dataStore/${config.dataStoreTemplates}?${TemplateFilter}&filter=projectID:eq:${props.projectID}`,
        },
    }

    // Define your data store query
    const ConditionQuery = {
        dataStore: {
        resource: `dataStore/${config.dataStoreConditions}?${exclusionRuleFilter}&filter=projectID:eq:${props.projectID}`,
        },
    }
    

    const LabelQuery = {
        dataStore: {
            resource: `dataStore/${config.dataStoreLabelName}?${labelNameFilter}&filter=projectID:eq:${props.projectID}`,
            },

    }

    const { loading, error, data } = useDataQuery({
        dataStore: 'yourDataStoreName',
        query: {
          resources: 'yourResourceName',
          fields: 'id,projectID', // Adjust the fields you need
        },
      });

    const { data: SideNavigationQueryData, refetch:SideNavigationQueryDataRefetch} = useDataQuery(SideNavigationQuery); // Use separate hook for dataStoreQuery
    const { data: FormComponentQueryData, refetch:FormComponentQueryDataRefetch } = useDataQuery(FormComponentQuery); // Use separate hook for dataStoreQuery
    const { data: TemaplateQueryData, refetch:TemaplateQueryDataRefetch} = useDataQuery(TemplateQuery); // Use separate hook for dataStoreQuery
    const { data: ConditionsQueryData, refetch:ConditionsQueryDataRefetch} = useDataQuery(ConditionQuery); // Use separate hook for dataStoreQuery
    const { data: LabelQueryData, refetch:LabelQueryDataRefetch} = useDataQuery(LabelQuery); // Use separate hook for dataStoreQuery


    useEffect(() =>{


        SideNavigationQueryDataRefetch()
        FormComponentQueryDataRefetch()
        TemaplateQueryDataRefetch()
        ConditionsQueryDataRefetch()
        LabelQueryDataRefetch()


        console.log('SideNavigationQueryData: ',SideNavigationQueryData)
        console.log('FormComponentQueryData: ',FormComponentQueryData)
        console.log('TemaplateQueryData: ',TemaplateQueryData)
        console.log('ConditionsQueryData: ',ConditionsQueryData)
        console.log('LabelQueryData: ',LabelQueryData)

      },[props.projectID, props.cleanToggle])

    const clickCleaningAction = async () =>{
        // Assuming you have an API to query and delete based on a filter
        const entriesToDelete = await props.engine.query({
            resource: `dataStore/${config.dataStoreSideNavigations}`,
            type: 'query',
            filter: {
            fieldName: 'projectID',
            operator: 'equals',
            value:props.projectID, // Your projectID
            },
        });

        console.log(entriesToDelete)


        props.setCleanerToggle((prev) => !prev)

    }
    return (
    <div>

    <h1 onClick={clickCleaningAction}>DELETING SECTION</h1>


    </div>
    );

}

export default CleaningServices;