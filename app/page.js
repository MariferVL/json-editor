"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getAvailableGroups, getFilesFromGroup } from './api.js';

/**
 * Home component for displaying and selecting JSON groups and files.
 * Fetches available groups and updates the list of files when a group is selected.
 * Allows users to choose a group and a file for editing.
 *
 * @component
 * @returns {JSX.Element} Home component
 */
export default function Home() {
  // State variables for selected group, selected file, groups, and files in the selected group
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [groups, setGroups] = useState([]);
  const [filesInGroup, setFilesInGroup] = useState([]);

  /**
   * Fetch available groups when the component mounts.
   */
  useEffect(() => {
    getAvailableGroups().then((response) => {
      setGroups(response);
    });
  }, []);

  /**
   * Update the list of files when a group is selected.
   */
  useEffect(() => {
    if (selectedGroup) {
      getFilesFromGroup(selectedGroup).then((files) => {
        setFilesInGroup(files);
      });
    }
  }, [selectedGroup]);


  /**
   * Generate option elements for a dropdown.
   * 
   * @param {string[]} options - Array of options to be included in the dropdown.
   * @returns {JSX.Element} Options for the dropdown.
   */
  const generateOptions = (options) => {
    return (
      <>
        <option value="" disabled>Selecciona una opción</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </>
    );
  };

  /**
   * Handle the selection of a group.
   * 
   * @param {string} groupCode - The code of the selected group.
   */
  const handleGroupSelection = (groupCode) => {
    setSelectedGroup(groupCode);
  };

  /**
   * Handle the selection of a file.
   * 
   * @param {string} fileName - The name of the selected file.
   */
  const handleFileSelection = (fileName) => {
    setSelectedFile(fileName);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 dark:bg-gray-900 dark:text-white">
      <h1 className="text-4xl font-bold mb-4 text-center">Json Editor</h1>
      <div className="w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-2">Selecciona un Código:</h2>
        <select
          value={selectedGroup || ''}
          onChange={(e) => handleGroupSelection(e.target.value)}
          className="mb-4 w-full p-2 border-none rounded-md dark:bg-gray-800 dark:text-white"
        >
          {generateOptions(groups)}
        </select>

        {selectedGroup && (
          <>
            <h2 className="text-2xl font-bold mb-2">Selecciona un Archivo para el grupo {selectedGroup}</h2>
            <select
              value={selectedFile || ''}
              onChange={(e) => handleFileSelection(e.target.value)}
              className="mb-4 w-full p-2 border-none dark:bg-gray-800 dark:text-white rounded-md"
            >
              {generateOptions(filesInGroup)}
            </select>

            {selectedGroup && selectedFile && (
              <div className="flex space-x-2">
                <Link
                  href={`/form-editor/[groupCode]/[fileName]`}
                  as={`/form-editor/${selectedGroup}/${selectedFile.replace('.json', '')}`}
                  className="inline-block no-underline text-center py-2 px-4 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition-colors duration-200 dark:bg-green-600 dark:hover:bg-green-700 dark:active:bg-green-800 dark:focus:ring-green-600"                >
                  Editar con Formulario
                </Link>
                <Link
                  href={`/full-editor/[groupCode]/[fileName]`}
                  as={`/full-editor/${selectedGroup}/${selectedFile.replace('.json', '')}`}
                  className="inline-block no-underline text-center py-2 px-4 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition-colors duration-200 dark:bg-green-600 dark:hover:bg-green-700 dark:active:bg-green-800 dark:focus:ring-green-600"                >
                  Editar con Full Editor
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
