
"use client";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";
import React, { useState, useEffect } from "react";
import { interpretDream } from "@/service/AiModal";
import { useToast } from "@/hooks/use-toast";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import slugify from "slugify";

function DreamForm() {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [dreamTxt, setDreamTxt] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      toast({
        title: t("dreamform.unauthorizedToast"),
        description: t("dreamform.pleaseLoginToast"),
        variant: "destructive",
      });
    }
  }, []);

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setKeywords(inputValue.split(",").map((keyword) => keyword.trim()));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!dreamTxt.trim() || keywords.length === 0) {
      toast({
        title: "Hata",
        description: "Lütfen rüyanızı ve en az bir anahtar kelime girin.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const interpretation = await interpretDream(dreamTxt, keywords, locale);
      const slug =
        slugify(dreamTxt.substring(0, 30), {
          lower: true,
          strict: true,
        }) +
        "-" +
        Date.now();

      const response = await fetch("/api/dreamApi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          slug,
          content: dreamTxt,
          keywords: keywords,
          interpretation: interpretation.generalInterpretation,
          mood: interpretation.mood,
          emotionalAnalysis: interpretation.emotionalAnalysis,
          practicalAdvice: interpretation.practicalAdvice,
          symbols: interpretation.symbols,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "the dream could not be recorded");
      }

      setDreamTxt("");
      setKeywords([]);

      toast({
        title: t("dreamform.sucesstoastTitle"),
        description: t("dreamform.sucesstoastDesc"),
      });

      router.push(`/dreamLibrary/${slug}`);
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: t("dreamform.errortoastTitle"),
        description: error.message || t("dreamform.sucesstoastDesc"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full  justify-center items-center flex p-10">
      <NeonGradientCard className="max-w-2xl  flex items-center justify-center text-center ">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 p-2 text-white font-semibold"
        >
          <span className=" text-slate-200 text-center font-semibold">
            {t("dreamform.dreamText")}
          </span>
          <textarea
            placeholder={t("dreamform.dreamTextPlacehld")}
            value={dreamTxt}
            onChange={(e) => setDreamTxt(e.target.value)}
            className="min-h-36 pl-2 bg-transparent rounded-lg shadow-pink-500 shadow-sm border-s-fuchsia-200 focus:border-pink-600 focus:border-2 outline-none"
          />

          <span className=" text-slate-200 text-center font-semibold">
            {t("dreamform.keywords")}
          </span>
          <input
            value={keywords.join(", ")}
            className="bg-transparent h-9 pl-2 rounded-lg shadow-pink-500 shadow-sm focus:border-pink-600 focus:border-2 outline-none"
            placeholder={t("dreamform.keywordsPlacehld")}
            onChange={handleKeywordsChange}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="text-white rounded-xl text-md font-semibold px-5 py-3 mt-6 text-center bg-transparent border-pink-500 border-t-2 shadow-md shadow-pink-500 hover:scale-105 hover:bg-neonPink duration-300 transition ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? t("dreamform.buttonLoading") : t("dreamform.button")}
          </button>
        </form>
      </NeonGradientCard>
    </div>
  );
}

export default DreamForm;

