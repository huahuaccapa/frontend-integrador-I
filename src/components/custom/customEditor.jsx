import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './custom-ckeditor.css'; // Importa tu archivo CSS personalizado

const CKEditorComponent = ({ data, onChange }) => {
  return (
    <div className="editor">
      <CKEditor
        editor={ClassicEditor}
        data={data}
        config={{
          toolbar: {
            items: [
              'heading', '|',
              'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|',
              'undo', 'redo'
            ],
            // shouldNotGroupWhenFull: true
          },
          placeholder: 'Escribe aquí...',
          language: 'es'
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
      />
    </div>
  );
};

export default CKEditorComponent;
