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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Json Editor</h1>
      <div>
        <h2>Selecciona un Código:</h2>
        {/* Dropdown for selecting groups */}
        <select
          value={selectedGroup || ''}
          onChange={(e) => handleGroupSelection(e.target.value)}
        >
          {generateOptions(groups)}
        </select>

        {selectedGroup && (
          <>
            <h2>Selecciona un Archivo para el grupo {selectedGroup}</h2>
            {/* Dropdown for selecting files */}
            <select
              value={selectedFile || ''}
              onChange={(e) => handleFileSelection(e.target.value)}
            >
              {generateOptions(filesInGroup)}
            </select>

            {/* Buttons to edit with different editors */}
            {selectedGroup && selectedFile && (
              <div>
                <Link
                  href={`/form-editor/[groupCode]/[fileName]`}
                  as={`/form-editor/${selectedGroup}/${selectedFile.replace('.json', '')}`}
                >
                  Editar con Formulario
                </Link>
                <Link
                  href={`/full-editor/[groupCode]/[fileName]`}
                  as={`/full-editor/${selectedGroup}/${selectedFile.replace('.json', '')}`}
                >
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
