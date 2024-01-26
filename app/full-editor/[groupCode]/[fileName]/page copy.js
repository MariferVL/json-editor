"use client";
import { getFileContent, saveFileContent } from '@/app/api';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Editor } from '@monaco-editor/react';
import Modal from '@/app/component/modal';

export default function FullEditorPage() {
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
        const data = JSON.stringify(response, null, 2);
        setContent(data);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [pathname, groupCode, fileName]);

  const handleEditorChange = (newValue, e) => {
    setContent(newValue);
  };

  const handleVerifyFormat = () => {
    try {
      JSON.parse(content);
      setModalTitle('Éxito');
      setModalContent('Contenido Verificado');
    } catch (error) {
      console.error('Error en el formato JSON:', error);
      setModalTitle('Error');
      setModalContent('El contenido no es un formato JSON válido');
    }
  };

  const handleSave = async () => {
    try {
      JSON.parse(content);

      const result = await saveFileContent(groupCode, fileName, content);
      setModalTitle('Contenido guardado exitosamente');
      setModalContent(result.content);
    } catch (error) {
      console.error('Error al guardar el contenido:', error);
      setModalTitle('Error');
      setModalContent('El contenido no es un formato JSON válido');
    }
  };

  if (!content) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }
  return (
    <div className="p-4 md:p-10 h-screen flex flex-col bg-[var(--cdt-bg)]">
      <h1 className="text-3xl font-bold mb-2 text-[var(--cdt-primary)]">
        Editor Completo
      </h1>
      <p className="mt-16 mb-6 text-[var(--cdt-text)]">Editando <span className='font-bold'>{fileName}</span> del Código <span className='font-bold'>{groupCode}</span></p>
      <Editor
        height="calc(100% - 1rem)"
        defaultLanguage="json"
        defaultValue={JSON.stringify(content, null, 2)}
        theme="vs-dark"
        onChange={handleEditorChange}
      />
      <div className="mt-8 md:flex md:items-center justify-center">
        <div >
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
