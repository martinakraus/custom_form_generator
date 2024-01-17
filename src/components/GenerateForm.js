import {useDataQuery} from '@dhis2/app-runtime';
import {Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle} from '@dhis2/ui';
import React, {useEffect, useState} from 'react';

const isEqual = (a, b) => JSON.stringify(a.sort()) === JSON.stringify(b.sort());

const GenerateForm = (props) => {
    /**generate Template */
    const query = {
        categoryOptionCombos: {
            resource: 'dataElements',
            params: ({dataElements}) => ({
                fields: ['valueType,categoryCombo[categoryOptionCombos[id,categoryOptions[id]]]'],
                filter: `id:in:${dataElements}`,
            }),
        },
    }

    const [categoryOptionCombos, setCategoryOptionCombos] = useState([]);

    const {data} = useDataQuery(query, {variables: {dataElements: props.dataElements.map(de => de.id)}});

    useEffect(() => {
        if (data && data.dataElements) {
            const {categoryOptionCombos} = data.dataElements.categoryCombo.categoryOptionCombos;
            setCategoryOptionCombos(categoryOptionCombos);
        }
    }, [data]);
    const handleGenerateHTMLTemplate = () => {
        // Your HTML content

        console.log('********** dictfileredHorizontalCatCombo0 **************')
        console.log(props.dictfileredHorizontalCatCombo0)

        console.log('********** dictfileredHorizontalCatComboLevel1 **************')
        console.log(props.dictfileredHorizontalCatComboLevel1)

        console.log('********** dictfileredVerticalCatComboLevel1 **************')
        console.log(props.dictfileredVerticalCatComboLevel1)

        console.log('********** dictfileredVerticalCatComboLevel2 **************')
        console.log(props.dictfileredVerticalCatComboLevel2)

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
        let levels = 2;
        //Setup dataElements: Missing in props
        for (let i = 0; i < props.dataElements; i++) {
            template += `<tr><td colspan="3">${props.dataElements[i].name}</td>`
            for (let l = 0; i < props.dictfileredHorizontalCatCombo0.length; i++) {
                for (let j = 0; j < props.dictfileredHorizontalCatComboLevel1.length; j++) {
                    let coc = categoryOptionCombos.map(c => categoryOptions).find(c => {
                        return c.length = levels && isEqual(c, [props.dictfileredHorizontalCatCombo0[l].id, props.dictfileredHorizontalCatComboLevel1[j]])
                    })?.id;
                    template += `<td align="center"><input id="${props.dataElements[i].id}-${coc}-val" name="entryfield" style="width:5em;text-align:center;//" title="${props.dataElements[j].name}" value="[ ${props.dataElements[j].name} ]"></td>`
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