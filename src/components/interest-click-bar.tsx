'use client'
import { api } from '@/trpc/react'
import React, { useState } from 'react'
import { Flame } from 'lucide-react'
import confetti from 'canvas-confetti'
import Link from 'next/link'
import Image from 'next/image'

export default function InterestClickBar({ caseNum }: { caseNum: number }) {
    const { mutate } = api.user.updateIneedThis.useMutation()
    const [showMessage, setShowMessage] = useState(false)

    const handleClick = () => {
        setShowMessage(true)
        void confetti()
        mutate(
            { caseNum },
            {
                onSuccess: () => {
                    console.log('Interest updated')
                },
                onError: (err) => {
                    console.error(err)
                }
            }
        )
    }

    return (
        <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center bg-gray-100">
            {!showMessage ? (
                <div className="mb-4 text-center">
                    <p className="text-xl font-semibold mb-2">
                        Are you interested in this template?
                    </p>
                    <p>We will work hard to make it happen. Stay tuned!</p>
                    <br></br>
                    <button
                        onClick={handleClick}
                        className="bg-gradient-to-r mx-auto from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 flex items-center gap-2"
                    >
                        <Flame size={24} />
                        I&apos;m interested
                    </button>
                </div>
            ) : (
                <div className="mb-4 text-green-700 text-center">
                    <p className="font-semibold text-xl mb-2">Thank you for your interest!</p>
                    <p>We will work hard to make it happen. Stay tuned!</p>
                    <br></br>
                    <Link href="https://www.linkedin.com/in/itsrohitbajaj/" target='_blank' rel='noopener noreferrer' className="bg-gradient-to-r w-max bg-blue-500 hover:bg-blue-600  text-white font-bold py-2 mx-auto px-4 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 flex items-center gap-2 hover:text-white">
                        Connect with me <Image src="/avatar.png" alt="linkedin" width={24} height={24} className='object-cover' />
                    </Link>
                </div>
            )}
        </div>
    )
}

