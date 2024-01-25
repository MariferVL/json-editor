"use client";
import { getFileContent } from '@/app/api';
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
    return <div>Loading...</div>;
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

  const renderForm = (data, parentKey = '') => {
    return Object.entries(data).map(([key, value]) => {
      const newKey = parentKey ? `${parentKey}.${key}` : key;

      if (Array.isArray(value)) {
        return value.map((item, index) => {
          if (typeof item === 'string') {
            return (
              <div key={`${newKey}[${index}]`} className="mb-4">
                <label className="block text-cdt-textBlue text-sm font-bold mb-2">{`${newKey}[${index}]`}</label>
                <input type="text" value={item} onChange={(e) => handleInputChange(`${newKey}[${index}]`, e)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
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
          <div key={newKey} className="mb-4">
            <label className="block text-cdt-textBlue text-sm font-bold mb-2">{newKey}</label>
            <input type="text" value={value} onChange={(e) => handleInputChange(newKey, e)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
        );
      }
    });
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-cdt-textBlue mb-8">Editando {fileName} del Grupo {groupCode} con Formulario</h1>
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">{renderForm(content)}</form>
    </div>
  );
}
