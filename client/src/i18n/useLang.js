import { useContext } from "react"
import { LanguageContext } from "./context"

export default function useLang() {
  return useContext(LanguageContext)
}
