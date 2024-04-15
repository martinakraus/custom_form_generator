import {useState } from 'react';
import React from 'react'
import classes from './App.module.css'
import { Divider } from '@dhis2-ui/divider'
import { useDataEngine } from '@dhis2/app-runtime';
import CreateProject from './components/CreateProject'
import LoadProjects from './components/LoadProjects'
import { footerText, MainTitle, project_description } from './consts';
import {customImage} from './utils'
import readme from './README.md'



const MyApp = () => {

    const engine = useDataEngine();
    {/* declare variable and event methods */}

    const [showModalCreateProject, setShowModalCreateProject] = useState(false);
    const [showModalLoadProjects, setShowModalLoadProjects] = useState(false);
    const [fileContent, setFileContent] = useState('');
    // reloading and state does not matter
    const [reloadProjects, setReloadProjects] = useState(false);

    const openReadme = () => {
        // Replace 'path_to_your_readme' with the actual path to your README file
        window.open(readme, '_blank');
      };




    return (

        <div className={classes.pageDiv}>
                {/* Header */}
                <h1 style={{ margin: '0' }}>{MainTitle}</h1>


                <span style={{ margin: '0', fontSize: '0.7rem' }}>
                    {project_description}
                </span>


            {/* Divider */}
            <div className={classes.mainSection} style={{ textAlign: 'right' }}>
                <div className={classes.fullpanel}>
                    <Divider />
                </div>
            </div>
            {/* * load or create new project* */}

            {/* <div className={classes.mainSection}>
                <div className={classes.baseMargin}>
                    <div className={classes.flexContainer}>
                        <Box height="100px" width="100px" className={`${classes.cardbox}`}

                        >
                                <div className={classes.cardContent}                                        
                                        onClick={() => {
                                            setShowModalLoadProjects(true);
                                            setReloadProjects((prev) => !prev);                                            

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
            </div> */}

            {/* Modal for loading projects */}
            {/* {showModalLoadProjects && ( 
            <LoadProjects 
                    engine={engine} 
                    reloadProjects={reloadProjects}
                    setReloadProjects={setReloadProjects}/>    )} */}
                <LoadProjects 
                    engine={engine} 
                    reloadProjects={reloadProjects}
                    setReloadProjects={setReloadProjects}/>                    
         

            {/* Modal for creating a new project */}
            {showModalCreateProject && 
                (<CreateProject 
                    engine={engine} 
                    setShowModalCreateProject={setShowModalCreateProject} 
                    setShowModalLoadProjects={setShowModalLoadProjects}
                    setReloadProjects={setReloadProjects} 
                    />                    
            )}


<footer className={classes.footer}>
      <p style={{ fontSize: '0.7rem', margin: '0 auto' }}>{footerText}</p>
      <span 
        onClick={openReadme} 
        style={{    
                    fontSize: '0.7rem', 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    alignItems: 'center', 
                    cursor: 'pointer' 
                }}>
        {customImage('guide_icon', 'small')} Developer - README.md
      </span>    
    </footer>
    </div>
    )
}

export default MyApp