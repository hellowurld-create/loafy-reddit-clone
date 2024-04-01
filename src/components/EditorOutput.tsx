'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import React, { FC } from 'react'

const Output = dynamic(async () => (
    await import('editorjs-react-renderer'))
    .default, {
        ssr: false,
    }
)

interface EditorOutputProps{
    content: any
}

const style = {
    paragraph: {
        fontSize: '0.875rem',
        lineHeight: '1.25rem'
    }
}

const renderers = {
    image: CustomImageRenderer,
    code: CustomCodeRenderer,
}

const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
        
    return (
        //ts-ignore
          <Output data={content} className='text-sm pb-6' renderers={renderers} />
  )
}

function CustomImageRenderer({ data }: any) {
    const src = data.file.url

    return (
        <div className="relative w-full min-h-[15rem]">
            <Image src={src} fill alt='loafy image' className='object-contain'/>
        </div>
    )
}

function CustomCodeRenderer({ data }: any) {
    return (
        <div className="bg-gray-800 rounded-md p-4">
            <code className='text-gray-100 text-sm'>{data.code}</code>
        </div>
    )
}

export default EditorOutput
