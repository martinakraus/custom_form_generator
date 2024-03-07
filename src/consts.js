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


