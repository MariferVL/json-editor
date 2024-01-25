"use client";
import { getFileContent } from '@/app/api';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

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

  // Display loading message if content is not available yet
  if (!content) {
    return <div>Loading...</div>;
  }

  // Display the content with group code and file name
  return (
    <div>
      <h1>Editando {fileName} del Grupo {groupCode} con Full Editor</h1>
      <pre>{JSON.stringify(content, null, 2)}</pre>
    </div>
  );
}
