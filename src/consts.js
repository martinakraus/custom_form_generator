export const config = {
    dataStoreName: 'custom-form-generator',
    dataStoreTemplates:'custom-form-generator-templates',
    dataStoreSideNavigations:'custom-form-generator-side-navigations',
    dataStoreFormComponents:'custom-form-generator-form-components'
}

export const ProjectsFilters = 'fields=id,projectName';
export const ProjectsFiltersMore = 'fields=id,projectName,dataSet,modifiedDate,dataElements'; // included dataElements

export const sideNavigationFilter = 'fields=sideNavName,projectID';

export const formComponentFilter = 'fields=formComponentName,projectID';