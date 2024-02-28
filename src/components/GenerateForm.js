import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button } from '@dhis2/ui';




const GenerateForm = (props) => {
    /**generate Template */
    const handleGenerateHTMLTemplate = () => {
        // Your HTML content

        console.log('********** DataSet Object **************')
        console.log(props.loadedProject)
        console.log(props.loadedRules)
        console.log(props.loadedLabels)

        const htmlContent = '<html><head><title>Hello World</title></head><body><h1>Hello World!</h1></body></html>';

        // Create a Blob containing the HTML content
        const blob = new Blob([htmlContent], { type: 'text/html' });

        // Create a download link
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);

        // Set the download attribute with the desired file name
        link.download = 'hello_world_template.html';

        // Append the link to the document
        document.body.appendChild(link);

        // Trigger a click on the link to start the download
        link.click();

        // Remove the link from the document
        document.body.removeChild(link);
        handleCloseModal();
    };
    
    const handleCloseModal = () => {
        props.setShowGenerateForm(false)      

    };

    return (
        <Modal>
        <ModalTitle>
          Generate Form
  
          </ModalTitle>
            <ModalContent>
                <p>This might take some time. Please do not navigate away from the page after clicking to proceed</p>

        </ModalContent>
          <ModalActions>
            <ButtonStrip>
              <Button onClick={() => handleCloseModal()}>Close</Button>
              <Button onClick={handleGenerateHTMLTemplate}>Proceed</Button>

            </ButtonStrip>
          </ModalActions>
    </Modal>
    );
}


export default GenerateForm;