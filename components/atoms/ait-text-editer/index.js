// import React, { useState } from 'react';
// import { Editor } from '@tinymce/tinymce-react';

// const TextEditor = () => {
//   const [editorContent, setEditorContent] = useState('');

//   const handleEditorChange = (content) => {
//     setEditorContent(content);
//   };

//   return (
//     <div>
//       <Editor
//         apiKey="8wewkxahk4dkuw3vo8famfcysd2lozc79af7lkpafsk0onk8"
//         initialValue=""
//         init={{
//           height: 300,
//           menubar: false,
//           branding: false,
//           plugins: [
//             'advlist',
//             'autolink',
//             'lists',
//             'link',
//             'image',
//             'charmap',
//             'preview',
//             'anchor',
//           ],
//           toolbar:
//             'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | link image',
//         }}
//         onEditorChange={handleEditorChange}
//       />
//     </div>
//   );
// };

// export default TextEditor;

// import React, { useState, useEffect } from 'react';

// const TextEditor = ({ initialValue, onChangeValue, rest }) => {
//   const [editorContent, setEditorContent] = useState('');
//   const [FroalaEditor, setFroalaEditor] = useState(null);

//   useEffect(() => {
//     (async () => {
//       await import('froala-editor/js/plugins.pkgd.min.js');

//       await import('froala-editor/css/froala_editor.pkgd.min.css');
//       await import('froala-editor/css/froala_style.min.css');
//       await import('froala-editor/css/plugins/colors.min.css');

//       const { default: Editor } = await import('react-froala-wysiwyg');
//       setFroalaEditor(() => Editor);
//     })();
//   }, []);

//   const handleModelChange = (model) => {
//     if (onChangeValue) {
//       onChangeValue(model);
//     }
//     setEditorContent(model);
//   };

//   useEffect(() => {
//     if (initialValue) {
//       setEditorContent(initialValue);
//     } else {
//       setEditorContent('');
//     }
//   }, [initialValue]);

//   if (!FroalaEditor) return <p>Loading editor...</p>;

//   return (
//     <div>
//       <FroalaEditor
//         model={editorContent}
//         onModelChange={handleModelChange}
//         config={{
//           attribution: false,
//           heightMin: 200,
//           charCounterCount: false,
//           placeholderText: '',
//           imageUpload: true,
//           imageUploadURL: '/upload_image',
//           imageAllowedTypes: ['jpeg', 'jpg', 'png', 'gif'],
//           imageDefaultWidth: 300,
//           events: {
//             initialized: function () {
//               // 'this' refers to the current Froala editor instance
//               const toolbar = this.$tb; // Froala's jQuery toolbar reference
//               if (toolbar && toolbar[0]) {
//                 toolbar[0].style.backgroundColor = '#f6f7f8';
//               }
//             },
//           },
//           toolbarButtons: [
//             'bold',
//             'italic',
//             'underline',
//             'strikeThrough',
//             'fontFamily',
//             'fontSize',
//             'color',
//             'backgroundColor',
//             '|',
//             'align',
//             'formatOL',
//             'formatUL',
//             '|',
//             'insertLink',
//             'insertImage',
//             'emoticons',
//             '|',
//             'undo',
//             'redo',
//             'fullscreen',
//           ],
//           emoticonsUseImage: false,
//           colorsBackground: [
//             '#ffffff',
//             '#ffeb3b',
//             '#f44336',
//             '#4caf50',
//             '#2196f3',
//             '#9c27b0',
//           ],
//           colorsText: [
//             '#000000',
//             '#f44336',
//             '#4caf50',
//             '#2196f3',
//             '#9c27b0',
//             '#ff9800',
//           ],
//         }}
//         {...rest}
//       />
//     </div>
//   );
// };

// export default TextEditor;

// components/TextEditor.js
// components/TextEditor.js

// import dynamic from 'next/dynamic';
// import React, { useEffect, useRef } from 'react';
// import styled from 'styled-components';

// const CKEditor = dynamic(
//   async () => {
//     const { CKEditor } = await import('@ckeditor/ckeditor5-react');
//     const ClassicEditor = (await import('@ckeditor/ckeditor5-build-classic'))
//       .default;
//     return (props) => <CKEditor editor={ClassicEditor} {...props} />;
//   },
//   { ssr: false }
// );

// const EditorWrapper = styled.div`
//   .ck-editor__editable_inline {
//     min-height: 300px;
//     max-height: 600px;
//     overflow-y: auto;
//   }
// `;

// const TextEditor = ({ initialValue = '', onChangeValue, ...rest }) => {
//   const editorRef = useRef(false);

