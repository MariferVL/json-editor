"use client";
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getFileContent, saveFileContent } from '@/app/api';
import Modal from '@/app/component/modal';

export default function FormEditorPage() {
  const pathname = usePathname();
  const [groupCode, setGroupCode] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [content, setContent] = useState(null);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState(null);

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
    setFormContent(newContent);
  };

  const handleVerifyFormat = () => {
    try {
      JSON.parse(content);
      setModalTitle('Éxito');
      setModalContent('Contenido Verificado');
    } catch (error) {
      setModalTitle('Error');
      setModalContent('El contenido no es un JSON válido');
    }
  }

  const handleSave = async () => {
    try {
      JSON.parse(content);
      try {
        const result = await saveFileContent(groupCode, fileName, content);
        setModalTitle('Contenido guardado exitosamente');
        setModalContent(result.content);
      } catch (error) {
        console.error('Error saving data:', error);
      }
    } catch (error) {
      setModalTitle('Error');
      setModalContent('El contenido no es un JSON válido');
    }
  };


  const renderForm = (data, parentKey = '', colors = []) => {
    const getColorForLevel = (level) => {
      const baseColors = [
        'var(--cdt-label-1)',
        'var(--cdt-label-2)',
        'var(--cdt-label-3)',
        'var(--cdt-label-4)',
      ];
      const index = level % baseColors.length;
      return baseColors[index];
    };

    return Object.entries(data).map(([key, value], index) => {
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      const labelColor = getColorForLevel(colors.length);
      if (Array.isArray(value)) {
        return value.map((item, index) => {
          if (typeof item === 'string') {
            return (
              <div key={`${newKey}[${index}]`} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mb-8">
                <div className="flex items-right md:pl-16">
                  <label className={`block font-bold md:text-right mb-1 md:mb-0 pr-4 break-words w-full`} style={{ color: labelColor, wordWrap: 'break-word', overflowWrap: 'anywhere' }}>
                    {`${newKey}[${index}]`}
                    : </label>
                </div>
                <div>
                  <textarea
                    className="bg-gray-200 dark:bg-gray-800 appearance-none border-2 border-gray-200 dark:border-gray-700 rounded w-full py-2 px-4 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-purple-500"
                    value={item}
                    onChange={(e) => handleInputChange(`${newKey}[${index}]`, e)}
                  />
                </div>
              </div>

            );
          } else {
            return renderForm(item, `${newKey}[${index}]`, colors.concat(labelColor));
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        return renderForm(value, newKey, colors.concat(labelColor));
      } else if (typeof value === 'string') {
        return (
          <div key={newKey} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mb-8">
            <div className="flex items-right md:pl-16">
              <label className={`block font-bold md:text-right mb-1 md:mb-0 pr-4 break-words w-full`} style={{ color: labelColor, wordWrap: 'break-word' }}>
                {newKey}
                : </label>
            </div>
            <div>
              <textarea
                className="bg-gray-200 dark:bg-gray-800 appearance-none border-2 border-gray-200 dark:border-gray-700 rounded w-full py-2 px-4 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-purple-500"
                value={value}
                onChange={(e) => handleInputChange(newKey, e)}
              />
            </div>
          </div>
        );
      }
    });
  };
  return (
    <div className="md: p-4 md:p-10 h-full flex flex-col bg-[var(--cdt-bg)] ">
      <h1 className="text-3xl font-bold mb-2 text-[var(--cdt-primary)]">
        Formulario Dinámico
      </h1>
      <p className="mt-16 mb-6 text-[var(--cdt-text)]">Editando <span className='font-bold'>{fileName}</span> del Código <span className='font-bold'>{groupCode}</span></p>
      <div className='flex flex-col items-center justify-center mr-8 md:mr-32 md:ml-4'>
        <form className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderForm(content)}
        </form>
        <div className="mt-4 md:flex md:items-center justify-center">
          <div>
            <button
              onClick={handleVerifyFormat}
              className="self-start mb-4 mr-4 px-2 py-4 font-bold bg-[var(--cdt-primary)] text-white text-lg rounded-md w-full"
            >
              Verificar Formato
            </button>
            <button
              onClick={handleSave}
              className="self-start mb-4 px-2 py-4 font-bold bg-[var(--cdt-secondary)] text-white text-lg rounded-md w-full"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
      {modalContent && (
        <Modal
          title={modalTitle}
          content={modalContent}
          isVerify={modalTitle === 'Éxito' || modalTitle === 'Error'}
          onClose={() => { setModalContent(null); setModalTitle(null); }}
        />
      )}

    </div>
  );
}