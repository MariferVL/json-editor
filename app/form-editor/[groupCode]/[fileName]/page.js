"use client";
import { useEffect, useState, useReducer, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { getFileContent, saveFileContent } from '@/app/api';
import Modal from '@/app/component/modal';
import { JsonForms } from '@jsonforms/react';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';

const initialState = {
  groupCode: null,
  fileName: null,
  modalContent: null,
  modalTitle: null,
  data: null,
  schema: null,
  uischema: null,
  locale: 'es',
};

const actionTypes = {
  SET_DATA: 'SET_DATA',
  SET_SCHEMA: 'SET_SCHEMA',
  SET_UISCHEMA: 'SET_UISCHEMA',
  SET_GROUP_CODE: 'SET_GROUP_CODE',
  SET_FILE_NAME: 'SET_FILE_NAME',
  SET_MODAL_CONTENT: 'SET_MODAL_CONTENT',
  SET_MODAL_TITLE: 'SET_MODAL_TITLE',
  SET_LOCALE: 'SET_LOCALE',
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_DATA:
      return { ...state, data: action.payload };
    case actionTypes.SET_SCHEMA:
      return { ...state, schema: action.payload };
    case actionTypes.SET_UISCHEMA:
      return { ...state, uischema: action.payload };
    case actionTypes.SET_GROUP_CODE:
      return { ...state, groupCode: action.payload };
    case actionTypes.SET_FILE_NAME:
      return { ...state, fileName: action.payload };
    case actionTypes.SET_MODAL_CONTENT:
      return { ...state, modalContent: action.payload };
    case actionTypes.SET_MODAL_TITLE:
      return { ...state, modalTitle: action.payload };
    case actionTypes.SET_LOCALE:
      return { ...state, locale: action.payload };
    default:
      return state;
  }
};

