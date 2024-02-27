import { Button } from '@dhis2/ui';
import classes from '../App.module.css'
import { Tooltip } from '@dhis2-ui/tooltip'
import {customImage} from '../utils'

const TooltipComponent = ({ IconType=IconType, btnFunc, project, dynamicText,  buttonMode, customIcon=false}) => {


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

export default TooltipComponent;