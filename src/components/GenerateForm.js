import { useDataQuery } from '@dhis2/app-runtime'
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button } from '@dhis2/ui';
import PostForm from './PostForm'

import { useEffect, useState } from 'react';



const dataSets = {
  targetedEntity: {
    resource: 'dataSets',
    params: ({dataSet})=>({
      fields: 'id,name,dataEntryForm(id)',
      filter: `id:eq:${dataSet}`,
    }),

  },
}



const GenerateForm = (props) => {

  const [dataEntryFormObj, setDataEntryFormObj] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [activatePost, setActivatePost] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [count, setCount] = useState(0);




  const {loading: loadingDataSets, error: errorDataSets, data: dataDataSets, refetch: refetchDataSets } = useDataQuery(dataSets, {variables: {dataSet: props.loadedProject.dataSet.id}})


  useEffect(() => {


        if(dataDataSets){
            const FormObj = dataDataSets?.targetedEntity?.dataSets[0]?.dataEntryForm || [];
            console.log('dataDataSets: ', dataDataSets)
            const dataFormID = FormObj?.id || ''
            setDataEntryFormObj(dataFormID)
            refetchDataSets({dataSet: props.loadedProject.dataSet.id})
            // console.log('dataSet: ', props.loadedProject.dataSet.id)
            // console.log('dataEntryFormObj : ',dataEntryFormObj)
          }       
  }, [props.loadedProject.dataSet.id, dataDataSets, activatePost]);

  useEffect(() => {


  },[dataDataSets, ])

  useEffect(() => {
    let openPost = true
    setShowPostForm(openPost)

  },[htmlContent, activatePost])

 
    /**generate Template */
    const handleGenerateHTMLTemplate = async () => {

          // Increment count and generate template
      const newCount = count + 20;
      setCount(newCount);
      const template = `<h1>Hello World ${newCount}!</h1>`;

      setHtmlContent(template)

      console.log('********** DataSet Object **************')
      console.log(props.loadedProject)
      console.log(props.loadedRules)
      console.log(props.loadedLabels)
      setActivatePost((prev) => !prev)

      // handleCloseModal();

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
              {props.showGenerateForm && (<Button onClick={handleGenerateHTMLTemplate}>Proceed</Button>)}
              <h1>'Clicked ' {count}  ' times'</h1>
            </ButtonStrip>
          </ModalActions>
         {showPostForm && (dataEntryFormObj.length > 0) && (<PostForm htmlContent={htmlContent} dataEntryFormObjID={dataEntryFormObj} setShowPostForm={setShowPostForm} handleCloseModal={handleCloseModal}/>)}
    </Modal>
    );
}


export default GenerateForm;