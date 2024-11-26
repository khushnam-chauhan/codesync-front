import React, { useEffect, useRef, useCallback } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/addon/hint/show-hint.css';
import ACTIONS from '../Actions';

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);
  const textareaRef = useRef(null);

  // Memoize the code change handler
  const handleCodeChange = useCallback((instance, changes) => {
    const { origin } = changes;
    const code = instance.getValue();
    
    // Only emit changes that are not from server sync
    if (origin !== 'setValue') {
      onCodeChange(code);
      
      // Safely check if socket is available before emitting
      if (socketRef.current) {
        socketRef.current.emit(ACTIONS.CODE_CHANGE, {
          roomId,
          code,
        });
      }
    }
  }, [onCodeChange, roomId, socketRef]);

  // Main initialization useEffect
  useEffect(() => {
    if (!textareaRef.current) return;

    // Create CodeMirror instance
    const codeMirrorInstance = Codemirror.fromTextArea(
      textareaRef.current,
      {
        mode: { name: 'javascript', json: true },
        theme: 'dracula',
        autoCloseTags: true,
        autoCloseBrace: true,
        lineNumbers: true,
        lineWrapping: true,
        extraKeys: {
          'Ctrl-Space': 'autocomplete',
        },
      }
    );

    // Store reference
    editorRef.current = codeMirrorInstance;

    // Attach change listener
    codeMirrorInstance.on('change', handleCodeChange);

    // Socket listener for external code changes
    const socketCurrent = socketRef.current;
    socketCurrent?.on(ACTIONS.CODE_CHANGE, ({ code }) => {
      if (code !== null) {
        codeMirrorInstance.setValue(code);
      }
    });

    // Cleanup function
    return () => {
      socketCurrent?.off(ACTIONS.CODE_CHANGE);
      codeMirrorInstance.toTextArea();
    };
  }, [socketRef, handleCodeChange]);

  // Effect to reset editor when roomId changes
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setValue('');
    }
  }, [roomId]);

  return (
    <div className="editor-container">
      <textarea ref={textareaRef} id="realtimeEditor"></textarea>
    </div>
  );
};

export default React.memo(Editor);