export default function FormEditorPage() {
  const pathname = usePathname();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { groupCode, fileName, modalContent, modalTitle, data, schema, uischema, locale } = state;

  const languageOptions = [
    { value: 'es', label: 'Default' },
    { value: 'en', label: 'English' },
  ];

  const [jsonFormsConfig, setJsonFormsConfig] = useState({
    renderers: materialRenderers,
    cells: materialCells,
    i18n: { locale: locale },
    schema: schema,
    uischema: uischema,
    data: data,
  });

  function generateSchema(jsonData) {
    let schema = {};

    if (Array.isArray(jsonData)) {
      schema.type = 'array';
      schema.items = jsonData.length > 0 ? generateSchema(jsonData[0]) : {};
    } else if (typeof jsonData === 'object' && jsonData !== null) {
      schema.type = 'object';
      schema.properties = {};
      for (const key in jsonData) {
        if (jsonData.hasOwnProperty(key)) {
          schema.properties[key] = generateSchema(jsonData[key]);
        }
      }
    } else {
      schema.type = typeof jsonData;
      if (schema.type === 'string') {
        const date = Date.parse(jsonData);
        if (!isNaN(date)) {
          schema.format = 'date-time';
        }
      }
    }
    return schema;
  }

  function generateUischema(schema) {
    const uischema = {
      type: 'VerticalLayout',
      elements: [],
    };

    for (const key in schema.properties) {
      if (schema.properties.hasOwnProperty(key)) {
        const field = {
          type: 'Control',
          scope: `#/properties/${key}`,
        };
        uischema.elements.push(field);
      }
    }

    return uischema;
  }


  const handleLanguageChange = (event) => {
    const newLocale = event.target.value;
    console.log('New Locale:', newLocale);
    dispatch({ type: actionTypes.SET_LOCALE, payload: newLocale });
    setJsonFormsConfig((prevConfig) => ({
      ...prevConfig,
      i18n: { locale: newLocale },
    }));
    window.location.reload();
  };
  

  useEffect(() => {
    const fetchData = async () => {
      const segments = pathname.split('/');
      const segment2 = segments[2];
      const segment3 = segments[3];

      dispatch({ type: actionTypes.SET_GROUP_CODE, payload: segment2 });
      dispatch({ type: actionTypes.SET_FILE_NAME, payload: segment3 });

      if (!segment2 || !segment3) {
        dispatch({ type: actionTypes.SET_MODAL_TITLE, payload: 'Error' });
        dispatch({ type: actionTypes.SET_MODAL_CONTENT, payload: 'Código de Grupo o Nombre de archivo es: undefined.' });
        return;
      }

      try {
        const response = await getFileContent(segment2, segment3);
        const generatedSchema = generateSchema(response);

        dispatch({ type: actionTypes.SET_DATA, payload: response });
        dispatch({ type: actionTypes.SET_SCHEMA, payload: generatedSchema });
      } catch (error) {
        console.error('Error fetching data:', error);
        dispatch({ type: actionTypes.SET_MODAL_TITLE, payload: 'Error' });
        dispatch({ type: actionTypes.SET_MODAL_CONTENT, payload: `Hubo un problema al obtener los datos: ${error.message}` });
      }
    };

    fetchData();
  }, [pathname, groupCode, fileName]);

  useEffect(() => {
    if (schema) {
      dispatch({ type: actionTypes.SET_UISCHEMA, payload: generateUischema(schema) });
    }
  }, [schema]);

  useEffect(() => {
    setJsonFormsConfig((prevConfig) => ({
      ...prevConfig,
      schema: schema,
      uischema: uischema,
      data: data,
    }));
  }, [schema, uischema, data]);

  useEffect(() => {
    console.log('Updating jsonFormsConfig:', jsonFormsConfig);
    setJsonFormsConfig((prevConfig) => ({
      ...prevConfig,
      schema: schema,
      uischema: uischema,
      data: data,
      i18n: { locale: locale },
    }));

    console.log('schema: ', schema);
    console.log('uischema: ', uischema);
    console.log('data: ', data);
    console.log('locale: ', locale);
  }, [schema, uischema, data, locale]);

  const handleVerifyFormat = () => {
    try {
      JSON.parse(data);
      dispatch({ type: actionTypes.SET_MODAL_TITLE, payload: 'Éxito' });
      dispatch({ type: actionTypes.SET_MODAL_CONTENT, payload: 'Contenido Verificado' });
    } catch (error) {
      dispatch({ type: actionTypes.SET_MODAL_TITLE, payload: 'Error' });
      dispatch({ type: actionTypes.SET_MODAL_CONTENT, payload: `El contenido no es un JSON válido: ${error.message}` });
    }
  }

  const handleSave = async () => {
    try {
      JSON.parse(data);
      try {
        const result = await saveFileContent(groupCode, fileName, data);
        dispatch({ type: actionTypes.SET_MODAL_TITLE, payload: 'Contenido guardado exitosamente' });
        dispatch({ type: actionTypes.SET_MODAL_CONTENT, payload: result.data });
      } catch (error) {
        console.error('Error saving data:', error);
        dispatch({ type: actionTypes.SET_MODAL_TITLE, payload: 'Error' });
        dispatch({ type: actionTypes.SET_MODAL_CONTENT, payload: `Error guardando la data: ${error.message}` });
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_MODAL_TITLE, payload: 'Error' });
      dispatch({ type: actionTypes.SET_MODAL_CONTENT, payload: `El contenido no es un JSON válido: ${error.message}` });
    }
  };

  return (
    <main className="p-4 md:p-10 min-h-screen flex flex-col bg-[var(--cdt-bg)] ">
      <header>
        <h1 className="text-3xl font-bold mb-2 text-[var(--cdt-primary)]">
          Formulario Dinámico
        </h1>
        <p className="mt-8 mb-16 text-[var(--cdt-text)]">Editando <span className='font-bold'>{fileName}</span> del Código <span className='font-bold'>{groupCode}</span></p>
      </header>
      <section className='flex flex-col items-center justify-center lg:mx-40'>
        <div className="w-full max-w-md mx-auto">
          <label htmlFor="languageSelect" className="text-2xl font-bold mb-2">Selecciona Idioma: </label>
          <select
            id="languageSelect"
            value={locale}
            onChange={handleLanguageChange}
            className="mb-4 w-full p-2 border-none rounded-md dark:bg-gray-800 dark:text-white"
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {jsonFormsConfig.schema && (
          <JsonForms {...jsonFormsConfig} />
        )}
        <div className="mt-4 flex items-center justify-center">
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
      </section>
      {modalContent && (
        <Modal
          title={modalTitle}
          content={modalContent}
          isVerify={modalTitle === 'Éxito' || modalTitle === 'Error'}
          onClose={() => {
            dispatch({ type: actionTypes.SET_MODAL_CONTENT, payload: null });
            dispatch({ type: actionTypes.SET_MODAL_TITLE, payload: null });
          }}
        />
      )}
    </main>
  );
}
