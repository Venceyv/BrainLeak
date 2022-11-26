import { FC, useRef, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './NewComment.css';

export const NewComment: FC = (): JSX.Element => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  return (
    <>
      <div className="p-2 border-2 text-white bg-secondary-black border-border-black rounded-md">
        <Editor
          editorState={editorState}
          toolbarClassName="toolbar-css"
          onEditorStateChange={() => setEditorState(editorState)}
          toolbar={{
            options: ['inline', 'list', 'textAlign', 'remove', 'history'],
            inline: {
              options: ['italic', 'bold'],
            },
            className: 'toolbar-css',
          }}
        />
      </div>
    </>
  );
};
