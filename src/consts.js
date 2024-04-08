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
      resource: `dataStore/${config.dataStoreHTMLCodes}?${HTMLCodesFilter}`,
      },
  }

export const SideNavigationQuery = {
    dataStore: {
    resource: `dataStore/${config.dataStoreSideNavigations}?${sideNavigationFilter}`,
    },
  }
  
  // Define your data store query
  export const FormComponentQuery = {
    dataStore: {
    resource: `dataStore/${config.dataStoreFormComponents}?${formComponentFilter}`,
    },
  }
  
  // Define your data store query
  export const TemplateQuery = {
    dataStore: {
    resource: `dataStore/${config.dataStoreTemplates}?${TemplateFilter}`,
    },
  }

    // Define your data store query
    export const TemplateQueryMore = {
        dataStore: {
        resource: `dataStore/${config.dataStoreTemplates}?${TemplateNoFilter}`,
        },
      }
  
  // Define your data store query
  export const ConditionQuery = {
    dataStore: {
    resource: `dataStore/${config.dataStoreConditions}?${exclusionRuleFilter}`,
    },
  }

    // Define your data store query
    export const ConditionQueryMore = {
        dataStore: {
        resource: `dataStore/${config.dataStoreConditions}?${exclusionRuleMore}`,
        },
      }
  
  
  export const LabelQuery = {
    dataStore: {
        resource: `dataStore/${config.dataStoreLabelName}?${labelNameFilter}`,
        },
  
  }
  
    // Define your data store query
  export const dataStoreQuery = {
    dataStore: {
    resource: `dataStore/${config.dataStoreName}?${ProjectsFilters}`,
    },
  }


    // Define your data store query
   export const dataStoreQueryMore = {
        dataStore: {
          resource: `dataStore/${config.dataStoreName}?${ProjectsFiltersMore}`,
        },
    }
  
    export const MainTitle = 'Form Forge'
    const version = 'version v1.0.0 production 12-04-2024'
    export const footerText = `Copyright © FHI360 | EpiC | Business Solutions | 2024 | ${version}`
    export const project_description = 'This application is used to create custom DHIS2 DataEntry forms automatically to align DATIM design pattern' 