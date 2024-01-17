import {useDataQuery} from '@dhis2/app-runtime';
import {Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle} from '@dhis2/ui';
import React, {useEffect, useState} from 'react';

const isEqual = (a, b) => JSON.stringify(a.sort()) === JSON.stringify(b.sort());

const GenerateForm = (props) => {
    /**generate Template */
    const query = {
        dataElements: {
            resource: 'dataElements',
            params: ({dataElements}) => ({
                fields: ['valueType,categoryCombo[categoryOptionCombos[id,name,categoryOptions[id,name]]]'],
                filter: `id:in:[${dataElements}]`,
                paging: false
            }),
        },
    }

    const [categoryOptionCombos, setCategoryOptionCombos] = useState([]);

    const {data} = useDataQuery(query, {variables: {dataElements: props.selectedDataElement.map(de => de.id).join(',')}});

    useEffect(() => {
        if (data && data.dataElements) {
            const categoryOptionCombos = data.dataElements.dataElements.map(de => de.categoryCombo);
            setCategoryOptionCombos(categoryOptionCombos[0].categoryOptionCombos);
        }
    }, [data]);
    const handleGenerateHTMLTemplate = () => {

        let template = '<table border="0" cellpadding="0" cellspacing="0" style="width: 100%"><tbody>';
        let headers = 1;
        const l1 = props.dictfileredHorizontalCatCombo0.length;
        let l2 = 1;
        if (props.dictfileredHorizontalCatCombo0 && props.dictfileredHorizontalCatComboLevel1) {
            headers = 2;
            l2 = props.dictfileredHorizontalCatComboLevel1.length;
        }
        const totalCells = l2 * l1;
        template += `<tr><th colspan="3">Indicators</th>`
        //Set up headers
        for (let i = 0; i < props.dictfileredHorizontalCatCombo0.length; i++) {
            template += `<th  colspan="${totalCells / l1}">${props.dictfileredHorizontalCatCombo0[i].name}</th>`
        }
        template += `</tr>`
        if (props.dictfileredHorizontalCatComboLevel1) {
            template += `<tr>`
            for (let i = 0; i < props.dictfileredHorizontalCatCombo0.length; i++) {
                for (let j = 0; j < props.dictfileredHorizontalCatComboLevel1.length; j++) {
                    template += `<th>${props.dictfileredHorizontalCatComboLevel1[j].name}</th>`
                }
            }
            template += `</tr>`
        }
        //Levels should be dynamic based on the number of options in a given categoryOptionCombo
        let levels = 3;
        //Setup dataElements: Missing in props
        //console.log('2 Level combos', categoryOptionCombos.filter(c=>c.categoryOptions.length === 3))

        for (let i = 0; i < props.selectedDataElement.length; i++) {
            template += `<tr><td colspan="3">${props.selectedDataElement[i].name}</td>`
           for (let j = 0; j < props.dictfileredHorizontalCatCombo0.length; j++) {
                for (let k = 0; k < props.dictfileredHorizontalCatComboLevel1.length; k++) {
                    let coc = categoryOptionCombos.find(c => {
                        console.log(c.categoryOptions.length, props.dictfileredHorizontalCatCombo0[j].id, props.dictfileredHorizontalCatComboLevel1[k].id)
                        return c.categoryOptions.length === levels && isEqual(c.categoryOptions, [props.dictfileredHorizontalCatCombo0[j].id, props.dictfileredHorizontalCatComboLevel1[k].id])
                    })?.id;
                    template += `<td align="center"><input id="${props.selectedDataElement[i].id}-${coc?.id}-val" name="entryfield" style="width:5em;text-align:center;//" title="${coc.name}" value="[ ${coc.name} ]"></td>`
                }
            }
            template += '</tr>'
        }
        template += '</tbody></table>'


        // Create a Blob containing the HTML content
        const blob = new Blob([template], {type: 'text/html'});

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