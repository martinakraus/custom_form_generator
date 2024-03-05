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
    console.log('Cleaning Services',props.projectID)
    const SideNavigationQuery = {
        dataStore: {
        resource: `dataStore/${config.dataStoreSideNavigations}?${sideNavigationFilter}&filter=projectID:eq:${props.projectID}`,
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

    const { data: SideNavigationQueryData, refetch:SideNavigationQueryDataRefetch} = useDataQuery(SideNavigationQuery); // Use separate hook for dataStoreQuery
    const { data: FormComponentQueryData, refetch:FormComponentQueryDataRefetch } = useDataQuery(FormComponentQuery); // Use separate hook for dataStoreQuery
    const { data: TemaplateQueryData, refetch:TemaplateQueryDataRefetch} = useDataQuery(TemplateQuery); // Use separate hook for dataStoreQuery
    const { data: ConditionsQueryData, refetch:ConditionsQueryDataRefetch} = useDataQuery(ConditionQuery); // Use separate hook for dataStoreQuery
    const { data: LabelQueryData, refetch:LabelQueryDataRefetch} = useDataQuery(LabelQuery); // Use separate hook for dataStoreQuery


    useEffect(() =>{

        console.log('SideNavigationQueryData: ',SideNavigationQueryData)
        if (SideNavigationQueryData){
            const newExclusion = SideNavigationQueryData.dataStore?.entries.filter(entry => entry.projectID === loadedProject.id) || [];
            console.log('SideNavigationQueryData: ',newExclusion)
        }
        if (FormComponentQueryData){
            const newExclusion = FormComponentQueryData.dataStore?.entries.filter(entry => entry.projectID === loadedProject.id) || [];
            console.log('FormComponentQueryData: ',newExclusion)
            
        }
        if (TemaplateQueryData){
            const newExclusion = TemaplateQueryData.dataStore?.entries.filter(entry => entry.projectID === loadedProject.id) || [];
            console.log('TemaplateQueryData: ',newExclusion)
        }
        if (ConditionsQueryData){
            const newExclusion = ConditionsQueryData.dataStore?.entries.filter(entry => entry.projectID === loadedProject.id) || [];
            console.log('ConditionsQueryData: ',newExclusion)
        }
        if (LabelQueryData){
            const newExclusion = LabelQueryData.dataStore?.entries.filter(entry => entry.projectID === loadedProject.id) || [];
            console.log('LabelQueryData: ',newExclusion)
        }

   
    
      },[props.projectID])


    return (
    <div>




    </div>
    );

}

export default CleaningServices;