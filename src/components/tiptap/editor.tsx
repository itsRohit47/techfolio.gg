'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const Tiptap = () => {
    const editor = useEditor({

        extensions: [
            StarterKit,
        ],
        content: '<p>Hello World! 🌎️</p>',
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none'
            },
        },

    })

    return (
        <>
            <EditorContent editor={editor}  />
        </>
    )
}

export default Tiptap
