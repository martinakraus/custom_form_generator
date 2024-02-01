import { Button } from '@dhis2/ui';
import classes from '../App.module.css'
import { Tooltip } from '@dhis2-ui/tooltip'

const TooltipComponent = ({ IconType, btnFunc, project, dynamicText,  buttonMode}) => {

    return (
        <Button
            destructive={buttonMode === 'destructive'}
            primary={buttonMode === 'primary'}
            secondary={buttonMode === 'secondary'}
            onClick={() => btnFunc(project)}
            className={`${classes.buttonRight} 
                        ${classes.iconButton} 
                        ${classes.tooltipbutton}`}
            
        >    <div>
                <Tooltip content={dynamicText}>
                    <IconType className={classes.icon} />
                </Tooltip>
            </div>
        </Button>
        
    );

};

export default TooltipComponent;