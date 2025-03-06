import React, { useEffect } from "react";
import assets from '../assets/assets'

const Toast = ({ isShown, message, type, onClose }) => {
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onClose()
        }, 3000)
        return () => {
            clearTimeout(timeoutId)
        }
    }, [onClose])

    return(
        <div className={`absolute top-20 right-6 transition-all duration-400 ${isShown? "opacity-100" : "opacity-0"}`}>
            <div className={`min-w-52 bg-zinc-200 shadow-2xl rounded-md after:[w-5px] after:h-full 
                ${type === "error"? "after:bg-red-500": "after:bg-green-500"} 
                after:absolute after:left-0 after:top-0 after:rounded-l-lg`}> 

                <div className={`flex items-center gap-3 py-2 px-4 border-l-4 ${type === "error"? "border-l-red-500" : "border-l-green-500"}`}>
                    <div className={`w-10 h-10 flex items-center justify-center rounded-full ${type === 'error'? "bg-red-50" : "bg-green-50"}`}>
                        {type === "error" ? (
                            <assets.MdClose className="text-xl text-red-500" />
                        ) : (
                            <assets.LuCheck className="text-xl text-green-500" />
                        )}
                    </div>
                    <p className="text-sm text-slate-800 font-semibold">{message}</p>
                </div>
            </div>
        </div>
    )
}

export default Toast