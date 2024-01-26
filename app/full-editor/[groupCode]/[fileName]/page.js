"use client";
import { getFileContent, saveFileContent } from '@/app/api';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Editor } from '@monaco-editor/react';

/**
 * FullEditorPage component for editing JSON content.
 * This component fetches content based on the dynamic path segments from the URL,
 * sets the group code and file name using React hooks, and displays the content.
 *
 * @component
 * @returns {JSX.Element} FullEditorPage component
 */
export default function FullEditorPage() {
  // Get the current pathname using usePathname hook
  const pathname = usePathname();

  // State to hold the group code, file name, and content
  const [groupCode, setGroupCode] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [content, setContent] = useState(null);

  /**
   * Fetch data based on the dynamic path segments from the URL.
   * Updates the group code, file name, and content using React hooks.
   */
  useEffect(() => {
    /**
     * Helper function to fetch data and update state.
     */
    const fetchData = async () => {
      // Split the pathname into segments
      const segments = pathname.split('/');

      // Get the group code and file name from path segments
      const segment2 = segments[2];
      const segment3 = segments[3];
      setGroupCode(segment2);
      setFileName(segment3);

      // Check if group code or file name is undefined
      if (!groupCode || !fileName) {
        console.log('Group Code or File Name is undefined:');
        return;
      }

      try {
        // Fetch content based on group code and file name
        const response = await getFileContent(groupCode, fileName);
        setContent(response);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Call the fetchData function
    fetchData();
  }, [pathname, groupCode, fileName]);

  const handleEditorChange = (newValue, e) => {
    setContent(newValue);
  };

  const handleVerifyFormat = () => {
    alert('Éxito: Contenido Verificado');
  }

  const handleSave = async () => {
    try {
      await saveFileContent(groupCode, fileName, content);
      alert('Contenido guardado exitosamente');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  // Display loading message if content is not available yet
  if (!content) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  // Display the content with group code and file name
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
      <div className="mt-4 md:flex md:items-center justify-center">
        <div >
          <button
            onClick={handleVerifyFormat}
            className="self-start mb-4 mr-4 px-2 py-4 font-bold bg-[var(--cdt-primary)] text-white rounded-md w-full"
          >
            Verificar Formato
          </button>
          <button
            onClick={handleSave}
            className="self-start mb-4 px-2 py-4 font-bold bg-[var(--cdt-secondary)] text-white rounded-md w-full"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
