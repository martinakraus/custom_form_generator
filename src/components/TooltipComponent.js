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
            customIcon=false
        }
    ) => {


    return (
        <Button
            destructive={buttonMode === 'destructive'}
            primary={buttonMode === 'primary'}
            secondary={buttonMode === 'secondary'}
            onClick={() => btnFunc(project)}
            className={`${classes.buttonRight} 
                        ${classes.iconButton} 
                        ${classes.tooltipbutton}`}
            style={{ display: 'flex', alignItems: 'center' }} // Aligns content vertically in the middle

            
        >    <div>
            {/* Conditionally render based on customIcon */}
            <Tooltip content={dynamicText}>
            {customIcon ? (
                customImage(dynamicText)
            ) : (
               
                    <IconType className={classes.icon} />
               
            )}
            </Tooltip>
            </div>
        </Button>
        
    );

};

TooltipComponent.propTypes = {
    IconType: PropTypes.elementType.isRequired, 
    btnFunc: PropTypes.func.isRequired,
    project: PropTypes.any.isRequired, 
    dynamicText: PropTypes.string.isRequired,
    buttonMode: PropTypes.string.isRequired
};

export default TooltipComponent;