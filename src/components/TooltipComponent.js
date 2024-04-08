import { Button } from '@dhis2/ui';
import classes from '../App.module.css'
import { Tooltip } from '@dhis2-ui/tooltip'
import {customImage} from '../utils'
import PropTypes from 'prop-types';

const TooltipComponent = (
        { 
            IconType=IconType, 
            btnFunc, 
            project, 
            dynamicText,  
            buttonMode, 
            customIcon=false,
            disabled
        }
    ) => {

    return (
        // <Button
        //     destructive={buttonMode === 'destructive'}
        //     primary={buttonMode === 'primary'}
        //     secondary={buttonMode === 'secondary'}
        //     onClick={() => btnFunc(project)}
        //     disabled={disabled}
        //     className={`${classes.buttonRight} 
        //                 ${classes.iconButton} 
        //                 ${classes.tooltipbutton}`}
        //     style={{ display: 'flex', alignItems: 'center',         
        //     padding: '3px 7px', // Adjust padding as needed
        //     fontSize: '0.8rem' // Adjust font size as needed
        // }}

            
        // >    <div>
        //     {/* Conditionally render based on customIcon */}
        //     <Tooltip content={dynamicText}>
        //     {customIcon ? (
        //         customImage(dynamicText, 'small')
        //     ) : (
               
        //             <IconType className={classes.icon} />
               
        //     )}
        //     </Tooltip>
        //     </div>
        // </Button>



            <div    
            onClick={() => btnFunc(project)} 		
            className={
                            `${classes.buttonRight} 
                                ${classes.iconButton} 
                                ${classes.tooltipbutton}
                                `
                            }
                            
                    disabled={disabled}           
                    style={{ display: 'flex', alignItems: 'center', padding: '0', margin: '0'}}>
                        {/* Conditionally render based on customIcon */}
                        <Tooltip content={dynamicText}>
                        {customIcon ? (
                            customImage(dynamicText, 'small')
                        ) : (
                        
                                <IconType className={classes.icon} />
                        
                        )}
                        </Tooltip>
            </div>
        
    );

};

TooltipComponent.propTypes = {
    IconType: PropTypes.elementType.isRequired, 
    btnFunc: PropTypes.func.isRequired,
    project: PropTypes.any.isRequired, 
    dynamicText: PropTypes.string.isRequired,
    buttonMode: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    customIcon: PropTypes.bool

};

export default TooltipComponent;