'use client'

import React from "react"
import { useTranslations } from "next-intl"
import { IntDream } from "@/app/[locale]/dreamLibrary/page"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { MdDelete } from "react-icons/md";
import { useToast } from "@/hooks/use-toast"

interface DreamCardProps {
  dream: IntDream
}

const DreamCard: React.FC<DreamCardProps> = ({ dream }) => {
  const t = useTranslations()
  const router = useRouter()
  const { toast } = useToast();

  const deleteDream = async (slug: string) => {
    try {
      const response = await fetch("/api/deleteDream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug }), 
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete dream");
      }
  
      const res = await response.json();
      
      toast({
        title: t("dreamLibrary.deleteToast"),
        description: t("dreamLibrary.deleteDesc"),
      });
      console.log(res.message); 
      router.push("/dreamLibrary");
    } catch (error) {
      console.error("Error deleting dream:", error);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col w-full max-w-md bg-slate-800/50 hover:bg-transparent rounded-2xl p-6 gap-4 shadow-lg hover:shadow-2xl hover:shadow-neonPink cursor-pointer overflow-hidden"
    >
      <div className="text-center space-y-2">
        <div onClick={() => router.push(`/dreamLibrary/${dream.slug}`)} className="text-darkPink text-lg"> Dream Card Detail ✩₊˚.⋆☾⋆⁺₊✧

        </div>
        <h2 className="font-bold text-2xl text-white">
          {t("dreamLibrary.cardContent")}
        </h2>
      </div>

      <p className="text-gray-200 line-clamp-2">{dream.content}</p>

      <div className="space-y-3">
        <h3 className="font-semibold text-xl text-pink-300 border-b border-pink-500 pb-1">
          {t("dreamLibrary.cardKeywords")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {dream.keywords.map((k: string, index: number) => (
            <span
              key={index}
              className="bg-lightPink text-white rounded-full px-3 py-1 text-sm font-medium"
            >
              {k}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-xl text-pink-300 border-b border-pink-500 pb-1">
          {t("dreamLibrary.cardMood")}
        </h3>
        <p className="text-gray-200 mt-2 line-clamp-1">{dream.mood}</p>
      </div>

      <div>
        <h3 className="font-semibold text-xl text-pink-300 border-b border-pink-500 pb-1">
          {t("dreamLibrary.cardSymbols")}
        </h3>
        <div className="space-y-3 mt-2">
          {dream.symbols.map(
            (symbol: { symbol: string; meaning: string }, index: number) => (
              <div
                key={index}
                className="bg-black/30 rounded-xl p-4 hover:bg-opacity-80 transition-colors duration-300"
              >
                <h4 className="font-medium text-lightPink mb-2">{symbol.symbol}</h4>
                <div className="text-gray-300 line-clamp-2">
                  <span className="text-gray-100 block mb-1">✩ {t("dreamLibrary.cardMeanings")} ✩</span>
                  {symbol.meaning}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <div onClick={() => deleteDream(dream.slug)}  className="bg-white/20 hover:bg-white/40 rounded-full p-1 w-10 h-10 flex mt-auto justify-center items-center">
      <MdDelete className="text-xl text-pink-200"/>
      </div>
    </motion.div>
  )
}

export default DreamCard
