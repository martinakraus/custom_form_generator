import copy from './Icons/copy.png'
import delete_ from './Icons/delete_btn.png'
import edit from './Icons/edit.png'
import rename from './Icons/rename.png'
import classes from './App.module.css'
import { useDataQuery } from '@dhis2/app-runtime';

export const customImage = (source) => {
  if (source.toLowerCase()== 'copy'){
    return <img src={copy} className={classes.smallIcon}/>
  }
  if (source.toLowerCase()== 'delete'){
    return <img src={delete_} className={classes.smallIcon}/>
  }
  if (source.toLowerCase()== 'rename'){
    return <img src={rename} className={classes.smallIcon}/>
  }
  if (source.toLowerCase()== 'configure'){
    return <img src={edit} className={classes.smallIcon}/>
  }
}

export const generateRandomId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const idLength = 11;
    let randomId = '';
  
    for (let i = 0; i < idLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomId += characters.charAt(randomIndex);
    }
  
    return randomId;
  };

  
export const modifiedDate = () => {
  const now = new Date();

  return now.toISOString();
};

export const alignLevels = (Level) => {
  if (Level === "Horizontal Level 1") {
      return 'HorizontalLevel0';
  } else if (Level === "Horizontal Level 2") {
      return 'HorizontalLevel1';
  } else if (Level === "Vertical Level 1") {
      return 'verticalLevel1';
  } else if (Level === "Vertical Level 2") {
      return 'verticalLevel2';
  } else if (Level === "Vertical Level 3") {
      return 'verticalLevel3';
  } else {
      return '';
  }
}

export const alignLevelsReverse = (Level) => {
  if (Level === "HorizontalLevel0") {
      return "Horizontal Level 1";
  } else if (Level === "HorizontalLevel1") {
      return "Horizontal Level 2";
  } else if (Level === "verticalLevel1") {
      return "Vertical Level 1";
  } else if (Level === "verticalLevel2") {
      return "Vertical Level 2";
  } else if (Level ===  "verticalLevel3") {
      return "Vertical Level 3";
  } else {
      return '';
  }
}


export const updateDataStore = async (engine, postObject, store, key) =>{

  if (!postObject.hasOwnProperty('modifiedDate')) {
      // If it doesn't exist, add it to the object
      postObject.modifiedDate = modifiedDate();
  } else {
      // If it exists, update its value
      postObject.modifiedDate = modifiedDate();
  }
  try {
      await engine.mutate({
        resource: `dataStore/${store}/${key}`,
        type: 'update',
        data: postObject,
      });

    } catch (error) {
      // Handle error (log, show alert, etc.)
      console.error('Error updating object:', error);
    }
}


export const createDataStore = async (engine, postObject, store, key) =>{

  if (!postObject.hasOwnProperty('modifiedDate')) {
      // If it doesn't exist, add it to the object
      postObject.modifiedDate = modifiedDate();
  } else {
      // If it exists, update its value
      postObject.modifiedDate = modifiedDate();
  }
  try {
    await engine.mutate({
      resource: `dataStore/${store}/${key}`,
      type: 'create',
      data: postObject,
    });

  } catch (error) {
    // Handle error (log, show alert, etc.)
    console.error('Error creating object:', error);
  }
}

export const createOrUpdateDataStore = async (engine, postObject, store, key,mode='') =>{

  if (!postObject.hasOwnProperty('modifiedDate')) {
      // If it doesn't exist, add it to the object
      postObject.modifiedDate = modifiedDate();
  } else {
      // If it exists, update its value
      postObject.modifiedDate = modifiedDate();
  }
  let modeType=''

  if (mode='create'){
    modeType=true
  }else if (mode='update'){
    modeType=false
  }

  try {
    await engine.mutate({
      resource: `dataStore/${store}/${key}`,
      type: modeType ? 'create' : 'update',
      data: postObject,
    });
  } catch (error) {
    console.error('Error creating or updating object:', error);
  }
}


export const queryCatCombo = async (catCombo) =>{


    // Query to fetch data elements and their category information
    const query = {
      categoryCombo: {
        resource: 'categoryCombos',
        params: {
          fields: 'id,name,categories[id,name,categoryOptions[id,name]]',
          filter: `id:eq:${catCombo}`,
        }
      }
    };

    const { data } = useDataQuery(query);
    return data


}
