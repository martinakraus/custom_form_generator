export const config = {
    dataStoreName: 'custom-form-generator',
    dataStoreTemplates:'custom-templates-form-generator',
    dataStoreSideNavigations:'custom-navigations-form-generator',
    dataStoreFormComponents:'custom-components-form-generator',
    dataStoreConditions:'custom-conditions-form-generator',
    dataStoreLabelName:'custom-labelName-form-generator',
    dataStoreHTMLCodes:'custom-htmlCodes-form-generator'
}
export const ProjectsFilters = 'fields=id,projectName';
export const ProjectsFiltersMore = 'fields=id,projectName,dataSet,modifiedDate,dataElements,catCombos'; // included dataElements
export const sideNavigationFilter = 'fields=sideNavName,projectID';
export const formComponentFilter = 'fields=formComponentName,projectID,';
export const TemplateFilter = 'fields=key,name,projectID,catCombo';
export const TemplateNoFilter = 'fields=key,name,overidingCategory,projectID,sideNavigation,formComponent,catCombo,HorizontalLevel0,HorizontalLevel1,verticalLevel1,verticalLevel2';
export const exclusionRuleFilter = 'fields=id,key,name,projectID,metadata,conditionCoC';
export const exclusionRuleMore = 'fields=id,key,name,projectID,metadata,conditionCoC,conditionDE,conditionCategoryOption,conditionCategoryOption2,categoryExclusionToProcess,categoryExclusionOptionToProcess,category,category2';



export const labelNameFilter = 'fields=id,key,name,projectID,labelName,metadataType,labelDEIDName,labelCategoryIDName,labelComboIDName,labelOptionIDName,labelInclusionCategoryIDName2,labelInclusionCategoryIDName3,labelInclusionOptionIDName2,labelInclusionOptionIDName3';


export const HTMLCodesFilter = 'fields=id,key,name,projectID,htmlCode,active,modifiedDate,createdDate';

// Array of condition levels
export   const conditionLevels = ["Horizontal Level 1", "Horizontal Level 2", "Vertical Level 1", "Vertical Level 2", "Vertical Level 3"];

// Array of Exclusion levels
export    const exclusionLevels = ["Horizontal Level 2", "Vertical Level 1", "Vertical Level 2", "Vertical Level 3"];


    // Define your data store query
export const HTMLCodeQuery = {
      dataStore: {
      resource: `dataStore/${config.dataStoreHTMLCodes}?${HTMLCodesFilter}&paging=false`,
      },
  }

export const SideNavigationQuery = {
    dataStore: {
    resource: `dataStore/${config.dataStoreSideNavigations}?${sideNavigationFilter}&paging=false`,
    },
  }
  
  // Define your data store query
  export const FormComponentQuery = {
    dataStore: {
    resource: `dataStore/${config.dataStoreFormComponents}?${formComponentFilter}&paging=false`,
    },
  }
  
  // Define your data store query
  export const TemplateQuery = {
    dataStore: {
    resource: `dataStore/${config.dataStoreTemplates}?${TemplateFilter}&paging=false`,
    },
  }

    // Define your data store query
    export const TemplateQueryMore = {
        dataStore: {
        resource: `dataStore/${config.dataStoreTemplates}?${TemplateNoFilter}&paging=false`,
        },
      }
  
  // Define your data store query
  export const ConditionQuery = {
    dataStore: {
    resource: `dataStore/${config.dataStoreConditions}?${exclusionRuleFilter}&paging=false`,
    },
  }

    // Define your data store query
    export const ConditionQueryMore = {
        dataStore: {
        resource: `dataStore/${config.dataStoreConditions}?${exclusionRuleMore}&paging=false`,
        },
      }
  
  
  export const LabelQuery = {
    dataStore: {
        resource: `dataStore/${config.dataStoreLabelName}?${labelNameFilter}&paging=false`,
        },
  
  }
  
    // Define your data store query
  export const dataStoreQuery = {
    dataStore: {
    resource: `dataStore/${config.dataStoreName}?${ProjectsFilters}&paging=false`,
    },
  }


    // Define your data store query
   export const dataStoreQueryMore = {
        dataStore: {
          resource: `dataStore/${config.dataStoreName}?${ProjectsFiltersMore}&paging=false`,
        },
    }
  
    export const MainTitle = 'Form Forge'
    const version = 'Version v1.0.0 | Production 12-04-2024'
    export const footerText = `Copyright © FHI360 | EpiC | Business Solutions | 2024 | ${version}`
    export const project_description = 'This application is used to create custom DHIS2 DataEntry forms automatically to align DATIM design pattern' 