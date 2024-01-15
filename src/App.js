import {useState } from 'react';
import React from 'react'
import classes from './App.module.css'
import { Divider } from '@dhis2-ui/divider'
import { useDataEngine } from '@dhis2/app-runtime';
import CreateProject from './components/CreateProject'
import LoadProjects from './components/LoadProjects'
import { generateRandomId } from './utils';

import { DataTable, DataTableRow , DataTableColumnHeader, DataTableCell, TableHead, TableBody   } from '@dhis2-ui/table'

import {
    Box
} from '@dhis2/ui'


/** header constant ***/
const header = (
    <div className={classes.headerContainer}>
        <h1>Custom Form Generator</h1>

    </div>

    );
const MyApp = () => {

    const engine = useDataEngine();
    {/* declare variable and event methods */}

    const [isLoadProject, setLoadProject] = useState(false);
    const [isCreateroject, setCreateProject] = useState(false);
    const [showModalCreateProject, setShowModalCreateProject] = useState(false);
    const [showModalLoadProjects, setShowModalLoadProjects] = useState(false);
    // reloading and state does not matter
    const [reloadProjects, setReloadProjects] = useState(false);

    

    return (

        <div className={classes.pageDiv}>
                {/* Header */}
                { header }
            <p>
                This application is used to create custom dhis2 forms automatically to align DATIM design pattern
            </p>

        
            {/* Divider */}
            <div className={classes.mainSection}>
                <div className={classes.fullpanel}>
                    <Divider />
                </div>
            </div>
            {/* * load or create new project* */}

            <div className={classes.mainSection}>
                <div className={classes.baseMargin}>
                    <div className={classes.flexContainer}>
                        <Box height="100px" width="100px" className={`${classes.cardbox}`}

                        >
                                <div className={classes.cardContent}                                        
                                        onClick={() => {
                                            setShowModalLoadProjects(true);
                                            setReloadProjects((prev) => !prev);                                            
                                            console.log('Log button Clicked')
                                        }}
                                        
                                        >
                                    All Projects
                                </div>
                        </Box>
                    <div className={classes.spaceInBetween}></div>
                        <Box height="100px" width="100px" className={classes.cardbox} >
                            <div className={classes.cardContent} onClick={() => setShowModalCreateProject(true)}>Create Project</div>
                        </Box>
                    </div>
                </div>
            </div>

            {/* Modal for loading projects */}
            {showModalLoadProjects && 
                (<LoadProjects 
                    engine={engine} 
                    setShowModalLoadProjects={setShowModalLoadProjects} 
                    showModalLoadProjects={showModalLoadProjects}
                    reloadProjects={reloadProjects}
                    setReloadProjects={setReloadProjects}/>                    
            )}

            {/* Modal for creating a new project */}
            {showModalCreateProject && 
                (<CreateProject 
                    engine={engine} 
                    setShowModalCreateProject={setShowModalCreateProject} 
                    setShowModalLoadProjects={setShowModalLoadProjects}
                    setReloadProjects={setReloadProjects} 
                    />                    
            )}
    </div>
    )
}

export default MyApp