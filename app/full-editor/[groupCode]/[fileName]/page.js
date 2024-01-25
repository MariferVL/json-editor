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
    <div className="p-4 md:p-10 h-screen flex flex-col dark:bg-gray-900 dark:text-white">
      <h1 className="text-2xl md:text-4xl font-bold mb-4">Editando {fileName} del Grupo {groupCode} con Full Editor</h1>
      <Editor
        height="calc(100% - 1rem)"
        defaultLanguage="json"
        defaultValue={JSON.stringify(content, null, 2)}
        theme="vs-dark"
        onChange={handleEditorChange}
      />
      <button onClick={handleSave} className="self-start border-none mt-4 mb-4 px-4 py-2 bg-blue-600 text-white rounded-md">Guardar</button>
    </div>
  );
}
