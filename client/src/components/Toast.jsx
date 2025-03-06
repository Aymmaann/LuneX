import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import assets from '../assets/assets'

const Toast = ({ isShown, message, type, onClose }) => {
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onClose()
        }, 3000)
        return () => clearTimeout(timeoutId)
    }, [onClose])

    return(
        <AnimatePresence>
            {isShown && (
                <motion.div
                    initial={{ opacity: 0, x: 50 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: 50 }} 
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="fixed top-20 right-6 min-w-52 bg-white border shadow-2xl rounded-md"
                >
                    <div className={`flex items-center gap-3 py-2 px-4 border-l-4 ${type === "error"? "border-l-red-500" : "border-l-green-500"}`}>
                        <div className={`w-10 h-10 flex items-center justify-center rounded-full ${type === 'error'? "bg-red-50" : "bg-green-50"}`}>
                            {type === "error" ? (
                                <assets.MdClose className="text-xl text-red-500" />
                            ) : (
                                <assets.LuCheck className="text-xl text-green-500" />
                            )}
                        </div>
                        <p className="text-sm text-slate-800 font-medium">{message}</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default Toast