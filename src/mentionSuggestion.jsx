// src/mentionSuggestion.js
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

// 팝업 목록 UI 컴포넌트
const MentionList = forwardRef((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index) => {
    const item = props.items[index];
    if (item) {
      props.command({ id: item.label, label: item.label });
    }
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
        return true;
      }
      if (event.key === 'ArrowDown') {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
        return true;
      }
      if (event.key === 'Enter') {
        selectItem(selectedIndex);
        return true;
      }
      return false;
    },
  }));

  return (
    <div className="mention-dropdown">
      {props.items.length > 0 ? (
        props.items.map((item, index) => (
          <button
            key={index}
            className={`mention-item ${index === selectedIndex ? 'selected' : ''}`}
            onClick={() => selectItem(index)}
          >
            <span className="mention-icon">{item.type === 'character' ? '👤' : '📜'}</span>
            {item.label}
          </button>
        ))
      ) : (
        <div className="mention-item empty">검색 결과가 없습니다</div>
      )}
    </div>
  );
});

// Tippy.js 팝업 연동 설정 생성 함수
export const createSuggestionConfig = (charChar, getItems) => ({
  char: charChar,
  items: ({ query }) => getItems(query),
  render: () => {
    let component;
    let popup;

    return {
      onStart: (props) => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) return;

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        });
      },

      onUpdate(props) {
        component.updateProps(props);
        if (!props.clientRect) return;
        popup[0].setProps({ getReferenceClientRect: props.clientRect });
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup[0].hide();
          return true;
        }
        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
});