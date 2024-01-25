"use client";
import { getFileContent,saveFileContent } from '@/app/api';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FormEditorPage() {
  const pathname = usePathname();
  const [groupCode, setGroupCode] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [content, setContent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const segments = pathname.split('/');
      const segment2 = segments[2];
      const segment3 = segments[3];
      setGroupCode(segment2);
      setFileName(segment3);

      if (!groupCode || !fileName) {
        console.log('Group Code or File Name is undefined:');
        return;
      }

      try {
        const response = await getFileContent(groupCode, fileName);
        setContent(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [pathname, groupCode, fileName]);

  if (!content) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  const handleInputChange = (keyPath, event) => {
    const newContent = { ...content };
    let keyPathArray = keyPath.split('.');
    let lastKey = keyPathArray.pop();
    let point = newContent;

    keyPathArray.forEach((key) => {
      point = point[key];
    });

    point[lastKey] = event.target.value;
    setContent(newContent);
  };


  const handleSave = async () => {
    try {
      await saveFileContent(groupCode, fileName, content);
      alert('Contenido guardado exitosamente');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const renderForm = (data, parentKey = '') => {
    return Object.entries(data).map(([key, value]) => {
      const newKey = parentKey ? `${parentKey}.${key}` : key;

      if (Array.isArray(value)) {
        return value.map((item, index) => {
          if (typeof item === 'string') {
            return (
              <div key={`${newKey}[${index}]`} className="md:flex md:items-center mb-6">
                <div className="md:w-1/3 flex items-center">
                  <label className="block text-gray-500 dark:text-gray-300 font-bold md:text-right mb-1 md:mb-0 pr-4 break-words">{`${newKey}[${index}]`}</label>
                </div>
                <div className="md:w-2/3">
                  <input
                    className="bg-gray-200 dark:bg-gray-800 appearance-none border-2 border-gray-200 dark:border-gray-700 rounded w-full py-2 px-4 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-purple-500"
                    type="text"
                    value={item}
                    onChange={(e) => handleInputChange(`${newKey}[${index}]`, e)}
                  />
                </div>
              </div>
            );

          } else {
            return renderForm(item, `${newKey}[${index}]`);
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        return renderForm(value, newKey);
      } else if (typeof value === 'string') {
        return (
          <div key={newKey} className="md:flex md:items-center mb-6">
            <div className="md:w-1/3 flex items-center">
              <label className="block text-gray-500 dark:text-gray-300 font-bold md:text-right mb-1 md:mb-0 pr-4 break-words">{newKey}</label>
            </div>
            <div className="md:w-2/3">
              <input
                className="bg-gray-200 dark:bg-gray-800 appearance-none border-2 border-gray-200 dark:border-gray-700 rounded w-full py-2 px-4 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-purple-500"
                type="text"
                value={value}
                onChange={(e) => handleInputChange(newKey, e)} />
            </div>
          </div>
        );

      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen p-24 dark:bg-gray-900 dark:text-white">
    <h1 className="text-gray-700 dark:text-gray-300 col-span-full">
      Editando {fileName} del Grupo {groupCode} con Formulario
    </h1>
    <form className="w-full max-w-sm col-span-full">
      {renderForm(content)}
      <div className="md:flex md:items-center">
        <div className="md:w-1/3"></div>
        <div className="md:w-2/3">
        <button onClick={handleSave} className="self-start mb-4 px-4 py-2 bg-blue-600 border-none text-white rounded-md">Guardar</button>

        </div>
      </div>
    </form>
  </div>
  );
}
