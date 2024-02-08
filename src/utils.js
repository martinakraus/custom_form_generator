
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