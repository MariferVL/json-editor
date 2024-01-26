import { Editor } from '@monaco-editor/react';


export default function Modal({ title, content, isVerify, onClose }) {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center">
      <div className="bg-[var(--cdt-bg)] py-4 px-8 relative flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4 text-[var(--cdt-primary)]">{title}</h2>
        {isVerify ? (
          <p className='text-[var(--cdt-text)] mx-16'>{content}</p>
        ) : (
          <Editor
            height="25vh"
            defaultLanguage="json"
            theme="vs-dark"
            value={content}
            options={{
              readOnly: true,
            }}
          />
        )}
        <button onClick={onClose}
          className="mt-4 mb-2 mr-4 py-2 px-3 font-bold bg-[var(--cdt-primary)] text-white text-lg rounded border-none"
        >
          OK
        </button>
      </div>
    </div>
  );
}
