const fileData = {
  '8010': {
    'data11': require('./json-files/data11.json'),
    'data22': require('./json-files/data22.json'),
    'data33': require('./json-files/data33.json'),
  },
  '8030': {
    'data11': require('./json-files/data11.json'),
    'data22': require('./json-files/data22.json'),
    'data33': require('./json-files/data33.json'),
  },
  '7010': {
    'data11': require('./json-files/data11.json'),
    'data22': require('./json-files/data22.json'),
    'data33': require('./json-files/data33.json'),
  },
};

export const getAvailableGroups = () => {
  return Promise.resolve(Object.keys(fileData));
};

export const getFilesFromGroup = (groupCode) => {
  return Promise.resolve(Object.keys(fileData[groupCode] || []));
};


export const getFileContent = (groupCode, fileName) => {
  console.log(`Fetching content for ${groupCode}/${fileName}`);
  return Promise.resolve(fileData[groupCode]?.[fileName] || {});
};

export const saveFileContent = (groupCode, fileName, content) => {
  return new Promise((resolve, reject) => {
    try {
      console.log(`Saving content for ${groupCode}/${fileName}`);
      
      setTimeout(() => {
        if (fileData[groupCode]) {
          fileData[groupCode][fileName] = content;
        }
        
        resolve({ message: 'Content saved successfully.' });
      }, 2000);
    } catch (error) {
      console.error('Error saving data:', error);
      reject(error);
    }
  });
};
