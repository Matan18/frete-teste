import React, { HTMLAttributes, useCallback, useEffect, useRef, useState } from 'react';
import { ContentState, convertFromHTML, Editor, EditorState, RichUtils } from 'draft-js';
import { GrBold, GrItalic, GrUnderline } from "react-icons/gr";
import { FiCode } from "react-icons/fi";


interface IEditorComponentProps extends HTMLAttributes<HTMLDivElement> {
  state: EditorState;
  setEditorState: (value: EditorState) => void;
}


const EditorComponent: React.FC<IEditorComponentProps> = ({ state: initialState, setEditorState: UpdateDescription, ...props }) => {
  const [state, seteditorstate] = useState<EditorState>(initialState);
  useEffect(() => {
    const headerOne = '<p>A marca <i><b>Bicycle</b></i> oferece qualidade <b>superior</b> graças à sua paixão em melhorar a experiência de jogo.' +
      'Toda vez que você abre um novo deck de cartas <i><b>Bicycle</b></i>, você lida com mais de 125 anos de experiência em cartas.</p>';
    const blocksFromHTML = convertFromHTML(headerOne);
    const initialState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    seteditorstate(EditorState.createWithContent(initialState))
  }, [])
  const editorRef = useRef<Editor>(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  useEffect(() => {
    if (state) {

      const boldItem = state.getCurrentInlineStyle().find(value => value === "BOLD");
      if (boldItem) {
        setIsBold(true)
      } else {
        setIsBold(false)
      }
      const italicItem = state.getCurrentInlineStyle().find(item => item === 'ITALIC');
      if (italicItem) {
        setIsItalic(true)
      } else {
        setIsItalic(false)
      }

      const codeItem = state.getCurrentInlineStyle().find(item => item === 'CODE');
      if (codeItem) {
        setIsCode(true)
      } else {
        setIsCode(false)
      }
      const underlineItem = state.getCurrentInlineStyle().find(item => item === 'UNDERLINE');
      if (underlineItem) {
        setIsUnderline(true)
      } else {
        setIsUnderline(false)
      }
      UpdateDescription(state);
    }
  }, [state, UpdateDescription])

  const handleKeyCommand = useCallback((command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      seteditorstate(newState);
      return 'handled';
    }
    return 'not-handled';
  }, [seteditorstate])

  const onClickInlineStyle = useCallback((value: string) => {
    seteditorstate(RichUtils.toggleInlineStyle(state, value))
  }, [seteditorstate, state])

  return (
    <div {...props} onClick={() => editorRef?.current.focus()}>
      <div>
        <span onMouseDown={(e) => { e.preventDefault(); onClickInlineStyle('BOLD') }}>
          <GrBold
            size={20}
            color={isBold ? "#084df7" : "#000"}
          />
        </span>
        <span onMouseDown={(e) => { e.preventDefault(); onClickInlineStyle('ITALIC') }}>
          <GrItalic
            size={20}
            color={isItalic ? "#084df7" : "#000"}
          />
        </span>
        <span onMouseDown={(e) => { e.preventDefault(); onClickInlineStyle('CODE') }}>
          <FiCode
            size={20}
            color={isCode ? "#084df7" : "#000"}
          />
        </span>
        <span onMouseDown={(e) => { e.preventDefault(); onClickInlineStyle('UNDERLINE') }}>
          <GrUnderline
            size={20}
            color={isUnderline ? "#084df7" : "#000"}
          />
        </span>
      </div>
      <hr />
      {state &&
        <Editor
          ref={editorRef}
          editorState={state}
          onChange={seteditorstate}
          handleKeyCommand={handleKeyCommand}
          placeholder="Coloque uma descrição"
        />
      }
    </div>
  )
}

export default EditorComponent;