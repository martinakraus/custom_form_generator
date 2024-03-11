export const config = {
    dataStoreName: 'custom-form-generator',
    dataStoreTemplates:'custom-templates-form-generator',
    dataStoreSideNavigations:'custom-navigations-form-generator',
    dataStoreFormComponents:'custom-components-form-generator',
    dataStoreConditions:'custom-conditions-form-generator',
    dataStoreLabelName:'custom-labelName-form-generator'
}
export const ProjectsFilters = 'fields=id,projectName';
export const ProjectsFiltersMore = 'fields=id,projectName,dataSet,modifiedDate,dataElements,catCombos'; // included dataElements
export const sideNavigationFilter = 'fields=sideNavName,projectID';
export const formComponentFilter = 'fields=formComponentName,projectID,';
export const TemplateFilter = 'fields=key,name,projectID,catCombo';
export const TemplateNoFilter = 'fields=key,name,overidingCategory,projectID,sideNavigation,formComponent,catCombo,HorizontalLevel0,HorizontalLevel1,verticalLevel1,verticalLevel2';
export const exclusionRuleFilter = 'fields=id,key,name,projectID,metadata,conditionCoC';
export const exclusionRuleMore = 'fields=id,key,name,projectID,metadata,conditionCoC,conditionDE,conditionCategoryOption,conditionCategoryOption2,categoryExclusionToProcess,categoryExclusionOptionToProcess,category,category2';

export const labelNameFilter = 'fields=id,key,name,projectID,labelName,metadataType,labelDEIDName,labelCategoryIDName,labelComboIDName,labelOptionIDName';

// Array of condition levels
export   const conditionLevels = ["Horizontal Level 1", "Horizontal Level 2", "Vertical Level 1", "Vertical Level 2", "Vertical Level 3"];

// Array of Exclusion levels
export    const exclusionLevels = ["Horizontal Level 2", "Vertical Level 1", "Vertical Level 2", "Vertical Level 3"];

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
  