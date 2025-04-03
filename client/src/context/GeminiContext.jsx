import getResponse from "@/config/gemini";
import { createContext, useState } from "react";

export const GeminiContext = createContext()

const ContextProvider = ({children}) => {
    const [input, setInput] = useState('')
    const [recentPrompt, setRecentPrompt] = useState('')
    const [showResult, setShowResult] = useState(false)
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState("")

    const onSent = async(prompt) => {
        setResponse("")
        setLoading(true)
        setShowResult(true)
        setRecentPrompt(input)
        const result = await getResponse(input)
        setResponse(result)
        setLoading(false)
        setInput('')
    }

    const contextValue = {
        input,
        setInput,
        onSent,
        recentPrompt,
        setRecentPrompt,
        showResult,
        loading,
        response
    }
    return (
        <GeminiContext.Provider value={contextValue}>
            {children}
        </GeminiContext.Provider>
    )
}

export default ContextProvider;