//   return (
//     <EditorWrapper>
//       <CKEditor
//         data={initialValue} // ✅ ONLY initial data
//         config={{
//           toolbar: [
//             'bold',
//             'italic',
//             'underline',
//             'strikethrough',
//             'fontFamily',
//             'fontSize',
//             'fontColor',
//             'fontBackgroundColor',
//             '|',
//             'alignment',
//             'numberedList',
//             'bulletedList',
//             '|',
//             'link',
//             // 'imageUpload',
//             '|',
//             'undo',
//             'redo',
//           ],
//           // image: {
//           //   toolbar: [
//           //     'imageTextAlternative',
//           //     'imageStyle:full',
//           //     'imageStyle:side',
//           //   ],
//           // },
//           // extraPlugins: [
//           //   function Base64UploadAdapter(editor) {
//           //     editor.plugins.get('FileRepository').createUploadAdapter = (
//           //       loader
//           //     ) => ({
//           //       upload: () =>
//           //         loader.file.then(
//           //           (file) =>
//           //             new Promise((resolve) => {
//           //               const reader = new FileReader();
//           //               reader.readAsDataURL(file);
//           //               reader.onload = () =>
//           //                 resolve({ default: reader.result });
//           //             })
//           //         ),
//           //       abort: () => {},
//           //     });
//           //   },
//           // ],
//         }}
//         onReady={() => {
//           editorRef.current = true;
//         }}
//         onBlur={(event, editor) => {
//           const data = editor.getData();
//           onChangeValue?.(data);
//         }}
//         {...rest}
//       />
//     </EditorWrapper>
//   );
// };

// export default TextEditor;

import { useEffect, useRef, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import 'quill/dist/quill.snow.css';

const WORD_FONT_SIZES = [
  '8px',
  '9px',
  '10px',
  '11px',
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '22px',
  '24px',
  '26px',
  '28px',
  '36px',
  '48px',
  '72px',
];

const SPECIAL_CHARACTERS = [
  '!',
  '"',
  '#',
  '$',
  '%',
  '&',
  "'",
  '(',
  ')',
  '*',
  '+',
  '-',
  '.',
  '/',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  ':',
  ';',
  '<',
  '=',
  '>',
  '?',
  '@',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  '[',
  '\\',
  ']',
  '^',
  '_',
  '`',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  '{',
  '|',
  '}',
  '~',
  '€',
  '‘',
  '’',
  '“',
  '”',
  '–',
  '—',
  '¡',
  '¢',
  '£',
  '¥',
  '§',
  '©',
  '®',
  '™',
  'µ',
  '¶',
  '·',
  '¸',
  '¹',
  '¼',
  '½',
  '¾',
  '¿',
  'À',
  'Á',
  'Â',
  'Ã',
  'Ä',
  'Å',
  'Æ',
  'Ç',
  'È',
  'É',
  'Ê',
  'Ë',
  'Ì',
  'Í',
  'Î',
  'Ï',
  'Ð',
  'Ñ',
  'Ò',
  'Ó',
  'Ô',
  'Õ',
  'Ö',
  'Ø',
  'Ù',
  'Ú',
  'Û',
  'Ü',
  'Ý',
  'Þ',
  'ß',
  'à',
  'á',
  'â',
  'ã',
  'ä',
  'å',
  'æ',
  'ç',
  'è',
  'é',
  'ê',
  'ë',
  'ì',
  'í',
  'î',
  'ï',
  'ð',
  'ñ',
  'ò',
  'ó',
  'ô',
  'õ',
  'ö',
  '÷',
  'ø',
  'ù',
  'ú',
  'û',
  'ü',
  'ý',
  'þ',
  'ÿ',
  'Œ',
  'œ',
  'Ÿ',
  '¿',
  '•',
  '…',
  '–',
  '—',
  '™',
  '→',
  '←',
  '⇒',
  '⇔',
  '♦',
  '≈',
];

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background: white;
  padding: 16px;
  max-width: 400px;
  max-height: 300px;
  overflow-y: auto;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const CharGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 40px);
  gap: 10px;
`;

const CharButton = styled.button`
  font-size: 24px;
  padding: 6px;
  cursor: pointer;
  border: none;
  background: #f0f0f0;
  border-radius: 4px;
  transition: background 0.2s;
  &:hover {
    background: #ddd;
  }
`;

export const EditorWrapper = styled.div`
  border: 1px solid #d1d5db;
  border-radius: 4px;
  height: ${({ height }) => height}px;
  min-height: 150px;
  max-height: 600px;

  resize: vertical;
  overflow: hidden;

  display: flex;
  flex-direction: column;
`;

/* Quill root */
export const EditorRoot = styled.div`
  flex: 1;
  overflow: hidden;
