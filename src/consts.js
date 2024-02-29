export const config = {
    dataStoreName: 'custom-form-generator',
    dataStoreTemplates:'custom-form-generator-templates',
    dataStoreSideNavigations:'custom-form-generator-side-navigations',
    dataStoreFormComponents:'custom-form-generator-form-components',
    dataStoreConditions:'custom-form-generator-conditions',
    dataStoreLabelName:'custom-form-generator-labelName'
}
export const ProjectsFilters = 'fields=id,projectName';
export const ProjectsFiltersMore = 'fields=id,projectName,dataSet,modifiedDate,dataElements,catCombos'; // included dataElements
export const sideNavigationFilter = 'fields=sideNavName,projectID';
export const formComponentFilter = 'fields=formComponentName,projectID,';
export const TemplateFilter = 'fields=key,name,projectID,catCombo';
export const TemplateNoFilter = 'fields=key,name,projectID,sideNavigation,formComponent,catCombo,HorizontalLevel0,HorizontalLevel1,verticalLevel1,verticalLevel2';
export const exclusionRuleFilter = 'fields=id,key,name,projectID,condition,conditionLevel,exclusion,exclusionLevel,metadata,categoryExclusion,associatedExclusionDataElement';
export const labelNameFilter = 'fields=id,key,name,projectID,labelName,metadataType,LabelLevel';

// Array of condition levels
export   const conditionLevels = ["Horizontal Level 1", "Horizontal Level 2", "Vertical Level 1", "Vertical Level 2", "Vertical Level 3"];

// Array of Exclusion levels
export    const exclusionLevels = ["Horizontal Level 2", "Vertical Level 1", "Vertical Level 2", "Vertical Level 3"];


