import { useDataMutation, useAlert } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'; // Import PropTypes
import { useEffect } from 'react';
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button } from '@dhis2/ui';


const PostForm = (props) => {

    // console.log('**********************************')
    // console.log('htmlContent:  ',props.htmlContent)
    // console.log('dataEntryFormObjID: ',props.dataEntryFormObjID)
    // console.log('**********************************')

    const { show } = useAlert(
        ({ msg }) => msg,
        ({ type }) => ({ [type]: true })
      )

    const successMessage = () => {

        show({ msg: `DataEntryForm successfully posted`, type: 'success' })
        console.log('Successfully Posted')
        props.handleCloseModal()
    }

    const errorMessage = (error) => {

        show({ msg: `An error occurred`, type: 'critical' })
        console.error(error)
        props.handleCloseModal()
    }

   
    const updateDataEntryForm = {
        type: 'update',
        partial: true,
        resource: 'dataEntryForms',
        id: props.dataEntryFormObjID,
        data: {
        htmlCode: props.htmlContent,
        },
    }


    const [mutateDataEntryForm] = useDataMutation(updateDataEntryForm)

    const handlePostHTMLTemplate = async () => {

        props.setShowPostForm(false)
        if (props.dataEntryFormObjID.length > 0 && props.dataEntryFormObjID !== '' && props.htmlContent.length > 0){

            try {
                mutateDataEntryForm();
                successMessage()
              } catch (error) {
                errorMessage(error)

              }          
        }
      };

    useEffect(() => {
        handlePostHTMLTemplate()

      },[props.dataEntryFormObjID, props.htmlContent])

    return (

        <></>
    );
}

PostForm.propTypes = {
    dataEntryFormObjID: PropTypes.string.isRequired,
    htmlContent: PropTypes.string.isRequired,
    handleCloseModal: PropTypes.func.isRequired,
    setShowPostForm: PropTypes.func.isRequired
};

export default PostForm;