`;

/* Global Quill overrides */
export const QuillStyles = styled.div`
  .ql-toolbar {
    position: sticky;
    top: 0;
    z-index: 10;
    background: #fff;
    border-bottom: 1px solid #e5e7eb;
  }

  .ql-container {
    flex: 1;
    overflow: hidden;
  }

  .ql-editor {
    height: 100%;
    overflow-y: auto;
  }
`;

// const EditorWrapper = styled.div`
//   .ql-container {
//     min-height: ${({ height }) => height}px;
//   }

//   .ql-editor {
//     line-height: 1.3;
//   }
// `;

const QuillSizeStyles = createGlobalStyle`
  ${WORD_FONT_SIZES.map(
    (size) => `
      .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="${size}"]::before,
      .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="${size}"]::before {
        content: "${size.replace('px', '')}";
      }
    `
  ).join('')}
  .ql-snow .ql-picker.ql-size{
  width:50px;
  }
`;

const IMAGE_ALIGN_STYLES = {
  left: 'display:block;margin-left:0;margin-right:auto;',
  center: 'display:block;margin:0 auto;',
  right: 'display:block;margin-left:auto;margin-right:0;',
};

export default function CustomEditor({
  height = 200,
  onChange,
  initialValue = '',
}) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    return () => {
      if (quillRef.current) {
        quillRef.current.off('text-change');
        quillRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    (async () => {
      const Quill = (await import('quill')).default;
      if (!editorRef?.current || editorRef?.current === null) return;
      const container = editorRef.current.parentNode;
      container?.querySelectorAll('.ql-toolbar').forEach((tb) => tb.remove());

      const SizeStyle = Quill.import('attributors/style/size');
      SizeStyle.whitelist = WORD_FONT_SIZES;
      Quill.register(SizeStyle, true);

      const Align = Quill.import('attributors/style/align');
      Quill.register(Align, true);

      editorRef.current.innerHTML = '';

      const quill = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ size: WORD_FONT_SIZES }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ align: [] }],
            ['link', 'image'],
            [{ color: [] }, { background: [] }],
            ['clean'],
          ],
        },
      });

      if (initialValue) {
        quill.clipboard.dangerouslyPasteHTML(initialValue, 'silent');
      }

      quill.format('size', '16px');

      quill.on('text-change', () => {
        onChange?.(quill.root.innerHTML);
      });

      const toolbar = quill.getModule('toolbar');
      toolbar.addHandler('align', (value) => {
        const range = quill.getSelection();
        if (!range) return;

        const [leaf] = quill.getLeaf(range.index);
        if (!leaf || leaf.domNode.tagName !== 'IMG') return;

        const img = leaf.domNode;
        img.style.cssText = '';
        if (value === 'center') img.style.cssText = IMAGE_ALIGN_STYLES.center;
        else if (value === 'right')
          img.style.cssText = IMAGE_ALIGN_STYLES.right;
        else img.style.cssText = IMAGE_ALIGN_STYLES.left;
      });

      quill.root.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG') {
          const blot = Quill.find(e.target);
          const index = quill.getIndex(blot);
          quill.setSelection(index, 1);
        }
      });

      const specialCharBtn = document.createElement('button');
      specialCharBtn.type = 'button';
      specialCharBtn.innerText = 'Ω';
      specialCharBtn.title = 'Insert Special Character';
      specialCharBtn.onclick = () => setShowModal(true);

      if (!toolbar.container.querySelector('.ql-specialchar-btn')) {
        specialCharBtn.classList.add('ql-specialchar-btn');
        toolbar.container.appendChild(specialCharBtn);
      }

      quillRef.current = quill;
    })();
  }, [onChange, initialValue]);

  const insertChar = (char) => {
    if (!quillRef.current) return;
    const range = quillRef.current.getSelection(true);
    quillRef.current.insertText(range.index, char, 'user');
    quillRef.current.setSelection(range.index + 1);
    setShowModal(false);
  };

  return (
    <>
      <QuillSizeStyles />

      <QuillStyles>
        <EditorWrapper height={height}>
          <EditorRoot ref={editorRef} />

          {showModal && (
            <ModalOverlay onClick={() => setShowModal(false)}>
              <ModalContent onClick={(e) => e.stopPropagation()}>
                <CharGrid>
                  {SPECIAL_CHARACTERS.map((char) => (
                    <CharButton key={char} onClick={() => insertChar(char)}>
                      {char}
                    </CharButton>
                  ))}
                </CharGrid>
              </ModalContent>
            </ModalOverlay>
          )}
        </EditorWrapper>
      </QuillStyles>
    </>
  );
}
